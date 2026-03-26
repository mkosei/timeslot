import { db } from "@/app/lib/db"
import { Session } from "next-auth"

export async function ensureUser(session: Session) {
  const user = session.user
  if (!user?.id) return

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE id = ?",
    args: [user.id]
  })

  if (!existing.rows.length) {
    await db.execute({
      sql: "INSERT INTO users (id, name, email) VALUES (?, ?, ?)",
      args: [user.id, user.name ?? "", user.email ?? ""]
    })
  }
}