const express = require('express')
const QRCode = require('qrcode')

const qrcodeRouter = express.Router()

qrcodeRouter.get('/weddingHall', (req, res) => {
  try {
    const address = 'https://www.grandhill.co.kr/location'
    QRCode.toDataURL(address, (err, url) => {
      const data = url.replace(/.*,/, "")
      const img = new Buffer.from(data, "base64")
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": img.length
      })
      res.end(img)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('서버 오류')
  }
})

module.exports = qrcodeRouter