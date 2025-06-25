const express = require('express')
const multer = require('multer')
const uuid4 = require('uuid4')
const path = require('path')
const pool = require('../db')

const guestbookRouter = express.Router()

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

guestbookRouter.post('/upload', upload.single('file'), async(req, res) => {
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

guestbookRouter.get('/all', async(req, res) => {
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

module.exports = guestbookRouter