"use client"

import { useState, useEffect } from "react"
import { Event } from "@/app/types/type"
import dayjs from "dayjs"

type Props = {
  event: Event | null
  open: boolean
  onClose: () => void
  onUpdated: () => void
}

type FormState = {
  title: string
  guest_name: string
  guest_email: string
  date: string
  start: string
  end: string
  url: string
}

export default function EventModal({
  event,
  open,
  onClose,
  onUpdated
}: Props) {

  const [editMode, setEditMode] = useState(false)

  const [form, setForm] = useState<FormState>({
    title: "",
    guest_name: "",
    guest_email: "",
    date: "",
    start: "",
    end: "",
    url: ""
  })

  // event同期
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        guest_name: event.guest_name,
        guest_email: event.guest_email,
        date: event.date,
        start: event.start,
        end: event.end,
        url: event.url ?? ""
      })
      setEditMode(false)
    }
  }, [event])

  if (!open || !event) return null

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleUpdate = async () => {
    if (form.end <= form.start) {
      alert("終了時間は開始時間より後にしてください")
      return
    }

    try {
      const start = dayjs(`${form.date}T${form.start}`).toISOString()
      const end = dayjs(`${form.date}T${form.end}`).toISOString()

      const res = await fetch(
        `http://localhost:8787/api/bookings/${event.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: form.title,
            guest_name: form.guest_name,
            guest_email: form.guest_email,
            start,
            end,
            meet_url: form.url
          })
        }
      )

      if (!res.ok) throw new Error()

      onUpdated()
      onClose()

    } catch {
      alert("更新に失敗しました")
    }
  }

  const handleDelete = async () => {
    if (!confirm("この予約を削除しますか？")) return

    try {
      const res = await fetch(
        `http://localhost:8787/api/bookings/${event.id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      )

      if (!res.ok) throw new Error()

      onUpdated()
      onClose()

    } catch {
      alert("削除に失敗しました")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[440px] rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">

          {!editMode ? (
            <h2 className="text-lg font-semibold text-white">
              {event.title}
            </h2>
          ) : (
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="bg-zinc-800 px-3 py-1.5 rounded w-full text-white"
            />
          )}

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white ml-3"
          >
            ✕
          </button>

        </div>

        <div className="px-6 py-5 space-y-5">

          <div className="bg-zinc-800 rounded-lg p-4 space-y-2">

            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              日付と時間
            </p>

            {!editMode ? (
              <p className="text-sm">
                {event.date} {event.start} – {event.end}
              </p>
            ) : (
              <div className="flex gap-2">

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="bg-zinc-700 p-2 rounded text-sm"
                />

                <input
                  type="time"
                  value={form.start}
                  onChange={(e) => updateField("start", e.target.value)}
                  className="bg-zinc-700 p-2 rounded text-sm"
                />

                <input
                  type="time"
                  value={form.end}
                  onChange={(e) => updateField("end", e.target.value)}
                  className="bg-zinc-700 p-2 rounded text-sm"
                />

              </div>
            )}

          </div>

          {/* GUEST */}
          <div className="space-y-2">

            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              名前（お相手）
            </p>

            {!editMode ? (
              <>
                <p className="text-sm">{event.guest_name}</p>
                <p className="text-sm text-zinc-400">
                  {event.guest_email}
                </p>
              </>
            ) : (
              <>
                <input
                  value={form.guest_name}
                  onChange={(e) =>
                    updateField("guest_name", e.target.value)
                  }
                  placeholder="名前"
                  className="w-full bg-zinc-800 p-2 rounded"
                />

                <input
                  value={form.guest_email}
                  onChange={(e) =>
                    updateField("guest_email", e.target.value)
                  }
                  placeholder="メール"
                  className="w-full bg-zinc-800 p-2 rounded"
                />
              </>
            )}

          </div>

          <div className="space-y-2">

            <p className="text-xs text-zinc-400 uppercase tracking-wide">
              URL
            </p>

            {!editMode ? (
              event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  className="text-blue-400 text-sm hover:underline"
                >
                  {event.url}
                </a>
              ) : (
                <p className="text-zinc-500 text-sm">No link</p>
              )
            ) : (
              <input
                value={form.url}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full bg-zinc-800 p-2 rounded"
              />
            )}

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-700">

          {!editMode ? (
            <>
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                削除
              </button>

              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-1.5 bg-blue-600 rounded-md text-sm hover:bg-blue-500"
              >
                編集
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="text-zinc-400 text-sm"
              >
                キャンセル
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-1.5 bg-green-600 rounded-md text-sm hover:bg-green-500"
              >
                保存
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  )
}