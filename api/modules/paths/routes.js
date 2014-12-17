var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
	// send non-JSON to fail test
	//res.send('respond with a path resource');
	// send JSON with single object
	//res.json({"name": "marijn"});
	// send JSON array
	res.json([]);
});

module.exports = router;
