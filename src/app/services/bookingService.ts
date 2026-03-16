import type { BookingResponse } from "../types/type"

export async function fetchBookings(): Promise<BookingResponse[]> {
  const res = await fetch("http://localhost:8787/api/bookings", {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("予約取得失敗")
  }

  return res.json()
}


export async function createBooking(data: {
  title: string
  guest_name: string
  guest_email: string
  start: string
  end: string
  meet_url?: string
}) {
  const res = await fetch("http://localhost:8787/api/bookings", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("予約に失敗しました")
  }

  return res.json()
}