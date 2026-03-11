const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'manifestation.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT UNIQUE,
    password TEXT, -- Optional for Google/Phone users
    name TEXT,
    phone_number TEXT UNIQUE,
    plan TEXT DEFAULT 'free',
    subscription_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    mood TEXT,
    energy TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    streak INTEGER DEFAULT 0,
    last_manifestation_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

module.exports = db;
