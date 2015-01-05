var express = require('express');
var Point = require('./schema');
var pointsData = require('./points-data');

var router = express.Router();

router.post('/', function(req,res) {
	var point = new Point(req.body);
	console.log('posting point:');
	//console.log(point);
	point.savePoint(function(err, savedPoint) {
		if (err) {
			return res.status(400).send(err);
		}
		savedPoint.toAPI(function(err, apiPoint) {
			return res.status(200).json(apiPoint);
		});
	});
});

router.get('/', function(req, res, next) {
	console.log('getting all points');
	pointsData.findPoints({}).then(function(points) {
		return res.json(points);
	});
	/*
	Point.find(function(err, points) {
		if (err) { next(err); }
		res.json(points);
	});
	*/

});

router.get('/:id', function(req, res, next) {
	console.log('getting point ' + req.params.id);
	var pointId = req.params.id;
	Point.findById(pointId, function(err, point) {
		if (err) { next(err); }
		res.json(point);
	});
});

router.put('/:id', function(req, res, next) {
	console.log('updating point ' + req.params.id);
	Point.update({"_id": req.params.id}, {$set: req.body}, function(err, result) {
		if (err) { return next(err); }
		Point.findById(req.params.id, function(err, point) {
			res.json(point);
		});
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
