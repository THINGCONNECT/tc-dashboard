/**
 * Express requirements
 */
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var serveStatic = require('serve-static');
var favicon = require('serve-favicon');
var http = require('http');
var nconf = require('nconf');
var mongoose = require('mongoose');

// Define global constants
require('./global');

/**
 * Load configuration
 */

nconf
	.argv()
	.env();



var development = true;

if (process.env.NODE_ENV && process.env.NODE_ENV == "production") {
	development = false;
}

nconf.overrides({
	development: development
});

nconf.file(development ? __dirname + '/config/development.json' : __dirname + '/config/production.json');

nconf.defaults({
	PORT: 3000,
	MONGO_URI: "mongodb://localhost/local",
	SESSION_SECRET: "the mean stack is a very mean stack :)",
	NODE_ENV: "development",
});

var db = mongoose.connection;
var reconnectTime;

function connectMongo(){
  mongoose.connect(nconf.get('MONGOLAB_URI') || nconf.get('MONGO_URI'), {server:{auto_reconnect:true}});
}

connectMongo();
//Auto reconnect script
db.on('error', function(error) {
  // console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});
// db.on('reconnected', function () {
//   console.log('MongoDB reconnected!');
// });
db.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  if(reconnectTime) clearTimeout(reconnectTime);
  reconnectTime = setTimeout(connectMongo, 500);
});
db.on('connected', function() {
  console.log('MongoDB connected!');
});
// db.once('open', function() {
//   console.log('MongoDB connection opened!');
// });

http.ServerResponse.prototype.ok = function(data) {
  return this.json(data);
};
http.ServerResponse.prototype.error = function(status, message, meta) {
  return this.status(status).json({message: message, meta: meta});
};

/** Declare the express app */

var app = express();

if (development) {
	app.use(morgan('dev'));
	app.use(errorHandler());
}

if (process.env.DEBUG) {
	app.use(morgan('dev'));
	app.use(errorHandler());
}

// app.set('view engine', 'ejs');

/** Serve the public static assets before processing anything  */
app.use('/', serveStatic(__dirname + '/public', {'index': ['index.html']}));
app.use('/node_modules', serveStatic(__dirname + (development ? '/../node_modules' : '/node_modules')));
app.use(favicon(__dirname + '/favicon.ico'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: nconf.get('SESSION_SECRET') || 'yolo secret',
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));
app.use(passport.initialize());
app.use(passport.session());

// Load models
require('./models');

// Init auth
require('./auth');
// Load routes
require('./routes')(app);

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

// Serve angular index
var theIndex = require('fs').readFileSync(__dirname + "/public/index.html");
app.use('*', function(req, res) {
  res.set('Content-Type', 'text/html');
  return res.send(theIndex);
});

var server = app.listen(process.env.PORT || 3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Server listening at http://%s:%s', host, port);
});

// Run SIM process
require('./simHandler');
