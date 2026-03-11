const express = require('express');
const db = require('../db');
const router = express.Router();

// Mock upgrade endpoint
router.post('/upgrade', async (req, res) => {
  const { userId, plan } = req.body;
  
  if (!userId || !plan) {
    return res.status(400).json({ error: 'User ID and plan are required' });
  }

  try {
    // Set subscription to 1 month from now for mockup
    const subscriptionUntil = new Date();
    subscriptionUntil.setMonth(subscriptionUntil.getMonth() + 1);
    
    db.prepare('UPDATE users SET plan = ?, subscription_until = ? WHERE id = ?').run(
      plan,
      subscriptionUntil.toISOString(),
      userId
    );

    const user = db.prepare('SELECT id as uid, * FROM users WHERE id = ?').get(userId);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Upgrade failed:', error);
    res.status(500).json({ error: 'Upgrade failed' });
  }
});

module.exports = router;
