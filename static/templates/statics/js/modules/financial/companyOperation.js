$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        initReportData(layui,1);
        layui.form.render();
    });


    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        /*laydate.render({
            elem: '#monthDate',
            format: 'yyyy-MM',
            type: 'datetime',
            done: function (value, date, endDate) {
                vm.q.monthDate = value;
            }
        });*/
        form.render();
    });


    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            deptId:null,
            deptName: null,
            monthDate: null,
            dayDate:null
        },
        receivables: {},
        type: null,
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.q,"deptId",treeNode.deptId);
            Vue.set(vm.q,"deptName",treeNode.name);
            layer.closeAll();
        },
        changeStatus: function (status) {
            removeClass();
            if (status == 1) {
                vm.reset();
                $("#field1").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    initReportData(layui,1);
                    layui.form.render();
                });
            } else if (status == 2) {
                vm.reset();
                $("#field2").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    initReportData(layui,2);
                    layui.form.render();
                });
            }
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var receivablesIds = [];
            $.each(list, function (index, item) {
                receivablesIds.push(item.receivablesId);
            });
            return receivablesIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.deptName = null;
            vm.q.monthDate = null;
            vm.q.dayDate = null;
            vm.q.deptId = null
        },
        // 公司月度经营报表导出
        monthDataReport: function () {
            var url = baseURL + 'report/financeReport/cpmpanyReportExport?a=a';
                url += '&type=' + 1;
            if (vm.q.monthDate != null && vm.q.monthDate !="") {
                url += '&monthDate=' + vm.q.monthDate;
            }
            if (vm.q.deptId != null && vm.q.deptId !="") {
                url += '&deptId=' + vm.q.deptId;
            }
            window.location.href = url;
        },
        // 公司每日经营报表导出
        dayDataReport: function () {
            var url = baseURL + 'report/financeReport/cpmpanyReportExport?a=a';
                url += '&type='+2;
            if (vm.q.dayDate != null && vm.q.dayDate !="") {
                url += '&dayDate=' + vm.q.dayDate;
            }
            if (vm.q.deptId != null && vm.q.deptId !="") {
                url += '&deptId=' + vm.q.deptId;
            }
            window.location.href = url;
        },
        cancel: function () {
            layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    monthDate: vm.q.monthDate,
                    deptName: vm.q.deptName,
                    deptId: vm.q.deptId,
                    dayDate: vm.q.dayDate
                }
            });
        },
    }
});

function removeClass(){
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
}

function initReportData(layui,type) {
    if(type == '1'){
        initDayTable(layui.table, layui.soulTable);
        $("#field1").addClass("flex active");
        $("#dayDiv").show();
        $("#monthDiv").hide();
    } else if(type == '2'){
        initMonthTable(layui.table, layui.soulTable);
        $("#field2").addClass("flex active");
        $("#monthDiv").show();
        $("#dayDiv").hide();
    }
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}
function initData() {

}

