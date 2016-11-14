var express = require('express');

var qnair = require('../models/qnair');

var router = express.Router();

router.get('/qnair', function(req, res){
	//query all questionnairs
	qnair.getAll(function(err, docs){
		res.send(JSON.stringify(docs));
	});
});

router.get('/qnair/:id', function(req, res){
	//query a questionnair in detail
	var qid = req.params.id;
	qnair.getById(function(err, doc){
		res.send(JSON.stringify(doc));
	}, qid);
});
/*
router.post('/qnair', function(req, res){

});
*/

module.exports = router;