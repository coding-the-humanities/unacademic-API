var express = require('express');
var Waypoint = require('./schema');
var controller = require('./controller');

var router = express.Router();

router.post('/', function(req,res, next) {
	console.log(typeof(Waypoint));
	//var waypoint = new Waypoint(req.body);
	var waypoint = req.body;
	console.log('posting waypoint:');
	var savePromise = controller.saveWaypoint(waypoint)
		.then(function(savedWaypoint) {
			return res.status(200).json(savedWaypoint);
		});

	savePromise.catch(function(error) {
		return res.status(500).send(error.message);
	});
});

router.get('/', function(req, res, next) {
	console.log('getting all waypoints');
	controller.getWaypoints().then(function(points) {
		return res.json(points);
	});
});

router.get('/:id', function(req, res, next) {
	console.log('getting waypoint ' + req.params.id);
	var waypointId = req.params.id;
	var getPromise = controller.getWaypoint(waypointId).then(function(point) {
		return res.status(200).json(point);
	});
	getPromise.catch(function(error) {
		return res.status(500).send(error);
	});
});

router.put('/:id', function(req, res, next) {
	console.log('updating waypoint ' + req.params.id);
	var updatePromise = controller.updateWaypoint(req.params.id, req.body)
		.then(function(updatedWaypoint) {
			return res.status(200).json(updatedWaypoint);
		});

	updatePromise.catch(function(error) {
		return res.status(500).send(error.message);
	});
});

router.delete('/:id', function(req, res, next) {
	console.log('deleting waypoint ' + req.params.id);
	var waypointId = req.params.id;
	Waypoint.findOneAndRemove({"_id": waypointId}, function(err, removed_point) {
		if (err) { next(err); }
		res.json(removed_point);
	});
});

module.exports = router;
