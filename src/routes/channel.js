var express = require('express');
var router = express.Router();

/* GET channels listing. */
router.get('/', function(req, res, next) {
  res.render('channels', { title: 'The Only Channel' });
});

module.exports = router;
