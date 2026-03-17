import { Hono } from "hono"
import { fetchBookings, createBooking, updateBooking, deleteBooking } from "../services/bookingService"

const app = new Hono()

app.get("/", fetchBookings)
app.post("/", createBooking)
app.put("/:id", updateBooking)
app.delete("/:id", deleteBooking)

export default app