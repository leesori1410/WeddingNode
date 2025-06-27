export interface ModalProps {
  setMore: (val:boolean) => void
  getGuestbook: () => Promise<void>
}

export interface GuestBookType {
  id: number
  image: string
  name: string
  message: string
}