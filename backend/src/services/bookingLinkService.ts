import { Context } from "hono"
import { nanoid } from "nanoid"
import type { BookingLinkPayload } from "../types/type"
import dayjs from "dayjs"


export const createBookingLink = async (c: Context<{ Bindings: CloudflareBindings }>) => {
    try {
        const auth = c.get("authUser")
        const user = auth?.token

        if (!user) {
            return c.json({ error: "unauthorized" }, 401)
        }
        
        const body = await c.req.json();

        const {
        duration,
        meet_url,
        days_ahead,
        title,
        start_time,
        end_time
        } = body as BookingLinkPayload

        if (!duration) {
            return c.json({ error: "duration required" }, 400)
        }
        
        const userId = user.sub
        const slug = nanoid(10)
        const safeStart = start_time ?? "09:00"
        const safeEnd = end_time ?? "18:00"

        await c.env.DB.prepare(`
        INSERT INTO booking_links (
            user_id, 
            slug,
            duration, 
            meet_url,
            days_ahead,
            title,
            start_time,
            end_time
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            userId,
            slug,
            duration,
            meet_url ?? null,
            days_ahead ?? 7,
            title,
            safeStart, 
            safeEnd 
        )
        .run()

        return c.json({
        success: true,
        url: `/booking/${slug}`,
        slug
        })

    } catch (err) {
        return c.json({ error: "failed to create link" }, 500)
    }
}

//要最適化
export const getAvailability = async (c: Context<{ Bindings: CloudflareBindings }>) => {
    try{
        const slug = c.req.param('slug')
        
        const link = await c.env.DB.prepare(`
            SELECT * FROM booking_links WHERE slug = ?
        `)
        .bind(slug)
        .first()

        if (!link) {
            return c.json({ error: "link not found" }, 404)
        }

        const { user_id, duration, days_ahead } = link as any //あとで型
        
        const now = dayjs()
        const endRange = now.add(days_ahead, "day")

        //ここパフォーマンス悪そう
        const bookings = await c.env.DB.prepare(`
            SELECT start, end FROM bookings
            WHERE user_id = ?
            AND start >= ?
            AND end <= ?
        `)
        .bind(user_id, now.toISOString(), endRange.toISOString())
        .all()

        const events = bookings.results as {
            start: string
            end: string
        }[] //ここも後で型作る

        const slots: { start: string; end: string }[] = []

        for (let d = 0; d < days_ahead; d++) {
        const day = now.add(d, "day").startOf("day")

        let current = day.hour(9).minute(0)
        const end = day.hour(18).minute(0)

        while (current.add(duration, "minute").isBefore(end)) {
            const slotStart = current
            const slotEnd = current.add(duration, "minute")

            const isConflict = events.some((e) => {
            const eStart = dayjs(e.start)
            const eEnd = dayjs(e.end)

            return (
                slotStart.isBefore(eEnd) &&
                slotEnd.isAfter(eStart)
            )
            })

            if (!isConflict) {
            slots.push({
                start: slotStart.toISOString(),
                end: slotEnd.toISOString()
            })
            }

            current = current.add(duration, "minute")
        }
        }

        return c.json({
        title: link.title ?? "Meeting",
        duration,
        slots
        })

    } catch (err) {

    }
}
//要最適化
export const createBookingFromLink = async (
  c: Context<{ Bindings: CloudflareBindings }>
) => {
  try {
    const slug = c.req.param("slug")

    const body = await c.req.json()

    const {
      title,
      start,
      end,
      guest_name,
      guest_email
    } = body as {
      title: string
      start: string
      end: string
      guest_name: string
      guest_email: string
    }

    if (!start || !end) {
      return c.json({ error: "invalid time" }, 400)
    }

    // ① link取得
    const link = await c.env.DB.prepare(`
      SELECT * FROM booking_links WHERE slug = ?
    `)
      .bind(slug)
      .first()

    if (!link) {
      return c.json({ error: "link not found" }, 404)
    }

    const { user_id, duration, meet_url } = link as any

    const diff = dayjs(end).diff(dayjs(start), "minute")
    if (diff !== duration) {
      return c.json({ error: "invalid duration" }, 400)
    }


    const conflict = await c.env.DB.prepare(`
      SELECT id FROM bookings
      WHERE user_id = ?
      AND start < ?
      AND end > ?
      LIMIT 1
    `)
      .bind(user_id, end, start)
      .first()

    if (conflict) {
      return c.json({ error: "time not available" }, 409)
    }

    // ④ 予約作成
    await c.env.DB.prepare(`
      INSERT INTO bookings (
        user_id,
        title,
        guest_name,
        guest_email,
        start,
        end,
        meet_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        user_id,
        title,
        guest_name,
        guest_email,
        start,
        end,
        meet_url ?? null
      )
      .run()

    return c.json({ success: true })

  } catch (err) {
    console.error(err)
    return c.json({ error: "failed to create booking" }, 500)
  }
}