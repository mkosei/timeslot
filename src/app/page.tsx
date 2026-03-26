import dayjs from "dayjs"
export default function LandingPage() {
  const today = dayjs().format("YYYY-MM-DD")
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/8 sticky top-0 bg-[#0a0a0a]/85 backdrop-blur-md z-50">
        <div className="text-lg font-semibold tracking-tight">
          Time<span className="text-violet-400">Slot</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-white/55">
          <a href="#features" className="hover:text-white transition-colors">機能</a>
          <a href="#how" className="hover:text-white transition-colors">使い方</a>
        </div>
        <a
          href="/schedule"
          className="text-sm px-5 py-2 bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
        >
          無料で始める
        </a>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-28 pb-20 max-w-3xl mx-auto">
        <div className="inline-block text-xs text-violet-400 bg-violet-400/12 border border-violet-400/30 px-4 py-1.5 rounded-full mb-8">
          予約管理をシンプルに
        </div>
        <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight text-white mb-6">
          予約を、<span className="text-violet-400">もっとシンプル</span>に。
        </h1>
        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg mx-auto">
          リンクを共有するだけで、相手が空き時間から予約できる。調整の往復メールはもう不要です。
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="/schedule"
            className="px-7 py-3 bg-white text-zinc-900 rounded-lg text-base font-medium hover:bg-zinc-100 transition-colors"
          >
            無料で始める
          </a>
          <a
            href="#how"
            className="px-7 py-3 bg-transparent text-white border border-white/20 rounded-lg text-base font-medium hover:bg-white/5 transition-colors"
          >
            使い方を見る
          </a>
        </div>
      </section>

      {/* App Preview */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 overflow-hidden shadow-2xl">
          {/* App Header */}
          <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-3 bg-zinc-900">
            <div>
              <div className="text-base font-semibold text-zinc-100">TimeSlot</div>
              <div className="flex items-center gap-2 mt-1">
                <button className="text-xs text-zinc-400 px-2 py-0.5 rounded bg-zinc-800">Today</button>
                <div className="text-xs text-white bg-zinc-700 px-2 py-0.5 rounded">
                  {today}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs text-zinc-300 px-2 py-1 border border-zinc-600 rounded-xl">予約リンクを作成</button>
              <button className="text-xs text-zinc-300 px-2 py-1 border border-zinc-600 rounded-xl">予定を追加</button>
              <div className="flex bg-zinc-800 rounded-xl p-1 gap-0.5">
                {["day", "week", "month"].map((m) => (
                  <div
                    key={m}
                    className={`px-3 py-1 rounded-lg text-xs capitalize ${m === "day" ? "bg-zinc-700 text-white" : "text-zinc-400"}`}
                  >
                    {m}
                  </div>
                ))}
              </div>
              <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-xs font-medium">U</div>
            </div>
          </div>

          {/* DayView */}
          <div className="grid grid-cols-[60px_1fr] h-64 overflow-hidden bg-zinc-900">
            <div className="border-r border-zinc-800">
              {["09:00", "10:00", "11:00", "12:00"].map((h) => (
                <div key={h} className="h-16 flex items-start justify-end pr-2 pt-1 text-xs text-zinc-600">{h}</div>
              ))}
            </div>
            <div className="relative">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-16 border-b border-zinc-800/50" />
              ))}
              {/* Event 1 */}
              <div
                className="absolute left-2 right-2 rounded-md px-2 py-1.5 border-l-2 border-violet-400 bg-violet-400/10"
                style={{ top: "8px", height: "52px" }}
              >
                <div className="text-xs font-medium text-zinc-100">カジュアル面談</div>
                <div className="text-xs text-zinc-500 mt-0.5">09:00 – 09:30</div>
              </div>
              {/* Event 2 */}
              <div
                className="absolute left-2 right-2 rounded-md px-2 py-1.5 border-l-2 border-emerald-400 bg-emerald-400/10"
                style={{ top: "128px", height: "52px" }}
              >
                <div className="text-xs font-medium text-zinc-100">ミーティング</div>
                <div className="text-xs text-zinc-500 mt-0.5">11:00 – 11:30</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-white/30 mb-16">
      <a 
        href="https://github.com/mkosei/timeslot" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white/60 font-medium hover:text-white transition-colors"
      >
      <span className="text-white/60 font-medium">Githubリポジトリはこちらから - コントリビューション大歓迎</span>
      </a>  
      </div>

      {/* Features */}
      <section id="features" className="max-w-4xl mx-auto px-6 mb-24">
        <div className="text-center text-xs text-white/35 tracking-widest uppercase mb-3">機能</div>
        <h2 className="text-center text-2xl md:text-3xl font-medium mb-12 tracking-tight">
          必要なものだけ、すべて揃っている
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "予約リンクを作成",
              desc: "URLを共有するだけ。相手はアカウント不要で、空き時間から予約できます。",
              icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-violet-400 fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]">
                  <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                </svg>
              ),
            },
            {
              title: "カレンダー管理",
              desc: "Day / Week / Month の3つのビューで予約を一覧管理。直感的なUIで操作できます。",
              icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-violet-400 fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              ),
            },
            {
              title: "重複防止",
              desc: "既存の予約と重複するスロットは自動的に非表示に。ダブルブッキングを防ぎます。",
              icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-violet-400 fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              ),
            },
            {
              title: "Googleでログイン",
              desc: "アカウント登録不要。Googleアカウントがあればすぐに始められます。",
              icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-violet-400 fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              ),
            },
            {
              title: "1回限りのリンク",
              desc: "使い切りの予約リンクを発行可能。一度予約が入ると自動で無効化されます。",
              icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-violet-400 fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]">
                  <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
                </svg>
              ),
            },
            {
              title: "Meet URL連携",
              desc: "Google MeetのURLを予約に紐付け。オンライン会議の準備も一括管理できます。",
              icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-violet-400 fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]">
                  <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              ),
            },
          ].map((f) => (
            <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-violet-400/12 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="max-w-xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-white/35 tracking-widest uppercase mb-3">使い方</div>
        <h2 className="text-2xl md:text-3xl font-medium mb-12 tracking-tight">3ステップで始められる</h2>
        <div className="text-left flex flex-col">
          {[
            { n: "1", title: "Googleでログイン", desc: "アカウント登録不要。Googleアカウントがあればすぐに始められます。" },
            { n: "2", title: "予約リンクを作成", desc: "ミーティング時間・受付期間を設定して、リンクを発行。相手に共有するだけです。" },
            { n: "3", title: "予約完了", desc: "相手が空き時間を選ぶと予約完了。カレンダーに自動で反映されます。" },
          ].map((s, i, arr) => (
            <div key={s.n} className="flex gap-6 py-6 relative">
              {i < arr.length - 1 && (
                <div className="absolute left-[17px] top-14 bottom-0 w-px bg-white/8" />
              )}
              <div className="w-9 h-9 rounded-full bg-violet-400/12 border border-violet-400/30 flex items-center justify-center text-sm text-violet-400 font-medium flex-shrink-0">
                {s.n}
              </div>
              <div>
                <h3 className="text-base font-medium mb-1.5">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-lg mx-auto px-6 mb-24 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12">
          <h2 className="text-2xl md:text-3xl font-medium mb-4 tracking-tight">今すぐ無料で始めよう</h2>
          <p className="text-base text-white/45 mb-8">クレジットカード不要。Googleアカウントがあればすぐに使えます。</p>
          <a
            href="/schedule"
            className="inline-block px-8 py-3.5 bg-white text-zinc-900 rounded-lg text-base font-medium hover:bg-zinc-100 transition-colors"
          >
            Googleで始める
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center text-sm text-white/25">
        © 2026 TimeSlot. All rights reserved.
      </footer>
    </div>
  )
}
