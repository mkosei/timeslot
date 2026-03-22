import * as v from "valibot"
import { nanoid } from "nanoid"
import type { AppContext, BookingLink, BookingSlot} from "../types/type"
import dayjs from "dayjs"
import { getUserId } from "./bookingService"
import { bookingLinkSchema, createBookingFromLinkSchema } from "../lib/validator"

async function getBookingLink(c: AppContext, slug: string): Promise<BookingLink | null> {
  return c.env.DB
    .prepare(`
      SELECT user_id, duration, days_ahead, meet_url, title, start_time, end_time, is_used
      FROM booking_links WHERE slug = ?
    `)
    .bind(slug)
    .first<BookingLink>()
}

function generateSlots(link: BookingLink, booked: BookingSlot[], now: dayjs.Dayjs): BookingSlot[] {
  const { duration, days_ahead, start_time, end_time } = link
  const [startHour, startMin] = start_time.split(":").map(Number)
  const [endHour, endMin] = end_time.split(":").map(Number)
  const slots: BookingSlot[] = []

  for (let d = 0; d < days_ahead; d++) {
    const day = now.add(d, "day").startOf("day")
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


export const createBookingLink = async (c: AppContext) => {
  const userId = getUserId(c)
  if (!userId) return c.json({ error: "Unauthorized" }, 401)

  const result = v.safeParse(bookingLinkSchema, await c.req.json())
  if (!result.success) {
    return c.json({ error: v.flatten(result.issues) }, 400)
  }

  const { title, duration, meet_url, days_ahead, start_time, end_time } = result.output

  const slug = nanoid(10)
  
  await c.env.DB
    .prepare(`
      INSERT INTO booking_links
        (user_id, slug, duration, meet_url, days_ahead, title, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(userId, slug, duration, meet_url ?? null, days_ahead, title, start_time, end_time)
    .run()

  return c.json({ success: true, url: `/booking/${slug}`, slug }, 201)
}


export const getAvailability = async (c: AppContext) => {
  const slug = c.req.param("slug")
  if (!slug) return c.json({ error: "slug required" }, 400)

  const link = await getBookingLink(c, slug)
  if (!link) return c.json({ error: "link not found" }, 404)

  const now = dayjs()
  const endRange = now.add(link.days_ahead, "day")

  const { results } = await c.env.DB
    .prepare(`
      SELECT start, end FROM bookings
      WHERE user_id = ?
      AND start >= ?
      AND end <= ?
    `)
    .bind(link.user_id, now.toISOString(), endRange.toISOString())
    .all<BookingSlot>()

  const slots = generateSlots(link, results, now)

  return c.json({
    title: link.title ?? "Meeting",
    duration: link.duration,
    slots,
  })
}

export const createBookingFromLink = async (c: AppContext) => {
  const slug = c.req.param("slug")
  if (!slug) return c.json({ error: "slug required" }, 400)

  const parsed = v.safeParse(createBookingFromLinkSchema, await c.req.json())
  if (!parsed.success) {
    return c.json({ error: v.flatten(parsed.issues) }, 400)
  }

  const { start, end, guest_name, guest_email } = parsed.output

  const link = await getBookingLink(c, slug)
  if (!link) return c.json({ error: "link not found" }, 404)
  console.log("link.user_id:", link.user_id)
    
  if (link.is_used) return c.json({ error: "link already used" }, 410)

  if (dayjs(end).diff(dayjs(start), "minute") !== link.duration) {
    return c.json({ error: "invalid duration" }, 400)
  }

  const conflict = await c.env.DB
    .prepare(`
      SELECT id FROM bookings
      WHERE user_id = ? AND start < ? AND end > ?
      LIMIT 1
    `)
    .bind(link.user_id, end, start)
    .first()

  if (conflict) return c.json({ error: "time not available" }, 409)

  await c.env.DB.batch([
    c.env.DB.prepare(`
      INSERT INTO bookings (user_id, title, guest_name, guest_email, start, end, meet_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(link.user_id, link.title, guest_name, guest_email, start, end, link.meet_url ?? null),

    c.env.DB.prepare(`
      UPDATE booking_links SET is_used = 1 WHERE slug = ?
    `).bind(slug),
  ])

  return c.json({ success: true }, 201)
}