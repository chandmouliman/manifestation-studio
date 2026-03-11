const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_manifestation_secret_key';

const isAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get('/stats', isAdmin, (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const entryCount = db.prepare('SELECT COUNT(*) as count FROM journal_entries').get();
    const recentUsers = db.prepare('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 10').all();
    
    res.json({
      users: userCount,
      entries: entryCount,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
