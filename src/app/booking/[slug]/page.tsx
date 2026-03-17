"use client"

import { useEffect, useState, use } from "react"
import dayjs from "dayjs"

type Slot = {
  start: string
  end: string
}

type BookingResponse = {
  slots: Slot[]
}

export default function BookingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const { slug } = use(params)

  // ① slots取得
    useEffect(() => {
    const fetchSlots = async () => {
        const res = await fetch(
        `http://localhost:8787/api/bookings/${slug}`
        )

        const text = await res.text()
        console.log(text)
        const data = (await res.json()) as BookingResponse

        setSlots(data.slots)
    }

    fetchSlots()
    }, [slug])

  // 日付一覧生成
  const dates = Array.from(
    new Set(slots.map((s) => dayjs(s.start).format("YYYY-MM-DD")))
  )

  // 選択日のスロット
  const filteredSlots = slots.filter(
    (s) =>
      selectedDate &&
      dayjs(s.start).format("YYYY-MM-DD") === selectedDate
  )

  // 予約
  const handleBooking = async () => {
    if (!selectedSlot) return

    setLoading(true)
    try {
      await fetch(`http://localhost:8787/api/bookings/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          start: selectedSlot.start,
          end: selectedSlot.end,
          guest_name: name,
          guest_email: email
        })
      })

      setDone(true)
    } catch {
      alert("予約失敗")
    } finally {
      setLoading(false)
    }
  }

  // 🎉 完了画面
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
      <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-3xl p-6">

        {/* タイトル */}
        <h1 className="text-xl font-semibold mb-6">
          予約を選択
        </h1>

        <div className="grid grid-cols-3 gap-6">

          {/* ① 日付 */}
          <div>
            <h3 className="text-sm text-zinc-400 mb-2">日付</h3>

            <div className="flex flex-col gap-2">
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDate(d)
                    setSelectedSlot(null)
                  }}
                  className={`px-3 py-2 rounded text-sm text-left transition
                  ${
                    selectedDate === d
                      ? "bg-blue-600"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  {dayjs(d).format("M/D (ddd)")}
                </button>
              ))}
            </div>
          </div>

          {/* ② 時間 */}
          <div>
            <h3 className="text-sm text-zinc-400 mb-2">時間</h3>

            {!selectedDate && (
              <p className="text-zinc-500 text-sm">
                日付を選択
              </p>
            )}

            <div className="flex flex-col gap-2">
              {filteredSlots.map((s) => (
                <button
                  key={s.start}
                  onClick={() => setSelectedSlot(s)}
                  className={`px-3 py-2 rounded text-sm transition
                  ${
                    selectedSlot?.start === s.start
                      ? "bg-green-600"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  {dayjs(s.start).format("HH:mm")}
                </button>
              ))}
            </div>
          </div>

          {/* ③ フォーム */}
          <div>
            <h3 className="text-sm text-zinc-400 mb-2">
              あなたの情報
            </h3>

            {!selectedSlot && (
              <p className="text-zinc-500 text-sm">
                時間を選択
              </p>
            )}

            <div className="flex flex-col gap-3">
              <input
                placeholder="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-700 px-3 py-2 rounded"
              />

              <input
                placeholder="メール"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-700 px-3 py-2 rounded"
              />

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