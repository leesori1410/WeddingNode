import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export default function Chat() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<string[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io('http://localhost:3000')

    socketRef.current.on('chat message', (m) => {
      setChat((pre) => [...pre, m])
    })

    return () => {
      socketRef.current?.off('chat message')
    }
  }, [])

  const sendMessage = () => {
    if(message.trim() === '') return

    socketRef.current?.emit('chat message', message)
    setMessage('')
  }

  return (
    <div className="background">
      <div className="container">
        <div className='chatContainer'>
          {chat.map((msg, i) => (
            <div key={i} className='chat'>{msg}</div>
          ))}
        </div>
        <div className='chatInputContainer'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className='chatInput'
          />
          <button className='chatBtn' onClick={sendMessage}>↗</button>
        </div>
      </div>
    </div>
  )
}