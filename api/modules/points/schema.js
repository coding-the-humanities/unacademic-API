var mongoose = require('mongoose');
var BPromise = require('bluebird');

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
					return reject("Point is missing required fields '" + missing.join("' and '") + "'");
				}
				//return cb(null);
				console.log('testMissingFields: no error');
				return resolve(null);
			}
		});
	});
}

function testVersionFormat(point, cb) {
	if (!(point.version.match(/^[0-9]+\.[0-9]+\.[0-9]+/))) {
		return cb("version is not in SemVer format");
	}
	return cb(null);
}

function validateRequiredFields(point, cb) {
	var validationError = '';
	testMissingFields(point)
		.then(function() {
			console.log('moving on to testVersionFormat ');
			testVersionFormat(point, function(err) {
				if (err) {
					validationError += err + '\n';
				}

				if (validationError.length === 0) {
					return cb(null);
				}
				return cb(validationError);
			});
		}, function(err) {
			validationError += err + '\n';
			return cb(validationError);
		});
	// TO IMPLEMENT: curator should be existing user in database
}

function lowerKeywords(point) {
	return new BPromise(function(resolve, reject) {
		var lowKeywords = [];
		point.keywords.forEach(function(keyword) {
			lowKeywords.push(keyword.toLowerCase());
			if (lowKeywords.length === point.keywords.length) {
				point.keywords = lowKeywords;
				return resolve(null);
			}
		});
	});
}

function testForeignKey(curator, title) {
	return new BPromise(function(resolve, reject) {
		// find points with curator and title as query
		var query = {"curator": curator, "title": title};
		Point.findOne(query, function(err, point) {
			if (err) { return reject(err); }
			// if point is not null, the foreign key is not unique
			if (point) {
				console.log('foreign key ' + query +' already exists');
				err = 'Combination of curator and title already exists';
				return reject(err);
			}

			console.log('foreign key ' + query +' is accepted');
			return resolve(null);
		});
	});
}

// Convert model to API-safe object

PointSchema.methods.toAPI = function(cb) {
	var ret = { 'id': this.id };
	for (var prop in this) {
		if (allFields.indexOf(prop) > 1) {
			ret[prop] = this[prop];
		}
	}
	//ret['id'] = this._id;
	return cb(null, ret);
};

PointSchema.methods.savePoint = function(cb) {
	console.log('starting save');
	var ret = this;
	validateRequiredFields(ret, function(err) {
		if (err) {
			console.log('Error validating required fields:');
			console.log(err);
			return cb(err, null);
		}
		console.log('validating required fields done');
		lowerKeywords(ret)
		.then(function() {
			console.log('lowercasing keywords done');
			testForeignKey(ret.curator, ret.title)
			.then(function() {
				console.log('testing foreign key done');
				ret.save(function(err, savedPoint) {
					if (err) {
						return cb(err, null);
					}
					console.log('saving point done');
					return cb(err, savedPoint);
				});
			}, function(err) {
				if (err) { return cb(err, null); }

			});
		});
	});
};

PointSchema.methods.updateConflict = function updateConflict (updateId) {
	if (this._id === undefined) { return false; }
	if (this._id === updateId) { return true; }
	return false;
};

Point = mongoose.model("point", PointSchema);
module.exports = Point;
