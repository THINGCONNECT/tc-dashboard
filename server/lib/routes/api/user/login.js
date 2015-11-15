var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var User = mongoose.model('User');
var passport = require('passport');

router.route('/').post(passport.authenticate('local'), function(req, res) {
  return res.ok(req.user);
});

module.exports = router;
