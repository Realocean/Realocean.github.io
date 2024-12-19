$(function () {
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
        supplyManagement: {},
        fileList:[],
        hideUploadEdit:false,
        dialogVisible:false,
    },
    created: function(){
        var _this = this;
       /* var param = parent.layer.boxParams.boxParams;
        _this.supplyManagement = param.data;*/

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        // 查看大图
        handlePictureCardPreview(item) {
            this.dialogVisible = true
        },

    }
});

function init(layui) {
    initClick();
    initData();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function initData(){
    $("#connectionAddress").hide();
    $("#listImage").hide();
}

function sendData(supplyManagement){
    vm.supplyManagement=supplyManagement;
    if(supplyManagement.jumpType==1){
        $("#connectionAddress").show();
        $("#listImage").show();
        vm.fileList.push({url:imageURL+supplyManagement.listImage})
        vm.hideUploadEdit=true;

    }
    if(supplyManagement.jumpType==2){
        $("#connectionAddress").hide();
        $("#listImage").hide();
    }
    layui.form.render();
}