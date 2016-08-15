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



/*文档的加载ajax*/
function Ajax(src,dom,boolean,fn){
	$.ajax({
		type:"get",
		url:src,
		async:boolean,
		success : function(data){
			if(fn){
				fn(data,dom);
			} else {
				$(dom).html(data);
			}
		}
	})
}




/*检测是否已登录*/
function Login(){
	this.message = $.cookie("message");
	if(this.message){
		this.obj = JSON.parse(this.message);
		if(this.obj.user){
			$(".head_left").css("display","none").next().show().find(".user_box").children().eq(0).text(this.obj.user)
			$(".ba_lo_lo").find("span").first().text("Hi!" + this.obj.user + "你好").parent().next().hide().next().show();
			$(".ba_login").css("background","url(../img/index/banner_login_background_fff.jpg)");
		} else {
			$(".head_left").css("display","block");
			$(".before_lo").css("display","block");
		}
	} else {
		$(".head_left").css("display","block");
		$(".before_lo").css("display","block");
	}
	var _this = this;
	this.out = $(".site-operate a").last().click(function(){
		_this.loginout();
	})
}
Login.prototype.loginout = function(){
	this.obj.user = 0;
	// $.cookie("message",JSON.stringify(this.obj),{expires:7,path:"/"});
	var str = JSON.stringify(this.obj);
	$.cookie("message",str,{expires:7,path:"/"});
	$(".head_left").show().next().hide();
	$(".ba_lo_lo").find("span").first().text("Hi! 你好").parent().next().show().next().hide();
	$(".ba_login").css("background","url(../img/index/banner_login_background.jpg)");
	location.href = "login.html";
}

// cookie_id  cookie_img cookie_title  cookie_price cookie_num
// 每个页面的购物车检测
function carList(dom){
	this.cont = $(dom).html();
	$(dom).html("");
	if($(".user_name").text()){
		this.num = 0;
		this.cookie = $.cookie("message");
		if(this.cookie){
			this.cookie = JSON.parse(this.cookie);
			for(var key in this.cookie["id"+$(".user_name").text()]){
				if(key != "password"){
					this.num++;
					$(dom).append(this.cont);
					$(dom).find(".cookie_img").last().attr("src",this.cookie["id"+$(".user_name").text()][key].img);
					$(dom).find(".cookie_title").last().text(this.cookie["id"+$(".user_name").text()][key].title);
					$(dom).find(".cookie_id").last().text(key);
					$(dom).find(".cookie_price").last().text(this.cookie["id"+$(".user_name").text()][key].price);
					$(dom).find(".cookie_num").last().val(this.cookie["id"+$(".user_name").text()][key].num)
					$(dom).find(".cookie_count").last().text(parseFloat(this.cookie["id"+$(".user_name").text()][key].price) * this.cookie["id"+$(".user_name").text()][key].num)
				}
			}
			$(".cookie_sum").text(this.num);
		}
	}
}


// mini cart
function Mini(){
	var _this = this;
	this.cont = $(".mini_cart_main").html();
	$(".cart_li").mouseenter(function(){
		_this.show();
	}).mouseleave(function(){
		_this.hide();
	})
}
Mini.prototype.show = function(){
	$(".mini_cart_main").html(this.cont);
	$(".mini_cart").css("display","block")
	this.res = new decide();
	if(this.res){
		new carList(".mini_cart_main")
	//删除mini商品
		new Del();
	}
}
Mini.prototype.hide = function(){
	$(".mini_cart").css("display","none")
}



// 判断购物车里是否有商品
function decide(){
	this.num = 0;
	if($(".user_name").text()){
		this.cookie = JSON.parse($.cookie("message"))["id" + $(".user_name").text()];
		for(var key in this.cookie){
			this.num++;
		}
		if(this.num == 1){
			$(".mini_cart_top").css("display","none")
			$(".mini_cart_main").css("display","none")
			$(".mini_cart_foot span").css("display","inline-block")
			return false;
		} else {
			$(".mini_cart_top").css("display","block")
			$(".mini_cart_main").css("display","block")
			$(".mini_cart_foot span").css("display","none")
			return true;
		}
	}
}


// 点击删除该商品
function Del(){
	var _this = this;
	$(".mini_cart_del").on("click","a",function(){
		_this.remove(this);
	})
}
Del.prototype.remove = function(dom){   //删除该商品
	this.id = $(dom).closest(".mini_list").find(".cookie_id").text();
	$(dom).closest(".mini_list").remove();
	this.cookie = JSON.parse($.cookie("message"))
	delete this.cookie["id"+$(".user_name").text()][this.id]
	$.cookie("message",JSON.stringify(this.cookie),{expires:7,path:"/"})
	new decide();
}