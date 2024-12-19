$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        console.log(vm.q)
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
            url: baseURL + 'report/financeReport/list',
            cols: [[
                {field: 'carNo', minWidth: 150, align: 'center', rowspan: 2, fixed: "left", title: '车牌号', templet: function (d) {
                        return "<span style='color: blue' onclick = hrefCarView(\'"+d.carId+"\')>"+isEmpty(d.carNo)+"</span>";
                    }},
                {
                    field: 'carBrandName',
                    minWidth: 100,
                    align: 'center',
                    title: '品牌/车系/车型',
                    rowspan: 2,
                    templet: function (d) {
                        if (d.carBrandName != null && d.carBrandName != "") {
                            return d.carBrandName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'deptName',
                    minWidth: 120,
                    title: '车辆归属',
                    rowspan: 2,
                    align: 'center',
                    templet: function (d) {
                        if (d.deptName != null && d.deptName != "") {
                            return d.deptName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'depotName',
                    minWidth: 100,
                    title: '车辆所在仓库',
                    rowspan: 2,
                    align: 'center',
                    templet: function (d) {
                        if (d.depotName != null && d.depotName != "") {
                            return d.depotName;
                        } else {
                            return "--";
                        }
                    }
                },
                {field: 'vinNo', minWidth: 180, title: '车架号', align: 'center', rowspan: 2},
                {
                    field: 'businessType',
                    minWidth: 120,
                    title: '车辆状态',
                    rowspan: 2,
                    align: 'center',
                    templet: function (d) {
                        if (d.businessType != null && d.businessType != "") {
                            if (d.businessType == 1) {
                                return "整备中";
                            } else if (d.businessType == 2) {
                                return "备发车";
                            } else if (d.businessType == 3) {
                                return "预定中";
                            } else if (d.businessType == 4) {
                                return "用车中";
                            } else if (d.businessType == 5) {
                                return "已过户";
                            } else if (d.businessType == 6) {
                                return "已处置";
                            } else if (d.businessType == 7) {
                                return "已出售";
                            }

                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'sourceType',
                    minWidth: 200,
                    align: 'center',
                    title: '车辆来源',
                    rowspan: 2,
                    templet: function (d) {
                        if (d.sourceType != null && d.sourceType != "") {
                            if (d.sourceType == 1) {
                                return "直购";
                            } else if (d.sourceType == 2) {
                                return "租赁";
                            } else if (d.sourceType == 3) {
                                return "租售";
                            }
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'contractNo',
                    align: 'center',
                    minWidth: 100,
                    title: '合同编号',
                    rowspan: 2,
                    templet: function (d) {
                        if (d.contractNo != null && d.contractNo != "") {
                            return d.contractNo;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'supplierName',
                    align: 'center',
                    minWidth: 240,
                    title: '供应商',
                    rowspan: 2,
                    templet: function (d) {
                        if (d.supplierName != null && d.supplierName != "") {
                            return d.supplierName;
                        } else {
                            return "--";
                        }
                    }
                },
                {field: 'leaseMoney', minWidth: 100, align: 'center', title: '租赁收入', rowspan: 2},
                {field: 'returnCarMoney', minWidth: 100, align: 'center', title: '退车收入', rowspan: 2},
                {
                    field: 'totalMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '其他收入',
                    rowspan: 2
                },
                {field: 'incomeSumMoney', minWidth: 100, align: 'center', title: '合计', rowspan: 2,
                    templet: function (d) {
                        return (d.totalMoney + d.leaseMoney + d.returnCarMoney);
                    }},
                {field: 'purchaseMoney', minWidth: 100, align: 'center', title: '车辆采购费用', rowspan: 2},
                {field: 'insureMoney', minWidth: 100, align: 'center', title: '保险费', rowspan: 2},
                {field: 'yearCheckMoney', minWidth: 100, align: 'center', title: '年检费', rowspan: 2},
                {field: 'maintenanceMoney', minWidth: 100, align: 'center', title: '保养费', rowspan: 2},
                {field: 'maintainMoney', minWidth: 100, align: 'center', title: '维修费', rowspan: 2},
                {
                    field: 'otherPayMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '其他支出',
                    rowspan: 2
                },
                {field: 'paySumMoney', minWidth: 100, align: 'center', title: '合计', rowspan: 2,
                    templet: function (d) {
                            return (d.otherPayMoney + d.purchaseMoney + d.insureMoney + d.yearCheckMoney + d.maintenanceMoney + d.maintainMoney);
                    }},
                {field: 'depreciateMoney', minWidth: 100, align: 'center', title: '车辆折旧费', rowspan: 2},
                {field: 'taxMoney', minWidth: 100, align: 'center', title: '税费', rowspan: 2},
                {field: 'badMoney', minWidth: 100, align: 'center', title: '坏账金额', rowspan: 2},
                {
                    field: 'carIncomeMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '车辆收益合计',
                    rowspan: 2,
                    templet: function (d) {
                        return (d.incomeSumMoney - d.paySumMoney - d.badMoney);
                    }
                },


                /*  {field:'', minWidth:120,align:'center', title: '车辆总支出',align: "center",colspan:7},*/

            ],
                /*[
                    {field:'depositRefund', minWidth:180, title: '押金退款',align:'center', templet:function (d) {
                            if(d.depositRefund!=null){
                                return  d.depositRefund;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'inspectionAmount', minWidth:130, title: '年检费用',align:'center', templet:function (d) {
                            if(d.inspectionAmount!=null){
                                return  d.inspectionAmount;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'insuranceAmount', minWidth:100, title: '保险费用',align:'center', templet:function (d) {
                            if(d.insuranceAmount!=null){
                                return  d.insuranceAmount;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'repairAmount', minWidth:100, title: '维修费用',align:'center', templet:function (d) {
                            if(d.repairAmount!=null){
                                return  d.repairAmount;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'dangerAmount', minWidth:100, title: '出险费用',align:'center', templet:function (d) {
                            if(d.dangerAmount!=null){
                                return  d.dangerAmount;
                            }else {
                                return "0";
                            }
                        }},

                    {field:'maintenanceAmount', minWidth:100, title: '保养费用',align:'center', templet:function (d) {
                            if(d.maintenanceAmount!=null){
                                return  d.maintenanceAmount;
                            }else {
                                return "0";
                            }
                        }},

                    {field:'zuShouPurchasePrice', minWidth:100, title: '其他来源采购单价',align:'center', templet:function (d) {
                            if(d.zuShouPurchasePrice!=null){
                                return  d.zuShouPurchasePrice;
                            }else {
                                return "0";
                            }
                        }},
                ]*/],
            page: true,
            loading: true,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });
    });
    selectTotal();

    layui.form.on('select(sourceTypeSelect)', function (data) {
        vm.q.sourceType = data.value;
    });

    $('div[type="updateTimeType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "timeStr", '');
        vm.q.updateTimeType = value;
        console.log(vm.q.timeStr)
    });
    $('div[type="updateWarehouseTimeType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="updateWarehouseTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "warehouseStr", '');
        vm.q.updateWarehouseTimeType = value;
        console.log(vm.q.warehouseStr)
    });
    //查询时间
    layui.laydate.render({
        elem: '#timeStr',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeStr = value;
            vm.q.updateTimeType = null;
            console.log(vm.q.timeStr)
        }

    });

    layui.laydate.render({
        elem: '#warehouseStr',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="updateWarehouseTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.warehouseStr = value;
            vm.q.updateWarehouseTimeType = null;
            console.log(vm.q.warehouseStr)
        }

    });
    //品牌车型
    layui.form.on('select(carModelSelect)', function (data) {
        vm.q.carBrandName = data.value;
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

/*        laydate.render({
            elem: '#warehousingDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.warehousingDate = value;
            }
        });*/
        form.render();
    });

 /*   // 交强险费用表单
    gridTable1 = layui.table.render({
        id: "compulsoryInsurance",
        elem: '#compulsoryInsurance',
        minWidth: 150,
        data: vm.dataliat,
        cols: [[
            { field: 'feeName', title: '费用名称', align: "center" },
            {
                field: 'payableAmount', title: '应付金额', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount'
            },
            {
                field: 'payableAmount', title: '已付金额', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount'
            },
        ]],
        page: false,
        loading: false,
        limit: 500,

    });*/
    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
    });
    layui.form.on('select(vehicleStatusSelect)', function (data) {
        vm.q.businessType = data.value;
    });
});

