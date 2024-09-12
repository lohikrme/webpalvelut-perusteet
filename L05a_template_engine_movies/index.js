const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

const port = 3000;

app.set('view engine', 'pug');

let newewst_id = 1588323412643;
let movies = [
    {id: '1588323375416', title: 'Star Wars: Episode IX - The Rise of Skywalker', year: 2019, director: 'J.J. Abrams'},
    {id: '1588323390624', title: 'The Irishman', year: 2019, director: 'Martin Scorsese'},
    {id: '1588323412643', title: 'Harry Potter and the Sorcerers Stone', year: 2001, director: 'Chris Columbus'}
];

app.get("/hello", (req, res) => {
    res.render("hello", {firstname: 'John', lastname: 'Johnson'});
});

app.get("/", (req, res) => {
    res.render("movies", {movies: movies});
});

app.get("/addmovie", (req, res) => {
    res.render("addmovie");
});

app.post("/addmovie", (req, res) => {
    newewst_id += 20;
    const { title, director, year } = req.body;
    movies.push({ id: newewst_id.toString(), title: title, director: director, year: Number(year) });
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});