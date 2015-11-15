// Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// bcrypt
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // apiKey:   { type: String, unique: true },
}, {collection: 'User'});


////////////////////////
// Statics
////////////////////////
UserSchema.statics.createUser = function(username, password, callback) {
  username = username.toLowerCase();
  this.model('User').findOne({username: username}, function(err, user) {
    if(user) {
      return callback(new Error('User already exists.'));
    } else {
      return bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            var newUser = new User({
              username: username,
              password: hash,
            });

            newUser.save(function(err) {
              if(err) return callback(err);
              return callback(null, newUser);
            });
          });
      });
    }
  })
};

////////////////////////
// Instance methods
////////////////////////

UserSchema.methods.validPassword = function(password, callback) {
  console.log("Compare Password", password);
  var self = this;
  bcrypt.compare(password, this.password, function(err, res) {
    if(res) {
      callback(null, self);
    } else {
      callback(true, self);
    }
  });
};

UserSchema.methods.delete = function(cb) {
  return this.model('Sim').find({owner: this._id}, cb);
};

////////////////////////
// User model
////////////////////////

var User = mongoose.model('User', UserSchema);