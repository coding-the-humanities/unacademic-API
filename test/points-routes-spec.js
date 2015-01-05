var expect = require("chai").expect;
var superagent = require("superagent");
var mongoose = require('mongoose');
var BPromise = require('bluebird');
var pointsData = require('../api/modules/points/points-data');
var Point = require('../api/modules/points/schema');

var createPoint = BPromise.promisify(Point.create, Point);

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


describe("when saving points", function() {
	var postedPoint;
	var error;
	var status;
	var points;

	before(function(done) {
		connectDB(mongoLabURL)
		//connectDB(mongoLocalURL)
		.then(resetPoints)
		.then(function() {
			superagent.post('http://0.0.0.0:8080/api/0/points').send(mockPoint).end(function(err, response) {
				error = err;
				postedPoint = response.body;
				status = response.status;
				done();
			});
		});
		/*
		*/
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

describe("when saving point with existing foreign key", function() {

	before(function(done) {
		superagent.post('http://0.0.0.0:8080/api/0/points').send(mockPoint).end(function(err, response) {
			error = err;
			responseError = response.error.text;
			status = response.status;
			done();
		});
	});

	it("should validate that curator and title are a foreign key", function() {
		expect(responseError).to.equal('Combination of curator and title already exists');
		expect(status).to.equal(400);
	});
});

describe("when saving invalid points", function() {

	before(function(done) {
		resetPoints()
			.then(done);
	});

	it("should return an error if required fields are missing", function(done) {
		var invalidPoint = mockPoint;
		delete invalidPoint.title;
		superagent.post('http://0.0.0.0:8080/api/0/points').send(invalidPoint).end(function(err, response) {
			var error = response.error.text;

			expect(response.error.text).to.equal('Point is missing required fields \'title\'\n')
			expect(status).to.equal(400);
			done();
		});
	});

	after(function(done) {
		mongoose.connection.close();
		done();
	});

});



