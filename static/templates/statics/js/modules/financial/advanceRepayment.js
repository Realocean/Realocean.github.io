$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table','layer','soulTable'], function(){
        layui.form.on('radio(disputeCheck)', function (data) {
            vm.q.paymentMethod = data.value;
            console.log(data.value)
        });
        layui.laydate.render({
            elem: '#paymentTime',
            trigger: 'click',
            type: 'datetime',
            done: function (value, date, endDate) {
                vm.q.paymentTime = value;
            }
        });
        layui.form.on('submit(save)', function () {
            vm.save();
            return false;
        });
        init(layui);
        layui.form.render();
    });
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_orderCarNo: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择订单";
            }
        },
        validate_skAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请输入收款金额";
            }
        },
        validate_paymentTime: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择还款时间";
            }
        },
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        data: vm.advanceRepaymentLst,
        cols: [[
            {field:'stageStr', title: '期数', align: "center",templet: function (d) {
                if (d.stage) {
                    return '第'+d.stage+'期';
                } else {
                    return '--';
                }
            }},
            {field:'uncollectedAmount', title: '欠款金额', align: "center",templet: function (d) {return toMoney(d.uncollectedAmount);}},
            {field:'collectionTypeName', title: '还款类型', align: "center",templet: function (d) {
                    return d.collectionTypeName||getCollectionTypeStr(d.collectionType);
                }},
            {field:'overdueDays', title: '逾期天数', align: "center",templet: function (d) {
                    return isEmpty(receivableOverdueDays(d.status,d.hzType,d.overdueDate,d.actualDate)||d.overdueDays);
                }
            },
            {field:'receivableDate', title: '应还日期', align: "center",templet: function (d) {
                    return dateFormatYMD(isEmpty(d.receivableDateDesc || d.receivableDate));
                }},
            {field: 'overdueDate', align: "center", title: '逾期期限', templet: function (d) {return isEmpty(d.overdueDate);}},
            {field:'billStartTime', align: "center", title: '账单开始时间', templet: function (d) {return isEmpty(d.billStartTime)}},
            {field:'billEndTime', align: "center", title: '账单结束时间', templet: function (d) {return isEmpty(d.billEndTime)}},
            {field:'receivableAmount', title: '应还总金额', align: "center",templet: function (d) {
                    return toMoney(d.receivableAmount);
                    // return add(d.receivableAmount,d.lateFeeAmount);
                }},
            {field:'receivedAmount', title: '已还总金额', align: "center",templet: function (d) {return toMoney(d.receivedAmount);}},
            {field:'statusStr', title: '还款状态', align: "center",templet: function (d) {
                    if (d.hzType == 2 && d.status == 1){
                        return '部分坏账-待收款';
                    }
                    if (d.status == 4){
                        return '已坏帐';
                    }else if (d.status == 5){
                        return '已作废';
                    }else
                        return isEmpty(d.statusStr);
                }}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

}

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            customer: null,
            carNo: null,
            orderCarNo: null,
            paymentTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            paymentMethod : 0,
            amount: null,
            remark: null
        },
        advanceRepaymentLst:[],
        advanceRepaymentAmount:0,
        noPaidAmount:0,
        paidAmount:0,
        order:{}
    },
    created: function () {
        var _this = this;
    },

    updated: function () {
        layui.form.render();
    },

    methods: {
        save: function() {
            vm.q.noPaidAmount = vm.noPaidAmount;
            vm.q.paidAmount = vm.paidAmount;
            vm.q.flowBalance = vm.order.paidAmount;
            $.ajax({
                type: "POST",
                url: baseURL + 'financial/receivables/saveAdvanceRepaymentInfo',
                contentType: "application/json",
                data: JSON.stringify(
                    this.q
                ),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        cancel: function(){
            closePage();
        },
        getAdvanceRepayment: function(orderCarNo){
            vm.advanceRepaymentAmount = 0;
            vm.noPaidAmount = 0;
            vm.paidAmount = 0;
            $.getJSON(baseURL + "financial/receivables/advanceRepaymentAll/"+orderCarNo, function (r) {
                vm.advanceRepaymentLst = r.data;
                if (r.data && r.data.length > 0) {
                    layui.table.reload('gridid', {data: vm.advanceRepaymentLst});
                    for (let i = 0; i < vm.advanceRepaymentLst.length; i++) {
                        var item = vm.advanceRepaymentLst[i];
                        vm.advanceRepaymentAmount = add(vm.advanceRepaymentAmount, item.uncollectedAmount);
                        if (item.statusStr === '未出账单') {
                            vm.noPaidAmount = add(vm.noPaidAmount, item.uncollectedAmount);
                        } else {
                            vm.paidAmount = add(vm.paidAmount, item.uncollectedAmount);
                        }
                    }
                    $('#skAmount').attr('oninput', "edit(this, 'num', 'skAmount', 'editCallback','"+sub(vm.advanceRepaymentAmount, vm.order.flowBalance)+"')");
                }
            });
        },
        selectOrder: function(){
            var index = layer.open({
                title: "选择车辆订单",
                type: 2,
                area: ['80%', '80%'],
                boxParams: {
                    callback: function (data) {
                        vm.order = data;
                        Vue.set(vm.q, "orderCarNo", data.orderCarCode);
                        console.log(data);
                        layer.close(index);
                        vm.getAdvanceRepayment(data.orderCarCode);
                    }
                },
                content: tabBaseURL + "modules/financial/selectadvancerepaymentorder.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
    }
});

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}