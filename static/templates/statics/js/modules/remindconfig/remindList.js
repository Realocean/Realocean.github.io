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
            remindModule: null,
            remindType: null,
        },


    },
    created: function () {


    },
    mounted: function (){


    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.remindModule=null;
            vm.q.remindType=null;
        },
        view: function (couponId) {
            $.get(baseURL + "remindconfig/info?id="+couponId, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/remindconfig/remindview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function () {
            var param = {
                data: {}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/remindconfig/remindedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (couponId) {
            $.get(baseURL +"remindconfig/info?id="+couponId, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/remindconfig/remindedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });


        },

        del: function (couponId) {
            confirm('确定要删除此配置项吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/remindconfig/delete?id=" + couponId,
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
    initDate(layui.laydate);
}


function initData() {
    //初始化查询数据字典-设备生产商

}
function initDate(laydate) {
    laydate.render({
        elem: '#q_startTime' //指定元素
        ,zIndex: 99999999,
        trigger: 'click',
        range: true,
        done: function(value, date, endDate){
            vm.q.startTime = value;
        }
    });

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(remindModule)', function (data) {
        vm.q.remindModule = data.value;
    });
    form.on('select(remindType)', function (data) {
        vm.q.remindType = data.value;
    })


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
        url: baseURL +'/remindconfig/list',
        // where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width: 140,minWidth:140, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'remindModule', title: '提醒模块名称', minWidth: 200, templet: function (d) {
                    var remindModule = d.remindModule;
                    if (remindModule == 0) {
                        return "保养";
                    } else if (remindModule == 1) {
                        return "年检";
                    } else if (remindModule == 2) {
                        return "保险";
                    }else if (remindModule == 3) {
                        return "账单";
                    }else if (remindModule == 4) {
                        return "租赁到期";
                    }else {
                        return "--"
                    }
                }
            },
            {
                field: 'remindType', title: '提醒类型', minWidth: 200, templet: function (d) {
                    var remindType = d.remindType;
                    if (remindType == 0) {
                        return "提醒天数";
                    } else if (remindType == 1) {
                        return "提醒公里数";
                    }else {
                        return "--"
                    }
                }
            },
            {
                field: 'remindValue', title: '提醒值', minWidth: 200, templet: function (d) {
                    return isEmpty(d.remindValue);
                }
            },

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


