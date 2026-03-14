import { Context } from "hono"

export const getBookings = async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const auth = c.get("authUser")
  const user = auth?.token

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const userId = user.sub

  const { results } = await c.env.DB
    .prepare("SELECT * FROM bookings WHERE host = ?")
    .bind(userId)
    .all()

  return c.json(results)
}