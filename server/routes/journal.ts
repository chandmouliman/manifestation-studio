const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_manifestation_secret_key';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get('/', authenticateToken, (req, res) => {
  try {
    const entries = db.prepare('SELECT * FROM journal_entries WHERE user_id = ? ORDER BY date DESC').all(req.user.id);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  const { content, mood, energy } = req.body;
  try {
    const result = db.prepare('INSERT INTO journal_entries (user_id, content, mood, energy) VALUES (?, ?, ?, ?)').run(req.user.id, content, mood, energy);
    res.status(201).json({ id: result.lastInsertRowid, content, mood, energy });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
