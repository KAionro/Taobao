$(window).load(function(){
	alert("此页面可操作的内容：1、账户退出；2、mini购物车；3、mini购物车删除；4、是否投保运费险；5、提交订单；6、点击顶部购物车回到购物车；7、点击logo回到主页；等等等等")
	// Mini购物车
	new Mini();
	// 结算所有商品
	new payList(".order_item");
	
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
})

function payList(dom){
	var _this = this;
	this.cont = $(dom).html();
	$(dom).html("");
	if($(".user_name").text()){
		this.num = 0;
		this.cookie = $.cookie("pay");
		if(this.cookie){
			this.cookie = JSON.parse(this.cookie);
			for(var key in this.cookie["id"+$(".user_name").text()]){
				if(key != "password"){
					this.num++;
					$(dom).append(this.cont);
					$(dom).find(".pay_cookie_img").last().attr("src",this.cookie["id"+$(".user_name").text()][key].img);
					$(dom).find(".pay_cookie_title").last().text(this.cookie["id"+$(".user_name").text()][key].title);
					$(dom).find(".pay_cookie_id").last().text(key);
					$(dom).find(".pay_cookie_price").last().text(this.cookie["id"+$(".user_name").text()][key].price);
					$(dom).find(".pay_cookie_num").last().text(this.cookie["id"+$(".user_name").text()][key].num)
					$(dom).find(".pay_cookie_count").last().text(parseFloat(this.cookie["id"+$(".user_name").text()][key].price) * this.cookie["id"+$(".user_name").text()][key].num)
				}
			}
			$(".cookie_sum").text(this.num);
		}
		this.sumCount();
		$(dom).find($("input[type='checkbox']")).on("click",function(){
			//计算商品含运费的总价
			_this.sum_other(this);
		})
	}
	$(".foot_btn").click(function(){
		_this.target();
	})
}
payList.prototype.sum_other = function(dom){
	var _this = this;
	// console.log($(dom).closest(".pay_to_pay").index())
	if($(dom).prop("checkbox")){
		$(dom).prop("checkbox",false);
		this.payCount = Number(this.payCount) - 0.4;
		this.payListCount = Number(this.payListCount) - 0.4;
		this.payCount = this.payCount.toFixed(2);
		this.payListCount = this.payListCount.toFixed(2);
		$(dom).closest(".pay_to_pay").find(".order_sum_price").text(this.payListCount);
		$(".admin_count_price").text(this.payCount)
		// this.sumCount();
	} else {
		$(dom).prop("checkbox",true);
		// console.log( $(dom).closest(".pay_to_pay").index());
		this.payCount = 0.4 + Number(this.payCount)
		this.payListCount = 0.4 +  Number(this.payListCount)
		this.payCount = this.payCount.toFixed(2);
		this.payListCount = this.payListCount.toFixed(2);
		$(dom).closest(".pay_to_pay").find(".order_sum_price").text(this.payListCount);
		$(".admin_count_price").text(this.payCount)
		// this.sumCount($(dom).closest(".pay_to_pay").index());
	}
}
payList.prototype.sumCount = function(p1){
	this.payCount = 0;
	this.payListCount = 0;
	var _this = this;
	$(".order_sum_price").each(function(){

		_this.payListCount = parseFloat($(this).closest(".pay_to_pay").find(".pay_cookie_count").text()) + parseFloat($(this).closest(".pay_to_pay").find(".pay_ems_price").text())
		_this.payListCount = _this.payListCount.toFixed(2);
		$(this).text(_this.payListCount);
	})
	$(".pay_to_pay").each(function(){
		_this.payCount += parseFloat($(this).find(".order_sum_price").text())
	})
	this.payCount = this.payCount.toFixed(2);
	$(".admin_count_price").text(this.payCount);
}
payList.prototype.target = function(){
	this.obj = {};
	this.obj.price = this.payCount;
	$.cookie("price",JSON.stringify(this.obj),{expires:1,path:"/"})
	$.cookie("pay","",{expires:-1,path:"/"})
	location.href = "alipay.html";
}