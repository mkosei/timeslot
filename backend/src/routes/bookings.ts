import { Hono } from "hono"
import { fetchBookings, createBooking, updateBooking, deleteBooking } from "../services/bookingService"
import { createBookingFromLink, createBookingLink, getAvailability } from "../services/bookingLinkService"
import { verifyAuth } from "@hono/auth-js"
import { ensureUser } from "../middleware/ensureUser"

const app = new Hono()

app.get("/", verifyAuth(), ensureUser, fetchBookings)
app.post("/", verifyAuth(), ensureUser, createBooking)
app.put("/:id", verifyAuth(), ensureUser, updateBooking)
app.delete("/:id", verifyAuth(), ensureUser, deleteBooking)

app.post("/links", verifyAuth(), ensureUser, createBookingLink)

app.get("/:slug", getAvailability)
app.post("/:slug", createBookingFromLink)



export default app