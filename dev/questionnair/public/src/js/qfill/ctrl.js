define(['jquery', 'app/components/qbody'], function($, qbody){

	var qfootTemplate = '<span>问卷截止日期</span><div></div>' + 
						'<a class="btn {enable}" name="qlist">发布问卷</a>' + 
						'<a class="btn {enable}" name="qlist">保存问卷</a>';

	//render functions
	function renderQnair(data){
		var back = document.createElement('div');
		//questionnair head
		var qhead = $(document.createElement('div')).addClass('q-detail-head')
													.html('<span>' + data.title + '</span>');
												   	

		//questionnair foot
		var qfoot = document.createElement('div');
		$(qfoot).addClass('q-detail-foot')
				.html(qfootTemplate.replace(/\{enable\}/g, data ? 'btn-enable' : 'btn-disable'))
				.on('click', function(e){
					var target = e.target;
				});

		//questionnair body
		var qbdy = qbody.create(data, false)
							  .getElem();

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

	//query
	function query(_id){

		$.ajax('/qnair/' + _id, {

			dataType: 'json',
			method: 'GET'

		}).done(existQnair).fail(noQnair);
	}

	var _$root = null;
	var _$globalStorage = null;

	function run($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;

		var qid = _$globalStorage.qid;
		if(qid){
			query(qid);
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