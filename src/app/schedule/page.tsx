"use client"

import { useState, useEffect, useCallback } from "react"
import DayView from "@/app/components/calender/DayView"
import WeekView from "@/app/components/calender/WeekView"
import MonthView from "@/app/components/calender/MonthView"
import UserMenu from "@/app/components/calender/UserMenu"
import BookingModal from "@/app/components/booking/BookingModal"
import dayjs, { Dayjs } from "dayjs"
import { fetchBookings } from "../services/bookingService"
import type { BookingResponse, Event } from "../types/type"
import EventModal from "../components/booking/EventDetailModal"
import CreateLinkModal from "../components/booking/BookingLinkModal"
import LoginModal from "../components/auth/LoginModal"
import { useSession } from "next-auth/react"

export default function SchedulePage() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [mode, setMode] = useState<"day" | "week" | "month">("day")
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [events, setEvents] = useState<Event[]>([])
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  function formatBookings(data: BookingResponse[]): Event[] {
    return data.map((b) => ({
      id: b.id,
      user_id: b.user_id,
      title: b.title,
      guest_name: b.guest_name,
      guest_email: b.guest_email,
      start: dayjs(b.start).format("HH:mm"),
      end: dayjs(b.end).format("HH:mm"),
      date: dayjs(b.start).format("YYYY-MM-DD"),
      url: b.meet_url,
    }))
  }

  const load = useCallback(async () => {
    if (!session?.user) return
    try {
      const bookingsData = await fetchBookings()
      setEvents(formatBookings(bookingsData))
    } catch (err) {
      console.error(err)
    }
  }, [session])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Time<span className="text-violet-400">Slot</span></h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <button
                onClick={() => setSelectedDate(dayjs())}
                className="px-2 py-1 rounded hover:bg-zinc-700"
              >
                Today
              </button>
              <input
                type="date"
                value={selectedDate.format("YYYY-MM-DD")}
                onChange={(e) => setSelectedDate(dayjs(e.target.value))}
                className="bg-zinc-700 text-white px-2 py-1 rounded text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLinkModalOpen(true)}
              className="px-2 py-1 rounded-xl border border-zinc-600 text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all duration-150"
            >
              予約リンクを作成
            </button>
            <button
              className="px-2 py-1 rounded-xl border border-zinc-600 text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all duration-150"
              onClick={() => setBookingModalOpen(true)}
            >
              予定を追加
            </button>
            <div className="flex rounded-xl bg-zinc-800 p-1 text-sm">
              {["day", "week", "month"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as any)}
                  className={`flex-1 px-4 py-1.5 rounded-lg capitalize transition-all duration-150 ${
                    mode === m ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <UserMenu session={session} />
          </div>
        </div>

        {mode === "day" && <DayView events={events} selectedDate={selectedDate} onSelectEvent={setSelectedEvent} />}
        {mode === "week" && <WeekView events={events} baseDate={selectedDate} onSelectEvent={setSelectedEvent} />}
        {mode === "month" && <MonthView events={events} onSelectDate={(date: any) => { setSelectedDate(date); setMode("day") }} />}
      </div>

      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBooked={() => { setBookingModalOpen(false); load() }}
      />
      <CreateLinkModal open={linkModalOpen} onClose={() => setLinkModalOpen(false)} />
      <EventModal
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdated={load}
      />
      <LoginModal open={!loading && !session?.user} />
    </div>
  )
}