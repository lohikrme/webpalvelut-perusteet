const express = require('express');

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello Express!");
  console.log("Someone arrived to website");
});

app.get("/home/:firstname/:lastname", (req, res) => {
    res.json(
        {firstname: req.params.firstname.toString(),
        lastname: req.params.lastname.toString(),
        message: "Welcome " + req.params.firstname + " " + req.params.lastname});
});
  
app.get("/about", (req, res) => {
    res.send("About us...");
});

app.get("/secret", (req, res) => {
    res.sendStatus(403);
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});