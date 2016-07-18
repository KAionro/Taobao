$(window).load(function(){
	new Slide(".ba_lb_tMain ul",".ba_lb_tArrow .lt");
	new Slide(".ba_lb_bMain ul",".ba_lb_bArrow .lt");
	new IndexFade();
})

/*fadeIn fadeOut*/
/*banner_fade*/
var IndexFade = function(){
	this.ul = $(".ba_mo_box ul");
	var _this = this;
	this.div = $(".ba_seNav");
	this.index = null;
	this.ul.mouseenter(function(){
		_this.showDiv();
	})

	this.ul.parent().mouseleave(function(){
		_this.hideDiv();
	})
	this.ul.prev().mouseover(function(){
		_this.hideDiv();
	})
	this.ul.next().mouseover(function(){
		_this.hideDiv();
	})

	this.ul.on("mouseenter","li",function(){
		_this.index = $(this).index();
		_this.nowDiv(_this.index);
	})
	
}
IndexFade.prototype.showDiv = function(){
	this.div.stop().fadeIn(300)
}
IndexFade.prototype.hideDiv = function(){
	this.div.stop().fadeOut(300)
}
IndexFade.prototype.nowDiv = function(N){
	this.div.children().eq(N).show().siblings().hide();
}