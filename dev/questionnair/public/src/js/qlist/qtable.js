define(['jquery'], function($){

	var theadHead = '<td></td>';
	var theadTail = '<td>状态</td><td>操作</td>';

	var thead = '<td></td>' + 
				'{title}' + 
				'<td>状态</td>' + 
				'<td>操作</td>';

	var tbodyHead = '<td><input type="checkbox"></td>';
	var tbodyTail = '<td><a name="qcreate">编辑</a></td><td><a>删除</a></td>';

	var trow = '<td><input type="checkbox"></td>' + 
			   '{val}' + 
			   '<td><a name="qcreate">编辑</a></td>' + 
			   '<td><a>删除</a></td>' + 
			   '<td><a name="{name}">{btn}</a></td>';

	var tfootTemplate = '<td><input type="checkbox"><span>全选</span><a>删除</a></td>';

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
		$(this._thead).html(thead.replace('{title}', thead));


		for(var i = 0; i < data.length; i++){
			this._q.push(data[i]);
			var row = document.createElement('tr');
			
			var t = '';
			for(var j = 0; j < title.length; j++){
				t += '<td>' + data[i][title[j]] + '</td>';
			}

			$(row).html(trow.replace('{val}', t)
							.replace('{name}', data[i]['status'] == 0 ? 'qcreate' : 'qdata')
							.replace('{btn}', data[i]['status'] == 0 ? '查看问卷' : '查看数据'))
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