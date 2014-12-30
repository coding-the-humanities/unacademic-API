const port = process.env.PORT || '8080';
const host = process.env.HOST || '0.0.0.0';
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Secrets = require('./secrets');
const secrets = Secrets.getSecrets();

var Path = require('./api/modules/paths/schema');

var mongoLocalURL = "mongodb://" + host + "/unacademic_api";
var mongoLabURL = "mongodb://" + secrets.user + ":" + secrets.pass + "@ds029051.mongolab.com:29051/unacademic_api";

mongoose.connect(mongoLabURL);

var con = mongoose.connection;

con.once('open', function() {
	console.log('connected to mongodb successfully');
});


app.use(require('./api'));

app.listen(port, host);

console.log('Server running on %s:%d...', host, port);


module.exports = app;
