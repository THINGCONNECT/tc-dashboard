var mongoose = require('mongoose');
var Sim = mongoose.model('Sim');
var Schema = mongoose.Schema;

var VerifySchema = new Schema({
  simId:        {type: String, required: true, unique: true},
  owner:        {type: Schema.Types.ObjectId, ref: 'User'},
  dateCreated:  {type: Date, default: Date.now},
  verified:     {type: Boolean, default: false},
  verifyCode:    {type: String},
  //Lock verify if too many verified attempts
}, {collection: 'Verify', versionKey: false});

VerifySchema.statics.createVerification = function(simId, user, callback) {
  var self = this;
  self.model('Sim').findOne({simId: simId}, function(err, sim) {
    if(!err && (!sim || (sim && !sim.verified))){
      var verificationCode = "*" + parseInt(Math.random() * 100000) + "#";

      //Check if there's an existing pending verification code
      self.model('Verify').findOne({simId: simId}, function(err, verification) {
        if(!err){
          if(!verification){
            verification = new Verify({
              simId: simId,
              owner: user,
              verifyCode: verificationCode,
              verified: false
            });
          }else{
            verification.verifyCode = verificationCode;
          }
          verification.save(function(err, res){
            if(!err){
              return callback(null, verification);
            }else{
              console.log(err);
              return callback("Something went wrong", null);
            }
          });
        }else{
          console.log(err);
          return callback("Something went wrong", null);
        }
      });
    }else{
      if(sim && sim.verified){
        callback("This card is already verified", null);
      }else{
        console.log(err);
        callback("Something went wrong", null);
      }
    }
  });
};

VerifySchema.methods.verify = function(str) {
  return !this.verified && str == this.verifyCode;
};

var Verify = mongoose.model('Verify', VerifySchema);
