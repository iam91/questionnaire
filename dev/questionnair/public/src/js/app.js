requirejs.config({

	baseUrl: 'javascripts/lib',
	
	paths: {
		'app'       : '../../src/js',

		//utils
		'dateutil'  : '../../src/js/dateutil',
		
		//components
		'qtable'    : '../../src/js/components/qtable',
		'qbody'     : '../../src/js/components/qbody',
		'zmodal'    : '../../src/js/components/zmodal',
		'zdate'     : '../../src/js/components/zdate',

		//service
		'qnairserv' : '../../src/js/service/qnairserv',
		'qdataserv' : '../../src/js/service/qdataserv'
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

	var indexPage = '#qlist';

	function router(){
		$($root).empty();
		route[location.hash].render($root, $globalStorage);
	}

	//register pages
	var route = {
		'#qlist'   : qlist,
		'#qcreate' : qcreate,
		'#qdata'   : qdata,
		'#qfill'   : qfill,
	};

	/** procedure **/
	
	//monitor route change
	$(window).on('hashchange', function(e){
		router();
	});

	if(location.hash === indexPage){
		//when reload qlist page, manually trigger router();
		router();
	}
	location.hash = indexPage;
});