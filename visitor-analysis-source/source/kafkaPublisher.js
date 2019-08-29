const kafkaHost = process.env.KAFKA_HOST || '192.168.1.11:9092'
const kafkaTopic = process.env.TOPIC || 'visitor_faces'

var kafka = require('kafka-node'),
  Producer = kafka.Producer,
  KeyedMessage = kafka.KeyedMessage,
  client = new kafka.KafkaClient({ kafkaHost }),
  producer = new Producer(client);

let ready = false;

producer.on('ready', function () {
  ready = true
  console.log("Publisher ready")
});


producer.on('error', (error) => {
  ready = false
  console.log('KafkaClient is not ready, error: ' + error)
})


function publish(payloads) {
  if (!ready) {
    console.log('Publisher is not ready yet')
  } else if (payloads.length > 0) {
    const messages = payloads.map(payload => new KeyedMessage(id(), JSON.stringify(payload)))
    producer.send([{ topic: kafkaTopic, messages }], publishCallback)
    console.log(`Published ${messages.length} items`)
  }
}

function publishCallback(error, data) {
  if (error) {
    console.log(`Published with error ${error}`)
  }
}

function id() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = {
  publish
}