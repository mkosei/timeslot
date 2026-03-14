-- Migration number: 0003 	 2026-03-14T13:52:13.332Z
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,    -- UUID を保存
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  duration INTEGER NOT NULL, -- 分
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 空き時間
CREATE TABLE availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  weekday INTEGER NOT NULL, -- 0=Sun

  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 予約
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type_id INTEGER NOT NULL,

  guest_name TEXT,
  guest_email TEXT NOT NULL,

  start TEXT NOT NULL,
  end TEXT NOT NULL,

  meet_url TEXT,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE CASCADE
);

