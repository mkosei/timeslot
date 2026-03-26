import { db } from "@/app/lib/db"
import * as v from "valibot"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { createBookingFromLinkSchema } from "@/app/lib/validators/api"
import type { BookingLink, BookingSlot } from "@/app/types/type"

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = "Asia/Tokyo"



function generateSlots(link: BookingLink, booked: BookingSlot[], now: dayjs.Dayjs): BookingSlot[] {
  const { duration, days_ahead, start_time, end_time } = link
  const [startHour, startMin] = start_time.split(":").map(Number)
  const [endHour, endMin] = end_time.split(":").map(Number)
  const slots: BookingSlot[] = []

  for (let d = 0; d < days_ahead; d++) {
    const day = dayjs().tz(TIMEZONE).add(d, "day").startOf("day")
    let current = day.hour(startHour).minute(startMin)
    const dayEnd = day.hour(endHour).minute(endMin)

    while (current.add(duration, "minute").isBefore(dayEnd) ||
           current.add(duration, "minute").isSame(dayEnd)) {
      const slotEnd = current.add(duration, "minute")
      const hasConflict = booked.some((e) =>
        current.isBefore(dayjs(e.end)) && slotEnd.isAfter(dayjs(e.start))
      )
      if (!hasConflict) {
        slots.push({ start: current.toISOString(), end: slotEnd.toISOString() })
      }
      current = slotEnd
    }
  }

  return slots
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const linkResult = await db.execute({
    sql: `SELECT user_id, duration, days_ahead, meet_url, title, start_time, end_time, is_used
          FROM booking_links WHERE slug = ?`,
    args: [slug]
  })

  if (!linkResult.rows.length) return Response.json({ error: "link not found" }, { status: 404 })
  const link = linkResult.rows[0] as unknown as BookingLink

  const now = dayjs().tz(TIMEZONE)
  const endRange = now.add(link.days_ahead, "day")

  const bookedResult = await db.execute({
    sql: `SELECT start, end FROM bookings
          WHERE user_id = ? AND start < ? AND end > ?`,
    args: [link.user_id, endRange.toISOString(), now.toISOString()]
  })

  const booked = bookedResult.rows as unknown as BookingSlot[]
  const slots = generateSlots(link, booked, now)

  return Response.json({
    title: link.title ?? "Meeting",
    duration: link.duration,
    slots,
  })
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const parsed = v.safeParse(createBookingFromLinkSchema, await req.json())
  if (!parsed.success) return Response.json({ error: v.flatten(parsed.issues) }, { status: 400 })

  const { start, end, guest_name, guest_email } = parsed.output

  const linkResult = await db.execute({
    sql: `SELECT user_id, duration, days_ahead, meet_url, title, start_time, end_time, is_used
          FROM booking_links WHERE slug = ?`,
    args: [slug]
  })

  if (!linkResult.rows.length) return Response.json({ error: "link not found" }, { status: 404 })
  const link = linkResult.rows[0] as unknown as BookingLink

  if (link.is_used) return Response.json({ error: "link already used" }, { status: 410 })

  if (dayjs(end).diff(dayjs(start), "minute") !== link.duration) {
    return Response.json({ error: "invalid duration" }, { status: 400 })
  }

  const conflict = await db.execute({
    sql: `SELECT id FROM bookings WHERE user_id = ? AND start < ? AND end > ? LIMIT 1`,
    args: [link.user_id, end, start]
  })

  if (conflict.rows.length) return Response.json({ error: "time not available" }, { status: 409 })

    await db.batch([
    {
        sql: `INSERT INTO bookings (user_id, title, guest_name, guest_email, start, end, meet_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [link.user_id, link.title, guest_name, guest_email, start, end, link.meet_url ?? null] as (string | null)[]
    },
    {
        sql: `UPDATE booking_links SET is_used = 1 WHERE slug = ?`,
        args: [slug] as (string | null)[]
    }
    ])

  return Response.json({ success: true }, { status: 201 })
}