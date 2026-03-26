import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { auth } from '@/app/auth'
import { db } from '@/app/lib/db'
import * as v from 'valibot'
import { nanoid } from 'nanoid'
import { bookingSchema, bookingLinkSchema, createBookingFromLinkSchema } from '@/app/lib/validators/api'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Tokyo'

type Variables = {
  userId: string
}

const app = new Hono<{ Variables: Variables }>().basePath('/api')

app.use('/*', async (c, next) => {
  const path = c.req.path
  if (path.match(/^\/api\/bookings\/(?!links)[^/]+$/) &&
    (c.req.method === 'GET' || c.req.method === 'POST')) {
    await next()
    return
  }
  const session = await auth()
  if (!session?.user?.id) return c.json({ error: 'Unauthorized' }, 401)
  c.set('userId', session.user.id)
  await next()
})

// GET /api/bookings
app.get('/bookings', async (c) => {
  const userId = c.get('userId')
  const { rows } = await db.execute({
    sql: `SELECT id, user_id, title, guest_name, guest_email, start, end, meet_url
          FROM bookings WHERE user_id = ?`,
    args: [userId]
  })
  return c.json(rows)
})

// POST /api/bookings
app.post('/bookings', async (c) => {
  const userId = c.get('userId')
  const parsed = v.safeParse(bookingSchema, await c.req.json())
  if (!parsed.success) return c.json({ error: v.flatten(parsed.issues) }, 400)

  const { title, guest_name, guest_email, start, end, meet_url } = parsed.output
  const result = await db.execute({
    sql: `INSERT INTO bookings (user_id, title, guest_name, guest_email, start, end, meet_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [userId, title, guest_name ?? null, guest_email ?? null, start, end, meet_url ?? null]
  })

    return c.json({
    id: Number(result.lastInsertRowid),
    user_id: userId,
    title,
    guest_name,
    guest_email,
    start,
    end,
    meet_url: meet_url ?? null,
    }, 201)
})

// PUT /api/bookings/:id
app.put('/bookings/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const parsed = v.safeParse(bookingSchema, await c.req.json())
  if (!parsed.success) return c.json({ error: v.flatten(parsed.issues) }, 400)

  const { title, guest_name, guest_email, start, end, meet_url } = parsed.output
  const existing = await db.execute({
    sql: 'SELECT id FROM bookings WHERE id = ? AND user_id = ?',
    args: [id, userId]
  })
  if (!existing.rows.length) return c.json({ error: 'Not found' }, 404)

  await db.execute({
    sql: `UPDATE bookings SET title = ?, guest_name = ?, guest_email = ?, start = ?, end = ?, meet_url = ?
          WHERE id = ? AND user_id = ?`,
    args: [title, guest_name ?? null, guest_email ?? null, start, end, meet_url ?? null, id, userId]
  })
  return c.json({ success: true })
})

// DELETE /api/bookings/:id
app.delete('/bookings/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const existing = await db.execute({
    sql: 'SELECT id FROM bookings WHERE id = ? AND user_id = ?',
    args: [id, userId]
  })
  if (!existing.rows.length) return c.json({ error: 'Not found' }, 404)

  await db.execute({
    sql: 'DELETE FROM bookings WHERE id = ? AND user_id = ?',
    args: [id, userId]
  })
  return c.json({ success: true })
})

// POST /api/bookings/links
app.post('/bookings/links', async (c) => {
  const userId = c.get('userId')
  const parsed = v.safeParse(bookingLinkSchema, await c.req.json())
  if (!parsed.success) return c.json({ error: v.flatten(parsed.issues) }, 400)

  const { title, duration, meet_url, days_ahead, start_time, end_time } = parsed.output
  const slug = nanoid(10)

  await db.execute({
    sql: `INSERT INTO booking_links (user_id, slug, duration, meet_url, days_ahead, title, start_time, end_time)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [userId, slug, duration, meet_url ?? null, days_ahead, title, start_time, end_time]
  })
  return c.json({ success: true, url: `/booking/${slug}`, slug }, 201)
})

// GET /api/bookings/:slug
app.get('/bookings/:slug', async (c) => {
  const slug = c.req.param('slug')
  const linkResult = await db.execute({
    sql: `SELECT user_id, duration, days_ahead, meet_url, title, start_time, end_time, is_used
          FROM booking_links WHERE slug = ?`,
    args: [slug]
  })
  if (!linkResult.rows.length) return c.json({ error: 'link not found' }, 404)

  const link = linkResult.rows[0] as any
  const now = dayjs().tz(TIMEZONE)
  const endRange = now.add(link.days_ahead, 'day')

  const bookedResult = await db.execute({
    sql: `SELECT start, end FROM bookings WHERE user_id = ? AND start < ? AND end > ?`,
    args: [link.user_id, endRange.toISOString(), now.toISOString()]
  })

  const booked = bookedResult.rows as any[]
  const [startHour, startMin] = (link.start_time as string).split(':').map(Number)
  const [endHour, endMin] = (link.end_time as string).split(':').map(Number)
  const slots = []

  for (let d = 0; d < link.days_ahead; d++) {
    const day = dayjs().tz(TIMEZONE).add(d, 'day').startOf('day')
    let current = day.hour(startHour).minute(startMin)
    const dayEnd = day.hour(endHour).minute(endMin)

    while (current.add(link.duration, 'minute').isBefore(dayEnd) ||
      current.add(link.duration, 'minute').isSame(dayEnd)) {
      const slotEnd = current.add(link.duration, 'minute')
      const hasConflict = booked.some((e) =>
        current.isBefore(dayjs(e.end as string)) && slotEnd.isAfter(dayjs(e.start as string))
      )
      if (!hasConflict) {
        slots.push({ start: current.toISOString(), end: slotEnd.toISOString() })
      }
      current = slotEnd
    }
  }

  return c.json({ title: link.title ?? 'Meeting', duration: link.duration, slots })
})

// POST /api/bookings/:slug
app.post('/bookings/:slug', async (c) => {
  const slug = c.req.param('slug')
  const parsed = v.safeParse(createBookingFromLinkSchema, await c.req.json())
  if (!parsed.success) return c.json({ error: v.flatten(parsed.issues) }, 400)

  const { start, end, guest_name, guest_email } = parsed.output
  const linkResult = await db.execute({
    sql: `SELECT user_id, duration, meet_url, title, is_used FROM booking_links WHERE slug = ?`,
    args: [slug]
  })
  if (!linkResult.rows.length) return c.json({ error: 'link not found' }, 404)

  const link = linkResult.rows[0] as any
  if (link.is_used) return c.json({ error: 'link already used' }, 410)

  if (dayjs(end).diff(dayjs(start), 'minute') !== link.duration) {
    return c.json({ error: 'invalid duration' }, 400)
  }

  const conflict = await db.execute({
    sql: `SELECT id FROM bookings WHERE user_id = ? AND start < ? AND end > ? LIMIT 1`,
    args: [link.user_id, end, start]
  })
  if (conflict.rows.length) return c.json({ error: 'time not available' }, 409)

  await db.batch([
    {
      sql: `INSERT INTO bookings (user_id, title, guest_name, guest_email, start, end, meet_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [link.user_id, link.title, guest_name, guest_email, start, end, link.meet_url ?? null] as (string | null)[]
    },
    {
      sql: `UPDATE booking_links SET is_used = 1 WHERE slug = ?`,
      args: [slug]
    }
  ])

  return c.json({ success: true }, 201)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

