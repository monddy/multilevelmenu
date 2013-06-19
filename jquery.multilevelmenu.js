/**
 * multilevelmenu - jQuery plugin
 * @version: 1.2.0 - (2012/08/10)
 * @author Monddy (monddy.na@gmail.com)
 * Copyright (c) 2012 www.drugadmin.com
 * Licensed under the GPL (LICENSE) licens.
 * Requires: jQuery v1.7+
 */
 
(function($){
	$.fn.multilevelmenu = function(opts){

		var opts = $.extend({},$.fn.multilevelmenu.defaults,opts);
		
		var menuJson = null;
		$.ajax({
			url: opts.dataUrl,
			dataType: 'json',
			async:false,
			success: function(data){
				menuJson = data;
			}
		});
			
		var arrObj = [];
		var levels = repCout(levelCout(menuJson))+1;
		
		function repCout(arr){
			var cout = 0;
			var tempArr = [];
			$.map(arr,function(n){
				if(n==1){
					cout++;
					tempArr.push(cout);
				} else {
					cout = 1;
				}
			})
			if(arr.length==0){
				return 0;
			} else {
				return Math.max.apply(null, tempArr);
			}
		}
		
		function levelCout(data){
			var flag = 0;
			$.each(data,function(k,v){
				if(typeof(v)=='object'){
					flag ++;
					arrObj.push(flag);
					levelCout(v);
				}
			})
			return arrObj
		}
		
		return this.each(function(){
			$(this).css({'background-color':opts.menuBgColor,'width':opts.menuWidth});
			iteration(menuJson,$(this));
		})
		
		function iteration(menudata,plusObj){
			var plusObjUl = $('<ul>');
			$.each(menudata,function(k,v){
				var subMenuIcon = typeof(v)=='object'?' >':'';
				var menuLi = '<li>'+ k + subMenuIcon +'</li>';
				plusObj.append(plusObjUl);
				plusObjUl.css('width',parseInt(100/levels)+'%');
				$(menuLi).appendTo(plusObjUl).on(opts.eventType,function(){
					if(typeof(v)=='object'){
						if(plusObjUl.next('ul')){
							plusObjUl.nextAll('ul').remove();
							iteration(v,plusObj);
						} else {
							iteration(v,plusObj);
						}
					} else {
						plusObjUl.nextAll('ul').remove();
						if(opts.eventType != 'click'){
							$(this).click(function(){$('#contDisplay').text(v)});
						} else {
							$('#contDisplay').text(v);
						}
					}
				}).css({'cursor':'pointer','background-color':opts.liBgColor,'line-height':opts.liH,'font-size':opts.fontSize,'font-family':opts.fontFamily})
				  .hover(function(){$(this).css('background-color',opts.liHoverBgColor)},function(){$(this).css('background-color',opts.liBgColor)});
			});
		}
	}
	
	$.fn.multilevelmenu.defaults = {
		liH:'22px',
		menuBgColor:'#fafafa',
		menuWidth:960,
		liBgColor:'#EAEED9',
		liHoverBgColor:'#DFE7CD',
		eventType:'click',
		fontSize:'14px',
		fontFamily:'microsoft YaHei',
		dataUrl:'menuJsonFile3.txt'
	}
})(jQuery);