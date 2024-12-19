$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'financial/maintenancemanagerecord/list',
        cols: [[
            {type:'checkbox'},
            {field:'maintenanceRecordId', minWidth:100, title: ''},
            {field:'maintenanceNumber', minWidth:100, title: '保养编号'},
            {field:'maintenanceItemId', minWidth:100, title: '保养项目id'},
            {field:'maintenanceItemName', minWidth:100, title: '保养项目名称'},
            {field:'maintenanceItemFee', minWidth:100, title: '保养项目金额'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"right",align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20
    });

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });


    //批量删除
    $(".delBatch").click(function(){
        var maintenanceRecordIds = vm.selectedRows();
        if(maintenanceRecordIds == null){
            return;
        }
        vm.del(maintenanceRecordIds);
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.maintenanceRecordId);
        } else if(layEvent === 'del'){
            var maintenanceRecordId = [data.maintenanceRecordId];
            vm.del(maintenanceRecordId);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        showForm: false,
        maintenanceManageRecord: {}
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

            var maintenanceRecordIds = [];
            $.each(list, function(index, item) {
                maintenanceRecordIds.push(item.maintenanceRecordId);
            });
            return maintenanceRecordIds;
        },
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.maintenanceManageRecord = {};

            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        update: function (maintenanceRecordId) {
            $.get(baseURL + "financial/maintenancemanagerecord/info/"+maintenanceRecordId, function(r){
                vm.maintenanceManageRecord = r.maintenanceManageRecord;
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        del: function (maintenanceRecordIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "financial/maintenancemanagerecord/delete",
                    contentType: "application/json",
                    data: JSON.stringify(maintenanceRecordIds),
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
        saveOrUpdate: function (event) {
            var url = vm.maintenanceManageRecord.maintenanceRecordId == null ? "financial/maintenancemanagerecord/save" : "financial/maintenancemanagerecord/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.maintenanceManageRecord),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        exports: function () {
            var url = baseURL + 'financial/maintenancemanagerecord/export';
            if(vm.q.keyword != null){
                url += '?keyword='+vm.q.keyword;
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