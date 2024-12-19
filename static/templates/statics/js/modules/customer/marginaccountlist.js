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
        marginBalanceDetail: function (view) {
            var obj = view[0];
            var orderid = obj.attributes['data-orderid'].value.trim();
            var param = {
                orderId:orderid,
                amountType:1
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

    $(document).on('click', '.marginBalanceDetail', function () {
        vm.marginBalanceDetail($(this));
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'customer/accountlist',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {field:'customerName', title: '客户姓名', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'customerTel', title: '联系电话', minWidth:200, templet: function (d) {return isEmpty(d.customerTel);}},
            {field:'orderCarNo', title: '订单编号', minWidth:200, templet: function (d) {return isEmpty(d.orderCarNo);}},
            {field:'orderStatusStr', title: '订单状态', minWidth:200, templet: function (d) {return isEmpty(d.orderStatusStr);}},
            {field:'marginBalance', title: '保证金余额', minWidth:200, templet: function (d) {
                    var view = '<span>';
                    view += toMoney(d.marginBalance);
                    view += '</span>';
                    view += ' / ';
                    view += ('<a class="marginBalanceDetail" target="_blank" style="text-decoration: underline;color: #1e9fff;cursor: pointer;" data-orderid="'+d.orderId+'">');
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
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        }
    });
}

function initDate(laydate) {

}
