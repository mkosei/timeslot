import * as v from "valibot"

export const createBookingSchema = v.pipe(
  v.object({
    title: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, "タイトルは必須です")
    ),

    guestName: v.pipe(
      v.string(),
      v.trim()
    ),

    guestEmail: v.optional(
      v.pipe(
        v.string(),
        v.trim(),
        v.email("メール形式が不正です")
      )
    ),

    date: v.pipe(
      v.string(),
      v.minLength(1, "日付を選択してください")
    ),

    startTime: v.pipe(
      v.string(),
      v.regex(/^\d{2}:\d{2}$/, "HH:mm形式で入力してください")
    ),

    endTime: v.pipe(
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
    (data) => data.startTime < data.endTime,
    "開始は終了より前にしてください"
  )
)