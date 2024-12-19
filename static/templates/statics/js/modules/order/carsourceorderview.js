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

    layui.table.on('tool(payPlanList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.editPayPlan(data);
        } else if (layEvent === 'generPayable') {
            vm.generateBill(data);
        }
    });

    layui.table.on('tool(payableList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'payBillConfirm') {
            vm.payBillConfirm(data);
        }
    });

    layui.form.on('checkbox(pay_all)', function(){
        var checked = $(this)[0].checked;
        if (receivablesDatas != null && receivablesDatas.length > 0){
            receivablesDatas.forEach(function (d) {
                ysCheckedChange(d, d.id, checked);
            });
        }
        var status = $(this).prop("checked");
        $.each($("input[name=pay_one]"), function (i, value) {
            if (!value.disabled)
                $(this).prop("checked", status);
        });
        layui.form.render();
    });

    layui.form.on('checkbox(pay_one)', function(){
        var checked = $(this)[0].checked;
        var id = $(this).attr("data-payId");
        var obj = receivablesDatas.filter(function (d) {
            return d.id == id;
        })[0];
        ysCheckedChange(obj, id, checked);
        layui.form.render();
    });

/*    layui.form.on('checkbox(plan_all)', function(){
        var checked = $(this)[0].checked;
        if (planDatas != null && planDatas.length > 0){
            planDatas.forEach(function (d) {
                planChange(d, d.id, checked);
            });
        }
        var status = $(this).prop("checked");
        $.each($("input[name=plan_one]"), function (i, value) {
            if (!value.disabled)
                $(this).prop("checked", status);
        });
        layui.form.render();
    });

    layui.form.on('checkbox(plan_one)', function(){
        var checked = $(this)[0].checked;
        var id = $(this)[0].dataset.id;
        var obj = planDatas.filter(function (d) {
            return d.id == id;
        })[0];

        planChange(obj, id, checked);
        checkAllPlanChange();
        layui.form.render();
    });*/


