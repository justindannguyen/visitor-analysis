// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
var canvas = require('canvas')
var faceapi = require('face-api.js');

const currentModel = faceapi.nets.ssdMobilenetv1
const detectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
let faceMatcher
let labelDescriptors
let modelReady = false

async function init() {
    const referenceImage = await canvas.loadImage('http://192.168.1.11:51200/static/media/mr.tuan.dda953dd.jpg')
    
    // patch nodejs environment, we need to provide an implementation of
    // HTMLCanvasElement and HTMLImageElement, additionally an implementation
    // of ImageData is required, in case you want to use the MTCNN
    const { Canvas, Image, ImageData } = canvas
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

    require('@tensorflow/tfjs-node')

    await currentModel.loadFromDisk('./models')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./models')
    
    const ref = await faceapi.detectSingleFace(referenceImage, detectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptor()
    labelDescriptors = [
        new faceapi.LabeledFaceDescriptors('Tuan', [ref.descriptor])
    ]
    
    faceMatcher = new faceapi.FaceMatcher(labelDescriptors, 0.5)
    modelReady = true
    // TODO load label from db
}

async function recognizeFace(id, picture) {
    if (!modelReady) {
        await init()
    }

    const query = await faceapi.computeFaceDescriptor(picture)
    const bestMatch = faceMatcher.findBestMatch(query)
    const { label }  = bestMatch
    let faceName = label
    if (label === 'unknown') {
        faceName += id
        labelDescriptors.push(new faceapi.LabeledFaceDescriptors(faceName, [query]))
        faceMatcher = new faceapi.FaceMatcher(labelDescriptors, 0.5)
    }
    return faceName
}

module.exports = {
    recognizeFace
}