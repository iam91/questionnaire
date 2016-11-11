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

		var back = document.createElement('article');

		var qhead = $(document.createElement('header')).html('<input type="text">')
													   .children()
													   .val(qTitle || '这里是标题')
													   .parent();

		
		var qfoot = document.createElement('footer');
		$(qfoot).html('<span>问卷截止日期</span><div></div><a href="#qlist">保存问卷</a><a>发布问卷</a>');

		var creator = qcreator.create()
							  .getElem();

		var qcontent = [];
		for(var i = 0; i < qcontent.length; i++){

		}

		$(back).append(qhead)
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