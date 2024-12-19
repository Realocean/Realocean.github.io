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
        orderGrid: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.orderGrid = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.orderGrid.id == null ? "order/ordergrid/save" : "order/ordergrid/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.orderGrid),
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
                    return "发车单编号不能为空";
                }
            },
                    validate_contractId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "合同id不能为空";
                }
            },
                    validate_contractCode: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "合同编号不能为空";
                }
            },
                    validate_orderId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "订单id不能为空";
                }
            },
                    validate_orderCode: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "订单编号不能为空";
                }
            },
                    validate_customerId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "客户id不能为空";
                }
            },
                    validate_customerType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "客户类型；1企业2个人不能为空";
                }
            },
                    validate_customerName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "客户名称不能为空";
                }
            },
                    validate_lessorId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "售卖方id不能为空";
                }
            },
                    validate_lessorName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "售卖方名称不能为空";
                }
            },
                    validate_rentType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "租赁类型：1、长租 2、以租代购 3、展示车 4、试驾车不能为空";
                }
            },
                    validate_paymentMethod: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "付款方式：1、月付 2、两月付 3、季付 4、年付 5、一次性结清不能为空";
                }
            },
                    validate_modelId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "型号id不能为空";
                }
            },
                    validate_modelName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车型名称不能为空";
                }
            },
                    validate_rentCount: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "租赁数量不能为空";
                }
            },
                    validate_gridCount: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "发车单总车辆不能为空";
                }
            },
                    validate_status: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "状态：1、执行中 2、已完成不能为空";
                }
            },
                    validate_operationId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "提交人id不能为空";
                }
            },
                    validate_operationName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "提交人姓名不能为空";
                }
            },
                    validate_desc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "备注不能为空";
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
