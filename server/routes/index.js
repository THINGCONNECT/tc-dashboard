// Require other routes here
module.exports = function(app) {
  // app.use('/sample', require('./sample'));
  // app.use('/api/devices', require('./device'));
  app.use('/api/users', require('./user'));
  app.use('/api/sim', require('./sim'));
};