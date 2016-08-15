$(window).load(function(){
	alert("此页面可操作的内容：1、账户退出；2、mini购物车；3、mini购物车删除；4、全选等选择按钮,自动判断选择的状态；5、数量增减、删除该商品、选择删除选中的商品；6、结算的2个按钮；7、点击logo回到主页；等等等等")
	//底部的选项卡
	new Options();	
	// 点击增减删除商品数量
	new Count();
	//购物车是否为空
	new Judge();
	// Mini购物车
	new Mini();
	// 是否选中并去结算
	// new IsCheck();
})

//加载头尾文件
$(function(){
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
	new carList(".cart_box");
})


// 判断是否选中并去结算
function IsCheck(){
	this.select_all = $("input[name='select-all']");
	this.check_id = $(".cart_list").find($("input[type='checkbox']"))
	var _this = this;
	this.select_all.on("click",function(){
		if(!$(this).prop("checked")){
			_this.cancel();
		} else {
			_this.all();
		}
	})
	this.check_id.on("click",function(){
		if($(this).prop("checked")){
			_this.selectNow(this);
		} else {
			_this.cancelNow(this);
		}
	})
	this.submit();
	$(".goto_submit").on("click",function(){
		_this.target();
	})
	$(".operations a").eq(0).click(function(e){
		e.preventDefault();
		_this.select_del()
	})
}
IsCheck.prototype.all = function(){  //全部选中
	$("input[type='checkbox']").prop("checked",true);
	this.submit();
}
IsCheck.prototype.cancel = function(){  //全部取消
	// $("input[type='checkbox']").removeAttr("checked");
	$("input[type='checkbox']").prop("checked",false)
	this.submit();
}
IsCheck.prototype.selectNow = function(dom){  //全选该店铺的商品
	$(dom).closest(".cart_list").find($("input[type='checkbox']")).prop("checked",true)
	var _this = this;
	this.isAllSelect = true;
	$(".cart_list").each(function(){
		if(!$(this).find(".check_id").prop("checked")){
			_this.isAllSelect = false;
		}
	})
	if(this.isAllSelect) $("input[name = 'select-all']").prop("checked",true);
	this.submit();
}
IsCheck.prototype.cancelNow = function(dom){  //取消全选该店铺的商品
	$(dom).closest(".cart_list").find($("input[type='checkbox']")).prop("checked",false)
	this.select_all.prop("checked",false)
	this.submit();
}
IsCheck.prototype.submit = function(){
	this.memory = {};
	this.memory["id" + $(".user_name").text()] = {};
	this.data = JSON.parse($.cookie("message"));
	this.count = 0;
	this.num = 0;
	var _this = this;
	this.check_id.each(function(){
		if($(this).prop("checked")){  //遍历所有的input，判断哪一件商品被选中
			_this.id = $(this).closest(".cart_list").find(".cookie_id").text();
			if(_this.id in _this.memory["id" + $(".user_name").text()]){  //如果被选中商品已加入到memory里，则跳过，否则加入到memory里
				return;
			} else if(_this.id in _this.data["id" + $(".user_name").text()]){
			_this.memory["id" + $(".user_name").text()][_this.id] = _this.data["id" + $(".user_name").text()][_this.id];
			// _this.memory[_this.id] = _this.id;
			_this.count += parseFloat($(this).closest(".cart_list").find(".cookie_count").text())
			}
		}
		return;
	})
	this.op = 0;
	for(var key in this.memory["id" + $(".user_name").text()]){
		this.op++;
	}
	if(this.op > 0){  //如果有商品被选中则点击按钮样式改变
		$(".goto_submit").removeClass("disabled").css("background","#f40")
	} else {
		$(".goto_submit").addClass("disabled").css("background","#aaa")
	}
	$(".goto_price").text(this.count); //设置已选商品总金额
	for(var key in this.memory["id" + $(".user_name").text()]){
		this.num++;
	}
	$(".goto_num").text(this.num);  //设置已选商品的数量
}
IsCheck.prototype.target = function(){
	if($(".goto_submit").hasClass("disabled")){
		return;
	}
	for(var key in this.memory["id" + $(".user_name").text()]){
		if(key in this.data["id" + $(".user_name").text()]){
			delete this.data["id" + $(".user_name").text()][key];
		}
	}
	/*var _this = this;
	this.data = JSON.parse($.cookie("message"));
	this.cookie = {};
	this.cookie["id" + $(".user_name").text()] = {};
	for(var key in this.memory){
		if(key in this.data["id" + $(".user_name").text()]){
		this.cookie["id" + $(".user_name").text()][key] = this.data["id" + $(".user_name").text()][key];
		console.log(this.data["id" + $(".user_name").text()][key]);
		console.log(this.cookie["id" + $(".user_name").text()][key])
		delete this.data["id" + $(".user_name").text()][key];
		}
	}*/
	$.cookie("message",JSON.stringify(this.data),{expires:7,path:"/"})
	$.cookie("pay",JSON.stringify(this.memory),{expires:7,path:"/"});
	location.href = "pay.html";
}
IsCheck.prototype.select_del = function(){
	var _this = this;
	$(".cart_list").each(function(){
		if($(this).find(".check_id").prop("checked")){
			$(this).remove();
			delete _this.data["id"+$(".user_name").text()][$(this).find(".cookie_id").text()]
		}
	})
	$.cookie("message",JSON.stringify(this.data),{expires:7,path:"/"})
	this.submit();
}



