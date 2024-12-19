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
        detailsTabContentList: [
                            '企业合同',
                            '操作记录',
                    ],
        detailsSupTabContentList: [
                            '基础信息',
                            '车型信息',
                            '车辆订单',
                            '操作记录',
                    ],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        contracbusiness: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.contracbusiness = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[index];
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
        tableFiledSkipOtherView: function (view) {
            var obj = view[0];
            var action = obj.className.trim();
            var id = obj.attributes['obj-id'].value.trim();
            var no = obj.attributes['obj-no'].value.trim();
            var instanceId = obj.attributes['obj-instanceId'].value.trim();
            var processKey = obj.attributes['obj-processKey'].value.trim();
            console.log(action +','+ id +','+ no + ',' + instanceId + ',' +processKey);
            //.carDetail,.contractDetail,.orderDetail,.customerDetail,.spareOrder
            switch (action) {
                case 'carDetail':{
                    vm.carDetailView(id, no);
                    break;
                }
                case 'orderDetail':{
                    vm.orderDetailView(id, no, instanceId, processKey);
                    break;
                }
                case 'customerDetail':{
                    vm.customerDetailView(id, no);
                    break;
                }
            }
        },
        carDetailView: function (id, no) {
            var index = layer.open({
                title: "车辆详情",
                type: 2,
                content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.initEditData(id);
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        orderDetailView: function (id, no, instanceId, processKey) {
            var param = {
                instanceId: instanceId,
                processKey: processKey,
                id: id
            };
            console.log(param);
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/orderview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        customerDetailView: function (id, no) {
            localStorage.setItem("id", id);
            var title = "客户信息";
            var index = layer.open({
                title: title,
                type: 2,
                boxParams: {
                    data: {
                        customerCategory:2
                    }
                },
                content: tabBaseURL + 'modules/customer/customerdetail.html',
                shade: false,
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initUpload(upload) {
    Upload({
        elid: 'contractFileLst',
        edit: false,
        fileLst: vm.contracbusiness.contractFileLst,
        param: {'path':'contract-contract'},
        fidedesc: '合同附件'
    }).initView();
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[0];
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $(document).on('click', '.carDetail,.orderDetail,.customerDetail,.spareOrder', function () {
        vm.tableFiledSkipOtherView($(this));
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.contracbusiness.id,
            auditType: 74
        },
        cols: [[
            {field:'operatorName', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    table.render({
        id: "plantableid",
        elem: '#planTable',
        cellMinWidth: 170,
        url: baseURL + 'contract/contracbusinessplan/queryList',
        where: {
            contractId: vm.contracbusiness.id,
        },
        cols: [[
            {field:'planNo', width: 212, title: '编号', templet: function (d) {return isEmpty(d.planNo);}},
            {field:'brandName', title: '品牌', templet: function (d) {return isEmpty(d.brandName);}},
            {field:'seriesName', title: '车系', templet: function (d) {return isEmpty(d.seriesName);}},
            {field:'modelName', title: '车型', templet: function (d) {return isEmpty(d.modelName);}},
            {field:'countSigned', title: '签约数量', templet: function (d) {return isEmpty(d.countSigned);}},
            {field:'downPayment', title: '首付款（含税，元/辆）', templet: function (d) {return isEmpty(d.downPayment);}},
            {field:'cashDeposit', title: '保证金（含税，元/辆）', templet: function (d) {return isEmpty(d.cashDeposit);}},
            {field:'servicingFee', title: '整备费（含税，元/辆）', templet: function (d) {return isEmpty(d.servicingFee);}},
            {field:'totalPrice', title: '车辆总单价（含税，元/辆）', templet: function (d) {return isEmpty(d.totalPrice);}},
            {field:'monthlyRent1', title: '月租金（含税，元/辆）', templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'monthlyRent2', title: '挂靠费（含税，元/辆）', templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'coverCharge', title: '服务费（含税，元/辆）', templet: function (d) {return isEmpty(d.coverCharge);}},
            {field:'balancePayment', title: '尾款（含税，元/辆）', templet: function (d) {return isEmpty(d.balancePayment);}},
            {field:'tenancy', title: '租期', templet: function (d) {return isEmpty(d.tenancy);}},
            {field:'paymentMethod', title: '付款方式', templet: function (d) {return getPaymentMethodStr(d.paymentMethod);}},
        ]],
        page: true,
        loading: true,
        limits: [5, 10, 20, 50],
        limit: 5,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            onRentChangedTableView(vm.contracbusiness.rentType);
        }
    });

    table.render({
        id: "orderTableid",
        elem: '#orderTable',
        url: baseURL + 'order/order/queryPagenew/0',
        where: {
            statusType: 0,
            orderType: 2,
            contractorderCode: vm.contracbusiness.contractNo,
        },
        cols: [[
            {field: 'carNo', title: '车牌号',minWidth: 200, templet: function (d) {return isEmpty(d.carNo);}},
            {field: 'vinNo', title: '车架号', minWidth: 200, templet: function (d) {return isEmpty(d.vinNo);}},
            {field: 'modelNames', title: '品牌/车系/车型', minWidth: 200, templet: function (d) {return isEmpty(d.modelNames);}},
            {field: 'orderCarCode', title: '车辆订单号', minWidth: 200, templet: function (d) {return isEmpty(d.orderCarCode);}},
            {field: 'rentType', title: '订单类型', minWidth: 200, templet: function (d) {return getRentTypeStr(d.rentType);}},
            {field: 'statusStr', title: '订单状态', minWidth: 200, templet: function (d) {return isEmpty(d.statusStr);}},
            {field: 'orderCarExplain', title: '订单说明', minWidth: 200, templet: function (d) {return isEmpty(d.orderCarExplain);}},
            {field: 'lessorName', title: '出租方', minWidth: 200, templet: function (d) {return isEmpty(d.lessorName);}},
            {field: 'customerName', title: '承租方', minWidth: 200, templet: function (d) {return isEmpty(d.customerName);}},
            {field: 'contractTenancy', title: '合同租期', minWidth: 200, templet: function (d) {return isEmpty(d.contractTenancy);}},
            {field: 'timeStartRent', title: '租赁开始日', minWidth: 200, templet: function (d) {return isEmpty(d.timeStartRent);}},
            {field: 'timeFinishRent', title: '租赁结束日', minWidth: 200, templet: function (d) {return isEmpty(d.timeFinishRent);}},
            {field: 'timeDelivery', title: '交车时间', minWidth: 200, templet: function (d) {return isEmpty(d.timeDelivery);}},
        ]],
        page: true,
        loading: true,
        limits: [5, 10, 20, 50],
        limit: 5,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

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
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}

function onRentChangedTableView(rentType) {
    var ragex;
    switch (rentType^0) {
        case 3://展示车
        case 4://试驾车
        case 1:{//经租
            ragex = /(downPayment|balancePayment|servicingFee|totalPrice|monthlyRent2)/;
            break;
        }
        case 2:{//以租代购
            ragex = /(downPayment|cashDeposit|totalPrice|monthlyRent2)/;
            break;
        }
        case 5:{//融租
            ragex = /(cashDeposit|servicingFee|totalPrice|monthlyRent2|coverCharge)/;
            break;
        }
        case 6:{//直购
            ragex = /(downPayment|balancePayment|cashDeposit|servicingFee|monthlyRent1|monthlyRent2|coverCharge|tenancy|paymentMethod)/;
            break;
        }
        case 7:{//挂靠
            ragex = /(downPayment|balancePayment|cashDeposit|servicingFee|totalPrice|monthlyRent1|coverCharge)/;
            break;
        }
        default:ragex = /(downPayment|balancePayment|cashDeposit|servicingFee|totalPrice|monthlyRent1|monthlyRent2|coverCharge|tenancy|paymentMethod)/;
    }
    $('th').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
    $('td').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
}