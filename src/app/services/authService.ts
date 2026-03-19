import type { Session } from "../types/type"
import { API_URL, APP_URL } from "../lib/config"

export async function fetchSession(): Promise<Session>  {
  const res = await fetch(`${API_URL}/api/auth/session`, {
    credentials: "include",
  })

  return res.json()
}

export const login = () => {
  window.location.href = `${API_URL}/api/auth/signin/google?callbackUrl=${APP_URL}`
}

export const logout = () => {
  window.location.href = `${API_URL}/api/auth/signout`
}