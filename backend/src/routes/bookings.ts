import { Hono } from "hono"
import { fetchBookings, createBooking } from "../services/bookingService"

const app = new Hono()

app.get("/", fetchBookings)
app.post("/", createBooking)

export default app