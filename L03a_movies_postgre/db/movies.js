// movies.js
// 13th august 2024

const db = require('./dbconfig');

// Get all movies
const getAllMovies = async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM movies');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
// Get movie by id
const getMovieById =  async (req, res) => {
  const query = {
    text: 'SELECT * FROM movies WHERE id = $1',
    values: [req.params.id],
  };
  try {
    const result = await db.query(query);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const addMovie = async (req, res) => {
  const newMovie = req.body;

  // Tarkistetaan, että kaikki tarvittavat kentät ovat mukana
  if (!newMovie.title || !newMovie.director || !newMovie.year) {
      return res.status(400).json({ error: 'Title, director, and year are required' });
  }

  try {
      // Tarkistetaan, onko elokuva jo tietokannassa
      const checkQuery = {
      text: 'SELECT * FROM movies WHERE title = $1',
      values: [newMovie.title],
      };
      const checkResult = await db.query(checkQuery);

      if (checkResult.rows.length > 0) {
      return res.status(409).json({ error: 'Movie already exists' });
      }

      // Lisätään uusi elokuva tietokantaan
      const insertQuery = {
      text: 'INSERT INTO movies (title, director, year) VALUES ($1, $2, $3) RETURNING *',
      values: [newMovie.title, newMovie.director, newMovie.year],
      };
      const insertResult = await db.query(insertQuery);

      res.status(201).json(insertResult.rows[0]);
  } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteMovie = async (req, res) => {
  const query = {
    text: 'DELETE FROM movies WHERE id = $1',
    values: [req.params.id],
  }

  try {
    await db.query(query, (err, res) => {})
    res.status(204).end();
  }
  catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Update movie
const updateMovie = async (req, res) => {
  // Extract edited movie from the request body
  const editedMovie = req.body;
  // Tarkistetaan, että kaikki tarvittavat kentät ovat mukana
  if (!editedMovie.title || !editedMovie.director || !editedMovie.year) {
    return res.status(400).json({ error: 'Title, director, and year are required' });
  }
  const query = {
    text: 'UPDATE movies SET title=$1, director=$2, year=$3 WHERE id = $4',
    values: [editedMovie.title, editedMovie.director, editedMovie.year, req.params.id],
  }

  try {
  db.query(query, (err, res) => {})
  res.json(editedMovie);
  }
  catch (err) {
    console.error('Error executing query', err.stack)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Delete all movies
const deleteAllMovies = () => {
  db.query('DELETE FROM movies', (err, res) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
  })
}
  
module.exports = {
  getAllMovies: getAllMovies,
  getMovieById: getMovieById,
  addMovie: addMovie,
  deleteMovie: deleteMovie,
  updateMovie: updateMovie,
  deleteAllMovies: deleteAllMovies
}