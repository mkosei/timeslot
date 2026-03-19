import * as v from "valibot"

export const formatErrors = (issues: v.BaseIssue<unknown>[]) => {
  const errors: Record<string, string> = {}

  for (const issue of issues) {
    const key = issue.path?.[0]?.key as string
    if (key) {
      errors[key] = issue.message
    }
  }

  return errors
}