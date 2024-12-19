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
            url: baseURL + 'report/financeReport/getOrderCostList',
            cols: [[

                {
                    field: 'orderNo',
                    minWidth: 100,
                    title: '订单编号',
                    fixed: "left",
                    rowspan: 2,
                    align: 'center'
                },
                {field: 'leaseTime', minWidth: 180, title: '租赁时间', align: 'center', rowspan: 2},
                {
                    field: 'customName',
                    minWidth: 200,
                    align: 'center',
                    title: '客户名称',
                    rowspan: 2
                },
                {
                    field: 'phoneNumber',
                    align: 'center',
                    minWidth: 100,
                    title: '客户手机号',
                    rowspan: 2
                },
                {field: 'carNo', minWidth: 150, align: 'center', rowspan: 2, title: '车牌号'},
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
                    field: 'depotName',
                    minWidth: 120,
                    title: '车辆归属',
                    rowspan: 2,
                    align: 'center'
                },
                {
                    field: 'orderState',
                    minWidth: 120,
                    title: '订单状态',
                    rowspan: 2,
                    align: 'center',
                    templet: function (d) {
                        if (d.orderState == 0) {
                            return "待交车"
                        } else if (d.orderState == 1) {
                            return "用车中"
                        } else if (d.orderState == 2) {
                            return "换车中"
                        } else if (d.orderState == 3) {
                            return "换车中-待交车"
                        } else if (d.orderState == 4) {
                            return "已换车-待交车"
                        } else if (d.orderState == 5) {
                            return "已换车"
                        } else if (d.orderState == 6) {
                            return "退车中"
                        } else if (d.orderState == 6) {
                            return "已退车"
                        } else {
                            return "--"
                        }
                    }
                },
                {field: 'treatMarginMoney', minWidth: 100, align: 'center', title: '保证金', rowspan: 2,
                    templet: function (d) {
                        return d.treatMarginMoney.toFixed(2);
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
                        return (d.treatMarginMoney + d.treatLeaseMoney+d.treatReturnCarMoney+d.treatTotalMoney).toFixed(2);
                    }},
                {field: 'alreadyMarginMoney', minWidth: 100, align: 'center', title: '保证金', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyMarginMoney.toFixed(2);
                    }},
                {field: 'alreadyLeaseMoney', minWidth: 100, align: 'center', title: '财务已入-租金', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyLeaseMoney.toFixed(2);
                    }},
                {field: 'alreadyReturnCarMoney', minWidth: 100, align: 'center', title: '财务已入-退车收入', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyReturnCarMoney.toFixed(2);
                    }},
                {
                    field: 'alreadyTotalMoney',
                    minWidth: 100,
                    align: 'center',
                    title: '财务已入-其他收入',
                    rowspan: 2,
                    templet: function (d) {
                        return d.alreadyTotalMoney.toFixed(2);
                    }
                },
                {field: 'alreadyIncomeSumMoney', minWidth: 100, align: 'center', title: '财务已入-合计', rowspan: 2,
                    templet: function (d) {
                        return (d.alreadyMarginMoney + d.alreadyLeaseMoney+d.alreadyReturnCarMoney+d.alreadyTotalMoney).toFixed(2);
                    }},
                {field: 'treatReturnMoney', minWidth: 100, align: 'center', title: '退车退款', rowspan: 2,
                    templet: function (d) {
                        return d.treatReturnMoney.toFixed(2);
                    }},
                {field: 'treatMaintainMoney', minWidth: 100, align: 'center', title: '维修费', rowspan: 2,
                    templet: function (d) {
                        return d.treatMaintainMoney.toFixed(2);
                    }},
                {field: 'treatChannelMoney', minWidth: 100, align: 'center', title: '渠道费', rowspan: 2,
                    templet: function (d) {
                        return d.treatChannelMoney.toFixed(2);
                    }},
                {field: 'treatOtherPayMoney', minWidth: 100, align: 'center', title: '其他支出', rowspan: 2,
                    templet: function (d) {
                        return d.treatOtherPayMoney.toFixed(2);
                    }},
                {field: 'treatPaySumMoney', minWidth: 100, align: 'center', title: '合计', rowspan: 2,
                    templet: function (d) {
                        return (d.treatReturnMoney + d.treatMaintainMoney+d.treatChannelMoney+d.treatOtherPayMoney).toFixed(2);
                    }},
                {field: 'alreadyReturnMoney', minWidth: 100, align: 'center', title: '已-退车退款', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyReturnMoney.toFixed(2);
                    }},
                {field: 'alreadyMaintainMoney', minWidth: 100, align: 'center', title: '已支出-维修费', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyMaintainMoney.toFixed(2);
                    }},
                {field: 'alreadyChannelMoney', minWidth: 100, align: 'center', title: '已支出-渠道费', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyChannelMoney.toFixed(2);
                    }},
                {field: 'alreadyOtherPayMoney', minWidth: 100, align: 'center', title: '已支出-其他支出', rowspan: 2,
                    templet: function (d) {
                        return d.alreadyOtherPayMoney.toFixed(2);
                    }},
                {field: 'alreadyPaySumMoney', minWidth: 100, align: 'center', title: '已支出-合计', rowspan: 2,
                    templet: function (d) {
                        return (d.alreadyReturnMoney + d.alreadyMaintainMoney+d.alreadyChannelMoney+d.alreadyOtherPayMoney).toFixed(2);
                    }},
                {
                    field: 'revenueTotal', minWidth: 100, align: 'center', title: '账单收支合计', rowspan: 2,
                    templet: function (d) {
                        return ( (d.treatMarginMoney + d.treatLeaseMoney+d.treatReturnCarMoney+d.treatTotalMoney)+
                        (d.alreadyMarginMoney + d.alreadyLeaseMoney+d.alreadyReturnCarMoney+d.alreadyTotalMoney)-
                        (d.treatReturnMoney + d.treatMaintainMoney+d.treatChannelMoney+d.treatOtherPayMoney)-
                        (d.alreadyReturnMoney + d.alreadyMaintainMoney+d.alreadyChannelMoney+d.alreadyOtherPayMoney)).toFixed(2)
                    }
                }
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
    $('div[type="updateOrderTimeType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="updateOrderTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "orderTimeStr", '');
        vm.q.updateOrderTimeType = value;
        console.log(vm.q.orderTimeStr)
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
    //查询时间
    layui.laydate.render({
        elem: '#orderTimeStr',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="updateOrderTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.orderTimeStr = value;
            vm.q.updateOrderTimeType = null;
            console.log(vm.q.orderTimeStr)
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
    var url = baseURL + "report/financeReport/orderTotal?a=a"
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
    if (vm.q.orderTimeStr != null) {
        url += '&orderTimeStr=' + vm.q.orderTimeStr;
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
            brandId: null,
            seriesId: null,
            modelId: null,
            orderTimeStr:null
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
                vm.q.orderTimeStr = null
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
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    modelId: vm.q.modelId,
                    orderTimeStr: vm.q.orderTimeStr
                }
            });
        }
    }
});
