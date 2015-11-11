var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});

var Sim = mongoose.model('Sim');
var Verify = mongoose.model('Verify');

router.get('/:id', function(req, res) {
  var simId = req.params.sim;
  var user = req.user;
  
  Sim.findOne({simId: simId, owner:user, verified: true}, function(err, sim) {
    if(err || !sim){
      return res.error(500);
    }else{
      res.ok(sim);
    }
  });
});
//Update sim info
router.post('/', function(req, res) {
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
});

router.delete('/', function(req, res) {
  var body = req.body;
  var simId = req.params.sim;
  var user = req.user;

  Sim.findOne({simId: simId, owner:user, verified: true}, function(err, sim) {
    if(!err && sim){
      Verify.findOne({simId: sim.simId}, function(err, verification) {
        if(!err && verification){
          verification.remove();
        }
      });
      sim.verified = false;
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
});

module.exports = router;
