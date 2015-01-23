var expect = require("chai").expect;
var superagent = require("superagent");
var mongoose = require('mongoose');
var BPromise = require('bluebird');
var pointsData = require('../api/modules/points/points-data');
var Point = require('../api/modules/points/schema');

var mongoLocalURL = "mongodb://localhost/unacademic_api";
var mongoLabURL = "mongodb://admin:eOZE.97iNn@ds029051.mongolab.com:29051/unacademic_api";

function resetPoints() {
    return new BPromise(function(resolve, reject) {
        mongoose.connection.collections['points'].drop(resolve, reject);
    });
}

var connectDB = BPromise.promisify(mongoose.connect, mongoose);

var mockPoint = {
	title: "Async",
	curator: "yeehaa",
	version: "1.0.0",
	summary: "A good way to explain asynchronicity is to take examples from everyday life",
	description: "Asynchronicity sounds like a difficult term, but it simply is an indication of action and time. Asynchronous events do not necessarily occur at the same time. They might have to wait or listen for other events to happen. To understand what asynchronicity exactly is, it is probably better to look at examples from everyday life. As a matter of fact, real life is full of asynchronous events.",
	keywords: ["AJAX", "JavaScript"]
};

var postedPointId;

describe("when saving points", function() {
	var postedPoint;
	var error;
	var status;
	var points;

	describe("that are valid points", function() {
		before(function(done) {
			//connectDB(mongoLabURL)
			connectDB(mongoLocalURL)
			.then(resetPoints)
			.then(function() {
				superagent.post('http://0.0.0.0:8080/api/0/points').send(mockPoint).end(function(err, response) {
					error = err;
					postedPoint = response.body;
					status = response.status;
					postedPointId = postedPoint.id;
					done();
				});
			});
		});

		it("should return keywords in lowercased", function() {
			expect(postedPoint.keywords[0]).to.equal('ajax');
			expect(postedPoint.keywords[1]).to.equal('javascript');
		});

		it("should return a status of 200 if the database saved", function() {
			expect(status).to.equal(200);
		});
		it("should return a point with an id", function() {
			expect(postedPoint.id).to.not.be.undefined;
		});
	});

	describe("with existing foreign key", function() {

		before(function(done) {
			superagent.post('http://0.0.0.0:8080/api/0/points').send(mockPoint).end(function(err, response) {
				error = err;
				responseError = response.error.text;
				status = response.status;
				done();
			});
		});

		it("should return an error that curator and title are an existing foreign key", function() {
			expect(responseError).to.equal('Combination of curator and title already exists');
			expect(status).to.equal(400);
		});
	});

	describe("that are incomplete", function() {
		/*
		before(function(done) {
			resetPoints()
				.then(done);
		});
		*/

		it("should return an error if required fields are missing", function(done) {
			var invalidPoint = mockPoint;
			delete invalidPoint.title;
			superagent.post('http://0.0.0.0:8080/api/0/points').send(invalidPoint).end(function(err, response) {
				var error = response.error.text;

				expect(response.error.text).to.equal('Point is missing required fields \'title\'')
				expect(status).to.equal(400);
				done();
			});
		});

	});

	after(function(done) {
		mongoose.connection.close();
		done();
	});

});

describe("when getting points", function() {
	var error;
	var getPoints;
	var id;
	var status;
	before (function(done) {
		superagent.get('http://0.0.0.0:8080/api/0/points').end(function(err, response) {
			error = err;
			getPoints = response.body;
			status = response.status;
			id = getPoints[0].id;
			done();
		});
	});

	describe("with an existing id", function() {
		var getPoint;
		before (function(done) {
			superagent.get('http://0.0.0.0:8080/api/0/points/' + id).end(function(err, response) {
				error = err;
				getPoint = response.body;
				status = response.status;
				done();
			});
		});

		it("should return a point with an id", function() {
			expect(getPoint.id).to.not.be.undefined;
		});
		it("should return a point without __v field", function() {
			expect(getPoint.__V).to.be.undefined;
		});
		it("should return a point without _id field", function() {
			expect(getPoint._id).to.be.undefined;
		});
		it("should return status code 200", function() {
			expect(status).to.equal(200);
		});
	});
	describe("with an non-existing id", function() {
		var id = "bla";
		var error;
		before (function(done) {
			superagent.get('http://0.0.0.0:8080/api/0/points/' + id).end(function(err, response) {
				error = response.error.text;
				getPoint = response.body;
				status = response.status;
				done();
			});
		});

		it("should return an error that there is no point with that id", function() {
			expect(status).to.equal(500);
			expect(error).to.equal("Point with id " + id + " does not exist");
		});
	});
});

describe("when updating a point", function() {
	describe("with a new title", function() {

		var mockUpdate = mockPoint;
		var error;
		var updatedPoint;

		before(function(done) {

			mockUpdate.title = "Nsync";

			superagent.put('http://0.0.0.0:8080/api/0/points/' + postedPointId).send(mockUpdate).end(function(err, response) {
				updatedPoint = response.body;
				done();
			});
		});

		it("should return the upddated point with the new title", function() {
			expect(updatedPoint.title).to.equal(mockUpdate.title);
		});
	});

	describe("with a waypoint containing a new foreignKey", function() {
		var mockUpdate = mockPoint;
		var error;
		var updatedPoint;

		before(function(done) {

			mockUpdate.curator = "marijn";

			superagent.put('http://0.0.0.0:8080/api/0/points/' + postedPointId).send(mockUpdate).end(function(err, response) {
				error = response.error.text;
				updatedPoint = response.body;
				done();
			});
		});

		it("should return an 'unknown foreignkey' error", function() {
			expect(error).to.equal("updated waypoint has different curator than existing waypoint");
		});
	});
});
