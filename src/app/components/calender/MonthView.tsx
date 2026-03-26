import dayjs, { Dayjs } from "dayjs"
import { Event } from "@/app/types/type"
import { getEventColor } from "@/app/lib/color"

type Props = {
  events: Event[]
  onSelectDate: (date: Dayjs) => void
}

export default function MonthView({ events, onSelectDate }: Props) {
  const start = dayjs().startOf("month").startOf("week")

  const days = Array.from({ length: 42 }, (_, i) => start.add(i, "day"))

  return (
    <div className="grid grid-cols-7 gap-0.5">
      {days.map((day, i) => {
        const dayEvents = events.filter((e) =>
          dayjs(e.date).isSame(day, "day")
        )

        const visibleEvents = dayEvents.slice(0, 4)
        const hiddenCount = dayEvents.length - visibleEvents.length

        return (
          <div
            key={i}
            className="relative h-32 border-t border-zinc-700 p-2 text-xs bg-zinc-900 cursor-pointer"
            onClick={() => onSelectDate(day)}
          >
            {/* 日付 */}
            <div className="text-zinc-400">{day.date()}</div>

            {/* 表示するイベント（最大3件） */}
            {visibleEvents.map((e) => {
              const color = getEventColor(e.guest_name || e.title)

              return (
                <div
                  key={e.id}
                  className={`
                    group mt-1 truncate rounded px-1 py-0.5 text-[10px] relative
                    border-l-2 ${color.bg} ${color.text} ${color.border}
                  `}
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
              )
            })}

            {/* +more表示 */}
            {hiddenCount > 0 && (
              <div className="mt-1 text-[10px] text-blue-400">
                +{hiddenCount} more
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}