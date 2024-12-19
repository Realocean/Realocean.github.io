/**
 * @name 后台首页
 */
layui.define(['jquery','larry'],function(exports){
  "use strict";
	var $ = layui.$,
	    larry = layui.larry,
	    larryms = layui.larryms;

    $('#closeInfo').on('click',function(){
         $('#Minfo').hide();
    });
	   
	$('#shortcut a').off('click').on('click',function(){
          var data = {
               href: $(this).data('url'),
               icon: $(this).data('icon'),
               ids: $(this).data('id'),
               group:$(this).data('group'),
               title:$(this).children('.larry-value').children('cite').text()
          }
          // larry.addTab(data);
    }); 
    // 引入larry-panel操作
    larry.panel();
    
    var myDate = new Date(),
           year = myDate.getFullYear(),
           month = myDate.getMonth()+1,
           day = myDate.getDate(),
           time = myDate.toLocaleTimeString();
       $('#weather').html('您好，现在时间是：'+year+'年'+month+'月'+day+'日 '+time+'');
       $('#versionT').text(larryms.version);

    exports('main', {}); 
});