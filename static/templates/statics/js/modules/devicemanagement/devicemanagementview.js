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
        deviceManagement: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.deviceManagement = param.data;
    },
    computed:{
        getDeviceType: {
            get: function () {
                if (this.deviceManagement.deviceKind == 0) {
                    return "无线设备";
                } else if (this.deviceManagement.deviceKind == 1) {
                    return "有线设备";
                } else {
                    return "--";
                }
            }

        }

    },
    updated: function(){
        layui.form.render();
    },
    methods: {

    }
});

function init(layui) {
    initEventListener(layui);
}

function initEventListener(layui) {
    initClick();
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
