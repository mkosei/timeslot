"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { createBooking } from "@/app/services/bookingService"

type Props = {
  open: boolean
  onClose: () => void
  onBooked: () => void
}

export default function BookingModal({ open, onClose, onBooked }: Props) {

  const [title, setTitle] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"))
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("09:30")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const resetForm = () => {
    setTitle("")
    setGuestName("")
    setGuestEmail("")
    setStartTime("")
    setEndTime("")
    setUrl("")
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {

      const start = dayjs(`${date}T${startTime}`).toISOString()
      const end = dayjs(`${date}T${endTime}`).toISOString()

      await createBooking({
        title,
        guest_name: guestName,
        guest_email: guestEmail,
        start,
        end,
        meet_url: url
      })

      resetForm()
      onBooked()
      onClose()

    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10"
      onClick={onClose}
    >
      <div
        className="w-[440px] rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">

          <h2 className="text-lg font-semibold text-white">
            予約を作成
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>

        </div>

        <div className="px-6 py-5 space-y-5">

          <div className="space-y-2">

            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              日付*
            </p>

            <div className="flex gap-2">

              <input
                type="date"
                className="bg-zinc-800 p-2 rounded text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                type="time"
                className="bg-zinc-800 p-2 rounded text-sm"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />

              <input
                type="time"
                className="bg-zinc-800 p-2 rounded text-sm"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />

            </div>

          </div>

          <div className="space-y-2">

            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              タイトル*
            </p>

            <input
              type="text"
              className="w-full bg-zinc-800 p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

          </div>

          <div className="space-y-2">

            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              名前（お相手）
            </p>

            <input
              type="text"
              placeholder="名前"
              className="w-full bg-zinc-800 p-2 rounded"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />

            <input
              type="email"
              placeholder="メール"
              className="w-full bg-zinc-800 p-2 rounded"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />

          </div>


          <div className="space-y-2">

            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              URL
            </p>

            <input
              type="text"
              placeholder="https://meet.google.com/..."
              className="w-full bg-zinc-800 p-2 rounded"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 border-t border-zinc-700">

          <button
            className="px-4 py-1.5 bg-blue-600 rounded-md text-sm hover:bg-blue-500 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "予約中..." : "予約を作成"}
          </button>

        </div>

      </div>
    </div>
  )
}