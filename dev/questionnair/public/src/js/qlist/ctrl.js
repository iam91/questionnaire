define(['jquery', 'qtable'], function($, qtable){

	//render functions
	function hasQnair(data){

		var createBtn = $(document.createElement('a'))
							.html('新建问卷')
							.attr('name', 'qcreate')
							.addClass('btn btn-enable')
							.on('click', function(e){
								_$globalStorage.qid = null;
								location.hash = '#' + e.target.name;
							});

		var back = document.createElement('div');
		var list = qtable.create(_$globalStorage)
						 .setData(data, title, titleMap)
						 .getElem();

		$(back).addClass('q-back')
			   .append(createBtn)
			   .append(list)
			   .appendTo(_$root);
	}

	function noQnair(){
		var createBtn = $(document.createElement('a'))
							.html('新建问卷')
							.attr('name', 'qcreate')
							.addClass('btn btn-enable')
							.on('click', function(e){
								_$globalStorage.qid = null;
								location.hash = '#' + e.target.name;

							});

		var back = document.createElement('div');

		$(back).addClass('q-back q-back-white q-list-back')
			   .append(createBtn)
			   .appendTo(_$root);
	}

	//query	
	function query(){

		$.ajax('/qnair', {

			dataType: 'json',
			method: 'GET'
		
		}).done(function(data){
		 	if(data && data.length){
		 		hasQnair(data);
		 	}else{
		 		noQnair();
		 	}

		}).fail(noQnair);
	}

	//meta data for model
	var title = [
		'title',
		'createTime'
	];

	var titleMap = {
		'title'     : '标题',
		'createTime': '时间'
	};


	var _$root = null;
	var _$globalStorage = null;

	function run($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;

		query();
	}

	function destroy(){
		$(_$root).empty();
	}

	return {
		run     : run,
		destroy : destroy
	};
});