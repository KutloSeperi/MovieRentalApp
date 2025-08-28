require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/auth');        // Fixed: removed trailing dot
app.use('/api/auth', authRoutes);

const itemsRoutes = require('./routes/items');      // Add this!
app.use('/api/items', itemsRoutes);

const usersRoutes = require('./routes/users');      // Add admin routes
app.use('/api/users', usersRoutes);

// Error handler middleware (must come after routes)
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.message);
  res.status(500).json({ error: 'Something went wrong.' });
});

// Health check
app.get('/', (req, res) => {
  res.send('🎬 Movie Rental API – Server Running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Connected to MongoDB: movie_rental`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
  });