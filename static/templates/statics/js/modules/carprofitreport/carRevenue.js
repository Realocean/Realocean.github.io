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
            url: baseURL + 'report/financeReport/getRevenueList',
            cols: [[
                {field: 'carNo', minWidth: 150, align: 'center', rowspan: 2, fixed: "left", title: '车牌号'},
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
                {field: 'marginMoney', minWidth: 100, align: 'center', title: '保证金账户', rowspan: 2,
                    templet: function (d) {
                        return (d.marginMoney==null?0:d.marginMoney).toFixed(2);
                    }},
                {field: 'treatLeaseMoney', minWidth: 100, align: 'center', title: '租金', rowspan: 2,
                    templet: function (d) {
                        return d.treatLeaseMoney.toFixed(2);
                    }},
                {field: 'treatReturnCarMoney', minWidth: 100, align: 'center', title: '退车收入', rowspan: 2,
                    templet: function (d) {
                        return d.treatReturnCarMoney.toFixed(2);
                    }},
                {
                    field: 'treatTotalMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '其他收入',
                    rowspan: 2,
                    templet: function (d) {
                        return d.treatTotalMoney.toFixed(2);
                    }
                },
                {field: 'treatIncomeSumMoney', minWidth: 100, align: 'center', title: '合计', rowspan: 2,
                    templet: function (d) {
                        return (d.treatLeaseMoney+ d.treatReturnCarMoney+d.treatTotalMoney).toFixed(2);
                    }},
                {field: 'alreadyLeaseMoney', minWidth: 100, align: 'center', title: '营收已入-租金', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyLeaseMoney.toFixed(2);
                    }},
                {field: 'alreadyReturnCarMoney', minWidth: 100, align: 'center', title: '营收已入-退车收入', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyReturnCarMoney.toFixed(2);
                    }},
                {
                    field: 'alreadyTotalMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '营收已入-其他收入',
                    rowspan: 2,
                    templet: function (d) {
                        return d.alreadyTotalMoney.toFixed(2);
                    }
                },
                {field: 'alreadyIncomeSumMoney', minWidth: 100, align: 'center', title: '营收已入-合计', rowspan: 2,
                    templet: function (d) {
                        return (d.alreadyLeaseMoney + d.alreadyReturnCarMoney+d.alreadyTotalMoney ).toFixed(2);
                    }},
                {field: 'treatPurchaseMoney', minWidth: 100, align: 'center', title: '车辆采购费用', rowspan: 2,
                    templet: function (d) {
                        return d.treatPurchaseMoney.toFixed(2);
                    }},
                {field: 'treatInsureMoney', minWidth: 100, align: 'center', title: '保险费', rowspan: 2,
                    templet: function (d) {
                        return d.treatInsureMoney.toFixed(2);
                    }},
                {field: 'treatYearCheckMoney', minWidth: 100, align: 'center', title: '年检费', rowspan: 2,
                    templet: function (d) {
                        return d.treatYearCheckMoney.toFixed(2);
                    }},
                {field: 'treatMaintenanceMoney', minWidth: 100, align: 'center', title: '保养费', rowspan: 2,
                    templet: function (d) {
                        return d.treatMaintenanceMoney.toFixed(2);
                    }},
                {field: 'treatMaintainMoney', minWidth: 100, align: 'center', title: '维修费', rowspan: 2,
                    templet: function (d) {
                        return d.treatMaintainMoney.toFixed(2);
                    }},
                {
                    field: 'treatOtherPayMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '其他支出',
                    rowspan: 2,
                    templet: function (d) {
                        return d.treatOtherPayMoney.toFixed(2);
                    }
                },
                {field: 'treatPaySumMoney', minWidth: 100, align: 'center', title: '合计', rowspan: 2,
                    templet: function (d) {
                            return (d.treatOtherPayMoney + d.treatPurchaseMoney + d.treatInsureMoney + d.treatYearCheckMoney + d.treatMaintenanceMoney + d.treatMaintainMoney).toFixed(2);
                    }},
                {field: 'alreadyPurchaseMoney', minWidth: 100, align: 'center', title: '已-车辆采购费用', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyPurchaseMoney.toFixed(2);
                    }},
                {field: 'alreadyInsureMoney', minWidth: 100, align: 'center', title: '已支出-保险费', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyInsureMoney.toFixed(2);
                    }},
                {field: 'alreadyYearCheckMoney', minWidth: 100, align: 'center', title: '已支出-年检费', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyYearCheckMoney.toFixed(2);
                    }},
                {field: 'alreadyMaintenanceMoney', minWidth: 100, align: 'center', title: '已支出-保养费', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyMaintenanceMoney.toFixed(2);
                    }},
                {field: 'alreadyMaintainMoney', minWidth: 100, align: 'center', title: '已支出-维修费', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyMaintainMoney.toFixed(2);
                    }},
                {
                    field: 'alreadyOtherPayMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '已支出-其他支出',
                    rowspan: 2,
                    templet: function (d) {
                        return d.alreadyOtherPayMoney.toFixed(2);
                    }
                },
                {field: 'alreadyPaySumMoney', minWidth: 100, align: 'center', title: '已支出-合计', rowspan: 2,
                    templet: function (d) {
                        return (d.alreadyOtherPayMoney + d.alreadyPurchaseMoney + d.alreadyInsureMoney + d.alreadyYearCheckMoney + d.alreadyMaintenanceMoney + d.alreadyMaintainMoney).toFixed(2);
                    }},
                {field: 'revenueTotal', minWidth: 100, align: 'center', title: '账单收支合计', rowspan: 2,
                    templet: function (d) {
                        return ((d.treatLeaseMoney+ d.treatReturnCarMoney+d.treatTotalMoney)+
                        (d.alreadyLeaseMoney + d.alreadyReturnCarMoney+d.alreadyTotalMoney )-
                        (d.treatOtherPayMoney + d.treatPurchaseMoney + d.treatInsureMoney + d.treatYearCheckMoney + d.treatMaintenanceMoney + d.treatMaintainMoney)-
                        (d.alreadyOtherPayMoney + d.alreadyPurchaseMoney + d.alreadyInsureMoney + d.alreadyYearCheckMoney + d.alreadyMaintenanceMoney + d.alreadyMaintainMoney)).toFixed(2);
                          //  return (d.treatIncomeSumMoney+d.alreadyIncomeSumMoney-d.treatPaySumMoney-d.alreadyPaySumMoney);
                    }}
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
    var url = baseURL + "report/financeReport/revenueTotal?a=a"
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
        carprofitreport: {},
        //仓库数据源
        warehouseData: {},
        allCarModels: [],
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
            vm.q.modelId = null,
                $("#a").val('');
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
