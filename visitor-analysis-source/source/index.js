var detector = require('./sourceApi.js')
var publisher = require('./kafkaPublisher.js')
var base64 = require('../utils/base64.js')
var canvas = require('canvas')

const delay = 500
const cameraUrl = process.env.CAMERA
if (cameraUrl == null) {
    console.log('CAMERA is not configured')
    process.exit()
}

setTimeout(run, delay);
async function run() {
    // Make a request for a user with a given ID
    try {
        const capturedImage = await canvas.loadImage(cameraUrl);
        const facesMeta = await detector.detectAndAnalyzeInfo(capturedImage)
        publisher.publish(facesMeta.map(face => toPayload(capturedImage, face)).filter(face => face != null))
    }
    catch (err) {
        error(err, 'Can not detect faces information')
    }
    setTimeout(run, delay);
}


function error(err, msg) {
    console.log(`${msg}, detail error : ${err}`)
}

function toPayload(captureImage, faceObject) {
    var payload = {}
    const expressions = faceObject.expressions
    const detection = faceObject.alignedRect || faceObject.detection
    const { x, y, width, height } = detection.box

    // Small image will impact to accuracy
    if (width < 160) {
        return null
    }    
    payload.date = Date.now()
    payload.gender = faceObject.gender
    payload.genderProbability = faceObject.genderProbability
    payload.age = faceObject.age
    payload.faceBase64 = base64.toBase64(captureImage, x, y, width, height)
    payload.faceScore = detection.score
    payload.expression = Object.entries(expressions)
        .reduce((expression, item) => expression[1] > item[1] ? expression : item, ['n/a', 0])[0]
    return payload
}

