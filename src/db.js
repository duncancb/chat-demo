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
  let res;
  let client;
  try {
    client = get_client();
    await client.connect();
    res = await client.query(query, ...args);
  } catch (error) {
      console.error(error.stack);
      res = false;
  } finally {
      if( client ) {
        await client.end();
      }
      return res;
  }
};

const rows_query = async (query, ...args) => {
  const res = await do_query(query, ...args);
  if( res ) {
    return res.rows;
  }
  return false;
};

const get_user = async (userId) => {
  var res = await do_query(
    'SELECT id, user_name FROM users WHERE id = $1', [userId]);
  
  if( res && res.rows.length == 1 ) {
    user = {
        id: res.rows[0].id, userName: res.rows[0].user_name};
    return { user: user };
  } else if( res.rows.length > 1) {
    return { error: 'found multiple matching users' };
  } else {
    return { error: 'failed to load user' };
  }
}

const insert_message = async (content, from_user_id) => {
  var res = await do_query(
    "INSERT INTO messages (content, from_user_id) " +
    "VALUES ($1::text, $2);", [content, from_user_id]);
  return res != false;
}


module.exports = { get_client, do_query, rows_query, get_user, insert_message };
