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
    // 初始化设备类型
    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/gpsEquipmentType",
        contentType: "application/json",
        data: null,
        success: function (r) {
            vm.gpsEquipmentType = r.dict;
        }
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            manufacturerNumber: null,
            deviceTypeNo: null,
            deviceKind: null,
        },
        gpsEquipmentSupplier: [],
        deviceTypeNoList: [],
        gpsEquipmentType: [],
        isClose: true,
    },
    created: function () {
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (deviceId) {
            $.get(baseURL + "web/devicemanagement/info?id=" + deviceId, function (r) {
                var param = {
                    data: r.entity
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/devicemanagement/devicemanagementview.html",
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
                content: tabBaseURL + "modules/devicemanagement/devicemanagementedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (deviceId) {
            $.get(baseURL + "web/devicemanagement/info?id=" + deviceId, function (r) {
                var param = {
                    data: r.entity,
                    code: 0
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/devicemanagement/devicemanagementedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });


        },
        del: function (deviceId) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "web/devicemanagement/delete?id=" + deviceId,
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
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: vm.q
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
    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/" + "gpsEquipmentSupplier",
        contentType: "application/json",
        data: null,
        success: function (r) {
            vm.gpsEquipmentSupplier = r.dict;
        }
    });
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    //设备生产商
    form.on('select(manufacturerNumber)', function (data) {
        vm.q.manufacturerNumber = data.value;
    });
    // 设备类型
    form.on('select(deviceKind)', function (data) {
        vm.q.deviceKind = data.value;
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
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'web/devicemanagement/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            //  {type:'checkbox'},
            {title: '操作', width: 200, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'deviceTypeNo', title: '设备型号', align: "center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.deviceTypeNo);
                }
            },
            {
                field: 'equipmentSupplierName', title: '供应商名称', align: "center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.equipmentSupplierName);
                }
            },
            {
                field: 'num', title: '数量/件', align: "center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.num);
                }
            },
            {
                field: 'deviceKind', title: '设备类型', align: "center", minWidth: 200, templet: function (d) {
                    var deviceKind = d.deviceKind;
                    if (deviceKind == 0) {
                        return "无线设备";
                    } else if (deviceKind == 1) {
                        return "有线设备";
                    } else {
                        return "--"
                    }

                }
            },
            {
                field: 'createTime', title: '创建时间', align: "center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'updateTime', title: '修改时间', align: "center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.updateTime);
                }
            },
            {
                field: 'creator', title: '操作人', align: "center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.creator);
                }
            },

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
        } else if (layEvent === 'del') {
            vm.del(data.id);
        } else if (layEvent === 'view') {
            vm.view(data.id);
        }
    });
}


