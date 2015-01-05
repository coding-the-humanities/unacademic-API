var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require("bluebird");
var seedPoints = require('../seeding/seedPoints');
var pointsData = require('../api/modules/points/points-data');

var mongoLabURL = "mongodb://admin:eOZE.97iNn@ds029051.mongolab.com:29051/unacademic_api";

function resetPoints() {
    return new Promise(function(resolve, reject) {
        console.log('resetting points database');
        mongoose.connection.collections['points'].drop(resolve, reject);
    });
}

var connectDB = Promise.promisify(mongoose.connect, mongoose);


describe("get points", function() {

    var points;

    before(function(done) {
        connectDB(mongoLabURL)
        .then(resetPoints)
        .then(seedPoints.seedPointsDB)
        .then(pointsData.findPoints)
        .then(function(pointsList) {
            points = pointsList;
            done();
        });
    });

    it("should never be empty since points are seeded", function() {
        expect(points.length).to.be.at.least(1);
    });

    it("should have a Point with a id", function() {
        expect(points[0]._id).to.not.be.undefined;
    });

    it("should have a Point with a curator", function() {
        expect(points[0].curator).to.not.be.empty;
    });

    it("should have a Point with a title", function() {
        expect(points[0].title).to.not.be.empty;
    });

    it("should have a Point with a semVer formatted version", function() {
        expect(points[0].version).to.not.be.empty;
        expect(points[0].version).to.match(/^[0-9]+\.[0-9]+\.[0-9]+/);
    });

    it("should have a Point with a valid date", function() {
        expect(points[0].created).to.be.an.instanceof(Date);
    });

	after(function(done) {
		mongoose.connection.close();
		done();
	});
});
