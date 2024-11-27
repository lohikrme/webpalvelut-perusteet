const db = require('./dbconfig');

// Get user by email, call "next" function which receives userData as parameter
// idea is that this getUserByEmail can be used by many diufferent functions,
// so it will only fetch the userData, and leave other processing to the caller
function getUserByEmail (email, next) {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  } 
  db.query(query, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    else {
      next(result.rows);
    }
  })
}

module.exports = {
  getUserByEmail: getUserByEmail
}