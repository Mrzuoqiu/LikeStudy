(function ($,window,document) {

	var BXL = {
		author:'baixl',
		 init:function(){
            console.log('我是初始化的方法')
        },
		hanshu:function () {
			var y=-60;
			var x=45;
			var that = this;
			that.mousedown(function (ev1) {
				var disX = ev1.pageX - y;
				var disY = ev1.pageY - x;
				$(document).mousemove(function (ev) {
					var x = ev.pageX - disY;
					var y = ev.pageY + disX;
					that.css('transform','perspective(800px) rotateY('+x+'deg) rotateX('+y+'deg)');

				})
				$(document).mouseup(function () {
					$(document).off('mousemove');
					$(document).off('mouseup');
				})
				return false;

			});

		}
	}
	$.fn.bxlTab = function (option){
        return this.each(function(){
            var $this = $(this);
            //接下来我要判断option是否是正常的字符串和对象的方法
            if(typeof option == 'string' && BXL[option]){
                return BXL[option].call($this);
            }else if(!option){
                return BXL.init($this);
            }else if(!BXL[option] || typeof option == 'object'){
                $.error('参数传递错误');
                return this;
            }
        })
    }
})($,window,document)
