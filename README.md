# Timeslot

**English** | [日本語](#日本語)

A simple, open-source scheduling tool. Share your availability via a booking link and let others book time with you — no back-and-forth emails needed.

**[Live Demo](https://timeslot-kohl.vercel.app)**

---

## Features

- Google OAuth authentication
- Manage your bookings from a clean dashboard
- Generate shareable booking links
- Set your available hours and buffer time
- Self-hostable — own your data

## Tech Stack

- **Frontend / API**: Next.js (App Router)
- **Database**: Turso (SQLite)
- **Auth**: NextAuth.js
- **Validation**: Valibot
- **Routing**: Hono

---

## Self-Hosting

### Prerequisites

- Node.js 18+
- A [Turso](https://turso.tech) account (free tier available)
- A Google OAuth app ([Google Cloud Console](https://console.cloud.google.com))
- A [Vercel](https://vercel.com) account (or any Node.js hosting)

### 1. Clone the repository
```bash
git clone https://github.com/mkosei/timeslot
cd timeslot
npm install
```

### 2. Set up Turso
```bash
brew install tursodatabase/tap/turso
turso auth login
turso db create timeslot
turso db shell timeslot
```

Run the following SQL in the shell:
```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  guest_name TEXT,
  guest_email TEXT,
  start TEXT NOT NULL,
  end TEXT NOT NULL,
  meet_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  duration INTEGER NOT NULL,
  meet_url TEXT,
  days_ahead INTEGER DEFAULT 7,
  start_time TEXT DEFAULT '09:00',
  end_time TEXT DEFAULT '18:00',
  title TEXT DEFAULT 'Meeting',
  is_used INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

Then get your credentials:
```bash
turso db show timeslot --url
turso db tokens create timeslot
```

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the **Google+ API**
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI (and your production URL)

### 4. Configure environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
AUTH_SECRET=           # Run: openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TURSO_URL=             # libsql://...
TURSO_AUTH_TOKEN=
```

### 5. Run locally
```bash
npm run dev
```

### 6. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Add the same environment variables in your Vercel project settings.

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

[MIT](./LICENSE)

---

# 日本語

オープンソースのシンプルなスケジュール管理ツールです。予約リンクを共有して、相手に空き時間を選んでもらえます。

**[デモ](https://timeslot-kohl.vercel.app)**

---

## 機能

- Google OAuth 認証
- 予約の管理ダッシュボード
- 共有可能な予約リンクの生成
- 利用可能時間の設定
- セルフホスト対応 — データを自分で管理

## 技術スタック

- **フロントエンド / API**: Next.js (App Router)
- **データベース**: Turso (SQLite)
- **認証**: NextAuth.js
- **バリデーション**: Valibot
- **ルーティング**: Hono

---

## セルフホスト手順

### 必要なもの

- Node.js 18以上
- [Turso](https://turso.tech) アカウント（無料枠あり）
- Google OAuth アプリ（[Google Cloud Console](https://console.cloud.google.com)）
- [Vercel](https://vercel.com) アカウント（またはNode.js対応のホスティング）

### 1. リポジトリをクローン
```bash
git clone https://github.com/mkosei/timeslot
cd timeslot
npm install
```

### 2. Turso のセットアップ
```bash
brew install tursodatabase/tap/turso
turso auth login
turso db create timeslot
turso db shell timeslot
```

シェルで以下のSQLを実行してください：
```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  guest_name TEXT,
  guest_email TEXT,
  start TEXT NOT NULL,
  end TEXT NOT NULL,
  meet_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  duration INTEGER NOT NULL,
  meet_url TEXT,
  days_ahead INTEGER DEFAULT 7,
  start_time TEXT DEFAULT '09:00',
  end_time TEXT DEFAULT '18:00',
  title TEXT DEFAULT 'Meeting',
  is_used INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

次に接続情報を取得します：
```bash
turso db show timeslot --url
turso db tokens create timeslot
```

### 3. Google OAuth の設定

1. [Google Cloud Console](https://console.cloud.google.com) を開く
2. 新しいプロジェクトを作成
3. **Google+ API** を有効化
4. OAuth 2.0 認証情報を作成
5. 承認済みリダイレクトURIに `http://localhost:3000/api/auth/callback/google`（および本番環境のURL）を追加

### 4. 環境変数の設定
```bash
cp .env.example .env.local
```

`.env.local` を以下のように埋めてください：
```env
AUTH_SECRET=           # 生成コマンド: openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TURSO_URL=             # libsql://...
TURSO_AUTH_TOKEN=
```

### 5. ローカルで起動
```bash
npm run dev
```

### 6. Vercel にデプロイ
```bash
npm install -g vercel
vercel
```

Vercelのプロジェクト設定から同じ環境変数を追加してください。

---

## コントリビュート

コントリビューション大歓迎です！Issueを立てたり、Pull Requestを送ってください。

1. リポジトリをフォーク
2. ブランチを作成（`git checkout -b feature/your-feature`）
3. 変更をコミット
4. ブランチをプッシュ
5. Pull Request を作成

---

## ライセンス

[MIT](./LICENSE)