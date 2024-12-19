/**
 * @name 后台登录模块
 */
layui.define(['larry','form','larryms'],function(exports){
	"use strict";

	var $ = layui.$,
            layer = layui.layer,
            larryms = layui.larryms,
            form = layui.form;

    larryms.cleanCached('larry_menu');
    function supersized() {
        $.supersized({
            // 功能
            slide_interval: 3000,
            transition: 1,
            transition_speed: 1000,
            performance: 1,
            // 大小和位置
            min_width: 0,
            min_height: 0,
            vertical_center: 1,
            horizontal_center: 1,
            fit_always: 0,
            fit_portrait: 1,
            fit_landscape: 0,
            // 组件
            slide_links: 'blank',
            slides: [{
                image: './statics/images/login/1.jpg'
            }, {
                image: './statics/images/login/2.jpg'
            }, {
                image: './statics/images/login/3.jpg'
            }]
        });
    }
    larryms.plugin('jquery.supersized.min.js',supersized); 

    $('#codeimage').on('click', function() {
        this.src="captcha.jpg?t=" + $.now();
    });
    
    form.on('submit(submit)', function(data) {
        var pas = encodeURIComponent(data.field.password);
        var des ="username="+data.field.username+"&password="+pas+"&captcha="+data.field.captcha;
        var code=data.field.tenantCode;
        if(vm.showForm==1){
            if(code==null||code==''){
                layer.tips("商户号不能为空", $('#password'), {
                    tips: [3, '#FF5722']
                });
                return ;
            }
            des=des+"&tenantCode="+code;
        }
        $.ajax({
            type: "POST",
            url: baseURL + "sys/login",
            data: des,
            dataType: "json",
            async: false,
            success: function(result){
                if(result.code == 0){//登录成功
                    layer.msg('登录成功', {
                        icon: 1,
                        time: 1000
                    });
                    sessionStorage.setItem("userId", result.user.userId);
                    sessionStorage.setItem("username", result.user.username);
                    sessionStorage.setItem("officialPartner", result.user.officialPartner == null?'':result.user.officialPartner);
                    sessionStorage.setItem("userdeptId", result.user.deptId);
                    sessionStorage.setItem("userdeptName", result.user.deptName);
                    localStorage.setItem("tenantCode", result.user.tenantCode);
                    localStorage.setItem("tenantId", result.user.tenantId);
                    sessionStorage.setItem("daikouFlag", result.user.daikouFlag);
                    sessionStorage.setItem("avatar", result.user.avatar);
                    sessionStorage.setItem("tenantFlag", result.user.tenantFlag^0);
                    sessionStorage.setItem("cookie", result.user.cookie);
                    sessionStorage.setItem("flagSequence", '');
                    window.location.href = 'index.html';
                }else if(result.code == 501){//验证码错误
                    layer.tips(result.msg, $('#larry_code'), {
                        tips: [3, '#FF5722']
                    });
                }else{
                    layer.tips(result.msg, $('#password'), {
                        tips: [3, '#FF5722']
                    });
                }
                $('#codeimage').attr("src", "captcha.jpg?t=" + $.now());
            }
        });
        return false;
    });
    exports('login', {}); 
});
