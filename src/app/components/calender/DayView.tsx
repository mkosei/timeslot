import { Event } from "@/app/schedule/page"
import EventCard from "./EventCard"
import dayjs, { Dayjs } from "dayjs"

const hours = Array.from({ length: 24 }, (_, i) => (i + 8) % 24)

type Props = {
  events: Event[]
  selectedDate: Dayjs
}

export default function DayView({ events, selectedDate }: Props) {
  // 日付単位でフィルター
  const dayEvents = events.filter(
    (e) => e.date === selectedDate.format("YYYY-MM-DD")
  )

  return (
    <div className="grid grid-cols-[70px_1fr] min-h-screen">
      {/* 時間軸 */}
      <div className="border-r border-zinc-700 bg-zinc-800">
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-20 text-xs text-zinc-400 flex items-start justify-end pr-2 pt-2"
          >
            {hour.toString().padStart(2, "0")}:00
          </div>
        ))}
      </div>

      {/* カレンダー */}
      <div className="relative flex-1 bg-zinc-800">
        {hours.map((h) => (
          <div key={h} className="h-20" />
        ))}

        {dayEvents.map((event) => {
          const [startHour, startMin] = event.start.split(":").map(Number)
          const [endHour, endMin] = event.end.split(":").map(Number)

          const adjustedStart = startHour >= 8 ? startHour - 8 : startHour + 16
          const top = adjustedStart * 80 + (startMin / 60) * 80
          const height =
            ((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 80

          return (
            <EventCard
              key={event.id}
              event={event}
              top={top}
              height={height}
            />
          )
        })}
      </div>
    </div>
  )
}