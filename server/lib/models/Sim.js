var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var SimSchema = new Schema({
  name:         {type: String, required: true},
  simId:        {type: String, required: true, unique: true},
  callbackUrl:  {type: String},
  callbackType: {type: String},

  owner:        {type: Schema.Types.ObjectId, ref: 'User'},
  dateCreated:  {type: Date, default: Date.now},

  verified:     {type: Boolean, default: false},
  locked:       {type: Boolean, default: false},
  
  incomingCount: {type: Number, default: 0},
  outgoingCount: {type: Number, default: 0}
}, {collection: 'Sim'});

SimSchema.statics.createSim = function(simId, cb) {
  var sim = new Sim({
    name: simId,
    simId: simId,
    verified: false,
  });
  sim.save(function(err){
    if(cb) cb(err, sim);
  });
};

SimSchema.methods.verify = function(str, cb) {
  if(!this.verified && str == this.verifyStr){
    this.verified = true;
    this.save(function(err, res){
      if(!err){
        if(cb) cb(true);
      }
    });
  }else{
    if(cb) cb(false);
  }
};

SimSchema.methods.disown = function(cb){
  this.model('User').findByIdAndUpdate(this.owner, {$pull: {sims: this._id }}).exec();
  this.model('Verify').findOne({simId: this.simId}).exec(function(err, verify){
    if(verify)
      verify.remove();
  });
  this.verified = false;
  this.save(function(err){
   if(cb) return cb(err);
  });
}

var Sim = mongoose.model('Sim', SimSchema);
