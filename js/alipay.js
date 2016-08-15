$(function(){
	if($.cookie("price")){
		var price = JSON.parse($.cookie("price")).price;
		$(".alipy_price").text(price);
		$(".cookie_price").text(price);
	}
})