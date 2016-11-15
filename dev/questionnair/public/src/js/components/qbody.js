define(['jquery'], function($){

	var Qtype = ['单选题','多选题','文本题'];

	var RQtype = {
		'单选题': 0,
		'多选题': 1,
		'文本题': 2
	};

	var STATUS = {
		'UNRELEASE': 0,
		'RELEASING': 1,
		'RELEASED' : 2
	}

	var QTYPE = {
		'SINGL': 0,
		'MULTI': 1,
		'QUEST': 2
	};

	//removable
	var questCtrl = '<input type="checkbox" {checked}><label>此题是否必填</label>';
	var selectCtrl = '<a name="addopt">+</a>';

	var editableTitle = '<input class="q-edit" type="text" value="{title}" placeholder="这里是标题">' + 
						'<span>{ctrl}</span>';

	var editableOpt = '<input class="q-edit" type="text" value="{opt}" placeholder="请输入选项">' + 
					  '<a name="delopt">&times;</a>';

	var uneditableOpt = '<label>{opt}</label>';
	var uneditableTitle = '<label>{title}</label><label class="q-required">{required}</label>';

	var ctrlTemplate = '<a name="up">上移</a>' + 
					   '<a name="down">下移</a>' + 
					   '<a name="clone">复用</a>' + 
					   '<a name="del">删除</a>';

	var adderTemplate = '';
	for(var i = 0; i < Qtype.length; i++){
		adderTemplate += '<li>' + 
						     '<a class="btn btn-adder" name="' + i + '">' + Qtype[i] + '</a>' + 
						 '</li>';
	}
	adderTemplate = '<ul>' + 
						adderTemplate + 
					'</ul>' + 
					'<div>+  添加问题</div>';

	
	////
	var seqTemplate = '<span>{seq}</span>' + 
					  '<span>{type}</span>';

	var contentTemplate = '<div>{}</div>' + 
						  '<div><ul></ul></div>';

	var optTemplate = '<input type="{type}" name="{single}">{}' 

	function Qcreator(qdata, editable){
		this._itemCount = 0;
		this._editable = editable;

		this._base = document.createElement('div');
		$(this._base).addClass('q-detail-body');
		this._adder = null;

		this._addQ(qdata && qdata.items);

		if(this._editable){

			this._adder = document.createElement('div');
			$(this._adder).addClass('q-adder')
						  .html(adderTemplate)
						  .appendTo(this._base);

			$(this._base).on('click', 'a', {that: this}, function(e){
				var that = e.data.that;
				var target = e.target;
				var name = target.name;

				if(name === 'del' 
					  || name === 'up' 
					  || name === 'down' 
					  || name === 'clone'){
					//edit items
					var q = $(target).parent().parent();
					var seq = $(q).data('seq');
					that['_' + name].call(that, q, seq);
				}else if(name === '0'
					  || name === '1'
					  || name === '2'){
					//add items
					that._createQ(parseInt(name));
				}
			});
		}
	}

	Qcreator.prototype._addQ = function(q){
		if(q && q.length){
			for(var i = 0; i < q.length; i++){
				this._createQ(q[i].type, q[i], i);
			}
		}
	};

	Qcreator.prototype._createQ = function(type, data, index){

		var seq = index || this._itemCount;
		
		var q = document.createElement('div');
		$(q).data('seq', seq);

		//sequential number part
		var num = document.createElement('div');
		$(num).addClass('q-item-seq')
			  .html(seqTemplate.replace('{seq}', seq)
							   .replace('{type}', Qtype[type]));
		//content part
		var content = (new QContent(type, this._editable, data)).getElem();
		//controll part
		var ctrl = null;
		if(this._editable){
			ctrl = document.createElement('div');
			$(ctrl).addClass('q-item-ctrl')
				   .html(ctrlTemplate);
		}
		//assemble
		$(q).addClass('q-item')
			.append(num)
			.append(content)
			.append(ctrl)
			if(this._adder){
				$(q).insertBefore(this._adder);
			}else{
				$(q).appendTo(this._base);
			}

		this._itemCount++;
	};

	Qcreator.prototype._del = function(q, seq){
		var curr = q;
		while($(curr).next().length){
			var next = $(curr).next();
			var currSeq = $(next).data('seq');

			$(next).data('seq', currSeq - 1)
				   .find('.q-item-seq>span:first-child')
				   .html(currSeq - 1);
			
			curr = next;
		}
		
		$(q).empty().remove();
		this._itemCount--;
	};

	Qcreator.prototype._up = function(q, seq){
		if(seq > 0){
			var prev = $(q).prev();

			$(q).detach()
				.insertBefore(prev)
				.data('seq', seq - 1)
				.find('.q-item-seq>span:first-child')
				.html(seq - 1);
			
			$(prev).data('seq', seq)
				   .find('.q-item-seq>span:first-child')
				   .html(seq);
		}
	};

	Qcreator.prototype._down = function(q, seq){
		if(seq < this._itemCount - 1){
			var next = $(q).next();

			$(q).detach()
				.insertAfter(next)
				.data('seq', seq + 1)
				.find('.q-item-seq>span:first-child')
				.html(seq + 1);

			$(next).data('seq', seq)
				   .find('.q-item-seq>span:first-child')
				   .html(seq);
		}
	};

	Qcreator.prototype._clone = function(q, seq){
		var newq = $(q).clone(true).insertAfter(q);
		var curr = q;
		while($(curr).next().length){
			var next = $(curr).next();
			var currSeq = $(next).data('seq');

			$(next).data('seq', currSeq + 1)
				   .find('.q-item-seq>span:first-child')
				   .html(currSeq + 1);

			curr = next;
		}
		this._itemCount++;
	};

	Qcreator.prototype.getElem = function(){
		return this._base;
	};

	Qcreator.prototype.itemValidate = function(){
		if(this._editable){
			var curr = $(this._base).children().first();

			while(!$(curr).is(this._adder)){

				var title = $(curr).find('.q-item-body input[type="text"]').val().trim();
				if(title === ''){
					return false;
				}
				var type = RQtype[$(curr).find('.q-item-seq span:last-child').html()];
				var opts = $(curr).find('.q-item-body li input[type="text"]').toArray();
				if(type != QTYPE.QUEST){
					for(var i = 0; i < opts.length; i++){
						var des = $(opts[i]).val().trim();
						if(des === ''){
							return false;
						}
					}
				}

				curr = $(curr).next();
			}
			return true;
		}else{
			return false;
		}
	};

	Qcreator.prototype.getItems = function(){
		var items = [];
		if(this._editable){
			var curr = $(this._base).children().first();

			while(!$(curr).is(this._adder)){

				var type = RQtype[$(curr).find('.q-item-seq span:last-child').html()];
				var title = $(curr).find('.q-item-body input[type="text"]').val().trim();
				var opts = $(curr).find('.q-item-body li input[type="text"]').toArray();

				var content = {};
				if(type != QTYPE.QUEST){
					content.opts = [];
					for(var i = 0; i < opts.length; i++){
						content.opts.push({des: $(opts[i]).val().trim()});
					}
				}else{
					content.required 
						= $(curr).find('.q-item-body input[type="checkbox"]').prop('checked');
				}

				items.push({
					type: type,
					title: title,
					content: content
				});

				curr = $(curr).next();
			}
			return items;
		}
	}

	Qcreator.prototype.getData = function(){

	}




	function QContent(type, editable, data){
		this._editable = editable;
		this._base = document.createElement('div');

		this._contentTemplate = contentTemplate.replace('{}', editable ? editableTitle 
																	   : uneditableTitle.replace('{required}', data && data.content.required ? ' *' : ''));
		this._optTemplate = optTemplate.replace('{}', editable ? editableOpt : uneditableOpt);

		$(this._base).addClass('q-item-body')
					 .html(this._contentTemplate.replace('{title}', data && data.title || '')
								 		  		.replace('{ctrl}', type === QTYPE.QUEST 
								 		  			? questCtrl.replace('{checked}', data && data.content.checked ? 'checked' : '') 
								 		  			: selectCtrl));

		this._contentBody = $(this._base).find('ul');

		if(type === QTYPE.SINGL){
			if(data){
				for(var i = 0; i < data.content.opts.length; i++){
					this._createOpt(type, data.content.opts[i].des);
				}
			}else{
				for(var i = 0; i < 2; i++){
					this._createOpt(type, '');
				}
			}
		}else if(type === QTYPE.MULTI){
			if(data){
				for(var i = 0; i < data.content.opts.length; i++){
					this._createOpt(type, data.content.opts[i].des);
				}
			}else{
				for(var i = 0; i < 2; i++){
					this._createOpt(type, '');
				}
			}
		}else if(type === QTYPE.QUEST){

			var text = document.createElement('textarea');
			$(text).appendTo(this._contentBody);
		}

		if(this._editable){
			$(this._base).on('click', {that: this}, function(e){

				var that = e.data.that;
				var name = e.target.name;

				if(name === 'addopt'){
					that._createOpt(type, '');
				}else if(name === 'delopt'){
					$(e.target).parent()
							   .empty()
							   .remove();
				}
			});
		}
	}

	QContent.prototype._createOpt = function(type, opt){
		var optElem = document.createElement('li');
		$(optElem).html(this._optTemplate.replace('{type}', type === 0 ? 'radio' : 'checkbox')
								   		 .replace('{single}', type === 0 ? 'single' : '')
										 .replace('{opt}', opt))
			  	  .appendTo(this._contentBody);
	};

	QContent.prototype.getElem = function(){
		return this._base;
	};

	return {
		create: function(data, editable){
			return new Qcreator(data, editable);
		}
	};
});