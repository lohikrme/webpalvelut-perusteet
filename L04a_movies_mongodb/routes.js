// routes.js
// 16th august 2024

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const writeErrorLog = require("./writeErrorLog");

// GET ALL MOVIES
router.get("/movies", async (req, res) => {
  try {
    // Varmista, että yhteys MongoDB:hen on muodostettu
    if (!mongoose.connection.readyState) {
      throw new Error('MongoDB connection is not established');
    }
    // Hae kaikki elokuvat tietokannasta
    const movies = await Movie.find();
    // Tarkista, onko elokuvia löytynyt
    if (!movies.length) {
      return res.status(404).json({ message: 'No movies found' });
    }
    // Palauta elokuvat JSON-muodossa
    res.json(movies);
  } catch (err) {
    // Kirjoita virhe lokiin ja palauta virheviesti
    writeErrorLog('Error fetching movies:', err);
    return res.status(500).json({ message: err.message });
  }
});

// ADD MOVIE
router.post("/movies", async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    director: req.body.director,
    year: req.body.year
  });
  try {
    const newMovie = await movie.save();
    res.status(201).json({ newMovie });
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
})

// DELETE MOVIE
router.delete("/movies", async (req, res) => {
  await Movie.deleteOne({title: req.body.title}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    else {
      res.status(200).json(result);
    }
  });
})

// UPDATE MOVIE
router.put("/movies/:id", async (req, res) => {
  try {
    const result = await Movie.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;