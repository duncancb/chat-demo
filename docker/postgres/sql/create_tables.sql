SET ROLE chat_user;

-- Creation of users table
CREATE TABLE IF NOT EXISTS  users (
  id SERIAL,
  user_name varchar(32) NOT NULL,
  PRIMARY KEY (id)
);
