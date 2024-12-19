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
            contractCode: null,
            deptId: '',
            novin: null,
            seriesId: '',
            orderCarCode: null,
            memberName: null,
            orderCarStatus: '',
            rentType: '',
            timeStartRent: null,
            timeStartRentstart: null,
            timeStartRentend: null,
            timeFinishRent: null,
            timeFinishRentstart: null,
            timeFinishRentend: null,
            timeReturn: null,
            timeReturnstart: null,
            timeReturnend: null,
            operationId: ''
        },
        deptList: [],
        brandSeriesList: [],
        usrList: []
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/dept/listAll", function(r){
            _this.deptList = r.deptList;
        });
        $.get(baseURL + "report/rderReceivableReport/brandSeriesList", function(r){
            _this.brandSeriesList = r.brandSeriesList;
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrList = r.usrLst;
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (orderCarId) {
            var param = {
                data: orderCarId
            };
            var index = layer.open({
                title: "月度明细应收回收报表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/report/orderReceivableReportview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'report/rderReceivableReport/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }
});

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '车牌号/车架号', placeholder: '请输入车牌号/车架号', fieldName: 'novin'},
            {type: 'text', label: '发车单号', placeholder: '请输入发车单号', fieldName: 'orderCarCode'},
            {type: 'select', label: '订单车辆状态', fieldName: 'orderCarStatus', selectMap: {
                    100:'提单中',
                    200:'用车中',
                    300:'换车中',
                    400:'已换车',
                    500:'退车中',
                    600:'已退车',
                    700:'已过户',
                    800:'已出售',
                    900:'已续租',
                    901:'续租时间未开始',
                },
            },
            {type: 'text', label: '合同编号', placeholder: '请输入合同编号', fieldName: 'contractCode', selectFilter: true},
            {type: 'select', label: '所属公司/部门', fieldName: 'deptId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: vm.deptList, selectFilter: true},
            {type: 'select', label: '品牌/车系', fieldName: 'seriesId', selectListValueName: 'seriesId', selectListTxtName: 'name', selectList: vm.brandSeriesList, selectFilter: true},
            {type: 'text', label: '用户名称', placeholder: '请输入用户名称', fieldName: 'memberName', selectFilter: true},
            {type: 'select', label: '租赁类型', fieldName: 'rentType', selectMap: orderRentTypeMap, selectFilter: true},
            {type: 'select', label: '所属业务员', fieldName: 'operationId', selectListValueName: 'userId', selectListTxtName: 'username', selectList: vm.usrList, selectFilter: true},
            {type: 'date', label: '租赁开始时间', placeholder: '租赁开始时间范围', fieldName: 'timeStartRent', selectFilter: true},
            {type: 'date', label: '租赁结束时间', placeholder: '租赁结束时间范围', fieldName: 'timeFinishRent', selectFilter: true},
            {type: 'date', label: '实际结束时间', placeholder: '实际结束时间范围', fieldName: 'timeReturn', selectFilter: true}
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exports();
                    break;
                }
            }
        }
    }).initView();
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
}

