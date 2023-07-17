
-- Creation of users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  user_name varchar(32) NOT NULL,
  PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_user_name ON users (user_name);


-- Creation of messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL,
  content TEXT NOT NULL,
  from_user_id INT NOT NULL REFERENCES users(id),
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS ix_messages_created_at ON messages (sent_at);


-- Insert some users (create user and user login not implemented)
INSERT INTO users (user_name)
VALUES ('bob'), ('susan'), ('chatty'), ('anon'), ('anon2');
