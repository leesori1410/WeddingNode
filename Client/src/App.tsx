import { useEffect, useState } from 'react'
import './App.css'
import Wave from 'react-wavify'
import axios from 'axios'
// import '/weddingNode/Server/uploads/'

interface GuestBookType {
  image: string
  name: string
  message: string
}

function GuestBook({image, name, message}: GuestBookType) {
  return(
    <div className='guestbookItem'>
      {image && (
        <div
          style={{backgroundImage: `url('http://localhost:3000/uploads/${image}')`}}
          className='guestbookImg'
        />
      )}
      <div className='message' style={{ WebkitLineClamp: image? 5 : 12 }}>
        {message}
      </div>
      <div className='guestbookName'>- {name} -</div>
    </div>
  )
}

interface ModalProps {
  setMore: (val:boolean) => void
  getGuestbook: () => Promise<void>
}

function Modal({setMore, getGuestbook}:ModalProps){
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const postGuestbook = async() => {
    try {
      const formData = new FormData()
      if (selectedFile) formData.append('file', selectedFile)
      formData.append('name', name)
      formData.append('message', message)
      await axios.post('http://localhost:3000/api/upload', formData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async() => {
    if(name.trim() === '' || message.trim() === '') return
    await postGuestbook()
    await getGuestbook()
    setMore(false)
  }

  return (
    <div className='modalContainer'>
      <div className='modal'>
        {preview? (
          <img src={preview} alt="미리보기" className='preview'/>
        ) : (
          <>
          <label htmlFor="fileUpload" className='inputContainer'/>
          <input 
            id="fileUpload"
            type="file"
            accept="image/*"
            className='fileInput'
            onChange={handleFileChange}
          />
          </>
        )}
        <input 
          className='textarea'
          style={{minHeight: '20px'}}
          placeholder='닉네임을 입력하세요'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea 
          className="textarea" 
          placeholder="메시지를 입력하세요" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className='btnContainer'>
          <div onClick={() => setMore(false)}>취소하기</div>
          <div onClick={handleSubmit}>추가하기</div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [more, setMore] = useState(false)
  const [guest, setGuest] = useState<GuestBookType[]>([])
  const [QR, setQR] = useState(null)

  const copy = (number: string) => {
    navigator.clipboard.writeText(number)
    alert('복사됨 '+number)
  }

  const getGuestbook = async() => {
    try {
      const res = await axios.get('http://localhost:3000/api/guestbook')
      const data = res.data.data
      setGuest(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGuestbook()
  }, [])

  return (
    <div className='background'>
      {more && (
        <Modal setMore={setMore} getGuestbook={getGuestbook} />
      )}
      <div className='container'>
        <div className='header'>
          <img 
            src='/marry.jpg'
            alt='결혼사진'
            className='headerImg'
          />
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
          <Wave fill='url(#gradient)'
            paused={false}
            className='wave'
            options={{
              height: 20,
              amplitude: 35,
              speed: 0.2,
              points: 2
            }}
          />
          <Wave fill='rgba(255, 255, 255, 50%)'
            paused={false}
            className='wave'
            options={{
              height: 20,
              amplitude: 35,
              speed: 0.25,
              points: 2
            }}
          />
          <Wave fill='rgba(255, 255, 255, 70%)'
            paused={false}
            className='wave'
            options={{
              height: 20,
              amplitude: 35,
              speed: 0.3,
              points: 2
            }}
          />
        </div>
        <p className='title'>신랑 ∙ 신부</p>
        <div className='detail'>
          2025년 5월 26일 월요일, 낮 12시<br/>
          그랜드힐 컨벤션 3층 웨딩홀
        </div>
        <p className='subTitle'>I N V I T A T I O N</p>
        <p className='title'>소중한 분들을 초대합니다</p>
        <div className='detail'>
          저희 두 사람의 작은 만남이<br/>
          사랑의 결실을 이루어<br/>
          소중한 결혼식을 올리게 되었습니다.<br/>
          <br/>
          평생 서로 귀하게 여기며<br/>
          첫 마음 그대로 존중하고 배려하며 살겠습니다.<br/>
          <br/>
          오로지 믿음과 사랑을 약속하는 날<br/>
          오셔서 축복해 주시면 더 없는 기쁨으로<br/>
          간직하겠습니다.<br/>
        </div>
        <img 
          src='/marry.jpg'
          alt='결혼사진'
          className='weddingImg'
        />
        <img 
          src='http://localhost:3000/api/qr'
          alt='QR'
        />
        <p className='subTitle'>G U E S T B O O K</p>
        <p className='title'>방명록</p>
        <div className='guestbookContainer'>
          {guest.length > 0 ? (
            guest.map((g, i) => (
              <GuestBook key={i} image={g.image} name={g.name} message={g.message} />
            ))
          ) : (
            <p>등록된 방명록이 없습니다.</p>
          )}
        </div>
        <p className='writeBtn' onClick={() => setMore(true)}>작성하기</p>
        <p className='subTitle'>A C C O U N T</p>
        <p className='title'>마음 전하실 곳</p>
        <div className='bankContainer'>
          <div className='bankBox' onClick={() => copy('333-3333-3333')}>
            신랑측
            <div className='line'/>
            카카오페이 333-3333-3333
          </div>
          <div className='bankBox' onClick={() => copy('333-3333-3333')}>
            신부측
            <div className='line'/>
            카카오페이 333-3333-3333
          </div>
        </div>
        <div className='footer'>
          <div className='blur' />
          <div className='poem'>
            장담하건대, 세상이 다 겨울이어도<br/>
            우리 사랑은 늘 봄처럼 따뜻하고<br/>
            간혹, 여름처럼 뜨거울 겁니다.<br/>
            - 이수동, 사랑가 -
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
