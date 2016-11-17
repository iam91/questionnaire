define(['jquery', 'qbody', 'qnairserv', 'qdataserv', 'dateutil'], 
	function($, qbody, QnairServ, QdataServ, dateutil){

	var STATUS = {
		'UNRELEASE': 0,
		'RELEASING': 1,
		'RELEASED' : 2
	}

	var qfootTemplate = '<span>问卷截止日期</span><div>{endTime}</div>' +  
						'<a class="btn {enable}" name="qlist">保存问卷</a>' +
						'<a class="btn btn-enable" href="#qlist">< 返回</a>';

	function saveData(d){
		var data = d.data;
		var qbdyIns = d.qbdyIns;

		var newData = {
			qid: data._id,
			items: qbdyIns.getData()
		}
		
		QdataServ.create(newData).done(function(data){
			if(data){
				location.hash = '#qlist';
			}
		}).fail(function(){
			_modal.setContent('服务器内部错误，可能没有保存哦！');
			_modal.show();
		});
	}

	//render functions
	function renderQnair(data){
		//can be filled while releasing
		_canfill = data.status == STATUS.RELEASING;
		var endTime = new Date(data.endTime);

		var back = document.createElement('div');
		//questionnair head
		var qhead = $(document.createElement('div')).addClass('q-detail-head')
													.html('<span>' + data.title + '</span>');

		//questionnair body
		var qbdyIns = qbody.create(data, false);
		var qbdy = qbdyIns.getElem();

		//questionnair foot
		var qfoot = document.createElement('div');
		$(qfoot).addClass('q-detail-foot')
				.html(qfootTemplate.replace('{enable}', _canfill ? 'btn-enable' : 'btn-disable')
								   .replace('{endTime}', dateutil.dateFormat(endTime)))
				.on('click', function(e){
					var target = e.target;
					if(_canfill && target.name){
						//getdata
						var r = qbdyIns.dataValidate();
						if(r){
							_modal.setContent(r);
							_modal.show();
						}else{
							_modal.setContent('确认保存？');
							_modal.setConfirm(saveData, null, {data: data, qbdyIns: qbdyIns});
							_modal.show();
						}
					}
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

	function noQnair(){
		var back = document.createElement('div');
		$(back).addClass('q-back q-back-white').html('<span>Oops!</span>');
	}

	var _$root = null;
	var _$globalStorage = null;
	var _modal = null;
	var _canfill = true;

	function render($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;
		_modal = _$globalStorage.modal;

		var qid = _$globalStorage.qid;
		if(qid){
			QnairServ.query(qid)
					 .done(existQnair)
					 .fail(noQnair);
		}else{
			noQnair();
		}
	}

	return {
		render: render
	};
});