// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Temp: simple working route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

module.exports = router;