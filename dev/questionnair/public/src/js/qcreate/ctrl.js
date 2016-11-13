define(['jquery', 'app/qcreate/qcreator'], function($, qcreator){

	//render functions
	function renderQnair(data){
		var back = document.createElement('div');
		var qhead = $(document.createElement('div')).addClass('q-create-head')
													.html('<input class="q-edit" type="text" placeholder="这里是标题">')
												   	.children()
												   	.val(data && data.title || '')
												   	.parent();
		var qfoot = document.createElement('div');
		$(qfoot).addClass('q-create-foot')
				.html('<span>问卷截止日期</span><div></div>' + 
					  '<a class="btn btn-default">发布问卷</a>' + 
					  '<a class="btn btn-transp" href="#qlist">保存问卷</a>');

		var creator = qcreator.create()
							  .addQ(data && data.items)
							  .getElem();

		$(back).addClass('q-back q-back-white')
			   .append(qhead)
			   .append(creator)
			   .append(qfoot)
			   .appendTo(_$root);
	}

	function hasQitems(data){
		renderQnair(data[0]);
	}

	function noQitems(){
		renderQnair();
	}

	//query
	function query(_id){

		$.ajax('/qitem', {

			dataType: 'json',
			method: 'POST',
			data: {_id: _id},

		}).done(hasQitems).fail(noQitems);
	}

	var _$root = null;
	var _$globalStorage = null;

	function run($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;

		var currq = _$globalStorage.currq;
		if(currq){
			query(currq._id);
		}else{
			noQitems();
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