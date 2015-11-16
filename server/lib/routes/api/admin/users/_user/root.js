var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var User = mongoose.model('User');

router.route('/').get(function(req, res) {
  var userId = req.params.user;
  User.findById(userId).select('_id username type sims').populate('sims').exec(function(err, user){
    return res.ok(user);
  });
}).delete(function(req, res){
  var userId = req.params.user;
  User.findById(userId).exec(function(err, user){
    if(user){
      user.remove(function(err){
        return res.ok(true);
      });
    }else{
      return res.error(404);
    }
  });
});

module.exports = router;