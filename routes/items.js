const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// GET /api/items - Public route with pagination support
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Item.countDocuments();
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id - Public route to get a single item
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID.' });
    }
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/search - Public route to search/filter items
router.get('/search', async (req, res, next) => {
  try {
    const { title, genre } = req.query;
    const query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (genre) query.genre = genre;
    const items = await Item.find(query).lean();
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

// GET /api/items/tmdb/:id
// Get full movie details and image from TMDb
router.get('/tmdb/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=1e4a463af56d63d1275b8c24c6bcf709`
    );

    if (!response.ok) {
      return res.status(500).json({ message: 'Failed to fetch from TMDb' });
    }

    const data = await response.json();

    // Build full image URL
    const imageUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

    // Return clean object
    res.json({
      title: data.title,
      overview: data.overview,
      genre: data.genres[0]?.name || 'Drama',
      releaseYear: parseInt(data.release_date?.split('-')[0]),
      director: data.production_companies[0]?.name || 'Unknown',
      imageUrl,
      rating: data.vote_average,
      tmdbId: data.id,
      runtime: data.runtime
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