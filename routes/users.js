const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

/**
 * POST /api/users/:id/make-admin
 * Promote a user to admin (admin only)
 */
router.post('/:id/make-admin', auth, admin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin.' });
    }

    user.role = 'admin';
    await user.save();

    res.json({
      message: 'User promoted to admin successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;