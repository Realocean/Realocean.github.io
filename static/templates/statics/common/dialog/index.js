// JavaScript Document
/*var allWidth = $(".menuList")[0].offsetWidth;
$(".menuList").height(allWidth*298/1400+"px");*/
var aAlert=function(content,btn1Word,callback){

  //布局弹框格式
  $("body").append('<div class="alertZZ">'+
          '<div class="aAlert">'+
              '<p style="text-align:center;font-size: 18px;margin-top: 15px;color:#fd6234;margin-left: -20px;"><img src="/webapp/discussion/ChyAppH5/img/tip.png" style="width: 23px;position: relative;top: 4px;margin-right: 4px;">提示</p>'+
              /*'<img src="/model/images/guanbi.png" class="guanbi"/>'+*/
             '<div class="showWord">'+
             '</div>'+
             /*'<div class="btnDiv"><button id="btn1">确定</button></div>'+*/
             '<div class="btnDiv">确 定</div>'+
          '</div>'+
      '</div>'
  );

  //弹框样式调整
  $("body").css({'margin':'0','padding':'0','overflow':'hidden'});
  $(".mainDiv").css('overflow','hidden');
  $("img").css({/*width:100%;'display':'block',*/'border':'0px'});
  $(".alertZZ").css({
          'width':'100%','height':'100%','position':'fixed',
          'background':'rgba(0,0,0,0.25)','top':'0','left':'0','overflow':'hidden',
          'z-index':'1000001'
  })
  $(".alertZZ .aAlert").css({
          'width':'260px','background':'#FFF','position':'absolute',
          'margin':'auto','background':'#FFF','z-index':'1000002',
          'border-radius':'5px'
  });
  $(".alertZZ .aAlert .guanbi").css({'float':'right','margin':'10px 10px auto auto','padding':'10px','cursor': 'pointer'})
  $(".alertZZ .aAlert .showWord").css({
          'padding':'0 15px','color':'#7d7d7d','margin':'15px auto 30px auto',
          'overflow':'hidden','line-height':'22px',
          'font-size':'14px','text-align':'center'
  })
  $(".alertZZ .aAlert #btn1").css({
          'width':'100px','background':'#263552',
          'color':'#FFF','border':'0px','height':'36px',
          'line-height':'36px','display':'block',
          'font-size':'14px','letter-spacing':'2px',
          'margin':'auto','font-family':'微软雅黑','outline': 'none'
  })
  $(".alertZZ .aAlert .btnDiv").css({
          'background':'#fd6234','margin':'20px auto auto auto',
          'text-align':'center','width':'100%','padding':'10px 0',
          'color':'#fff','border-bottom-left-radius':'5px',
          'border-bottom-right-radius':'5px'
  });

  //弹框居中显示
  //alert("12"+document.documentElement.clientHeight);

      /*
      var alertLeft=window.innerWidth/2-$(".aAlert").outerWidth()/2,
          alertTop=window.innerHeight/3-$(".aAlert").outerHeight()/3;
      $(".alertZZ .aAlert").css({'left':alertLeft+'px','top':alertTop+'px'});
      */
      var alertLeft=window.innerWidth/2-$(".aAlert").outerWidth()/2,
          alertTop=window.innerHeight/3-$(".aAlert").outerHeight()/3;
  $(".alertZZ .aAlert").css({'left':alertLeft+'px','top':alertTop+'px'});
  //添加弹框的内容
  $(".alertZZ .aAlert .showWord").html(content);
  if(btn1Word!=""){
      $(".alertZZ .aAlert #btn1").html(btn1Word);
  }

  //alert($(".showWord").html());
  var str=$(".showWord").html();
  //获取该div包含字符的个数
  var strLength = 0;
  for(var i = 0;i < str.length; i++){
    if(str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
       strLength += 2;
    else
       strLength++;
  }
  //alert(strLength);
  if(strLength>42){$(".showWord").css('text-align','left');}

  //点击关闭按钮和这灰色的遮罩层，关闭弹框
   $(".alertZZ .aAlert .btnDiv").click(function (){
       $("body").css('overflow-y','auto');
       $(".mainDiv").css('overflow-y','auto');
       $(".alertZZ").remove();
      //$(".alertZZ .aAlert").hide();
      if($(".alertZZ .aAlert").hide()&&$(".alertZZ").hide()){
          //callback();
      }
   });
$(".alertZZ .guanbi").click(function (){
  $("body").css('overflow-y','auto');
   $(".mainDiv").css('overflow-y','auto');
  $(".alertZZ").remove();
  //$(".alertZZ .aAlert").hide();
});

}