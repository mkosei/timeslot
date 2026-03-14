import { Context, Next } from "hono"

export const ensureUser = async (c: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
  const auth = c.get("authUser")
  const user = auth?.token

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const userId = user.sub
  const email = user.email
  const name = user.name

  const existing = await c.env.DB
    .prepare("SELECT id FROM users WHERE id = ?")
    .bind(userId)
    .first()

  if (!existing) {
    await c.env.DB
      .prepare(
        "INSERT INTO users (id, name, email) VALUES (?, ?, ?)"
      )
      .bind(userId, name, email)
      .run()
  }

  await next()
}