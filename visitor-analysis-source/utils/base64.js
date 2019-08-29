var canvas = require('canvas')

function toBase64(image, sx, sy, w, h) {
  var faceCanvas = canvas.createCanvas(w, h)
  var ctx = faceCanvas.getContext('2d')
  ctx.drawImage(image, sx, sy, w, h, 0, 0, w, h)
  return faceCanvas.toDataURL()
}

function toImage(base64Str) {
  return canvas.loadImage(base64Str)
}

module.exports = { toBase64, toImage }