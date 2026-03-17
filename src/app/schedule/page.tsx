"use client"

import { useState, useEffect, useCallback } from "react"
import DayView from "@/app/components/calender/DayView"
import WeekView from "@/app/components/calender/WeekView"
import MonthView from "@/app/components/calender/MonthView"
import UserMenu from "@/app/components/calender/UserMenu"
import BookingModal from "@/app/components/booking/BookingModal"
import dayjs, { Dayjs } from "dayjs"
import { fetchBookings } from "../services/bookingService"
import { fetchSession } from "../services/authService"
import type { BookingResponse, Event } from "../types/type"
import EventModal from "../components/booking/EventDetailModal"

export default function SchedulePage() {
  const [mode, setMode] = useState<"day" | "week" | "month">("day")
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
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
    try {
      setLoading(true)

      const [sessionData, bookingsData] = await Promise.all([
        fetchSession(),
        fetchBookings()
      ])

      setSession(sessionData)

      if (sessionData?.user) {
        setEvents(formatBookings(bookingsData))
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-700 bg-zinc-800 shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">

          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">TimeSlot</h1>
            
            {/* 日付表示 */}
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
              className="flex rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded shadow"
              onClick={() => {
                alert("リンクを作成")
              }}
            >
              予約リンクを作成
            </button>

            <button
              className="flex rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 shadow"
              onClick={() => setBookingModalOpen(true)}
            >
              予定を追加
            </button>

            <div className="flex rounded-lg border border-zinc-600 overflow-hidden text-sm">
              {["day", "week", "month"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as any)}
                  className={`px-4 py-1 capitalize ${
                    mode === m
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <UserMenu session={session} />
          </div>
        </div>


        {/* View切り替え */}
        {mode === "day" && 
          <DayView
            events={events}
            selectedDate={selectedDate}
            onSelectEvent={setSelectedEvent}
          />
        }
        {mode === "week" && 
        <WeekView 
          events={events} 
          baseDate={selectedDate} 
          onSelectEvent={setSelectedEvent}
        />
        }
        {mode === "month" &&           
          <MonthView
            events={events}
            onSelectDate={(date: any) => {
              setSelectedDate(date)
              setMode("day") // 選択したら DayView に切り替える
            }}
           />}
      </div>
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBooked={() => {
          setBookingModalOpen(false)
          load();
        }}
      />
      <EventModal
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdated={load}
      />
    </div> 
  )
}