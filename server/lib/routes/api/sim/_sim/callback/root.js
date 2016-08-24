var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var Sim = mongoose.model('Sim');
var simHandler = require('lib/simHandler');

//This endpoint is for testing purposes
router.route('/').post(function(req, res) {
  var simId = req.params.sim;
  var payload = req.body.payload || '';
  var requestType = req.body.requestType;
  var requestUrl = req.body.url;
  var user = req.user;
  
  Sim.findOne({simId: simId, owner:user, verified: true}, function(err, sim) {
    if(!err && sim){
      
      simHandler.callSim(sim, payload, function(err, msg){
        if(err)
          return res.error(500);
        res.ok(msg);
      }, requestType, requestUrl);

    }else{
      res.error(404);
    }
  });

});

// http://localhost:5000/api/sim/123/send
// {payload:"test"}

module.exports = router;
