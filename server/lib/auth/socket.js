var User = require('mongoose').model('User');
module.exports = function(socket, next){
  User.findById(socket.request.session.passport.user, function(err, user) {
    socket.user = user;
    next();
  });
};