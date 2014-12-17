const expect = require('chai').expect;
const controller = require('../../../api/modules/paths/controller');

var mock_path = {
	curator: "Ashley Williams",
	title: "Writing RESTful APIs with Express and MongoDB",
	version: "1.0.0",
	keywords: ["programming", "HTML", "CSS"],
};

describe('When a new path is submitted', function(done) {
	var error;
	var checked_path;

	describe('without a curator value', function() {
		var posted_path = mock_path;
		posted_path.curator = '';

		beforeEach(function(done) {
			controller.checkPath(posted_path, function(err, path) {
				error = err;
				checked_path = path;
			});
			done();
		});

		it('should return an Required field missing error', function(done) {
			expect(error).to.equal('Required fields missing: curator');
			done();
		});
	});

	describe('with all required fields filled in', function() {
		var posted_path = mock_path;

		beforeEach(function(done) {
			controller.checkPath(posted_path, function(err, path) {
				error = err;
				checked_path = path;
			});
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
	});

});

describe('When a path is to be retrieved', function() {

});

describe('When a path is to be updated', function() {

});

describe('When a path is to be deleted', function() {

});



