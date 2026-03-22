import type { BookingResponse, BookingPayload, UpdateBookingInput } from "../types/type"
import { API_URL } from "../lib/config"
import { getAuthHeaders } from "../lib/auth-headers"
import { Session } from "next-auth"

export async function fetchBookings(session: Session | null): Promise<BookingResponse[]> {
  console.log("fetchBookings called, session:", session?.user?.id)
  const res = await fetch(`${API_URL}/api/bookings`, {
    headers: getAuthHeaders(session),
  })
  if (!res.ok) throw new Error("予約取得失敗")
  return res.json()
}

export async function createBooking(session: Session | null, payload: BookingPayload) {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: getAuthHeaders(session),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("予約に失敗しました")
  return res.json()
}

export async function updateBooking(session: Session | null, data: UpdateBookingInput) {
  const res = await fetch(`${API_URL}/api/bookings/${data.id}`, {
    method: "PUT",
    headers: getAuthHeaders(session),
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

export async function deleteBooking(session: Session | null, id: number) {
  const res = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(session),
  })
  if (!res.ok) throw new Error("予約の削除に失敗しました")
  return res.json()
}