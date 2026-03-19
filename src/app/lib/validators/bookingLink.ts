import * as v from "valibot"

export const bookingLinkSchema = v.pipe(
  v.object({
    title: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, "タイトルは必須です")
    ),

    duration: v.pipe(
      v.number(),
      v.minValue(15, "15〜120分で入力してください"),
      v.maxValue(120, "15〜120分で入力してください")
    ),

    days: v.pipe(
      v.number(),
      v.minValue(1, "1〜365で入力してください"),
      v.maxValue(365, "1〜365で入力してください")
    ),

    startTime: v.string(),
    endTime: v.string(),

    meetUrl: v.optional(
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