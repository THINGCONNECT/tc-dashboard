var nconf = require('nconf');

module.exports = function(req, res, next) {
  var apiKey = req.query.apiKey;
  if(apiKey == nconf.get('INCOMING_API_KEY')) {
    return next();
  }
  return res.error(403, "Invalid API Key");
};