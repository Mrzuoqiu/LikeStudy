/**
 * Created by Administrator on 2016/11/5.
 */
(function ($,window,document) {
    var CC = {
        author: 'Liuyuyang',
        init:function () {
            console.log('初始化方法')
        },
        cc1:function () {
            var that = this;
            that.on('click',function () {
                var disappear = {
                        top:'40px',
                        opacity:'0'
                    },
                    appear = {
                        top:'0',
                        opacity:'1'
                    }
                var firstCard = that.children('div').first();
                firstCard.css(disappear);
                var x = setTimeout(function() {
                    firstCard.css(appear);
                    that.append(firstCard);
                },200);
            })

        },

        cc2:function () {
            var that = this;
            that.children('.right').on('click',function () {
                var firstCard = that.children('div').last().children('div').first()
                that.children('.card-holder').append(firstCard);
            });
            that.children('.left').on('click',function () {
                var lastCard = that.children('div').last().children('div').last();
                that.children('.card-holder').prepend(lastCard);
            });
        },

        cc3:function () {
            var that = this
            var cssLeft = {
                    left: '20px',
                    opacity: 0
                },
                cssRight = {
                    left: '-20px',
                    opacity: 0
                },
                cssReset = {
                    right: 0,
                    left: 0,
                    opacity: 1
                };
            that.children('.right').click(function() {
                var firstCard = that.children('div').first();
                firstCard.css(cssLeft);
                setTimeout(function() {
                    that.append(firstCard);
                    firstCard.css(cssReset);
                }, 300)
            });
            that.children('.left').click(function() {
                var lastCard = that.children('div').last();
                lastCard.css(cssRight);
                lastCard.insertAfter($(this));
                setTimeout(function() {
                    lastCard.css(cssReset);
                }, 150)
            });

        },

        cc4:function () {
            var that = this;
            that.children('div').click(function() {
                that.prepend($(this));
            })
        },

        cc5:function () {
            var that = this;
            that.click(function() {
                var firstCard = that.children('div').first(),
                    cssRoll = {
                        transform: 'rotate(-45deg)',
                        opacity: 0
                    };
                firstCard.css(cssRoll);
                setTimeout(function() {
                    that.append(firstCard);
                    firstCard.attr('style', '');
                }, 300);
            });
        },

        cc6:function () {
            var that = this;
            that.children('div').click(function(e) {
                that.prepend($(this));
            })
        }
    }


    $.fn.lyy = function(option) {
        return this.each(function() {
            var $this = $(this);
            if(typeof option == 'string' && CC[option]) {
                return CC[option].call($this);
            } else if(!option) {
                return CC.init($this)
            } else if(!CC[option] || typeof option == 'object') {
                $.error('参数传递错误');
                return this;
            }
        })
    }

})($,window,document)
