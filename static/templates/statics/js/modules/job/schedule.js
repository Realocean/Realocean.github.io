$(function () {

    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/schedule/list',
        cols: [[
            {type: 'checkbox', align: "center"},
            {field: 'jobId', width: 100, title: '任务ID', align: "center"},
            {field: 'beanName', minWidth: 100, title: 'bean名称', align: "center"},
            {field: 'methodName', minWidth: 100, title: '方法名称', align: "center"},
            {field: 'params', minWidth: 100, title: '参数', align: "center"},
            {field: 'cronExpression', minWidth: 100, title: 'cron表达式', align: "center"},
            {field: 'remark', minWidth: 100, title: '备注', align: "center"},
            {
                field: 'status', width: 100, title: '状态', align: 'center', templet: function (d) {
                    return d.status === 0 ? '正常' : '暂停';
                }
            },
            {title: '操作', width: 260, templet: '#barTpl', fixed: "right", align: "center"}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10

    });


    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });


    //批量删除
    $(".delBatch").click(function () {
        var ids = vm.selectedRows();
        if (ids == null) {
            return;
        }

        vm.del(ids);
    });

    //日志列表
    $(".logList").click(function () {
        var index = layer.open({
            title: "日志列表",
            type: 2,
            content: "schedule_log.html",
            end: function () {
                layer.closeAll();
            }
        });

        layer.full(index);
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.jobId);
        } else if (layEvent === 'pause') {
            vm.pause([data.jobId]);
        } else if (layEvent === 'resume') {
            vm.resume([data.jobId]);
        } else if (layEvent === 'runOnce') {
            vm.runOnce([data.jobId]);
        } else if (layEvent === 'del') {
            var ids = [data.jobId];
            vm.del(ids);
        }
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            beanName: null
        },
        showForm: false,
        schedule: {}
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var ids = [];
            $.each(list, function (index, item) {
                ids.push(item.jobId);
            });
            return ids;
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.schedule = {};

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
        update: function (jobId) {
            $.get(baseURL + "sys/schedule/info/" + jobId, function (r) {
                vm.schedule = r.schedule;
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
        saveOrUpdate: function (event) {
            var url = vm.schedule.jobId == null ? "sys/schedule/save" : "sys/schedule/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.schedule),
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
        },
        del: function (jobIds) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/schedule/delete",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        pause: function (jobIds) {
            confirm('确定要暂停选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/schedule/pause",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        resume: function (jobIds) {
            confirm('确定要恢复选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/schedule/resume",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        runOnce: function (jobIds) {
            confirm('确定要立即执行选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/schedule/run",
                    contentType: "application/json",
                    data: JSON.stringify(jobIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    beanName: vm.q.beanName
                }
            });
        }
    }
});