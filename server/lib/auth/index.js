
require('./init');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
  ensureAuthMiddleware: function(req, res, next) {
    if(!req.user) {
      return res.error(403);
    }
    next();
  }
};