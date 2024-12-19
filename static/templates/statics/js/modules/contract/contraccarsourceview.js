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
                            '合同详情',
                            '操作记录',
                    ],
        detailsSupTabContentList: [
                            '合同信息',
                            '车辆订单信息',
                            '操作记录',
                    ],
        fileLst: [],
        fileLstId: '0',
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        contraccarSource: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.contraccarSource = param.data;
        if (_this.contraccarSource.fileLst != null){
            _this.fileLst = _this.contraccarSource.fileLst;
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[index];
            // if (index == 0){
            //     vm.detailsSupTabContentListActiveIndex = index;
            // }else{
            //     vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
            // }
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
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
}

function initTable(table, soulTable) {
    table.render({
        id: "carOrderInfoid",
        elem: '#carOrderInfo',
     // defaultToolbar: ['filter'],
        url: baseURL + 'car/tcarbasic/orderCarContract',
        where: {
            businessNo: vm.contraccarSource.id
        },
        cols: [[
            {field:'carNo', title: '车牌号',align:"center", minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
            {field:'vinNo',align:"center", title: '车架号', minWidth:200, templet: function (d) {return isEmpty(d.vinNo);}},
            {field:'rentType',align:"center", title: '租赁类型', minWidth:200, templet: function (d) {return isEmpty(d.rentType);}},
            {field:'brandModelName',align:"center", title: '品牌/车系/车型', minWidth:200, templet: function (d) {return isEmpty(d.brandModelName);}},
            {field:'customer',align:"center", title: '客户名称', minWidth:200, templet: function (d) {return isEmpty(d.customer);}},
            {field:'status',align:"center", title: '车辆订单状态', minWidth:200, templet: function (d) {return isEmpty(d.status);}},
            {field:'rentStart',align:"center", title: '租赁开始时间', minWidth:200, templet: function (d) {return isEmpty(d.rentStart);}},
            {field:'rentFinish',align:"center", title: '租赁结束时间', minWidth:200, templet: function (d) {return isEmpty(d.rentFinish);}},
            {field:'handleCar',align:"center", title: '提车时间', minWidth:200, templet: function (d) {return isEmpty(d.handleCar);}},
            {field:'returnCar',align:"center", title: '实际还车时间', minWidth:200, templet: function (d) {return isEmpty(d.returnCar);}}
        ]],
        page: false,
        limit: 500,
        loading: true,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
     // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.contraccarSource.id,
            auditType: 27
        },
        cols: [[
            {field:'operatorName',align:"center", title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo',align:"center", title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate',align:"center", title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
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
    parent.vm.reload();
    parent.layer.close(index);
}
