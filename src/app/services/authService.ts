import type { Session } from "../types/type"

export async function fetchSession(): Promise<Session>  {
  const res = await fetch("http://localhost:8787/api/auth/session", {
    credentials: "include",
  })

  return res.json()
}