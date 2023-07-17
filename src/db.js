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

const do_query = async (query, ...args) => {
  const client = get_client();
  await client.connect();
  const res = await client.query(query, ...args);
  var rows = res.rows;
  await client.end();
  return rows;
};

const get_user = async (userId) => {
  var user_rows = await do_query(
    'SELECT id, user_name FROM users WHERE id = $1', [userId]);
  
  if( user_rows && user_rows.length == 1 ) {
    user = {
        id: user_rows[0].id, userName: user_rows[0].user_name};
    return { user: user };
  } else if( user_rows.length > 1) {
    return { error: 'found multiple matching users' };
  } else {
    return { error: 'failed to load user' };
  }
}

module.exports = { get_client, do_query, get_user };
