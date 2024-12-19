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

            var transferIds = [];
            $.each(list, function(index, item) {
                transferIds.push(item.transferId);
            });
            return transferIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.keyword = null;
        },
        view: function (transferId) {
            $.get(baseURL + "order/cartransfer/info/"+transferId, function(r){
                var param = {
                    data:r.carTransfer
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/cartransferview.html",
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
                content: tabBaseURL + "modules/order/cartransferedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (transferId) {
            $.get(baseURL + "order/cartransfer/info/"+transferId, function(r){
                var param = {
                    data:r.carTransfer
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/cartransferedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (transferIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "order/cartransfer/delete",
                    contentType: "application/json",
                    data: JSON.stringify(transferIds),
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
            var url = baseURL + 'order/cartransfer/export?a=a';
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
        var transferIds = vm.selectedRows();
        if(transferIds == null){
            return;
        }
        vm.del(transferIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'order/cartransfer/list',
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'transferId', title: '主键', minWidth:200, templet: function (d) {return isEmpty(d.transferId);}},
                            {field:'orderNo', title: '子订单主键', minWidth:200, templet: function (d) {return isEmpty(d.orderNo);}},
                            {field:'orderCarNo', title: '子订单编号', minWidth:200, templet: function (d) {return isEmpty(d.orderCarNo);}},
                            {field:'carId', title: '车辆主键', minWidth:200, templet: function (d) {return isEmpty(d.carId);}},
                            {field:'estimatedTransferTime', title: '预计过户时间', minWidth:200, templet: function (d) {return isEmpty(d.estimatedTransferTime);}},
                            {field:'transferTime', title: '过户时间(实际过户时间)', minWidth:200, templet: function (d) {return isEmpty(d.transferTime);}},
                            {field:'createTime', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
                            {field:'updateTime', title: '修改时间', minWidth:200, templet: function (d) {return isEmpty(d.updateTime);}},
                            {field:'delFlag', title: '删除状态 0.正常 1.删除', minWidth:200, templet: function (d) {return isEmpty(d.delFlag);}},
                            {field:'remarks', title: '过户备注', minWidth:200, templet: function (d) {return isEmpty(d.remarks);}},
                            {field:'operatorId', title: '操作人id', minWidth:200, templet: function (d) {return isEmpty(d.operatorId);}},
                            {field:'operator', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operator);}},
            
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
            vm.update(data.transferId);
        } else if(layEvent === 'del'){
            var transferId = [data.transferId];
            vm.del(transferId);
        } else if(layEvent === 'view'){
            vm.view(data.transferId);
        }
    });
}

function initDate(laydate) {

}
