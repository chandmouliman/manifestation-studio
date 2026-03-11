const express = require('express');
const db = require('../db');
const admin = require('../firebase');
const router = express.Router();

// Synchronize Firebase user with local SQLite DB
router.post('/firebase', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const { email, name, phone } = req.body;

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE id = ?').get(uid);

    if (!user) {
      // Create new user
      db.prepare('INSERT INTO users (id, email, name, phone_number) VALUES (?, ?, ?, ?)').run(
        uid, 
        email || decodedToken.email || null, 
        name || decodedToken.name || null, 
        phone || decodedToken.phone_number || null
      );
      // Initialize stats
      db.prepare('INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)').run(uid);
      
      user = db.prepare('SELECT id as uid, * FROM users WHERE id = ?').get(uid);
    } else {
      // Update existing user info if needed
      db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone_number = COALESCE(?, phone_number) WHERE id = ?').run(
        name || decodedToken.name || null,
        email || decodedToken.email || null,
        phone || decodedToken.phone_number || null,
        uid
      );
      user = db.prepare('SELECT id as uid, * FROM users WHERE id = ?').get(uid);
    }

    user.photoURL = decodedToken.picture || null;
    res.json({ user });
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Legacy routes can be removed or kept as wrappers if needed, 
// but recommended to use /firebase for all multi-auth.

module.exports = router;
