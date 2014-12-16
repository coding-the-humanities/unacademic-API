var expect = require('chai').expect;
var mongoose = require('mongoose');

var Path = require('../../../api/modules/paths/schema');

var mock_resource = {
	curator: "Ashley Williams",
	title: "Writing RESTful APIs with Express and MongoDB",
	version: "1.0.0",
	keywords: ["programming", "HTML", "CSS"]
};

describe('When creating a Path', function() {
	var path;
	describe('that is empty', function() {
		// simple path creation
		path = new Path();
		it('returns a path object', function() {
			expect(path).not.to.be.undefined;
		});

		it('returns a path with the required fields', function() {
			expect(path.created).to.be.an.instanceof(Date);
			expect(path._id).not.to.be.undefined;
		});

	});

	describe('that is non-empty', function() {

		beforeEach(function(done) {
			path = new Path(mock_resource);
			done();
		});

		it('returns a path with the required fields', function() {
			expect(path.created).to.be.an.instanceof(Date);
			expect(path._id).not.to.be.undefined;
		});

		it('returns a path with the values from the mock resource', function() {
			expect(path.curator).to.equal("Ashley Williams");
			expect(path.version).to.equal("1.0.0");
			expect(path.title).to.equal("Writing RESTful APIs with Express and MongoDB");
		});


	});
});
