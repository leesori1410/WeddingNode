const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const multer = require('multer')
const uuid4 = require('uuid4')
const path = require('path')
const QRCode = require('qrcode')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'wedding_db',
})

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    const uploadPath = 'uploads/'
    done(null, uploadPath)
  },
  filename: (req, file, done) => {
    const ext = path.extname(file.originalname)
    const fileName = uuid4()
    done(null, fileName + ext)
  },
})

const upload = multer({ storage })

app.post('/api/upload', upload.single('file'), async(req, res) => {
  try {
    const filePath = req.file?.filename
    const { name, message } = req.body
    const conn = await pool.getConnection()
    await conn.query('INSERT INTO guestbooks (image, name, message) VALUES (?, ?, ?)', [filePath, name, message])
    conn.release()
    res.send({ message: '성공' })
  } catch (error) {
    console.error(error)
    res.status(500).send('서버 오류')
  }
})

app.get('/api/guestbook', async(req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query('SELECT * FROM guestbooks')
    conn.release()
    res.send({ message: '성공', data: rows })
  } catch (error) {
    console.error(error)
    res.status(500).send('서버 오류')
  }
})

app.get('/api/qr', (req, res) => {
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

app.listen(3000, () => console.log('서버 시작 http://localhost:3000'))