const express = require('express')
const cors = require('cors')
const path = require('path')

const qrcodeRouter = require('./routes/QRcodeRoutes')
const guestbookRouter = require('./routes/guestbookRoutes')

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/guestbook', guestbookRouter)
app.use('/api/qr', qrcodeRouter)

app.listen(3000, () => console.log('서버 시작 http://localhost:3000'))