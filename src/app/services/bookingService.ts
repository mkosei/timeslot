import type { BookingResponse, BookingPayload, UpdateBookingInput } from "../types/type"
import { API_URL } from "@/app/lib/config"
import { headers } from "@/app/lib/config"


export async function fetchBookings(): Promise<BookingResponse[]> {
  const res = await fetch(`${API_URL}/api/bookings`)
  if (!res.ok) throw new Error("予約取得失敗")
  return res.json()
}

export async function createBooking(payload: BookingPayload) {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("予約に失敗しました")
  return res.json()
}

export async function updateBooking(data: UpdateBookingInput) {
  const res = await fetch(`${API_URL}/api/bookings/${data.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      title: data.title,
      guest_name: data.guest_name,
      guest_email: data.guest_email,
      start: data.start,
      end: data.end,
      meet_url: data.meet_url,
    }),
  })
  if (!res.ok) throw new Error("更新失敗")
  return await res.json().catch(() => null)
}

export async function deleteBooking(id: number) {
  const res = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("予約の削除に失敗しました")
  return res.json()
}