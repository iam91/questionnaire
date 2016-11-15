var settings = require('./settings');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

function Qnair(qnair){
}

Qnair.prototype.getAll = function(callback){
	MongoClient.connect('mongodb://' + 
		settings.host + ':' + 
		settings.port + '/' + 
		settings.db, 
		function(err, db){
			var collection = db.collection('qnairs');
			collection.find({}, {items: false}).toArray(function(err, doc){
				if(doc){
				    callback(err, doc);
				}else{
				    callback(err, []);
				}
		    	db.close();
		    });
		});
};

Qnair.prototype.getById = function(callback, qid){
	MongoClient.connect('mongodb://' + 
		settings.host + ':' + 
		settings.port + '/' + 
		settings.db, 
		function(err, db){
			var collection = db.collection('qnairs');
			collection.find({_id: new ObjectID(qid)}, {}).toArray(function(err, doc){
				if(doc){
				    callback(err, doc);
				}else{
				    callback(err, []);
				}
		    	db.close();
		    });
		});
};

Qnair.prototype.insert = function(callback, data){
	MongoClient.connect('mongodb://' + 
		settings.host + ':' + 
		settings.port + '/' + 
		settings.db, 
		function(err, db){
			var collection = db.collection('qnairs');
			collection.insertOne(data, function(err, r){
				if(!err){
					callback(err, data);
				}else{
					callback(err, null);
				}
		    	db.close();
		    });
		});
}

Qnair.prototype.deleteById = function(callback, qid){
	MongoClient.connect('mongodb://' + 
		settings.host + ':' + 
		settings.port + '/' + 
		settings.db, 
		function(err, db){
			var collection = db.collection('qnairs');
			var obId = qid.split(',').map(function(id){
				return new ObjectID(id);
			});
			
			collection.deleteMany({_id: {$in: obId}}, function(err, r){
				callback(err);
		    	db.close();
		    });
		});
}

module.exports = new Qnair();
