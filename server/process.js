var nconf = require('nconf');

var mongoose = require('mongoose');
require('./models/Sim');
var Sim = mongoose.model('Sim');

var amqp = require('amqp');

if(!(nconf.get('AMQP_URL') && nconf.get('AMQP_LOGIN') && nconf.get('AMQP_PASSWORD') && nconf.get('AMQP_VHOST'))){
  console.log("AMQP Credentials not found"):
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
        var payload = dataArr[4];
        processMessage("test", payload);
      }else{
        console.log("Malformed Message", data);
      }
    });
  });
});

function processMessage(simId, payload){
  console.log("Message callback");
  
}
