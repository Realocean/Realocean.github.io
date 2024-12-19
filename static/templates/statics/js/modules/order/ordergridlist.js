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
            keyword: null
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
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.keyword = null;
        },
        view: function (id) {
            $.get(baseURL + "order/ordergrid/info/"+id, function(r){
                var param = {
                    data:r.orderGrid
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/ordergridview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/ordergridedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "order/ordergrid/info/"+id, function(r){
                var param = {
                    data:r.orderGrid
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/ordergridedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "order/ordergrid/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            var url = baseURL + 'order/ordergrid/export?a=a';
            if(vm.q.keyword != null && vm.q.keyword != ''){
                url += ('&keyword='+vm.q.keyword);
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    keyword: vm.q.keyword
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

}

function initClick() {
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'order/ordergrid/list',
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'id', title: '', minWidth:200, templet: function (d) {return isEmpty(d.id);}},
                            {field:'code', title: '发车单编号', minWidth:200, templet: function (d) {return isEmpty(d.code);}},
                            {field:'contractId', title: '合同id', minWidth:200, templet: function (d) {return isEmpty(d.contractId);}},
                            {field:'contractCode', title: '合同编号', minWidth:200, templet: function (d) {return isEmpty(d.contractCode);}},
                            {field:'orderId', title: '订单id', minWidth:200, templet: function (d) {return isEmpty(d.orderId);}},
                            {field:'orderCode', title: '订单编号', minWidth:200, templet: function (d) {return isEmpty(d.orderCode);}},
                            {field:'customerId', title: '客户id', minWidth:200, templet: function (d) {return isEmpty(d.customerId);}},
                            {field:'customerType', title: '客户类型；1企业2个人', minWidth:200, templet: function (d) {return isEmpty(d.customerType);}},
                            {field:'customerName', title: '客户名称', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
                            {field:'lessorId', title: '售卖方id', minWidth:200, templet: function (d) {return isEmpty(d.lessorId);}},
                            {field:'lessorName', title: '售卖方名称', minWidth:200, templet: function (d) {return isEmpty(d.lessorName);}},
                            {field:'rentType', title: '租赁类型：1、长租 2、以租代购 3、展示车 4、试驾车', minWidth:200, templet: function (d) {return isEmpty(d.rentType);}},
                            {field:'paymentMethod', title: '付款方式：1、月付 2、两月付 3、季付 4、年付 5、一次性结清', minWidth:200, templet: function (d) {return isEmpty(d.paymentMethod);}},
                            {field:'modelId', title: '型号id', minWidth:200, templet: function (d) {return isEmpty(d.modelId);}},
                            {field:'modelName', title: '车型名称', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
                            {field:'rentCount', title: '租赁数量', minWidth:200, templet: function (d) {return isEmpty(d.rentCount);}},
                            {field:'gridCount', title: '发车单总车辆', minWidth:200, templet: function (d) {return isEmpty(d.gridCount);}},
                            {field:'status', title: '状态：1、执行中 2、已完成', minWidth:200, templet: function (d) {return isEmpty(d.status);}},
                            {field:'operationId', title: '提交人id', minWidth:200, templet: function (d) {return isEmpty(d.operationId);}},
                            {field:'operationName', title: '提交人姓名', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
                            {field:'desc', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.desc);}},
                            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
                            {field:'timeUpdate', title: '更新时间', minWidth:200, templet: function (d) {return isEmpty(d.timeUpdate);}},
                            {field:'delect', title: '删除状态（0未删除，1已删除）', minWidth:200, templet: function (d) {return isEmpty(d.delect);}},
            
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
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
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
