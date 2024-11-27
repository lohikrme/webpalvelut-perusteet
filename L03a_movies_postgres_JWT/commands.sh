npm init -y
npm install express body-parser nodemon
npm install pg # postgress library

npm install --save-dev mocha chai@4 chai-http@4 mochawesome

# add to package.json:
# "dev": "nodemon index.js",
# "start": "node index.js",

# jsonwebtoken for login, bcrypt for hash password
npm install jsonwebtoken bcrypt

# for secret key environmental varaible
npm install dotenv