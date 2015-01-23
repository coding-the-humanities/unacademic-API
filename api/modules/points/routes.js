var express = require('express');
var Point = require('./schema');
var pointsData = require('./points-data');

var router = express.Router();

router.post('/', function(req,res, next) {
	var point = new Point(req.body);
	console.log('posting point:');
	point.savePoint(function(err, savedPoint) {
		if (err) {
			return res.status(400).send(err.message);
		}
		return res.status(200).json(savedPoint);
	});
});

router.get('/', function(req, res, next) {
	console.log('getting all points');
	pointsData.getPoints().then(function(points) {
		return res.json(points);
	});
	/*
	pointsData.findPoints({}).then(function(points) {
		return res.json(points);
	});
	*/

});

router.get('/:id', function(req, res, next) {
	console.log('getting point ' + req.params.id);
	var pointId = req.params.id;
	pointsData.getPoint(pointId, function(error, point) {
		if (error) {
			return res.status(500).send(error);
		}
		return res.status(200).json(point);
	});
});

router.put('/:id', function(req, res, next) {
	console.log('updating point ' + req.params.id);
	pointsData.updatePoint(req.params.id, req.body, function(error, updatedPoint) {
		if (error) {
			console.log('router gets error: ');
			console.log(error.message);
			return res.status(500).send(error.message);
		}
		return res.status(200).json(updatedPoint);
	});
});

router.delete('/:id', function(req, res, next) {
	console.log('deleting point ' + req.params.id);
	var pointId = req.params.id;
	Point.findOneAndRemove({"_id": pointId}, function(err, removed_point) {
		if (err) { next(err); }
		res.json(removed_point);
	});
});

module.exports = router;
