var express = require('express');
var router = express.Router();
var db = require('../utils/db.js');

/* GET home page. */
router.get(
  '/',
  async function(req, res, next) {
    const client = db.get_client()
    await client.connect()
     
    const user_res = await client.query('SELECT id, user_name FROM users');
    var user_rows = user_res.rows
    await client.end()

    res.render('index', {title: 'Select user', users: user_rows});
  }
);

module.exports = router;
