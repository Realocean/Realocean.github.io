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
        orderCarPlan: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.orderCarPlan = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.orderCarPlan.id == null ? "order/ordercarplan/save" : "order/ordercarplan/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.orderCarPlan),
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
                    validate_id: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "不能为空";
                }
            },
                    validate_code: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "方案编号不能为空";
                }
            },
                    validate_orderCarId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车辆订单id不能为空";
                }
            },
                    validate_orderCarCode: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车辆订单编号不能为空";
                }
            },
                    validate_brandId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "品牌id不能为空";
                }
            },
                    validate_brandName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属品牌名称不能为空";
                }
            },
                    validate_seriesId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车系id不能为空";
                }
            },
                    validate_seriesName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属车系名称不能为空";
                }
            },
                    validate_modelId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "型号id不能为空";
                }
            },
                    validate_modelName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属车型名称不能为空";
                }
            },
                    validate_downPayment: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "首付款不能为空";
                }
            },
                    validate_balancePayment: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "尾款不能为空";
                }
            },
                    validate_cashDeposit: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "保证金不能为空";
                }
            },
                    validate_monthlyRent: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "租金不能为空";
                }
            },
                    validate_repaymentMethods: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "租金还款方式（0金融公司，1平台）不能为空";
                }
            },
                    validate_financeCompanyName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "金融公司名称不能为空";
                }
            },
                    validate_chlRebate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "渠道返利不能为空";
                }
            },
                    validate_hasFreeDays: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "免费用车天数（0无，1有）不能为空";
                }
            },
                    validate_freeDays: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "免费天数不能为空";
                }
            },
                    validate_desc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "备注不能为空";
                }
            },
                    validate_status: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "状态不能为空";
                }
            },
                    validate_timeCreate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "创建时间不能为空";
                }
            },
                    validate_timeUpdate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "更新时间不能为空";
                }
            },
                    validate_delect: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "删除状态（0未删除，1已删除）不能为空";
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
