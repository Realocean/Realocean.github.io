$(function () {
    detail(window.localStorage.getItem("carOrderNo"));
    var carId = window.localStorage.getItem("carId");
    var leaseType = window.localStorage.getItem("leaseType");
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    if(leaseType == 1){//经租
        layui.use(['form', 'element', 'table', 'soulTable'], function () {
            var soulTable = layui.soulTable;
            var table = layui.table;
            table.render({
                id: "vehicleRentTable",
                elem: '#vehicleRentTable',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
                url: baseURL + 'vehiclerentwarn/detail/list',
                where: {
                    carOrderNo: window.localStorage.getItem("carOrderNo"),
                },
                cols: [[
                    {field: 'carNo', minWidth: 100, title: '车牌号',align:"center",fixed: "left",templet:function (d) {
                        return isEmpty(d.carNo);
                    }},
                    {minWidth: 100,minWidth:100, title: '车辆品牌/车系',templet:function (d) {
                            return d.brandName + "/" +d. seriesName
                        }},
                    {field: 'modelName', minWidth: 100, title: '车型',templet:function (d) {
                            return isEmpty(d.modelName);
                        }},
                    {field: 'vinNo', minWidth: 100, title: '车架号',templet:function (d) {
                            return isEmpty(d.vinNo);
                        }},

                    {field: 'cashDeposit', minWidth: 100, title: '保证金/元',templet:function (d) {
                            return isEmpty(d.cashDeposit);
                        }},
                    {
                        field: 'monthRent', minWidth: 100, title: '租金/元', templet: function (d) {
                            return isEmpty(d.monthRent);
                        }
                    },
                    {field: 'carDesc', minWidth: 100, title: '车辆备注',templet:function (d) {
                            return isEmpty(d.carDesc);
                        }},
                    {field: 'timeDelivery', minWidth: 100, title: '交车时间',templet:function (d) {
                            return isEmpty(d.timeDelivery);
                        }},
                    {field: 'timeReturn', minWidth: 100, title: '还车时间',templet:function (d) {
                            return isEmpty(d.timeReturn);
                        }},
                    {field: 'uncollectedAmount', minWidth: 100, title: '租金欠款金额/元',templet:function (d) {
                            return isEmpty(d.uncollectedAmount);
                        }},
                    {field: 'collectionType', minWidth: 100, title: '欠款类型',templet:function (d) {
                            if(d.collectionType == 0){
                                return "其他";
                            }else if(d.collectionType == 1){
                                return "保证金";
                            }else if(d.collectionType == 2){
                                return "租金";
                            }else if(d.collectionType == 3){
                                return "首付款";
                            }else if(d.collectionType == 4){
                                return "退车结算款";
                            }else if(d.collectionType == 5){
                                return "换车结算款";
                            }else if(d.collectionType == 6){
                                return "备用车结算款";
                            }else if(d.collectionType == 7){
                                return "整备费";
                            }else if(d.collectionType == 8){
                                return "尾款";
                            }else if(d.collectionType == 9){
                                return "定金";
                            }else if(d.collectionType == 10){
                                return "其他费用";
                            }else if(d.collectionType == 11){
                                return "车辆总单价";
                            }else{
                                return isEmpty(d.collectionType);
                            }

                        }},
                ]],
                page: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                autoColumnWidth: {
                    init: true
                },
                done: function (res) {
                    soulTable.render(this);
                    console.log("详情列表：",res.data);
                },
            });

        });
    } else if(leaseType == 2){//以租代购
        layui.use(['form', 'element', 'table', 'soulTable'], function () {
            var soulTable = layui.soulTable;
            var table = layui.table;
            table.render({
                id: "vehicleRentTable",
                elem: '#vehicleRentTable',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
                url: baseURL + 'vehiclerentwarn/detail/list',
                where: {
                    carOrderNo: window.localStorage.getItem("carOrderNo"),
                },
                cols: [[
                    {field: 'carNo', minWidth: 100, title: '车牌号',align:"center",fixed: "left",templet:function (d) {
                        return isEmpty(d.carNo);
                    }},
                    {minWidth: 100,minWidth:100, title: '车辆品牌/车系',templet:function (d) {
                            return d.brandName + "/" +d. seriesName
                        }},
                    {field: 'modelName', minWidth: 100, title: '车型',templet:function (d) {
                            return isEmpty(d.modelName);
                        }},
                    {field: 'vinNo', minWidth: 100, title: '车架号',templet:function (d) {
                            return isEmpty(d.vinNo);
                        }},
                    {field: 'servicingFee', minWidth: 100, title: '整备费/元',templet:function (d) {
                            return isEmpty(d.servicingFee);
                        }},
                    {
                        field: 'monthRent', minWidth: 100, title: '租金/元', templet: function (d) {
                            return isEmpty(d.monthRent);
                        }
                    },
                    {
                        field: 'balancePayment', minWidth: 100, title: '尾款/元', templet: function (d) {
                            return isEmpty(d.balancePayment);
                        }
                    },
                    {field: 'carDesc', minWidth: 100, title: '车辆备注',templet:function (d) {
                            return isEmpty(d.carDesc);
                        }},
                    {field: 'timeDelivery', minWidth: 100, title: '交车时间',templet:function (d) {
                            return isEmpty(d.timeDelivery);
                        }},
                    {field: 'timeReturn', minWidth: 100, title: '还车时间',templet:function (d) {
                            return isEmpty(d.timeReturn);
                        }},
                    {field: 'uncollectedAmount', minWidth: 100, title: '租金欠款金额/元',templet:function (d) {
                            return isEmpty(d.uncollectedAmount);
                        }},
                    {field: 'collectionType', minWidth: 100, title: '欠款类型',templet:function (d) {
                        if(d.collectionType == 0){
                            return "其他";
                        }else if(d.collectionType == 1){
                            return "保证金";
                        }else if(d.collectionType == 2){
                            return "租金";
                        }else if(d.collectionType == 3){
                            return "首付款";
                        }else if(d.collectionType == 4){
                            return "退车结算款";
                        }else if(d.collectionType == 5){
                            return "换车结算款";
                        }else if(d.collectionType == 6){
                            return "备用车结算款";
                        }else if(d.collectionType == 7){
                            return "整备费";
                        }else if(d.collectionType == 8){
                            return "尾款";
                        }else if(d.collectionType == 9){
                            return "定金";
                        }else if(d.collectionType == 10){
                            return "其他费用";
                        }else if(d.collectionType == 11){
                            return "车辆总单价";
                        }else{
                            return isEmpty(d.collectionType);
                        }

                        }},
                ]],
                page: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                autoColumnWidth: {
                    init: true
                },
                done: function (res) {
                    soulTable.render(this);
                    console.log("详情列表：",res.data);
                },
            });

        });
    } else if(leaseType == 3){// 融租
        layui.use(['form', 'element', 'table', 'soulTable'], function () {
            var soulTable = layui.soulTable;
            var table = layui.table;
            table.render({
                id: "vehicleRentTable",
                elem: '#vehicleRentTable',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
                url: baseURL + 'vehiclerentwarn/detail/list',
                where: {
                    carOrderNo: window.localStorage.getItem("carOrderNo"),
                },
                cols: [[
                    {field: 'carNo', minWidth: 100, title: '车牌号',align:"center",fixed: "left",templet:function (d) {
                        return isEmpty(d.carNo);
                    }},
                    {minWidth: 100,minWidth:100, title: '车辆品牌/车系',templet:function (d) {
                            return d.brandName + "/" +d. seriesName
                        }},
                    {field: 'modelName', minWidth: 100, title: '车型',templet:function (d) {
                            return isEmpty(d.modelName);
                        }},
                    {field: 'vinNo', minWidth: 100, title: '车架号',templet:function (d) {
                            return isEmpty(d.vinNo);
                        }},
                    {field: 'downPayment', minWidth: 100, title: '首付款/元',templet:function (d) {
                            return isEmpty(d.downPayment);
                        }},
                    {
                        field: 'monthRent', minWidth: 100, title: '租金/元', templet: function (d) {
                            return isEmpty(d.monthRent);
                        }
                    },
                    {
                        field: 'balancePayment', minWidth: 100, title: '尾款/元', templet: function (d) {
                            return isEmpty(d.balancePayment);
                        }
                    },
                    {field: 'carDesc', minWidth: 100, title: '车辆备注',templet:function (d) {
                            return isEmpty(d.carDesc);
                        }},
                    {field: 'timeDelivery', minWidth: 100, title: '交车时间',templet:function (d) {
                            return isEmpty(d.timeDelivery);
                        }},
                    {field: 'timeReturn', minWidth: 100, title: '还车时间',templet:function (d) {
                            return isEmpty(d.timeReturn);
                        }},
                    {field: 'uncollectedAmount', minWidth: 100, title: '租金欠款金额/元',templet:function (d) {
                            return isEmpty(d.uncollectedAmount);
                        }},
                    {field: 'collectionType', minWidth: 100, title: '欠款类型',templet:function (d) {
                        if(d.collectionType == 0){
                            return "其他";
                        }else if(d.collectionType == 1){
                            return "保证金";
                        }else if(d.collectionType == 2){
                            return "租金";
                        }else if(d.collectionType == 3){
                            return "首付款";
                        }else if(d.collectionType == 4){
                            return "退车结算款";
                        }else if(d.collectionType == 5){
                            return "换车结算款";
                        }else if(d.collectionType == 6){
                            return "备用车结算款";
                        }else if(d.collectionType == 7){
                            return "整备费";
                        }else if(d.collectionType == 8){
                            return "尾款";
                        }else if(d.collectionType == 9){
                            return "定金";
                        }else if(d.collectionType == 10){
                            return "其他费用";
                        }else if(d.collectionType == 11){
                            return "车辆总单价";
                        }else{
                            return isEmpty(d.collectionType);
                        }
                        }},
                ]],
                page: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                autoColumnWidth: {
                    init: true
                },
                done: function (res) {
                    soulTable.render(this);
                    console.log("详情列表：",res.data);
                },
            });

        });
    } else {//其他
        layui.use(['form', 'element', 'table', 'soulTable'], function () {
            var soulTable = layui.soulTable;
            var table = layui.table;
            table.render({
                id: "vehicleRentTable",
                elem: '#vehicleRentTable',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
                url: baseURL + 'vehiclerentwarn/detail/list',
                where: {
                    carOrderNo: window.localStorage.getItem("carOrderNo"),
                },
                cols: [[
                    {field: 'carNo', minWidth: 100, title: '车牌号',align:"center",fixed: "left",templet:function (d) {
                        return isEmpty(d.carNo);
                    }},
                    {minWidth: 100,minWidth:100, title: '车辆品牌/车系',templet:function (d) {
                            return d.brandName + "/" +d. seriesName
                        }},
                    {field: 'modelName', minWidth: 100, title: '车型',templet:function (d) {
                            return isEmpty(d.modelName);
                        }},
                    {field: 'vinNo', minWidth: 100, title: '车架号',templet:function (d) {
                            return isEmpty(d.vinNo);
                        }},
                    {field: 'cashDeposit', minWidth: 100, title: '保证金/元',templet:function (d) {
                            return isEmpty(d.cashDeposit);
                        }},
                    {
                        field: 'monthRent', minWidth: 100, title: '租金/元', templet: function (d) {
                            return isEmpty(d.monthRent);
                        }
                    },
                    {field: 'carDesc', minWidth: 100, title: '车辆备注',templet:function (d) {
                            return isEmpty(d.carDesc);
                        }},
                    {field: 'timeDelivery', minWidth: 100, title: '交车时间',templet:function (d) {
                            return isEmpty(d.timeDelivery);
                        }},
                    {field: 'timeReturn', minWidth: 100, title: '还车时间',templet:function (d) {
                            return isEmpty(d.timeReturn);
                        }},
                    {field: 'uncollectedAmount', minWidth: 100, title: '租金欠款金额/元',templet:function (d) {
                            return isEmpty(d.uncollectedAmount);
                        }},
                    {field: 'collectionType', minWidth: 100, title: '欠款类型',templet:function (d) {
                            if(d.collectionType == 0){
                                return "其他";
                            }else if(d.collectionType == 1){
                                return "保证金";
                            }else if(d.collectionType == 2){
                                return "租金";
                            }else if(d.collectionType == 3){
                                return "首付款";
                            }else if(d.collectionType == 4){
                                return "退车结算款";
                            }else if(d.collectionType == 5){
                                return "换车结算款";
                            }else if(d.collectionType == 6){
                                return "备用车结算款";
                            }else{
                                return isEmpty(d.collectionType);
                            }
                        }},
                ]],
                page: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                autoColumnWidth: {
                    init: true
                },
                done: function (res) {
                    soulTable.render(this);
                    console.log("详情列表：",res.data);
                },
            });

        });
    }



    layui.table.render({
        id: "msg1List",
        elem: '#msg1List',
        url: baseURL + 'maintenance/insurancemanage/queryMsgData',
        where: {'businessId': carId,'businessType':4},
        cols: [[
            {field:'createTime', title: '消息发送时间', minWidth:125,align:'center'},
            {field:'currentStatus', title: '消息状态', minWidth:100,align:'center',templet:function (d) {
                    if(d.currentStatus!=null && d.currentStatus!=""){
                        if(d.currentStatus == '0'){
                            return "未读";
                        } else if(d.currentStatus == '1'){
                            return "已读";
                        } else {
                            return "--";
                        }
                    }else {
                        return "--";
                    }
                }},
            {field:'msgContent', title: '发送内容', minWidth:700,align:'center'},
            {field:'createUserName', title: '发送者', minWidth:150,align:'center'},
            {field:'receiverName', title: '接收人', minWidth:150,align:'center'},
            {field:'msgType', title: '消息类型', minWidth:100,align:'center',templet:function (d) {
                    if(d.msgType!=null && d.msgType!=""){
                        if(d.msgType == '1'){
                            return "短信通知";
                        } else if(d.msgType == '2'){
                            return "站内信";
                        } else {
                            return "--";
                        }
                    }else {
                        return "--";
                    }
                }},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
});
var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {
        // detailsTabContentList: ['保养记录信息', '消息提醒记录'],
/*        detailsTabContentList:['租金详情'],
        detailsSupTabContentListActiveValue: '租金记录信息',
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,*/
        detailsTabContentList: ['租金详情'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '租金记录信息',
            '消息提醒记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '租金记录信息',
        vehiclerentwarn: {}

    },
    methods: {
        // newMethods

        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = this.detailsSupTabContentList[param];
            // if (param === 1) {
            //     this.detailsSupTabContentListActiveValue = '消息记录信息';
            // } else if (param === 0) {
            //     this.detailsSupTabContentListActiveIndex = 0;
            //     this.detailsSupTabContentListActiveValue = '租金记录信息';
            // }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;

        },
        // newMethods   ENd
        cancel: function () {
            layer.closeAll();
        }
        ,
    }
});

function detail(carOrderNo) {
    $.get(baseURL + "vehiclerentwarn/detail/" + carOrderNo, function (r) {
        vm.vehiclerentwarn = r.data;
        console.log("详情记录：",vm.vehiclerentwarn);
    });
}
