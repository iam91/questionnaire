var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Qnair(qnair){
}

Qnair.prototype.getWhole = function(qid, callback){
	this._get(qid, callback, true);
};

Qnair.prototype.getBrief = function(qid, callback){
	this._get(qid, callback, false);
};

Qnair.prototype._get = function(qid, callback, isWhole){

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
	    	var proj = isWhole ? {} : {items: false};

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
