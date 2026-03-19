"use client"

import { useEffect, useState, useMemo, use } from "react"
import dayjs from "dayjs"
import { createBookingFromLink, getBookingSlots } from "@/app/services/bookingLinkService"
import * as v from "valibot"
import { bookingFromLinkSchema } from "@/app/lib/validators/bookingFromLink"
import { formatErrors } from "@/app/lib/validators/format"

type Slot = {
  start: string
  end: string
}

export default function BookingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(true)

  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    slot?: string
  }>({})

  const { slug } = use(params)


  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true)
      try {
        const data = await getBookingSlots(slug)
        setSlots(data.slots)
        setTitle(data.title)
      } catch (e) {
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [slug])

  // 日付一覧
  const dates = useMemo(() => {
    return Array.from(
      new Set(slots.map((s) => dayjs(s.start).format("YYYY-MM-DD")))
    )
  }, [slots])

  // 選択日のスロット
  const filteredSlots = slots.filter(
    (s) =>
      selectedDate &&
      dayjs(s.start).format("YYYY-MM-DD") === selectedDate
  )

  const handleBooking = async () => {
    const result = v.safeParse(bookingFromLinkSchema, { name, email })

    // エラー処理（全部ここで終わらせる）
    if (!result.success || !selectedSlot) {
      setErrors({
        ...(!result.success ? formatErrors(result.issues) : {}),
        ...(!selectedSlot ? { slot: "時間を選択してください" } : {})
      })
      return
    }

    const data = result.output

    setLoading(true)

    try {
      await createBookingFromLink(slug, {
        title,
        start: selectedSlot.start,
        end: selectedSlot.end,
        guest_name: data.name,
        guest_email: data.email
      })

      setDone(true)
    } catch {
      alert("予約失敗")
    } finally {
      setLoading(false)
    }
  }

  //空き時間取得画面
  if (loadingSlots) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        相手の空き時間を取得中...
      </div>
    )
  }
  // 完了画面
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="bg-zinc-800 p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-xl font-semibold mb-2">
            予約完了 🎉
          </h2>
          <p className="text-zinc-400">
            ご予約ありがとうございました
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center p-6">
      <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-4xl p-6">

        {/* タイトル */}
        <h1 className="text-xl font-semibold mb-6">
          {title}の予約
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">

          {/* 日付 */}
          <div className="flex flex-col min-h-0">
            <h3 className="text-sm text-zinc-400 mb-2">日付</h3>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 max-h-[200px] md:max-h-none">
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDate(d)
                    setSelectedSlot(null)
                    setErrors((prev) => ({ ...prev, slot: undefined }))
                  }}
                  className={`px-3 py-2 rounded text-sm text-left transition
                  ${
                    selectedDate === d
                      ? "bg-blue-600 shadow-md"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  {dayjs(d).format("M/D (ddd)")}
                </button>
              ))}
            </div>
          </div>

          {/* 時間 */}
          <div className="flex flex-col min-h-0">
            <h3 className="text-sm text-zinc-400 mb-2">時間</h3>

            {!selectedDate && (
              <p className="text-zinc-500 text-sm">
                日付を選択
              </p>
            )}

            {errors.slot && (
              <p className="text-red-400 text-xs mb-2">{errors.slot}</p>
            )}

            <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto pr-1 max-h-[200px] md:max-h-none">
              {filteredSlots.map((s) => (
                <button
                  key={s.start}
                  onClick={() => {
                    setSelectedSlot(s)
                    setErrors((prev) => ({ ...prev, slot: undefined }))
                  }}
                  className={`px-3 py-2 rounded text-sm transition text-center
                  ${
                    selectedSlot?.start === s.start
                      ? "bg-blue-600 shadow-md"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  {dayjs(s.start).format("HH:mm")}
                </button>
              ))}
            </div>
          </div>

          {/* フォーム */}
          <div className="flex flex-col">
            <h3 className="text-sm text-zinc-400 mb-2">
              あなたの情報
            </h3>

            <div className="flex flex-col gap-3">

              <div>
                <input
                  placeholder="名前"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  className="bg-zinc-700 px-3 py-2 rounded w-full focus:outline-none"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  placeholder="メール"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  className="bg-zinc-700 px-3 py-2 rounded w-full focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedSlot || loading}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "予約中..." : "予約する"}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}