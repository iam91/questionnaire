define(['jquery', 'app/components/qbody', 'app/service/qnairserv'], function($, qbody, QnairServ){

	var STATUS = {
		'UNRELEASE': 0,
		'RELEASING': 1,
		'RELEASED' : 2
	}

	var qfootTemplate = '<span>问卷截止日期</span><div></div>' + 
						'<a class="btn {release-enable}" name="release">发布问卷</a>' + 
						'<a class="btn {save-enable}" name="save">保存问卷</a>';

	//render functions
	function renderQnair(data){
		var id = data && data._id || null;

		var back = document.createElement('div');
		//questionnair head
		var qhead = $(document.createElement('div')).addClass('q-detail-head')
													.html('<input class="q-edit" type="text" placeholder="这里是标题">')
												   	.children()
												   	.val(data && data.title || '')
												   	.parent();

		//questionnair body
		var qbdyIns = qbody.create(data, true);
		var qbdy = qbdyIns.getElem();

		//questionnair foot
		var qfoot = document.createElement('div');
		$(qfoot).addClass('q-detail-foot')
				.html(qfootTemplate.replace('{release-enable}', data && data.status == 0 ? 'btn-enable' : 'btn-disable')
								   .replace('{save-enable}', data ? 'btn-enable' : 'btn-disable'))
				.on('click', {qbdyIns: qbdyIns}, function(e){
					var target = e.target;
					var name = target.name;
					var qbdyIns = e.data.qbdyIns;

					var title = $(qhead).find('input[type="text"]').val().trim();
					var status = data && data.status || STATUS.UNRELEASE;
					var items = qbdyIns.getItems();
					
					var newData = {
						items: items,
						title: title,
						status: status
					};
					if(name === 'release'){
						newData.status = STATUS.RELEASED;
					}
					if(data){
						QnairServ.update(newData, data._id).done().fail();
					}else{
						QnairServ.create(newData).done().fail();
					}

					//location.hash = '#qlist';
				});

		$(back).addClass('q-back q-back-white')
			   .append(qhead)
			   .append(qbdy)
			   .append(qfoot)
			   .appendTo(_$root);
	}

	function existQnair(data){
		renderQnair(data[0]);
	}

	function newQnair(){
		renderQnair();
	}

	var _$root = null;
	var _$globalStorage = null;

	function run($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;

		var qid = _$globalStorage.qid;
		if(qid){
			QnairServ.query(qid)
					 .done(existQnair)
					 .fail(newQnair);

		}else{
			//new questionnair
			newQnair();
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