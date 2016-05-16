var nconf = require('nconf');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Sim = mongoose.model('Sim');
var Verify = mongoose.model('Verify');

var http = require('http');
var https = require('https');
var url = require('url');
var querystring = require('querystring');

var connectedSockets;

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
    var data = {
      sim: simId,
      payload: payload
    };
    httpRequest(sim.callbackUrl, 'get', data, cb);

    // var urlObj = url.parse(sim.callbackUrl);
    // var simId = sim.simId;
    // var encodedPayload = encodeURIComponent(payload);
    // var options = {
    //   host: urlObj.hostname,
    //   port: urlObj.port,
    //   path: (urlObj.pathname?urlObj.pathname:"") + "?" + (urlObj.query?urlObj.query + "&":"") + "sim=" + simId + "&payload=" + encodedPayload
    // };
    // callback = function(response) {
    //   var str = '';
    //   response.on('data', function (chunk) {
    //     str += chunk;
    //   });
    //   response.on('end', function () {
    //     console.log(str);
    //   });
    // }
    // try{
    //   if(urlObj.protocol == "https:"){
    //     https.request(options, callback).on('error',function(e){
    //      console.log("Error: ", urlObj, options, "\n" + e.message); 
    //      console.log( e.stack );
    //    }).end();
    //   }else if(urlObj.protocol == "http:"){
    //     http.request(options, callback).on('error',function(e){
    //      console.log("Error: ", urlObj, options, "\n" + e.message); 
    //      console.log( e.stack );
    //    }).end();
    //   }
    // }catch(e){
    //   console.log("Failed to process sim: ", urlObj, options);
    // }
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

function httpRequest(targetUrl, method, data, cb) {
  try{
    var urlObj = url.parse(targetUrl);

    var send_data = querystring.stringify(data);
    var post = method.toLowerCase() == 'post';

    var options = {
      host: urlObj.hostname,
      port: urlObj.port,
      method: method
    };

    if(post){
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(send_data)
      }
      options.path = (urlObj.pathname ? urlObj.pathname : "") + (urlObj.query? "?" + urlObj.query:"");
    }else{
      //get
      var queryString;
      if(urlObj.query && send_data){
        queryString = "?" + urlObj.query + "&" + send_data;
      }else if(send_data){
        queryString = "?" + send_data;
      }else if(urlObj.query){
        queryString = "?" + urlObj.query;
      }
      
      options.path = (urlObj.pathname ? urlObj.pathname : "") + (queryString?queryString:"");
    }

    var callback = function(response) {
      if(cb){
        var str = "";
        response.on('data', function (chunk) {
          str += chunk;
        }).on('end', function () {
          cb(null, str);
        });
      }
    }
    console.log(options);
    var req;

    if(urlObj.protocol == "https:"){
      req = https.request(options, callback);
    }else if(urlObj.protocol == "http:"){
      req = http.request(options, callback);
    }

    req.on('error', function(err) {
      console.log("HTTP Request Failed", err);
      cb(err);
    });
    if(post){
      req.write(send_data);
    }
    req.end();
  }catch(e){
    console.log(e);
  }
}

function sendMessage(simId, payload, cb){
  try{
    //Hit TC Middleware
    var key = nconf.get('OUTGOING_API_KEY');
    var outgoingUrl = nconf.get('OUTGOING_URL');
    var data = {
      apiKey:key,
      sim: simId,
      payload: payload
    };
    httpRequest(outgoingUrl, 'post', data, cb);
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
