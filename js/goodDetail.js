$(window).load(function(){
	alert("此页面可操作的内容：1、账户退出；2、点击mini购物车跳转到购物车；3、mini购物车删除；4、加入购物车；5、数量增减；6、点击logo回到主页；7、放大镜以及小图标点击换大图；等等等等")
	// Mini购物车
	new Mini();
	// 放大镜 big；等等等等
	new Big();
	// 添加到购物车
	new FlyCart();
})

$(function(){
	//加载头尾文件
	new Ajax("common/header.html",".header",false,function(p,dom){
		var data = $(p).slice(0,1)
		$(dom).html(data);	
	})
	new Ajax("common/footer.html",".footer",false,function(p,dom){
		var data = $(p).slice(0,3)
		$(dom).children().html(data);
	})

	/*检测是否已登录 和 退出操作*/
	new Login();
	// 购物车的里内容
	new carList();
	// 读取cookie里的信息
	new Target();
	// 改变标题头
	$("#title").text($(".ba_title").text())
})

// 放大镜 big
function Big(){
	this.small = $(".big_nav li");  // 小的nav图
	this.img = $(".big_first img");		// 原本就显示的大图
	this.box = $(".big_first");		//原本图片的边框
	this.bigBox = $(".absolute");	//放大镜的边框
	this.bigImg = $(".absolute img");   //放大镜里的图片
	this.moveImg = $("#move");		//原图上的放大镜块
	this.class = "big_li_first" ; //要添加的class属性
	var _this = this;
	this.small.click(function(){
		_this.change(this);
	})
	this.box.mouseover(function(){
		_this.open();
	})
	this.box.mouseout(function(){
		_this.close();
	})
}
Big.prototype.change = function(dom){
	$(dom).addClass(this.class).siblings().removeClass(this.class);
	this.img.attr("src",$(dom).find("img").attr("src"));
	this.bigImg.attr("src",$(dom).find("img").attr("src"));
}
Big.prototype.open = function(){
	var _this = this;
	this.moveImg.css("display","block")
	this.bigBox.css("display","block")
	$("body,html").mousemove(function(e){
		_this.move(e);
	})
}
Big.prototype.close = function(){
	this.moveImg.css("display","none")
	this.bigBox.css("display","none")
}
Big.prototype.move = function(e){
	this.left = e.pageX - this.box.offset().left - this.moveImg.width()/2;
	this.top = e.pageY - this.box.offset().top - this.moveImg.height()/2;
	if(this.left <= 0){
		this.left = 0
	} else if (this.left >= this.box.width() - this.moveImg.width()){
		this.left = this.box.width() - this.moveImg.width();
	}
	if(this.top <= 0){
		this.top = 0
	} else if (this.top >= this.box.height() - this.moveImg.height()){
		this.top = this.box.height() - this.moveImg.height();
	}
	this.moveImg.css({"left":this.left,"top":this.top})
	this.imgLeft = -this.bigImg.width() * this.left / this.img.width(); 
	this.imgTop = -this.bigImg.height() * this.top / this.img.height(); 
	this.bigImg.css({"left":this.imgLeft,"top":this.imgTop})
}



// 读取cookie里的文件信息 加载到页面
function Target(){
	this.cookie = $.cookie("goodDetail");
	if(this.cookie){
		this.cookie = JSON.parse(this.cookie);
		$(".big_first").find("img").attr("src",this.cookie.img)
		$(".absolute").find("img").attr("src",this.cookie.img)
		$(".big_li_first").find("img").attr("src",this.cookie.img)
		$(".ba_color").find("img").attr("src",this.cookie.img)
		$(".ba_title").find("h3").text(this.cookie.title)
		$(".price").find("em").text(this.cookie.price)
		$(".big_share").find("span").eq(1).text(this.cookie.id)
	}
}

// 点击增减删除商品数量
function Count(){
	var _this = this;
	$(".ba_num").on("click","span",function(){
		_this.add(this);
	})
}
Count.prototype.add = (function(dom){  //修改数量
	if($(dom).index() == 0){
		this.num = $(dom).next().val();
		if(this.num == 1) return;
		this.num-- ;
		$(dom).next().val(this.num);
	} else {
		this.num = $(dom).prev().val();
		this.num++ ;
		$(dom).prev().val(this.num);
	}
})



/*飞入购物车*/
function FlyCart(){
	new Count();
	this.aimX = $(".shopCar").find("span").offset().left; //获取购物车的目标点
	this.aimY = $(".shopCar").find("span").offset().top - $(window).scrollTop();
	var _this = this;
	$(".ba_buy").on("click","a",function(){
		_this.init(this);
		_this.addInfo(this);
	})
}
FlyCart.prototype.init = function(dom){
	var _this = this;
	// this.num = $(".join_cart").index($(dom));  //获取当前要购买商品的坐标和图片
	this.X = $(".big_first").find("img").offset().left;
	this.Y = $(".big_first").find("img").offset().top; //克隆该图片为新元素
	$(".big_first").find("img").clone().css({"position":"fixed","left":this.X,"top":0,"zIndex":"10000"}).prependTo("body").animate({"width":"20px","height":"20px","left":this.aimX,"top":this.aimY},1000,function(){
		$(this).remove();  //加入购物车后删除新添加的图片元素
		$(".shopCar").find("span").css({"color":"#f40"});
		for(var i = 0; i < 4; i++){  //购物车收到货物后抖动的
			if(i == 3){
				$(".shopCar").find("span").animate({"left":"-5px"},50).animate({"left":"5px"},50,function(){
				$(this).css({"left":0,"color":"#666"});
				$(this).next().next().text(parseInt($(this).next().next().text()) + 1)  //购物车收到货物后在原有数字基础上+1
			})
			} else {
			$(".shopCar").find("span").animate({"left":"-5px"},50).animate({"left":"5px"},50)
			}
		}
	})
}
FlyCart.prototype.addInfo = function(dom){
	if($(".user_name").text()){
		this.data = JSON.parse($.cookie("message"));
		if($("detail_id").text() in this.data["id"+$(".user_name").text()]){
			this.data["id"+$(".user_name").text()][$("detail_id").text()].num ++;
		} else {
		this.data["id"+$(".user_name").text()][$(".detail_id").text()] = {
			"img" : $(".big_first").find("img").attr("src"),
			"price" : $(".price").find("em").text(),
			"num" : $(".ba_num").find("input").val(),
			"title" : $(".ba_title").text()
		}
		}
		console.log(this.data);
		$.cookie("message",JSON.stringify(this.data),{expires:7,path:"/"})
	} else {
		this.is = confirm("你还没登录,是否前去登录？")
		if(this.is){
			location.href = "login.html";
		} else {
			location.href = "#";
		}
	}
}
