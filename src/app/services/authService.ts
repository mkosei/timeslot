import type { Session } from "../types/type"
import { API_URL, APP_URL } from "../lib/config"

export async function fetchSession(): Promise<Session>  {
  const res = await fetch(`${API_URL}/api/auth/session`, {
    credentials: "include",
  })

  return res.json()
}

export const login = async () => {
  const res = await fetch(`${API_URL}/api/auth/csrf`, {
    credentials: 'include',
  })
  const data = await res.json() as { csrfToken: string }

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = `${API_URL}/api/auth/signin/google`

  const csrfInput = document.createElement('input')
  csrfInput.name = 'csrfToken'
  csrfInput.value = data.csrfToken
  form.appendChild(csrfInput)

  const callbackInput = document.createElement('input')
  callbackInput.name = 'callbackUrl'
  callbackInput.value = APP_URL + '/schedule'
  form.appendChild(callbackInput)

  document.body.appendChild(form)
  form.submit()
}

export const logout = () => {
  window.location.href = `${API_URL}/api/auth/signout`
}