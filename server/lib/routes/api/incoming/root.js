var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});
var simHandler = require('lib/simHandler');

router.route('/').post(function(req, res) {
  var simId = req.body.sim || '';
  var payload = req.body.payload || '';
  console.log("Incoming", simId, payload);
  simHandler.processMessage(simId, payload, function(err, msg){
    // console.log("msg callback");
    // console.log(err, msg);
    if(err){
      res.ok("Error! " + err);
    }else{
      res.ok(msg);
    }
  });
  
});

//http://localhost:5000/api/incoming/?apiKey=APIKEYHERE
//post data: sim=123456&payload=*86803%23

module.exports = router;
