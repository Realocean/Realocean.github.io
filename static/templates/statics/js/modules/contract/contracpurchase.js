$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            code: null,
            status: null,
            purchaseSupplierName: null,
            rentType: null,
        }
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.code = null;
            vm.q.status = null;
            vm.q.purchaseSupplierName = null;
            vm.q.rentType = null;
        },
        view: function (id) {
            $.get(baseURL + "contract/contracpurchase/info/"+id, function(r){
                var param = {
                    data:r.contracpurchase
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/viewcontracpurchase.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/contract/editcontracpurchase.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "contract/contracpurchase/info/"+id, function(r){
                var param = {
                    data:r.contracpurchase
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/editcontracpurchase.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        exports: function () {
            var url = baseURL + 'contract/contracpurchase/export?a=a';
            if (vm.q.code != null) {
                url += '&code=' + vm.q.code;
            }
            if (vm.q.status != null) {
                url += '&status=' + vm.q.status;
            }
            if (vm.q.purchaseSupplierName != null) {
                url += '&purchaseSupplierName=' + vm.q.purchaseSupplierName;
            }
            if (vm.q.rentType != null) {
                url += '&rentType=' + vm.q.rentType;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    code: vm.q.code,
                    status: vm.q.status,
                    purchaseSupplierName: vm.q.purchaseSupplierName,
                    rentType: vm.q.rentType,
                }
            });
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(status)', function (data) {
        vm.q.status = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
}

function initClick() {

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
      //toolbar: true,
      //defaultToolbar: ['filter'],
        url: baseURL + 'contract/contracpurchase/list',
        cols: [[
                            {title: '操作', width:180, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'code', width: 200, title: '合同编号'},
                            {field:'status', width: 130, title: '合同状态', templet: function (d) {
                                    if (d.status == 1) {
                                        return '未生效';
                                    } else if (d.status == 2) {
                                        return '执行中';
                                    } else if (d.status == 3) {
                                        return '合同执行完成';
                                    } else {
                                        return '--';
                                    }
                                }},
                            {field:'purchaseSupplierName', title: '供应商'},
                            {field:'rentType', width: 130, title: '租赁类型', templet: function (d) {
                                    if (d.rentType == 1) {
                                        return '租赁';
                                    } else if (d.rentType == 2) {
                                        return '租售';
                                    } else if (d.rentType == 3) {
                                        return '直购';
                                    } else {
                                        return '--';
                                    }
                                }},
                            {field:'timeStart', width: 130, title: '合同生效时间'},
                            {field:'timeFinish', width: 130, title: '合同终止时间'},
                            {field:'operationName', title: '提交人'},
                            {field:'timeCreate', width: 130, title: '合同记录时间'},

        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        }
    });
}

function initDate(laydate) {

}
