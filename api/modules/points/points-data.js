var promise = require('bluebird');
var mongoose = require('mongoose');

exports.findPoints = function (query) {
	return promise.cast(mongoose.model('point').find(query).exec());
};




