const dbHost = process.env.DATABASE_HOST || 'localhost';
const dbName = process.env.DATABASE_NAME || 'unacademic';
const dbPort = process.env.DATABASE_PORT || 27017;
const port = process.env.APPLICATION_PORT || '3333';
const host = process.env.HOST || '0.0.0.0';
const mongoose = require('mongoose');
const express = require('express');
const app = express();

var login = {
	"user": "testuser",
	"pass": "blabla"
};

var mongoLocalURL = "mongodb://" + dbHost + ":" + dbPort + "/" + dbName;
// var mongoLabURL = "mongodb://" + login.user + ":" + login.pass + "@ds029051.mongolab.com:29051/unacademic_api";

// mongoose.connect(mongoLabURL);
mongoose.connect(mongoLocalURL);

var con = mongoose.connection;

con.once('open', function() {
	console.log('connected to mongodb successfully');
});

con.once('error', function() {
	console.log('MongoLab connection error');
	console.error.bind(console, 'connection error:');
});


app.use(require('./api'));

app.listen(port, host);

console.log('Server running on %s:%d...', host, port);


module.exports = app;
