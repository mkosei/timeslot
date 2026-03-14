import { Hono } from "hono"
import { getBookings } from "../services/bookingService"

const app = new Hono()

app.get("/", getBookings)

export default app