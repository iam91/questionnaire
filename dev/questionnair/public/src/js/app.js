requirejs.config({

	baseUrl: 'javascripts/lib',
	
	paths: {
		'app'       : '../../src/js',
		//components
		'qtable'    : '../../src/js/components/qtable',
		'qbody'     : '../../src/js/components/qbody',
		'zmodal'    : '../../src/js/components/zmodal',
		'zdate'     : '../../src/js/components/zdate',
		//service
		'qnairserv' : '../../src/js/service/qnairserv'
	},

	shim: {
		'zmodal': {
			exports: 'zm'
		},

		'zdate': {
			deps: ['jquery'],
			exports: 'zd'
		} 
	}
	
});

define(['jquery', 'zmodal', 'app/qcreate/ctrl', 
						   'app/qlist/ctrl', 
						   'app/qdata/ctrl',
						   'app/qfill/ctrl'], function($, zmodal, qcreate, 
						   								  		 qlist, 
						  								  		 qdata,
						  								  		 qfill){

	var $globalStorage = {};
	var $root = $('#app');

	var modal = zmodal('.z-modal');
	$globalStorage.modal = modal;

	function router(){
		route[predir].destroy();
		predir = location.hash.replace('#', '');
		predir = predir === '' ? 'default' : predir;
		route[predir].run($root, $globalStorage);
	}

	//register pages
	var route = {
		'default' : qcreate,
		//'default' : qcreate,
		'qlist'   : qlist,
		'qcreate' : qcreate,
		'qdata'   : qdata,
		'qfill'   : qfill,
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