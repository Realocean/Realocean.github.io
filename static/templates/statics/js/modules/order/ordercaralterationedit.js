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
        orderCarAlteration: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.orderCarAlteration = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.orderCarAlteration.id == null ? "order/ordercaralteration/save" : "order/ordercaralteration/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.orderCarAlteration),
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
                    validate_alterationType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "退换车类别（1、退车 2、换车）不能为空";
                }
            },
                    validate_timeApply: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "退换车时间不能为空";
                }
            },
                    validate_alterationMileage: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "退车里程数不能为空";
                }
            },
                    validate_alterationDesc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "退换车原因不能为空";
                }
            },
                    validate_returnType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "退车类别（1、租赁到期 2、违约退车 3、强制收车 4、其他不能为空";
                }
            },
                    validate_repayType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "退车类别（0、应收 1、应退不能为空";
                }
            },
                    validate_repayAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "补缴或退还金额不能为空";
                }
            },
                    validate_feeDesc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "费用说明不能为空";
                }
            },
                    validate_desc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "备注不能为空";
                }
            },
                    validate_status: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "状态（0、已提交 1、通过 2、不通过）不能为空";
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
