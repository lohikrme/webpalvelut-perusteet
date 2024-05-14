// index.js
// 14th may 2024

// Idea here is that GET and POST have different endpoints to fill
// POST is used to add a new movie
// POST will contain data in JSON form inside its body 'req.body',
// so we need bodyParser to read it.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3000;

// data currently as list, later in database
let movies = [
    {id: '1588323375416', title: 'Star Wars: Episode IX - The Rise of Skywalker', year: 2019, director: 'J.J. Abrams'},
    {id: '1588323390624', title: 'The Irishman', year: 2019, director: 'Martin Scorsese'},
    {id: '1588323412643', title: 'Harry Potter and the Sorcerers Stone', year: 2001, director: 'Chris Columbus'}
  ];


// FrontPage
app.get("/", (req, res) => {
    res.send("Welcome!");
});


// Fetch all movies
app.get("/api/movies", (req, res) => {
    res.json(movies);
});


// Fetch movie by id
app.get("/api/movies/:id", (req, res) => {
    const movieId = req.params.id;
  
    const movie = movies.filter(movie => movie.id === movieId);
    if (movie.length > 0)
      res.json(movie);
    else
      res.status(404).end();
});


// Add new movie
app.post("/api/movies", (req, res) => {
    // Extract movie from the request body and generate id
    const newMovie = {'id': Date.now(), ...req.body};
  
    // Add new movie at the end of the movies array
    movies = [...movies, newMovie];
  
    res.json(newMovie);
});


//Delete movie
app.delete("/api/movies/:id", (req, res) => { 
    const id = req.params.id;
  
    movies = movies.filter(movie => movie.id !== id);
    res.status(204).end();
});

// Update Movie by splic
app.put("/api/movies/:id", (req, res) => {
    const id = req.params.id;
    const updatedMovie = {'id': id, ...req.body};
    const index = movies.findIndex(movie => movie.id == id);
    movies.splice(index, 1, updatedMovie);
    res.json(updatedMovie);
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}.`);
});