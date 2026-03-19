"use client"

import { CreateLinkResponse } from "@/app/types/type"
import { useState } from "react"
import { sanitize, isValidTimeRange, isValidUrl } from "@/app/lib/valid"

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
  const [errors, setErrors] = useState<{
  title?: string
  duration?: string
  days?: string
  time?: string
  meetUrl?: string
}>({})

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

  const safeTitle = sanitize(title.trim())
  const safeMeetUrl = sanitize(meetUrl.trim())

  const newErrors: typeof errors = {}

  if (!safeTitle) {
    newErrors.title = "タイトルは必須です"
  }

  if (duration < 15 || duration > 120) {
    newErrors.duration = "15〜120分で入力してください"
  }

  if (days < 1 || days > 365) {
    newErrors.days = "1〜365で入力してください"
  }

  if (!isValidTimeRange(startTime, endTime)) {
    newErrors.time = "開始は終了より前にしてください"
  }

  if (safeMeetUrl && !isValidUrl(safeMeetUrl)) {
    newErrors.meetUrl = "URL形式が不正です"
  }

  setErrors(newErrors)

  if (Object.keys(newErrors).length > 0) return

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
        title: safeTitle,
        start_time: startTime,
        end_time: endTime,
        meet_url: safeMeetUrl || null
      })
    })

    const data = (await res.json()) as CreateLinkResponse

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
          <div>
            <label className="text-sm text-zinc-400">
              タイトル*
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setErrors((prev) => ({ ...prev, title: undefined }))
              }}
              placeholder="ミーティング"
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            />
            {errors.title && (
              <p className="text-zinc-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* duration */}
          <div>
            <label className="text-sm text-zinc-400">
              所要時間
            </label>
            <select
              value={duration}
              onChange={(e) => {
                setDuration(Number(e.target.value))
                setErrors((prev) => ({ ...prev, duration: undefined }))
              }}
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            >
              <option value={15}>15分</option>
              <option value={30}>30分</option>
              <option value={15}>45分</option>
              <option value={60}>60分</option>
              <option value={90}>90分</option>
              <option value={120}>120分</option>
            </select>
            {errors.duration && (
              <p className="text-zinc-400 text-xs mt-1">{errors.duration}</p>
            )}
          </div>

          {/* days */}
          <div>
            <label className="text-sm text-zinc-400">
              何日先まで表示
            </label>
            <input
              type="number"
              value={days}
              onChange={(e) => {
                setDays(Number(e.target.value))
                setErrors((prev) => ({ ...prev, days: undefined }))
              }}
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            />
            {errors.days && (
              <p className="text-zinc-400 text-xs mt-1">{errors.days}</p>
            )}
          </div>

          {/* time */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm text-zinc-400">
                対応可能時刻（から）
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value)
                  setErrors((prev) => ({ ...prev, time: undefined }))
                }}
                className="w-full mt-1 bg-zinc-800 p-2 rounded"
              />
            {errors.time && (
              <p className="text-zinc-400 text-xs mt-1">{errors.time}</p>
            )}
            </div>

            <div className="flex-1">
              <label className="text-sm text-zinc-400">
                対応終了時刻（まで）
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value)
                  setErrors((prev) => ({ ...prev, time: undefined }))
                }}
                className="w-full mt-1 bg-zinc-800 p-2 rounded"
              />
            </div>
          </div>

          {/* meet */}
          <div>
            <label className="text-sm text-zinc-400">
              ミートURL（任意）
            </label>
            <input
              value={meetUrl}
              onChange={(e) => {
                setMeetUrl(e.target.value)
                setErrors((prev) => ({ ...prev, meetUrl: undefined }))
              }}
              placeholder="https://..."
              className="w-full mt-1 bg-zinc-800 p-2 rounded"
            />
            {errors.meetUrl && (
            <p className="text-zinc-400 text-xs mt-1">{errors.meetUrl}</p>
            )}
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