$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layer','layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});
var vm = new Vue({
    el:'#rrapp',
    data:{
        fileList:[]
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.fileList = param.data;
    },
    updated: function(){
        layui.form.render();
    },
});

function init(layui) {
    Upload({
        elid: 'approvefileview',
        fileLst: vm.fileList,
    }).initView();
    $("#closePage").on('click', function(){
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
}