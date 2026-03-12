"use client"

import { useState, useEffect } from "react"
import DayView from "@/app/components/calender/DayView"
import WeekView from "@/app/components/calender/WeekView"
import MonthView from "@/app/components/calender/MonthView"
import UserMenu from "@/app/components/calender/UserMenu"
import dayjs, { Dayjs } from "dayjs"


export type Event = {
  id: number
  title: string
  candidate: string
  start: string
  end: string
  date: string
  url?: string
}

const events: Event[] = [
  { id: 1, title: "面接１", candidate: "Yamada Taro", start: "10:00", end: "12:30", date: "2026-03-08" },
  { id: 2, title: "カジュアル面談", candidate: "Suzuki Hanako", start: "13:00", end: "13:30", date: "2026-03-12" },
]

export default function SchedulePage() {
  const [mode, setMode] = useState<"day" | "week" | "month">("day")
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8787/api/auth/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSession(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-700 bg-zinc-800 shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">

          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Schedule</h1>
            
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
        {mode === "day" && <DayView events={events} selectedDate={selectedDate} />}
        {mode === "week" && <WeekView events={events} baseDate={selectedDate} />}
        {mode === "month" &&           
          <MonthView
            events={events}
            onSelectDate={(date: any) => {
              setSelectedDate(date)
              setMode("day") // 選択したら DayView に切り替える
            }}
           />}
      </div>
    </div> 
  )
}