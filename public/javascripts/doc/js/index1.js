var cc1 = function (cla) {
    this.move(cla);
  };
  cc1.prototype.move = function (cla) {
    this.d1 = $(cla);
      var that = this.d1;
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
  };

  var cc2 = function (cla) {
    this.move(cla)
  }
cc2.prototype.move = function (cla) {
     this.d2 = $(cla);
  var that = this.d2;
  that.children('.right').on('click',function () {
    var firstCard = that.children('div').last().children('div').first()
    that.children('.card-holder').append(firstCard);
  });
  that.children('.left').on('click',function () {
    var lastCard = that.children('div').last().children('div').last();
    that.children('.card-holder').prepend(lastCard);
  });
}

var cc3 = function (cla) {
  this.move(cla)
}
cc3.prototype.move = function (cla) {
   this.d3 = $(cla)
  var that = this.d3
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
}

var cc4 = function (cla) {
  this.move(cla)
}
cc4.prototype.move = function (cla) {
  this.d4 = $(cla);
  var that = this.d4;
  that.children('div').click(function() {
    that.prepend($(this));
  })

}

var cc5 = function (cla) {
  this.move(cla);
}
cc5.prototype.move = function (cla) {
  this.d5 = $(cla);
  var that = this.d5;
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
}

var cc6 = function (cla) {
  this.move(cla);
}
cc6.prototype.move = function (cla) {
  this.d6 = $(cla);
  var that = this.d6;
  that.children('div').click(function(e) {
    that.prepend($(this));
  })

}

  function carousel(cc,op) {
    return new cc(op);

  }


