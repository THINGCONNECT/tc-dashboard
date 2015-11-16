var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});

var User = mongoose.model('User');
var Sim = mongoose.model('Sim');
var Verify = mongoose.model('Verify');

router.route('/').get(function(req, res) {
  //Get sim info
  var simId = req.params.sim;
  var user = req.user;
  Sim.findOne({simId: simId, owner:user, verified: true}, function(err, sim) {
    if(err || !sim){
      return res.error(500);
    }else{
      res.ok(sim);
    }
  });
}).post(function(req, res) {
  //Update sim info
  var body = req.body;
  var simId = req.params.sim;
  var user = req.user;
  var name = body.name;
  var callbackUrl = body.callbackUrl;
  Sim.findOne({simId: simId, owner:user, verified: true}, function(err, sim) {
    if(!err && sim){
      sim.name = name;
      sim.callbackUrl = callbackUrl;
      sim.save(function(err){
        if(!err){
          return res.ok(true);
        }else{
          return res.error(500);
        }
      });
    }else{
      return res.error(500);
    }
  });
}).delete(function(req, res) {
  //Delete sim
  var body = req.body;
  var simId = req.params.sim;
  var user = req.user;
  Sim.findOne({simId: simId, owner:user, verified: true}, function(err, sim) {
    if(!err && sim){
      sim.disown(function(err){
        if(err) return res.error(500);
        return res.ok();
      });
    }else{
      return res.error(500);
    }
  });
});

module.exports = router;
