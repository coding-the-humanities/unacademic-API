var BPromise = require('bluebird');
var mongoose = require('mongoose');

exports.findPoints = function (query) {
	return BPromise.cast(mongoose.model('point').find(query).exec());
};




