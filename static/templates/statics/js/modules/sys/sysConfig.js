$(function () {
    // 列表
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid', // 列表元素id
        url: baseURL + 'sys/tConfig/list',
        cols: [[
            {type: 'checkbox',fixed: "left", align: "center"},
            {title: '操作', minWidth:120,width: 120, templet: '#barTpl', fixed: "left", align: "center"},
            
            {field: 'id', width: 100, title: 'ID', align: "center"},
            {field: 'paramKey', minWidth: 100, title: '参数名', align: "center"},
            {field: 'paramValue', minWidth: 100, title: '参数值', align: "center"},
            {field: 'remark', minWidth: 100, title: '备注', align: "center"},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
    //列表操作按钮事件
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.id);
        } else if (layEvent === 'del') {
            var ids = [data.id];
            vm.del(ids);
        }
    });

    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });
});
// 创建vue应用
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            paramKey: null
        },
        showForm: false,
        // 新增修改vo用
        config: {}
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 已勾选行数
        selectedRows: function () {
            return layui.table.checkStatus('gridid').data.map(item=>item.id);
        },
        // 查询按钮事件
        query: function () {
            layui.table.reload('gridid', {
                // 分页参数
                page: {
                    curr: 1
                },
                // 查询条件
                where: {
                    paramKey: vm.q.paramKey
                }
            });
        },
        // 新增表单
        add: function () {
            vm.config = {};
            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
        // 修改表单
        update: function (id) {
            $.get(baseURL + "sys/tConfig/info/" + id, function (r) {
                vm.config = r.data;
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        // 删除按钮事件
        del: function (ids) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/tConfig/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.query();
                            });
                            return false;
                        }
                        alert(r.msg);
                    }
                });
            });
        },
        // 批量删除事件
        delBatch:function(){
            var ids = vm.selectedRows();
            if (ids == null || ids.length==0) {
                alert("未选择任何记录")
                return false;
            }
            vm.del(ids);
        },
        // 新增或保存
        saveOrUpdate: function (event) {
            var url = vm.config.id == null ? "sys/tConfig/save" : "sys/tConfig/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.config),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.query();
                        });
                        return false;
                    }
                    alert(r.msg);
                }
            });
        }
    }
});