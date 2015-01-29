var express = require('express');
var Constellation = require('./schema');
var controller = require('./controller');

var router = express.Router();

router.post('/', function(req,res, next) {
	console.log(typeof(Constellation));
	//var constellation = new Constellation(req.body);
	var constellation = req.body;
	console.log('posting constellation:');
	var savePromise = controller.saveConstellation(constellation)
		.then(function(savedConstellation) {
			return res.status(200).json(savedConstellation);
		});

	savePromise.catch(function(error) {
		return res.status(500).send(error.message);
	});
});

router.get('/', function(req, res, next) {
	console.log('getting all constellations');
	controller.getConstellations().then(function(points) {
		return res.json(points);
	});
});

router.get('/:id', function(req, res, next) {
	console.log('getting constellation ' + req.params.id);
	var constellationId = req.params.id;
	var getPromise = controller.getConstellation(constellationId).then(function(point) {
		return res.status(200).json(point);
	});
	getPromise.catch(function(error) {
		return res.status(500).send(error);
	});
});

router.put('/:id', function(req, res, next) {
	console.log('updating constellation ' + req.params.id);
	var updatePromise = controller.updateConstellation(req.params.id, req.body)
		.then(function(updatedConstellation) {
			return res.status(200).json(updatedConstellation);
		});

	updatePromise.catch(function(error) {
		return res.status(500).send(error.message);
	});
});

router.delete('/:id', function(req, res, next) {
	console.log('deleting constellation ' + req.params.id);
	var constellationId = req.params.id;
	Constellation.findOneAndRemove({"_id": constellationId}, function(err, removed_point) {
		if (err) { next(err); }
		res.json(removed_point);
	});
});

module.exports = router;
