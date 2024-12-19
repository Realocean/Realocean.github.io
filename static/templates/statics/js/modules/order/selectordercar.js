$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'order/order/selectOrderCar',
            cols: [[
                {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
                {field:'carNo', minWidth:200, title: '车牌号',align:"center", fixed: "left",templet: function (d) {return isEmpty(d.carNo);}},
                {field:'vinNo', minWidth:200, title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                {field:'rentType', minWidth:200, title: '租赁类型', templet: function (d) {return isEmpty(d.rentType);}},
                {field:'brandModelName', minWidth:200, title: '品牌车系成型', templet: function (d) {return isEmpty(d.brandModelName);}},
                {field:'customer', minWidth:200, title: '客户名称', templet: function (d) {return isEmpty(d.customer);}},
                {field:'contractNo', minWidth:200, title: '合同编号', templet: function (d) {return isEmpty(d.contractNo);}},
                {field:'orderCarNo', minWidth:200, title: '车辆订单编号', templet: function (d) {return isEmpty(d.orderCarNo);}},
                {field:'businessType', minWidth:200, title: '状态', templet: function (d) {return isEmpty(d.businessType);}},
                {field:'payType', minWidth:200, title: '付款方式', templet: function (d) {return isEmpty(d.payType);}},
                {field:'payDay', minWidth:200, title: '付款日', templet: function (d) {return isEmpty(d.payDay);}},
                {field:'rentStart', minWidth:200, title: '租期开始时间', templet: function (d) {return isEmpty(d.rentStart);}},
                {field:'rentEnd', minWidth:200, title: '租期结束时间', templet: function (d) {return isEmpty(d.rentEnd);}},
            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            }
        });
    });
    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selectCarInfor'){
            vm.selectCarInfor(data);
        }
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carNo:null
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query:function(){
            vm.reload();
        },
        reset:function(){
            vm.q.carNo = null;
        },
        selectCarInfor:function(data){
            parent.vm.initData(data);
            parent.layer.closeAll();
        },
        reload:function(){
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo: vm.q.carNo
                }
            });
        }
    }
});