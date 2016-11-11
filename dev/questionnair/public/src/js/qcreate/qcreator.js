define(['jquery'], function($){

	var Qtype = {
		'singl': '单选题',
		'multi': '多选题',
		'quest': '文本题'
	};

	var ctrlTemplate = '<a name="up">上移</a><a name="down">下移</a><a name="clone">复用</a><a name="del">删除</a>';

	var adderTemplate = '<ul>';
	for(var type in Qtype){
		adderTemplate += '<li><a name="' + type + '">' + Qtype[type] + '</a></li>';
	}
	adderTemplate += '</ul>';

	var contentTemplate = '<div>{type}</div>' + 
						  '<div><input type="text" value="{title}"><span>{ctrl}</span></div>' + 
						  '<ul></ul>';

	var questCtrl = '<input type="checkbox"><label>此题是否必填</label>';
	var selectCtrl = '<a name="addopt">add</a><a name="sortopt">sort</a>';

	var optTemplate = '<input type="checkbox"><input type="text" value={}><a name="delopt">delete</a>';

	function Qcreator(){

		this._base = document.createElement('section');
		this._adder = document.createElement('div');

		$(this._adder).html(adderTemplate).appendTo(this._base);
		$(this._base).on('click', 'a', {that: this}, function(e){

			var that = e.data.that;
			var target = e.target;
			var name = target.name;

			if(name === 'add'){

			}else if(name === 'del' 
				  || name === 'up' 
				  || name === 'down' 
				  || name === 'clone'){

				var q = $(target).parent()
								 .parent();

				var seq = $(q).data('seq');

				that['_' + name].call(that, q, seq);

			}else if(name === 'singl'
				  || name === 'multi'
				  || name === 'quest'){

				that._createQ(name);

			}

		});

		this._q = [];
	}

	Qcreator.prototype.addQ = function(q){

		if(!q instanceof Array){
			this.addQ([q]);
			return;
		}else{
			for(var i = 0; i < q.length; i++){
				//questions
			}
		}
	};

	Qcreator.prototype._del = function(q, seq){
		//@todo handle q
		this._q.splice(seq - 1, 1);

		var curr = q;
		while($(curr).next().length){
			var next = $(curr).next();
			var currSeq = $(next).data('seq');

			$(next).data('seq', currSeq - 1)
				   .children('.q-seq')
				   .html(currSeq - 1);
			
			curr = next;
		}
		
		$(q).empty().remove();
	};

	Qcreator.prototype._up = function(q, seq){
		//@todo handle q
		if(seq > 1){
			var prev = $(q).prev();

			$(q).detach()
				.insertBefore(prev)
				.data('seq', seq - 1)
				.children('.q-seq')
				.html(seq - 1);
			
			$(prev).data('seq', seq)
				   .children('.q-seq')
				   .html(seq);
		}
	};

	Qcreator.prototype._down = function(q, seq){
		//@todo handle q
		if(seq < this._q.length){
			var next = $(q).next();

			$(q).detach()
				.insertAfter(next)
				.data('seq', seq + 1)
				.children('.q-seq')
				.html(seq + 1);

			$(next).data('seq', seq)
				   .children('.q-seq')
				   .html(seq);
		}
	};

	Qcreator.prototype._clone = function(q, seq){
		//@todo handle q
		var newq = $(q).clone(true).insertAfter(q);
		var curr = q;
		while($(curr).next().length){
			var next = $(curr).next();
			var currSeq = $(next).data('seq');

			$(next).data('seq', currSeq + 1)
				   .children('.q-seq')
				   .html(currSeq + 1);

			curr = next;
		}
	};

	Qcreator.prototype._createQ = function(type, data){

		var seq = this._q.length + 1;
		
		var q = document.createElement('div');
		$(q).data('seq', seq);

		var num = document.createElement('div');
		$(num).html(seq).addClass('q-seq');

		var content = (new QContent(type, data)).getElem();

		var ctrl = document.createElement('div');
		$(ctrl).html(ctrlTemplate);

		if(data){

		}else{

		}

		$(q).append(num)
			.append(content)
			.append(ctrl)
			.insertBefore(this._adder);

		this._q.push(q);
	};

	Qcreator.prototype.getElem = function(){
		return this._base;
	};


	function QContent(type, data){

		this._base = document.createElement('div');

		$(this._base)
			.html(contentTemplate.replace('{type}', Qtype[type])
								 .replace('{title}', data && data.title || '这里是标题')
								 .replace('{ctrl}', type === 'quest' ? questCtrl :  selectCtrl));

		this._contentBody = $(this._base).children('ul');

		$(this._base).on('click', {that: this}, function(e){

			var that = e.data.that;
			var name = e.target.name;

			if(name === 'addopt'){

				var opt = document.createElement('div');
				$(opt).html(optTemplate.replace('{}', '请输入选项'))
					  .appendTo(that._contentBody);

			}else if(name === 'delopt'){
				
				$(e.target).parent()
					   .empty()
					   .remove();
					   
			}
		});

		if(type === 'single'){
			$(this._contentBody).html();
		}else if(type === 'multi'){

		}else if(type === 'quest'){
			$(this._contentBody).html('<textarea></textarea>');
		}
	}

	QContent.prototype.getElem = function(){
		return this._base;
	};

	return {
		create: function(){
			return new Qcreator();
		}
	};

});