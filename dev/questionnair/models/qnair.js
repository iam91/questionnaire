var settings = require('./settings');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

function Qnair(qnair){
}

Qnair.prototype._connect = function(fn){
	MongoClient.connect('mongodb://' + 
		settings.host + ':' + 
		settings.port + '/' + 
		settings.db, fn);
};

Qnair.prototype.getAll = function(callback){
	this._connect(function(err, db){
		var collection = db.collection('qnairs');
		//update expiration
		collection.updateMany(
			{ 
				endTime: { $lt: new Date()}, 
				status: 1 
			}, 
			{ $set:  { status: 2 } }, 
			{}, 
			function(err, r){
				if(!err){
					collection.find({}, {items: false}).toArray(function(err, doc){
						if(err){
							callback(err, []);
						}else{
							callback(err, doc);
						}
						db.close();
					});
				}else{
					callback(err, []);
					db.close();
				}
			});
		});
};

Qnair.prototype.getById = function(callback, qid){
	this._connect(function(err, db){
			var collection = db.collection('qnairs');
			collection.find({_id: new ObjectID(qid)}, {}).toArray(function(err, data){
				if(err){
				    callback(err);
				}else{
				    callback(err, data);
				}
		    	db.close();
		    });
		});
};

Qnair.prototype.insert = function(callback, data){
	this._connect(function(err, db){
			var collection = db.collection('qnairs');

			data.createTime = new Date(data.createTime);
			data.endTime = new Date(data.endTime);

			collection.insertOne(data, function(err, r){
				if(!err){
					callback(err);
				}else{
					callback(err);
				}
		    	db.close();
		    });
		});
}

Qnair.prototype.deleteById = function(callback, qid){
	this._connect(function(err, db){
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

Qnair.prototype.updateById = function(callback, qid, data){
	this._connect(function(err, db){
			var collection = db.collection('qnairs');
			collection.updateOne({_id: new ObjectID(qid)}, {$set: data}, function(err, r){
				if(!err){
					callback(err);
				}else{
					callback(err);
				}
		    	db.close();
		    });
		});
}

module.exports = new Qnair();
