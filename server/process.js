var http = require('http');

var mongoose = require('mongoose');
require('./models/Sim');
var Sim = mongoose.model('Sim');

var amqp = require('amqp');

var queue = "message_queue";

var connection = amqp.createConnection(
  {
    host: process.env.AMQP_URL,
    //port: 5672,
    login: process.env.AMQP_LOGIN,
    password: process.env.AMQP_PASSWORD,
    vhost: process.env.AMQP_VHOST,
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
  connection.queue(queue, {passive:true, durable: true}, function (q) {
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