function initDate(laydate) {
    laydate.render({
        elem : '#monthDate',
        format: 'yyyy-MM',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.monthDate=value;
        }
    });

    laydate.render({
        elem : '#dayDate',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.dayDate = value;
        }
    });
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}
function initChecked(form) { }
function initClick() { }
// 初始化加载每日报表
function initDayTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        cellMinWidth: 150,
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'report/financeReport/listCompanyDayOperateReport',
        cols: [
            [
                /*第一行*/
                {
                    field: 'deptName', align: "center",rowspan:3, title: '所属公司', templet: function (d) {
                        return isEmpty(d.deptName);
                    }
                },
                {
                    field: 'statisticalSate', align: "center",rowspan:3, title: '统计日期', templet: function (d) {
                        return isEmpty(d.statisticalSate);
                    }
                },
                {
                    field: 'carNumber', align: "center",rowspan:3 , title: '车辆总数', templet: function (d) {
                        return isEmpty(d.carNumber);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:16, title: '车辆运营数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:20, title: '财务运营数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },

                {
                    field: 'contractNo', align: "center",colspan:4, title: '客户数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:4, title: '线索数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:2, title: '渠道数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:6, title: '维保数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
            ],
            /*第二行*/
            [
                {
                    field: 'longNumber', align: "center",rowspan:2, title: '经租用车中', templet: function (d) {
                        return isEmpty(d.longNumber);
                    }
                },
                {
                    field: 'rentNumber', align: "center",rowspan:2, title: '以租代购用车中', templet: function (d) {
                        return isEmpty(d.rentNumber);
                    }
                },
                {
                    field: 'zsNumber', align: "center",rowspan:2, title: '展示车用车中', templet: function (d) {
                        return isEmpty(d.zsNumber);
                    }
                },
                {
                    field: 'sjNumber', align: "center",rowspan:2, title: '试驾车用车中', templet: function (d) {
                        return isEmpty(d.sjNumber);
                    }
                },

                {
                    field: 'rzNumber', align: "center",rowspan:2, title: '融租用车中', templet: function (d) {
                        return isEmpty(d.rzNumber);
                    }
                },
                {
                    field: 'zgNumber', align: "center",rowspan:2, title: '直购已出售', templet: function (d) {
                        return isEmpty(d.zgNumber);
                    }
                },
                {
                    field: 'byNumber', align: "center",rowspan:2, title: '备用车用车中', templet: function (d) {
                        return isEmpty(d.byNumber);
                    }
                },
                {
                    field: 'wxNumber', align: "center",rowspan:2, title: '维修中车辆', templet: function (d) {
                        return isEmpty(d.wxNumber);
                    }
                },
                {
                    field: 'zbNumber', align: "center",rowspan:2, title: '整备中车辆', templet: function (d) {
                        return isEmpty(d.zbNumber);
                    }
                },
                {
                    field: 'kxNumber', align: "center",rowspan:2, title: '车辆空闲率', templet: function (d) {
                        return isEmpty(d.kxNumber);
                    }
                },
                {
                    field: 'fcNumber', align: "center",rowspan:2, title: '新增发车单', templet: function (d) {
                        return isEmpty(d.fcNumber);
                    }
                },
                {
                    field: 'cdNumber', align: "center",rowspan:2, title: '新增车辆订单', templet: function (d) {
                        return isEmpty(d.cdNumber);
                    }
                },
                {
                    field: 'xbNumber', align: "center",rowspan:2, title: '新增备用车', templet: function (d) {
                        return isEmpty(d.xbNumber);
                    }
                },
                {
                    field: 'tcNumber', align: "center",rowspan:2, title: '退车数', templet: function (d) {
                        return isEmpty(d.tcNumber);
                    }
                },
                {
                    field: 'hcNumber', align: "center",rowspan:2, title: '换车数', templet: function (d) {
                        return isEmpty(d.hcNumber);
                    }
                },
                {
                    field: 'cgNumber', align: "center",rowspan:2,title: '新增采购车辆数', templet: function (d) {
                        return isEmpty(d.cgNumber);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:4, title: '应收金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:4, title: '实收金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'unpaidAmount', align: "center",rowspan:2, title: '当日未收金额', templet: function (d) {
                        return isEmpty(d.currentMonthWs);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:2, title: '应退金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },

                {
                    field: 'contractNo', align: "center",colspan:2, title: '已退金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },

                {
                    field: 'notCurrentDayAmount', align: "center",rowspan:2, title: '当日未退金额', templet: function (d) {
                        return isEmpty(d.notCurrentMonthAmount);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:2, title: '应付金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:2, title: '已付金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'wfunpaidAmount', align: "center",rowspan:2, title: '当日未付金额', templet: function (d) {
                        return isEmpty(d.wfMonthAmount);
                    }
                },
                {
                    field: 'corporateCustomers', align: "center",rowspan:2, title: '企业客户总数', templet: function (d) {
                        return isEmpty(d.corporateCustomers);
                    }
                },
                {
                    field: 'individualCustomers', align: "center",rowspan:2, title: '个人客户总数', templet: function (d) {
                        return isEmpty(d.individualCustomers);
                    }
                },
                {
                    field: 'newCorporateCustomers', align: "center",rowspan:2, title: '新增企业客户', templet: function (d) {
                        return isEmpty(d.newCorporateCustomers);
                    }
                },
                {
                    field: 'newIndividualCustomers', align: "center",rowspan:2, title: '新增个人客户', templet: function (d) {
                        return isEmpty(d.newIndividualCustomers);
                    }
                },
                {
                    field: 'enterpriseClues', align: "center",rowspan:2, title: '企业线索总数', templet: function (d) {
                        return isEmpty(d.enterpriseClues);
                    }
                },
                {
                    field: 'personalClues', align: "center",rowspan:2, title: '个人线索总数', templet: function (d) {
                        return isEmpty(d.personalClues);
                    }
                },
                { field: 'newEnterpriseClues', align: "center",rowspan:2, title: '新增企业线索', templet: function (d) {  return isEmpty(d.newEnterpriseClues);  } },
                { field: 'newPersonalClues', align: "center",rowspan:2, title: '新增个人线索', templet: function (d) { return isEmpty(d.newPersonalClues); }  },

                { field: 'channels', align: "center",rowspan:2, title: '渠道总数', templet: function (d) { return isEmpty(d.channels); } },
                { field: 'newChannels', align: "center",rowspan:2, title: '新增渠道', templet: function (d) { return isEmpty(d.newChannels); }  },

                { field: 'insuranceCost', align: "center",rowspan:2, title: '保险费用', templet: function (d) { return isEmpty(d.insuranceCost); } },
                { field: 'repairCost', align: "center",rowspan:2, title: '维修费用', templet: function (d) { return isEmpty(d.repairCost); } },
                { field: 'yearlyCost', align: "center",rowspan:2, title: '年检费用', templet: function (d) { return isEmpty(d.yearlyCost); } },
                {
                    field: 'dangerCost', align: "center",rowspan:2, title: '出险费用', templet: function (d) {
                        return isEmpty(d.dangerCost);
                    }
                },
                { field: 'regulationsCost', align: "center",rowspan:2, title: '违章费用', templet: function (d) {  return isEmpty(d.regulationsCost);  } },
                { field: 'maintainCost', align: "center",rowspan:2, title: '保养费用', templet: function (d) {  return isEmpty(d.maintainCost);  }  },
            ],
            /*第三行*/
            [
                { field: 'yscashDeposit', align: "center", title: '保证金', templet: function (d) { return isEmpty(d.yscashDeposit); }  },
                { field: 'ysdownPayment', align: "center", title: '首付款', templet: function (d) { return isEmpty(d.ysdownPayment); } },
                { field: 'ysmonthlyRent', align: "center", title: '租金', templet: function (d) { return isEmpty(d.ysmonthlyRent);  }  },
                { field: 'ysother', align: "center", title: '其他', templet: function (d) { return isEmpty(d.ysother); } },

                {field: 'shcashDeposit', align: "center",title: '保证金', templet: function (d) { return isEmpty(d.shcashDeposit);  } },
                {field: 'shdownPayment', align: "center", title: '首付款', templet: function (d) { return isEmpty(d.shdownPayment); } },
                {field: 'shmonthlyRent', align: "center", title: '租金', templet: function (d) { return isEmpty(d.shmonthlyRent); } },
                {field: 'shother', align: "center", title: '其他', templet: function (d) {  return isEmpty(d.shother);  }  },

                {field: 'shouldAmount', align: "center", title: '结算款', templet: function (d) {  return isEmpty(d.shouldAmount);  } },
                {field: 'otherShouldAmount', align: "center", title: '其他', templet: function (d) {  return isEmpty(d.otherShouldAmount); } },

                {field: 'aetiredAmount', align: "center", title: '结算款', templet: function (d) { return isEmpty(d.aetiredAmount);  } },
                {field: 'otherAetiredAmount', align: "center", title: '其他', templet: function (d) { return isEmpty(d.otherAetiredAmount); } },

                {field: 'amountDue', align: "center", title: '保证金/首付款/租金', templet: function (d) {  return isEmpty(d.amountDue); } },
                {field: 'yfother', align: "center", title: '其他', templet: function (d) { return isEmpty(d.yfother);  } },

                {field: 'amountPaid', align: "center", title: '保证金/首付款/租金', templet: function (d) {  return isEmpty(d.amountPaid); } },
                {field: 'ykother', align: "center", title: '其他', templet: function (d) { return isEmpty(d.ykother); } },

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
        }
    });
}
// 每月经营报表
function initMonthTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        cellMinWidth: 150,
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'report/financeReport/listCompanyMonthlyOperateReport',
        cols: [
            [
                /*第一行*/
                {
                    field: 'deptName', align: "center",rowspan:3, title: '所属公司', templet: function (d) {
                        return isEmpty(d.deptName);
                    }
                },
                {
                    field: 'statisticalSate', align: "center",rowspan:3, title: '统计日期', templet: function (d) {
                        return isEmpty(d.statisticalSate);
                    }
                },
                {
                    field: 'carNumber', align: "center",rowspan:3 , title: '车辆总数', templet: function (d) {
                        return isEmpty(d.carNumber);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:16, title: '车辆运营数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:24, title: '财务运营数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },

                {
                    field: 'contractNo', align: "center",colspan:4, title: '客户数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:4, title: '线索数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:2, title: '渠道数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:6, title: '维保数据', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
            ],
            /*第二行*/
            [
                {
                    field: 'longNumber', align: "center",rowspan:2, title: '经租用车中', templet: function (d) {
                        return isEmpty(d.longNumber);
                    }
                },
                {
                    field: 'rentNumber', align: "center",rowspan:2, title: '以租代购用车中', templet: function (d) {
                        return isEmpty(d.rentNumber);
                    }
                },
                {
                    field: 'zsNumber', align: "center",rowspan:2, title: '展示车用车中', templet: function (d) {
                        return isEmpty(d.zsNumber);
                    }
                },
                {
                    field: 'sjNumber', align: "center",rowspan:2, title: '试驾车用车中', templet: function (d) {
                        return isEmpty(d.sjNumber);
                    }
                },
                {
                    field: 'rzNumber', align: "center",rowspan:2, title: '融租用车中', templet: function (d) {
                        return isEmpty(d.rzNumber);
                    }
                },
                {
                    field: 'zgNumber', align: "center",rowspan:2, title: '直购已出售', templet: function (d) {
                        return isEmpty(d.zgNumber);
                    }
                },
                {
                    field: 'byNumber', align: "center",rowspan:2, title: '备用车用车中', templet: function (d) {
                        return isEmpty(d.byNumber);
                    }
                },
                {
                    field: 'wxNumber', align: "center",rowspan:2, title: '维修中车辆', templet: function (d) {
                        return isEmpty(d.wxNumber);
                    }
                },
                {
                    field: 'zbNumber', align: "center",rowspan:2, title: '整备中车辆', templet: function (d) {
                        return isEmpty(d.zbNumber);
                    }
                },
                {
                    field: 'kxNumber', align: "center",rowspan:2, title: '车辆空闲率', templet: function (d) {
                        return isEmpty(d.kxNumber);
                    }
                },
                {
                    field: 'fcNumber', align: "center",rowspan:2, title: '新增发车单', templet: function (d) {
                        return isEmpty(d.fcNumber);
                    }
                },
                {
                    field: 'cdNumber', align: "center",rowspan:2, title: '新增车辆订单', templet: function (d) {
                        return isEmpty(d.cdNumber);
                    }
                },
                {
                    field: 'xbNumber', align: "center",rowspan:2, title: '新增备用车', templet: function (d) {
                        return isEmpty(d.xbNumber);
                    }
                },
                {
                    field: 'tcNumber', align: "center",rowspan:2, title: '退车数', templet: function (d) {
                        return isEmpty(d.tcNumber);
                    }
                },
                {
                    field: 'hcNumber', align: "center",rowspan:2, title: '换车数', templet: function (d) {
                        return isEmpty(d.hcNumber);
                    }
                },
                {
                    field: 'cgNumber', align: "center",rowspan:2, title: '新增采购车辆数', templet: function (d) {
                        return isEmpty(d.cgNumber);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:4, title: '应收金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:4, title: '实收金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'currentMonthWs', align: "center",rowspan:2, title: '当月未收金额', templet: function (d) {
                        return isEmpty(d.currentMonthWs);
                    }
                },
                {
                    field: 'lastMonthWs', align: "center",rowspan:2, title: '往月未收金额', templet: function (d) {
                        return isEmpty(d.lastMonthWs);
                    }
                },
                {
                    field: 'currentMonthOverAmount', align: "center",rowspan:2, title: '当月逾期欠款', templet: function (d) {
                        return isEmpty(d.currentMonthOverAmount);
                    }
                },
                {
                    field: 'lastMonthOverAmount', align: "center",rowspan:2, title: '往月逾期欠款', templet: function (d) {
                        return isEmpty(d.lastMonthOverAmount);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:2, title: '应退金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },

                {
                    field: 'contractNo', align: "center",colspan:2, title: '已退金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },

                {
                    field: 'notCurrentMonthAmount', align: "center",rowspan:2, title: '当月未退金额', templet: function (d) {
                        return isEmpty(d.notCurrentMonthAmount);
                    }
                },
                {
                    field: 'notLastMonthAmount', align: "center",rowspan:2, title: '往月未退金额', templet: function (d) {
                        return isEmpty(d.notLastMonthAmount);
                    }
                },

                {
                    field: 'contractNo', align: "center",colspan:2, title: '应付金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'contractNo', align: "center",colspan:2, title: '已付金额', templet: function (d) {
                        return isEmpty(d.contractNo);
                    }
                },
                {
                    field: 'wfMonthAmount', align: "center",rowspan:2, title: '当月未付金额', templet: function (d) {
                        return isEmpty(d.wfMonthAmount);
                    }
                },
                {
                    field: 'wfLastMonthAmount', align: "center",rowspan:2, title: '往月未付金额', templet: function (d) {
                        return isEmpty(d.wfLastMonthAmount);
                    }
                },

                {
                    field: 'corporateCustomers', align: "center",rowspan:2, title: '企业客户总数', templet: function (d) {
                        return isEmpty(d.corporateCustomers);
                    }
                },
                {
                    field: 'individualCustomers', align: "center",rowspan:2, title: '个人客户总数', templet: function (d) {
                        return isEmpty(d.individualCustomers);
                    }
                },
                {
                    field: 'newCorporateCustomers', align: "center",rowspan:2, title: '新增企业客户', templet: function (d) {
                        return isEmpty(d.newCorporateCustomers);
                    }
                },
                {
                    field: 'newIndividualCustomers', align: "center",rowspan:2, title: '新增个人客户', templet: function (d) {
                        return isEmpty(d.newIndividualCustomers);
                    }
                },


                {
                    field: 'enterpriseClues', align: "center",rowspan:2, title: '企业线索总数', templet: function (d) {
                        return isEmpty(d.enterpriseClues);
                    }
                },
                {
                    field: 'personalClues', align: "center",rowspan:2, title: '个人线索总数', templet: function (d) {
                        return isEmpty(d.personalClues);
                    }
                },
                {
                    field: 'newEnterpriseClues', align: "center",rowspan:2, title: '新增企业线索', templet: function (d) {
                        return isEmpty(d.newEnterpriseClues);
                    }
                },
                {
                    field: 'newPersonalClues', align: "center",rowspan:2, title: '新增个人线索', templet: function (d) {
                        return isEmpty(d.newPersonalClues);
                    }
                },

                {
                    field: 'channels', align: "center",rowspan:2, title: '渠道总数', templet: function (d) {
                        return isEmpty(d.channels);
                    }
                },
                {
                    field: 'newChannels', align: "center",rowspan:2, title: '新增渠道', templet: function (d) {
                        return isEmpty(d.newChannels);
                    }
                },


                {
                    field: 'insuranceCost', align: "center",rowspan:2, title: '保险费用', templet: function (d) {
                        return isEmpty(d.insuranceCost);
                    }
                },
                {
                    field: 'repairCost', align: "center",rowspan:2, title: '维修费用', templet: function (d) {
                        return isEmpty(d.repairCost);
                    }
                },
                {
                    field: 'yearlyCost', align: "center",rowspan:2, title: '年检费用', templet: function (d) {
                        return isEmpty(d.yearlyCost);
                    }
                },
                {
                    field: 'dangerCost', align: "center",rowspan:2, title: '出险费用', templet: function (d) {
                        return isEmpty(d.dangerCost);
                    }
                },
                {
                    field: 'regulationsCost', align: "center",rowspan:2, title: '违章费用', templet: function (d) {
                        return isEmpty(d.regulationsCost);
                    }
                },
                {
                    field: 'maintainCost', align: "center",rowspan:2, title: '保养费用', templet: function (d) {
                        return isEmpty(d.maintainCost);
                    }
                },




            ],
            /*第三行*/
            [
                {
                    field: 'yscashDeposit', align: "center", title: '保证金', templet: function (d) {
                        return isEmpty(d.yscashDeposit);
                    }
                },
                {
                    field: 'ysdownPayment', align: "center", title: '首付款', templet: function (d) {
                        return isEmpty(d.ysdownPayment);
                    }
                },
                {
                    field: 'ysmonthlyRent', align: "center", title: '租金', templet: function (d) {
                        return isEmpty(d.ysmonthlyRent);
                    }
                },
                {
                    field: 'ysother', align: "center", title: '其他', templet: function (d) {
                        return isEmpty(d.ysother);
                    }
                },

                {
                    field: 'shcashDeposit', align: "center", title: '保证金', templet: function (d) {
                        return isEmpty(d.shcashDeposit);
                    }
                },
                {
                    field: 'shdownPayment', align: "center", title: '首付款', templet: function (d) {
                        return isEmpty(d.shdownPayment);
                    }
                },
                {
                    field: 'shmonthlyRent', align: "center", title: '租金', templet: function (d) {
                        return isEmpty(d.shmonthlyRent);
                    }
                },
                {
                    field: 'shother', align: "center", title: '其他', templet: function (d) {
                        return isEmpty(d.shother);
                    }
                },

                {
                    field: 'shouldAmount', align: "center", title: '结算款', templet: function (d) {
                        return isEmpty(d.shouldAmount);
                    }
                },
                {
                    field: 'otherShouldAmount', align: "center", title: '其他', templet: function (d) {
                        return isEmpty(d.otherShouldAmount);
                    }
                },

                {
                    field: 'aetiredAmount', align: "center", title: '结算款', templet: function (d) {
                        return isEmpty(d.aetiredAmount);
                    }
                },
                {
                    field: 'otherAetiredAmount', align: "center", title: '其他', templet: function (d) {
                        return isEmpty(d.otherAetiredAmount);
                    }
                },

                {
                    field: 'amountDue', align: "center", title: '保证金/首付款/租金', templet: function (d) {
                        return isEmpty(d.amountDue);
                    }
                },
                {
                    field: 'yfother', align: "center", title: '其他', templet: function (d) {
                        return isEmpty(d.yfother);
                    }
                },

                {
                    field: 'amountPaid', align: "center", title: '保证金/首付款/租金', templet: function (d) {
                        return isEmpty(d.amountPaid);
                    }
                },
                {
                    field: 'ykother', align: "center", title: '其他', templet: function (d) {
                        return isEmpty(d.ykother);
                    }
                },

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

        }
    });
}
