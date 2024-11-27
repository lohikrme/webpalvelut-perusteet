const jwt = require('jsonwebtoken');
const user = require('../db/users');
const bcrypt = require('bcrypt');

// user login
const login = (req, res) => {
    // extract email and password from the request body
    const email = req.body.email;
    const password = req.body.password;

    const loginUser = user.getUserByEmail(email, (userData) => {
        console.log(`\n \n USERDATA LOOKS NEXT!!! \n \n ${userData[0].email} ${userData[0].password} \n \n \n`)
        if (userData.length == 1) {
            const hashpassword = userData[0].password;
            // create json web token
            const token = jwt.sign({userID: email}, process.env.SECRET_KEY);

            // if password match, send the token
            if (bcrypt.compareSync(password, hashpassword)) {
                res.send({token});
            }
            else {
                res.sendStatus(400).json({message: "Login has failed - password != hashpassword"})
            }
        }
        else {
            res.sendStatus(400).json({message: "Login has failed - userData.length != 1"})
        }
    });
}

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