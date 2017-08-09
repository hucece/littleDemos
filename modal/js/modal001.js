(function($){
	var mask = null;
	var _createMask = function(){
		var node =  document.createElement("div");
		node.className = "swal-mask";
		mask = node;
		$("body").append(mask);
	}
	var _showMask = function(){
		if(!mask) _createMask();
		$(mask).css("visibility","visible");
		return true;
	}
	var _hideMask = function(){
		if($(mask).css("visibility") === "visible"){
			$(mask).css("visibility","hidden");
		}
	}
	var _hideModal = function(){
		$(".modal").css("visibility","hidden");
	}
	var _showModal = function(){
		$(".modal").css("visibility","visible");		
	}
			
	var methods = {
		init: function(options){
			var settings = $.extend({},{keyboard: false,show: false,backdrop:false},options);
			/*按下esc按键，模态框消失*/
			_createMask();
			if(settings.keyboard){
				$(document).keyup(function(e){
					if(e.keyCode == 27){
						_hideMask();
						_hideModal();
					}
				})
			}
			/*点击遮罩层，模态框消失*/
			if(settings.backdrop){
				$(mask).click(function(){
					_hideMask();
					_hideModal();
				})
			}
			/*初始化是显示模态框*/
			if(settings.show){
				_showMask();
				_showModal();
			}
			return this;
		},
		show: function(){
			/*触发绑定show的回调函数*/
			this.trigger("show.bs.modal");
			_showMask();
			_showModal();
		},
		hide: function(){
			/*触发绑定hide的回调函数*/
			this.trigger("hide.bs.modal");
			_hideMask();
			_hideModal();
		}
	}
	$.fn.modal = function(method){
		var type = $.type(method);
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice(arguments,1))
		}else if(type === "object"){
			return methods.init.apply(this,arguments);
		}else{
			$.error("wrong")
		}
	}
})(jQuery);