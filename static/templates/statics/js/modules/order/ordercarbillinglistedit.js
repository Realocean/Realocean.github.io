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
        orderCarBillinglist: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.orderCarBillinglist = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.orderCarBillinglist.id == null ? "order/ordercarbillinglist/save" : "order/ordercarbillinglist/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.orderCarBillinglist),
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
                    return "编号不能为空";
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
                    validate_issue: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "账单期号不能为空";
                }
            },
                    validate_paymentType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "还款类型（1、首付款 2、尾款 3、保证金 4、月租不能为空";
                }
            },
                    validate_repaymentDate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "还款日期不能为空";
                }
            },
                    validate_billPeriods: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "账单期数不能为空";
                }
            },
                    validate_repayAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "应还总金额不能为空";
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
