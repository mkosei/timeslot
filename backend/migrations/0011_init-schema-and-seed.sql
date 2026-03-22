-- Migration number: 0011 	 2026-03-21T05:26:10.955Z
CREATE TABLE bookings_new (
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

INSERT INTO bookings_new SELECT * FROM bookings;
DROP TABLE bookings;
ALTER TABLE bookings_new RENAME TO bookings;