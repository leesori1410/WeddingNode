import type { GuestBookType } from "../types/Props"

export default function GuestBook({image, name, message}: GuestBookType) {
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