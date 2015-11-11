var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});

var Verify = mongoose.model('Verify');

router.route('/').post(function (req, res) {
  console.log("Verification");
  var body = req.body;
  var simId = body.simId;
  var user = req.user;
  
  Verify.createVerification(simId, user, function(err, verification){
    if(!err){
      console.log("Verification Created ", verification.verifyCode);
      return res.ok({verifyCode: verification.verifyCode});
    } else {
      console.log("Verification not created", simId);
      return res.error(500, err);
    }
  });
});

router.route('/').get(function (req, res) {
  console.log("Verification");
  return res.ok("works");
});

module.exports = router;
