require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); // Import the app from app.js

// Connect to MongoDB and start the server
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