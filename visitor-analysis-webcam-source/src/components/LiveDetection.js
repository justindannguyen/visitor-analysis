import React, { Component } from 'react';
import './LiveDetection.css';
import * as faceapi from 'face-api.js';
import { endpointConfig } from './../config'
import { toBase64 } from './../utils/base64'

class LiveDetection extends Component {
  constructor(props) {
    super(props)
    this.lastTime = 0
  }

  componentDidMount() {
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    faceapi.nets.ageGenderNet.loadFromUri('/models')
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true, audio: false },
        stream => this.video.srcObject = stream,
        err => console.error(err)
      )
    }
  }

  setRefVideo = video => {
    this.video = video
  }

  onVideoPlayed = () => {
    const canvas = faceapi.createCanvasFromMedia(this.video)
    document.body.append(canvas)
    const displaySize = { width: this.video.width, height: this.video.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: .5 })
    this.intervalId = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(this.video, detectionOptions)
        .withFaceLandmarks()
        .withAgeAndGender()
        .withFaceExpressions()
      // Public detections every seconds
      const time = new Date().getTime()
      if (time - this.lastTime > 1000) {
        detections.map(face => this.toPayload(this.video, face)).forEach(this.publishPayload)
        this.lastTime = time
      }

      // Render detection
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      resizedDetections.forEach(result => {
        const { age, gender, genderProbability } = result
        const bottomLeft = result.detection.box.bottomLeft
        new faceapi.draw.DrawTextField(
          [
            `${faceapi.round(age, 0)} years`,
            `${gender} (${faceapi.round(genderProbability)})`
          ],
          new faceapi.Point(bottomLeft.x + result.detection.box.width / 2, bottomLeft.y)
        ).draw(canvas)
      })
      canvas.style = `top: ${this.video.offsetTop}px; left: ${this.video.offsetLeft}px`
    }, 100)
  }

  toPayload = (captureImage, faceObject) => {
    var payload = {}
    const expressions = faceObject.expressions
    const detection = faceObject.alignedRect || faceObject.detection
    const { x, y, width, height } = detection.box

    // Small image will impact to accuracy
    if (width < 100) {
      return null
    }
    payload.date = Date.now()
    payload.gender = faceObject.gender
    payload.genderProbability = faceObject.genderProbability
    payload.age = faceObject.age
    payload.faceBase64 = toBase64(captureImage, x, y, width, height)
    payload.faceScore = detection.score
    payload.expression = Object.entries(expressions)
      .reduce((expression, item) => expression[1] > item[1] ? expression : item, ['n/a', 0])[0]
    return payload
  }

  publishPayload = payload => {
    if (payload == null) {
      return;
    }
    fetch(`${endpointConfig.server}/api/v1/visitors/${this.id()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(console.log)
  }

  id = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  componentWillUnmount() {
    if (this.intervalId)
      clearInterval(this.intervalId)
  }

  render() {
    return (
      <div className="liveCam" >
        <video id="video"
          onPlay={this.onVideoPlayed}
          ref={this.setRefVideo}
          width="1440"
          height="1120"
          autoPlay muted />
      </div>
    );
  }
}

export default LiveDetection;