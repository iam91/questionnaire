//TODO: HANDLE QUERY RESULT
define(['jquery', 'qbody', 'qnairserv', 'zdate', 'dateutil'], 
	function($, qbody, QnairServ, zdate, dateutil){

	var STATUS = {
		'UNRELEASE': 0,
		'RELEASING': 1,
		'RELEASED' : 2
	}

	var qfootTemplate = '<span>问卷截止日期</span><div class="z-date"></div>' +
						'<a class="btn {release-enable}" name="release">发布问卷</a>' + 
						'<a class="btn btn-enable" name="save">保存问卷</a>' + 
						'<a class="btn btn-enable" href="#qlist">< 返回</a>';

	function backToList(){
		location.hash = '#qlist';
	}

	function pushQnair(d){
		var newData = {
			title: d.title,
			items: d.qbdyIns.getItems(),
			status: d.data && d.data.status || STATUS.UNRELEASE
		};
		newData.endTime = _endTime.getDates().sel;
		if(d.name === 'release'){
			newData.status = STATUS.RELEASING;
		}
		if(d.data){
			QnairServ.update(newData, d.data._id).done(function(data){
				location.hash = '#qlist';
			}).fail(function(){
				_modal.setContent('服务器内部错误，可能没有保存哦！');
				_modal.show();
			});
		}else{
			newData.createTime = new Date();
			QnairServ.create(newData).done(function(data){
				location.hash = '#qlist';
			}).fail(function(){
				_modal.setContent('服务器内部错误，可能没有发布哦！');
				_modal.show();
			});
		}
	}

	//render functions
	function renderQnair(data){
		var id = data && data._id || null;

		var back = document.createElement('div');
		//questionnair head
		var qhead = $(document.createElement('div'))
						.addClass('q-detail-head')
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
				.html(qfootTemplate.replace('{release-enable}', !data || data.status == STATUS.UNRELEASE ? 'btn-enable' : 'btn-disable')
								   .replace('{save-enable}', data ? 'btn-enable' : 'btn-disable'))
				.on('click', 'a', {qbdyIns: qbdyIns}, function(e){
					var target = e.target;
					var name = target.name;

					var qbdyIns = e.data.qbdyIns;

					var title = $(qhead).find('input[type="text"]').val().trim();

					var curr = new Date();
					var sel = _endTime.getDates().sel;

					//validation
					if(title === '' || !qbdyIns.itemValidate()){
						//validation fails
						_modal.setContent('问卷不完整！');
						_modal.show();
					}else if(name === 'release' && dateutil.dateLessEqual(sel, curr)){
						_modal.setContent('时间不可倒流！');
						_modal.show();
					}else if(name === 'release' && data && data.status != STATUS.UNRELEASE){
						_modal.setContent('不可重复发布！');
						_modal.show();
					}
					else if(name){
						_modal.setContent(name === 'release' 
							? ('确认发布？\n（截止时间：' + dateutil.dateFormat(sel) + '）') : '确认保存？');
						_modal.setConfirm(pushQnair, null, {
							title: title,
							qbdyIns: qbdyIns,
							name: name,
							data: data
						});
						_modal.show();
					}
				});

		$(back).addClass('q-back q-back-white')
			   .append(qhead)
			   .append(qbdy)
			   .append(qfoot)
			   .appendTo(_$root);

		_endTime = zdate('.z-date');
		_endTime.enableRange(false);
	}

	function existQnair(data){
		renderQnair(data[0]);
	}

	function newQnair(){
		renderQnair();
	}

	var _$root = null;
	var _$globalStorage = null;
	var _modal = null;
	var _endTime = null;

	function render($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;
		_modal = _$globalStorage.modal;

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

	return {
		render: render
	};
});