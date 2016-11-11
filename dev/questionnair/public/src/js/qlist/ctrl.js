define(['jquery', 'app/qlist/qtable'], function($, qtable){

	//// mock ////
	function query(){
		var data = [];
		for(var i = 0; i < 4; i++){
			var d = {
				id:         i, 
				title:      'q' + i,
				createTime: new Date(),
				status:     i > 2 ? 2 : i
			};
			data.push(d);
		}
		return data;
	}

	var title = [
		'title',
		'createTime'
	];

	var titleMap = {
		'title'     : '标题',
		'createTime': '时间'
	};
	//////////////

	var _$root = null;
	var _$globalStorage = null;

	function run($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;

		var qnairs = query();

		var createBtn = $(document.createElement('a'))
							.html('新建问卷')
							.attr('href', '#qcreate');

		if(qnairs.length){
			//questionnairs exist

			var list = qtable.create(_$globalStorage)
							 .setData(qnairs, title, titleMap)
							 .getElem();

			$(_$root).append(createBtn)
					.append(list);

		}else{
			//no questionnair

			var back = document.createElement('div');

			$(back).append(createBtn)
				   .appendTo(_$root);
		}
	}

	function destroy(){
		$(_$root).empty();
	}

	return {
		run     : run,
		destroy : destroy
	};
});