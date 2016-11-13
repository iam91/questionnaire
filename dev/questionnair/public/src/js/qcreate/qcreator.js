define(['jquery'], function($){

	var Qtype = ['单选题','多选题','文本题'];

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

	var seqTemplate = '<span>{seq}</span>' + 
					  '<span>{type}</span>';

	var contentTemplate = '<div>' + 
						      '<input class="q-edit" type="text" value="{title}" placeholder="这里是标题">' + 
						      '<span>{ctrl}</span>' + 
						  '</div>' + 
						  '<div><ul></ul></div>';

	var questCtrl = '<input type="checkbox"><label>此题是否必填</label>';
	var selectCtrl = '<a name="addopt">+</a>';

	var optTemplate = '<input type="{type}" name="{single}">' + 
					  '<input class="q-edit" type="text" value="{opt}" placeholder="请输入选项">' + 
					  '<a name="delopt">&times;</a>';

	function Qcreator(){

		this._base = document.createElement('div');
		this._adder = document.createElement('div');

		$(this._adder).addClass('q-adder')
					  .html(adderTemplate)
					  .appendTo(this._base);

		$(this._base).addClass('q-create-body')
					 .on('click', 'a', {that: this}, function(e){

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

			}else if(name === '0'
				  || name === '1'
				  || name === '2'){

				that._createQ(parseInt(name));
			}

		});
	}

	Qcreator.prototype.addQ = function(q){
		if(!q){
			return this;
		}

		if(!q instanceof Array){
			return this.addQ([q]);
		}else{
			for(var i = 0; i < q.length; i++){
				this._createQ(q[i].type, q[i], i);
			}
		}

		return this;
	};

	Qcreator.prototype._del = function(q, seq){
		//@todo handle q

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
	};

	Qcreator.prototype._up = function(q, seq){
		//@todo handle q
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
		//@todo handle q
		if(seq < this._base.children.length - 1){
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
		//@todo handle q
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
	};

	Qcreator.prototype._createQ = function(type, data, index){

		var seq = index !== undefined ? index : this._base.children.length;
		
		var q = document.createElement('div');
		$(q).data('seq', seq);

		//sequential number part
		var num = document.createElement('div');
		$(num).addClass('q-item-seq')
			  .html(seqTemplate.replace('{seq}', seq)
							   .replace('{type}', Qtype[type]));

		//content part
		var content = (new QContent(type, data)).getElem();

		//controll part
		var ctrl = document.createElement('div');
		$(ctrl).addClass('q-item-ctrl')
			   .html(ctrlTemplate);

		//assemble
		$(q).addClass('q-item')
			.append(num)
			.append(content)
			.append(ctrl)
			.insertBefore(this._adder);
	};

	Qcreator.prototype.getElem = function(){
		return this._base;
	};


	function QContent(type, data){

		this._base = document.createElement('div');

		$(this._base).addClass('q-item-body')
					 .html(contentTemplate.replace('{title}', data && data.title || '')
								 		  .replace('{ctrl}', type === 'quest' ? questCtrl :  selectCtrl));

		this._contentBody = $(this._base).find('ul');

		$(this._base).on('click', {that: this}, function(e){

			var that = e.data.that;
			var name = e.target.name;

			if(name === 'addopt'){

				this._createOpt(type, '');

			}else if(name === 'delopt'){
				
				$(e.target).parent()
						   .empty()
						   .remove();
					   
			}
		});

		if(type === 0 && data){

			for(var i = 0; i < data.content.opts.length; i++){
				this._createOpt(type, data.content.opts[i].des);
			}

		}else if(type === 1 && data){

			for(var i = 0; i < data.content.opts.length; i++){
				this._createOpt(type, data.content.opts[i].des);
			}

		}else if(type === 2){
			//if(data){}
			$(this._contentBody).html('<textarea></textarea>');
		}
	}

	QContent.prototype._createOpt = function(type, opt){
		var optElem = document.createElement('li');
		$(optElem).html(optTemplate.replace('{opt}', opt)
							   .replace('{type}', type === 0 ? 'radio' : 'checkbox')
							   .replace('{single}', type === 0 ? 'single' : ''))
			  .appendTo(this._contentBody);
	};

	QContent.prototype.getElem = function(){
		return this._base;
	};

	return {
		create: function(){
			return new Qcreator();
		}
	};

});