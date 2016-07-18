/*轮播图*/
//淘宝的banner里的  大轮播图和下面天猫的小轮播图张数不一样，要求不一样 ，需要多传参数
var Slide = function(DOM,Arrow){ //第一个参数轮播图的ul，第二个参数是上一张按钮
	this.ul = $(DOM);
	this.ul.css("width",$(this.ul).width()*2);//把要轮播的ul的长度变成2倍
	this.init = $(this.ul).html() + $(this.ul).html();
	this.ul.html(this.init);  //把要轮播的内容复制一份放到一个ul里
	this.liWidth = this.ul.children("li").width();  //获取图片的大小
	this.size = this.ul.children("li").size() /2;
	this.index = 0; 
	var _this = this;
	this.lt = $(Arrow);
	this.gt = this.lt.next();
	this.point = this.lt.parent().next().children("li"); //下方的按钮
	
	this.point.click(function(){
		_this.pointC(this);
	})
	
	this.ul.parent().parent().mouseover(function(){
		_this.lt.css("display","block");
		_this.gt.css("display","block");
		clearInterval(_this.timer);
	})
	this.ul.parent().parent().mouseout(function(){
		_this.lt.css("display","none")
		_this.gt.css("display","none")
		_this.timer = setInterval(function(){
			_this.next();
		},3000)
	})
	this.gt.click(function(){
		_this.next();
	})
	this.lt.click(function(){
		_this.last();
	})

	this.timer = setInterval(function(){
		_this.next();
	},3000)
}
Slide.prototype.next = function(){
	if(parseInt(this.ul.css("left")) <= -this.liWidth*this.size) this.ul.css("left","0px");
	this.index = ++this.index == this.size? 0 : this.index;
	this.now();
	this.ul.animate({"left":"-="+this.liWidth},200);
}
Slide.prototype.last = function(){
	if(parseInt(this.ul.css("left")) >= 0) this.ul.css("left",-this.liWidth * this.size);
	this.index = --this.index == -1? this.size-1 : this.index;
	this.now();
	this.ul.animate({"left":"+="+this.liWidth},200);
}
Slide.prototype.pointC = function(dom){
	this.index = $(dom).index() ;  //获取点击的索引,存入this变量里；
	this.now();
	this.ul.animate({"left":-this.liWidth*this.index},300);
}
Slide.prototype.now = function(){
	if(this.ul.parent().parent().prev().children().children().is("b")){//给天猫必逛最右边的图片添加当前的数字！！
		this.ul.parent().parent().prev().find("b").text(this.index+1);
	}
	this.point.eq(this.index).children().addClass("ba_lb_on").parent().siblings().children().removeClass("ba_lb_on");
}


/*louti*/
