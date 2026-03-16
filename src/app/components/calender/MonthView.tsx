import dayjs, { Dayjs } from "dayjs"
import { Event } from "@/app/types/type"

type Props = {
  events: Event[]
  onSelectDate: (date: Dayjs) => void
}

export default function MonthView({ events, onSelectDate }: Props) {
  const start = dayjs().startOf("month").startOf("week")

  const days = Array.from({ length: 42 }, (_, i) => start.add(i, "day"))

  return (
    <div className="grid grid-cols-7 gap-0.5">
      {days.map((day, i) => (
        <div
          key={i}
          className="relative h-32 border-t border-zinc-700 p-2 text-xs bg-zinc-800 cursor-pointer"
          onClick={() => onSelectDate(day)}
        >
          {/* 日付 */}
          <div className="text-zinc-400">{day.date()}</div>

          {/* その日のイベント */}
          {events
            .filter((e) => dayjs(e.date).isSame(day, "day")) // ← 日付ベースで比較
            .map((e) => (
              <div
                key={e.id}
                className="group mt-1 truncate rounded bg-blue-600 px-1 py-0.5 text-[10px] relative"
              >
                {e.title}

                {/* ホバーツールチップ */}
                <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 w-40 -translate-x-1/2 rounded-lg bg-zinc-900 p-2 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100 border border-zinc-700">
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-zinc-400">{e.guest_name}</div>
                  <div className="text-zinc-500">
                    {e.start} - {e.end}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}