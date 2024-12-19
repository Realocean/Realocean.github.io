$(function(){
    layui.table.on('tool(test8)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if(layEvent === 'showDoc'){ //查看
            vm.showDoc(data.url, data.nameFile)
        } else if(layEvent === 'downDoc'){ //删除
            vm.downDoc(data.url, data.nameFile)
        }
    });

});
var viewer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        detailsTabContentList: ['备用车详情','还款明细','操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '备用车基础信息',
            '备用车信息',
            '合同信息',
            '其他关联单据信息',
            '备用车退车信息',
            '还款明细',
            '操作记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '备用车基础信息',
        fileLst: [],
        fileLstId: '0',
        receivablesList: [],
        fileLst1: [],
        fileLst2: [],
        spareCarApply: {},
        returnCarBtn:false,
        returnCarForm:false,
        itemEntityList:[],
        payDayShow:false
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        toOtherPage:function(type,id){
            if(type == 3){
                var index = layer.open({
                    title: "违章列表",
                    type: 2,
                    content: tabBaseURL + "modules/car/carillegal.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.initParam(vm.spareCarApply.carNo);
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 4){
                var index = layer.open({
                    title: "出险记录",
                    type: 2,
                    content: tabBaseURL + "modules/outinsuranceorder/outinsuranceorder.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.initParam(vm.spareCarApply.carNo);
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 5){
                var index = layer.open({
                    title: "保养记录",
                    type: 2,
                    content: tabBaseURL + "modules/maintenance/maintenancemanage.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.initParam(vm.spareCarApply.carNo);
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 6){
                var index = layer.open({
                    title: "维修记录",
                    type: 2,
                    content: tabBaseURL + "modules/carrepairorder/carrepairorder.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.initParam(vm.spareCarApply.carNo);
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }
        },
        detailsTabContentBindtap:function(param){
            this.detailsTabContentListActiveIndex = param;
            if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '备用车详情';
                this.detailsSupTabContentListActiveIndex = 0 ;
                this.detailsSupTabContentListActiveValue = '备用车基础信息'
            }else{
                this.detailsSupTabContentListActiveValue = this.detailsTabContentList[param];
            }
        },
        initOperatorLog(objId){
            layui.table.render({
                id: "gridid",
                elem: '#yslogid',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
                url: baseURL + 'sys/operationlog/list',
                where: {'businessNo': objId, 'auditType':28},
                cols: [[
                    {
                        field: 'operatorName', minWidth:200, width:200, align: "center", title: '操作人', templet: function (d) {
                            return isEmpty(d.operatorName);
                        }
                    },
                    {
                        field: 'memo', minWidth:200, width:200, align: "center", title: '操作内容', templet: function (d) {
                            return isEmpty(d.memo);
                        }
                    },
                    {
                        field: 'operatorTime', minWidth:200, width:200, align: "center", title: '操作时间', templet: function (d) {
                            return isEmpty(d.operatorTime);
                        }
                    }
                ]],
                autoColumnWidth: {
                    init: true
                },
                page: true,
                limits: [10, 20, 100, 200],
                limit: 10,

            });
        },
        reloadData:function(){
            if(vm.receivablesList !=null && vm.receivablesList.length > 0){
                layui.config({
                    base: '../../statics/common/'
                }).extend({
                    soulTable: 'layui/soultable/ext/soulTable.slim'
                });
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
                    initRepaymentDetailsTable(layui.table,layui.soulTable);
                    layui.form.render();
                });
            }
            if(vm.fileLst2!=null && vm.fileLst2.length > 0){
                gridTable = layui.table.render({
                    id: "test8id",
                    elem: '#test8',
                    data: vm.fileLst2,
                    cols: [[
                        {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
                        {
                            field: 'nameAccessory', title: '文件名称', align: "center", templet: function (d) {
                                return isEmpty(d.nameAccessory);
                            }
                        },
                        {
                            field: 'timeCreate', title: '提交时间', align: "center", templet: function (d) {
                                return isEmpty(d.timeCreate);
                            }
                        },
                        {
                            field: 'operationName', title: '提交人', align: "center", templet: function (d) {
                                return isEmpty(d.operationName);
                            }
                        }
                    ]],
                    autoColumnWidth: {
                        init: true
                    },
                });
            }
        },
        reload:function(){
            $.get(baseURL + "cartransfer/sparecar/info/"+vm.spareCarApply.id, function(r){
                    vm.spareCarApply = r.spareCar;
                    vm.receivablesList = r.spareCar.receivablesList;
                    if(vm.spareCarApply.isApply == 1){
                        vm.payDayShow = true;
                    }else{
                        vm.payDayShow = false;
                    }
                    if(r.spareCar.spareCarStatus == 2 || r.spareCar.spareCarStatus == 31 || r.spareCar.spareCarStatus == 32){
                        vm.returnCarBtn = true;
                    }else{
                        vm.returnCarBtn = false;
                    }
                    if(r.spareCar.spareCarStatus == 3 || r.spareCar.spareCarStatus == 4){
                        vm.returnCarForm = true;
                        vm.detailsSupTabContentList = [
                            '备用车基础信息',
                            '备用车信息',
                            '合同信息',
                            '其他关联单据信息',
                            '备用车退车信息',
                            '还款明细',
                            '操作记录'
                        ];
                    }else{
                        vm.returnCarForm = false;
                        vm.detailsSupTabContentList = [
                            '备用车基础信息',
                            '备用车信息',
                            '合同信息',
                            '其他关联单据信息',
                            '还款明细',
                            '操作记录'
                        ];
                    }

                    vm.fileLst = r.spareCar.deliveryFileLst;
                    vm.fileLst1 = r.spareCar.deliveryFileLst1;
                    vm.fileLst2 = r.spareCar.deliveryFileLst2;
                    vm.reloadData();
                    vm.initOperatorLog(vm.spareCarApply.id);

            });
        },
        etailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '车辆操作纪录';
                vm.reloadOperatorLog();
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '车辆基础信息';
            }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },

        returnPre:function(){
            parent.layer.closeAll();
            parent.vm.reload();
        },

        returnCar:function(){
            $.get(baseURL + "mark/processnode/activitiEnable",{processKey:'spareCarReturnApprove'}, function (r) {
                if (r) {
                    //工作流为启动状态
                    var param = {
                        viewTag: 'apply'
                    };
                    var index = layer.open({
                        title: "备用车退车登记",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/order/sparecarback.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.spareCarReturn = Object.assign({},iframe.vm.spareCarReturn,{
                                margin:vm.spareCarApply.cashDeposit,
                                rentPay:vm.spareCarApply.rentPay,
                                spareCarId:vm.spareCarApply.id,
                                rentType:vm.spareCarApply.rentType,
                                rentTypeStr:vm.spareCarApply.orderRentType,
                                orderCarCode:vm.spareCarApply.orderCodeNo,
                                customerName:vm.spareCarApply.orderCustomer,
                                customerTel:vm.spareCarApply.customerTel,
                                contactPerson:vm.spareCarApply.contactPerson,
                                lessorName:vm.spareCarApply.lessorName,
                                timeStartRent:vm.spareCarApply.orderRentStart,
                                timeFinishRent:vm.spareCarApply.orderRentEnd,
                                vinNo:vm.spareCarApply.orderVinNo,
                                carNo:vm.spareCarApply.orderCarNo,
                                carBrandModel:vm.spareCarApply.orderBrandModelName,
                                deptName:vm.spareCarApply.deptName,
                                applyReason:vm.spareCarApply.applyReason,
                                spareCarBrandModel:vm.spareCarApply.brandModelName,
                                spareCarNo:vm.spareCarApply.carNo,
                                spareCarHandleTime:vm.spareCarApply.handleTime,
                                spareCarReturnTime:vm.spareCarApply.returnTime
                            });
                        },
                        end: function(){
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                } else {
                    var param = {
                        rentType:vm.spareCarApply.rentType,
                    };
                    //工作流为禁用状态
                    var index = layer.open({
                        title: "备用车退车登记",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/order/sparecarreturn.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.spareCarReturn = Object.assign({},iframe.vm.spareCarReturn,{
                                margin:vm.spareCarApply.cashDeposit,
                                rentPay:vm.spareCarApply.rentPay,
                                spareCarId:vm.spareCarApply.id,
                                rentType:vm.spareCarApply.rentType,
                                rentTypeStr:vm.spareCarApply.orderRentType,
                                orderCarCode:vm.spareCarApply.orderCodeNo,
                                customerName:vm.spareCarApply.orderCustomer,
                                customerTel:vm.spareCarApply.customerTel,
                                contactPerson:vm.spareCarApply.contactPerson,
                                lessorName:vm.spareCarApply.lessorName,
                                timeStartRent:vm.spareCarApply.orderRentStart,
                                timeFinishRent:vm.spareCarApply.orderRentEnd,
                                vinNo:vm.spareCarApply.orderVinNo,
                                carNo:vm.spareCarApply.orderCarNo,
                                carBrandModel:vm.spareCarApply.orderBrandModelName,
                                deptName:vm.spareCarApply.deptName,
                                applyReason:vm.spareCarApply.applyReason,
                                spareCarBrandModel:vm.spareCarApply.brandModelName,
                                spareCarNo:vm.spareCarApply.carNo,
                                spareCarHandleTime:vm.spareCarApply.handleTime,
                                spareCarReturnTime:vm.spareCarApply.returnTime
                            });
                        },
                        end: function(){
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                }
            });
        },
        showDoc: function (url, fileName) {
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
        },
        downDoc: function (url, fileName) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
    }
});

function initRepaymentDetailsTable(table, soulTable) {
    table.render({
        id: "hkDetail",
        elem: '#hkDetail',
        data:vm.receivablesList,
        cols: [[
            {field:'stageStr', title: '期数', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.stageStr);}},
            {field:'collectionTypeName', title: '还款类型', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.collectionTypeName);}},
            {field:'receivableDate', title: '应还日期', minWidth:200, align: "center",templet: function (d) {return dateFormatYMD(d.receivableDate);}},
            {field:'receivableAmount', title: '应还总金额', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.receivableAmount);}},
            {field:'receivedAmount', title: '已还总金额', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.receivedAmount);}},
            {field:'statusStr', title: '还款状态', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.statusStr);}},
            {field:'uncollectedAmount', title: '欠款金额', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.uncollectedAmount);}},
            {field:'overdueDays', title: '逾期天数', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.overdueDays);}},
        ]],
        page: false,
        loading: false,
        limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
}