function initClick() {

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'report/rderReceivableReport/queryList',
        cols: [
            [
                {title: '查看月度明细', rowspan: 2, width:120, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carNo', rowspan: 2, align:'center', title: '车牌号',fixed: "left", minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
                {field:'companyName', rowspan: 2, align:'center', title: '所属公司', minWidth:200, templet: function (d) {return isEmpty(d.companyName);}},
                {field:'contractCode', rowspan: 2, align:'center', title: '合同编号', minWidth:200, templet: function (d) {return isEmpty(d.contractCode);}},
                {field:'orderCarCode', rowspan: 2, align:'center', title: '车辆订单号', minWidth:200, templet: function (d) {return isEmpty(d.orderCarCode);}},
                {field:'memberName', rowspan: 2, align:'center', title: '用户名称', minWidth:200, templet: function (d) {return isEmpty(d.memberName);}},
                {field:'memberTypeStr', rowspan: 2, align:'center', title: '用户类型', minWidth:200, templet: function (d) {return isEmpty(d.memberTypeStr);}},
                {field:'orderCarStatusStr', rowspan: 2, align:'center', title: '订单车辆状态', minWidth:200, templet: function (d) {return isEmpty(d.orderCarStatusStr);}},
                {field:'vinNo', rowspan: 2, align:'center', title: '车架号', minWidth:200, templet: function (d) {return isEmpty(d.vinNo);}},
                {field:'brandSeriesName', rowspan: 2, align:'center', title: '品牌/车系', minWidth:200, templet: function (d) {return isEmpty(d.brandSeriesName);}},
                {field:'modelName', rowspan: 2, align:'center', title: '车型', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
                {field:'rentTypeStr', rowspan: 2, align:'center', title: '租赁类型', minWidth:200, templet: function (d) {return isEmpty(d.rentTypeStr);}},
                {field:'paymentMethodStr', rowspan: 2, align:'center', title: '付款方式', minWidth:200, templet: function (d) {return isEmpty(d.paymentMethodStr);}},
                {field:'timeStartRent', rowspan: 2, align:'center', title: '租赁开始时间', minWidth:200, templet: function (d) {return isEmpty(d.timeStartRent);}},
                {field:'timeFinishRent', rowspan: 2, align:'center', title: '租赁结束时间', minWidth:200, templet: function (d) {return isEmpty(d.timeFinishRent);}},
                {field:'timeReturn', rowspan: 2, align:'center', title: '实际结束时间', minWidth:200, templet: function (d) {return isEmpty(d.timeReturn);}},
                {field:'orderCashDeposit', rowspan: 2, align:'center', title: '保证金', minWidth:200, templet: function (d) {return isEmpty(d.orderCashDeposit);}},
                {field:'orderDownPayment', rowspan: 2, align:'center', title: '首付款', minWidth:200, templet: function (d) {return isEmpty(d.orderDownPayment);}},
                {field:'orderMonthlyRent', rowspan: 2, align:'center', title: '租金', minWidth:200, templet: function (d) {return isEmpty(d.orderMonthlyRent);}},
                {field:'operationName', rowspan: 2, align:'center', title: '所属业务', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
                {colspan: 5, align:'center', title: '应收金额'},
                {colspan: 5, align:'center', title: '实际已收金额'},
                {field:'uncollectedCashDeposit', rowspan: 2, align:'center', title: '保证金欠款金额', minWidth:200, templet: function (d) {return isEmpty(d.uncollectedCashDeposit);}},
                {field:'uncollectedDownPayment', rowspan: 2, align:'center', title: '首付款欠款金额', minWidth:200, templet: function (d) {return isEmpty(d.uncollectedDownPayment);}},
                {field:'uncollectedMonthlyRent', rowspan: 2, align:'center', title: '租金欠款金额', minWidth:200, templet: function (d) {return isEmpty(d.uncollectedMonthlyRent);}},
                {field:'uncollectedOther', rowspan: 2, align:'center', title: '其他欠款金额', minWidth:200, templet: function (d) {return isEmpty(d.uncollectedOther);}},
                {field:'uncollectedTotle', rowspan: 2, align:'center', title: '未收总金额', minWidth:200, templet: function (d) {return isEmpty(d.uncollectedTotle);}}
            ],
            [
                {field:'receivableCashDeposit', align:'center', title: '保证金', minWidth:200, templet: function (d) {return isEmpty(d.receivableCashDeposit);}},
                {field:'receivableDownPayment', align:'center', title: '首付款', minWidth:200, templet: function (d) {return isEmpty(d.receivableDownPayment);}},
                {field:'receivableMonthlyRent', align:'center', title: '总租金', minWidth:200, templet: function (d) {return isEmpty(d.receivableMonthlyRent);}},
                {field:'receivableOther', align:'center', title: '其他费用', minWidth:200, templet: function (d) {return isEmpty(d.receivableOther);}},
                {field:'receivableTotle', align:'center', title: '总计', minWidth:200, templet: function (d) {return isEmpty(d.receivableTotle);}},
                {field:'receivedCashDeposit', align:'center', title: '保证金', minWidth:200, templet: function (d) {return isEmpty(d.receivedCashDeposit);}},
                {field:'receivedDownPayment', align:'center', title: '首付款', minWidth:200, templet: function (d) {return isEmpty(d.receivedDownPayment);}},
                {field:'receivedMonthlyRent', align:'center', title: '总租金', minWidth:200, templet: function (d) {return isEmpty(d.receivedMonthlyRent);}},
                {field:'receivedOther', align:'center', title: '其他费用', minWidth:200, templet: function (d) {return isEmpty(d.receivedOther);}},
                {field:'receivedTotle', align:'center', title: '总计', minWidth:200, templet: function (d) {return isEmpty(d.receivedTotle);}}
            ]
        ],
        page: true,
        loading: true,
        limits: [10, 20, 30, 50],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
            var box = $('div[lay-id="gridid"]>div.layui-table-box');
            box.find('div>table').addClass('table-empty-left');
            var fixed_header = box.find('div.layui-table-fixed>div.layui-table-header');
            var outerHeight = box.find('div.layui-table-header').outerHeight(true);
            fixed_header.css('height', outerHeight + '');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'view'){
            vm.view(data.orderCarId);
        }
    });
}

function initDate(laydate) {
}
