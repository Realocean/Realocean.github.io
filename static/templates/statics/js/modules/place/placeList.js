$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            mainName: null,
            type: null
        },

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.mainName=null;
            vm.q.type=null;
        },
        add: function () {
            var param = {
                data: {}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/place/placeedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "mainPlace/info?id="+id, function (r) {
                var param = {
                    data: r.data

                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/place/placeedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });


        },

        del: function (id) {
            confirm('确定要删除地点信息吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/mainPlace/delMainPlace?id=" + id,
                    data: {},
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
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }

});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
}


function initData() {
    //初始化查询数据字典-设备生产商

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(type)', function (data) {
        vm.q.type = data.value;
    });


}

function initClick() {
    $(".delBatch").click(function () {
        var deviceIds = vm.selectedRows();
        if (deviceIds == null) {
            return;
        }
        vm.del(deviceIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL +'/mainPlace/list',
        cols: [[
            {title: '操作', width: 100, minWidth: 100,templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'mainName', title: '地点名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.mainName);
                }
            },
            {
                field: 'mainAddress', title: '详细地址', minWidth: 500 },

            {
                field: 'type', title: '地点类型', minWidth: 200 ,templet:function (d) {
                    let type = d.type;
                    if (type == 0) {
                        return "维修点";
                    } else if (type == 1) {
                        return "保养点";
                    } else {
                        return "--"
                    }
                }},


            {
                field: 'createTime', title: '创建时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'updateTime', title: '更新时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.updateTime);
                }
            }
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);

}


function initTableEvent(table) {
    table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.id);
        } else if (layEvent === 'view') {
            vm.view(data.id);
        }else if (layEvent === 'del') {
            vm.del(data.id);
        }

    });
}


