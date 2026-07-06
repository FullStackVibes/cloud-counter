/**
 * CloudCounter - Backend Database Setup (Milestone 1)
 * Handles SQLite initialization and connection using native 'sqlite3'.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Local file database named 'database.sqlite' inside the backend folder
const dbPath = path.join(__dirname, 'database.sqlite');

// Open or create the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[SQLite] Error opening SQLite database:', err.message);
  } else {
    console.log('[SQLite] Connected to local file database at:', dbPath);

    // Initialize schema upon connection
    db.serialize(() => {
      // Create table named 'counters' if it doesn't already exist
      db.run(`
        CREATE TABLE IF NOT EXISTS counters (
          id TEXT PRIMARY KEY,
          count INTEGER DEFAULT 0
        )
      `, (err) => {
        if (err) {
          console.error('[SQLite] Error creating counters table:', err.message);
        } else {
          // Ensure a single row with id = 'global_counter' is inserted with starting count 0
          db.run(`
            INSERT OR IGNORE INTO counters (id, count)
            VALUES ('global_counter', 0)
          `, (err) => {
            if (err) {
              console.error('[SQLite] Error initializing global_counter row:', err.message);
            } else {
              console.log('[SQLite] Database initialized successfully with global_counter row.');
            }
          });
        }
      });
    });
  }
});

// Export database instance object so server can run queries against it
module.exports = db;
