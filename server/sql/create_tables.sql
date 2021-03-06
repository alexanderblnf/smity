DROP TABLE users;
DROP TABLE permission;
DROP TABLE preferences;
DROP TABLE dailyreport;

CREATE TABLE permission (
  id          INTEGER PRIMARY KEY,
  name        VARCHAR(20) NOT NULL,
  description VARCHAR(100)
);

CREATE TABLE preferences (
  id        SERIAL PRIMARY KEY,
  parameter VARCHAR(15) NOT NULL
);

CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(30) UNIQUE NOT NULL,
  password    VARCHAR(257)       NOT NULL,
  firstname   VARCHAR(50)        NOT NULL,
  lastname    VARCHAR(50)        NOT NULL,
  permission  INTEGER REFERENCES permission (id),
  preferences INTEGER []
);

CREATE TABLE dailyreport (
  id       SERIAL PRIMARY KEY,
  device   TEXT [] NOT NULL,
  time     INTEGER NOT NULL,
  maxval   REAL,
  deviceid TEXT [] NOT NULL,
  lat      DOUBLE PRECISION,
  long     DOUBLE PRECISION,
  average  DOUBLE PRECISION
)