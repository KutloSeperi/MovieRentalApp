const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const itemsRoutes = require('./routes/items');
app.use('/api/items', itemsRoutes);

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('🎬 Movie Rental API – Server Running');
});

// Error handler (must come after routes)
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.message);
  res.status(500).json({ error: 'Something went wrong.' });
});

module.exports = app;