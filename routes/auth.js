const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;
console.log('🔧 Auth routes file loaded!');

/**
 * POST /api/auth/register
 * Register a new user (always as 'client')
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Always create as 'client' — only admins can promote later
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'client'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Send success response
    res.status(201).json({
      message: 'User registered successfully',
      token,
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

/**
 * POST /api/auth/login
 * Log in a user and return a JWT token
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
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

// Add simple test route
router.get('/test', (req, res) => {
  console.log('✅ GET /test route hit!');
  res.json({ message: 'Auth routes working!' });
});

/**
 * GET /api/auth/me
 * Get current user's info
 */
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/auth/me
 * Update current user's name or password
 * Frontend-safe: returns same shape as login
 */
router.put('/me', auth, async (req, res, next) => {
  try {
    console.log('🔥 PUT /me route HIT!');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Raw Body:', req.body);

    console.log('✅ Auth middleware passed successfully');
    console.log('User from token:', req.user);

    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log('Extracted data:', {
      name,
      currentPassword: !!currentPassword,
      newPassword: !!newPassword,
      userId
    });

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('✅ User found:', { id: user._id, name: user.name, email: user.email });

    // Update name if provided
    if (name !== undefined && name.trim() !== '') {
      console.log('📝 Updating name from', user.name, 'to', name.trim());
      user.name = name.trim();
    }

    // Change password if requested
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        console.log('❌ Password change failed: missing current or new password');
        return res.status(400).json({
          message: 'Both currentPassword and newPassword are required.'
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        console.log('❌ Password change failed: current password incorrect');
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      console.log('🔒 Updating password...');
      user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }

    console.log('💾 Saving user...');
    await user.save();
    console.log('✅ User saved successfully');

    // Generate new token (keeps user logged in)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log('✅ New token generated');

    const response = {
      message: 'Profile updated successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    console.log('📤 Sending response:', response);
    res.json(response);
  } catch (err) {
    console.error('❌ Error in PUT /me:', err);
    next(err);
  }
});
/**
 * DELETE /api/auth/me
 * Delete the currently logged-in user's account
 */
router.delete('/me', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send success response
    res.json({
      message: 'Your account has been permanently deleted.'
    });
  } catch (err) {
    next(err);
  }
});
// Debug registered routes
console.log('📝 Registered routes:');
router.stack.forEach(layer => {
  console.log(`${layer.route?.stack[0]?.method?.toUpperCase()} ${layer.route?.path}`);
});

module.exports = router;