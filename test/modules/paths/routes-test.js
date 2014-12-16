const superagent = require('superagent');
const expect = require('chai').expect;

describe('unacademic-api server paths router', function(){
	var mock_resource = {
		curator: "Ashley Williams",
		title: "Writing RESTful APIs with Express and MongoDB",
		version: "1.0.0"
	};
	var mock_update = {
		curator: "Ashley Williams",
		title: "Writing RESTful APIs with Express and MongoDB",
		version: "2.0.0"
	};

	var host = 'http://localhost';
	var port = ':8080';
	var namespace = '/api/0';
	var collection_url = host + port + namespace + '/paths';
	var id;
	var element_url;
	var error;
	var response;

	// POST resources
	describe('when receiving a POST request', function() {
		beforeEach(function(done) {
			superagent.post(collection_url)
				.send(mock_resource)
				.end(function (err, res) {
					error = err;
					response = res;
					id = response.body.id;
					done();
				});
		});

		it('returns an Id', function(done) {
			expect(error).to.equal(null);
			expect(response.body.id).to.be.an.instanceof(Number);
			done();
		});
	});


	// GET resources
	describe('when receiving a GET paths request', function(done) {
		beforeEach(function(done) {
			superagent.get(element_url)
				.end(function (err, res) {
					error = err;
					response = res;
					done();
				});
		});

		it('returns a JSON document', function(done) {
			expect(error).to.equal(null);
			expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
			done();
		});

		it('returns an array', function(done) {
			expect(response.body).to.be.an.instanceof(Array);
			done();
		});

		// check that each element in res.body is a paths object
		it('returns only instances of Path', function(done) {
			done();
		});

	});

	describe('when receiving a GET path by id request', function(done) {
		beforeEach(function(done) {
			superagent.get(element_url)
				.end(function (err, res) {
					error = err;
					response = res;
					done();
				});
		});

		it('returns a JSON document', function(done) {
			expect(error).to.equal(null);
			expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
			done();
		});
	});
});


