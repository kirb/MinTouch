/*!
 * MinTouch
 *
 * A mobile web library
 *
 * @author Ad@m
 * @website http://github.com/kirbylover4000/MinTouch
 * @license Creative Commons Attribution-ShareAlike 3.0 Unported - http://creativecommons.org/licenses/by-sa/3.0/
 */
(function($){
	if(typeof $=="undefined"||typeof jQuery=="undefined"){
		document.body.innerHTML="Please load jQuery before MinTouch!";
	}else{
		window.MinTouch=function(opt){
			var defaults={
				theme:"dark",
				webApp:true,
				icon:null,
				startup:null,
				fullViewport:true,
				themeDir:"themes/",
				title:" - "+document.title,
				home:"#mainwindow",
				debug:false,
				defaultStyles:true,
				statusBar:"black",
				iconGloss:true
			},options=$.extend(defaults,opt),currenttheme=options.theme;
			this.theme=options.theme;
			this.params="";
			this.sectionScroller=null;
			this.asideScroller=null;
			$("<link rel=stylesheet data-mintouchcss=true>").attr("href",escape(options.themeDir)+"MinTouch_Scroll.css"+(options.debug?"?_="+new Date().getTime():"")).prependTo("head");
			$("<link rel=stylesheet data-mintouchtheme=true>").attr("href",escape(options.themeDir)+escape(this.theme)+".css"+(options.debug?"?_="+new Date().getTime():"")).prependTo("head");
			if(options.defaultStyles){
				$("<link rel=stylesheet data-mintouchcss=true>").attr("href",escape(options.themeDir)+"MinTouch.css"+(options.debug?"?_="+new Date().getTime():"")).prependTo("head");
			}
			if(options.fullViewport){
				$("<meta name=viewport content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0'>").prependTo("head");
			}
			if(options.webApp){
				$("<meta name='apple-mobile-web-app-capable' content=yes>").prependTo("head");
				$("<meta name='apple-mobile-web-app-status-bar-style' content="+(options.statusBar=="white"?"default":"black")+">").prependTo("head");
			}
			if(options.icon){
				$("<link rel='apple-touch-icon"+(options.iconGloss?"":"-precomposed")+"'>").attr("href",options.icon).prependTo("head");
			}
			if(options.startup){
				$("<link rel='apple-touch-startup-image'>").attr("href",options.startup).prependTo("head");
			}
			var _that=this;
			this._scrollfix=function(e){
				try{
					var t=e.target;
					while(t.nodeType!=1){
						t=t.parentNode;
					}
					var n=target.tagName.toLowerCase();
					if(n=="select"||n=="input"||n=="textarea"||n=="keygen"){
						e.preventDefault();
						return false;
					}
				}catch(e){
					return true;
				}
			};
			this.setTheme=function(name){
				if(name!=this.theme){
					this.theme=name;
					$("link[data-mintouchtheme=true]").attr("href",escape(options.themeDir)+escape(_that.theme)+".css"+(options.debug?"?_="+new Date().getTime():""));
				}
			};
			$(function(){
				var locationhash=options.home.replace(/(.*),(.*)/,"$1"),hash=location.hash.replace(/(.*),(.*)/,"$1"),params=/(.*),(.*)/.test(location.hash)?location.hash.replace(/(.*),(.*)/,"$2"):"",locationparams=params;
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
				_that._hashchange=function(){
					console.log("hashchange start");
					hash=location.hash.replace(/(.*),(.*)/,"$1");
					params=/(.*),(.*)/.test(location.hash)?location.hash.replace(/(.*),(.*)/,"$2"):"";
					console.log(hash==locationhash,params==locationparams);
					if((hash!=locationhash||params!=locationparams)&&($(hash).is("section")&&$(hash).parent().is("body"))){
						locationhash=hash;
						locationparams=this.params=params;
						$("section").slideUp(1000,function(){
							$(this).trigger("MinTouch_close");
						});
						$(hash).slideDown(1000,function(){
							$(this).trigger("MinTouch_open");
						});
						scrollTo(0,16);
						document.title=$(locationhash).find("header>h1").text()+options.title;
					}
				};
				$("section>article,aside>article").wrapInner("<div><div></div></div>");
				if("iScroll" in window){
					$("html").addClass("iscroll");
					$("html,body").bind("touchmove",function(e){
						if($("body").width()<800){
							return true;
						}
						scrollTo(0,16);
						e.preventDefault();
						return false;
					}).trigger("touchmove");
				}
				var theaside=$("body>aside:visible").find("article");
				if(theaside.length==1){
					setTimeout(function(){
						this.asideScroller=new iScroll(theaside[0],{
							checkDOMChanges:false,
							onBeforeScrollStart:_that._scrollfix
						});
					},100);
				}else{
					$("html").addClass("noaside");
				}
				$("section").bind("MinTouch_open",function(){
					try{
						_that.sectionScroller=new iScroll($(this).find("article")[0],{
							checkDOMChanges:false,
							onBeforeScrollStart:_that._scrollfix
						});
						setTimeout(function(){
							$(window).trigger("scroll resize");
						},100);
					}catch(e){}
				}).bind("MinTouch_close",function(){
					try{
						_that.sectionScroller.destroy();
					}catch(e){}
				});
				_that.params=/(.*),(.*)/.test(location.hash)?location.hash.replace(/(.*),(.*)/,"$2"):"";
				$(locationhash).show(0,function(){
					$(this).trigger("MinTouch_open");
				});
				if("onhashchange" in window){
					window.addEventListener("hashchange",_that._hashchange,false);
					document.addEventListener("hashchange",_that._hashchange,false);
				}else{
					setInterval(function(){
						if(location.hash.replace(/(.*),(.*)/,"$1")!=locationhash){
							_that._hashchange();
						}
					},200);
				}
				$("a,button,img,input,textarea,select,keygen").bind("touchstart",function(){
					$(this).addClass("over");
				}).bind("touchend",function(){
					$(this).removeClass("over");
				});
				$("a[data-type*=button],button").prepend("<span></span>").wrapInner("<span></span>");
				setTimeout(function(){
					scrollTo(0,16);
				},10);
			});
			return true;
		};
		$(document).trigger("MinTouch_ready");
	}
})(jQuery);