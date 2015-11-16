var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req, res, next) {
  if(req.user) {
    return next();
  }
  return res.error(403);
};