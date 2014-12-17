var mongoose = require('mongoose');

var Path;

//var PathSchema = new mongoose.Schema({});

var PathSchema = new mongoose.Schema({
	curator: {type: String, required: true},
	title: {type: String, require: true},
	version: {type: String, require: true},
	image_url: {type: String},
	summary: {type: String},
	description: {type: String},
	license: {type: String},
	keywords: {type: [String]},
	forks: {type: [String]},
	forked_from: {type: String},
	learners: {type: [String]},
	waypoints: {type: [String], required: true},
	created: {type: Date, required: true, default: Date.now},
})

// Convert model to API-safe object

PathSchema.methods.toAPI = function(cb) {
	ret = this;

	delete ret._id;
	delete ret.__v;
	cb(null, ret);

}

Path = mongoose.model("path", PathSchema);

module.exports = Path;
