npm init -y
npm install express nodemon pg body-parser
npm install mocha@10 chai@4 chai-http@4 mochawesome@7 --save-dev

# jsonwebtoken for login, bcrypt for hash password
npm install jsonwebtoken bcrypt

# for secret key environmental varaible
npm install dotenv

# against most usual vulnerabilities use helmet library
npm install helmet