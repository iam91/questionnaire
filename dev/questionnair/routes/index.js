
/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
*/

var Qnair = require('../models/qnairs');

module.exports = function(app){
    app.get('/qnair', function(req, res){
        
        Qnair.getBrief(null, function(err, qnairs){

	    	res.send(JSON.stringify(qnairs));

		});
	});

	app.post('/qitem', function(req, res){

		var _id = req.body._id;

		Qnair.getWhole(_id, function(err, qitems){

			res.send(JSON.stringify(qitems));

		});
	});
};
