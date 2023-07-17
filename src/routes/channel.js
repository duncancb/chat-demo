var express = require('express');
var router = express.Router();
var { get_user } = require('../db.js');

/* GET channel. */
router.get('/:userId', async (req, res, next) => {
  const { error, user } = await get_user(req.params['userId']);
  if( error ) {
    return next(new Error(error))};
  res.render(
    'channel', { 
      title: `The Only Channel: ${user.userName}`,
      user: user });
});

module.exports = router;
