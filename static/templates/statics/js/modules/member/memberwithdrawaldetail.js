$(function () {
    vm.detail(window.localStorage.getItem("withdrawalId"),window.localStorage.getItem("memberNo"));
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.render();
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        memberwithdrawaldetail:{},
    },
    computed:{
        withdrawalMethodStr:{
            get:function() {
                if(this.memberwithdrawaldetail.withdrawalMethod==0){
                    return "银联卡";
                }else{
                    return "--";
                }
            }
        },
    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {

        // 取消
        cancel:function(){
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        // 查看详情
        detail: function (withdrawalId,memberNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "member/memberwithdrawal/info/"+withdrawalId+"/"+memberNo,
                contentType: "application/json",
                success: function(r){
                    vm.memberwithdrawaldetail = r.memberWithdrawalEntity;
                    vm.fileLst = r.memberWithdrawalEntity.fileLst;
                    if(vm.fileLst.length == 0){
                        $("#memberModel").hide();
                    }
                }
            });
        },

        // 附件查看
        viewAccessory:function(){
            window.localStorage.setItem("objType", 21);
            window.localStorage.setItem("objId", window.localStorage.getItem("withdrawalId"));
            window.localStorage.setItem("objCode", window.localStorage.getItem("withdrawalNo"));
            var index = layer.open({
                title: "余额提现 > 查看详情 > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        }

        /*preview:function(){
            window.localStorage.setItem("collectionsNo", window.localStorage.getItem("withdrawalId"));
            window.localStorage.setItem("objType", 21);
            var index = layer.open({
                title: "余额提现 >查看详情>图片预览",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/carrepairorder/carrepairorderpictureDetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("collectionsNo", null);
                }
            });
            layer.full(index);
        },
        download:function(){
            //获取收款单主键
            window.localStorage.setItem("collectionsNo", window.localStorage.getItem("withdrawalId"));
            window.localStorage.setItem("objType", 21);
            var index = layer.open({
                title: "余额提现 >查看详情>文档下载",
                type: 2,
                area: ['1070px', '360px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/collectiondocdownload.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },*/
    }
});
