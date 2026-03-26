import { auth } from "@/app/auth"
import { db } from "@/app/lib/db"
import * as v from "valibot"
import { bookingSchema } from "@/app/lib/validators/api"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { rows } = await db.execute({
    sql: `SELECT id, user_id, title, guest_name, guest_email, start, end, meet_url
          FROM bookings WHERE user_id = ?`,
    args: [session.user.id]
  })

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = v.safeParse(bookingSchema, await req.json())
  if (!parsed.success) return Response.json({ error: v.flatten(parsed.issues) }, { status: 400 })

  const { title, guest_name, guest_email, start, end, meet_url } = parsed.output
  const userId = session.user.id

  const result = await db.execute({
    sql: `INSERT INTO bookings (user_id, title, guest_name, guest_email, start, end, meet_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [userId, title, guest_name ?? null, guest_email ?? null, start, end, meet_url ?? null]
  })

  return Response.json({
    id: result.lastInsertRowid,
    user_id: userId,
    title,
    guest_name,
    guest_email,
    start,
    end,
    meet_url: meet_url ?? null,
  }, { status: 201 })
}