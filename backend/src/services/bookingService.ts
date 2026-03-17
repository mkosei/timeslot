import { Context } from "hono"

  export const fetchBookings = async (c: Context<{ Bindings: CloudflareBindings }>) => {
    const auth = c.get("authUser")
    const user = auth?.token

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const userId = user.sub

    const { results } = await c.env.DB
      .prepare(`
        SELECT 
          id,
          user_id,
          title,
          guest_name,
          guest_email,
          start,
          end,
          meet_url
        FROM bookings
        WHERE user_id = ?
      `)
      .bind(userId)
      .all()

    return c.json(results)
  }

  export const createBooking = async (c: Context<{ Bindings: CloudflareBindings }>) => {
    try {
      const auth = c.get("authUser")
      const userId = auth?.token?.sub
      const { title, guest_name, guest_email, start, end, meet_url} = await c.req.json();
      if ( !userId || !title || !guest_email || !start || !end ) {
          return c.json({ message: "Data is insufficient" }, 400); 
      }

      const result = await c.env.DB.prepare(
        "INSERT INTO bookings (user_id, title, guest_name, guest_email, start, end, meet_url) VALUES (?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(userId, title, guest_name, guest_email, start, end, meet_url || null) 
      .run();

      const newBookingId = result.meta.last_row_id;
      return c.json({ 
        id: newBookingId, 
        user_id: userId,
        title: title, 
        guest_name: guest_name, 
        guest_email: guest_email, 
        start: start,
        end: end,
        meet_url: meet_url
      }, 201); 
    } catch (error) {
      throw error
    }
  }

  export const updateBooking = async (c: Context<{ Bindings: CloudflareBindings }>) => {
    try {
      const id = c.req.param("id")
      const body = await c.req.json()

      const {
        title,
        guest_name,
        guest_email,
        start,
        end,
        meet_url
      } = body as {
        title: string
        guest_name: string
        guest_email: string
        start: string
        end: string
        meet_url?: string
      }

      if (!id) {
        return c.json({ error: "id required" }, 400)
      }

      await c.env.DB.prepare(`
        UPDATE bookings
        SET
          title = ?,
          guest_name = ?,
          guest_email = ?,
          start = ?,
          end = ?,
          meet_url = ?
        WHERE id = ?
      `)
        .bind(title, guest_name, guest_email, start, end, meet_url ?? null, id)
        .run()

      return c.json({ success: true })

    } catch (err) {
      console.error(err)
      return c.json({ error: "update failed" }, 500)
    }
  }

  export const deleteBooking = async (c: Context<{ Bindings: CloudflareBindings }>) => {
    try {
      const id = c.req.param("id")

      if (!id) {
        return c.json({ error: "id required" }, 400)
      }

      await c.env.DB.prepare(`
        DELETE FROM bookings
        WHERE id = ?
      `)
        .bind(id)
        .run()

      return c.json({ success: true })

    } catch (err) {
      console.error(err)
      return c.json({ error: "delete failed" }, 500)
    }
  }