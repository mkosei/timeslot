import { Context } from "hono"
import * as v from "valibot"
import { bookingSchema, bookingLinkSchema } from "../lib/validator"

export type AppContext = Context<{ Bindings: CloudflareBindings }>

export type BookingInput = v.InferOutput<typeof bookingSchema>

export type BookingLinkPayload = {
    duration: number
    meet_url?: string
    days_ahead?: number
    title: string
    start_time: string
    end_time: string 
}

export type BookingLinkInput = v.InferOutput<typeof bookingLinkSchema>

export type BookingLink = {
  user_id: string
  duration: number
  days_ahead: number
  meet_url: string | null
  title: string | null
  start_time: string
  end_time: string
}

export type BookingSlot = {
  start: string
  end: string
}