import * as v from "valibot"

export const bookingFromLinkSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "名前は必須です")
  ),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "メールは必須です"),
    v.email("メール形式が不正です")
  )
})