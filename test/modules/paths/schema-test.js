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
			version: "1.0.0",
			keywords: ["programming", "html", "css"]
		};

		beforeEach(function(done) {
			path = new Path(mock_resource);
			done();
		});

		it('returns a path with the required fields', function() {
			expect(path.created).to.be.an.instanceof(Date);
			expect(path._id).not.to.be.undefined;
			expect(path.curator.length > 0);
		});

		it('returns a path with a semVer-compliant version', function() {
			expect(path.version).to.match(/^[0-9]+\.[0-9]+\.[0-9]+/);
		});

		it('returns a path with lowercase keywords', function() {
			expect(path.keywords.length).to.equal(3);
			path.keywords.forEach(function(keyword) {
				expect(keyword).to.not.match(/[A-Z]/);
			});
		});

		it('returns a path with the values from the mock resource', function() {
			expect(path.curator).to.equal("Ashley Williams");
			expect(path.version).to.equal("1.0.0");
			expect(path.title).to.equal("Writing RESTful APIs with Express and MongoDB");
		});


	});
});
