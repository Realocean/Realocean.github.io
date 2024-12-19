$(function () {
    vm.detail(window.localStorage.getItem("feedbackId"));
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        sysFeedback: {},
        verify: false,
        fileList: [],
    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detail: function (feedbackId) {
            $.ajax({
                type: "POST",
                url: baseURL + "feedback/sysfeedback/info/"+feedbackId,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){

                        vm.sysFeedback = r.sysFeedback;
                        if(r.sysFeedback.fileList != null){
                            $("#fileModel").show();
                        } else {
                            $("#fileModel").hide();
                        }
                        vm.sysFeedback.processingContent = "";
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        saveOrUpdate: function (event) {
            var url = vm.sysFeedback.feedbackId == null ? "feedback/sysfeedback/save" : "feedback/sysfeedback/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.sysFeedback),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('处理成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        // 意见反馈附件查看
        viewAccessory:function(){
            window.localStorage.setItem("objType", 41);
            window.localStorage.setItem("objId", window.localStorage.getItem("feedbackId"));
            var index = layer.open({
                title: "意见反馈  > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                }
            });
            layer.full(index);
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_processingContent: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "处理结果不能为空";
                    }
                }
            },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}

function initTable(table, soulTable) {

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
