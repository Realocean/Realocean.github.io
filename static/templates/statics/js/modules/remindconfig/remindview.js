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
        remindConfig: {},
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.remindConfig = param.data;
    },
    computed:{

        getModuleName: {
            get: function () {
                if (this.remindConfig.remindModule == 0) {
                    return "保养";
                } else if (this.remindConfig.remindModule  == 1) {
                    return "年检"
                } else if (this.remindConfig.remindModule == 2) {
                    return "保险"
                }else if (this.remindConfig.remindModule == 3) {
                    return "账单"
                }else if (this.remindConfig.remindModule == 4) {
                    return "租赁到期"
                }else {
                    return "--";
                }


            }
        },
        getRemindType: {
            get: function () {
                if (this.remindConfig.remindType == 0) {
                    return "提醒天数";
                } else if (this.remindConfig.remindType  == 1) {
                    return "提醒公里数"
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
