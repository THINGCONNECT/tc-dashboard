var nconf = require('nconf');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Sim = mongoose.model('Sim');
var Verify = mongoose.model('Verify');

var http = require('http');
var https = require('https');
var url = require('url');

var amqp = require('amqp');

if(!(nconf.get('AMQP_URL') && nconf.get('AMQP_LOGIN') && nconf.get('AMQP_PASSWORD') && nconf.get('AMQP_VHOST'))){
  console.log("AMQP Credentials not found");
  return;
}

var connectedSockets;

var connection = amqp.createConnection(
  {
    host: nconf.get('AMQP_URL'),
    //port: 5672,
    login: nconf.get('AMQP_LOGIN'),
    password: nconf.get('AMQP_PASSWORD'),
    vhost: nconf.get('AMQP_VHOST'),
    // connectionTimeout: 10000,
    // authMechanism: 'AMQPLAIN',
    // noDelay: true,
    // ssl: {
    //   enabled : false
    // }
  }
);
if(nconf.get('POLL_AMQP')){

  console.log("Connecting to AMQP");

  connection.on('ready', function () {
    console.log("Connected ", connection.state);
    connection.queue(nconf.get('AMQP_QUEUE_IN'), {passive:true, durable: true}, function (q) {
      console.log("Queue");
      q.subscribe(function (message, headers, deliveryInfo, messageObject) {
        // Print messages to stdout
        // q.bind('#');
        console.log(message.data.toString());
        
        var data = message.data.toString();
        var dataArr = data.split(",");
        console.log(dataArr);
        if(dataArr.length == 5){
          var simId = dataArr[1].substr(6);
          var payload = dataArr[4];
          processMessage(simId, payload);
        }else{
          console.log("Malformed Message", data);
        }
      });
    });
  });
}else{
  console.log("AMQP Polling is off");
}

//http://localhost:5000/api/sim/test/123/*86803%23
function activateSim(sim, verification){
  //Set ownership of sim
  sim.verified = true;
  sim.owner = verification.owner;
  sim.save(function(err){
    if(!err){
      User.findByIdAndUpdate(verification.owner, {$push: {sims: sim}}, function(err, user) {
        if(err){
          console.error("Something went wrong activating sim", err);
        }
      });
    }
  });

  //delete verification
  verification.verified = true;
  verification.save();
}

function processSimCallback(sim, payload){

  // This could be done better, reduce to O(log n) later
  for(var k in connectedSockets){
    if(connectedSockets[k].user._id + "" == sim.owner._id + ""){
      connectedSockets[k].emit('incoming', {
        sim: sim._id,
        simId: sim.simId,
        payload: payload
      });
      // console.log("Incoming SIM message", sim._id, simId, payload);
    }
  }

  // connectedSockets
  if(sim.callbackUrl){
    var urlObj = url.parse(sim.callbackUrl);
    var simId = sim.simId;
    var encodedPayload = encodeURIComponent(payload);
    var options = {
      host: urlObj.hostname,
      port: urlObj.port,
      path: (urlObj.pathname?urlObj.pathname:"") + "?" + (urlObj.query?urlObj.query + "&":"") + "sim=" + simId + "&payload=" + encodedPayload
    };
    callback = function(response) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('end', function () {
        console.log(str);
      });
    }
    try{
      if(urlObj.protocol == "https:"){
        https.request(options, callback).on('error',function(e){
           console.log("Error: ", urlObj, options, "\n" + e.message); 
           console.log( e.stack );
        }).end();
      }else if(urlObj.protocol == "http:"){
        http.request(options, callback).on('error',function(e){
           console.log("Error: ", urlObj, options, "\n" + e.message); 
           console.log( e.stack );
        }).end();
      }
    }catch(e){
      console.log("Failed to process sim: ", urlObj, options);
    }
  }
  console.log("processSimCallback()");
  //http.request(options, callback).end();
}

function processSim(sim, payload){
  if(sim.locked) return;

  console.log("Processing sim ", sim, payload);
  if(sim.verified){
    //Payload logic
    console.log("process payload logic");
    processSimCallback(sim, payload);
  }else{
    //Verify logic
    console.log(payload.trim());
    Verify.findOne({simId: sim.simId}, function(err, verification) {
      if(!err && verification){
        if(verification.verify(payload.trim())){
          //Activate sim card
          activateSim(sim, verification);
          console.log("Activate sim card");
        }else{
          console.log("verification failed");
        }
      }else{
        //No verification created yet
        console.log("Verification failed");
      }
    });
  }
}

function processMessage(simId, payload){
  Sim.findOneAndUpdate({simId: simId}, {
    $setOnInsert: {
      name: simId,
      simId: simId,
      verified: false,
    }
  }, {upsert: true, new: true})
  .populate('owner')
  .exec(function (err, sim) {
    if(!err && sim)
      processSim(sim, payload);
  });
}

function sendMessage(simId, payload, cb){
  try{
    connection.publish(nconf.get('AMQP_QUEUE_OUT'), payload, null, function(err, a){
      // cant get this to work properly
    });
    cb();
  }catch(e){
    cb(e);
  }
}

function setConnectedSockets(sockets){
  connectedSockets = sockets;
}

module.exports = {
  processMessage: processMessage,
  sendMessage: sendMessage,
  setConnectedSockets: setConnectedSockets
};
