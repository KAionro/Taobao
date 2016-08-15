$(function(){
/*加载头部、尾部文件*/
	new Ajax("common/header.html",".head",false)
	new Ajax("common/footer.html",".footer",false)
/*检测是否已登录 和 退出操作*/
	new Login();
	// 购物车的里内容
	new carList();
	alert("此页面可操作的内容：提示（所有的用户cookie全部存放到一个cookie里，当心cookie爆炸，每个用户的购物车是不一样的）1、账户退出；2、点击mini购物车跳转到购物车；3、mini购物车删除；4、点击搜索按钮挑战到商品列表；5、二级菜单、轮播图、吸顶、选项卡、楼梯以及楼梯按钮背景颜色、各种鼠标移入移出事件；7、点击logo回到主页；等等等等")

	// 加载时尚爆料王的信息
	new Fashion(".fa_main",4)
	/*my favorite*/
	new Myfavorite();

/*加载猜你喜欢的li*/
	var html = $(".cont_li_box ul").html();
	$(".cont_li_box ul").html("");
	for(var i = 0 ; i < 120; i++){
		$(".cont_li_box ul").append(html);
	}
	// 首先判断浏览器窗口的大小
	if(window.innerWidth <= 1280){
		$(".stair_sub").css({"right":0,"marginRight":0})
	}  //当浏览器窗口大小发生改变的是时候
	$(window).resize(function(){
		if(window.innerWidth <= 1280){
			$(".stair_sub").css({"right":0,"marginRight":0})
		} else {
			$(".stair_sub").css({"right":"50%","marginRight":"-655px"})
		}
	})
})

$(window).load(function(){
	// Mini购物车
	new Mini();
/*banner_Slide  和  banner_secondNav fade*/
	new Slide(".ba_lb_tMain ul",".ba_lb_tArrow .lt");
	new Slide(".ba_lb_bMain ul",".ba_lb_bArrow .lt");
	new IndexFade();
/*main_right_news_slide*/
	new Main_R_slide();
/*my favortie 我常逛的*/
	new Favorite();
/*stair 楼梯*/
	var ST = new Stair();
/*cont_like猜你喜欢里图片鼠标移入模糊*/
	new Contlike();
/*banner_news的选项卡切换*/
	new BaNews();



/*banner里的猜你喜欢——加载ajax*/
	$.ajax({
	   	type: "get",
	   	url: "../data/index_banner.txt",
	   	success: function(data){
	   		 // console.log(data)
	   		main(data);
	  	}
	});


/*cont_like猜你喜欢的ajax加载*/
	$.ajax({
		type:"get",
		url:"../data/message.txt",
		success:function(data){
			// console.log(data);
			contLike(data);
		}
	})


// 吸顶效果
	var topValue = $(".ba_cont").offset().top;
	$(window).scroll(function(){
		if($(this).scrollTop() >= topValue){
			$("#xiding").addClass("ba_fixed");
			$(".ba_se_l_top").attr("id","ba_top_xiding");
			$(".ba_se_l_top li").addClass("ba_top_li_xiding");
			$(".logo").addClass("logo_small");
			$(".logo_big").css("display","none");
			$(".logo h1").css("display","block");
			$(".ba_ewm").css("display","none");
			$(".ba_se_co_r").css("display","none");
			$(".ba_se").css("height","35px");
			$(".se_btn").css({"height":"35px","top":0});
			$(".se_text").css("height","29px");
			$(".se_camera").css("top","4px");
			$(".se_text_in input").css({"textIndent":"100px","height":"17px"});
			$(".ba_more").css("display","none");

		} else {
			$("#xiding").removeClass("ba_fixed")
			$(".ba_se_l_top").removeAttr("id");
			$(".ba_se_l_top li").removeClass("ba_top_li_xiding");
			$(".logo").removeClass("logo_small");
			$(".logo_big").css("display","block");
			$(".logo h1").css("display","none");
			$(".ba_ewm").css("display","block");
			$(".ba_se_co_r").css("display","block");
			$(".ba_se").css("height","auto");
			$(".se_btn").css({"height":"40px","top":"25px"});
			$(".se_text").css("height","auto");
			$(".se_camera").css("top","7px");
			$(".se_text_in input").css({"textIndent":"10px","height":"22px"});
			$(".ba_more").css("display","block");
		}
		//侧边栏楼梯的固定
		if($(this).scrollTop() >= 490){
			$(".stair_sub").css({"position":"fixed","top":"49px"})
		} else {
			$(".stair_sub").css({"position":"absolute","top":"490px"})
		}
		//侧边栏楼梯里的 返回顶部的显示和消失
		if($(this).scrollTop() >= $(".ba_bottom").offset().top){
			$(".stair_sub_7").css("display","block")
		} else {
			$(".stair_sub_7").css("display","none")
		}
		$(".stair_main").each(function(){
			if($(window).scrollTop() + 49 >= $(this).offset().top){
				$(".stair_sub a").eq($(".stair_main").index($(this))).attr("id","stair_bd_"+($(".stair_main").index($(this))+1)).siblings().removeAttr("id");
				ST.now = $(".stair_main").index($(this));
			}
		})
	})
	// target 
	new target();
})

