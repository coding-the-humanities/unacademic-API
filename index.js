const port = process.env.PORT || '8080';
const host = process.env.HOST || '0.0.0.0';
const mongoose = require('mongoose');
const express = require('express');
const app = express();

var Path = require('./api/modules/paths/schema');

var mongoURL = "mongodb://" + host + "/unacademic_test1";

mongoose.connect(mongoURL, function(err) {
	if (err) { throw err; }

	app.use(require('./api'));

	app.listen(port, host);

	console.log('Server running on %s:%d...', host, port);

});

module.exports = app;
