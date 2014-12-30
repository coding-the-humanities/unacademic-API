var expect = require("chai").expect;
var request = require("supertest");
var express = require("express");
var app = express();

describe("save points", function() {
	it("should validate that curator and title are a foreign key");
	it("should validate that keywords are lowercased");

	var dataSavedPoint;
	var newPoint = {
		title: "Async",
		curator: "yeehaa",
		version: "1.0.0",
		summary: "A good way to explain asynchronicity is to take examples from everyday life",
		description: "Asynchronicity sounds like a difficult term, but it simply is an indication of action and time. Asynchronous events do not necessarily occur at the same time. They might have to wait or listen for other events to happen. To understand what asynchronicity exactly is, it is probably better to look at examples from everyday life. As a matter of fact, real life is full of asynchronous events."
	};

	it("should pass the job to the database save", function(done) {
		request(app).post('/api/0/points').send(newPoint).end(function(err, response) {
			expect(dataSavedPoint).to.deep.equal(newPoint);
			done();
		});
	});
	it("should return a status of 200 if the database saved");
	it("should return a point with an id");
	it("should return an error if the database failed");
});
