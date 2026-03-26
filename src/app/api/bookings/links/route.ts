import { auth } from "@/app/auth"
import { db } from "@/app/lib/db"
import * as v from "valibot"
import { nanoid } from "nanoid"
import { bookingLinkSchema } from "@/app/lib/validators/api"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = v.safeParse(bookingLinkSchema, await req.json())
  if (!parsed.success) return Response.json({ error: v.flatten(parsed.issues) }, { status: 400 })

  const { title, duration, meet_url, days_ahead, start_time, end_time } = parsed.output
  const slug = nanoid(10)

  await db.execute({
    sql: `INSERT INTO booking_links (user_id, slug, duration, meet_url, days_ahead, title, start_time, end_time)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [session.user.id, slug, duration, meet_url ?? null, days_ahead, title, start_time, end_time]
  })

  return Response.json({ success: true, url: `/booking/${slug}`, slug }, { status: 201 })
}