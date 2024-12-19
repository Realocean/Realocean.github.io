$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'contract/contracordernotemplate/getContractLst',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',align:"center"},
            // {title: '操作', width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'code', title: '合同编号', minWidth:200, templet: function (d) {return isEmpty(d.code);}},
            {field:'statusStr', title: '合同状态', minWidth:200, templet: function (d) {return isEmpty(d.statusStr);}},
            {field:'timeStart', title: '合同生效日期', minWidth:200, templet: function (d) {return isEmpty(d.timeStart);}},
            {field:'timeFinish', title: '合同结束日期', minWidth:200, templet: function (d) {return isEmpty(d.timeFinish);}},
            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return dateFormat(d.timeCreate);}}
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10,
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selector(data);
        }
    });
});

var action;
var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            code: null
        }
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        action = param.action;
        callback = param.callback;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.code = '';
        },
        selector: function (data) {
            if ('callback' == action){
                callback(data);
            }else {
                parent.vm.order.contract = Object.assign({}, parent.vm.order.contract, data);
                parent.uploadContract.updateFile(data.fileLst);
                // if (parent.vm.order.contract.timeSigned == null || parent.vm.order.contract.timeSigned == ''){
                //     parent.vm.order.contract = Object.assign({}, parent.vm.order.contract, {timeSigned:data.timeStart});
                // }
                parent.vm.contractModelId = 'contractModelId_' + uuid(6);
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            }
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }
});
