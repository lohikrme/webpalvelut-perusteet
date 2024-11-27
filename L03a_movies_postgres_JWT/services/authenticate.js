const jwt = require('jsonwebtoken');
const user = require('../db/users');
const bcrypt = require('bcrypt');

// user login using promises
// to use the login, use password 'john007' which has hash form of
// '$2b$08$XX615l/tHyDneJ.A1CJZZu1CSo6RAEJyEReozQC.yoObjKcOCxkPe' 
const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    console.log("\nLogin request has been received! \nemail: ", email, "  password: ", password);
  
    try {
      const userData = await user.getUserByEmail(email);
  
      if (userData.length === 0) {
        return res.status(400).json({ message: "Login has failed - user not found" });
      }
  
      const hashpassword = userData[0].password;
      const token = jwt.sign({ userID: email }, process.env.SECRET_KEY);
  
      if (bcrypt.compareSync(password, hashpassword)) {
        return res.json({ token });
      } 
      else {
        return res.status(400).json({ message: "Login has failed - incorrect password" });
      }
    } 
    catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
};

// User authentication using RFC 6750 standard OAuth 2.0 Bearer token aka Bearer <token>
// so, to use authenticate function, it will require next request header:
// Authorization: Bearer <token>
// you can set this for example in postman in the Headers section
// To get token, first log in, and take that token into authenticate requests
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if(!authHeader) return res.sendStatus(400).json({message: "Token missing!"});

    console.log(`\n \n \n "AUTHORIZATION HEADER LOOKS NEXT: " \n ${authHeader} \n \n \n`);

    console.log(`\n \n \n "SECRET KEY LOOKS NEXT: " \n ${process.env.SECRET_KEY} \n \n \n`);

    const token = authHeader.split(' ')[1];

    console.log(`\n \n \n "TOKEN LOOKS NEXT: " \n ${token} \n \n \n`);

    // verify the received token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) res.sendStatus(400).end(); 
        else next();
    })
}

module.exports = {
    authenticate: authenticate,
    login: login,
}