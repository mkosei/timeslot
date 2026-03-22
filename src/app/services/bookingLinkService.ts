import { API_URL } from "@/app/lib/config"
import { BookingFromLink, CreateLinkResponse } from "@/app/types/type"
import { CreateLinkInput, BookingPageData } from "@/app/types/type"
import { getAuthHeaders } from "@/app/lib/auth-headers"
import { Session } from "next-auth"

export async function getBookingSlots(slug: string) {
  const res = await fetch(`${API_URL}/api/bookings/${slug}`)
  if (!res.ok) throw new Error("スロット取得失敗")
  return res.json() as Promise<BookingPageData>
}

export async function createBookingLink(session: Session | null, input: CreateLinkInput): Promise<CreateLinkResponse> {
  const res = await fetch(`${API_URL}/api/bookings/links`, {
    method: "POST",
    headers: getAuthHeaders(session),
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("作成失敗")
  return await res.json()
}

export const createBookingFromLink = async (slug: string, payload: BookingFromLink) => {
  const res = await fetch(`${API_URL}/api/bookings/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("予約失敗")
  return res.json()
}