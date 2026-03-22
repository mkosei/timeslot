import { Session } from "next-auth"

export function getAuthHeaders(session: Session | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-user-id": session?.user?.id ?? "",
    "x-user-name": encodeURIComponent(session?.user?.name ?? ""),
    "x-user-email": session?.user?.email ?? "",
  }
}