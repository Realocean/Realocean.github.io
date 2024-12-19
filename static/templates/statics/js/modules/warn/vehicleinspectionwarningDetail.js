$(function () {
    vm.detail(window.localStorage.getItem("carId"));
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
            id: "vehicleinspectionwarningTableId",
            elem: '#vehicleinspectionwarningTable',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            cols: [[
                {field: 'serialNo', minWidth: 100, title: '序号',type:'numbers'},
                {field: 'inspectionNumber', minWidth: 100, title: '年检申请单'},
                {field: 'inspectionStatus', minWidth: 100, title: '状态',templet:function (d) {
                        if(d.inspectionStatus == 1){
                            return "已年检";
                        }else if(d.inspectionStatus == 0){
                            return "<span style='color:red;'>待年检</span>";
                        }
                    }},
                {field: 'customerName', minWidth: 100, title: '客户名称',templet:function (d) {
                        return isEmpty(d.customerName);
                    }},
                {field: 'carOrderNo', minWidth: 100, title: '发车单号',templet:function (d) {
                        if(d.carOrderNo!=null && d.carOrderNo!=""){
                            return "<span style='color:blue;'>"+d.carOrderNo+"</span>";
                        }else {
                            return "--";
                        }
                    }},
                {
                    field: 'carPurposeStr', minWidth: 100, title: '车辆用途', templet: function (d) {
                        return isEmpty(d.carPurposeStr);
                    }
                },

                {field: 'thisTimeInspectionTime', minWidth: 100, title: '本次年检时间',templet:function (d) {
                        return isEmpty(d.thisTimeInspectionTime);
                    }},
                {field: 'nextInspectionTime', minWidth: 100, title: '下次年检时间',templet:function (d) {
                        return isEmpty(d.nextInspectionTime);
                    }},
                {field: 'inspectionYear', minWidth: 100, title: '年审年份',templet:function (d) {
                        return isEmpty(d.inspectionYear);
                    }},
                {field: 'inspectionAmount', minWidth: 100, title: '年检费用',templet:function (d) {
                        return isEmpty(d.inspectionAmount);
                    }},
                {field: 'inspectionAgent', minWidth: 100, title: '年审代理人',templet:function (d) {
                        return isEmpty(d.inspectionAgent);
                    }},
                {field: 'remark', minWidth: 100, title: '备注',templet:function (d) {
                        return isEmpty(d.remark);
                    }},
                {minWidth: 100,align: "center" ,title: '年检附件',templet:function (d) {
                        return "<span style='color:#419BEA;cursor:pointer;' onclick=viewAccessory(\'"+d.inspectionId+"\',\'"+d.inspectionNumber+"\')>查看</span>";
                    }},
                {field: 'operator', minWidth: 100, title: '记录人',templet:function (d) {
                        return isEmpty(d.operator);
                    }},
                {field: 'operationTime', minWidth: 100, title: '记录时间',templet:function (d) {
                        return isEmpty(d.operationTime);
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
        where: {'businessId': carId,'businessType':6},
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
        detailsTabContentList:['年检详情'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '年检记录信息',
            '消息提醒记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '年检记录信息',
        vehicleInspectionwarningRecord:{},
        vehicleInspectionwarningRecordList:[],
    },
    methods: {
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = this.detailsSupTabContentList[param];
            // if (param === 1) {
            //     this.detailsSupTabContentListActiveValue = '消息记录信息';
            // } else if (param === 0) {
            //     this.detailsSupTabContentListActiveIndex = 0;
            //     this.detailsSupTabContentListActiveValue = '年检记录信息';
            // }
        },
        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },
        // newMethods   ENd
        cancel: function () {
            layer.closeAll();
        },
        cancelFun:function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        detail:function (carId) {

            $.ajax({
                type: "post",
                url: baseURL + "vehicleInspectionwarning/info/" + carId,
                contentType: "application/json",
                success: function(res){
                    vm.vehicleInspectionwarningRecord = res.map.vehicleInspectionwarningVO;
                    if(vm.vehicleInspectionwarningRecord==null){
                        vm.vehicleInspectionwarningRecord = Object.assign({}, vm.vehicleInspectionwarningRecord, {inspectionStatusStr:"未年检" });
                    }
                    vm.vehicleInspectionwarningRecordList = res.map.voList;
                    layui.table.reload('vehicleinspectionwarningTableId', {
                        data:vm.vehicleInspectionwarningRecordList
                    })
                },
            });
        }
    }
});


/*function  checkFJ(inspectionId){
    window.localStorage.setItem("objId",inspectionId);
    window.localStorage.setItem("objType", 7);
    var index = layer.open({
        title: "年检详情>附件详情",
        type: 2,
        area: ['850px', '530px'],
        fixed: false, //不固定
        maxmin: true,
        content: tabBaseURL + 'modules/outinsuranceorder/outinsuranceorderenclosure.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("objId", null);
        }
    });
    layer.full(index);
}*/

function viewAccessory(inspectionId,inspectionNumber){
    window.localStorage.setItem("objType", 7);
    window.localStorage.setItem("objId", inspectionId);
    window.localStorage.setItem("objCode", inspectionNumber);
    var index = layer.open({
        title: "风控预警 > 车辆年检预警 > 查看年检 > 附件查看",
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

