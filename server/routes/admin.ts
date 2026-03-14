const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const admin = require('../firebase');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_manifestation_secret_key';

const isAdmin = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    // Check if it's our designated admin JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.admin) {
      req.user = decoded;
      return next();
    }
    
    // Fallback/Legacy: Try Firebase if enabled (though for admin we strictly use JWT now)
    try {
      if (admin.apps.length > 0) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        return next();
      }
    } catch (e) {
      // Not a Firebase token or Firebase not init
    }

    res.sendStatus(403);
  } catch (error) {
    console.error('Admin auth failed:', error);
    res.sendStatus(403);
  }
};

router.get('/stats', isAdmin, (req: any, res: any) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const entryCount = db.prepare('SELECT COUNT(*) as count FROM journal_entries').get();
    const streakStats = db.prepare('SELECT AVG(streak) as avgStreak, MAX(streak) as maxStreak FROM user_stats').get();
    const planStats = db.prepare('SELECT plan, COUNT(*) as count FROM users GROUP BY plan').all();
    
    res.json({
      users: userCount,
      entries: entryCount,
      streaks: streakStats,
      plans: planStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', isAdmin, (req: any, res: any) => {
  try {
    const allUsers = db.prepare(`
      SELECT u.id, u.email, u.password, u.name, u.plan, u.trial_started_at, u.created_at, u.last_login, s.streak 
      FROM users u
      LEFT JOIN user_stats s ON u.id = s.user_id
      ORDER BY u.created_at DESC
    `).all();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/activity', isAdmin, (req: any, res: any) => {
  try {
    const logs = db.prepare(`
      SELECT l.*, u.name, u.email 
      FROM activity_log l
      INNER JOIN users u ON l.user_id = u.id
      ORDER BY l.timestamp DESC
      LIMIT 100
    `).all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/seeker/:id/journals', isAdmin, (req: any, res: any) => {
  try {
    const entries = db.prepare('SELECT * FROM journal_entries WHERE user_id = ? ORDER BY date DESC').all(req.params.id);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/seeker/:id/vision', isAdmin, (req: any, res: any) => {
  try {
    const items = db.prepare('SELECT * FROM vision_board_items WHERE user_id = ? ORDER BY timestamp DESC').all(req.params.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/seeker/:id/activity', isAdmin, (req: any, res: any) => {
  try {
    const logs = db.prepare('SELECT * FROM activity_log WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50').all(req.params.id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/seeker/:id/activity', isAdmin, (req: any, res: any) => {
  try {
    const logs = db.prepare('SELECT * FROM activity_log WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50').all(req.params.id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/seeker/:id/premium', isAdmin, (req: any, res: any) => {
  const { isPremium } = req.body;
  const plan = isPremium ? 'premium' : 'free';
  try {
    db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, req.params.id);
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', (req: any, res: any) => {
  const { username, password } = req.body;
  // Professional restricted login with Username/ID support
  const allowedAdmins = [
    'vishwa@manifestation.com', 
    'chandu.manchalla@gmail.com', 
    'chandu', 
    'vishwa', 
    'admin'
  ];

  if (allowedAdmins.includes(username) && password === 'admin123') {
     const token = jwt.sign({ username, admin: true }, JWT_SECRET, { expiresIn: '24h' });
     const displayName = username.includes('chandu') ? 'Chandu (Admin)' : 'Vishwa (Admin)';
     res.json({ token, user: { username, name: displayName, role: 'admin' } });
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
});

module.exports = router;
