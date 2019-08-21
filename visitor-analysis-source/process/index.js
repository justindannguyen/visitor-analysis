const TOPIC = 'visitor_faces'
const OUT_TOPIC = 'visitor_analysis_info'

var processApi = require('./processApi.js')
var base64 = require('./../utils/base64')
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.KafkaClient({ kafkaHost: '192.168.1.11:9092' }),
    consumer = new Consumer(
        client,
        [{ topic: TOPIC }],
        {
            groupId: 'visitor-face-recogition-group',
            encoding: 'utf8',
            keyEncoding: 'utf8',
            fromOffset: true
        }
    ),
    producer = new Producer(client);

let producerReady = false
producer.on('ready', function () {
    producerReady = true
    console.log("Publisher ready")
});

producer.on('error', (error) => {
    producerReady = false
    console.log('KafkaClient is not ready, error: ' + error)
})


function publish(key, payload) {
    if (!producerReady) {
        console.log('Publisher is not ready yet')
        return
    }
    const messages = [new KeyedMessage(key, JSON.stringify(payload))]
    producer.send([{ topic: OUT_TOPIC, messages }], publishCallback)
    console.log(`Published ${key}`)
}

consumer.on('message', function (message) {
    const msgValue = message.value || '{}'
    const faceInfo = JSON.parse(msgValue)
    if (!faceInfo.faceBase64) {
        console.log('Invalid kafka messages, having no faces')
        return
    }

    base64.toImage(faceInfo.faceBase64)
        .then(facePicture => processApi.recognizeFace(message.key, facePicture))
        .then(faceName => Object.assign({ faceName }, faceInfo))
        .then(payload => publish(payload.faceName, payload))
        .catch(error => console.log('Can not recognize faces ' + error))
})

function publishCallback(error, data) {
    if (error) {
        console.log(`Published with error ${error}`)
    }
}