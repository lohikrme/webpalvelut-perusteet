// movie.js
// 16th august 2024

var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema(
  {
    title: {type: String, required: true, maxlength: 100},
    director: {type: String, required: true, maxlength: 100},
    year: {type: Number, required: true}
  }
);

//Export model
module.exports = mongoose.model('movies', MovieSchema);