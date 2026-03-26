import { auth } from "@/app/auth"
import { db } from "@/app/lib/db"
import * as v from "valibot"
import { bookingSchema } from "@/app/lib/validators/api"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = v.safeParse(bookingSchema, await req.json())
  if (!parsed.success) return Response.json({ error: v.flatten(parsed.issues) }, { status: 400 })

  const { title, guest_name, guest_email, start, end, meet_url } = parsed.output
  const { id } = await params

  const existing = await db.execute({
    sql: "SELECT id FROM bookings WHERE id = ? AND user_id = ?",
    args: [id, session.user.id]
  })

  if (!existing.rows.length) return Response.json({ error: "Not found" }, { status: 404 })

  await db.execute({
    sql: `UPDATE bookings
          SET title = ?, guest_name = ?, guest_email = ?, start = ?, end = ?, meet_url = ?
          WHERE id = ? AND user_id = ?`,
    args: [title, guest_name ?? null, guest_email ?? null, start, end, meet_url ?? null, id, session.user.id]
  })

  return Response.json({ success: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const existing = await db.execute({
    sql: "SELECT id FROM bookings WHERE id = ? AND user_id = ?",
    args: [id, session.user.id]
  })

  if (!existing.rows.length) return Response.json({ error: "Not found" }, { status: 404 })

  await db.execute({
    sql: "DELETE FROM bookings WHERE id = ? AND user_id = ?",
    args: [id, session.user.id]
  })

  return Response.json({ success: true })
}