import { API_URL } from "@/app/lib/config"
import { BookingFromLink, CreateLinkResponse } from "@/app/types/type"
import { CreateLinkInput, BookingPageData } from "@/app/types/type"
import { headers } from "@/app/lib/config"

export async function getBookingSlots(slug: string) {
  const res = await fetch(`${API_URL}/api/bookings/links/${slug}`)
  if (!res.ok) throw new Error("スロット取得失敗")
  return res.json() as Promise<BookingPageData>
}

export async function createBookingLink(input: CreateLinkInput): Promise<CreateLinkResponse> {
  const res = await fetch(`${API_URL}/api/bookings/links`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("作成失敗")
  return await res.json()
}

export const createBookingFromLink = async (slug: string, payload: BookingFromLink) => {
  const res = await fetch(`${API_URL}/api/bookings/links/${slug}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("予約失敗")
  return res.json()
}