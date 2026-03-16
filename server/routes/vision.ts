const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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

// Get all vision board items for a user
router.get('/', authenticateToken, (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM vision_board_items WHERE user_id = ? ORDER BY timestamp DESC').all(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new vision board item
router.post('/', authenticateToken, (req, res) => {
  const { type, content, bgClass } = req.body;
  try {
    const result = db.prepare('INSERT INTO vision_board_items (user_id, type, content, bg_class) VALUES (?, ?, ?, ?)').run(req.user.id, type, content, bgClass);
    res.status(201).json({ id: result.lastInsertRowid, type, content, bgClass });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a vision board item
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM vision_board_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
