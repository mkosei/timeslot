export const sanitize = (str: string) => str.replace(/[<>]/g, "")

export const isValidTimeRange = (start: string, end: string) => start < end

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}