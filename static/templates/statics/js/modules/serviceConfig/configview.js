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
        serviceConfig: {},
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.serviceConfig = param.data;
    },
    computed:{

        getServiceType: {
            get: function () {
                if (this.serviceConfig.serviceType == 1) {
                    return "可退金额";
                } else if (this.serviceConfig.serviceType  == 2) {
                    return "违章费用"
                } else if (this.serviceConfig.serviceType == 3) {
                    return "保险费用"
                }else if (this.serviceConfig.serviceType == 4) {
                    return "扣款费用"
                }else if (this.serviceConfig.serviceType == 5) {
                    return "银行信息"
                }else if (this.serviceConfig.serviceType == 6) {
                    return "退换车说明"
                }else {
                    return "--";
                }


            }
        },
        getServiceProperty: {
            get: function () {
                if (this.serviceConfig.serviceProperty == 0) {
                    return "正常";
                } else if (this.serviceConfig.serviceProperty  == 1) {
                    return "收入"
                } else if (this.serviceConfig.serviceProperty == 2) {
                    return "支出"
                }else {
                    return "--";
                }


            }
        },
        getSuitType: {
            get: function () {
                if (this.serviceConfig.suitType == 1) {
                    return "退车";
                } else if (this.serviceConfig.suitType  == 2) {
                    return "换车"
                }else if (this.serviceConfig.suitType  == 3) {
                    return "备用车"
                }else if (this.serviceConfig.suitType  == 4) {
                    return "退换车"
                } else {
                    return "--";
                }


            }
        },
        getRentType: {
            get: function () {
                if (this.serviceConfig.suitRentType == 1) {
                    return "经租";
                } else if (this.serviceConfig.suitRentType  == 2) {
                    return "以租代购"
                } else if (this.serviceConfig.suitRentType  == 6) {
                    return "直购"
                }else {
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
