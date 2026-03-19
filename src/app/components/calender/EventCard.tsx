import { Event } from "@/app/types/type"
import { getEventColor } from "@/app/lib/color"

export default function EventCard({
  event,
  top,
  height,
  onSelect
}: {
  event: Event
  top: number
  height: number
  onSelect: (event: Event) => void
}) {

  const color = getEventColor(event.guest_name || event.title)

  return (
    <div
      className={`
        absolute left-2 right-2 rounded-xl p-2 shadow transition cursor-pointer
        border-l-4 ${color.bg} ${color.text} ${color.border}
        hover:opacity-80
      `}
      style={{ top, height }}
      onClick={() => onSelect(event)}
    >
      <div className="flex items-center gap-3 text-sm">
        <span className="font-semibold">{event.title}</span>

        <span className="text-xs opacity-80">
          {event.guest_name}
        </span>

        <span className="text-xs opacity-70">
          {event.start} - {event.end}
        </span>
      </div>
    </div>
  )
}