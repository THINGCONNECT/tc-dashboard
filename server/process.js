var nconf = require('nconf');

var mongoose = require('mongoose');
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

console.log("Connecting");

connection.on('ready', function () {
  console.log("Connected ", connection.state);
  connection.queue(nconf.get('AMQP_QUEUE'), {passive:true, durable: true}, function (q) {
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


//http://localhost:5000/api/sim/test/123/*86803%23
function activateSim(sim, verification){
  //Set ownership of sim
  sim.verified = true;
  sim.owner = verification.owner;
  sim.save();

  //delete verification
  verification.verified = true;
  verification.save();
}

function processSimCallback(sim, payload){
  if(sim.callbackUrl){
    var urlObj = url.parse(sim.callbackUrl);
    var simId = sim.simId;
    var encodedPayload = encodeURIComponent(payload);
    var options = {
      host: urlObj.host,
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
    if(urlObj.protocol == "https:"){
      https.request(options, callback).end();
    }else if(urlObj.protocol == "http:"){
      http.request(options, callback).end();
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
  }, {upsert: true, new: true}, function (err, sim) {
    if(!err && sim)
      processSim(sim, payload);
  });
}
