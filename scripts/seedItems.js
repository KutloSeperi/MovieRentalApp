require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');

// Sample movies with tmdbId and TMDb image URLs
const movies = [
  // Existing 5 movies
  {
    title: "Inception",
    description: "A mind-bending thriller about dreams within dreams",
    genre: "Science Fiction",
    dailyRate: 5.99,
    inStock: true,
    releaseYear: 2010,
    director: "Christopher Nolan",
    imageUrl: "https://image.tmdb.org/t/p/w500/qoIysxMHsZhaORZl3fGQRc5wMWQ.jpg",
    tmdbId: 27205
  },
  {
    title: "The Dark Knight",
    description: "Batman faces the Joker in Gotham City",
    genre: "Action",
    dailyRate: 6.99,
    inStock: true,
    releaseYear: 2008,
    director: "Christopher Nolan",
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    tmdbId: 155
  },
  {
    title: "Interstellar",
    description: "A journey through space and time to save humanity",
    genre: "Science Fiction",
    dailyRate: 7.49,
    inStock: true,
    releaseYear: 2014,
    director: "Christopher Nolan",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    tmdbId: 157336
  },
  {
    title: "Pulp Fiction",
    description: "Interwoven stories of crime and redemption",
    genre: "Crime",
    dailyRate: 5.49,
    inStock: true,
    releaseYear: 1994,
    director: "Quentin Tarantino",
    imageUrl: "https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg",
    tmdbId: 680
  },
  {
    title: "Spirited Away",
    description: "A girl enters a magical spirit world",
    genre: "Animation",
    dailyRate: 4.99,
    inStock: true,
    releaseYear: 2001,
    director: "Hayao Miyazaki",
    imageUrl: "https://image.tmdb.org/t/p/w500/9yBVqNrukEYyrzhiOrOvVddWUrI.jpg",
    tmdbId: 129
  },

  // 🔽 New Movies (10)
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    genre: "Crime",
    dailyRate: 6.99,
    inStock: true,
    releaseYear: 1972,
    director: "Francis Ford Coppola",
    imageUrl: "https://image.tmdb.org/t/p/w500/ihMAGhARuYaMlLQshDr8rbprjQn.jpg",
    tmdbId: 238
  },
  {
    title: "Mad Max: Fury Road",
    description: "In a post-apocalyptic wasteland, Furiosa leads a group in a desperate escape from a tyrant.",
    genre: "Action",
    dailyRate: 6.49,
    inStock: true,
    releaseYear: 2015,
    director: "George Miller",
    imageUrl: "https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
    tmdbId: 76341
  },
  {
    title: "The Matrix",
    description: "A hacker discovers a dystopian reality controlled by machines.",
    genre: "Science Fiction",
    dailyRate: 5.99,
    inStock: true,
    releaseYear: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    tmdbId: 603
  },
  {
    title: "Get Out",
    description: "A young African-American visits his white girlfriend's family estate, where he becomes ensnared in a more sinister real horror.",
    genre: "Thriller",
    dailyRate: 5.49,
    inStock: true,
    releaseYear: 2017,
    director: "Jordan Peele",
    imageUrl: "https://image.tmdb.org/t/p/w500/sdEOH0992YZ0QSXZXuGrT2Dyz7Q.jpg",
    tmdbId: 415883
  },
  {
    title: "La La Land",
    description: "A jazz musician and an aspiring actress fall in love while chasing their dreams in Los Angeles.",
    genre: "Romance",
    dailyRate: 5.99,
    inStock: true,
    releaseYear: 2016,
    director: "Damien Chazelle",
    imageUrl: "https://image.tmdb.org/t/p/w500/ylXCdC106IKiarftHkcacasaAcb.jpg",
    tmdbId: 313369
  },
  {
    title: "The Revenant",
    description: "A frontiersman fights for survival after being mauled by a bear and left for dead by his companions.",
    genre: "Adventure",
    dailyRate: 6.99,
    inStock: true,
    releaseYear: 2015,
    director: "Alejandro González Iñárritu",
    imageUrl: "https://image.tmdb.org/t/p/w500/oJKxBfToCNYVrht9NNv6twijqy7.jpg",
    tmdbId: 281957
  },
  {
    title: "Black Panther",
    description: "T'Challa returns home as king but must face challenges to his nation's throne.",
    genre: "Action",
    dailyRate: 6.49,
    inStock: true,
    releaseYear: 2018,
    director: "Ryan Coogler",
    imageUrl: "https://image.tmdb.org/t/p/w500/6ELkfjaAbiTi9qMMfPZM9vPTMAa.jpg",
    tmdbId: 284053
  },
  {
    title: "Joker",
    description: "A failed comedian descends into madness and becomes a violent criminal.",
    genre: "Crime",
    dailyRate: 5.99,
    inStock: true,
    releaseYear: 2019,
    director: "Todd Phillips",
    imageUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    tmdbId: 475557
  },
  {
    title: "Dune",
    description: "A noble young man is sent to the desert planet Arrakis to secure a valuable resource.",
    genre: "Science Fiction",
    dailyRate: 7.99,
    inStock: true,
    releaseYear: 2021,
    director: "Denis Villeneuve",
    imageUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0FiOodLUjvjYofvsVO.jpg",
    tmdbId: 361743
  }
];
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Item.deleteMany({});
    console.log('🗑️ Existing items cleared');

    await Item.insertMany(movies);
    console.log(`✅ Successfully added ${movies.length} movies with tmdbId and images`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();