var detector = require('./sourceApi.js')
var publisher = require('../utils/kafkaPublisher.js')
var base64 = require('../utils/base64.js')
var canvas = require('canvas')

const delay = 500

setTimeout(run, delay);
async function run() {
    // Make a request for a user with a given ID
    try {
        const capturedImage = await canvas.loadImage('http://service:smartcity123@192.168.1.50/snap.jpg?JpegSize=XL');
        const facesMeta = await detector.detectAndAnalyzeInfo(capturedImage)
        console.log(facesMeta)
        publisher.publish(facesMeta.map(face => toPayload(capturedImage, face)))
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

