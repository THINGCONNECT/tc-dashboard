var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var SimSchema = new Schema({
  simId:        {type: String, required: true, unique: true},
  // apiKey:       {type: String, unique: true},

  owner:        {type: Schema.Types.ObjectId, ref: 'User'},
  dateCreated:  {type: Date, default: Date.now},

  verified:     {type: Boolean, default: false},
  locked:       {type: Boolean, default: false},
  
  incomingCount: {type: Number, default: 0},
  outgoingCount: {type: Number, default: 0}

}, {collection: 'Sim', versionKey: false});

SimSchema.statics.createSim = function(simId, cb) {
  var sim = new Sim({
    simId: simId,
    verified: false,
  });
  sim.save(function(err){
    cb(err, sim);
  });
};

SimSchema.methods.verify = function(str, cb) {
  if(!this.verified && str == this.verifyStr){
    this.verified = true;
    this.save(function(err, res){
      if(!err){
        cb(true);
      }
    });
  }else{
    cb(false);
  }
};

var Sim = mongoose.model('Sim', SimSchema);
