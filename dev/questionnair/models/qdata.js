var settings = require('./settings');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

function Qdata(){

}

Qdata.prototype._connect = function(fn){
	MongoClient.connect('mongodb://' + 
		settings.host + ':' + 
		settings.port + '/' + 
		settings.db,fn);
};

Qdata.prototype.insert = function(callback, data){
	this._connect(function(err, db){
			var collection = db.collection('qdata');
			//update expiration
			collection.insertOne(data,function(err, r){
				if(!err){
					callback(err);
				}else{
					callback(err);
				}
		    	db.close();
			});
		});
};

Qdata.prototype.queryById = function(callback, qid){
	this._connect(function(err, db){
		var colQdata = db.collection('qdata');
		colQdata.find({qid: qid}, {items: 1}).toArray(function(err, docs){
			if(!err){
				var colQnair = db.collection('qnairs');
				var data = docs;
				colQnair.find({_id: new ObjectID(qid)}).toArray(function(err, docs){
					if(!err){
						callback(err, {q: docs[0], data: data});
					}else{
						callback(err);
					}
					db.close();
				});
			}else{
				callback(err);
				db.close();
			}
		});
	});
};

module.exports = new Qdata();