//跳转到商品列表
function target(){
	$(".se_btn a").click(function(e){
		e.preventDefault();
		location.href = "goodList.html";
	})
}


/*cont_like猜你喜欢的ajax加载*/
function contLike(data){
	var arr = JSON.parse(data);
	$(".cont_li_box li").each(function(i){
		$(this).find(".cont_list_tit").find("img").attr("src",arr[0].cont_like[i].img)
		$(this).find(".cont_list_tit").children("p").children("span").text(arr[0].cont_like[i].name)
	})
}




/*banner_secondNav_right  二级菜单里的图片加载*/
function main(data){
	var arr = JSON.parse(data);
	// console.log(arr);
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
/*banner_fade  二级菜单的淡入淡出*/
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


/*main_Right_news  slide方向向上的轮播图*/
function Main_R_slide(){
	this.ul = $(".R_slide_box ul")
	var _this = this;
	this.timer = setInterval(function(){
		_this.slide();
	},3000)
}
Main_R_slide.prototype.slide = function(){
	if(parseInt(this.ul.css("top")) == -120){
		this.ul.animate({top:0},200);
	} else {
		this.ul.animate({top:"-=60"},300);
	}
}


/*my favorite  我常逛的 文字高度调整效果*/
function Favorite(){
	this.aim = $(".faL_rM_b>a")
	var _this = this;
	this.aim.each(function(){
		$(this).mouseenter(function(){
			_this.goto(this)
		})
		$(this).mouseleave(function(){
			_this.goout(this)
		})

	})

}
Favorite.prototype.goto = function(dom){
	$(dom).fadeTo(500,0.7)
	$(dom).children("span").stop().animate({"height":"96px"},500)
}
Favorite.prototype.goout = function(dom){
	$(dom).fadeTo(500,1)
	$(dom).children("span").stop().animate({"height":"24px"},500)
}



/*Stair 楼梯 start*/
function Stair(){
	this.stSub = $(".stair_sub a");
	var _this = this;
	this.obj = {

	}
	this.stSub.each(function(){
		if($(this).attr("id") == ("stair_bd_"+($(this).index()+1))){
			_this.now = $(this).index();
		}
	})
	this.stSub.mouseover(function(){
		if($(this).index() == _this.now){
			return;
		}
		_this.over(this);
	})
	this.stSub.mouseout(function(){
		if($(this).index() == _this.now){
			return;
		}
		_this.out(this);
	})
	this.stSub.click(function(){
		_this.btn(this)
	})
}
Stair.prototype.over = function(dom){
	$(dom).attr("id","stair_bd_"+($(dom).index()+1))
}
Stair.prototype.out = function(dom){
	$(dom).removeAttr("id");
}
Stair.prototype.btn = function(dom){
	if($(dom).index() < 6) {
		this.now = $(dom).index();
		this.aim = $(".stair_main").eq($(dom).index()).offset().top - 49;
		// console.log(this.aim)
		$("body,html").stop().animate({
			"scrollTop":this.aim
		},500,function(dom){
			$(dom).attr("id","stair_bd_"+($(dom).index()+1)).siblings().removeAttr("id")
		});
		return;
	} else if($(dom).index() == 6){
		$("body,html").stop().animate({
			"scrollTop":0
		},1000);
		return;
	}
}
/*Stair 楼梯 over*/



/*cont_like猜你喜欢里图片鼠标移入模糊*/
function Contlike(){
	this.list = $(".cont_li_box li");
	var _this = this;
	this.list.mouseover(function(){
		_this.fadeHide(this);
	})
	this.list.mouseout(function(){
		_this.fadeShow(this);
	})
}
Contlike.prototype.fadeHide = function(dom){
	$(dom).stop().fadeTo(500,0.6);
}
Contlike.prototype.fadeShow = function(dom){
	$(dom).stop().fadeTo(500,1);
}




/*banner_news的选项卡切换*/
function BaNews(){
	this.tip = $(".ba_news_tip li");
	var _this = this;
	this.tip.mouseenter(function(){
		_this.dom = this;
		clearTimeout(_this.timer);
		_this.timer = setTimeout(function(){
			_this.Bachange(_this.dom)
		},500)
	})
	this.tip.mouseleave(function(){
		clearTimeout(_this.timer);
	})
}
BaNews.prototype.Bachange = function(dom){
	$(".ba_news_main div").eq($(dom).index()).show().siblings().hide();
	$(dom).addClass("ba_news_on").siblings().removeClass("ba_news_on");
}


// 获得时尚爆料王里的内容格式  加载到品味生活家、特色玩味控
function Fashion(dom,n){
	this.th_cont = $(dom).children().get(0);  //分别先取得两种不同的格式时尚爆料王的样式
	this.cont = $(dom).html();
	this.html = "";
	this.count = 0;
	this.num = 0;
	var _this = this;
	$(dom).html("");
	$(dom).eq(0).html(this.cont);
	$(dom).eq(0).find(".main_pub_tit").each(function(){
		_this.num++;
		// _this.num = $(this).closest(".fashion_main_th").index();
		$(this).find("img").attr("src","../img/index/fashion_" + _this.num + ".jpg")
	})
	$(dom).eq(0).find(".fa_pub_main").each(function(){
		// _this.num = $(this).closest(".fashion_main_th").index();
		$(this).find("img").each(function(){
			_this.count++;
			$(this).attr("src","../img/index/fashion_1_" + _this.count + ".jpg")
		})
	})

	$(dom).eq(1).html(this.cont + this.cont);
	$(dom).eq(1).find(".main_pub_tit").each(function(){
		_this.num ++;
		$(this).find("img").attr("src","../img/index/fashion_" + _this.num + ".jpg")
	})
	$(dom).eq(1).find(".fa_pub_main").each(function(){
		$(this).find("img").each(function(){
			_this.count++;
			$(this).attr("src","../img/index/fashion_1_" + _this.count + ".jpg")
		})
	})	

	$(dom).eq(2).html(this.cont + this.cont);
	$(dom).eq(2).find(".main_pub_tit").each(function(){
		_this.num ++;
		$(this).find("img").attr("src","../img/index/fashion_" + _this.num + ".jpg")
	})
	$(dom).eq(2).find(".fa_pub_main").each(function(){
		$(this).find("img").each(function(){
			_this.count++;
			$(this).attr("src","../img/index/fashion_1_" + _this.count + ".jpg")
		})
	})	
}


// 我长逛的加载 my favorite
function Myfavorite(){
	this.cont = $(".main_fa_main").html();
	var _this = this;
	$(".main_fa_main").html("");
	this.count = 0;
	this.color;
	for(var i = 0 ; i < 4 ; i++){
		this.num = 0;
		$(".main_fa_main").append(this.cont);
		$(".main_faL").last().find("img").each(function(){
			_this.now = $(this).closest(".main_faL").index() + 1;
			if(_this.num == 0) {
				$(this).attr("src","../img/index/main_favortie_"+_this.now+"_8.jpg");
			}
			else {
				$(this).attr("src","../img/index/main_favortie_"+_this.now+"_"+_this.num+".jpg");
			}
			_this.num++;
		})
		switch(i){
			case 1:
			this.color = "#fe6fa6";
			break;
			case 2:
			this.color = "#5170ec";
			break;
			case 3:
			this.color = "#772cc4";
		}
		$(".faL_l_b").last().css("background",this.color);
		$(".main_faL_r").last().find("s").css("borderColor",this.color);
		$(".faL_rM_b").last().find("em").css("background",this.color);
	}

}