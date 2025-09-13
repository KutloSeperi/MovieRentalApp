const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      default: ''
    },
    genre: {
      type: String,
      required: [true, 'Genre is required. Choose from valid categories.'],
      enum: [
        'Action',
        'Adventure',
        'Animation',
        'Biography',
        'Comedy',
        'Crime',
        'Documentary',
        'Drama',
        'Family',
        'Fantasy',
        'History',
        'Horror',
        'Music',
        'Mystery',
        'Romance',
        'Science Fiction',
        'Thriller',
        'War',
        'Western'
      ],
      default: 'Drama'
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    releaseYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    director: {
      type: String,
      trim: true
    },
    // ✅ New Field: Store online image URL
    imageUrl: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
        },
        message: 'Image URL must be a valid HTTP(S) link ending in .jpg, .png, .gif, or .webp'
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);