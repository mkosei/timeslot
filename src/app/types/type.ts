export type Session = {
  user?: {
    name?: string
    email?: string
  }
}

export type BookingResponse = {
  id: number
  user_id: string
  title: string
  guest_name: string
  guest_email: string
  start: string
  end: string
  meet_url?: string
}

export type Event = {
  id: number
  user_id: string
  title: string
  guest_name: string
  guest_email: string
  start: string
  end: string
  date: string
  url?: string
}
