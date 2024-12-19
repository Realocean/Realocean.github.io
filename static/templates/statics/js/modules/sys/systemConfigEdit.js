var loginLogoUpload,webTitleIcoUpload;
$(function () {
    loginLogoUpload = Upload({
        elid: 'loginLogo',
        edit: true,
        fileLst: vm.systemConfig.loginLogoFileList,
        param: {'path':'systemConfig'},
        fidedesc: '系统配置',
        multipleFiles: false,
        maxLength:1,
        bindObj:{objId:localStorage.getItem("tenantId"), objType:100}
    });
    loginLogoUpload.initView();
    webTitleIcoUpload=Upload({
        elid: 'webTitleIco',
        edit: true,
        fileLst: vm.systemConfig.webTitleIcoFileList,
        param: {'path':'systemConfig'},
        fidedesc: '系统配置',
        multipleFiles: false,
        maxLength:1,
        bindObj:{objId:localStorage.getItem("tenantId"), objType:100}
    });
    webTitleIcoUpload.initView();
    // 附件显示信息展示不全
    $("#loginLogo .layui-input-inline-upload-text,#webTitleIco .layui-input-inline-upload-text")
        .css("height","auto");
});
// 创建vue应用
var vm = new Vue({
    el: '#rrapp',
    data: {
        /*
          loginLogo: ${server.servlet.context-path}/static/systemImg/logoNew@2x.png
          loginName: 汽车租赁管理系统
          webTitleIco: ${server.servlet.context-path}/static/systemImg/logo@2x.png
          menuTopName: 行知网络
         */
        systemConfig: {
            loginLogo: "systemImg/logoNew@2x.png",
            loginName: "汽车租赁管理系统",
            webTitleIco: "systemImg/logo@2x.png",
            menuTopName: "行知网络",
            // 添加文件列表属性为了使用公共附件组件
            webTitleIcoFileList: [
                {
                    "id": "8633A68FEE",
                    "nameAccessory": "logo@2x",
                    "nameFile": "logo@2x.png",
                    "nameExt": ".png",
                    "nameDesc": "系统配置-网页ico",
                    "url": "systemConfig/logo@2x.png",
                    "objId": null,
                    "objType": 100,
                    "typeFile": 1
                }
            ],
            loginLogoFileList: [
                {
                    "id": "34873FE9A2",
                    "nameAccessory": "logoNew@2x",
                    "nameFile": "logoNew@2x.png",
                    "nameExt": ".png",
                    "nameDesc": "系统配置-登录页logo",
                    "url": "systemConfig/logoNew@2x.png",
                    "objId": null,
                    "objType": 100,
                    "typeFile": 1
                }
            ]
        },
        fileLstId: '0',
    },
    created: function () {
        var vueApp = this;
        // 回显数据
        var url = `${baseURL}/sys/tConfig/systemConfig?tenantCode=${localStorage.getItem("tenantCode")}`;
        $.get(url, function (r) {
            if(!r || !r.data){
                return false;
            }
            console.log(r.data);
            vueApp.systemConfig.loginLogo=r.data.loginLogo;
            vueApp.systemConfig.loginName=r.data.loginName;
            vueApp.systemConfig.webTitleIco=r.data.webTitleIco;
            vueApp.systemConfig.menuTopName=r.data.menuTopName;
            vueApp.systemConfig.loginLogoFileList=r.data.loginLogoFileList;
            vueApp.systemConfig.webTitleIcoFileList=r.data.webTitleIcoFileList;
            loginLogoUpload.updateFile(vueApp.systemConfig.loginLogoFileList);
            webTitleIcoUpload.updateFile(vueApp.systemConfig.webTitleIcoFileList);
        });
    },
    methods: {
        // 新增或保存
        saveOrUpdate: function (event) {
            // 更新图片字段
            vm.systemConfig.loginLogoFileList = loginLogoUpload.fileLst;
            vm.systemConfig.webTitleIcoFileList = webTitleIcoUpload.fileLst;
            vm.systemConfig.loginLogo = (vm.systemConfig.loginLogoFileList[0]||{url:"systemConfig/logoNew@2x.png"}).url;
            vm.systemConfig.webTitleIco = (vm.systemConfig.webTitleIcoFileList[0]||{url:"systemConfig/logo@2x.png"}).url;
            $.ajax({
                type: "POST",
                url: baseURL + '/sys/tConfig/systemConfig',
                contentType: "application/json",
                data: JSON.stringify(vm.systemConfig),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            parent.layer.closeAll()
                        });
                        return false;
                    }
                    alert(r.msg);
                }
            });
            parent.layer.closeAll()
        },
        cancel: function(){
            parent.layer.close();
        }
    }
});