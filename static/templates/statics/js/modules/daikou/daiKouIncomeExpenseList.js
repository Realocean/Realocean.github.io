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
            elem: '#q_startTime' //指定元素
            , zIndex: 99999999,
            type: 'date',
            trigger: 'click',
            range: true,
            done: function (value, date, endDate) {
                vm.q.transactionTimeStr = value;
            }
        });
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        subtips:null,
        preId:'DAIKOU_TYPE_',
        q: {
            incomeExpenseType:null,
            customerTel: null,
            receivablesNo: null,
            carVinNo: null,
            customerName: null,
            collectionType: null,
            transactionTimeStr: null,
            orderCarCode: null,
        },
        statusLst: [],
        statusIndex: 99,
        unsignReason:null,
        AllTransactionNumber:0,
        AllIncomeAmount:0,
        AllExpensesAmount:0,
        AllActualEntry:0,
        editForm:false,
        isFilter:false,
    },
    created: function () {
        var _this = this;
        $.ajaxSettings.async= false;
        $.get(baseURL + 'alipay/alipaypay/statisticsTitle', function (r) {
            _this.statusLst = r.statusLst;
        });
        $.get(baseURL + 'alipay/alipaypay/statisticsAll', function (r) {
            _this.AllTransactionNumber = r.payStatistics.transactionNumber;
            _this.AllIncomeAmount = r.payStatistics.incomeAmount;
            _this.AllExpensesAmount = r.payStatistics.expensesAmount;
            _this.AllActualEntry = r.payStatistics.actualEntry;
        });
        $.ajaxSettings.async= true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        receivablesDetailView: function (id, no) {
            window.localStorage.setItem("receivablesId", id);
            window.localStorage.setItem("receivablesNo", no);
            var index = layer.open({
                title: "应收单详情",
                type: 2,
                content: tabBaseURL  + 'modules/financial/receivablesDetail.html',
                success: function(layero,num){
                    window.localStorage.removeItem("receivablesId");
                    window.localStorage.removeItem("receivablesNo");
                    vm.reload();
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        orderDetailView: function (id, no, instanceId, processKey) {
            var param = {
                instanceId: instanceId,
                processKey: processKey,
                id: id
            };
            console.log(param);
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
        },
        tableFiledSkipOtherView: function (view) {
            var obj = view[0];
            var action = obj.className.trim();
            switch (action) {
                case 'receivablesDetailView':{
                    var id = obj.attributes['receivablesId'].value.trim();
                    vm.receivablesDetailView(id);
                    break;
                }
                case 'orderDetailView':{
                    var id = obj.attributes['orderCarId'].value.trim();
                    vm.orderDetailView(id);
                    break;
                }
            }
        },
        mouseout:function (){
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        move:function (value) {
            var id="#"+vm.preId+value;
            var content = "";
            if(value == 99){
                content = "交易数："+vm.AllTransactionNumber+"个；收入金额"+vm.AllIncomeAmount+"元；支出金额"+vm.AllExpensesAmount+"元；实际入账金额"+vm.AllActualEntry+"元";
            }
            if(!vm.subtips){
                vm.openMsg(id,content,value);
            }
        },
        openMsg:function (id,content,value) {
            vm.subtips = layer.tips(content, id, {tips: 1});
        },
        changeStatus: function (item, index) {
            vm.statusIndex = parseInt(item.key);
            vm.q.incomeExpenseType = vm.statusIndex;
            vm.reload();
        },
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
    form.on('select(signStatus)', function (data) {
        vm.q.signStatus = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
    form.on('select(collectionType)', function (data) {
        vm.q.collectionType = data.value;
    });

}


function initClick() {
    $(document).on('click', '.orderDetailView,.receivablesDetailView', function () {
        vm.tableFiledSkipOtherView($(this));
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL +'alipay/alipaypay/incomeExpenseList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {
                field: 'transactionTime', title: '交易时间', minWidth: 150, templet: function (d) {
                    return isEmpty(d.transactionTime);
                }
            },
            {
                field: 'payType', title: '支付方式', minWidth: 100, templet: function (d) {
                    var payType = d.payType;
                    if (payType == 1) {
                        return "支付宝代扣";
                    }else {
                        return "--"
                    }
                }
            },
            {field: 'transactionType', title: '交易类型', minWidth: 100, templet: function (d) {return isEmpty(d.transactionType);}},
            {field: 'collectionType', title: '项目说明', minWidth: 100,templet:function (d) {
                    return getCollectionTypeStr(d.collectionType);

                }},
            {field: 'amount', title: '金额(元)', minWidth: 200, templet: function (d) {return isEmpty(d.amount);}},
            {field: 'carNo', title: '关联车牌号', minWidth: 200, templet: function (d) {return isEmpty(d.carNo);}},
            {field: 'vinNo', title: '车架号', minWidth: 200, templet: function (d) {return isEmpty(d.vinNo);}},
            {field: 'receivablesNo', title: '应收单编号', minWidth: 200, templet: function (d) {
                    return '<span style="color:#3FACB3;cursor: pointer;" receivablesId="'+d.receivablesId+'" class="receivablesDetailView">'+isEmpty(d.receivablesNo)+'</span>';
            }},
            {field: 'orderCarCode', title: '关联订单号', minWidth: 200, templet: function (d) {
                    return '<span style="color:#3FACB3;cursor: pointer;" orderCarId="'+d.orderCarId+'" class="orderDetailView">'+isEmpty(d.orderCarCode)+'</span>';
                }},
            {field: 'customerName', title: '客户姓名', minWidth: 200, templet: function (d) {return isEmpty(d.customerName);}},
            {field: 'customerTel', title: '联系电话', minWidth: 200, templet: function (d) {return isEmpty(d.customerTel);}},
            {field: 'lessorName', title: '出租方名称', minWidth: 200, templet: function (d) {return isEmpty(d.lessorName);}},
            {field: 'tradeNo', title: '支付宝交易号', minWidth: 200, templet: function (d) {return isEmpty(d.tradeNo);}}

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

