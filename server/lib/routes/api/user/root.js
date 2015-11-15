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
}).delete(function(req, res){
  console.log("DELETE REQUEST!");
});

module.exports = router;