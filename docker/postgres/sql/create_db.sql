CREATE DATABASE :app_db;
CREATE USER :app_db_user WITH ENCRYPTED PASSWORD :'app_db_password';
GRANT ALL PRIVILEGES ON DATABASE :app_db TO :app_db_user;
