$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'warehouse/warehouse/getWarehouseList',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        cols: [[
            {type:'radio'},
            {field:'warehouseName', minWidth:200, title: '仓库/城市名称'},
            {field:'deptName', minWidth:200, title: '所属部门',templet:function (d) {
                    if(d.deptName!=null && d.deptName!=''){
                        return d.deptName;
                    }else {
                        return "--";
                    }
                }},
            {field:'warehouseStatus', minWidth:200, title: '状态',templet:function (d) {
                    if(d.warehouseStatus==1){
                        return "启用";
                    }else if(d.warehouseStatus==0){
                        return "停用";
                    }else {
                        return "--";
                    }
            }},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100, 200],
        limit: 10
    });
    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.render();
        });

 });

var emptyEnable = false;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            warehouseName: null
        },
        warehouse: {},
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            emptyEnable = param.emptyEnable;
        }
    },
    updated: function(){
        layui.form.render();
    },
    computed:{ },
    methods: {
        query: function () {
            vm.reload();
        },
        cancel: function(){
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        reset:function(){
            vm.q.warehouseName=null;
        },
        reload: function (event) {
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: {
                warehouseName: vm.q.warehouseName
            }
        });
    },
    save:function(){
        var list = layui.table.checkStatus('gridid').data;
        if(list.length == 0 && !emptyEnable){
            alert("请选择仓库名称");
            return ;
        }
        if (list.length > 0) {
            parent.vm.warehouseData = Object.assign({}, parent.vm.warehouseData, {
                warehouseId: list[0].warehouseId,
                warehouseName: list[0].warehouseName,
            });
        }
        parent.vm.warehouseData.saved = true;
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    },
    }

});