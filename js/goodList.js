$(window).load(function(){
	alert("此页面可操作的内容：1、账户退出；2、点击mini购物车跳转到购物车；3、mini购物车删除；4、瀑布流、分页点击效果；5、鼠标移入和移出菜单和商品的各种边框效果；6、点击logo回到主页；等等等等")
	// Mini购物车
	new Mini();
	/*slip的隐藏和滑出*/
	new Slip();
	/*收藏collect*/
	// new Collect();
	/*fly cart*/
	// new FlyCart();
	// 跳转到商品详情
	// new Target();
	/*返回顶部*/
	$(".return").click(function(){
		$("body,html").animate({"scrollTop":0},500)
	})
	/*分页显示*/
	new Hot();
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
	// 加载商品列表 并排列商品
	var cont = $(".main ul li:eq(0)").html();
	new Ajax("../data/goodList.txt",1,false,function(data,dom){
		$(".main li").html("");
		var Data = JSON.parse(data);
		Load(Data,cont);
	})

})



// 跳转到商品详情  并把商品详情放到cookie里
function Target(){
	var _this = this;
	$(".list_img a").on("click",function(){
		_this.goto(this)
	})
}
Target.prototype.goto = function(dom){
	this.site = $(".list_img").index($(dom).parent());
	this.goodDetail = {
			"img" : $(".list_img").eq(this.site).find("img").attr("src"),
			"price" : $(".l_price_l").eq(this.site).find("span").text(),
			"title" : $(".list_mess").eq(this.site).find("p").text(),
			"id" : $(".join_cart").eq(this.site).prev().text()
		}
	$.cookie("goodDetail",JSON.stringify(this.goodDetail),{expires:7,path:"/"})
}


var timer, now = 0 , num , i = 0, onOff = true; hotOff = true;
//ajax加载商品列表
function Load(Data,cont){
		$(".join_cart").off("click");  //清楚加入购物车按钮添加的点击事件
		var arr = [];
		$(".main li").each(function(){
			arr.push(parseInt($(this).height()))
		})
		num = Math.min.apply(null,arr);
		now = arr.indexOf(num);
		$(".main li").eq(now).append(cont);
		$(".main li").eq(now).find(".list_img").last().find("img").attr("src",Data[i].image)
		$(".main li").eq(now).find(".l_price_l").last().find("span").html(Data[i].price)
		$(".main li").eq(now).find(".list_admin").last().html(Data[i].user)
		$(".main li").eq(now).find(".list_mess").last().find("p").html(Data[i].title);
		$(".main li").eq(now).find(".join_cart").last().prev().text("GoodId-" + i);
		function main() {
			timer = setTimeout(function(){
					i++;
					for(var j = 0; j < 10; j++){
						if( i == j*28){
							Load(Data,cont);
							clearTimeout(timer);
							onOff = true;
							/*收藏collect*/
							new Collect();
							/*fly cart*/
							new FlyCart();
							new Target();
							return;
						} 
					}
					if(i >= Data.length){
						clearTimeout(timer);
						onOff = false;
						/*收藏collect*/
						new Collect();
						/*fly cart*/
						new FlyCart();
						return;
					} else {
						Load(Data,cont);
					}
					
				},10)}
		$(window).scroll(function(){
			if($(".main li").eq(now).height() + $(".main li").offset().top - 800 <= $(window).scrollTop() && hotOff){
				if(onOff){
					onOff = false;
					main();
				}
			}
		})
		main();	
}

