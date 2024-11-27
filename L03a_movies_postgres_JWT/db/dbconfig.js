// dbconfig.js
// 13th august 2024

const { Pool } = require('pg');

const { db_password } = require('./password.js');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "movie",
  password: db_password
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}