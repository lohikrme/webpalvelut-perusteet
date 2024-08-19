// index.js
// 15th august 2024

const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes");
const db_password = require("./password");
const writeErrorLog = require("./writeErrorLog");

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use('/', routes);

const mongoose = require('mongoose');
const mongoURL = `mongodb+srv://chineseparrotlet:${db_password}@viopecluster0.ryzbt.mongodb.net/viopedb?retryWrites=true&w=majority&appName=ViopeCluster0`;
mongoose.connect(mongoURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => writeErrorLog('Failed to connect to MongoDB', err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});