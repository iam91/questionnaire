var express = require('express');

var qnair = require('../models/qnair');
var qdata = require('../models/qdata');

var router = express.Router();

router.get('/qnair', function(req, res){
	qnair.getAll(function(err, docs){
		if(err){
			res.status(500);
		}else{
			res.status(200).json(docs);
		}
	});
});

router.get('/qnair/:id', function(req, res){
	var qid = req.params.id;
	qnair.getById(function(err, doc){
		if(err){
			res.status(500);
		}else{
			res.status(200).json(doc);
		}
	}, qid);
});

router.post('/qnair', function(req, res){
	var q = req.body;
	qnair.insert(function(err, ret){
		if(err){
			res.status(500);
		}else{
			res.status(201).json(q);
		}
	}, q);
});

router.put('/qnair/:id', function(req, res){
	var id = req.params.id;
	var q = req.body;
	qnair.updateById(function(err, ret){
		if(err){
			res.status(500);
		}else{
			res.status(201).json(q);
		}
	}, id, q);
});

router.delete('/qnair/:id', function(req, res){
	var id = req.params.id;
	qnair.deleteById(function(err){
		if(err){
			res.status(500);
		}else{
			res.status(204).json(null);
		}
	}, id);
});

router.get('/qdata/:qid', function(req, res){
	var qid = req.params.qid;
	qdata.queryById(function(err, data){

		if(!err){
			var docs = data.data;
			if(docs.length){
				var count = [];
				var model = docs[0].items;

				model.forEach(function(val){
					var item = [];
					val.forEach(function(){
						item.push(0);
					});
					count.push(item);
				});

				var tot = 0;
				docs.forEach(function(val){
					tot++;
					var items = val.items;
					for(var i = 0; i < items.length; i++){
						for(var j = 0; j < items[i].length; j++){
							count[i][j] += items[i][j];
						}
					}
				});
				res.status(200).json(
					{
						q: data.q, 
						data: count,
						tot: tot
					}
				);
			}else{
				res.status(200).json(null);
			}
		}else{
			res.status(500);
		}
	}, qid);
});

router.post('/qdata', function(req, res){
	var d = req.body;
	qdata.insert(function(err, ret){
		if(err){
			res.status(500);
		}else{
			res.status(201).json(d);
		}
	}, d);
});

module.exports = router;