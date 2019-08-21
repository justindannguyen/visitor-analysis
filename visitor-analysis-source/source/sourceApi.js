// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
var canvas = require('canvas')
var faceapi = require('face-api.js');

const detectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
const currentModel = faceapi.nets.ssdMobilenetv1
async function init() {
    // patch nodejs environment, we need to provide an implementation of
    // HTMLCanvasElement and HTMLImageElement, additionally an implementation
    // of ImageData is required, in case you want to use the MTCNN
    const { Canvas, Image, ImageData } = canvas
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

    require('@tensorflow/tfjs-node')

    await currentModel.loadFromDisk('./models')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models')
    await faceapi.nets.ageGenderNet.loadFromDisk('./models')
    await faceapi.nets.faceExpressionNet.loadFromDisk('./models')
}

async function detectAndAnalyzeInfo(picture) {
    if (!currentModel.isLoaded) {
        await init()
    }
    return faceapi.detectAllFaces(picture, detectionOptions).withFaceLandmarks()
        .withAgeAndGender().withFaceExpressions().withFaceDescriptors()
}

module.exports = {
    detectAndAnalyzeInfo
}