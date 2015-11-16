// Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Verify = mongoose.model('Verify');
var Sim = mongoose.model('Sim');
// bcrypt
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  type:     { type: String, default: "user" },
  sims:     [{type: Schema.Types.ObjectId, ref: 'Sim'}],
}, {collection: 'User'});

////////////////////////
// Hooks
////////////////////////
// Will not work with query based mongo functions: Users.find().remove()
// Only doc calls: user.remove();
// https://github.com/Automattic/mongoose/issues/1241
UserSchema.pre('remove', function(next) {
  this.model('Sim').find({owner: this._id}, function(err, sims){
    for(var i in sims){
      var sim = sims[i];
      sim.disown();
    }
    if(next) next(err);
  });
});

////////////////////////
// Statics
////////////////////////
UserSchema.statics.TYPE_USER = "user";
UserSchema.statics.TYPE_ADMIN = "admin";

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
  var self = this;
  bcrypt.compare(password, this.password, function(err, res) {
    if(callback)
      if(res) {
        callback(null, self);
      } else {
        callback(true, self);
      }
  });
};

////////////////////////
// User model
////////////////////////

var User = mongoose.model('User', UserSchema);