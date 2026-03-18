-- Migration number: 0009 	 2026-03-17T12:42:35.937Z
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,    -- UUID を保存
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 空き時間
CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  weekday INTEGER NOT NULL, -- 0=Sun

  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 予約
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
  user_id INTEGER NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  duration INTEGER NOT NULL, -- 分（例: 30）
  meet_url TEXT,
  days_ahead INTEGER DEFAULT 7,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE booking_links
ADD COLUMN start_time TEXT DEFAULT '09:00';

ALTER TABLE booking_links
ADD COLUMN end_time TEXT DEFAULT '18:00';