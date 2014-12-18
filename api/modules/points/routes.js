var express = require('express');
var Point = require('./schema');

var router = express.Router();

router.post('/', function(req,res, next) {
	var point = new Point(req.body);
	point.validate(function(err, validPoint) {
		if (err) { res.send('Invalid point'); }

		point.save(function(err, result) {
			if (err) { next(err); }
			res.json(result);
		});
	});
});

router.get('/', function(req, res, next) {
	console.log('getting all points');
	Point.find(function(err, points) {
		if (err) { next(err); }
		res.json(points);
	});

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
