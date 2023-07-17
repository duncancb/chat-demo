var express = require('express');
var router = express.Router();
var { do_query } = require('../db.js');

/* GET home page. */
router.get(
  '/',
  async function(req, res, next) {
    var user_rows = await do_query('SELECT id, user_name FROM users');
    res.render('index', {title: 'Select user', users: user_rows});
  }
);

module.exports = router;
