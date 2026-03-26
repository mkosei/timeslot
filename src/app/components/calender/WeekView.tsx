"use client"

import { Event } from "@/app/types/type"
import dayjs, { Dayjs } from "dayjs"
import { getEventColor } from "@/app/lib/color"
import { useState } from "react"
import TooltipPortal from "./Tooltip"

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

  const [rect, setRect] = useState<DOMRect | null>(null)
  const [hovered, setHovered] = useState<Event | null>(null)

  const week = Array.from({ length: 7 }, (_, i) =>
    baseDate.startOf("week").add(i, "day")
  )

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="grid grid-cols-[70px_repeat(7,1fr)] bg-zinc-900">
        <div />
        {week.map((day, i) => (
          <div key={i} className="py-3 text-center border-l border-zinc-700">
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

        {/* Time */}
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

        {/* Days */}
        {week.map((day, dayIndex) => (
          <div key={dayIndex} className="relative border-l border-zinc-700">

            {/* grid */}
            {hours.map((hour) => (
              <div key={hour} className="h-20" />
            ))}

            {/* events */}
            {events
              .filter((e) => dayjs(e.date).isSame(day, "day"))
              .map((event) => {

                const color = getEventColor(event.guest_name || event.title)

                const [startHour, startMin] = event.start.split(":").map(Number)
                const [endHour, endMin] = event.end.split(":").map(Number)

                const adjustedStart =
                  startHour >= 8 ? startHour - 8 : startHour + 16

                const top = adjustedStart * 80 + (startMin / 60) * 80

                const duration =
                  (endHour - startHour) * 60 + (endMin - startMin)

                const height = (duration / 60) * 80

                return (
                  <div
                    key={event.id}
                    className={`
                      absolute left-2 right-2 rounded-xl p-2 shadow transition cursor-pointer
                      border-l-4 ${color.bg} ${color.text} ${color.border}
                      hover:opacity-80
                    `}
                    style={{ top, height }}
                    onClick={() => onSelectEvent(event)}
                    onMouseEnter={(e) => {
                      setRect(e.currentTarget.getBoundingClientRect())
                      setHovered(event)
                    }}
                    onMouseLeave={() => {
                      setRect(null)
                      setHovered(null)
                    }}
                  >
                    <div className="text-sm font-semibold truncate">
                      {event.title}
                    </div>
                  </div>
                )
              })}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      <TooltipPortal rect={rect}>
        {hovered && (() => {
          const color = getEventColor(hovered.guest_name || hovered.title)

          return (
            <>
              {/* title */}
              <div className={`font-medium text-xs leading-tight ${color.text}`}>
                {hovered.title}
              </div>

              {/* guest */}
              <div className={`mt-1 text-[10px] border-l-2 pl-2 ${color.border}`}>
                {hovered.guest_name}
              </div>

              {/* time */}
              <div className="mt-1 text-[10px] text-zinc-400 border-t border-zinc-800 pt-1">
                {hovered.start} - {hovered.end}
              </div>
            </>
          )
        })()}
      </TooltipPortal>
    </div>
  )
}