// index.js
// 13th august 2024

const express = require('express');
const bodyParser = require('body-parser');

const query = require('./db/movies');


const app = express();
app.use(bodyParser.json());

const port = 3000;

// GET ALL MOVIES
app.get("/api/movies", query.getAllMovies);
// GET MOVIE BY ID
app.get("/api/movies/:id", query.getMovieById);
// ADD MOVIE
app.post("/api/movies", query.addMovie);
// DELETE MOVIE
app.post("/api/movies/:id", query.deleteMovie);
// UPDATE MOVIE
app.put("/api/movies/:id", query.updateMovie);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;