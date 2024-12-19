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
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null,
            type: null,
            timeDate: null,
            timeDatestart: null,
            timeDateend: null,
        },
        isClose: true,
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'contract/contracbusinessplan/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        flowBalanceDetail: function (view) {
            var obj = view[0];
            var orderid = obj.attributes['data-orderid'].value.trim();
            var param = {
                orderId:orderid,
                amountType:2
            };
            var index = layer.open({
                title: "明细",
                type: 2,
                area: ['70%', '70%'],
                boxParams: param,
                content: tabBaseURL + "modules/customer/customerbalancerecordlist.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        add: function (data) {
            var index = layer.open({
                title: "增加流水",
                type: 1,
                content: '<div style="margin: 30px"><input oninput="edit(this, \'num\', \'\', \'\', \'9999999.99\', \'-9999999.99\')" id="addflow" type="text" class="layui-input" placeholder="请输入流水金额" autocomplete="off"/></div>',
                btn: ['确定'],
                btn1: function () {
                    // 创建一个链接，模拟点击下载
                    var amount = $('#addflow').val();
                    if (!amount) {
                        alert('请输入流水金额');
                        return;
                    }
                    if (amount == 0) {
                        alert('新增流水金额不能为零');
                        return;
                    }
                    var param = {
                        orderId:data.orderId,
                        amount:amount
                    };
                    // confirm('新增流水', function () {
                        $.ajax({
                            type: "POST",
                            url: baseURL + "customer/customerbalancerecord/addflow",
                            contentType: "application/json",
                            data: JSON.stringify(param),
                            success: function (r) {
                                if (r.code === 0) {
                                    alert('操作成功', function (index) {
                                        layer.closeAll();
                                        vm.reload();
                                    });
                                } else {
                                    alert(r.msg);
                                }
                            }
                        });
                    // });
                },
                end: function () {
                    layer.close(index);
                }
            });
        },
        dk: function (data) {
            var ids = [];
            ids.push(data.orderId);
            confirm('确定用该订单流水余额抵扣应收账单？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "customer/customerbalancerecord/yjdk",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('已发起抵扣请求，请稍后在列表查看', function (index) {
                                layer.closeAll();
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        yjdk: function () {
            var ids = [];
            confirm('确定用流水余额抵扣应收账单？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "customer/customerbalancerecord/yjdk",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('已发起抵扣请求，请稍后在列表查看', function (index) {
                                layer.closeAll();
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
    }
});

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '客户名称', placeholder: '请输入客户名称', fieldName: 'customerName'},
            {type: 'text', label: '联系电话', placeholder: '请输入联系电话', fieldName: 'customerTel'},
            {type: 'text', label: '订单编号', placeholder: '请输入订单编号', fieldName: 'orderCarNo'},
            {hidden: true, type: 'select', label: '订单状态', fieldName: 'orderStatus', selectMap: {
                    200:'用车中', 300:'换车中', 500:'退车中', 600:'已退车', 700:'已过户', 800:'已出售'
                }, selectFilter: true
            },
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exports();
                    break;
                }
            }
        }
    }).initView();
}


function initUpload(upload) {

}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    $(document).on('click', '.flowBalanceDetail', function () {
        vm.flowBalanceDetail($(this));
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'customer/accountlist',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width: 150,minWidth: 150, templet: '#barTpl', fixed: "left", align: "center",},
            {field:'customerName', title: '客户姓名', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'customerTel', title: '联系电话', minWidth:200, templet: function (d) {return isEmpty(d.customerTel);}},
            {field:'orderCarNo', title: '订单编号', minWidth:200, templet: function (d) {return isEmpty(d.orderCarNo);}},
            {field:'orderStatusStr', title: '订单状态', minWidth:200, templet: function (d) {return isEmpty(d.orderStatusStr);}},
            {field:'flowBalance', title: '流水余额', minWidth:200, templet: function (d) {
                    var view = '<span>';
                    view += toMoney(d.flowBalance);
                    view += '</span>';
                    view += ' / ';
                    view += ('<a class="flowBalanceDetail" target="_blank" style="text-decoration: underline;color: #1e9fff;cursor: pointer;" data-orderid="'+d.orderId+'">');
                    view += '明细';
                    view += '</a>';
                    return view;
                }
            },
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
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

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'add'){
            vm.add(data);
        } else if(layEvent === 'dk'){
            vm.dk(data);
        }
    });
}

function initDate(laydate) {

}
