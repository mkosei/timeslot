"use client"

import { Event } from "@/app/types/type"
import dayjs, { Dayjs } from "dayjs"
import { getEventColor } from "@/app/lib/color"

const hours = Array.from({ length: 24 }, (_, i) => (i + 8) % 24)

type Props = {
  events: Event[]
  baseDate?: Dayjs
  onSelectEvent: (event: Event) => void
}

export default function WeekView({
  events,
  baseDate = dayjs(),
  onSelectEvent,
}: Props) {

  const week = Array.from({ length: 7 }, (_, i) =>
    baseDate.startOf("week").add(i, "day")
  )

  return (
    <div className="overflow-x-auto">
      {/* Week Header */}
      <div className="grid grid-cols-[70px_repeat(7,1fr)] bg-zinc-800">
        <div />
        {week.map((day, i) => (
          <div
            key={i}
            className="py-3 text-center border-l border-zinc-700"
          >
            <div className="text-sm font-semibold text-zinc-200">
              {day.format("ddd")}
            </div>
            <div className="text-xs text-zinc-400">
              {day.format("MM/DD")}
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[70px_repeat(7,1fr)]">

        {/* Time column */}
        <div className="border-r border-zinc-700 bg-zinc-850">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-20 text-xs text-zinc-400 flex items-start justify-end pr-2 pt-2"
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {week.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="relative border-l border-zinc-700"
          >

            {hours.map((hour) => (
              <div key={hour} className="h-20" />
            ))}

{events
  .filter((e) => dayjs(e.date).isSame(day, "day"))
  .map((event) => {

    const color = getEventColor(event.guest_name || event.title)

    const startHour = parseInt(event.start.split(":")[0])
    const startMin = parseInt(event.start.split(":")[1])
    const endHour = parseInt(event.end.split(":")[0])
    const endMin = parseInt(event.end.split(":")[1])

    const adjustedStart = startHour >= 8 ? startHour - 8 : startHour + 16
    const top = adjustedStart * 80 + (startMin / 60) * 80

    const duration = ((endHour - startHour) * 60 + (endMin - startMin))
    const height = (duration / 60) * 80

    return (
      <div
        key={event.id}
        className={`
          group absolute left-2 right-2 rounded-xl p-2 shadow transition cursor-pointer
          border-l-4 ${color.bg} ${color.text} ${color.border}
          hover:opacity-80
        `}
        style={{ top, height }}
        onClick={() => onSelectEvent(event)}
      >
        <div className="text-sm font-semibold truncate">
          {event.title}
        </div>

        {/* Tooltip */}
        <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-lg bg-zinc-900 p-3 text-xs opacity-0 shadow-xl transition group-hover:opacity-100 border border-zinc-700">
          <div className="font-semibold">{event.title}</div>
          <div className="text-zinc-400">{event.guest_name}</div>
          <div className="text-zinc-500">
            {event.start} - {event.end}
          </div>
        </div>
      </div>
    )
  })}
          </div>
        ))}
      </div>
    </div>
  )
}