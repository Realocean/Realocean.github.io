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
            serviceName: null,
            serviceType: null,
            groupKey: null,
            groupName: null,
        },
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        query: function (type) {
            vm.reload(type);
        },
        reset: function (type) {
            switch (type) {
                case 'feeGroup':{
                    vm.q.groupName=null;
                    break;
                }
                case 'feeItem':{
                    vm.q.serviceName=null;
                    break;
                }
            }
        },
        add: function (type) {
            switch (type) {
                case 'feeGroup':{
                    var index = layer.open({
                        title: "新增",
                        type: 2,
                        area: ['70%', '80%'],
                        boxParams: {
                            data: {
                                operationId:sessionStorage.getItem("userId"),
                                operationName:sessionStorage.getItem("username"),
                                groupKey:'FG'+uuid(16),
                            }
                        },
                        content: tabBaseURL + 'modules/serviceConfig/serviceconfiggroupedit.html',
                        end: function () {
                            layer.close(index);
                        }
                    });
                    break;
                }
                case 'feeItem':{
                    var index = layer.open({
                        title: "新增",
                        type: 2,
                        area: ['70%', '80%'],
                        boxParams: {
                            data: {
                                groupKey:vm.q.groupKey,
                                groupName:vm.q.groupName,
                                required:0,
                                serviceField:'FI'+uuid(16),
                            }
                        },
                        content: tabBaseURL + 'modules/serviceConfig/configedit.html',
                        end: function () {
                            layer.close(index);
                        }
                    });
                    break;
                }
            }

        },
        update: function (type,data) {
            switch (type) {
                case 'feeGroup':{
                    $.get(baseURL +"serviceconfig/serviceconfiggroup/info/"+data.id, function (r) {
                        var index = layer.open({
                            title: "修改",
                            type: 2,
                            area: ['70%', '80%'],
                            boxParams: {
                                data: r.serviceConfigGroup
                            },
                            content: tabBaseURL + 'modules/serviceConfig/serviceconfiggroupedit.html',
                            end: function () {
                                layer.close(index);
                            }
                        });
                    });
                    break;
                }
                case 'feeItem':{
                    $.get(baseURL +"serviceConfig/info?id="+data.id, function (r) {
                        var index = layer.open({
                            title: "修改",
                            type: 2,
                            area: ['70%', '80%'],
                            boxParams: {
                                data: r.data
                            },
                            content: tabBaseURL + 'modules/serviceConfig/configedit.html',
                            end: function () {
                                layer.close(index);
                            }
                        });
                    });
                    break;
                }
            }
        },
        del: function (type,data) {
            var url = '';
            var msg = '';
            switch (type) {
                case 'feeGroup':{
                    url = '/serviceconfig/serviceconfiggroup/delete?id=' + data.id;
                    msg = '确定要删除此费用类型吗，该操作将会清空该费用类型下所有费用项？';
                    break;
                }
                case 'feeItem':{
                    url = '/serviceConfig/delete?id=' + data.id;
                    msg = '确定要删除此费用项吗？';
                    break;
                }
            }
            confirm(msg, function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    data: {},
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload(type);
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function (type,event) {
            layui.table.reload(type, {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }

});

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
    initDate(layui.laydate);
}

function initSearch() {
    Search({
        elid: 'feeGroup',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '费用类型名称', placeholder: '请输入费用类型名称', fieldName: 'groupName',},
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.q.groupKey = null;
                    vm.q.groupName = null;
                    vm.query('feeGroup');
                    break;
                }
                case 'reset':{
                    vm.reset('feeGroup');
                    break;
                }
                case 'exports':{
                    vm.exports('feeGroup');
                    break;
                }
            }
        }
    }).initView();

    Search({
        elid: 'feeItem',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '费用名称', placeholder: '请输入费用名称', fieldName: 'serviceName',},
            {type: 'select', label: '费用性质', placeholder: '请选择费用性质', fieldName: 'serviceProperty', selectMap: {0:'其他文本类字段',1:'应付费用',2:'应收费用'}, selectFilter: true},
            {type: 'select', label: '租赁类型', placeholder: '请选择租赁类型', fieldName: 'suitRentType', selectMap: {1:'经租',2:'以租代购',6:'直购'}, selectFilter: true},
            {type: 'select', label: '业务类型', placeholder: '请选择业务类型', fieldName: 'suitType', selectMap: {1:'退车',2:'换车',3:'备用车',4:'退换车'}, selectFilter: true},
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query('feeItem');
                    break;
                }
                case 'reset':{
                    vm.reset('feeItem');
                    break;
                }
                case 'exports':{
                    vm.exports('feeItem');
                    break;
                }
            }
        }
    }).initView();
}

function initData() {}

function initDate(laydate) {}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(serviceType)', function (data) {
        vm.q.serviceType = data.value;
    });
}

function initClick() {}

function initTable(table, soulTable) {
    table.render({
        id: "feeItem",
        elem: '#grid',
        url: baseURL +'/serviceConfig/list',
        // where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width: 120, templet: '#itembarTpl', fixed: "left", align: "center"},
            {field: 'serviceName', title: '费用名称', minWidth: 200, templet: function (d) {return isEmpty(d.serviceName);}},
            {field: 'groupName', title: '费用类型', minWidth: 200, templet: function (d) {return isEmpty(d.groupName)}},
            {field: 'serviceProperty', title: '费用性质', minWidth: 200, templet: function (d) {return transformTypeByMap(d.serviceProperty, {0:'其他文本类字段',1:'应付费用',2:'应收费用'})}},
            {field: 'serviceField', title: '字段值', minWidth: 200, templet: function (d) {return isEmpty(d.serviceField);}},
            {field: 'suitRentType', title: '适用租赁类型', minWidth: 200, templet: function (d) {return transformTypeByMap(d.suitRentType, {1:'经租',2:'以租代购',6:'直购'})}},
            {field: 'suitType', title: '适用业务类型', minWidth: 200, templet: function (d) {return transformTypeByMap(d.suitType, {1:'退车',2:'换车',3:'备用车',4:'退换车'})}},
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

    table.render({
        id: "feeGroup",
        elem: '#groupLst',
        url: baseURL + 'serviceconfig/serviceconfiggroup/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#groupbarTpl',fixed:"left",align:"center"},
            {field:'groupName', title: '费用类型名称', minWidth:200, templet: function (d) {return isEmpty(d.groupName);}},
            {field:'groupKey', title: '字段值', minWidth:200, templet: function (d) {return isEmpty(d.groupKey);}},
            {field:'operationName', title: '提交人姓名', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
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
            vm.update('feeItem',data);
        } else if (layEvent === 'del') {
            vm.del('feeItem',data);
        }
    });

    table.on('tool(groupLst)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update('feeGroup',data);
        } else if (layEvent === 'del') {
            vm.del('feeGroup',data);
        }
    });

    table.on('row(groupLst)', function(obj){
        var data = obj.data;
        vm.q.groupKey = data.groupKey;
        vm.q.groupName = data.groupName;
        vm.reload('feeItem');
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}


