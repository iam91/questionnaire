;(function(window, document){
	/**
	 * Add event handler
	 */
	function addHandler(elem, type, handler){
		if(elem.attachEvent){
			elem.attachEvent('on' + type, handler);
		}
		else if(elem.addEventListener){
			elem.addEventListener(type, handler, false);
		}
		else{
			elem['on' + type] = handler;
		}
	}
	/**
	 * Remove event handler
	 */
	function removeHandler(element, type, handler){
		if(element.removeEventListener){
			element.removeEventListener(type, handler, false);
		} 
		else if(element.detachEvent){
			element.detachEvent('on' + type, handler);
		} 
		else{
			element['on' + type] = null;
		}
	}

	var ClassName = {
		FIX_CONTENT    : 'z-m-c-fixed',
		MOVING_CONTENT : 'z-m-c-moving',
		SHOW           : 'z-modal-show',
		CONTENT        : 'z-modal-content'
	};
	
	function ZModal(base){
		this._base = base;
		this._content = null;

		this._head = null;
		this._body = null;
		this._foot = null;

		this._innerOffsetX = 0;
		this._innerOffsetY = 0;

		this._randomClickHandler = null;
		this._dragHandler = null;
		this._dragStartHandler = null;
		this._dragStopHandler = null;

		this._confirm = null;
		this._cancel = null;
		
		this._init();
	}

	ZModal.prototype._init = function(){
		this._head = document.createElement('div');
		this._body = document.createElement('div');
		this._foot = document.createElement('div');
		this._content = document.createElement('div');

		this._head.innerHTML = '<label>提示</label><a>&times;</a>';
		this._foot.innerHTML = '<a name="confirm" class="btn btn-enable">确定</a>' + 
							   '<a name="cancel" class="btn btn-enable">取消</a>';

		this._content.classList.add(ClassName.CONTENT);
		this._content.classList.add(ClassName.FIX_CONTENT);

		this._content.appendChild(this._head);
		this._content.appendChild(this._body);
		this._content.appendChild(this._foot);
		this._base.appendChild(this._content);

		addHandler(this._head.querySelector('a'), 'click', this._handlerWrapper(this.hide));
		addHandler(this._foot, 'click', this._handlerWrapper(this._btnClick));
		addHandler(this._base, 'click', this._randomClickHandler = this._handlerWrapper(this._randomClick));
		addHandler(this._content, 'mousedown', this._dragStartHandler = this._handlerWrapper(this._dragStart));
		addHandler(this._base, 'mouseup', this._dragStopHandler = this._handlerWrapper(this._dragStop));
	};

	ZModal.prototype._drag = function(e){
		this._content.style.left = e.pageX - this._innerOffsetX + 'px';
		this._content.style.top = e.pageY - this._innerOffsetY + 'px';
	};

	ZModal.prototype._dragStart = function(e){
		this._content.style.left = this._content.offsetLeft + 'px';
		this._content.style.top = this._content.offsetTop + 'px';
		this._content.style.position = 'absolute';
		this._content.style.margin = '0';
		//.z-m-c-fixed can only be moved after reading offsetLeft and offsetTop
		this._content.classList.remove(ClassName.FIX_CONTENT);
		this._innerOffsetX = e.pageX - this._content.offsetLeft;
		this._innerOffsetY = e.pageY - this._content.offsetTop;
		addHandler(this._content, 'mousemove', this._dragHandler = this._handlerWrapper(this._drag));
	};

	ZModal.prototype._dragStop = function(e){
		removeHandler(this._content, 'mousemove', this._dragHandler);
		this._dragHandler = null;
	}

	ZModal.prototype._btnClick = function(e){
		var name = e.target.name;
		if(name === 'confirm' && this._confirm && this._confirm.fn instanceof Function){
			this._confirm.fn.call(this._confirm.ctx, this._confirm.data);
		}else if(name === 'cancel' && this._cancel && this._cancel.fn instanceof Function){
			this._cancel.fn.call(this._cancel.ctx, this._cancel.data);
		}
		this.hide();
	};

	ZModal.prototype._randomClick = function(e){
		if(e.target === e.currentTarget){
			if(this._content){
				this._content.style.left = '';
				this._content.style.top = '';
				this._content.style.margin = '';
				this._content.style.position = '';
				this._content.classList.add(ClassName.FIX_CONTENT);
			}
			this.hide();
		}
	};

	ZModal.prototype._handlerWrapper = function(handler){
		var _this = this;
		return function(e){
			handler.call(_this, e);
		};
	};

	ZModal.prototype.setConfirm = function(fn, ctx, data){
		this._confirm = fn instanceof Function ? {fn: fn, ctx: ctx, data: data} : null;
	};

	ZModal.prototype.setCancel = function(fn, ctx, data){
		this._cancel = fn instanceof Function ? {fn: fn, ctx: ctx, data: data} : null;
	};

	ZModal.prototype.setContent = function(content){
		this._body.innerHTML = content;
		this._confirm = null;
		this._cancel = null;
	};

	ZModal.prototype.show = function(){
		this._base.classList.add(ClassName.SHOW);
	};

	ZModal.prototype.hide = function(){
		this._base.classList.remove(ClassName.SHOW);
	};

	function zm(q){
		var m = null;
		if(typeof q === 'string'){
			m = document.querySelector(q);
		}
		else if(q instanceof Element){
			m = q;
		}
		else{
			return null;
		}
		return m ? new ZModal(m) : null;
	}

	window.zm = zm;
})(window, document);