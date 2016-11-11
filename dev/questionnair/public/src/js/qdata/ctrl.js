define(['jquery'], function($){

	function run(){
		console.log('qdata');
	}

	function destroy(){
		console.log('dqdata');
	}

	return {
		run     : run,
		destroy : destroy
	};
});