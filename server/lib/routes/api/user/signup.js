var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var User = mongoose.model('User');
var passport = require('passport');

router.route('/').post(function(req, res) {
  return User.createUser(req.body.username, req.body.password, function(err, user) {
    if(err) return res.error(500);
    return req.login(user, function(err) {
      if(err) return res.error(500);
      return res.ok(true);
    });
  });
});

module.exports = router;