//最热分页显示
function Hot(){
	this.btn = $(".main_tit_box a").eq(1);
	var _this = this;
	this.nowPage = 0;
	this.btn.click(function(){
		hotOff = false;
		$(this).addClass("now_tit").siblings().removeClass("now_tit")
		_this.Load();
	})
}
Hot.prototype.Load =  function(){
	var _this = this;
	this.clickOff = true;
	// $(".goods").eq(0).find(".join_cart").prev().remove();
	this.cont = $(".goods :eq(0)").html();
	new Ajax("../data/goodList.txt",1,false,function(data,dom){
		$(".main li").html("");
		var Data = JSON.parse(data);
		_this.page(Data,_this.cont);
	})
}
Hot.prototype.page = function(Data,cont){
	$(".main li").html("");
	var _this = this;
	$(".cont_btn").css({"display":"block"})
	this.num = Math.ceil(Data.length / 20);
	this.html = ""
	for(var i = 0; i < this.num; i++){
		this.html += "<a href='javascipt:'>" + (i+1) + "</a>";
	}
	$(".em b").html(this.html);
	$(".em b a").eq(this.nowPage).addClass("btn_now").siblings().removeClass("btn_now")
	this.aStyle = $(".page a").html();
	for(var j = 0; j < 5; j++){
		for(var now = 0; now < 4; now++){
			// $(".main li").each(function(){
			// var now = $(this).index();
			var i = j * 4 + now + _this.nowPage * 20;
			$(".main li").eq(now).append("<div class='goods'><div class='main_list_box'>"+cont+"</div></div>");
			$(".main li").eq(now).find(".list_img").last().find("img").attr("src",Data[i].image).css({"width":279,"height":380})
			$(".main li").eq(now).find(".l_price_l").last().find("span").html(Data[i].price)
			$(".main li").eq(now).find(".list_admin").last().html(Data[i].user)
			$(".main li").eq(now).find(".list_mess").last().find("p").html(Data[i].title);
			$(".main li").eq(now).find(".join_cart").prev().last().html("GoodId" + i);		
		// })
		}
		
	}
	/*收藏collect*/
	new Collect();
	/*fly cart*/
	new FlyCart();
	$(".em b a").click(function(){
		$("body,html").scrollTop($(".main").offset().top);
		_this.nowPage = $(this).index();
		_this.page(Data,_this.cont);
	})
	if(!this.clickOff){
		return;
	}
	$(".page_next").click(function(){
		_this.clickOff = false;
		if($(".page_next").index($(this)) == 0){
			_this.nowPage--;
			if(_this.nowPage == -1){
				_this.nowPage = 0;
				return;
			}
			_this.page(Data,_this.cont);
		} else {
			_this.nowPage++;
			if(_this.nowPage == _this.num){
				_this.nowPage = _this.num -1;
				return;
			} 
			_this.page(Data,_this.cont);
		}
		$("body,html").scrollTop($(".main").offset().top);
		return;
	})
}



/*飞入购物车*/
function FlyCart(){
	this.aimX = $(".shopCar").find("span").offset().left; //获取购物车的目标点
	this.aimY = $(".shopCar").find("span").offset().top - $(window).scrollTop();
	var _this = this;
	$(".join_cart").on("click",function(){
		_this.init(this);
		_this.addInfo(this);
	})
}
FlyCart.prototype.init = function(dom){
	var _this = this;
	this.num = $(".join_cart").index($(dom));  //获取当前要购买商品的坐标和图片
	this.X = $(".list_img").eq(this.num).find("img").offset().left;
	this.Y = $(".list_img").eq(this.num).find("img").offset().top; //克隆该图片为新元素
	$(".list_img").eq(this.num).find("img").clone().css({"position":"fixed","left":this.X,"top":0,"zIndex":"10000"}).prependTo("body").animate({"width":"20px","height":"20px","left":this.aimX,"top":this.aimY},1000,function(){
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
		this.site = $(".join_cart").index($(dom));
		if($(dom).prev().text() in this.data["id"+$(".user_name").text()]){
			this.data["id"+$(".user_name").text()][$(dom).prev().text()].num ++;
		} else {
		this.data["id"+$(".user_name").text()][$(dom).prev().text()] = {
			"img" : $(".list_img").eq(this.site).find("img").attr("src"),
			"price" : $(".l_price_l").eq(this.site).find("span").text(),
			"num" : 1,
			"title" : $(".list_mess").eq(this.site).find("p").text()
		}
		}
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




/*collect 收藏*/
function Collect(){
	var _this = this;
	$(".heart").one("click",function(){
		_this.color(this);
	})
}
Collect.prototype.color = function(dom){
	this.aim = $(dom).closest(".list_img").next().find(".list_heart").next()
	this.aim.text(parseInt(this.aim.text()) + 1).prev().css("backgroundPosition","-17px 0")
}


/*侧边栏的滑入与滑出*/
function Slip(){
	this.width = $('.slip').width();
	this.wid = $(".slip_small").width();
	var _this = this;
	$(".slip").find("a").click (function(){
		_this.Sliphide();
	})
	$(".slip_small").click(function(){
		_this.Slipshow();
	})
}
Slip.prototype.Sliphide = function(){
	$(".slip").animate({"left":-this.width},300,function(){
		$(".slip_small").animate({"left":0},300)
	})
}
Slip.prototype.Slipshow = function(){
	$(".slip_small").animate({"left":-this.wid},300,function(){
		$(".slip").animate({"left":0},300)
	})
}