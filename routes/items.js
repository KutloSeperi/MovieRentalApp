const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// GET /api/items - Public route
router.get('/', async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /api/items - Admin only
router.post('/', auth, admin, async (req, res, next) => {
  try {
    const item = new Item(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    next(err);
  }
});

// PUT /api/items/:id - Admin only
router.put('/:id', auth, admin, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID.' });
    }

    const updated = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/items/:id - Admin only
router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID.' });
    }

    const deleted = await Item.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    res.json({ message: 'Movie deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;