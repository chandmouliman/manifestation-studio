const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware to log user activity
const logActivity = (userId: string, action: string, details?: string) => {
  try {
    db.prepare('INSERT INTO activity_log (user_id, action, details) VALUES (?, ?, ?)').run(
      userId,
      action,
      details || null
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

router.post('/log', (req: any, res: any) => {
  const { userId, action, details } = req.body;
  if (!userId || !action) {
    return res.status(400).json({ error: 'Missing userId or action' });
  }

  logActivity(userId, action, details);
  res.json({ success: true });
});

module.exports = {
  router,
  logActivity
};
