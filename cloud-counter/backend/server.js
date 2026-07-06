/**
 * CloudCounter - Backend Express API Server (Milestone 1)
 * Main Express app and API endpoint logic listening on port 5000.
 */

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup standard Express middleware utilizing 'cors' and 'express.json()'
app.use(cors());
app.use(express.json());

// Helper function: Execute a database SELECT query wrapped in a Promise
const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function: Execute a database UPDATE/INSERT query wrapped in a Promise
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

/**
 * GET /api/count
 * Query the 'counters' table for the row where id = 'global_counter'.
 * Return the count value as a JSON object: { count: X }.
 */
app.get('/api/count', async (req, res) => {
  try {
    const row = await dbGet('SELECT count FROM counters WHERE id = ?', ['global_counter']);
    if (!row) {
      // Fallback in case table row initialization is delayed
      return res.status(200).json({ count: 0 });
    }
    return res.status(200).json({ count: row.count });
  } catch (error) {
    console.error('[API Error] GET /api/count failed:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve counter from database.' });
  }
});

/**
 * POST /api/increment
 * Update the 'global_counter' row by incrementing the 'count' column by exactly +1.
 * Query the database for the updated row, and return that updated number as a JSON object: { count: X }.
 */
app.post('/api/increment', async (req, res) => {
  try {
    await dbRun('UPDATE counters SET count = count + 1 WHERE id = ?', ['global_counter']);
    const row = await dbGet('SELECT count FROM counters WHERE id = ?', ['global_counter']);
    const updatedCount = row ? row.count : 1;
    return res.status(200).json({ count: updatedCount });
  } catch (error) {
    console.error('[API Error] POST /api/increment failed:', error.message);
    return res.status(500).json({ error: 'Failed to increment counter in database.' });
  }
});

// Start listening on port 5000 as required
if (require.main === module) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CloudCounter] API Server running and listening on port ${PORT}`);
  });
  server.on('error', (err) => {
    console.error(`[CloudCounter] Server error on port ${PORT}:`, err.message);
  });
}

module.exports = app;
