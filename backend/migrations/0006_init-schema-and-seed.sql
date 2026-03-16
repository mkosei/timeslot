-- Migration number: 0006 	 2026-03-15T13:40:49.437Z
-- =========================================
-- テーブルを丸ごとリセット
-- =========================================
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS users;

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
  guest_name TEXT NOT NULL, --ここNULL許容するか
  guest_email TEXT NOT NULL, --ここも

  start TEXT NOT NULL,
  end TEXT NOT NULL,

  meet_url TEXT,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- テスト用 初期データ
-- =========================================

-- users
INSERT INTO users (id, name, email) VALUES
('user_001', '山田 太郎', 'taro@example.com'),
('user_002', '佐藤 花子', 'hanako@example.com');

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
  user_id,
  title,
  guest_name,
  guest_email,
  start,
  end,
  meet_url
) VALUES
(
  'user_001',
  'カジュアル面談',     
  '鈴木 一郎',   
  'ichiro@example.com', 
  '2026-03-16T10:00:00',
  '2026-03-16T10:30:00',
  'https://meet.google.com/test-meet-1'
),
(
  'user_001',
  '一次面接',
  '田中 美咲',
  'misaki@example.com',
  '2026-03-16T14:00:00',
  '2026-03-16T15:00:00',
  'https://meet.google.com/test-meet-2'
),
(
  'user_002',
  '最終面接',
  '中村 健',
  'ken@example.com',
  '2026-03-18T11:00:00',
  '2026-03-18T11:30:00',
  'https://meet.google.com/test-meet-3'
);
