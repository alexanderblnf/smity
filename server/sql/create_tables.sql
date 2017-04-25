DROP TABLE users;
DROP TABLE permission;
DROP TABLE preference;

CREATE TABLE permission(
  id INTEGER PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  description VARCHAR(100)
);

CREATE TABLE preferences(
  id INTEGER PRIMARY KEY,
  parameter VARCHAR(10) NOT NULL
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(257) NOT NULL,
  permission INTEGER REFERENCES permission(id),
  preferences INTEGER[]
);