// 判断购物车是否为空
function Judge(){
	this.num = 0;
	if($(".user_name").text()){
		this.cookie = JSON.parse($.cookie("message"))["id" + $(".user_name").text()];
		for(var key in this.cookie){
			this.num++;
		}
		if(this.num == 1){
			$(".cart").css("display","none")
			$(".empty_cart").css("display","block")
		} else {
			$(".empty_cart").css("display","none")
			$(".cart").css("display","block")
		}
		return;
	}
	$(".cart").css("display","none")
	$(".empty_cart").css("display","block")
}

// 点击增减删除商品数量
function Count(){
	this.gotoPay = new IsCheck();
	var _this = this;
	$(".item_amount").on("click","a",function(){
		_this.add(this);
	})
	$(".cookie_remove").on("click",function(){
		_this.remove(this);
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
	this.id = $(dom).closest(".cart_list").find(".cookie_id").text();
	$(dom).closest(".cart_list").find(".cookie_count").text(this.num * parseFloat($(dom).closest(".cart_list").find(".cookie_price").text()))
	// console.log(this.id)
	this.cookie = JSON.parse($.cookie("message"))
	this.cookie["id"+$(".user_name").text()][this.id].num = this.num;
	$.cookie("message",JSON.stringify(this.cookie),{expires:7,path:"/"})
	// new IsCheck();
	// this.gotoPay.selectNow();
	// this.gotoPay.cancelNow();
	this.gotoPay.submit();
})
Count.prototype.remove = function(dom){   //删除该商品
	this.id = $(dom).closest(".cart_list").find(".cookie_id").text();
	$(dom).closest(".cart_list").remove();
	this.cookie = JSON.parse($.cookie("message"))
	delete this.cookie["id"+$(".user_name").text()][this.id]
	$.cookie("message",JSON.stringify(this.cookie),{expires:7,path:"/"})
	// this.gotoPay.selectNow();
	// this.gotoPay.cancelNow();
	this.gotoPay.submit();
	new Judge();
	// new IsCheck();

}
/*function carList(){
	if($(".user_name").text()){
		this.cont = $(".cart_box").html();
		$(".cart_box").html("");
		this.cookie = $.cookie("message");
		if(this.cookie){
			this.cookie = JSON.parse(this.cookie);
			console.log(this.cookie["id"+$(".user_name").text()])
			for(var key in this.cookie["id"+$(".user_name").text()]){
				if(key != "password"){
					$(".cart_box").append(this.cont);
					$(".td_icon").last().find("img").attr("src",this.cookie["id"+$(".user_name").text()][key].img);
					$(".td_item_mess a").last().text(this.cookie["id"+$(".user_name").text()][key].title);
					$(".cart_list_hd_box>a").last().text(key);
					$(".td_price_box span").last().text(this.cookie["id"+$(".user_name").text()][key].price);
					$(".item_amount input").last().val(this.cookie["id"+$(".user_name").text()][key].num)
					$(".td_sum_box").last().find("span").text(parseInt(this.cookie["id"+$(".user_name").text()][key].price) * this.cookie["id"+$(".user_name").text()][key].num)
				}
			}
		}
	}
}*/


//底部的选项卡
function Options(){
	this.li = $(".tabs").children();
	var _this = this;
	this.nowLi = 0;
	this.nowA = 0;
	this.nowLi = 0;
	this.li.mouseenter(function(){
		clearInterval(_this.timer)
		_this.nowA = 0;
		_this.nowLi = $(this).index();
		_this.change(this);
	})
	$(".hot_tips").children().mouseenter(function() {
		_this.nowA = $(this).index();
		_this.ulChange(this);
	});
	$(".hot_shop_box .iconfont").click(function(){
		_this.pageChage(this);
	})
	this.timer = setInterval(function(){
		_this.nowLi = ++_this.nowLi==3? 0 : _this.nowLi;
		_this.change();
	},300)
	$(".con").mouseenter(function(){
		$(".hot_shop_box .iconfont").fadeIn(300)
		clearInterval(_this.timer)
	})
	$(".con").mouseleave(function(){
		$(".hot_shop_box .iconfont").fadeOut(300)
		_this.timer = setInterval(function(){
		_this.nowLi = ++_this.nowLi==3? 0 : _this.nowLi;
		_this.change();
		},2000)
	})
}
Options.prototype.change = function(){
	$(this.li[this.nowLi]).addClass("li_first").siblings().removeClass("li_first");
	$(".line_float").stop().animate({"left":this.li[this.nowLi].offsetLeft,"width":$(this.li[this.nowLi]).outerWidth()},300)
	var _this = this;
	$(".li_chilren").each(function(){
		if($(".li_chilren").index($(this)) == _this.nowLi){
			$(this).css("display","block")
			_this.ulChange();
		} else {
			$(this).css("display","none")
		}
	})
}
Options.prototype.ulChange = function(){
	$(".hot_tips").eq(this.nowLi).children().eq(this.nowA).addClass("hot_f40").siblings().removeClass("hot_f40");
	$(".li_chilren").eq(this.nowLi).find("ul").eq(this.nowA).css("display","block").siblings().css("display","none");
}
Options.prototype.pageChage = function(dom){
	if($(".hot_shop_box .iconfont").index($(dom)) == 0){
		this.nowA--;
		if(this.nowA == -1){
			this.nowA = 4;
		} 
	} else {
		this.nowA++;
		if(this.nowA == 5){
			this.nowA = 0;
		}
	}
	this.ulChange();
}




