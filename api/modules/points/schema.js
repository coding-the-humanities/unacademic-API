var mongoose = require('mongoose');
var BPromise = require('bluebird');
var pointsData = require('./points-data');

var Point;

var requiredFields = ['curator','title','version'];
var allFields = [
	'curator',
	'curator_org',
	'contributors',
	'title',
	'version',
	'summary',
	'description',
	'keywords',
	'forks',
	'forked_from',
	'objectives',
	'created',
];
//var PointSchema = new mongoose.Schema({});

var PointSchema = new mongoose.Schema({
	curator: {type: String, required: true},
	curator_org: {type: String},
	contributors: {type: [String]},
	title: {type: String, required: true},
	version: {type: String, required: true},
	summary: {type: String},
	description: {type: String},
	keywords: {type: [String]},
	forks: {type: [String]},
	forked_from: {type: String},
	objectives: {type: [String]},
	created: {type: Date, required: true, default: Date.now}
});

function testMissingFields(point) {
	var missing = [];
	var count = 0;
	return new BPromise(function(resolve, reject) {
		requiredFields.forEach(function(field) {
			if (point[field] === undefined) {
				missing.push(field);
			}
			count++;
			if (count === requiredFields.length) {
				if (missing.length > 0) {
					console.log('testMissingFields: missing fields error');
					var message = "Point is missing required fields '" + missing.join("' and '") + "'";
					var error = new Error(message);
					console.log(error);
					return reject(error);
				}
				console.log('testMissingFields: no error');
				return resolve(point);
			}
		});
	});
}

function testCurator(pointData, id) {
	return new BPromise(function(resolve, reject) {
		Point.findById(id, function(err, foundPoint) {
			if (foundPoint.curator !== pointData.curator) {
				var error = new Error('updated waypoint has different curator than existing waypoint');
				console.log(error);
				return reject(error);
			}
			console.log('testCurator: no error');
			pointData.id = id;
			return resolve(pointData);
		});
	});
}
function testVersionFormat(point) {
	return new BPromise(function(resolve, reject) {
		if (!(point.version.match(/^[0-9]+\.[0-9]+\.[0-9]+/))) {
			var error = new Error("version is not in SemVer format");
			return reject(error);
			//return reject("version is not in SemVer format");
		}
			console.log('testVersionFormat: no error');
		return resolve(point);
	});
}

function lowerKeywords(point) {
	return new BPromise(function(resolve) {
		var lowKeywords = [];
		point.keywords.forEach(function(keyword) {
			lowKeywords.push(keyword.toLowerCase());
			if (lowKeywords.length === point.keywords.length) {
				point.keywords = lowKeywords;
				console.log('lowerKeywords: no error');
				return resolve(point);
			}
		});
	});
}

function testForeignKey(point) {
	return new BPromise(function(resolve, reject) {
		// find points with curator and title as query
		var query = {"curator": point.curator, "title": point.title};
		Point.findOne(query, function(err, result) {
			if (err) { return reject(err); }
			// if point is not null, the foreign key is not unique
			if (result) {
				console.log('foreign key ' + query +' already exists');
				err = new Error('Combination of curator and title already exists');
				return reject(err);
			}

			console.log('foreign key ' + query +' is accepted');
			return resolve(point);
		});
	});
}

// Convert model to API-safe object

function toAPI(point) {
	return new BPromise(function(resolve) {
		var ret = { 'id': point.id };
		for (var prop in point) {
			if (allFields.indexOf(prop) > 1) {
				ret[prop] = point[prop];
			}
		}
			console.log('toAPI: no error');
		return resolve(ret);
	});
}

exports.toAPI = toAPI;

function updateDB(pointData) {
	return new BPromise(function(resolve, reject) {
		Point.update({"_id": pointData.id}, {$set: pointData}, function(err, result) {
			if (err) { return reject(err); }
			Point.findById(pointData.id, function(err, updatedPoint) {
				if (err) {
					var error = new Error ('error updating point');
					console.log(error);
					return reject(error);
				}
				console.log('updateDB: no error');
				return resolve(updatedPoint);
			});
		});
	});
}

function updatePoint(id, pointData, cb) {
	console.log('starting update');
	var updatePromise = testCurator(pointData, id)
		.then(testMissingFields)
		.then(testVersionFormat)
		.then(lowerKeywords)
		.then(updateDB)
		.then(toAPI)
		.then(function(updatedPoint) {
			//return resolve(updatedPoint);
			cb(null, updatedPoint);
		});

	updatePromise.catch(function(error) {
		console.log('updatePoint catches an error');
		console.log(error);
		cb(error, null);
	});
}

exports.updatePoint = updatePoint;

function saveToDB(point) {
	return new BPromise(function(resolve, reject) {
		point.save(function(err, savedPoint) {
			if (err) {
				return reject(err);
			}
			console.log('point saved');
			return resolve(savedPoint);
		});
	});
}

PointSchema.methods.savePoint = function(cb) {
	console.log('starting save');
	var point = this;
	var savePromise = testForeignKey(point)
		.then(testMissingFields)
		.then(testVersionFormat)
		.then(lowerKeywords)
		.then(saveToDB)
		.then(toAPI)
		.then(function(savedPoint) {
			//return resolve(savedPoint);
			cb(null, savedPoint);
		});

	savePromise.catch(function(error) {
		console.log('savePoint catches an error');
		console.log(error);
		cb(error, null);
	});
};

var toAPIPoints = function(points) {
	return new BPromise(function(resolve, reject) {
		var apiSafePoints = [];
		points.forEach(function(point) {
			var pointPromise = toAPI(point);
			pointPromise.then(function(apiSafePoint) {
				apiSafePoints.push(apiSafePoint);
				if (apiSafePoints.length === points.length) {
					return resolve(apiSafePoints);
				}
			});
			pointPromise.catch(reject);
		});
	});
};

exports.toAPIPoints = toAPIPoints;

PointSchema.methods.updateConflict = function updateConflict (updateId) {
	if (this._id === undefined) { return false; }
	if (this._id === updateId) { return true; }
	return false;
};

Point = mongoose.model("point", PointSchema);
module.exports = Point;
