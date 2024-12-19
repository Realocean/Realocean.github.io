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
        },
        isClose: true,
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
            $.get(baseURL + "order/orderrelerecord/info/"+id, function(r){
                var param = {
                    data:r.orderRelerecord
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/orderrelerecordview.html",
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
                content: tabBaseURL + "modules/order/orderrelerecordedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "order/orderrelerecord/info/"+id, function(r){
                var param = {
                    data:r.orderRelerecord
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/orderrelerecordedit.html",
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
                    url: baseURL + "order/orderrelerecord/delete",
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
            var url = baseURL + 'order/orderrelerecord/export?a=a';
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
        url: baseURL + 'order/orderrelerecord/list',
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'id', title: '', minWidth:200, templet: function (d) {return isEmpty(d.id);}},
                            {field:'code', title: '编号', minWidth:200, templet: function (d) {return isEmpty(d.code);}},
                            {field:'quondamOrderId', title: '订单id（本次续租的原订单）', minWidth:200, templet: function (d) {return isEmpty(d.quondamOrderId);}},
                            {field:'pristineOrderId', title: '订单id（本次续租的新订单）', minWidth:200, templet: function (d) {return isEmpty(d.pristineOrderId);}},
                            {field:'quondamOrderCarId', title: '车辆订单id（本次续租的原订单）', minWidth:200, templet: function (d) {return isEmpty(d.quondamOrderCarId);}},
                            {field:'pristineOrderCarId', title: '车辆订单id（本次续租的新订单）', minWidth:200, templet: function (d) {return isEmpty(d.pristineOrderCarId);}},
                            {field:'timeStart', title: '续租开始时间', minWidth:200, templet: function (d) {return isEmpty(d.timeStart);}},
                            {field:'timeFinish', title: '续租结束时间', minWidth:200, templet: function (d) {return isEmpty(d.timeFinish);}},
                            {field:'paymentDay', title: '付款日', minWidth:200, templet: function (d) {return isEmpty(d.paymentDay);}},
                            {field:'orderCarPlanId', title: '车辆订单方案id', minWidth:200, templet: function (d) {return isEmpty(d.orderCarPlanId);}},
                            {field:'desc', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.desc);}},
                            {field:'status', title: '', minWidth:200, templet: function (d) {return isEmpty(d.status);}},
                            {field:'operationId', title: '提交人id', minWidth:200, templet: function (d) {return isEmpty(d.operationId);}},
                            {field:'operationName', title: '提交人姓名', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
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
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
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
