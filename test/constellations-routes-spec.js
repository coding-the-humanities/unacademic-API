var expect = require("chai").expect;
var superagent = require("superagent");
var mongoose = require('mongoose');
var BPromise = require('bluebird');
var Constellation = require('../api/modules/constellations/schema');

var mongoLocalURL = "mongodb://localhost/unacademic_api";
var mongoLabURL = "mongodb://admin:eOZE.97iNn@ds029051.mongolab.com:29051/unacademic_api";

var mongoURL = mongoLabURL;
//var mongoURL = mongoLocalURL;

function resetConstellations() {
    return new BPromise(function(resolve, reject) {
        mongoose.connection.collections['constellations'].drop(resolve, reject);
    });
}

var connectDB = BPromise.promisify(mongoose.connect, mongoose);

var mockConstellation = {
	"curator": "yeehaa",
	"curator_org": "University of Amsterdam",
	"description": "A constellation about programming and tool building for humanities research",
	"id": 1,
	"image_url": "",
	"keywords": ["Programming", "Humanities", "Tool building"],
	"license": "MIT",
	"summary": "",
	"title": "Coding the Humanities",
	"version": "0.1.0",
	"constellations": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
};

var postedConstellationId;

describe("when saving constellations", function() {
	var postedConstellation;
	var error;
	var status;
	var constellations;

	describe("that are valid constellations", function() {
		before(function(done) {
			connectDB(mongoURL)
			.then(resetConstellations)
			.then(function() {
				superagent.post('http://0.0.0.0:8080/api/0/constellations').send(mockConstellation).end(function(err, response) {
					error = err;
					postedConstellation = response.body;
					status = response.status;
					postedConstellationId = postedConstellation.id;
					done();
				});
			});
		});

		it("should return keywords in lowercased", function() {
			expect(postedConstellation.keywords[0]).to.equal('programming');
			expect(postedConstellation.keywords[1]).to.equal('humanities');
		});

		it("should return a status of 200 if the database saved", function() {
			expect(status).to.equal(200);
		});
		it("should return a constellation with an id", function() {
			expect(postedConstellation.id).to.not.be.undefined;
		});
	});

	describe("with existing foreign key", function() {

		before(function(done) {
			superagent.post('http://0.0.0.0:8080/api/0/constellations').send(mockConstellation).end(function(err, response) {
				error = err;
				responseError = response.error.text;
				status = response.status;
				done();
			});
		});

		it("should return an error that curator and title are an existing foreign key", function() {
			expect(responseError).to.equal('Combination of curator and title already exists');
			expect(status).to.equal(500);
		});
	});

	describe("that are incomplete", function() {

		it("should return an error if required fields are missing", function(done) {
			var invalidConstellation = mockConstellation;
			delete invalidConstellation.title;
			superagent.post('http://0.0.0.0:8080/api/0/constellations').send(invalidConstellation).end(function(err, response) {
				var error = response.error.text;

				expect(response.error.text).to.equal('Constellation is missing required fields \'title\'')
				expect(status).to.equal(500);
				done();
			});
		});

	});

	after(function(done) {
		mongoose.connection.close();
		done();
	});

});

describe("when getting constellations", function() {
	var error;
	var getConstellations;
	var id;
	var status;
	before (function(done) {
		superagent.get('http://0.0.0.0:8080/api/0/constellations').end(function(err, response) {
			error = err;
			getConstellations = response.body;
			status = response.status;
			id = getConstellations[0].id;
			done();
		});
	});

	describe("with an existing id", function() {
		var getConstellation;
		before (function(done) {
			superagent.get('http://0.0.0.0:8080/api/0/constellations/' + id).end(function(err, response) {
				error = err;
				getConstellation = response.body;
				status = response.status;
				done();
			});
		});

		it("should return a constellation with an id", function() {
			expect(getConstellation.id).to.not.be.undefined;
		});
		it("should return a constellation without __v field", function() {
			expect(getConstellation.__V).to.be.undefined;
		});
		it("should return a constellation without _id field", function() {
			expect(getConstellation._id).to.be.undefined;
		});
		it("should return status code 200", function() {
			expect(status).to.equal(200);
		});
	});
	describe("with an non-existing id", function() {
		var id = "bla";
		var error;
		before (function(done) {
			superagent.get('http://0.0.0.0:8080/api/0/constellations/' + id).end(function(err, response) {
				error = response.error.text;
				getConstellation = response.body;
				status = response.status;
				done();
			});
		});

		it("should return an error that there is no constellation with that id", function() {
			expect(status).to.equal(500);
			expect(error).to.equal("Constellation with id " + id + " does not exist");
		});
	});
});

describe("when updating a constellation", function() {
	describe("with a new title", function() {

		var mockUpdate = mockConstellation;
		var error;
		var updatedConstellation;

		before(function(done) {

			mockUpdate.title = "Nsync";

			superagent.put('http://0.0.0.0:8080/api/0/constellations/' + postedConstellationId).send(mockUpdate).end(function(err, response) {
				updatedConstellation = response.body;
				done();
			});
		});

		it("should return the upddated constellation with the new title", function() {
			expect(updatedConstellation.title).to.equal(mockUpdate.title);
		});
	});

	describe("with a constellation containing a new foreignKey", function() {
		var mockUpdate = mockConstellation;
		var error;
		var updatedConstellation;

		before(function(done) {

			mockUpdate.curator = "marijn";

			superagent.put('http://0.0.0.0:8080/api/0/constellations/' + postedConstellationId).send(mockUpdate).end(function(err, response) {
				error = response.error.text;
				updatedConstellation = response.body;
				done();
			});
		});

		it("should return an 'unknown foreignkey' error", function() {
			expect(error).to.equal("updated constellation has different curator than existing constellation");
		});
	});
});
