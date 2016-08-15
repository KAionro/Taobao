$(function(){
	// 加载尾部
	$(".footer").load("../html/common/footer.html");
	
})

$(window).load(function(){
	/*切换登录界面*/
	new ChangeLogin();

	/*验证用户名和密码*/
	new Verify();
})
/*验证用户名和密码*/
function Verify(){
	var _this = this;
	$(".submit").click(function(){
		_this.test();
	})
}
Verify.prototype.test = function(){
	if($.cookie("message")){
		this.message = JSON.parse($.cookie("message"));
	} else {
		$(".error").css("display","block").find("i").html("&#xe62a;").next().text("你输入的用户不存在")
		return;
	}
	
	this.user = $(".user input").val();
	this.pass = $(".pass input").val();
	if("id" + this.user in this.message){
		// console.log(this.message.password + ","+ this.pass)
		if(this.message["id" + this.user].password == this.pass){
			this.message.user = this.user;
			var str = JSON.stringify(this.message);
			$.cookie("message",str,{expires:7,path:"/"});
			location.href ="../html/index.html";
		} else {
			$(".error").css("display","block").find("i").html("&#xe62a;").next().text("你输入的用户与密码不相符")
		}
	} else {
		$(".error").css("display","block").find("i").html("&#xe62a;").next().text("你输入的用户不存在")
	}
}


/*点击切换登录界面*/
function ChangeLogin(){
	this.aim = $(".hd_ma");
	var _this = this;
	this.aim.click(function(){
		_this.changeDiv();
	})
}
ChangeLogin.prototype.changeDiv = function(){
	$(".login_ma").toggle().prev().toggle();
	$(".hd_ma i").first().toggle().next().toggle();
	$(".global").toggle();
}