var express = require('express');
var router = express.Router();
var { rows_query } = require('../db.js');

/* GET home page. */
router.get(
  '/',
  async function(req, res, next) {
    var user_rows = await rows_query('SELECT id, user_name FROM users');
    if( !user_rows ) {
      user_rows = [];
    } 
    res.render('index', {title: 'Select user', users: user_rows});
  }
);

module.exports = router;
