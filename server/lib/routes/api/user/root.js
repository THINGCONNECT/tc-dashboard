var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var User = mongoose.model('User');
var passport = require('passport');

router.route('/').get(function(req, res) {
  if(req.user){
    return res.ok(true);
  }else{
    return res.error(500);
  }
}).delete(passport.authenticate('local'), function(req, res){
  var user = req.user;
  if(user){
    user.delete(function(err){
      req.logout();
      res.ok();
    });
  }else{
    res.error(403);
  }
});

module.exports = router;