import * as v from "valibot"

const nullishString = v.pipe(v.nullish(v.string()), v.transform(v => v || null))

// booking
export const bookingSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1)),
  guest_name: nullishString,
  guest_email: nullishString,
  start: v.pipe(v.string(), v.isoTimestamp()),
  end: v.pipe(v.string(), v.isoTimestamp()),
  meet_url: nullishString,
})

// link
export const bookingLinkSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1)),
  duration: v.pipe(v.number(), v.minValue(1)),
  meet_url: nullishString,
  days_ahead: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 7),
  start_time: v.optional(v.string(), "09:00"),
  end_time: v.optional(v.string(), "18:00"),
})

// booking from link
export const createBookingFromLinkSchema = v.object({
  start: v.pipe(v.string(), v.isoTimestamp()),
  end: v.pipe(v.string(), v.isoTimestamp()),
  guest_name: nullishString,
  guest_email: nullishString,
})