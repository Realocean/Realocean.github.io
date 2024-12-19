$(function () {
    detail(window.localStorage.getItem("id"),window.localStorage.getItem("carId"));
    var carId = window.localStorage.getItem("carId");
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        var table = layui.table;
        table.render({
            id: "maintenanceTable",
            elem: '#maintenanceTable',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            url: baseURL + 'maintenancewarn/infoList',
            where: {
                carId: window.localStorage.getItem("carId"),
            },
            cols: [[
                {field: 'serialNo', minWidth: 100, title: '序号',type:'numbers'},
                {field: 'maintenanceNumber', minWidth: 100, title: '保养申请单',templet:function (d) {
                    return isEmpty(d.maintenanceNumber);
                }},
                {
                    field: 'maintenanceStatus', minWidth: 100, title: '状态', templet: function (d) {
                    if (d.maintenanceStatus == 0) {
                        return "无效";
                    } else if (d.maintenanceStatus == 1) {
                        return "有效";
                    }else{
                        return isEmpty(d.maintenanceStatus);
                    }
                }
                },
                {field: 'customerName', minWidth: 100, title: '客户名称',templet:function (d) {
                    return isEmpty(d.customerName);
                }},
                {field: 'carOrderNo', minWidth: 100, title: '发车单号',templet:function (d) {
                    return isEmpty(d.carOrderNo);
                }},
                {
                    field: 'carPurpose', minWidth: 100, title: '车辆用途', templet: function (d) {
                            return isEmpty(d.carPurpose);

                }
                },
                {field: 'currentMile', minWidth: 100, title: '当前公里数',templet:function (d) {
                    return isEmpty(d.currentMile);
                }},
                {field: 'nextMile', minWidth: 100, title: '下次保养公里数',templet:function (d) {
                    return isEmpty(d.nextMile);
                }},
                {field: 'nextDate', minWidth: 100, title: '下次保养时间',templet:function (d) {
                    return isEmpty(d.nextDate);
                }},
                {field: 'serviceSite', minWidth: 100, title: '服务站名称',templet:function (d) {
                    return isEmpty(d.serviceSite);
                }},
                {field: 'maintenanceRemark', minWidth: 100, title: '保养备注',templet:function (d) {
                    return isEmpty(d.maintenanceRemark);
                }},
                {field: 'itemName', minWidth: 100, title: '保养项目',templet:function (d) {
                    return isEmpty(d.itemName);
                }},
                {field: 'maintenanceFee', minWidth: 100, title: '保养项目合计费用',templet:function (d) {
                    return isEmpty(d.maintenanceFee);
                }},
                {minWidth: 100, title: '附件查看',templet:function (d) {
                        return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.maintenanceNumber+"\',\'"+d.maintenanceId+"\')>查看</a>";
                },align: "center"},
                {field: 'operator', minWidth: 100, title: '记录人',templet:function (d) {
                    return isEmpty(d.operator);
                }},
                {field: 'timeCreate', minWidth: 100, title: '记录时间',templet:function (d) {
                    return isEmpty(d.timeCreate);
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
            },
        });

    });

    layui.table.render({
        id: "msg1List",
        elem: '#msg1List',
        url: baseURL + 'maintenance/insurancemanage/queryMsgData',
        where: {'businessId': carId,'businessType':2},
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
            {field:'msgContent', title: '发送内容', minWidth:680,align:'center'},
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
        detailsTabContentList:['保养详情'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '保养记录信息',
            '消息提醒记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '保养记录信息',
        maintenanceData: {},
        maintenanceStatus:null,

    },
    computed:{
        carStatusStr:{
            get:function() {
                switch(this.maintenanceData.carStatus) {
                    case "1": return '整备中';
                    case "2": return '备发车';
                    case "3": return '预定中';
                    case "4": return '用车中';
                    case "5": return '已过户';
                    default:
                        return "";
                }
            }
        },
    },
    methods: {
        reload: function(){

        },
        jumpToOrder: function(data){
            if (data.orderType == 1) {
                $.get(baseURL + "order/order/info/" + data.orderCarId, function (r) {
                    r.order.orderCar.orderCarStatusStr = data.statusStr;
                    var param = {
                        data: r.order
                    };
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
                });
            }else if (data.orderType == 2) {
                $.get(baseURL + "cartransfer/sparecar/info/"+data.orderId, function(r){
                    var index = layer.open({
                        title: "备用车详情",
                        type: 2,
                        content: tabBaseURL + "modules/order/sparecardetail.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.spareCarApply = r.spareCar;
                            iframe.vm.receivablesList = r.spareCar.receivablesList;
                            if(r.spareCar.isApply == 1){
                                iframe.vm.payDayShow = true;
                            }else{
                                iframe.vm.payDayShow = false;
                            }
                            if(r.spareCar.spareCarStatus == 2){
                                iframe.vm.returnCarBtn = true;
                            }else{
                                iframe.vm.returnCarBtn = false;
                            }
                            if(r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3){
                                iframe.vm.returnCarForm = true;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息',
                                    '备用车退车信息'
                                ];
                            }else{
                                iframe.vm.returnCarForm = false;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息'
                                ];
                            }
                            iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                            iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                            iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                            iframe.vm.reloadData();
                            iframe.vm.initOperatorLog(id);
                        },
                        end: function(){
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }
        },
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = this.detailsSupTabContentList[param];
            // if (param === 1) {
            //     this.detailsSupTabContentListActiveValue = '消息记录信息';
            // } else if (param === 0) {
            //     this.detailsSupTabContentListActiveIndex = 0;
            //     this.detailsSupTabContentListActiveValue = '保养记录信息';
            // }
        },
        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },

        cancel: function () {
            layer.closeAll();
        }
        ,
    }
});

// 附件查看
function fileView (maintenanceNumber,maintenanceId) {
    window.localStorage.setItem("objId", maintenanceNumber);
    window.localStorage.setItem("objCode", maintenanceId);
    window.localStorage.setItem("objType", 20);
    var index = layer.open({
        title: "风控预警 > 车辆保养预警 > 查看保养详情 > 附件查看",
        type: 2,
        area: ['850px', '530px'],
        fixed: false, //不固定
        maxmin: true,
        content: tabBaseURL + 'modules/common/viewAccessories.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("objId", null);
            window.localStorage.setItem("objType", null);
            window.localStorage.setItem("objCode", null);
        }
    });
    layer.full(index);
}

function detail(id,carId) {
    $.get(baseURL + "maintenancewarn/info/"+id+"/"+carId, function (r) {
        vm.maintenanceData = r.data;
    });
    console.log("id:{}",id);
    if(id.toString() == "null"){
        vm.maintenanceStatus = "未保养";
    }else{
        vm.maintenanceStatus = "待保养";
    }
}

function showDoc (url, fileName) {
    console.log("查看附件：{}",url,fileName);
    if (viewer != null){
        viewer.close();
        viewer = null;
    }
    viewer = new PhotoViewer([
        {
            src: fileURL+url,
            title: fileName
        }
    ], {
        appendTo:'body',
        zIndex:99891018
    });
}
