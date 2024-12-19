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
        impdata:{},
        paramdata:{}
    },
    created: function(){
        var _this = this;
        var param = parent.layui.larryElem.boxParams;
        _this.impdata = param;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
    }
});

function init(layui) {
    initClick();
    var conf = {
        elid:'impBody',
        fieldName:'file'
    };
    for (var key in vm.impdata) {
        conf[key] = vm.impdata[key];
    }
    var imp = new Import(conf);
    imp.initView();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function closePage() {
    closeCurrent();
}
