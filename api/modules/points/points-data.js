var Promise = require('bluebird');
var mongoose = require('mongoose');

exports.findPoints = function (query) {
	return Promise.cast(mongoose.model('point').find(query).exec());
};

