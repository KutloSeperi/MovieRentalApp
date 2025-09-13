require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');

// Extended sample movies with clean image URLs
const movies = [
  {
    title: "Inception",
    description: "A mind-bending thriller about dreams within dreams",
    genre: "Science Fiction",
    dailyRate: 5.99,
    inStock: true,
    releaseYear: 2010,
    director: "Christopher Nolan",
    imageUrl: "https://image.tmdb.org/t/p/w500/qoIysxMHsZhaORZl3fGQRc5wMWQ.jpg"
  },
  {
    title: "The Dark Knight",
    description: "Batman faces the Joker in Gotham City",
    genre: "Action",
    dailyRate: 6.99,
    inStock: true,
    releaseYear: 2008,
    director: "Christopher Nolan",
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    title: "Interstellar",
    description: "A journey through space and time to save humanity",
    genre: "Science Fiction",
    dailyRate: 7.49,
    inStock: true,
    releaseYear: 2014,
    director: "Christopher Nolan",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    title: "Pulp Fiction",
    description: "Interwoven stories of crime and redemption",
    genre: "Crime",
    dailyRate: 5.49,
    inStock: true,
    releaseYear: 1994,
    director: "Quentin Tarantino",
    imageUrl: "https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg"
  },
  {
    title: "Spirited Away",
    description: "A girl enters a magical spirit world",
    genre: "Animation",
    dailyRate: 4.99,
    inStock: true,
    releaseYear: 2001,
    director: "Hayao Miyazaki",
    imageUrl: "https://image.tmdb.org/t/p/w500/9yBVqNrukEYyrzhiOrOvVddWUrI.jpg"
  },
  // 🔽 New Movies Added Below
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    genre: "Crime",
    dailyRate: 6.99,
    inStock: true,
    releaseYear: 1972,
    director: "Francis Ford Coppola",
    imageUrl: "https://image.tmdb.org/t/p/w500/ihMAGhARuYaMlLQshDr8rbprjQn.jpg"
  },
  {
    title: "Parasite",
    description: "A poor family schemes to become employed by a wealthy household.",
    genre: "Drama",
    dailyRate: 5.99,
    inStock: true,
    releaseYear: 2019,
    director: "Bong Joon-ho",
    imageUrl: "https://image.tmdb.org/t/p/w500/7gbskwxzjrC4KX7K55p1dHgi9iU.jpg"
  },
  {
    title: "Mad Max: Fury Road",
    description: "In a post-apocalyptic wasteland, Furiosa leads a group in a desperate escape from a tyrant.",
    genre: "Action",
    dailyRate: 6.49,
    inStock: true,
    releaseYear: 2015,
    director: "George Miller",
    imageUrl: "https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg"
  },
  {
    title: "The Matrix",
    description: "A hacker discovers a dystopian reality controlled by machines.",
    genre: "Science Fiction",
    dailyRate: 5.99,
    inStock: true,
    releaseYear: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  },
  {
    title: "Get Out",
    description: "A young African-American visits his white girlfriend's family estate, where he becomes ensnared in a more sinister real horror.",
    genre: "Thriller",
    dailyRate: 5.49,
    inStock: true,
    releaseYear: 2017,
    director: "Jordan Peele",
    imageUrl: "https://image.tmdb.org/t/p/w500/sdEOH0992YZ0QSXZXuGrT2Dyz7Q.jpg"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Item.deleteMany({});
    console.log('🗑️ Existing items cleared');

    await Item.insertMany(movies);
    console.log(`✅ Successfully added ${movies.length} movies with images`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();