/**
 * 统计
 */
function selectTotal() {
    var url = baseURL + "report/financeReport/total?a=a"
    if (vm.q.carNo != null) {
        url += '&carNo=' + vm.q.carNo;
    }
    if (vm.q.depotName != null) {
        url += '&depotName=' + vm.q.depotName;
    }
    if (vm.q.deptName != null) {
        url += '&deptName=' + vm.q.deptName;
    }
    if (vm.q.sourceType != null) {
        url += '&sourceType=' + vm.q.sourceType;
    }
    if (vm.q.carBrandName != null) {
        url += '&carBrandName=' + vm.q.carBrandName;
    }
    if (vm.q.supplierName != null) {
        url += '&supplierName=' + vm.q.supplierName;
    }
    if (vm.q.businessType != null) {
        url += '&businessType=' + vm.q.businessType;
    }
    if (vm.q.timeStr != null) {
        url += '&timeStr=' + vm.q.timeStr;
    }
    if (vm.q.warehouseStr != null) {
        url += '&warehouseStr=' + vm.q.warehouseStr;
    }
    if (vm.q.brandId != null) {
        url += '&brandId=' + vm.q.brandId;
    }
    if (vm.q.seriesId != null) {
        url += '&seriesId=' + vm.q.seriesId;
    }
    if (vm.q.modelId != null) {
        url += '&modelId=' + vm.q.modelId;
    }
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        success: function (res) {
            vm.total = res.data;
        },
    });
}

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            deptName: null,
            carNo: null,
            depotName: null,
            sourceType: null,
            carBrandName: null,
            supplierName: null,
            warehouseStr: null,
            businessType: null,
            timeStr: null,
            brandId:null,
            seriesId:null,
            modelId:null
        },
        selectData: [],
        showForm: false,
        total: {},
        CarIncomeDetail: {},
        //仓库数据源
        warehouseData: {},
        allCarModels: [],
        costTypeDict:[
            {key:0,label:"其他收入"},
            {key:1,label:"其他支出"}
        ],
        leaseList:[],
        returnList:[],
        otherList:[],
        purchaseList:[],
        insureList:[],
        yearCheckList:[],
        maintenanceList:[],
        maintainList:[],
        otherPayList:[],
    },
    updated: function () {
        layui.form.render();
    },

    created: function () {
        var _this = this;
        $.getJSON(baseURL + "report/financeReport/listBrandAndSeries", function (r) {
            _this.allCarModels = r.listData;
        });
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form', "jquery", "cascader", "form"], function () {
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {

                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#a",
                    data: vm.selectData,
                    success: function (valData, labelData) {
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                        console.log(vm.q)
                    }
                });
            });
        });

    },

    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var carprofitreportIds = [];
            $.each(list, function (index, item) {
                carprofitreportIds.push(item.carprofitreportId);
            });
            return carprofitreportIds;
        },
        //营业收入跳转详情页  modules/order/orderlistnew.html   jumpCarOwnerPage
        jumpIncomePage: function () {
            var param = {
                statusKey: -9,
                carPlateNo:vm.CarIncomeDetail.carNo
            };
            window.localStorage.setItem("statusKey", -9);
            window.localStorage.setItem("carPlateNo", vm.CarIncomeDetail.carNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?statusKey=-9",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("carPlateNo", null);
                }
            });
            layer.full(index);
        },
        //历任车主跳转详情页
        jumpCarOwnerPage: function () {
            var param = {
                carvinno:vm.CarIncomeDetail.carNo
            };
            window.localStorage.setItem("carvinno", vm.CarIncomeDetail.carNo);
            var index = layer.open({
                title: "订单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/orderlistnew.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("carvinno", null);
                }
            });
            layer.full(index);
        },
        //退车跳转详情页
        jumpReturnCarPage: function () {
            var param = {
                carvinno:vm.CarIncomeDetail.carNo
            };
            window.localStorage.setItem("carvinno", vm.CarIncomeDetail.carNo);
            var index = layer.open({
                title: "订单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/settleorder.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("carvinno", null);
                }
            });
            layer.full(index);
        },
        //费用支出跳转详情页
        jumpPayPage: function () {
            var param = {
                carvinno:vm.CarIncomeDetail.carNo
            };
            window.localStorage.setItem("carvinno", vm.CarIncomeDetail.carNo);
            var index = layer.open({
                title: "应付账单",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/paymentbill.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("carvinno", null);
                }
            });
            layer.full(index);
        },

        //坏账跳转详情页  modules/order/orderlistnew.html   jumpCarOwnerPage
        jumpBadPage: function () {
            var param = {
                statusKey: 4,
                carPlateNo:vm.CarIncomeDetail.carNo
            };
            window.localStorage.setItem("statusKey", 4);
            window.localStorage.setItem("carPlateNo", vm.CarIncomeDetail.carNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?statusKey=4",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("carPlateNo", null);
                }
            });
            layer.full(index);
        },
        //营业收入跳转详情页  modules/order/orderlistnew.html   jumpCarOwnerPage
        jumpIncomeNoPage: function () {
            var param = {
                statusKey: 1,
                receivablesNo:vm.CarIncomeDetail.currentOrderNo
            };
            window.localStorage.setItem("statusKey", 1);
            window.localStorage.setItem("receivablesNo", vm.CarIncomeDetail.currentOrderNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("receivablesNo", null);
                }
            });
            layer.full(index);
        },

        jumpIncomeHistoryNoPage: function (receivablesNo) {
            var param = {
                statusKey: 1,
                receivablesNo:receivablesNo
            };
            window.localStorage.setItem("statusKey", 1);
            window.localStorage.setItem("receivablesNo", receivablesNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("receivablesNo", null);
                }
            });
            layer.full(index);
        },
        //查询
        query: function () {
            vm.reload();
            console.log(vm.q)
            selectTotal();
        },
        //重置
        reset: function () {
            vm.q.carNo = null;
            vm.q.depotName = null;
            vm.q.deptName = null;
            vm.q.carBrandName = null;
            vm.q.sourceType = null;
            vm.q.supplierName = null;
            vm.q.warehouseStr = null
            vm.q.businessType = null
            vm.q.timeStr = null,
            vm.q.brandId = null,
            vm.q.seriesId = null,
            vm.q.modelId = null
        },
        deptTree: function () {
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.q, "deptId", treeNode.deptId);
            Vue.set(vm.q, "deptName", treeNode.name);
            layer.closeAll();
        },
        chooseWarehouse: function () {
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function () {
                    vm.q = Object.assign({}, vm.q, {
                        //depotId:vm.warehouseData.warehouseId,
                        depotName: vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },
        initEditData : function(carId,carNo){
            $.ajax({
                type: "GET",
                url: baseURL + 'report/financeReport/carIncomeFeeDetail/' + carId,
                contentType: "application/json",
                success: function (r) {
                    vm.CarIncomeDetail = r.data;
                    vm.leaseList=r.data.leaseList
                    vm.otherList=r.data.otherList
                    vm.returnList=r.data.returnList
                    vm.purchaseList=r.data.purchaseList
                    vm.insureList=r.data.insureList
                    vm.yearCheckList=r.data.yearCheckList
                    vm.maintenanceList=r.data.maintenanceList
                    vm.maintainList=r.data.maintainList
                    vm.otherPayList=r.data.otherPayList
                    vm.historyList=r.data.historyList
                   /* vm.initAllGrid();
                    vm.initOperatorLog();*/
                }
            });
        },
        //导出
        exports: function () {
            var url = baseURL + 'report/financeReport/export';
            if (vm.q.carPlateNo != null) {
                url += '?carPlateNo=' + vm.q.carPlateNo;
            }
            if (vm.q.cityName != null) {
                url += '?cityName=' + vm.q.cityName;
            }
            if (vm.q.deptName != null) {
                url += '?deptName=' + vm.q.deptName;
            }
            if (vm.q.sourceType != null) {
                url += '?sourceType=' + vm.q.sourceType;
            }
            if (vm.q.carBrandName != null) {
                url += '?carBrandName=' + vm.q.carBrandName;
            }
            if (vm.q.supplierName != null) {
                url += '?supplierName=' + vm.q.supplierName;
            }
            if (vm.q.warehouseStr != null) {
                url += '?warehouseStr=' + vm.q.warehouseStr;
            }
            window.location.href = url;
        },
        //重新加载
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo: vm.q.carNo,
                    depotName: vm.q.depotName,
                    deptName: vm.q.deptName,
                    sourceType: vm.q.sourceType,
                    carBrandName: vm.q.carBrandName,
                    supplierName: vm.q.supplierName,
                    warehouseStr: vm.q.warehouseStr,
                    businessType: vm.q.businessType,
                    timeStr: vm.q.timeStr,
                    brandId:vm.q.brandId,
                    seriesId:vm.q.seriesId,
                    modelId:vm.q.modelId
                }
            });
        }
    }
});




