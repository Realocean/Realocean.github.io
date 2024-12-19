$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'order/contraccarsource/queryList',
        where:{status:vm.q.status},
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'code', title: '合同编号',align:"center", templet: function (d) {return isEmpty(d.code);}},
            {field:'statusStr', title: '合同状态',align:"center", templet: function (d) {return isEmpty(d.statusStr);}},
            {field:'contractStart', title: '合同生效日期',align:"center", templet: function (d) {return isEmpty(d.contractStart);}},
            {field:'contractEnd', title: '合同终止日期',align:"center", templet: function (d) {return isEmpty(d.contractEnd);}},
            {field:'createUserName', title: '提交人',align:"center", templet: function (d) {return isEmpty(d.createUserName);}},
            {field:'createTime', title: '合同记录时间',align:"center", templet: function (d) {return isEmpty(d.createTime);}}
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20
    });

    layui.table.on('tool(grid)', function (obj) {
        if (obj.event === 'chooseContract') {
            parent.vm.confirmContract(obj);
        }
    });

    layui.use(['form'], function(){
        layui.form.on('select(status)', function (data) {
            vm.q.status = data.value;
        });
        layui.form.render();
    });

});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            code: null,
            status: 1
        }
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        reset: function () {
            vm.q.code = null;
            vm.q.status = 1;
        },
        query: function () {
            vm.reload();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    code: vm.q.code,
                    status: vm.q.status
                }
            });
        }
    }
});

