// index.js
// 13th august 2024

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const query = require('./db/movies');
const auth = require('./services/authenticate')

const app = express();
app.use(bodyParser.json());
const port = 3000;


// GET ALL MOVIES
// notice that middleware functions, such as authenticate, 
// get automatically request, respond, next parameters
app.get("/api/movies", auth.authenticate, query.getAllMovies);
// GET MOVIE BY ID
app.get("/api/movies/:id", auth.authenticate, query.getMovieById);
// ADD MOVIE
app.post("/api/movies", auth.authenticate, query.addMovie);
// DELETE MOVIE
app.post("/api/movies/:id", auth.authenticate, query.deleteMovie);
// UPDATE MOVIE
app.put("/api/movies/:id", auth.authenticate, query.updateMovie);
// AUTHENTICATE
app.post("/login", auth.login);


app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});


module.exports = app;