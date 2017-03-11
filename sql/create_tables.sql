CREATE TABLE users(id SERIAL PRIMARY KEY,
                   email VARCHAR(30) NOT NULL,
                   password VARCHAR(257) NOT NULL);