$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'contract/contracordernotemplate/selectOrder',
            where: JSON.parse(JSON.stringify(vm.q)),
            cols: [[
                {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
                {field:'carNo', minWidth:200, title: '车牌号',fixed: "left", align:"center",templet: function (d) {return isEmpty(d.carNo);}},
                {field:'vinNo', minWidth:200, title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                {field:'brandModelName', minWidth:200, title: '品牌/车系/车型', templet: function (d) {return isEmpty(d.brandModelName);}},
                {field:'orderCarCode', minWidth:200, title: '车辆订单号', templet: function (d) {return isEmpty(d.orderCarCode);}},
                {field:'rentTypeStr', minWidth:200, title: '车辆用途', templet: function (d) {return isEmpty(d.rentTypeStr);}},
                {field:'orderStatusStr', minWidth:200, title: '状态', templet: function (d) {return isEmpty(d.orderStatusStr);}},
                {field:'lessorName', minWidth:200, title: '出租方', templet: function (d) {return isEmpty(d.lessorName);}},
                {field:'customerName', minWidth:200, title: '客户名称', templet: function (d) {return isEmpty(d.customerName);}},
                {field:'timeStartRent', minWidth:200, title: '租期开始日期', templet: function (d) {return isEmpty(d.timeStartRent);}},
                {field:'timeFinishRent', minWidth:200, title: '租期结束日期', templet: function (d) {return isEmpty(d.timeFinishRent);}},
                {field:'flowBalance', minWidth:200, title: '流水余额', templet: function (d) {return isEmpty(d.flowBalance);}}
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
var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carnovin:null,
            orderCarCode:null,
            customerName:null,
            flowStatus:200,
            rentTypeLst:'1,2,3,4,5,6,7',
        }
    },
    created: function () {
        var param = parent.layer.boxParams.boxParams;
        if (param) callback = param.callback;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query:function(){
            vm.reload();
        },
        reset:function(){
            resetNULL(vm.q);
        },
        selectCarInfor:function(data){
            if (callback) callback(data);
            else closePage();
        },
        reload:function(){
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }
});

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
