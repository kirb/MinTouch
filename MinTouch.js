/*!
 * MinTouch
 *
 * A mobile web library
 *
 * @author Ad@m
 * @website http://year7stjk.com/mintouch.php
 * @license Creative Commons Attribution-ShareAlike 3.0 Unported - http://creativecommons.org/licenses/by-sa/3.0/
 */
(function($){
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
			if(options.fullViewport){
				$("<meta name=viewport content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0'>").prependTo("head");
				/*
				$("<meta name=viewport content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=0'>").prependTo("head");
				$(window).bind("orientationchange",function(){
					if("orientation" in window&&(orientation==90||orientation==-90)){
						$("meta[name=viewport]").attr("content","width=device-height,height=device-width,initial-scale=1,maximum-scale=1,user-scalable=0");
					}else{
						$("meta[name=viewport]").attr("content","width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=0");
					}
				});
				*/
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
					}).trigger("touchmove");
				}
				var theaside=$("body>aside:visible").find("article>div");
				if(theaside.length==1){
					this._asideScroller=new iScroll(theaside[0],{
						checkDOMChanges:false,
						onBeforeScrollStart:_that._scrollfix
					});
				}
				$("section,aside").bind("MinTouch_open",function(){
					try{
						_that._sectionScroller=new iScroll($(this).find("article>div")[0],{
							checkDOMChanges:false,
							onBeforeScrollStart:_that._scrollfix
						});
					}catch(e){}
				}).bind("MinTouch_close",function(){
					try{
						_that._sectionScroller.destroy();
					}catch(e){}
				});
				this.params=/(.*),(.*)/.test(location.hash)?location.hash.replace(/(.*),(.*)/,"$2"):"";
				$(locationhash).show().trigger("MinTouch_open");
				setInterval(function(){
					var hash=location.hash.replace(/(.*),(.*)/,"$1"),params=/(.*),(.*)/.test(location.hash)?location.hash.replace(/(.*),(.*)/,"$2"):"";
					if(hash!=locationhash){
						locationhash=hash;
						if($(locationhash).is("section")&&$(locationhash).parent().is("body")){
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
				$("a,button,img,input,textarea,select,keygen").bind("touchstart",function(){
					$(this).addClass("over");
				}).bind("touchend",function(){
					$(this).removeClass("over");
				});
				$("a[data-type*=button],button").prepend("<span></span>").wrapInner("<span></span>");
			});
			return true;
		};
		$(document).trigger("MinTouch_ready");
	}
})(jQuery);