define(['jquery', 'app/qcreate/qcreator'], function($, qcreator){

	var _$root = null;
	var _$globalStorage = null;

	function run($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;

		/**
		 * @todo query questionnair
		 */
		var currq = _$globalStorage.currq;
		console.warn(currq);
		
		var qTitle = null;
		var qs = [];

		var back = document.createElement('div');

		var qhead = $(document.createElement('div')).addClass('q-create-head')
													.html('<input class="q-edit" type="text" placeholder="这里是标题">')
												   	.children()
												   	.val(qTitle || '')
												   	.parent();

		
		var qfoot = document.createElement('div');
		$(qfoot).addClass('q-create-foot')
				.html('<span>问卷截止日期</span><div></div>' + 
					  '<a class="btn btn-default">发布问卷</a>' + 
					  '<a class="btn btn-transp" href="#qlist">保存问卷</a>');

		var creator = qcreator.create()
							  .getElem();

		var qcontent = [];
		for(var i = 0; i < qcontent.length; i++){

		}

		$(back).addClass('q-back q-back-white')
			   .append(qhead)
			   .append(creator)
			   .append(qfoot)
			   .appendTo(_$root);
	}

	function destroy(){

		$(_$root).empty();

	}

	return {
		run     : run,
		destroy : destroy
	};
});