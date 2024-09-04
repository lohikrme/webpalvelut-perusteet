CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- this hashed password matches 'john007'
INSERT INTO users (email, password) VALUES ('joe.biden@gmail.com', '$2b$08$XX615l/tHyDneJ.A1CJZZu1CSo6RAEJyEReozQC.yoObjKcOCxkPe');

