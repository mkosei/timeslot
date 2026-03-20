
import { login } from "@/app/services/authService"

export default function LoginModal({ open }: { open: boolean }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white">TimeSlotへようこそ</h2>
        <p className="text-zinc-400 text-sm">続けるにはログインしてください</p>
        <button
          onClick={login}
          className="flex items-center gap-3 px-6 py-3 bg-white text-zinc-900 rounded-xl font-medium hover:bg-zinc-100 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Googleでログイン
        </button>
      </div>
    </div>
  )
}