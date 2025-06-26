const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
const pool = require('./db')

const qrcodeRouter = require('./routes/QRcodeRoute')
const guestbookRouter = require('./routes/guestbookRoute')

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/guestbook', guestbookRouter)
app.use('/api/qr', qrcodeRouter)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async(socket) => {
  console.log('연결:', socket.id);
  try {
    const [rows] = await pool.query('SELECT * FROM chat')
    rows.forEach((m) => {
      console.log(m.message);
      socket.emit('chat message', m.message);
    });
  } catch (error) {
    console.log(error);
    socket.emit('가져오기 실패')
  }

  socket.on('chat message', async(message) => {
    try {
      await pool.query('INSERT INTO chat (message) VALUES (?)', [message])
      io.emit('chat message', message);
    } catch (error) {
      console.log(error);
      socket.emit('저장 실패')
    }
  });

  socket.on('disconnect', () => {
    console.log('연결 종료:', socket.id);
  });
});

server.listen(3000, () => console.log('서버 시작 http://localhost:3000'))