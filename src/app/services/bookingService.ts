import type { BookingResponse, BookingPayload } from "../types/type"

export async function fetchBookings(): Promise<BookingResponse[]> {
  const res = await fetch("http://localhost:8787/api/bookings", {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("予約取得失敗")
  }

  return res.json()
}


export async function createBooking(payload: BookingPayload) {
  const res = await fetch("http://localhost:8787/api/bookings", {
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

export async function updateBooking(id: number, payload: BookingPayload) {
  const res = await fetch(`http://localhost:8787/api/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("予約の更新に失敗しました")
  return res.json()
}

export async function deleteBooking(id: number) {
  const res = await fetch(`http://localhost:8787/api/bookings/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) throw new Error("予約の削除に失敗しました")
  return res.json()
}

