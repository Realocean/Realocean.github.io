$(function () {
    vm.detail(window.localStorage.getItem("jqxId"),window.localStorage.getItem("syxId"), window.localStorage.getItem("carId"));
    var policyApplyNo = window.localStorage.getItem("policyApplyNo");
    var carNo = window.localStorage.getItem("carNo");
    var carId = window.localStorage.getItem("carId");

    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form','element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "syxList",
            elem: '#syxList',
            url: baseURL + 'maintenance/insurancemanage/carSyxInsurancelist',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            where: {'carId': carId},
            cols: vm.attrCols,
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res, curr, count) {
                //vm.insuranceManage.policyApplyNo = policyApplyNo;
                // 获取商业险险种名称
/*                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceCols",
                    contentType: "application/json",
                    data: JSON.stringify(vm.insuranceManage),
                    success: function(r){
                        //险种名称
                        var obj = r.cols;
                        // 处理返回对象出现原生链问题
                        obj.__proto__.test = 'test prototype';
                        for (var i = 0; i < Object.values(obj).length; i++){
                            console.log(i + ': ' + Object.values(obj)[i].commercialInsuranceName);
                            vm.attrCols[0].push({field:'insuranceTypeName',title:Object.values(obj)[i].commercialInsuranceName,minWidth: 120, align:'center'});
                        }
                        layui.table.init('syxList',{
                            cols:vm.attrCols
                            ,data:res.data
                        });
                    }
                });*/
                soulTable.render(this);
            },
        });
    });

    layui.use(['form','element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "jqxList",
            elem: '#jqxList',
            url: baseURL + 'maintenance/insurancemanage/carInsurancelist',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            where: {'carId': carId},
            cols: [
                [
                    {type:'numbers', align:'center',  title: '序号'},
                    {field:'policyApplyNo', minWidth:100, title: '保险申请单号',align:'center'},
                    /*{field:'confirmedStr', minWidth:100, title: '状态',align:'center'},*/
                    // {field:'customerName', minWidth:100, title: '客户名称',align:'center',templet:function (d) {
                    //         if(d.customerName!=null && d.customerName!=""){
                    //             return  d.customerName;
                    //         }else {
                    //             return "--";
                    //         }
                    //     }},
                    // {field:'departureNo', minWidth:200, title: '车辆订单号',align:'center', templet:function (d) {
                    //         if(d.departureNo!=null && d.departureNo!=""){
                    //             return  "<span style='color: blue'>"+d.departureNo+"</span>";
                    //         }else {
                    //             return "--";
                    //         }
                    //     }},
                    // {field:'vehicleUseStr', minWidth:100, title: '车辆用途',align:'center'},
                    {field:'insuranceCompanyName', minWidth:150, title: '交强险保险公司',align:'center'},
                    {field:'insuranceNo', minWidth:130, title: '交强险保单号',align:'center'},
                    {field:'insuranceStartTime', minWidth:240, title: '交强险开始时间',align:'center',templet:function (d) {
                            if(d.insuranceStartTime!=null){
                                var date=new Date(d.insuranceStartTime).format("yyyy-MM-dd");
                                return  date;
                            }else {
                                return "--";
                            }
                        }},
                    {field:'compulsoryEndTime', minWidth:240, title: '交强险结束时间',align:'center',templet:function (d) {
                            if(d.insuranceEndTime!=null){
                                var date=new Date(d.insuranceEndTime).format("yyyy-MM-dd");
                                return  date;
                            }else {
                                return "--";
                            }
                        }},
                    {field:'insuranceAmount', minWidth:100, title: '交强险费用(元)',align:'center'},
                    {field:'insuranceRemark', minWidth:100, title: '备注',align:'center',templet:function (d) {
                            if(d.insuranceRemark!=null && d.insuranceRemark!=""){
                                return  d.insuranceRemark;
                            }else {
                                return "--";
                            }
                        }},
                    {field:'jqPolicyPrescription', minWidth:100, title: '保单时效',align:'center'},
                    {
                        field: '', align: "center",minWidth:120, title: '附件查看', templet: function (d) {
                            return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.policyApplyNo+"\',\'"+15+"\',\'"+d.insuranceManageId+"\')>查看</a>";
                        }
                    },
                    /*{
                        field: '', align: "center", title: '附件下载', templet: function (d) {
                            return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.policyApplyNo+"\',\'"+15+"\')>查看</a>";
                        }
                    },*/
                    {field:'notesUser', minWidth:100, title: '记录人',align:'center'},
                    {field:'timeCreate', minWidth:100, title: '记录时间',align:'center',templet:function (d) {
                            if(d.timeCreate!=null){
                                var date=new Date(d.timeCreate).format("yyyy-MM-dd");
                                return  date;
                            }else {
                                return "--";
                            }
                        }},
                ],],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
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
        where: {'businessId': carId,'businessType':1},
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

var vm = new Vue({
    el:'#rrapp',
    data:{
        detailForm:true,
        insuranceManage:{},
        //交强险保险公司下拉列表数据源
        compulsoryInsuranceList:[],
        //商业险保险公司下拉列表数据源
        commercialInsuranceList:[],
        //险种集合
        insuranceTypeList:[],
        //保险单数据源
        insuranceManage:{},
        //商业险种列表数据源
        commercialInsuranceTableList:[],
        jqxFileList: [],
        syxxFileList: [],
        dataArr:[],
        attrCols:[[
            {type:'numbers', align:'center',  title: '序号'},
            {field:'policyApplyNo', minWidth:100, title: '保险申请单',align:'center'},
           /* {field:'confirmedStr', minWidth:100, title: '状态',align:'center'},*/
            // {field:'customerName', minWidth:100, title: '客户名称',align:'center',templet:function (d) {
            //         if(d.customerName!=null && d.customerName!=""){
            //             return  d.customerName;
            //         }else {
            //             return "--";
            //         }
            //     }},
            // {field:'departureNo', minWidth:220, title: '车辆订单号',align:'center', templet:function (d) {
            //         if(d.departureNo!=null && d.departureNo!=""){
            //             return  "<span style='color: blue'>"+d.departureNo+"</span>";
            //         }else {
            //             return "--";
            //         }
            //     }},
            // {field:'vehicleUseStr', minWidth:100, title: '车辆用途',align:'center'},
            {field:'insuranceCompanyName', minWidth:150, title: '商业险保险公司',align:'center'},
            {field:'insuranceNo', minWidth:130, title: '商业险保单号',align:'center'},
            {field:'insuranceStartTime', minWidth:200, title: '商业险开始时间',align:'center',templet:function (d) {
                    if(d.insuranceStartTime!=null){
                        var date=new Date(d.insuranceStartTime).format("yyyy-MM-dd");
                        return  date;
                    }else {
                        return "--";
                    }
                }},
            {field:'insuranceEndTime', minWidth:200, title: '商业险结束时间',align:'center',templet:function (d) {
                    if(d.insuranceEndTime!=null){
                        var date=new Date(d.insuranceEndTime).format("yyyy-MM-dd");
                        return  date;
                    }else {
                        return "--";
                    }
                }},
            {field:'insuranceAmount', minWidth:150, title: '商业险合计金额(元)',align:'center'},
            {field:'insuranceRemark', minWidth:100, title: '备注',align:'center',templet:function (d) {
                    if(d.insuranceRemark!=null && d.insuranceRemark!=""){
                        return  d.insuranceRemark;
                    }else {
                        return "--";
                    }
                }},
            {field:'syPolicyPrescription', minWidth:100, title: '保单时效',align:'center'},
            {field:'insuranceType', minWidth:100, title: '商业险种',align:'center'},
            {
                field: '', align: "center",minWidth:120, title: '附件查看', templet: function (d) {
                    return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.policyApplyNo+"\',\'"+12+"\',\'"+d.insuranceManageId+"\')>查看</a>";
                }
            },
            /*{
                field: '', align: "center", title: '附件下载', templet: function (d) {
                    return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.policyApplyNo+"\',\'"+12+"\')>查看</a>";
                }
            },*/
            {field:'notesUser', minWidth:100, title: '记录人',align:'center'},
            {field:'timeCreate', minWidth:100, title: '记录时间',align:'center',templet:function (d) {
                    if(d.timeCreate!=null){
                        var date=new Date(d.timeCreate).format("yyyy-MM-dd");
                        return  date;
                    }else {
                        return "--";
                    }
            }}
        ]],
        detailsTabContentList: ['保险详情'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '保险记录信息',
            '消息提醒记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '保险记录信息',
    },
    computed:{
        jqPolicyPrescriptionDay:{
            get:function() {
                if(vm.insuranceManage.jqPolicyPrescriptionDay == '1'){
                    $("#jqx1").css("color","red");
                    $("#jqx2").css("color","red");
                } else if(vm.insuranceManage.jqPolicyPrescriptionDay == '0'){
                    $("#jqx1").css("color","green");
                    $("#jqx2").css("color","green");
                }
            }
        },
        syPolicyPrescriptionDay:{
            get:function() {
                if(vm.insuranceManage.syPolicyPrescriptionDay == '1'){
                    $("#syx1").css("color","red");
                    $("#syx2").css("color","red");
                } else if(vm.insuranceManage.syPolicyPrescriptionDay == '0'){
                    $("#syx1").css("color","red");
                    $("#syx2").css("color","red");
                }
            }
        }
    },
    created: function(){

        //初始化加载保险公司下拉列表
        $.ajax({
            type: "POST",
            url: baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList",
            contentType: "application/json",
            data:null,
            success: function(r){
                //交强险
                vm.compulsoryInsuranceList= r.compulsoryInsuranceList;
                //商业险
                vm.commercialInsuranceList= r.commercialInsuranceList;
            }
        });
        //获取险种类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insuranceType",
            contentType: "application/json",
            data:null,
            success: function(r){
                //险种集合
                vm.insuranceTypeList= r.dict;
            }
        });
    },
    updated: function(){
        layui.form.render();
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
            //     this.detailsSupTabContentListActiveValue = '保险记录信息';
            // }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;

        },


        // 取消
        cancel:function(){
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        // 查看详情
        detail: function (jqxId,syxId,carId) {
            var type = "NoInsuranceXB";// 非续保标识
            vm.insuranceManage.jqxId = jqxId;
            vm.insuranceManage.syxId = syxId;
            vm.insuranceManage.carId = carId;
            vm.insuranceManage.insuranceType = type;
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getCarInsuranceWarnInfo",
                contentType: "application/json",
                data: JSON.stringify(vm.insuranceManage),
                success: function(r){
                    if(r.code === 0){
                        vm.insuranceManage = r.insuranceManage;
                        vm.jqxFileList = vm.insuranceManage.jqxFileList;
                        vm.syxxFileList = vm.insuranceManage.syxxFileList;
                        if(vm.insuranceManage.jqPolicyPrescriptionDay == '1'){
                            $("#jqx1").css("color","red");
                            $("#jqx2").css("color","red");
                        } else if(vm.insuranceManage.jqPolicyPrescriptionDay == '0'){
                            $("#jqx1").css("color","green");
                            $("#jqx2").css("color","green");
                        }

                        if(vm.insuranceManage.syPolicyPrescriptionDay == '1'){
                            $("#syx1").css("color","red");
                            $("#syx2").css("color","red");
                        } else if(vm.insuranceManage.syPolicyPrescriptionDay == '0'){
                            $("#syx1").css("color","green");
                            $("#syx2").css("color","green");
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
    }
});

// 附件查看
function fileView (policyApplyNo,type,insuranceManageId) {
    window.localStorage.setItem("objId", policyApplyNo);
    window.localStorage.setItem("objCode", insuranceManageId);
    window.localStorage.setItem("objType", type);
    var index = layer.open({
        title: "风控预警 > 车辆保险预警 > 保险查看 > 附件查看",
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




