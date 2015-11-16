var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var User = mongoose.model('User');

var global = require('lib/global');

router.route('/').get(function(req, res) {
  User.find().select('_id username type sims').populate('sims').exec(function(err, users){
    return res.ok(users);
  });
}).delete(function(req, res){

  global.keysExist({"tes2t":1, "a": 2}, ["test"], function(err){
    console.log(err);
  });
  // var user = req.user;
  // if(user){
  //   user.delete(function(err){
  //     req.logout();
  //     res.ok();
  //   });
  // }
});

module.exports = router;