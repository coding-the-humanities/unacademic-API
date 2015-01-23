var BPromise = require('bluebird');
var mongoose = require('mongoose');
var Point = require('./schema');

var findPoints = function (query) {
	return BPromise.cast(mongoose.model('point').find(query).exec());
};

exports.getPoint = function(pointId, cb) {
	var query = {_id: pointId };
	console.log('locating point with query ' + JSON.stringify(query));
	//return new BPromise(function(resolve, reject) {
		BPromise.onPossiblyUnhandledRejection(function(error) {
			return(error);
		});
		var findPromise = BPromise.cast(mongoose.model('point').findOne(query).exec());
		findPromise.then(Point.toAPI)
			.then(function(point) {
				//return resolve(point);
				return cb(null, point);
			});

		findPromise.catch(function(error) {
			console.log('catching find error');
			if (error.name === 'CastError') {
				var findError = 'Point with id ' + pointId + ' does not exist';
				console.log(findError);
				//return reject(findError);
				return cb(findError, null);
			}
			//reject(error);
			return cb(error, null);
		});
	//});
};

exports.getPoints = function() {
	return new BPromise(function(resolve, reject) {

		var findPromise = findPoints({})
			.then(Point.toAPIPoints)
			.then(resolve);
		console.log('in getPoints');

		findPromise.catch(reject);
	});
};

exports.updatePoint = function(id, pointData, cb) {
	Point.updatePoint(id, pointData, function(err, updatedPoint) {
		if (err) {
			return cb(err,null);
		}
		return cb(null, updatedPoint);
	});
};


exports.findPoints = findPoints;

