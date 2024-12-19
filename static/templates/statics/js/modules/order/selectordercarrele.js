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
            url: baseURL + 'order/orderrelerecord/enableReleList',
            cols: [[
                {title: '操作', minWidth: 120, fixed: "left",templet: '#barTpl', align: "center"},
                {field:'carNo', minWidth:200, title: '车牌号',align:"center", fixed: "left",templet: function (d) {return isEmpty(d.carNo);}},
                {field:'orderCarCode', minWidth:200, title: '车辆订单编号', templet: function (d) {return isEmpty(d.orderCarCode);}},
                {field:'rentTypeStr', minWidth:200, title: '租赁类型', templet: function (d) {return isEmpty(d.rentTypeStr);}},
                {field:'timeStartRent', minWidth:200, title: '租期开始时间', templet: function (d) {return isEmpty(d.timeStartRent);}},
                {field:'timeFinishRent', minWidth:200, title: '租期结束时间', templet: function (d) {return isEmpty(d.timeFinishRent);}},
            ]],
            page: true,
            loading: true,
            limits: [10, 20, 30, 50],
            limit: 10,
            autoColumnWidth: {
                init: false
            },
            done: function(res, curr, count){
                layui.soulTable.render(this);
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
            carNo:null
        }
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        callback = param.callback;
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
            callback(data);
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
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
