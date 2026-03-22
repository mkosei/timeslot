-- Migration number: 0012 	 2026-03-22T02:25:00.361Z
ALTER TABLE booking_links ADD COLUMN is_used INTEGER DEFAULT 0;