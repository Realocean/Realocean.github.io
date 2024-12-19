/**
 * @name : larryMS主入口
 * @author larry
 * @QQ: 313492783
 * @site : www.larryms.com
 * @Last Modified time: 2017-12-15 09:00:00
 */
layui.extend({
   larryms: 'lib/larryms',
   larryMenu: 'lib/larryMenu',
}).define(['jquery','larryms','larryMenu','layer'],function(exports){
    "use strict";
    var $ = layui.$,
        larryms = layui.larryms,
        larryMenu = layui.larryMenu(),
        device = layui.device();       

   var Admin = function(){
            this.config = {
                icon:'larry',
                url:'//at.alicdn.com/t/font_477590_wtu39l8gjfjyk3xr.css',
                online:true
            },
            this.screen = function(){
                var width = $(window).width();
                if(width >=1200){
                    return 4;
                }else if(width >=992){
                    return 3;
                }else if(width >=768){
                    return 2;
                }else{
                    return 1;
                }
            }
    };
  
    

    var call = {
         //扩展面板larry-panel
         panel: function(){
            $('.larry-panel .tools').off('click').on('click',function(){
                if($(this).hasClass('larry-unfold1')){
                    $(this).addClass('larry-fold9').removeClass('larry-unfold1');
                    $(this).parent('.larry-panel-header').siblings('.larry-panel-body').slideToggle();
                }else{
                    $(this).addClass('larry-unfold1').removeClass('larry-fold9');
                    $(this).parent('.larry-panel-header').siblings('.larry-panel-body').slideToggle();
                }
            });
            $('.larry-panel .close').off('click').on('click',function(){
                $(this).parents('.larry-panel').parent().fadeOut();
            });
         },
         // 子页面新增tab选项卡到父级窗口
         addTab: function(data){
            // 1、判断子页面是否在iframe框架内或者是否拥有父级ajaxLoad节点：即不支持页面独立窗口打开的新增
            if(window.top !== window.self){
                console.log(top.tab);
                // console.log(top.Tabs);
                top.tab.tabAdd(data);
            }else{
                window.location.href = data.href;
            }
            
         },
         //页面右键菜单
         RightMenu: function(larryMenuData){
              larryMenu.ContentMenu(larryMenuData,{
                   name:'body'
              },$('body'));
              if(top == self){
                   $('#larry_tab_content').mouseenter(function(){
                        larryMenu.remove();
                   });
              }else{
                   $('#larry_tab_content', parent.document).mouseout(function(){
                        larryMenu.remove();
                  });
              }
         }

    };
    Admin.prototype.init = function(){
        var that =this,
            _config = that.config;
            
        larryms.fontset({
            icon: _config.icon,
            url: _config.url,
            online: _config.online
        });
        layui.config({
            base: layui.cache.base + 'lib/'
        });
        // 加载特定模块
        if(layui.cache.page){
             layui.cache.page = layui.cache.page.split(',');
             if($.inArray('larry',layui.cache.page) === -1){
                 var extend = {};
                 layui.cache.mods = layui.cache.mods === undefined ? 'larryms' : layui.cache.mods;
                 layui.cache.path = layui.cache.path === undefined ? (layui.cache.mods+'/') : layui.cache.path;
                 for(var i= 0; i<layui.cache.page.length;i++){
                     extend[layui.cache.page[i]] = layui.cache.path+layui.cache.page[i];
                 }
                 layui.extend(extend);
                 layui.use(layui.cache.page);
             }
        }

    };
    //larry-panel
    Admin.prototype.panel = function(){
         call.panel();
    };

   Admin.prototype.render = Admin.prototype.init;
   var larry = new Admin();
   larry.render();

    exports('larry',larry);
});
