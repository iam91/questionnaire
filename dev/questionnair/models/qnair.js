var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Qnair(qnair){
}

Qnair.prototype.getAll = function(callback){
	this._get(callback);
};

Qnair.prototype.getById = function(callback, qid){
	this._get(callback, qid, true);
};

Qnair.prototype._get = function(callback, qid, detail){

    mongodb.open(function(err, db){

        if(err){
        	console.log('open err');
            return callback(err);
        }

		db.collection('qnairs', function(err, collection){
		    if(err){
		    	console.log('collection err');
		        mongodb.close();
				return callback(err);
	    	}

	    	var cond = qid ? {_id: new ObjectID(qid)} : {};
	    	var proj = detail ? {} : {items: false};

	    	console.log(cond);
	    	console.log(proj);

		    collection.find(cond, proj).toArray(function(err, doc){
		    	mongodb.close();
				if(doc){
				    callback(err, doc);
				}else{
				    callback(err, null);
				}
		    });
		});
    });
};

module.exports = new Qnair();
