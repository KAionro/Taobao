$(function(){
	// 加载头部和尾部
	$(".head").load("../html/common/header.html");
	$(".footer").load("../html/common/footer.html");
	
})

$(window).load(function(){
	/*注册移动滑块*/
	var moveOff = new Move();

	/*验证手机号*/
	var phoneOff = new Verify();

	/*next page*/
	new Next(moveOff,phoneOff);

	/*验证密码*/
	var pass = new Passw();

	/*提交账户密码  转到首页*/
	new Submit(pass);

})

/*提交账户密码  转到首页*/
function Submit(p1){
	this.btn = $(".goto");
	var _this = this;
	this.btn.click(function(){
		if(p1.onOff){
			_this.goto();
		}
	})
}
Submit.prototype.goto = function(){
	this.obj = $.cookie("message");
	this.obj = this.obj? JSON.parse(this.obj) : {};
	var us = "id" + $(".phone_num").val();
	this.obj[us] = {};
	this.obj[us].password = $(".password").val();
	this.obj.user = $(".phone_num").val();
	var str = JSON.stringify(this.obj)
	$.cookie("message",str,{expires:7,path:"/"});
	location.href = "../html/index.html";
	// cookie 格式：{"id11111111111":{"password":"111111"},"id12222222222":{"password":"111111"}}
}


// 验证密码的输入框
function Passw(){
	this.regexp = /^\w{6,18}$/
	var _this = this;
	this.onOff = false;
	$(".password").change(function(){
		_this.val = $(this).val();
		_this.verify();
	})
}
Passw.prototype.verify = function(){
	if(this.regexp.test(this.val)){
		$(".result:last").css({"color":"#7ac23c"}).children("i").html("&#xe62b;").siblings().text("");
		$(".submit:last").css({"background":"#f40","color":"#fff","cursor":"pointer"});
		this.onOff = true;
	} else {
		$(".result:last").css({"color":"#f40"}).children("b").text("请正确输入6~18位由字母、数字、下划线、组成的密码").siblings().html("&#xe62a;")
	}
}


// 点击下一页 跳转到注册账户的页面
function Next(p1,p2){
	this.p1 = p1;
	this.p2 = p2;
	this.nextpage = $(".submit");
	var _this = this;
	this.nextpage.click(function(){
		_this.page();
	})
}
Next.prototype.page = function(){
	if(this.p2.onOff && !this.p1.onOff){
		$(".tips_now").removeClass("tips_now");
		$(".tips li").eq(1).addClass("tips_now");
		$(".index").css("display","none").next().css("display","block")
		$(".user").val( $(".phone_num").val()).attr("disabled","disabled")
	}
}



/*验证手机号*/
function Verify(){
	this.regexp = /^1(3|5|7|8)\d{9}$/;
	var _this = this;
	this.onOff = false;
	$(".phone_num").change(function(){
		_this.ver();
	})
}
Verify.prototype.ver = function(){
	if($.cookie("message")){
		this.message = JSON.parse($.cookie("message"));
		if(("id" + this.val) in this.message){
		$(".result:eq(0)").css({"color":"#f40"}).children("b").text("你输入的手机号码已存在").siblings().html("&#xe62a;")
		return;
		}
	} 
	this.val = $(".phone_num").val();
	
	if(this.regexp.test(this.val)){
		$(".result:eq(0), .result:eq(1)").css({"color":"#7ac23c"}).children("i").html("&#xe62b;").siblings().text("");
		this.onOff = true;
	} else {
		$(".result:eq(0)").css({"color":"#f40"}).children("b").text("手机号码格式不正确，请重新输入").siblings().html("&#xe62a;")
	}
}



/*注册移动滑块*/
function Move(){
	this.block = $(".move span");  //找到滑块
	this.left = 0;
	var _this = this;
	this.onOff = true;  //增加一个控制滑块是否可拖动的开关
	this.block.mousedown(function(e){
		if(_this.onOff){
			_this.X = e.offsetX;   //获取鼠标相对于滑块的初始坐标
			_this.Y = e.offsetY;
			document.onmousemove = function(e){
				_this.down(e);
			}
			$(document).mouseup(function(){
				document.onmousemove = null;
				if(_this.onOff){   //如果滑块未滑到顶头的位置，则绿色框和滑块都返回到初始位置
					$(".move_bd").animate({"width":0},300);
					_this.block.animate({"left":0},300)
				}
			})
		}
	})

}
Move.prototype.down = function(e){
	this.nowX = e.pageX - this.X ;  //得到滑块当前相对于document的坐标
	if(this.nowX < $(".move").offset().left){ //如果鼠标的x坐标小于滑动框的左边框距离的判断
		this.nowX = $(".move").offset().left;
	} else if(this.nowX > $(".move").offset().left + $(".move").width() - 40){//如果鼠标的x坐标大于滑动框的右边框距离的判断
		this.nowX = $(".move").offset().left + $(".move").width() -40;
		$(".submit:first").css({"background":"#f40","color":"#fff","cursor":"pointer"}); //提交框的变化
		this.block.html("&#xe62b;").css("color","#7ac23c") //滑块的变化
		this.onOff = false;
	}
	this.block.css({"left":this.nowX - $(".move").offset().left});  //设置滑块的位置
	$(".move_bd").css("width",this.nowX - $(".move").offset().left); //设置绿色框的宽度和滑块滑动的距离一样

}
/*注册移动滑块 -- 结束*/