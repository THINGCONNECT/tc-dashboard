var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});

router.route('/').get(function(req, res) {
  if(req.user){
    return res.ok(true);
  }else{
    return res.error(500);
  }
});

module.exports = router;