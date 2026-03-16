import { Event } from "@/app/types/type"

export default function EventCard({
  event,
  top,
  height,
}: {
  event: Event
  top: number
  height: number
}) {
  return (
    <div
      className="absolute left-2 right-2 rounded-xl bg-blue-600 p-2 text-white shadow hover:bg-blue-500 transition"
      style={{ top, height }}
    >

  <div className="flex items-center gap-3 text-sm">
    <span className="font-semibold">
      {event.title}
    </span>

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