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
            moduleName: null
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
            vm.q.moduleName=null;
        },
        view: function (couponId) {
            $.get(baseURL + "tabconfig/info?id="+couponId, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/tabconfig/tabview.html",
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
                content: tabBaseURL + "modules/tabconfig/tabedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (couponId) {
            $.get(baseURL +"tabconfig/info?id="+couponId, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/tabconfig/tabedit.html",
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
                    url: baseURL + "/tabconfig/delete?id=" + couponId,
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
    form.on('select(moduleName)', function (data) {
        vm.q.moduleName = data.value;
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
        url: baseURL +'/tabconfig/list',
        // where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            //  {type:'checkbox'},
            {title: '操作', width: 150,minWidth:150, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'moduleName', title: '模块名', minWidth: 200, templet: function (d) {
                    return isEmpty(d.moduleName);
                }
            },
            {
                field: 'tabOrder', title: '页签位置', minWidth: 200, templet: function (d) {
                    return isEmpty(d.tabOrder);
                }
            },

            {
                field: 'tabValue', title: '页签值', minWidth: 200, templet: function (d) {
                    return isEmpty(d.tabValue);
                }
            },
            {
                field: 'createTime', title: '创建时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.createTime);
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


