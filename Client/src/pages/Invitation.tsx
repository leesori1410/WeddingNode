import { useEffect, useState } from 'react'
import Wave from 'react-wavify'
import axios from 'axios'
import type { GuestBookType } from '../types/Props'
import Modal from './Modal'
import GuestBook from '../components/GuestBook'
import { useNavigate } from 'react-router-dom'

export default function Invitation() {
  const navigate = useNavigate()
  const [more, setMore] = useState(false)
  const [guest, setGuest] = useState<GuestBookType[]>([])

  const copy = (number: string) => {
    navigator.clipboard.writeText(number)
    alert('복사됨 '+number)
  }

  const getGuestbook = async() => {
    try {
      const res = await axios.get('http://localhost:3000/api/guestbook/all')
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
        <div className='floatBtn' onClick={() => navigate('/chat')}>
          💐
        </div>
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
          src='http://localhost:3000/api/qr/weddingHall'
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