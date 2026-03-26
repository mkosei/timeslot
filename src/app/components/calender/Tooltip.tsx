"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type Props = {
  children: React.ReactNode
  rect: DOMRect | null
}

export default function TooltipPortal({ children, rect }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !rect) return null

  const { bottom, left, width } = rect

  return createPortal(
    <div
      className="fixed z-[9999] -translate-x-1/2 bg-black/95 text-white p-2 rounded-lg text-xs shadow-xl border border-zinc-700 w-48"
      style={{
        top: bottom + 6,
        left: left + width / 2,
      }}
    >
      {children}
    </div>,
    document.body
  )
}