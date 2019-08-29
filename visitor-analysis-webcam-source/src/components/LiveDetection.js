import React, { Component } from 'react';
import './LiveDetection.css';
import * as faceapi from 'face-api.js';

class LiveDetection extends Component {
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
      // Public detections

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
    }, 100)
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
          width="720"
          height="560"
          autoPlay muted />
      </div>
    );
  }
}

export default LiveDetection;