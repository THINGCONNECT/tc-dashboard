
require('./init');

module.exports = {
  ensureAuthMiddleware: function(req, res, next) {
    if(!req.user) {
      return res.error(403);
    }
    next();
  },
  isAdmin: function(req, res, next) {
    if(req.user && req.user.type == "admin") {
      return next();
    }
    return res.error(403);
  }
};