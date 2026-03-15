import { Context } from "hono"

export const getBookings = async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const auth = c.get("authUser")
  const user = auth?.token

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const userId = user.sub

  const { results } = await c.env.DB
    .prepare(`
      SELECT 
        bookings.id,
        bookings.guest_name,
        bookings.start,
        bookings.end,
        bookings.meet_url,
        event_types.title
      FROM bookings
      JOIN event_types
        ON bookings.event_type_id = event_types.id
    `)
    //.bind(userId)
    .all()

  return c.json(results)
}
      // SELECT 
      //   bookings.id,
      //   bookings.guest_name,
      //   bookings.start,
      //   bookings.end,
      //   bookings.meet_url,
      //   event_types.title
      // FROM bookings
      // JOIN event_types
      //   ON bookings.event_type_id = event_types.id
      // WHERE event_types.user_id = ?