var express = require('express');

var qnair = require('../models/qnair');

var router = express.Router();

router.get('/qnair', function(req, res){
	qnair.getAll(function(err, docs){
		res.json(docs);
	});
});

router.get('/qnair/:id', function(req, res){
	var qid = req.params.id;
	qnair.getById(function(err, doc){
		res.json(doc);
	}, qid);
});

router.post('/qnair', function(req, res){
	var q = req.body;
	qnair.insert(function(err, ret){
		res.json(ret);
	}, q);
});

router.put('/qnair/:id', function(req, res){
	var id = req.params.id;
	var q = req.body;
	qnair.updateById(function(err, ret){
		res.json(ret);
	}, id, q);
});

router.delete('/qnair/:id', function(req, res){
	var id = req.params.id;
	qnair.deleteById(function(err){
		res.json(err);
	}, id);
});

module.exports = router;