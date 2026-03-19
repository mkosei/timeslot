"use client"

import { useState, useEffect, useRef } from "react"
import { login, logout } from "@/app/services/authService"

export default function UserMenu({ session }: { session: any }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])



  if (!session?.user) {
    return (
      <button
        onClick={() => login}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded text-sm font-medium"
      >
        ログイン
      </button>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* avatar */}
      <img
        src={session.user.image}
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full cursor-pointer"
      />

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}