define(['jquery', 'qbody', 'qnairserv'], function($, qbody, QnairServ){

	var STATUS = {
		'UNRELEASE': 0,
		'RELEASING': 1,
		'RELEASED' : 2
	}

	var qfootTemplate = '<span>问卷截止日期</span><div></div>' + 
						'<a class="btn btn-disable" name="qlist">保存问卷</a>';

	//render functions
	function renderQnair(data){
		_storable = data.status == STATUS.RELEASING;
		var back = document.createElement('div');
		//questionnair head
		var qhead = $(document.createElement('div')).addClass('q-detail-head')
													.html('<span>' + data.title + '</span>');
												   	

		//questionnair foot
		var qfoot = document.createElement('div');
		$(qfoot).addClass('q-detail-foot')
				.html(qfootTemplate)
				.on('click', function(e){
					var target = e.target;
				});

		//questionnair body
		var qbdyIns = qbody.create(data, false);
		var qbdy = qbdyIns.getElem();

		$(back).addClass('q-back q-back-white')
			   .append(qhead)
			   .append(qbdy)
			   .append(qfoot)
			   .appendTo(_$root);
	}

	function existQnair(data){
		renderQnair(data[0]);
	}

	function noQnair(){
		var back = document.createElement('div');
		$(back).addClass('q-back q-back-white').html('<span>Oops!</span>');
	}

	var _$root = null;
	var _$globalStorage = null;
	var _storable = true;

	function run($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;

		var qid = _$globalStorage.qid;
		if(qid){
			QnairServ.query(qid)
					 .done(existQnair)
					 .fail(noQnair);
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