define(['jquery'], function($){

	var thead = '<tr><td></td>' + 
				'{title}' + 
				'<td>状态</td>' + 
				'<td>操作</td></tr>';

	var trow = '<td><input type="checkbox"></td>' + 
			   '{val}' + 
			   '<td><a class="btn btn-transp" name="qcreate">编辑</a></td>' + 
			   '<td><a class="btn btn-transp">删除</a></td>' + 
			   '<td><a class="btn btn-transp" name="{name}">{btn}</a></td>';

	var tfootTemplate = '<td>' + 
							'<input type="checkbox">' + 
						'</td>' + 
						'<td>' + 
							'<span>全选</span>' + 
						'</td>' + 
						'<td class="q-table-delete">' + 
							'<a class="btn btn-transp">删除</a>' + 
						'</td>';

	var status = {
		'0': '未发布',
		'1': '发布中',
		'2': '已发布'
	}

	function Qtable($globalStorage){

		this.$globalStorage = $globalStorage;

		this._table = document.createElement('table');
		this._thead = document.createElement('thead');
		this._tbody = document.createElement('tbody');
		this._tfoot = document.createElement('tfoot');

		this._q = [];
	}

	Qtable.prototype._opHandler = function(e){
		
		this.$globalStorage['currq'] = this._q[e.data.index];
		location.hash = '#' + e.target.name;
	};

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

			t += (statusCode == 1 ? '<td class="q-pending">' : '<td>') + status[statusCode] + '</td>';

			$(row).html(trow.replace('{val}', t)
							.replace('{name}', statusCode == 0 ? 'qcreate' : 'qdata')
							.replace('{btn}', statusCode == 0 ? '查看问卷' : '查看数据'))
				  .on('click', 'a', {index: i, that: this}, (function(fn){

				  	  return function(e){
				  	  	  var that = e.data.that;
				  	  	  fn.call(that, e);
				  	  };
				  	  
				  })(this._opHandler))
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