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
        q:{
            keyword: null
        },
        scCommissionPlan: {},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scCommissionPlan = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        changePrimaryCommissionAmount:function(e){
            e.target.value=(e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            vm.scCommissionPlan.primaryCommissionAmount = e.target.value;
        },changePrimaryCommissionPercentage:function(e){
            e.target.value=(e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            vm.scCommissionPlan.primaryCommissionPercentage = e.target.value;
        },changeSecondaryCommissionAmount:function(e){
            e.target.value=(e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            vm.scCommissionPlan.secondaryCommissionAmount = e.target.value;
        },changeSecondaryCommissionPercentage:function(e){
            e.target.value=(e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            vm.scCommissionPlan.secondaryCommissionPercentage = e.target.value;
        },
        saveOrUpdate: function (event) {
            var url = vm.scCommissionPlan.commissionPlanId == null ? "qmyx/sccommissionplan/save" : "qmyx/sccommissionplan/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.scCommissionPlan),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
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
                    /*validate_commissionPlanId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "佣金方案主键id不能为空";
                    }
                }
            },
                    validate_tenantId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "租户id不能为空";
                    }
                }
            },
                    validate_planNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "方案编号不能为空";
                    }
                }
            },*/
       validate_planName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "方案名称不能为空";
                    }
                }
            },
        validate_primaryAmountChecked: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "一级分销类型不能为空";
                }
            }
        },
                    validate_primaryCommissionAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify && vm.scCommissionPlan.primaryAmountChecked == '1') {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "一级分销佣金金额不能为空";
                    }
                }
            },
                    validate_primaryCommissionPercentage: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify && vm.scCommissionPlan.primaryAmountChecked == '2') {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "一级分销佣金百分比不能为空";
                    }
                }
            },
        validate_secondaryAmountChecked: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "二级分销类型不能为空";
                }
            }
        },
                    validate_secondaryCommissionAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify && vm.scCommissionPlan.secondaryAmountChecked == '1') {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "二级分销佣金金额不能为空";
                    }
                }
            },
                    validate_secondaryCommissionPercentage: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify && vm.scCommissionPlan.secondaryAmountChecked == '2') {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "二级分销佣金百分比不能为空";
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
    form.on('select(primaryAmountChecked)', function(data){
        Vue.set(vm.scCommissionPlan, "primaryAmountChecked", data.value);
    });form.on('select(secondaryAmountChecked)', function(data){
        Vue.set(vm.scCommissionPlan, "secondaryAmountChecked", data.value);
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
