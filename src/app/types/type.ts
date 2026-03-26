export type UserInfo = {
  id: string
  name: string
  email: string
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


export type BookingPayload = {
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

export type FormState = {
  title: string
  guest_name: string
  guest_email: string
  date: string
  start: string
  end: string
  url: string
}

export type CreateLinkResponse = {
  slug: string
}

export type UpdateBookingInput = {
  id: number
  title: string
  guest_name: string
  guest_email: string
  start: string
  end: string
  meet_url: string
}


//link
export type BookingPageData = {
  title: string
  slots: {
    start: string
    end: string
  }[]
}

export type BookingLink = {
  user_id: string
  duration: number
  days_ahead: number
  meet_url: string | null
  title: string
  start_time: string
  end_time: string
  is_used: number
}

export type BookingSlot = {
  start: string
  end: string
}

export type CreateLinkInput = {
  title: string
  duration: number
  days_ahead: number
  start_time: string
  end_time: string
  meet_url: string | null
}

export type BookingFromLink = {
  title: string,
  start: string,
  end: string,
  guest_name: string,
  guest_email: string
}
