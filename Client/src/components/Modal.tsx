import axios from "axios"
import { useState } from "react"
import type { ModalProps } from "../types/Props"

export default function Modal({setMore, getGuestbook}:ModalProps){
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
      await axios.post('http://localhost:3000/api/guestbook/upload', formData)
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