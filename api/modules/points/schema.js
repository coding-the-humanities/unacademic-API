var mongoose = require('mongoose');

var Point;

//var PointSchema = new mongoose.Schema({});

var PointSchema = new mongoose.Schema({
	curator: {type: String, required: true},
	curator_org: {type: String},
	constributors: {type: [String]},
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

// Convert model to API-safe object

PointSchema.methods.toAPI = function(cb) {
	var ret = this;
	delete ret._id;
	delete ret.__v;
	cb(null, ret);
};

PointSchema.methods.validate = function(cb) {
	// check that keywords are lowercase
	var validPoint = this;
	validPoint.keywords = this.keywords.map(function(value) {
		return value.toLowerCase();
	});
	cb(null, validPoint);
};

Point = mongoose.model("point", PointSchema);

PointSchema.methods.updateConflict = function updateConflict (updateId) {
	if (this._id === undefined) { return false; }
	if (this._id === updateId) { return true; }
	return false;
};

module.exports = Point;
