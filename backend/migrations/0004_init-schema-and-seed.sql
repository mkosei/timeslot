-- Migration number: 0004 	 2026-03-14T14:26:11.601Z
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,    -- UUID を保存
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_types (
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
  event_type_id INTEGER NOT NULL,

  guest_name TEXT,
  guest_email TEXT NOT NULL,

  start TEXT NOT NULL,
  end TEXT NOT NULL,

  meet_url TEXT,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE CASCADE
);

-- =========================================
-- テスト用 初期データ
-- =========================================

-- users
INSERT INTO users (id, name, email) VALUES
('user_001', '山田 太郎', 'taro@example.com'),
('user_002', '佐藤 花子', 'hanako@example.com');

-- =========================================
-- event_types（予約リンクの種類）
-- =========================================
INSERT INTO event_types (user_id, title, slug, duration, description) VALUES
('user_001', '30分ミーティング', '30min-meeting', 30, '簡単な打ち合わせ用のミーティングです'),
('user_001', '1時間ミーティング', '60min-meeting', 60, '詳細な打ち合わせ用のミーティングです'),
('user_002', 'カジュアル面談', 'casual-talk', 30, 'カジュアルな面談です');

-- =========================================
-- availability（空き時間）
-- weekday
-- 0:日 1:月 2:火 3:水 4:木 5:金 6:土
-- =========================================
INSERT INTO availability (user_id, weekday, start_time, end_time) VALUES
('user_001', 1, '09:00', '12:00'),
('user_001', 1, '13:00', '18:00'),

('user_001', 2, '09:00', '12:00'),
('user_001', 2, '13:00', '18:00'),

('user_001', 3, '10:00', '17:00'),

('user_002', 1, '10:00', '16:00'),
('user_002', 3, '10:00', '16:00'),
('user_002', 5, '13:00', '18:00');

-- =========================================
-- bookings（実際の予約）
-- =========================================
INSERT INTO bookings (
  event_type_id,
  guest_name,
  guest_email,
  start,
  end,
  meet_url
) VALUES
(
  1,
  '鈴木 一郎',
  'ichiro@example.com',
  '2026-03-16T10:00:00',
  '2026-03-16T10:30:00',
  'https://meet.google.com/test-meet-1'
),
(
  2,
  '田中 美咲',
  'misaki@example.com',
  '2026-03-16T14:00:00',
  '2026-03-16T15:00:00',
  'https://meet.google.com/test-meet-2'
),
(
  3,
  '中村 健',
  'ken@example.com',
  '2026-03-18T11:00:00',
  '2026-03-18T11:30:00',
  'https://meet.google.com/test-meet-3'
);

