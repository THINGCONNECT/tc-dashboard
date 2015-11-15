var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});

var Sim = mongoose.model('Sim');

router.route('/').get(function(req, res) {
  var user = req.user;
  if(req.user){
    Sim.find({owner: user, verified: true}, function(err, sims) {
      if(err || !sims){
        console.log("Message Processing Error", err, sims);
        return res.ok([]);
      }else{
        res.ok(sims);
      }
    });
  }else{
    return res.error(500, "Not logged in");
  }
});

module.exports = router;
