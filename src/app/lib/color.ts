type ColorStyle = {
  bg: string
  text: string
  border: string
}

const colorMap: ColorStyle[] = [
  {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500"
  },
  {
    bg: "bg-green-500/15",
    text: "text-green-300",
    border: "border-green-500"
  },
  {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    border: "border-purple-500"
  },
  {
    bg: "bg-pink-500/15",
    text: "text-pink-300",
    border: "border-pink-500"
  },
  {
    bg: "bg-yellow-500/15",
    text: "text-yellow-300",
    border: "border-yellow-500"
  },
  {
    bg: "bg-indigo-500/15",
    text: "text-indigo-300",
    border: "border-indigo-500"
  }
]

const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export const getEventColor = (key: string): ColorStyle => {
  const index = hashString(key) % colorMap.length
  return colorMap[index]
}