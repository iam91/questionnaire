requirejs.config({

	baseUrl: 'javascripts/lib',
	
	paths: {
		app: '../../src/js',
	}
	
});

define(['jquery', 'app/qcreate/ctrl', 
				  'app/qlist/ctrl', 
				  'app/qdata/ctrl'], function($, qcreate, 
				  								 qlist, 
				  								 qdata){

	var $globalStorage = {};
	var $root = $('#app');

	function router(){
		route[predir].destroy();
		predir = location.hash.replace('#', '');
		predir = predir === '' ? 'default' : predir;
		route[predir].run($root, $globalStorage);
	}

	//register pages
	var route = {
		//'default' : qlist,
		'default' : qcreate,
		'qlist'   : qlist,
		'qcreate' : qcreate,
		'qdata'   : qdata
	};

	/** procedure **/

	
	location.hash = '';
	var predir = 'default';
	
	router();

	//monitor route change
	$(window).on('hashchange', function(e){

		router();
		
	});
	
});