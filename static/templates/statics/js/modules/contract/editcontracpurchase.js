$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            keyword: null
        },
        contracpurchase: {}
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.contracpurchase = param.data;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        selectCar: function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/contract/selectcar.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        selectPurchaseSupplier: function () {
            var index = layer.open({
                title: "选择供应商",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/contract/selectpurchasesupplier.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        saveOrUpdate: function (event) {
            var url = vm.contracpurchase.id == null ? "contract/contracpurchase/save" : "contract/contracpurchase/update";
            showloading(true);
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.contracpurchase),
                success: function (r) {
                    showloading(false);
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
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
                return "合同编号不能为空";
            }
        },
        validate_purchaseSupplierId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "供应商id不能为空";
            }
        },
        validate_purchaseSupplierName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "供应商名称不能为空";
            }
        },
        validate_rentType: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "租赁类型：1、长租 2、以租代购 3、直购不能为空";
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
                return "描述不能为空";
            }
        },
        validate_status: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "状态不能为空";
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
        validate_pricePurchase: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "直购单价不能为空";
            }
        },
        validate_timePurchase: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "购买时间不能为空";
            }
        },
        validate_timeRentStart: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "租赁开始时间不能为空";
            }
        },
        validate_timeRentFinish: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "租赁结束时间不能为空";
            }
        },
        validate_priceDownpayment: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "首付不能为空";
            }
        },
        validate_priceMonthlyrent: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "月租不能为空";
            }
        },
        validate_returnmethod: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "还款形式：1、金融公司 2、租赁平台不能为空";
            }
        },
        validate_dueDate: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "还款日不能为空";
            }
        },
        validate_pricePaid: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "已付金额不能为空";
            }
        },
        validate_priceDeposit: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "保证金不能为空";
            }
        },
        validate_paymethod: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "支付方式不能为空";
            }
        },
        validate_timeStart: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "生效时间不能为空";
            }
        },
        validate_timeFinish: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value.length == '') {
                return "结束时间不能为空";
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
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });
    form.on('select(rentType)', function (data) {
        vm.contracpurchase.rentType = data.value;
    });
}

function initClick() {
    $("#closePage").on('click', function () {
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
