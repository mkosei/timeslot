import { Next } from "hono"
import { AppContext } from "../types/type"

export const ensureUser = async (c: AppContext, next: Next) => {
  const userId = c.req.header("x-user-id")
  if (!userId) return c.json({ error: "Unauthorized" }, 401)

  const name = decodeURIComponent(c.req.header("x-user-name") ?? "")
  const email = c.req.header("x-user-email") ?? ""

  const existing = await c.env.DB
    .prepare("SELECT id FROM users WHERE id = ?")
    .bind(userId)
    .first()

  if (!existing) {
    await c.env.DB
      .prepare("INSERT INTO users (id, name, email) VALUES (?, ?, ?)")
      .bind(userId, name, email)
      .run()
  }

  await next()
}