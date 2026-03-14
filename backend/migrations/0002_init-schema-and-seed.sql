-- Migration number: 0002 	 2026-03-12T15:31:42.088Z
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,    -- UUID を保存
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- イベントテーブル
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    candidate TEXT NOT NULL,
    start TEXT NOT NULL,   -- ISO 8601形式の日時
    end TEXT,
    date TEXT NOT NULL,    -- 日付のみでもOK
    meet_url TEXT,
    host TEXT NOT NULL,    -- users.id と紐付け
    FOREIGN KEY (host) REFERENCES users(id) ON DELETE CASCADE
);