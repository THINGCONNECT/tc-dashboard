var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var simHandler = require('lib/simHandler');

var Sim = mongoose.model('Sim');
var Verify = mongoose.model('Verify');


router.route('/').get(function(req, res) {
  var simId = req.params.sim;
  var payload = req.params.payload;
  simHandler.processMessage(simId, payload);
  res.ok(true);
});

//http://localhost:5000/api/sim/123/payload/*86803%23

module.exports = router;
