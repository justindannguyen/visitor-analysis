export function toBase64(image, sx, sy, w, h) {
  //var faceCanvas = faceapi.createCanvas(w, h)
  var faceCanvas = document.createElement('canvas');
  faceCanvas.width  = w;
  faceCanvas.height = h;
  var ctx = faceCanvas.getContext('2d')
  ctx.drawImage(image, sx, sy, w, h, 0, 0, w, h)
  return faceCanvas.toDataURL()
}