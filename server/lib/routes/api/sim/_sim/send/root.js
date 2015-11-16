var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var simHandler = require('lib/simHandler');

//This endpoint is for testing purposes
router.route('/').get(function(req, res) {
  var simId = req.params.sim;
  var payload = req.body.payload;
  payload = "TEST!";
  simHandler.sendMessage(simId, payload, function(err) {
    res.ok(true);
  });
});

//http://localhost:5000/api/sim/123/*86803%23

module.exports = router;
