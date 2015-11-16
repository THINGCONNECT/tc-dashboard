var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var User = mongoose.model('User');

router.route('/').get(function(req, res) {
  User.find().select('_id username type sims').populate('sims').exec(function(err, users){
    return res.ok(users);
  });
});

module.exports = router;