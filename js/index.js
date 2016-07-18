$(window).load(function(){
	new Slide(".ba_lb_tMain ul",".ba_lb_tArrow .lt");
	new Slide(".ba_lb_bMain ul",".ba_lb_bArrow .lt");
	new IndexFade();
/*banner里的猜你喜欢——加载ajax*/
	$.ajax({
   	type: "POST",
   	url: "../data/index_banner.json",
   	success: function(data){
   		// console.log(data)
   		main(data);
  	}
});
})

/*banner_secondNav_right*/
function main(data){
	var arr = data;
	$(".ba_seNav div").each(function(){
		var html = "";
		//给banner_secondNav的猜你喜欢添加标签
		for(var i = 0 ; i < 6 ; i++){
			html += '<a href="javascipt:"><img src="" alt=""><span></span></a>';
		}
		$(this).find(".ba_sN_r_list").html(html);
		//给banner_secondNav_left的上中下三个图标配上标题
		$(this).find(".ba_sN_l").children().each(function(data){
 			$(this).find("b").text(arr[$(this).parent().parent().index()].categories[data].name)
 		})
 		//给banner_secondNav的猜你喜欢的标签添加加载的图片
 		$(this).find(".ba_sN_r_list").children().each(function(data){
 			$(this).find("img").attr("src",arr[$(this).parent().parent().parent().index()].banners[data].img)
 			$(this).find("span").text(arr[$(this).parent().parent().parent().index()].banners[data].title)
 		})
 	})
}


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

