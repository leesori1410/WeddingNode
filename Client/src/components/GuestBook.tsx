import { useState } from "react"
import type { GuestBookType } from "../types/Props"
import axios from "axios"

export default function GuestBook({id, image, name, message, getGuestbook}: GuestBookType & {
  getGuestbook: () => void
}) {
  const [showDel, setShowDel] = useState(false)

  const handleDelete = async() => {
    try {
      await axios.delete(`http://localhost:3000/api/guestbook/delete/${id}`)
      getGuestbook()
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <div className='guestbookItem' onMouseOver={() => setShowDel(true)} onMouseLeave={() => setShowDel(false)}>
      {showDel && <div className="deleteBack" onClick={handleDelete}>
        🗑️
      </div>}
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