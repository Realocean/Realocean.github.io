$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'purchase/purchasesupplier/selectSupList',
        where: {'enable':1},
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'supplierName', minWidth:200, title: '供应商名称'},
            {field:'contacts', minWidth:200, title: '联系人'},
            {field:'phone', minWidth:150, title: '联系电话'},
            {field:'addrDetail', minWidth:200, title: '详细地址'},
            {field:'enalbe', minWidth:100, title: '状态',  templet:function (d) {
                    if (d.enalbe == 1){
                        return '已启用';
                    } else {
                        return '已禁用';
                    }
                }},
            {field:'createTime', minWidth:200, title: '创建时间',  templet:function (d) {
                    if (d.createTime != null && d.createTime != ''){
                        return new Date(d.createTime).format("yyyy-MM-dd hh:mm:ss");
                    } else {
                        return '--';
                    }
                }},
            {field:'followusrName', minWidth:200,  title: '跟进人'}
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 10
    });

    layui.table.on('tool(grid)', function (obj) {
        if (obj.event === 'chooseSup') {
            parent.vm.confirmSup(obj);
        }
    });
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            keyword: null,
            enable: 1
        }
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        reset: function () {
            vm.q.keyword = null;
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
                    keyword: vm.q.keyword,
                    enable: vm.q.enable
                }
            });
        }
    }
});

