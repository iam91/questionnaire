define(['jquery'], function($){

	var thead = '<tr><td></td>' + 
				'{title}' + 
				'<td>状态</td>' + 
				'<td>操作</td></tr>';

	var trow = '<td><input type="checkbox"></td>' + 
			   '{val}' + 
			   '<td><a class="btn {enable}" name="qcreate">编辑</a></td>' + 
			   '<td><a class="btn btn-enable">删除</a></td>' + 
			   '<td><a class="btn btn-enable" name="{name}">{btn}</a></td>';

	var tfootTemplate = '<td>' + 
							'<input type="checkbox">' + 
						'</td>' + 
						'<td>' + 
							'<span>全选</span>' + 
						'</td>' + 
						'<td class="q-table-delete">' + 
							'<a class="btn btn-disable">删除</a>' + 
						'</td>';

	var status = {
		'0': '未发布',
		'1': '发布中',
		'2': '已发布'
	}

	var STATUS = {
		'UNRELEASE': 0,
		'RELEASING': 1,
		'RELEASED' : 2
	}

	function Qtable($globalStorage){

		this.$globalStorage = $globalStorage;

		this._table = document.createElement('table');
		this._thead = document.createElement('thead');
		this._tbody = document.createElement('tbody');
		this._tfoot = document.createElement('tfoot');

		$(this._table).on('click', 'a', {that: this}, (function(fn){
							return function(e){
						  		var that = e.data.that;
						  	  	fn.call(that, e);
						  	};
					  })(this._opHandler))
					  .on('change', 'input[type="checkbox"]', {that: this}, (function(fn){
							return function(e){
						  	  	var that = e.data.that;
						  	  	fn.call(that, e);
						  	};
					  })(this._changeHandler));

		this._q = [];
	}

	Qtable.prototype._opHandler = function(e){
		var target = e.target;
		if($(target).hasClass('btn-enable')){

			var index = $(target).parents('tr').data('index');

			this.$globalStorage.qid = this._q[index]._id;
			location.hash = '#' + e.target.name;
		}
	};

	Qtable.prototype._changeHandler = function(e){
		var target = e.target;
		if($(target).parents('tfoot').length){
			var checked = $(target).prop('checked');
			$(this._tbody).find('tr input[type="checkbox"]').prop('checked', checked);
		}

		if($(this._tbody).find('input[type="checkbox"]:checked').length){
			$(this._tfoot).find('a.btn')
						  .removeClass('btn-disable')
						  .addClass('btn-enable');
		}else{
			$(this._tfoot).find('a.btn')
						  .removeClass('btn-enable')
						  .addClass('btn-disable');
		}
	}

	Qtable.prototype.getElem = function(){
		return this._table;
	};

	Qtable.prototype.setData = function(data, title, titleMap){

		$(this._table).empty();
		while(this._q.length){
			this._q.pop();
		}

		var head = '';
		for(var i = 0; i < title.length; i++){
			head += '<td>' + titleMap[title[i]] + '</td>';
		}
		$(this._thead).html(thead.replace('{title}', head));


		for(var i = 0; i < data.length; i++){
			this._q.push(data[i]);
			var row = document.createElement('tr');
			
			var t = '';
			for(var j = 0; j < title.length; j++){
				t += '<td>' + data[i][title[j]] + '</td>';
			}

			var statusCode = data[i].status;

			t += (statusCode == STATUS.RELEASED ? '<td class="q-pending">' : '<td>') + status[statusCode] + '</td>';

			$(row).html(trow.replace('{enable}', statusCode == STATUS.UNRELEASE ? 'btn-enable' : 'btn-disable')
							.replace('{val}', t)
							.replace('{name}', statusCode == STATUS.RELEASED ? 'qdata' : 'qfill')
							.replace('{btn}', statusCode == STATUS.RELEASED ? '查看数据' : '查看问卷'))
				  .data('index', i)
				  .appendTo(this._tbody);
		}

		$(this._tfoot).html(tfootTemplate);

		$(this._table).append(this._thead)
					  .append(this._tbody)
					  .append(this._tfoot);

		return this;
	};

	return {
		create: function($globalStorage){
			return new Qtable($globalStorage);
		}
	};
});