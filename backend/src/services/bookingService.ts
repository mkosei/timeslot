import * as v from "valibot"
import type { AppContext } from "../types/type"
import { bookingSchema } from "../lib/validator"

export function getUserId(c: AppContext): string | null {
  return c.get("authUser")?.token?.sub ?? null
}

export const fetchBookings = async (c: AppContext) => {
  const userId = getUserId(c)
  if (!userId) return c.json({ error: "Unauthorized" }, 401)

  const { results } = await c.env.DB
    .prepare(`
      SELECT id, user_id, title, guest_name, guest_email, start, end, meet_url
      FROM bookings
      WHERE user_id = ?
    `)
    .bind(userId)
    .all()

  return c.json(results)
}

export const createBooking = async (c: AppContext) => {
  const userId = getUserId(c)
  if (!userId) return c.json({ error: "Unauthorized" }, 401)

  const parsed = v.safeParse(bookingSchema, await c.req.json())

  if (!parsed.success) {
    return c.json({ error: v.flatten(parsed.issues) }, 400)
  }

  const { title, guest_name, guest_email, start, end, meet_url } = parsed.output

  const result = await c.env.DB
    .prepare(`
      INSERT INTO bookings (user_id, title, guest_name, guest_email, start, end, meet_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(userId, title, guest_name ?? null, guest_email ?? null, start, end, meet_url ?? null)
    .run()

  return c.json({
    id: result.meta.last_row_id,
    user_id: userId,
    title,
    guest_name,
    guest_email,
    start,
    end,
    meet_url: meet_url ?? null,
  }, 201)
}

export const updateBooking = async (c: AppContext) => {
  const userId = getUserId(c)
  if (!userId) return c.json({ error: "Unauthorized" }, 401)

  const id = c.req.param("id")

  const parsed = v.safeParse(bookingSchema, await c.req.json())
  if (!parsed.success) {
    return c.json({ error: v.flatten(parsed.issues) }, 400)
  }

  const { title, guest_name, guest_email, start, end, meet_url } = parsed.output

  const existing = await c.env.DB
    .prepare("SELECT id FROM bookings WHERE id = ? AND user_id = ?")
    .bind(id, userId)
    .first()

  if (!existing) return c.json({ error: "Not found" }, 404)

  await c.env.DB
    .prepare(`
      UPDATE bookings
      SET title = ?, guest_name = ?, guest_email = ?, start = ?, end = ?, meet_url = ?
      WHERE id = ? AND user_id = ?
    `)
    .bind(title, guest_name ?? null, guest_email ?? null, start, end, meet_url ?? null, id, userId)
    .run()

  return c.json({ success: true })
}

export const deleteBooking = async (c: AppContext) => {
  const userId = getUserId(c)
  if (!userId) return c.json({ error: "Unauthorized" }, 401)

  const id = c.req.param("id")

  const existing = await c.env.DB
    .prepare("SELECT id FROM bookings WHERE id = ? AND user_id = ?")
    .bind(id, userId)
    .first()

  if (!existing) return c.json({ error: "Not found" }, 404)

  await c.env.DB
    .prepare("DELETE FROM bookings WHERE id = ? AND user_id = ?")
    .bind(id, userId)
    .run()

  return c.json({ success: true })
}