-- mysql -u x108667 -p <password>
-- show databases;
-- use user_x108667

CREATE TABLE parrots (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(100) NOT NULL,
    age INT,
    PRIMARY KEY (id)
);

INSERT INTO parrots (name, species, age) VALUES ('Polly', 'Budgie', 11);
INSERT INTO parrots (name, species, age) VALUES ('Maya', 'Sun Corune', 3);
INSERT INTO parrots (name, species, age) VALUES ('Kraaak', 'Blue Macaw', 52);
INSERT INTO parrots (name, species, age) VALUES ('Olli', 'Gray Parrot', 36);
INSERT INTO parrots (name, species, age) VALUES ('Matti', 'White Cockatoo', 49);
INSERT INTO parrots (name, species, age) VALUES ('Mustikka', 'Hyacinth Macaw', 8);
INSERT INTO parrots (name, species, age) VALUES ('Vekku', 'Parrotlet', 5);
INSERT INTO parrots (name, species, age) VALUES ('Joulupukki', 'Red Macaw', 25);
INSERT INTO parrots (name, species, age) VALUES ('Merirosvo', 'Budgie', 10);
INSERT INTO parrots (name, species, age) VALUES ('Joe Biden', 'White Cockatoo', 14);
INSERT INTO parrots (name, species, age) VALUES ('Donald Trump', 'Hyacinth Macaw', 11);
INSERT INTO parrots (name, species, age) VALUES ('Strawberry', 'Sun Corune', 6);
INSERT INTO parrots (name, species, age) VALUES ('Sampo', 'Blue Macaw', 29);
INSERT INTO parrots (name, species, age) VALUES ('Sauli Niinistö', 'Parrotlet', 33);
INSERT INTO parrots (name, species, age) VALUES ('Katri Helena', 'White Cockatoo', 66);
INSERT INTO parrots (name, species, age) VALUES ('Vieras', 'Hyacinth Macaw', null);
INSERT INTO parrots (name, species, age) VALUES ('Vaakku', 'Budgie', null);
INSERT INTO parrots (name, species, age) VALUES ('Nokkava', 'Budgie', null);
INSERT INTO parrots (name, species, age) VALUES ('Tsirp', 'Budgie', 15);