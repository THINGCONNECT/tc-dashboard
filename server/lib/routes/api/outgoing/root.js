var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var Sim = mongoose.model('Sim');
var simHandler = require('lib/simHandler');

//This endpoint is for testing purposes
router.route('/').get(function(req, res) {
  var simId = req.query.sim;
  var payload = req.query.payload;
  console.log(simId);
  // TODO: Add api key check

  // Check for API key
  Sim.findOne({simId: simId, verified: true}, function(err, sim) {
    if(!err && sim){
      simHandler.sendMessage(simId, payload, function(err, msg) {
        if(err)
          return res.error(500);
        res.ok(true);
      });
    }else{
      res.error(404);
    }
  });
});

//http://localhost:5000/api/sim/123/*86803%23

module.exports = router;
