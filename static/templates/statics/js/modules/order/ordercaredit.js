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
        orderCar: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.orderCar = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.orderCar.id == null ? "order/ordercar/save" : "order/ordercar/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.orderCar),
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
                    return "车辆订单编号不能为空";
                }
            },
                    validate_orderId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "订单id不能为空";
                }
            },
                    validate_carId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车辆id不能为空";
                }
            },
                    validate_carNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车牌号不能为空";
                }
            },
                    validate_vinNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车架号不能为空";
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
                    validate_deptId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属部门id不能为空";
                }
            },
                    validate_deptName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属部门名称不能为空";
                }
            },
                    validate_depotId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属仓库id不能为空";
                }
            },
                    validate_depotName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属仓库名称不能为空";
                }
            },
                    validate_cityId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属城市id不能为空";
                }
            },
                    validate_cityName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "所属城市名称不能为空";
                }
            },
                    validate_mileage: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "里程数不能为空";
                }
            },
                    validate_electricQuantity: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "电量不能为空";
                }
            },
                    validate_accessoryItems: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "随车物品不能为空";
                }
            },
                    validate_carDesc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车辆备注不能为空";
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
                    validate_insuranceItems: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车辆已购保险不能为空";
                }
            },
                    validate_paymentDay: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "付款日不能为空";
                }
            },
                    validate_channelId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "渠道商id不能为空";
                }
            },
                    validate_channelName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "渠道商名称不能为空";
                }
            },
                    validate_timeStartRent: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "租赁开始时间不能为空";
                }
            },
                    validate_timeFinishRent: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "租赁结束时间不能为空";
                }
            },
                    validate_tenancy: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "租期不能为空";
                }
            },
                    validate_orderDesc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "车辆订单备注不能为空";
                }
            },
                    validate_deliveryOperationId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "交车工作人员id不能为空";
                }
            },
                    validate_deliveryOperationName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "交车工作人员姓名不能为空";
                }
            },
                    validate_deliveryMileage: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "交车里程数不能为空";
                }
            },
                    validate_mileageNextMaintenance: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "下次保养里程数不能为空";
                }
            },
                    validate_mileageNextDate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "下次保养里程数不能为空";
                }
            },
                    validate_deliveryDesc: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "交车备注不能为空";
                }
            },
                    validate_timeDelivery: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "交车时间不能为空";
                }
            },
                    validate_timeReturn: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "还车时间不能为空";
                }
            },
                    validate_swappedOrderCarId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "被交换的订单id不能为空";
                }
            },
                    validate_swopOrderCarId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "交换的订单id不能为空";
                }
            },
                    validate_status: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value.length == '') {
                    return "状态：0、待交车 1、用车中 2、换车中 3、换车中-待交车 4、已换车-待交车 5、已换车 6、退车中 7、已退车不能为空";
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
