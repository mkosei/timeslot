import { signIn, signOut } from "next-auth/react"
import { getSession } from "next-auth/react"

export async function fetchSession() {
  return getSession()
}
export const login = () => signIn("google", { callbackUrl: "/schedule" })
export const logout = () => signOut({ callbackUrl: "/schedule" })