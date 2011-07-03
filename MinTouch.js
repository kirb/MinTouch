(function($){
	function isIE(){
		if(typeof document.all!="undefined"){
			if(typeof document.getElementById!="undefined"){
				var browser=navigator.userAgent.toLowerCase().replace(/.*ms(ie[\/ ][^ $]+).*/,"$1").replace(/ /,"");
				if(typeof document.uniqueID!="undefined"){
					if(browser.indexOf("5.5")!=-1){
						return browser.replace(/(.*5\.5).*/,"$1");
					}else{
						return browser.replace(/(.*)\..*/,"$1");
					}
				}else{
					return "ie5mac";
				}
			}
			return false;
		}
	}
	if(typeof $=="undefined"||typeof jQuery=="undefined"){
		document.body.innerHTML="Please load jQuery before MinTouch!";
	}else{
		window.MinTouch=function(opt){
			var defaults={
				theme:"default",
				webApp:false,
				icon:null,
				startup:null,
				fullViewport:true,
				themeDir:"themes/",
				title:" - "+document.title,
				home:"#mainwindow",
				debug:false,
				defaultStyles:true
			},options=$.extend(defaults,opt),currenttheme=options.theme;
			this.theme=options.theme;
			this.params="";
			this._sectionScroller=null;
			this._asideScroller=null;
			$("<link rel=stylesheet data-mintouchcss=true>").attr("href",escape(options.themeDir)+"MinTouch_Scroll.css"+(options.debug?"?_="+new Date().getTime():"")).prependTo("head");
			$("<link rel=stylesheet data-mintouchtheme=true>").attr("href",escape(options.themeDir)+escape(this.theme)+".css"+(options.debug?"?_="+new Date().getTime():"")).prependTo("head");
			if(options.defaultStyles){
				$("<link rel=stylesheet data-mintouchcss=true>").attr("href",escape(options.themeDir)+"MinTouch.css"+(options.debug?"?_="+new Date().getTime():"")).prependTo("head");
			}
			var _that=this;
			$(function(){
				var locationhash=options.home.replace(/(.*),(.*)/,"$1"),hash=location.hash.replace(/(.*),(.*)/,"$1");
				$("section>header,aside>header").each(function(){
					if($(this).find("h1").is("h1")){
						$(this).find("a,button").insertBefore($(this).find("h1"));
					}
				});
				$("section").hide();
				if(hash!=locationhash&&$(hash).is("section")){
					locationhash=hash;
				}
				if(location.hash==""||location.hash=="#"){
					location.hash=locationhash;
				}
				$("section>article,aside>article").wrapInner("<div><div></div></div>");
				if("iScroll" in window){
					$("html").addClass("iscroll");
					$("html,body").bind("touchmove",function(e){
						scrollTo(0,"standalone" in navigator&&navigator.standalone?36:16);
						e.preventDefault();
						return false;
					});
				}
				var theaside=$("body>aside:visible").find("article>div");
				if(theaside.length==1){
					this._asideScroller=new iScroll(theaside[0],{checkDOMChanges:false});
				}
				$("section,aside").bind("MinTouch_open",function(){
					try{
						_that._sectionScroller=new iScroll($(this).find("article>div")[0],{checkDOMChanges:false});
					}catch(e){}
				}).bind("MinTouch_close",function(){
					try{
						_that._sectionScroller.destroy();
					}catch(e){}
				});
				this.params=/(.*),(.*)/.test(location.hash)?location.hash.replace(/(.*),(.*)/,"$2"):"";
				$(locationhash).slideDown().trigger("MinTouch_open");
				setInterval(function(){
					var hash=location.hash.replace(/(.*),(.*)/,"$1"),params=/(.*),(.*)/.test(location.hash)?location.hash.replace(/(.*),(.*)/,"$2"):"";
					if(hash!=locationhash){
						locationhash=hash;
						if($(locationhash).is("section:hidden")){
							_that.params=params;
							$("section").slideUp().trigger("MinTouch_close");
							$(locationhash).slideDown().trigger("MinTouch_open");
							scrollTo(0,"standalone" in navigator&&navigator.standalone?36:16);
							document.title=$(locationhash).find("header>h1").text()+options.title;
						}
					}
					if(_that.theme!=currenttheme){
						currenttheme=_that.theme;
						$("link[data-mintouchtheme=true]").attr("href",escape(options.themeDir)+escape(_that.theme)+".css"+(options.debug?"?_="+new Date().getTime():""));
					}
				},200);
				$("a,button,img").bind("touchstart",function(){
					$(this).addClass("over");
				}).bind("touchend",function(){
					$(this).removeClass("over");
				});
				$("a[data-type*=button],button").prepend("<span></span>").wrapInner("<span></span>");
			});
			return this;
		};
	}
})(jQuery);