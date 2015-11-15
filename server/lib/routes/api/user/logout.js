var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var User = mongoose.model('User');
var passport = require('passport');

router.route('/').post(function(req, res) {
  if(!req.user) return res.ok();
  req.logout();
  return res.ok();
});

module.exports = router;
