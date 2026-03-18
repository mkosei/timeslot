"use client"

import { CreateLinkResponse } from "@/app/types/type"
import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
}

export default function CreateLinkModal({ open, onClose }: Props) {
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState(30)
  const [days, setDays] = useState(7)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("18:00")
  const [meetUrl, setMeetUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState<string | null>(null)

  if (!open) return null

    const resetForm = () => {
        setTitle("")
        setDuration(30)
        setDays(7)
        setStartTime("09:00")
        setEndTime("18:00")
        setMeetUrl("")
        setLink(null)
    }

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8787/api/bookings/links", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            duration: duration,
            days_ahead: days,
            title: title,
            start_time: startTime,
            end_time: endTime,
            meet_url: meetUrl || null
        })
        })

      const data = await res.json() as CreateLinkResponse

      setLink(`http://localhost:3000/booking/${data.slug}`)
    } catch {
      alert("作成失敗")
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    alert("コピーしました")
  }

  return (
    <div
      className="fixed inset-0 bg-white/10 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-[480px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold text-white">
            予約リンク作成
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* body */}
        <div className="p-6 space-y-6">

          {/* duration */}
          <div>
            <label className="text-sm text-zinc-400">
              所要時間
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            >
              <option value={15}>15分</option>
              <option value={30}>30分</option>
              <option value={60}>60分</option>
            </select>
          </div>

          {/* days */}
          <div>
            <label className="text-sm text-zinc-400">
              何日先まで表示
            </label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            />
          </div>

          {/* time */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm text-zinc-400">
                開始時間
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 bg-zinc-800 p-2 rounded"
              />
            </div>

            <div className="flex-1">
              <label className="text-sm text-zinc-400">
                終了時間
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 bg-zinc-800 p-2 rounded"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-400">
              タイトル
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ミーティング"
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            />
          </div>

          {/* meet */}
          <div>
            <label className="text-sm text-zinc-400">
              ミートURL（任意）
            </label>
            <input
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            />
          </div>

          {/* result */}
          {link && (
            <div className="bg-zinc-800 p-3 rounded flex gap-2 items-center">
              <input
                value={link}
                readOnly
                className="flex-1 bg-transparent text-sm"
              />
              <button
                onClick={() => {
                    copy()
                    resetForm()
                }}
                className="text-blue-400 text-sm"
              >
                コピー
              </button>
            </div>
          )}

        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-zinc-700 flex justify-end">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
          >
            {loading ? "作成中..." : "リンク生成"}
          </button>
        </div>
      </div>
    </div>
  )
}