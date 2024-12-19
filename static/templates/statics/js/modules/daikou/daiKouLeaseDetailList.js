$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        laydate = layui.laydate;
        laydate.render({
            elem: '#queryWithholdTime' //指定元素
            , zIndex: 99999999,
            type: 'date',
            trigger: 'click',
            range: true,
            done: function (value, date, endDate) {
                vm.q.withholdTimeStr = value;
            }
        });
        laydate.render({
            elem: '#queryCommissionTime' //指定元素
            , zIndex: 99999999,
            type: 'date',
            trigger: 'click',
            range: true,
            done: function (value, date, endDate) {
                vm.q.commissionTimeStr = value;
            }
        });
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            customerTel: null,
            receivablesNo: null,
            carVinNo: null,
            customerName: null,
            orderCarCode:null,
            commissionTimeStr: null,
            withholdTimeStr: null,
            leaseId:window.localStorage.getItem("leaseId"),
            reconciliationMonth:window.localStorage.getItem("reconciliationMonth"),
        },
        editForm:false,
        isFilter:false,
    },
    created: function () {
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
            vm.q.leaseId = window.localStorage.getItem("leaseId");
            vm.q.reconciliationMonth=window.localStorage.getItem("reconciliationMonth");
            vm.reload();
        },

        reload: function (event) {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }

});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
}


function initData() {

}

function initEventListener(layui) {
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(signStatus)', function (data) {
        vm.q.signStatus = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL +'alipay/alipaypay/leaseDetailList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {field: 'lessorName', title: '出租方名称', minWidth: 200, templet: function (d) {return isEmpty(d.lessorName);}},
            {field: 'withholdTime', title: '代扣时间', minWidth: 150, templet: function (d) {return isEmpty(d.withholdTime);}},
            {field: 'commissionTime', title: '平台手续费划账时间', minWidth: 150, templet: function (d) {return isEmpty(d.commissionTime);}},
            {field: 'withholdAmount', title: '代扣金额(元)', minWidth: 100,templet:function (d) {
                        return isEmpty(d.withholdAmount);
                }},
            {field: 'commissionAmount', title: '平台手续费(元)', minWidth: 100,templet:function (d) {
                    return isEmpty(d.commissionAmount);
                }},
            {field: 'state', title: '状态', minWidth: 120, templet: function (d) {return isEmpty(d.state);}},
            {field: 'deductionRules', title: '扣费规则', minWidth: 120, templet: function (d) {
                    return isEmpty(d.deductionRules);
                }},
            {field: 'receivablesNo', title: '应收单编号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.receivablesNo);
            }},
            {field: 'orderCarCode', title: '订单号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.orderCarCode);
                }},
            {field: 'carNo', title: '车牌号', minWidth: 120, templet: function (d) {return isEmpty(d.carNo);}},
            {field: 'vinNo', title: '车架号', minWidth: 150, templet: function (d) {return isEmpty(d.vinNo);}},
            {field: 'customerName', title: '客户姓名', minWidth: 120, templet: function (d) {return isEmpty(d.customerName);}},
            {field: 'customerTel', title: '联系电话', minWidth: 120, templet: function (d) {return isEmpty(d.customerTel);}}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
        }
    });

}

