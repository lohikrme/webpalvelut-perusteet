// dbconfig.js
// 14th august 2024

const { Pool } = require('pg');
const  { db_password } = require('./password');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "viope",
    password: db_password
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}