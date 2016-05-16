var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var simHandler = require('lib/simHandler');

router.route('/').post(function(req, res) {
  var simId = req.params.sim;
  var payload = req.body.payload;
  simHandler.processMessage(simId, payload);
  res.ok(true);
});

//http://localhost:5000/api/sim/SIMID/?apiKey=APIKEYHEREpayload=*86803%23

module.exports = router;
