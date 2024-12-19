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
        tabConfig: {},
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.tabConfig = param.data;
    },
    computed:{






    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
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
