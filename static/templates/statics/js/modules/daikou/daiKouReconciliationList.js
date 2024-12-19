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
            elem : '#reconciliationMonth',
            format: 'yyyy-MM',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.reconciliationMonth=value;
            }
        });
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            leaseId: null,
            reconciliationMonth: null,
        },
        unsignReason:null,
        deptList: [],
        editForm:false,
        isFilter:false,
    },
    created: function () {
        var _this = this;
        $.get(baseURL + "sys/dept/listAll", function(r){
            _this.deptList = r.deptList;
        });
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
            vm.reload();
        },
        view: function (dataObj) {
            console.log("dataObj:::",dataObj);
            window.localStorage.setItem("leaseId", dataObj.leaseId);
            window.localStorage.setItem("reconciliationMonth", dataObj.reconciliationMonth);
            var index = layer.open({
                title: "查看",
                type: 2,
                content: tabBaseURL + "modules/daikou/daiKouLeaseDetailList.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);

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
    //初始化查询数据字典-设备生产商

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(leaseId)', function (data) {
        vm.q.leaseId = data.value;
    })

}

function initClick(){

}

function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL +'alipay/alipaypay/reconciliationList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width: 100, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'reconciliationMonth', minWidth: 100, title: '对账月份',  templet: function (d) {
                    return isEmpty(d.reconciliationMonth);
                }
            },
            {field: 'leaseName', title: '出租方名称', minWidth: 100, templet: function (d) {return isEmpty(d.leaseName);}},
            {field: 'billQuantity', title: '代扣账单数量', minWidth: 100, templet: function (d) {return isEmpty(d.billQuantity);}},
            {field: 'aliPayTotalAmount', title: '代扣总金额(元)', minWidth: 100, templet: function (d) {return isEmpty(d.aliPayTotalAmount);}},
            {field: 'commissionTotalAmount', title: '代扣手续费(元)', minWidth: 100, templet: function (d) {return isEmpty(d.commissionTotalAmount);}}
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
    initTableEvent(table);
}

function initTableEvent(table) {
    table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'view') {
            vm.view(data);
        }

    });
}