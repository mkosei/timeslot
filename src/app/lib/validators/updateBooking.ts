import * as v from "valibot"

export const updateBookingSchema = v.pipe(
  v.object({
    title: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, "タイトルは必須です")
    ),

    guest_name: v.pipe(
      v.string(),
      v.trim()
    ),

    guest_email: v.optional(
      v.pipe(
        v.string(),
        v.trim(),
        v.email("メール形式が不正です")
      )
    ),

    date: v.string(),

    start: v.pipe(
      v.string(),
      v.regex(/^\d{2}:\d{2}$/, "HH:mm形式で入力してください")
    ),

    end: v.pipe(
      v.string(),
      v.regex(/^\d{2}:\d{2}$/, "HH:mm形式で入力してください")
    ),

    url: v.optional(
      v.pipe(
        v.string(),
        v.trim(),
        v.url("URL形式が不正です")
      )
    )
  }),

  v.check(
    (data) => data.start < data.end,
    "開始は終了より前にしてください"
  )
)   