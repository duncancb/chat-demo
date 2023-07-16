var express = require('express');
var router = express.Router();

/* GET channel. */
router.get('/:user_id', function(req, res, next) {
  res.render('channel', { title: 'The Only Channel' });
});

module.exports = router;
