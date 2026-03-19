import type { BookingResponse, BookingPayload, UpdateBookingInput } from "../types/type"
import { API_URL, APP_URL } from "../lib/config"

export async function fetchBookings(): Promise<BookingResponse[]> {
  const res = await fetch(`${API_URL}/api/bookings`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("予約取得失敗")
  }

  return res.json()
}


export async function createBooking(payload: BookingPayload) {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("予約に失敗しました")
  }

  return res.json()
}

export async function updateBooking(data: UpdateBookingInput) {
  const res = await fetch(`${API_URL}/api/bookings/${data.id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: data.title,
      guest_name: data.guest_name,
      guest_email: data.guest_email,
      start: data.start,
      end: data.end,
      meet_url: data.meet_url
    })
  })

  if (!res.ok) {
    throw new Error("更新失敗")
  }

  return await res.json().catch(() => null)
}

export async function deleteBooking(id: number) {
  const res = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) throw new Error("予約の削除に失敗しました")
  return res.json()
}

