const db = require('./dbconfig');

// Get user by email, call "next" function which receives userData as parameter
// idea is that this getUserByEmail can be used by many diufferent functions,
// so it will only fetch the userData, and leave other processing to the caller
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } 
      else if (result.rows.length > 0) {
        resolve(result.rows);
      } 
      else {
        resolve([]);
      }
    });
  });
}

module.exports = {
  getUserByEmail: getUserByEmail
}