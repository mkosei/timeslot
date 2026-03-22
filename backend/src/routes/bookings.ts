import { Hono } from "hono"
import { fetchBookings, createBooking, updateBooking, deleteBooking } from "../services/bookingService"
import { createBookingFromLink, createBookingLink, getAvailability } from "../services/bookingLinkService"
import { ensureUser } from "../middleware/ensureUser"

const app = new Hono()

app.get("/", ensureUser, fetchBookings)
app.post("/", ensureUser, createBooking)
app.put("/:id", ensureUser, updateBooking)
app.delete("/:id", ensureUser, deleteBooking)

app.post("/links", ensureUser, createBookingLink)

app.get("/:slug", getAvailability)
app.post("/:slug", createBookingFromLink)



export default app