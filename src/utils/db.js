const { Client } = require('pg')
 
const get_client = () => { 
  return new Client({
    host: process.env.CHAT_POSTGRES_HOST || 'localhost',
    port: process.env.CHAT_POSTGRES_PORT || '5432',
    database: process.env.CHAT_DB,
    user: process.env.CHAT_DB_USER,
    password: process.env.CHAT_DB_PASSWORD,
  });
};

module.exports = { get_client };
