import { Hono } from "hono"
import { HTTPException } from 'hono/http-exception'
import { cors } from "hono/cors"
import bookingsRoute from "./routes/bookings"

type CloudflareBindings = {
  DB: D1Database
  APP_URL: string
}

export const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use("*", (c, next) => {
  return cors({
    origin: c.env.APP_URL,
    credentials: true,
    allowHeaders: ["Content-Type", "x-user-id", "x-user-name", "x-user-email"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })(c, next)
})

app.get("/", (c) => {
  return c.redirect(c.env.APP_URL + "/schedule")
})

app.route("/api/bookings", bookingsRoute)

app.onError((err, c) => {
  console.error(err)
  if (err instanceof HTTPException && err.status === 401) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  return c.json({ message: "Internal Server Error", error: err.message }, 500)
})

export default app