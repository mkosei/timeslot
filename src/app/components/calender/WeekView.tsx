"use client"

import { Event } from "@/app/schedule/page"
import dayjs, { Dayjs } from "dayjs"

const hours = Array.from({ length: 24 }, (_, i) => (i + 8) % 24)

type Props = {
  events: Event[]
  baseDate?: Dayjs // 任意で週の基準日を渡せる
}

export default function WeekView({ events, baseDate = dayjs() }: Props) {
  // baseDate の週の日曜日を起点に7日分生成
  const week = Array.from({ length: 7 }, (_, i) =>
    baseDate.startOf("week").add(i, "day")
  )

  return (
    <div className="overflow-x-auto">
      {/* Week Header */}
      <div className="grid grid-cols-[70px_repeat(7,1fr)] bg-zinc-800">
        <div /> {/* 左上の空白 */}
        {week.map((day, i) => (
          <div
            key={i}
            className="py-3 text-center border-l border-zinc-700 last:border-r-0"
          >
            <div className="text-sm font-semibold text-zinc-200">
              {day.format("ddd")} {/* 曜日 */}
            </div>
            <div className="text-xs text-zinc-400">
              {day.format("MM/DD")} {/* 日付 */}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
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
            className="relative border-l border-zinc-700 last:border-r-0"
          >
            {/* Grid lines */}
            {hours.map((hour) => (
              <div key={hour} className="h-20" />
            ))}

            {/* Events */}
            {events
              .filter((e) => dayjs(e.date).isSame(day, "day")) // 日付ベースでフィルタ
              .map((event) => {
                const startHour = parseInt(event.start.split(":")[0])
                const startMin = parseInt(event.start.split(":")[1])
                const endHour = parseInt(event.end.split(":")[0])
                const endMin = parseInt(event.end.split(":")[1])

                // 8:00 〜 翌8:00 に合わせて調整
                const adjustedStart = startHour >= 8 ? startHour - 8 : startHour + 16
                const top = adjustedStart * 80 + (startMin / 60) * 80

                const duration = ((endHour - startHour) * 60 + (endMin - startMin))
                const height = (duration / 60) * 80

                return (
                  <div
                    key={event.id}
                    className="group absolute left-2 right-2 rounded-xl bg-blue-600 p-2 text-white shadow hover:bg-blue-500 transition cursor-pointer"
                    style={{ top, height }}
                  >
                    <div className="text-sm font-semibold truncate">
                      {event.title}
                    </div>

                    {/* Tooltip */}
                    <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-lg bg-zinc-900 p-3 text-xs opacity-0 shadow-xl transition group-hover:opacity-100 border border-zinc-700">
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-zinc-400">{event.candidate}</div>
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