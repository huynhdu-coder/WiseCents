CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC(10, 2),
  category TEXT,
  type TEXT,
  date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT,
  target_amount NUMERIC(10,2),
  saved NUMERIC(10,2) DEFAULT 0,
  deadline DATE
);