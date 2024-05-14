// index.js
// 2nd may 2024

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Welcome to our front page!");
});

app.get('/home/user/:name/:age', (req, res) => {
    if (req.params.age >= 18) {
        res.send("Welcome " + req.params.name + ", you're " + req.params.age + " years old.");
    }
    res.send("Welcome " + req.params.name + ", you're too young.");
});

app.listen(port, () => {
    console.log(`App is listening port ${port}...`);
});