-- Migration number: 0001 	 2026-03-12T07:00:09.965Z
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,    -- UUID を保存
    name TEXT NOT NULL,
    email TEXT NOT NULL
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

INSERT INTO users (id, name, email) VALUES
('550e8400-e29b-41d4-a716-446655440000', '山田 太郎', 'taro.yamada@example.jp'),
('660e8400-e29b-41d4-a716-446655440001', '佐藤 花子', 'hanako.sato@example.jp'),
('770e8400-e29b-41d4-a716-446655440002', '鈴木 次郎', 'jiro.suzuki@example.jp');

INSERT INTO events (id, title, candidate, start, end, date, meet_url, host) VALUES
(1, '朝会', '山田 太郎', '2026-03-12T09:00:00+09:00', '2026-03-12T09:30:00+09:00', '2026-03-12', 'https://meet.example.jp/abc123', '550e8400-e29b-41d4-a716-446655440000'),
(2, 'プロジェクト会議', '佐藤 花子', '2026-03-12T10:00:00+09:00', '2026-03-12T11:00:00+09:00', '2026-03-12', 'https://meet.example.jp/def456', '660e8400-e29b-41d4-a716-446655440001'),
(3, 'コードレビュー', '鈴木 次郎', '2026-03-12T11:30:00+09:00', '2026-03-12T12:00:00+09:00', '2026-03-12', 'https://meet.example.jp/ghi789', '770e8400-e29b-41d4-a716-446655440002');