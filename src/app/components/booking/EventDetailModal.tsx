"use client"

import { useState, useEffect } from "react"
import { Event } from "@/app/types/type"
import dayjs from "dayjs"
import type { FormState } from "@/app/types/type"
import { deleteBooking } from "@/app/services/bookingService"
import { updateBooking } from "@/app/services/bookingService"
import * as v from "valibot"
import { updateBookingSchema } from "@/app/lib/validators/updateBooking"
import { formatErrors } from "@/app/lib/validators/format"

type Props = {
  event: Event | null
  open: boolean
  onClose: () => void
  onUpdated: () => void
}

export default function EventModal({
  event,
  open,
  onClose,
  onUpdated
}: Props) {

  const [editMode, setEditMode] = useState(false)
  const [errors, setErrors] = useState<{
  title?: string
  time?: string
  guest_email?: string
  url?: string
  }>({})


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
    const result = v.safeParse(updateBookingSchema, {
      title: form.title,
      guest_name: form.guest_name,
      guest_email: form.guest_email || undefined,
      date: form.date,
      start: form.start,
      end: form.end,
      url: form.url || undefined
    })

    if (!result.success) {
      setErrors(formatErrors(result.issues))
      return
    }

    const data = result.output

    try {
      const start = dayjs(`${data.date}T${data.start}`).toISOString()
      const end = dayjs(`${data.date}T${data.end}`).toISOString()

      await updateBooking({
        id: event.id,
        title: data.title,
        guest_name: data.guest_name,
        guest_email: data.guest_email ?? "",
        start,
        end,
        meet_url: data.url ?? ""
      })

      onUpdated()
      onClose()
    } catch {
      alert("更新に失敗しました")
    }
  }

  const handleDelete = async () => {
    if (!confirm("この予約を削除しますか？")) return

    try {
      await deleteBooking(event.id)

      onUpdated()
      onClose()
    } catch {
      alert("削除に失敗しました")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10"
      onClick={onClose}
    >
      <div
        className="w-[440px] rounded-2xl bg-zinc-800 border border-zinc-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">

          <div className="flex-1 flex flex-col">
            {!editMode ? (
              <h2 className="text-lg font-semibold text-white">
                {event.title}
              </h2>
            ) : (
              <input
                value={form.title}
                onChange={(e) => {
                  updateField("title", e.target.value)
                  setErrors((prev) => ({ ...prev, title: undefined }))
                }}
                className="bg-zinc-800 px-3 py-1.5 rounded w-full text-white border border-zinc-600 focus:outline-none"
              />
            )}

            {editMode && errors.title && (
              <p className="text-zinc-400 text-xs mt-1">
                {errors.title}
              </p>
            )}
          </div>

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
              <div className="flex-1 flex flex-col">
              <div className="flex gap-2">

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="bg-zinc-700 p-2 rounded text-sm focus:outline-none"
                />
              
                <input
                  type="time"
                  value={form.start}
                  onChange={(e) => {
                    updateField("start", e.target.value)
                    setErrors((prev) => ({ ...prev, time: undefined }))
                  }}
                  className="bg-zinc-700 p-2 rounded text-sm focus:outline-none"
                />

                <input
                  type="time"
                  value={form.end}
                  onChange={(e) => {
                    updateField("end", e.target.value)
                    setErrors((prev) => ({ ...prev, time: undefined }))
                  }}
                  className="bg-zinc-700 p-2 rounded text-sm focus:outline-none"
                />
              </div>
                <p className="text-zinc-400 text-xs mt-1">
                  {errors.time}
                </p>
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
                  className="w-full bg-zinc-800 p-2 rounded border border-zinc-600 focus:outline-none"
                />

                <input
                  value={form.guest_email}
                  onChange={(e) => {
                    updateField("guest_name", e.target.value)
                    setErrors((prev) => ({ ...prev, guest_email: undefined }))
                  }
                  }
                  placeholder="メール"
                  className="w-full bg-zinc-800 p-2 rounded border border-zinc-600 focus:outline-none"
                />
                <p className="text-zinc-400 text-xs mt-1">
                  {errors.guest_email}
                </p>
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
                onChange={(e) => {
                  updateField("url", e.target.value)
                  setErrors((prev) => ({ ...prev, url: undefined }))
                }}
                placeholder="https://meet.google.com/..."
                className="w-full bg-zinc-800 p-2 rounded border border-zinc-600 focus:outline-none"
              />
            )}
            <p className="text-zinc-400 text-xs mt-1">
              {errors.url}
            </p>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-700">

          {!editMode ? (
            <>
              <button
                onClick={handleDelete}
                className="
                  px-2 py-1 rounded-xl
                  border border-red-600 text-red-300
                  hover:bg-zinc-700
                  active:scale-95
                  transition-all duration-150
                " 
              >
                削除
              </button>

              <button
                onClick={() => setEditMode(true)}
                className="
                  px-2 py-1 rounded-xl
                  border border-blue-600 text-blue-300
                  hover:bg-zinc-700
                  active:scale-95
                  transition-all duration-150
                " 
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
                className="
                  px-2 py-1 rounded-xl
                  border border-blue-600 text-blue-300
                  hover:bg-zinc-700
                  active:scale-95
                  transition-all duration-150
                " 
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