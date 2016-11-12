define(['jquery'], function($){

	var Qtype = {
		'singl': '单选题',
		'multi': '多选题',
		'quest': '文本题'
	};

	var ctrlTemplate = '<a name="up">上移</a><a name="down">下移</a><a name="clone">复用</a><a name="del">删除</a>';

	var adderTemplate = '<ul>';
	for(var type in Qtype){
		adderTemplate += '<li><a class="btn btn-adder" name="' + type + '">' + Qtype[type] + '</a></li>';
	}
	adderTemplate += '</ul><div>添加问题</div>';

	var seqTemplate = '<span>{seq}</span><span>{type}</span>';

	var contentTemplate = '<div><input class="q-edit" type="text" value="{title}" placeholder="这里是标题"><span>{ctrl}</span></div>' + 
						  '<div><ul></ul></div>';

	var questCtrl = '<input type="checkbox"><label>此题是否必填</label>';
	var selectCtrl = '<a name="addopt">+</a>';

	var optTemplate = '<input type="{type}" name="{single}"><input class="q-edit" type="text" value="{opt}" placeholder="请输入选项"><a name="delopt">&times;</a>';

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
				   .find('.q-item-seq>span:first-child')
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
				.find('.q-item-seq>span:first-child')
				.html(seq - 1);
			
			$(prev).data('seq', seq)
				   .find('.q-item-seq>span:first-child')
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

	Qcreator.prototype._createQ = function(type, data){

		var seq = this._q.length + 1;
		
		var q = document.createElement('div');
		$(q).data('seq', seq);

		var num = document.createElement('div');
		$(num).addClass('q-item-seq')
			  .html(seqTemplate.replace('{seq}', seq)
							   .replace('{type}', Qtype[type]));

		var content = (new QContent(type, data)).getElem();

		var ctrl = document.createElement('div');
		$(ctrl).addClass('q-item-ctrl')
			   .html(ctrlTemplate);

		if(data){

		}else{

		}

		$(q).addClass('q-item')
			.append(num)
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

		$(this._base).addClass('q-item-body')
					 .html(contentTemplate.replace('{title}', data && data.title || '')
								 		  .replace('{ctrl}', type === 'quest' ? questCtrl :  selectCtrl));

		this._contentBody = $(this._base).find('ul');

		$(this._base).on('click', {that: this}, function(e){

			var that = e.data.that;
			var name = e.target.name;

			if(name === 'addopt'){

				var opt = document.createElement('li');
				$(opt).html(optTemplate.replace('{opt}', data || '')
									   .replace('{type}', type === 'singl' ? 'radio' : 'checkbox')
									   .replace('{single}', type === 'singl' ? 'single' : ''))
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