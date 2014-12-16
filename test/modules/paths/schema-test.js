var expect = require('chai').expect;
var mongoose = require('mongoose');

var Path = require('../../../api/modules/paths/schema');


describe('When creating a Path', function() {
	var path;
	describe('When creating an empty path', function() {
		// simple path creation
		path = new Path();
		it('returns a path object', function() {
			expect(path).not.to.be.undefined;
		});
	});

	describe('When creating a non-empty path', function() {
		var mock_resource = {
			curator: "Ashley Williams",
			title: "Writing RESTful APIs with Express and MongoDB",
			version: "1.0.0"
		};

		beforeEach(function(done) {
			path = new Path(mock_resource);
			done();
		});

		it('returns a path with the required fields', function() {
			expect(path.created).to.be.an.instanceof(Date);
			expect(path._id).to.exist;
		});

		it('returns a path with arrays for the right fields', function() {
			expect(path.waypoints).to.be.an.instanceof(Array);
			expect(path.learners).to.be.an.instanceof(Array);
			expect(path.forks).to.be.an.instanceof(Array);
			expect(path.keywords).to.be.an.instanceof(Array);
		});

		it('returns a path with the values from the mock resource', function() {
			expect(path.curator).to.equal("Ashley Williams");
			expect(path.version).to.equal("1.0.0");
			expect(path.title).to.equal("Writing RESTful APIs with Express and MongoDB");
		});

	});
});