/*    layui.form.on('checkbox(payPlanList)', function(obj){
         
        var data = obj.data;
        var type = obj.type;
        if (type == 'plan_one'){
            planChange(data, data.id, obj.checked);
        } else if (type == 'plan_all'){
            if (planDatas != null && planDatas.length > 0){
                planDatas.forEach(function (d) {
                    planChange(d, d.id, obj.checked);
                });
            }
        }
    });*/

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        ids:[],
        payIds:[],
        detailsTabContentList: ['车辆来源订单详情','付款计划','操作记录'],
        detailsSupTabContentList: [],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '车辆来源订单信息',
        carSourceOrder: {},
        contraccarSource:{},
        fileList: [],
        fileLstId: '0',
        feeItemLst: [],
        feeItemId: '',
        orderRelerecord: {
            feeLst: []
        },
        listTransferOrderSettle:[],
        listRefundOrderSettle:[],
        listSourceOrderPayPlan:[],
        listPayable:[],
        listPaid:[]
    },
    created: function(){
        var _this = this;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (param) {
            console.log(param,typeof param);
            this.detailsTabContentListActiveIndex = param;
            if (param == 2) {
                this.detailsSupTabContentListActiveValue = '操作记录';
                console.log(this.detailsSupTabContentListActiveValue);
            } else if (param == 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '车辆来源订单信息';
                vm.reloadPayBillPage(vm.carSourceOrder.id,1);
                vm.reloadPaidBillPage(vm.carSourceOrder.id,2);
            } else if(param == 1){
                this.detailsSupTabContentListActiveValue = '付款计划';
                vm.reloadPayBillPage(vm.carSourceOrder.id,1);
                vm.reloadPaidBillPage(vm.carSourceOrder.id,2);
            }
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;

            vm.reloadPayBillPage(vm.carSourceOrder.id,1);
            vm.reloadPaidBillPage(vm.carSourceOrder.id,2);
        },

        detail: function (id,carSourceType) {
            if(carSourceType==1 ){// 经租
                $("#ghModel").css('display','none');
                $("#ghmodels").css('display','none');
                $("#totalPrice").hide();
                vm.detailsSupTabContentList.push('车辆来源订单信息','车辆来源合同信息','应付账单','已付账单','退车结算信息','付款计划', '操作记录');
            } else if(carSourceType == 2){//直购
                $("#ghModel").css('display','none');
                $("#ghmodels").css('display','none');
                $("#jzyzdgModel").css('display','none');
                $("#totalPrice").show();
                vm.detailsSupTabContentList.push('车辆来源订单信息','车辆来源合同信息','应付账单','已付账单','退车结算信息','付款计划', '操作记录');
            } else if(carSourceType == 3){//以租代购
                // $("#ghModel").css('display','block');
                // $("#ghmodels").css('display','block');
                $("#totalPrice").hide();
                vm.detailsSupTabContentList.push('车辆来源订单信息','车辆来源合同信息','应付账单','已付账单','退车结算信息','过户信息','付款计划', '操作记录');
            }
            // 获取详情
            $.ajax({
                type: "POST",
                url: baseURL + "pay/carsourceorder/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.carSourceOrder = r.carSourceOrder;
                        if(r.carSourceOrder.orderRelerecord != null){
                            if(r.carSourceOrder.orderRelerecord.feeLst != null){
                                vm.orderRelerecord.feeLst = r.carSourceOrder.orderRelerecord.feeLst;
                                vm.reloadFeeItem();
                            }
                        }

                        // 合同数据
                        if(r.carSourceOrder.contraccarSource != null){
                            vm.contraccarSource = r.carSourceOrder.contraccarSource;
                            if(r.carSourceOrder.contraccarSource.fileLst.length == 0){
                                $("#contracFileModel").css('display','none');
                            }
                        }

                        // 过户数据
                        if(r.carSourceOrder.listTransferOrderSettle != null){
                            vm.listTransferOrderSettle = r.carSourceOrder.listTransferOrderSettle;
                            console.log(vm.listTransferOrderSettle);
                            vm.ghReloadFeeItem();
                        }

                        // 退车结算
                        if(r.carSourceOrder.listRefundOrderSettle != null){
                            vm.listRefundOrderSettle = r.carSourceOrder.listRefundOrderSettle;
                            vm.tcReloadFeeItem();
                        }

                        // 付款计划
                        if(r.carSourceOrder.listSourceOrderPayPlan != null){
                            vm.listSourceOrderPayPlan = r.carSourceOrder.listSourceOrderPayPlan;
                            vm.reloadPlanItem();
                        }

                        // 应付账单
                        if(r.carSourceOrder.listPayable != null){
                            vm.listPayable = r.carSourceOrder.listPayable;
                            vm.reloadPayableItem();
                        }

                        // 已付账单
                        if(r.carSourceOrder.listPaid != null){
                            vm.listPaid = r.carSourceOrder.listPaid;
                            vm.reloadPaidItem();
                        }

                        // 查询附件无数据，则该页面属性不展示
                        if(r.carSourceOrder.fileList.length == 0){
                            $("#fileModel").css('display','none');
                        }
                        vm.fileList = r.carSourceOrder.fileList;
                    }
                    else{
                        alert(r.msg);
                    }
                }
            });
        },

        reloadPaidItem:function (){
            layui.table.reload('paidList', {
                page: {
                    curr: getCurrPage('paidList', vm.listPaid.length)
                },
                data: vm.listPaid});
        },

        reloadPayableItem:function(){
            layui.table.reload('payableList', {
                page: {
                    curr: getCurrPage('payableList', vm.listPayable.length)
                },
                data: vm.listPayable});
        },

        reloadFeeItem: function () {
            layui.table.reload('feeLstid', {
                page: {
                    curr: getCurrPage('feeLstid', vm.orderRelerecord.feeLst.length)
                },
                data: vm.orderRelerecord.feeLst});
        },

        ghReloadFeeItem: function () {
            layui.table.reload('ghfeeLstid', {
                page: {
                    curr: getCurrPage('ghfeeLstid', vm.listTransferOrderSettle.length)
                },
                data: vm.listTransferOrderSettle});
        },

        tcReloadFeeItem: function (){
            layui.table.reload('tcfeeLstid', {
                page: {
                    curr: getCurrPage('tcfeeLstid', vm.listRefundOrderSettle.length)
                },
                data: vm.listRefundOrderSettle});
        },

        reloadPlanItem: function (){
            layui.table.reload('payPlanList', {
                page: {
                    curr: getCurrPage('payPlanList', vm.listSourceOrderPayPlan.length)
                },
                data: vm.listSourceOrderPayPlan
            });
            //vm.reloadPlanJson(vm.listSourceOrderPayPlan);
        },

        reloadPlanJson:function (data){
            let  d = data;
            for (var k = 0, length = d.length; k < length; k++) {
                d[k].LAY_CHECKED = false;
                if ($.inArray(d[k].id, vm.ids) >= 0) {
                    d[k].LAY_CHECKED = true;
                }
            }
        },

        // 重新加载付款计划列表
        reloadPlanPage: function (sourceOrderId){
            $.ajax({
                type: "POST",
                url: baseURL + "financial/sourceorderpayplan/queryPlanList",
                dataType:"JSON",
                data:{"sourceOrderId":sourceOrderId},
                success: function(r){
                    vm.listSourceOrderPayPlan = r.listSourceOrderPayPlan;
                    vm.ids=[];
                    layui.table.reload('payPlanList', {
                        data: vm.listSourceOrderPayPlan
                    });

                    vm.reloadPlanJson(vm.listSourceOrderPayPlan);
                }
            });
        },

        // 重新加载应付账单列表
        reloadPayBillPage:function (sourceOrderId,status){
            $.ajax({
                type: "POST",
                url: baseURL + "pay/carsourceorder/queryPayBillPage",
                dataType:"JSON",
                data:{"sourceOrderId":sourceOrderId,"status":status},
                success: function(r){
                    vm.listPayable = r.listPayable;
                    vm.payIds=[];
                    layui.table.reload('payableList', {
                        data: vm.listPayable
                    });

                    vm.reloadPayBillJson(vm.listPayable);
                }
            });
        },

        reloadPayBillJson:function (data){
            let  d = data;
            for (var k = 0, length = d.length; k < length; k++) {
                d[k].LAY_CHECKED = false;
                if ($.inArray(d[k].id, vm.payIds) >= 0) {
                    d[k].LAY_CHECKED = true;
                }
            }
        },

        // 重新加载已付账单列表
        reloadPaidBillPage:function (sourceOrderId,status){
            $.ajax({
                type: "POST",
                url: baseURL + "pay/carsourceorder/queryPayBillPage",
                dataType:"JSON",
                data:{"sourceOrderId":sourceOrderId,"status":status},
                success: function(r){
                    vm.listPaid = r.listPayable;
                    layui.table.reload('paidList', {
                        data: vm.listPaid
                    });
                }
            });
        },

        // 车辆来源订单附件查看
        viewAccessory:function(objType){
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("objId", vm.carSourceOrder.id);
            var index = layer.open({
                title: "订单 > 车辆来源订单 > 车辆来源订单详情 > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                }
            });
            layer.full(index);
        },

        // 车辆来源合同附件查看
        viewContracAccessory:function(objType){
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("objId", vm.contraccarSource.id);
            var index = layer.open({
                title: "合同 > 车辆来源合同  > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                }
            });
            layer.full(index);
        },

        // 编辑付款计划
        editPayPlan: function (data) {
            var index = layer.open({
                title: "编辑付款计划",
                type: 2,
                area: ['80%', '60%'],
                content: tabBaseURL + "modules/financial/editPayPlan.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(data);
                },
                end: function(){
                    layer.close(index);
                }
            });
        },

        // 生成应付单
        generateBill: function (data) {
            vm.sourceOrderPayPlan = data;
            var url = "pay/carsourceorder/generatePayBill";
            confirm('确定生成应付账单吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.sourceOrderPayPlan),
                    success: function(r){
                        RemoveLoading();
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                vm.reloadPlanPage(vm.carSourceOrder.id);
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },

        // 批量生成应付单
        batchGeneratebill:function (){
            if(vm.ids.length == 0){
                alert("未选择需要生成应付账单的数据");
                return ;
            }

            var planIds = [];
            $.each(vm.ids, function(index, item) {
                planIds.push(item);
            });

            console.log(planIds);
            confirm('确定批量生成应付账单吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "pay/carsourceorder/batchGeneratePayBill",
                    contentType: "application/json",
                    data: JSON.stringify(planIds),
                    success: function (r) {
                        RemoveLoading();
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                vm.reloadPlanPage(vm.carSourceOrder.id);
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },

        // 新增应付账单
        addPayBill:function (type){
            var index = layer.open({
                title: type == 1?'新增应付账单':'新增已付账单',
                type: 2,
                area: ['100%', '100%'],
                content: tabBaseURL + "modules/financial/addPayBill.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(vm.carSourceOrder,type, 1);
                },
                end: function(){
                    layer.close(index);
                }
            });
        },

        // 新增已付账款
        // addPaidBill:function (){
        //     var index = layer.open({
        //         title: "新增已付账款",
        //         type: 2,
        //         area: ['100%', '100%'],
        //         content: tabBaseURL + "modules/financial/addPayBill.html",
        //         success: function(layero, index) {
        //             var iframe = window['layui-layer-iframe' + index];
        //             iframe.sendData(vm.carSourceOrder,2);
        //         },
        //         end: function(){
        //             layer.close(index);
        //         }
        //     });
        // },

        // 付款确认操作
        payBillConfirm:function (data){
            var index = layer.open({
                title: "付款确认",
                type: 2,
                area: ['85%', '90%'],
                content: tabBaseURL + "modules/financial/paybillconfirm.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(data,vm.carSourceOrder);
                },
                end: function(){
                    layer.close(index);
                }
            });
        },

        // 批量付款
        batchPayBill:function (){
            if(vm.payIds.length == 0){
                alert("未选择需要生成应付账单的数据");
                return ;
            }
            var payIds = [];
            $.each(vm.payIds, function(index, item) {
                payIds.push(item);
            });
            console.log(payIds.length);
            var index = layer.open({
                title: "批量付款确认",
                type: 2,
                area: ['80%', '70%'],
                content: tabBaseURL + "modules/financial/batchpaybillconfirm.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(payIds,vm.carSourceOrder);
                },
                end: function(){
                    layer.close(index);
                }
            });
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    //initData();
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[0];
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function initTable(table, soulTable) {
    // 操作记录
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: window.localStorage.getItem("id"),
            auditType: 32
        },
        cols: [[
            {field:'operatorName', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    // 费用项
    table.render({
        id: 'feeLstid',
        elem: '#feeLst',
        data: vm.orderRelerecord.feeLst,
        cols: [[
            {field:'typeFieldDesc', minWidth:150, width:150, align:'center', title: '类型'},
            {field:'money', minWidth:150, width:150, align:'center', title: '金额/元',  event: 'money'},
            {field:'paymentMethod', minWidth:350, width:350, align:'center', title: '付款方式', templet: function (d) {
                    if(d.paymentMethod == 5){
                        return '一次性付清';
                    } else {
                        return '--';
                    }

                }},
            {field:'timePayment1st', minWidth:350, width:350, align:'center', title: '选择付款日期',  templet: function (d) {
                    var txt = d.timePayment1st;
                    if ((/\d+/).test(txt)){
                        txt = isEmpty(dateFormatYMD(txt));
                    }else if (d.typeFieldName === 'monthly_rent'){
                        txt = '--';
                    }else txt = '请选择付款日期';
                    return txt;
                }},

        ]],
        page: true,
        limits: [5, 8, 15],
        limit: 5,
        autoColumnWidth: {
            init: true
        },
        done: function (res, curr, count) {
            $('td[data-field="paymentMethod"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;
                var value = vm.orderRelerecord.feeLst.filter(function (value) {
                    return value.serializeId == serializeId;
                })[0].paymentMethod;
                $(this).val(value);
            });
            layui.form.render('select');
            $('td[data-field="timePayment1st"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
        }
    });
    // 过户
    table.render({
        id: 'ghfeeLstid',
        elem: '#ghfeeLst',
        data: vm.listTransferOrderSettle,
        cols: [[
            {field:'transferDate',align:"center", title: '预计过户时间'},
            {field:'actualTransferDate',align:"center", title: '实际过户时间'},
            {field:'remark', align:"center",title: '过户备注'},
            {field:'refundAmount',align:"center",title: '可退金额'},
            {field:'payableAmount', align:"center",title: '应付金额'},
            {field:'', align:"center",title: '附件',templet: function (d) {
                return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.id+"\',\'"+36+"\')>查看</a>";
            }},
            {field:'createTime',align:"center", title: '提交时间'},
            {field:'operationName',align:"center", title: '操作人'},

        ]],
        page: false,
        limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function (res, curr, count) {

        }
    });

    // 退车结算
    table.render({
        id: 'tcfeeLstid',
        elem: '#tcfeeLst',
        data: vm.listRefundOrderSettle,
        cols: [[
            {field:'settlementNo',align:"center", title: '退车单'},
            {field:'refundCarDate',align:"center", title: '退车时间'},
            {field:'refundCarReason', align:"center",title: '退车原因'},
            {field:'refundAmount',align:"center",title: '可退金额'},
            {field:'payableAmount', align:"center",title: '应付金额'},
            {field:'remark', align:"center",title: '备注'},
            {field:'', align:"center",title: '附件',templet: function (d) {
                return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.id+"\',\'"+35+"\')>查看</a>";
            }},
            {field:'createTime',align:"center", title: '提交时间'},
            {field:'operationName',align:"center", title: '操作人'},

        ]],
        page: false,
        limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function (res, curr, count) {

        }
    });

    // 付款计划
    var table_data=new Array();
    table.render({
        id: 'payPlanList',
        elem: '#payPlanList',
        data: vm.listSourceOrderPayPlan,
        cols: [[
            {
                type: 'checkbox',
                // fixed: 'left',
                width: '5%'
            },

            {field:'periodStr', width:'7%',align:"center", title: '期数',templet: function (d){
                 
                var today = new Date();
                //var today_time = FormatDate(today);
                var paid_time = d.paidDate+" 00:00:00";
                paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                paid_time= new Date(Date.parse(paid_time));
                if(today < paid_time){
                    if(d.period == 0 || d.period == null){
                        return "<span style='color: green;'>--</span>";
                    }else {
                        return "<span style='color: green;'>"+isEmpty(d.periodStr)+"</span>";
                    }
                } else {
                    if(d.period == 0 || d.period == null){
                        return "<span style='color: red;'>--</span>";
                    }else {
                        return "<span style='color: red;'>"+isEmpty(d.periodStr)+"</span>";
                    }
                }
            }},
            {field:'payType', width:'8%',align:"center", title: '付款类型',templet: function (d) {
                    var today = new Date();
                    //var today_time = FormatDate(today);
                    var paid_time = d.paidDate+" 00:00:00";
                    paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                    paid_time= new Date(Date.parse(paid_time));
                    if(today < paid_time){
                        if(d.payType == 1){
                            return "<span style='color: green;'>保证金</span>";
                        } else if(d.payType == 2){
                            return "<span style='color: green;'>月租金</span>";
                        }else if(d.payType == 3){
                            return "<span style='color: green;'>首付款</span>";
                        }else if(d.payType == 4){
                            return "<span style='color: green;'>退车结算款</span>";
                        }else if(d.payType == 5){
                            return "<span style='color: green;'>换车结算款</span>";
                        }else if(d.payType == 6){
                            return "<span style='color: green;'>备用车结算款</span>";
                        }else if(d.payType == 7){
                            return "<span style='color: green;'>整备费</span>";
                        }else if(d.payType == 8){
                            return "<span style='color: green;'>尾款</span>";
                        }else if(d.payType == 9){
                            return "<span style='color: green;'>定金</span>";
                        }else if(d.payType == 10){
                            return "<span style='color: green;'>其他费用</span>";
                        }else if(d.payType == 11){
                            return "<span style='color: green;'>车辆总单价</span>";
                        }else if(d.payType == 0){
                            return "<span style='color: green;'>其他</span>";
                        }else {
                            return "<span style='color: green;'>--</span>";
                        }
                    } else {
                        if(d.payType == 1){
                            return "<span style='color: red;'>保证金</span>";
                        } else if(d.payType == 2){
                            return "<span style='color: red;'>月租金</span>";
                        }else if(d.payType == 3){
                            return "<span style='color: red;'>首付款</span>";
                        }else if(d.payType == 4){
                            return "<span style='color: red;'>退车结算款</span>";
                        }else if(d.payType == 5){
                            return "<span style='color: red;'>换车结算款</span>";
                        }else if(d.payType == 6){
                            return "<span style='color: red;'>备用车结算款</span>";
                        }else if(d.payType == 7){
                            return "<span style='color: red;'>整备费</span>";
                        }else if(d.payType == 8){
                            return "<span style='color: red;'>尾款</span>";
                        }else if(d.payType == 9){
                            return "<span style='color: red;'>定金</span>";
                        }else if(d.payType == 10){
                            return "<span style='color: red;'>其他费用</span>";
                        }else if(d.payType == 11){
                            return "<span style='color: red;'>车辆总单价</span>";
                        }else if(d.payType == 0){
                            return "<span style='color: red;'>其他</span>";
                        }else {
                            return "<span style='color: red;'>--</span>";
                        }
                    }
            }},
            {field:'playStartDate', width:'10%', align:"center",title: '开始时间',templet: function (d){
                    var today = new Date();
                    //var today_time = FormatDate(today);
                    var paid_time = d.paidDate+" 00:00:00";
                    paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                    paid_time= new Date(Date.parse(paid_time));
                    if(today < paid_time){
                        return "<span style='color: green;'>"+isEmpty(d.playStartDate)+"</span>";
                    } else {
                        return "<span style='color: red;'>"+isEmpty(d.playStartDate)+"</span>";
                    }
            }},
            {field:'playEndDate', width:'10%',align:"center",title: '结束时间',templet: function (d){
                    var today = new Date();
                    //var today_time = FormatDate(today);
                    var paid_time = d.paidDate+" 00:00:00";
                    paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                    paid_time= new Date(Date.parse(paid_time));
                    if(today < paid_time){
                        return "<span style='color: green;'>"+isEmpty(d.playEndDate)+"</span>";
                    } else {
                        return "<span style='color: red;'>"+isEmpty(d.playEndDate)+"</span>";
                    }
            }},
            {field:'paidDate', width:'10%', align:"center",title: '应还日期',templet: function (d){
                    var today = new Date();
                    //var today_time = FormatDate(today);
                    var paid_time = d.paidDate+" 00:00:00";
                    paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                    paid_time= new Date(Date.parse(paid_time));
                    if(today < paid_time){
                        return "<span style='color: green;'>"+isEmpty(d.paidDate)+"</span>";
                    } else {
                        return "<span style='color: red;'>"+isEmpty(d.paidDate)+"</span>";
                    }
            }},
            {field:'paidAmount', width:'10%', align:"center",title: '应还总金额',templet: function (d){
                    var today = new Date();
                    //var today_time = FormatDate(today);
                    var paid_time = d.paidDate+" 00:00:00";
                    paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                    paid_time= new Date(Date.parse(paid_time));
                    if(today < paid_time){
                        return "<span style='color: green;'>"+isEmpty(d.paidAmount)+"</span>";
                    } else {
                        return "<span style='color: red;'>"+isEmpty(d.paidAmount)+"</span>";
                    }
            }},
            {field:'settlementType', width:'10%',align:"center", title: '还款状态',templet: function (d) {
                    var today = new Date();
                    //var today_time = FormatDate(today);
                    var paid_time = d.paidDate+" 00:00:00";
                    paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                    paid_time= new Date(Date.parse(paid_time));
                    if(today < paid_time){
                        if(d.settlementType == 1){
                            return "<span style='color: green;'>未出账单</span>";
                        } else if(d.settlementType == 2){
                            return "<span style='color: green;'>已出账单</span>";
                        } else {
                            return "<span style='color: green;'>--</span>";
                        }
                    } else {
                        if(d.settlementType == 1){
                            return "<span style='color: red;'>未出账单</span>";
                        } else if(d.settlementType == 2){
                            return "<span style='color: red;'>已出账单</span>";
                        } else {
                            return "<span style='color: red;'>--</span>";
                        }
                    }
            }},
            {field:'overdue', width:'10%',align:"center", title: '逾期天数',templet: function (d) {
                    var today = new Date();
                    //var today_time = FormatDate(today);
                    var paid_time = d.paidDate+" 00:00:00";
                    paid_time = paid_time.replace("-","/");//替换字符，变成标准格式
                    paid_time= new Date(Date.parse(paid_time));
                    if(today < paid_time){
                        return "<span style='color: green;'>"+isEmpty(d.overdue)+"</span>";
                    } else {
                        return "<span style='color: red;'>"+isEmpty(d.overdue)+"</span>";
                    }
            }},
            {title: '操作', width:'10%', templet:'#planBarTpl',align:"center"},
        ]],
        autoColumnWidth: {
            init: true
        },
        loading:true,
        page: true,
        limits: [10, 20, 50,100],
        limit: 10,
        done: function (res, curr, count) {

            table_data = res.data;
            var len = res.data.length;//当前页面数据长度
            for (var i = 0; i < res.data.length; i++) {
                for (var j = 0; j < vm.ids.length; j++) {
                    if (res.data[i].id == vm.ids[j]) {
                        res.data[i]["LAY_CHECKED"] = 'true';
                        var index = res.data[i]['LAY_TABLE_INDEX'];
                        //如果你的页面还有第二个表格，就是.list2
                        $('.payPlanList .layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                        $('.payPlanList .layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').next().addClass(
                            'layui-form-checked');
                    }
                }
            }

            var checkStatus = table.checkStatus('my-table');
            if(checkStatus.isAll){
                $('.layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
            }
        }
    });

    //监听全选单选，
    table.on('checkbox(payPlanList)', function(obj) {
        if(obj.checked==true){
            if(obj.type=='one'){
                vm.ids.push(obj.data.id);
            }else{
                for(var i=0;i<table_data.length;i++){
                    vm.ids.push(table_data[i].id);
                }
            }
        }else{
            if(obj.type=='one'){
                for(var i=0;i<vm.ids.length;i++){
                    if(vm.ids[i]==obj.data.id){
                        vm.ids.remove(i);
                    }
                }
            }else{
                for(var i=0;i<vm.ids.length;i++){
                    for(var j=0;j<table_data.length;j++){
                        if(vm.ids[i]==table_data[j].id){
                            vm.ids.remove(i);
                        }
                    }
                }
            }
        }
    });

    // 应付单
    var idss =new Array();
    var payable_data = new Array();
    table.render({
        id: 'payableList',
        elem: '#payableList',
        data: vm.listPayable,
        cols: [[
            {
                type: 'checkbox',
                fixed: 'left'
            },
            {field:'paymentNo',align:"center", title: '应付单',templet: function (d){
                    return isEmpty(d.paymentNo);
            }},
            {field:'paymentStatus',align:"center",minWidth:100, title: '付款状态',templet: function (d){
                if(d.paymentStatus != null){
                    if(d.paymentStatus == 1){
                        return "待付款";
                    } else {
                        return "已付款";
                    }
                } else {
                    return "--";
                }
            }},
            {field:'paymentType',align:"center", title: '付款类型',templet: function (d) {
                    if(d.paymentType == 1){
                        return "<span style='color: green;'>保证金</span>";
                    } else if(d.paymentType == 2){
                        return "<span style='color: green;'>月租金</span>";
                    }else if(d.paymentType == 3){
                        return "<span style='color: green;'>首付款</span>";
                    }else if(d.paymentType == 4){
                        return "<span style='color: green;'>退车结算款</span>";
                    }else if(d.paymentType == 5){
                        return "<span style='color: green;'>换车结算款</span>";
                    }else if(d.paymentType == 6){
                        return "<span style='color: green;'>备用车结算款</span>";
                    }else if(d.paymentType == 7){
                        return "<span style='color: green;'>整备费</span>";
                    }else if(d.paymentType == 8){
                        return "<span style='color: green;'>尾款</span>";
                    }else if(d.paymentType == 9){
                        return "<span style='color: green;'>定金</span>";
                    }else if(d.paymentType == 10){
                        return "<span style='color: green;'>其他费用</span>";
                    }else if(d.paymentType == 11){
                        return "<span style='color: green;'>车辆总单价</span>";
                    }else if(d.paymentType == 0){
                        return "<span style='color: green;'>"+isEmpty(d.paymentContent)+"</span>";
                    }else {
                        return "<span style='color: green;'>--</span>";
                    }
            }},
            {field:'billPeriods',align:"center", minWidth:240, title: '账单期数',templet: function (d){
                    return isEmpty(d.billPeriods);
                }},
            {field:'copeWithAmount', align:"center",title: '应付金额',templet: function (d){
                    return isEmpty(d.copeWithAmount);
                }},
            {field:'prepaidAmount', align:"center",title: '已付金额',templet: function (d){
                    return isEmpty(d.prepaidAmount);
                }},
            {field:'pendingPaymentAmount',align:"center",title: '待付金额',templet: function (d){
                    return isEmpty(d.pendingPaymentAmount);
                }},
            {field:'copeWithDate', align:"center",title: '应付日期',templet: function (d){
                    return isEmpty(d.copeWithDate);
                }},
            {title: '操作', width:120, templet:'#payableBarTpl',fixed:"right",align:"center"},
        ]],
        autoColumnWidth: {
            init: true
        },
        loading:true,
        page: false,
        limit: 500,
        done: function (res, curr, count) {
            payable_data = res.data;
            var len = res.data.length;//当前页面数据长度
            for (var i = 0; i < res.data.length; i++) {
                for (var j = 0; j < vm.payIds.length; j++) {
                    if (res.data[i].id == idss[j]) {
                        res.data[i]["LAY_CHECKED"] = 'true';
                        var index = res.data[i]['LAY_TABLE_INDEX'];
                        //如果你的页面还有第二个表格，就是.list2
                        $('.payPlanList .layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                        $('.payPlanList .layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').next().addClass(
                            'layui-form-checked');
                    }
                }
            }

            var checkStatus = table.checkStatus('my-table');
            if(checkStatus.isAll){
                $('.layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
            }
        }
    });

    //监听全选单选，
    table.on('checkbox(payableList)', function(obj) {
        if(obj.checked==true){
            if(obj.type=='one'){
                idss.push(obj.data.id);
                vm.payIds.push(obj.data.id);
            }else{
                for(var i=0;i<payable_data.length;i++){
                    idss.push(payable_data[i].id);
                    vm.payIds.push(payable_data[i].id);
                }
            }
        }else{
            if(obj.type=='one'){
                for(var i=0;i<vm.payIds.length;i++){
                    if(vm.payIds[i]==obj.data.id){
                        //idss.remove(i);
                        vm.payIds.splice(i, 1);
                    }
                }
            }else{
                for(var i=0;i<vm.payIds.length;i++){
                    for(var j=0;j<payable_data.length;j++){
                        if(vm.payIds[i]==payable_data[j].id){
                            //idss.remove(i);
                            //vm.payIds.remove(i);
                            vm.payIds.splice(i, 1);
                        }
                    }
                }
            }
        }
    });

    // 已付单
    table.render({
        id: 'paidList',
        elem: '#paidList',
        data: vm.listPaid,
        cols: [[
            {field:'paymentNo',align:"center", title: '已付单',templet: function (d){
                return isEmpty(d.paymentNo);
                }},
            {field:'paymentStatus',align:"center", title: '状态',templet: function (d){
                    if(d.paymentStatus != null){
                        if(d.paymentStatus == 1){
                            return "待付款";
                        } else if(d.paymentStatus == 2){
                            return "已付款";
                        }
                    } else {
                        return "--";
                    }
                }},
            {field:'paymentType',align:"center", title: '付款类型',templet: function (d) {
                    if(d.paymentType == 1){
                        return "<span style='color: green;'>保证金</span>";
                    } else if(d.paymentType == 2){
                        return "<span style='color: green;'>月租金</span>";
                    }else if(d.paymentType == 3){
                        return "<span style='color: green;'>首付款</span>";
                    }else if(d.paymentType == 4){
                        return "<span style='color: green;'>退车结算款</span>";
                    }else if(d.paymentType == 5){
                        return "<span style='color: green;'>换车结算款</span>";
                    }else if(d.paymentType == 6){
                        return "<span style='color: green;'>备用车结算款</span>";
                    }else if(d.paymentType == 7){
                        return "<span style='color: green;'>整备费</span>";
                    }else if(d.paymentType == 8){
                        return "<span style='color: green;'>尾款</span>";
                    }else if(d.paymentType == 9){
                        return "<span style='color: green;'>定金</span>";
                    }else if(d.paymentType == 10){
                        return "<span style='color: green;'>其他费用</span>";
                    }else if(d.paymentType == 11){
                        return "<span style='color: green;'>车辆总单价</span>";
                    }else if(d.paymentType == 0){
                        return "<span style='color: green;'>"+isEmpty(d.paymentContent)+"</span>";
                    }else {
                        return "<span style='color: green;'>--</span>";
                    }
                }},
            {field:'billPeriods',align:"center", minWidth:240, title: '账单期数',templet: function (d){
                    return isEmpty(d.billPeriods);
                }},
            {field:'copeWithAmount',align:"center",title: '应付金额',templet: function (d){
                    return isEmpty(d.copeWithAmount);
                }},
            {field:'prepaidAmount', align:"center",title: '已付金额',templet: function (d){
                    return isEmpty(d.prepaidAmount);
                }},
            {field:'copeWithDate', align:"center",title: '应付日期',templet: function (d){
                    return isEmpty(d.copeWithDate);
                }},
            {field:'realPayDate',align:"center", title: '实付日期',templet: function (d) {
                    return isEmpty(d.realPayDate);
                }},
            {field:'',align:"center", title: '支付凭证',templet: function (d) {
                    return "--";
                }},
            {field:'realPayDate',align:"center", title: '收款确认时间',templet: function (d) {
                    return isEmpty(d.realPayDate);
                }},
            {field:'operationUser',align:"center", title: '操作人',templet: function (d) {
                    return isEmpty(d.operationUser);
                }},
        ]],
        autoColumnWidth: {
            init: true
        },
        loading:true,
        page: false,
        limit: 500,
        done: function (res, curr, count) {

        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function fileView (id,type) {
    window.localStorage.setItem("objId", id);
    window.localStorage.setItem("objType", type);
    var title = "";
    if(type == "36"){
        title = "车辆来源订单 > 过户结算 > 附件查看"
    } else if(type == "35"){
        title = "车辆来源订单 > 退车结算 > 附件查看"
    }
    var index = layer.open({
        title: title,
        type: 2,
        area: ['850px', '530px'],
        fixed: false, //不固定
        maxmin: true,
        content: tabBaseURL + 'modules/common/viewAccessories.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("objId", null);
            window.localStorage.setItem("objType", null);
        }
    });
    layer.full(index);

}

function FormatDate(strTime){
    var date = new Date(strTime);
    //console.log(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}

var receivablesDatas;
function ysCheckedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.ids.push(id);
        }
    } else {
        if ($.inArray(id, vm.ids) >= 0) {
            for (var i = 0; i < vm.ids.length; i++) {
                if (vm.ids[i] == id) {
                    vm.ids.splice(i, 1);
                    i = i - 1;
                }
            }
        }
    }
}


function checkAllPlanChange() {
    var count =  planDatas.length;
    planDatas.forEach(function (d) {
        if ($.inArray(d.id, vm.ids) >= 0){
            count--;
        }
    });
    $("input[name=plan_all]").prop("checked", count==0 && planDatas.length != 0);
}
var planDatas;
function planChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.checkItems.push(data);
            vm.ids.push(id);
        }
    } else {
        if ($.inArray(id, vm.ids) >= 0) {
            for (var i = 0; i < vm.checkItems.length; i++) {
                if (vm.checkItems[i].id == id) {
                    vm.checkItems.splice(i, 1);
                    i = i - 1;
                }
            }
            for (var i = 0; i < vm.ids.length; i++) {
                if (vm.ids[i] == id) {
                    vm.ids.splice(i, 1);
                    i = i - 1;
                }
            }
        }
    }
}
