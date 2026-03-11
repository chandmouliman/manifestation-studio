const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

const subscriptionRoutes = require('./routes/subscription');

app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscription', subscriptionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
