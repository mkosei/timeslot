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

  //TODO
  //バリデーションする

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-zinc-900 rounded-xl shadow-lg w-96 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">予約を作成</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">日付</label>
            <input
              type="date"
              className="bg-zinc-700 text-white px-3 py-2 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <label className="text-sm text-zinc-400 mb-1">開始時間</label>
              <input
                type="time"
                className="bg-zinc-700 text-white px-3 py-2 rounded"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-sm text-zinc-400 mb-1">終了時間</label>
              <input
                type="time"
                className="bg-zinc-700 text-white px-3 py-2 rounded"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">タイトル *</label>
            <input
              type="text"
              className="bg-zinc-700 text-white px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div> 

          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">お名前（お相手）</label>
            <input
              type="text"
              className="bg-zinc-700 text-white px-3 py-2 rounded"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">相手のメールアドレス</label>
            <input
              type="email"
              className="bg-zinc-700 text-white px-3 py-2 rounded"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">URL</label>
            <input
              type="text"
              className="bg-zinc-700 text-white px-3 py-2 rounded"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>


          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
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