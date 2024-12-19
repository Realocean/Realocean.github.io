$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'marketing/scactivitypeer/list',
        cols: [[
            {title: '操作', width:200,fixed:"left",align:"center", templet: function (d) {
                var status = d.status
                var button = "";
                if(1 == status){
                    button = $('#editTpl').html() + " " + $('#delTpl').html() + " " + $('#startTpl').html() + " " + $('#showTpl').html();
                }else if(2 == status){
                    button = $('#stopTpl').html() + " " + $('#showTpl').html();
                }else if(3 == status){
                    button = $('#restartTpl').html() + " " + $('#stopTpl').html() + " " + $('#showTpl').html();
                }else if(4 == status){
                    button = $('#showTpl').html();
                }
                return button;
            }},
            {field:'peerTitle', minWidth:200, title: '活动标题'},
            {field:'statusStr', minWidth:200, title: '活动状态', templet: function (d) {
                var status = d.status
                var color = ""
                if(1 == status){
                    color = "orange"
                }else if(2 == status){
                    color = "green"
                }else if(3 == status){
                    color = "red"
                }else if(4 == status){
                    color = "black"
                }
                return "<p style='color: "+color+"'>" + isEmpty(d.statusStr) + "</p>";
            }},
            {field:'timeStart', minWidth:200, title: '活动开始时间', templet: function (d) {
                    return isEmpty(d.timeStart);
                }
            },
            {field:'timeEnd', minWidth:200, title: '活动结束时间', templet: function (d) {
                    return isEmpty(d.timeEnd);
                }
            },
            {field:'deptName', minWidth:200, title: '活动创建部门', templet: function (d) {
                    return isEmpty(d.deptName);
                }
            },
            {field:'createTime', minWidth:200, title: '活动创建时间', templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20
    });


    //批量删除
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        }else if(layEvent === 'show'){
            vm.show(data.id);
        }else if(layEvent === 'start'){
            vm.updateStatus(data.id,2,'开始');
        }else if(layEvent === 'restart'){
            vm.updateStatus(data.id,2,'启用');
        }else if(layEvent === 'stop'){
            vm.updateStatus(data.id,3,'暂停');
        }else if(layEvent === 'end'){
            vm.updateStatus(data.id,4,'结束');
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
        editForm: false,
scActivityPeer: {}
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
    add: function(){
        vm.scActivityPeer = {};

        var index = layer.open({
            title: "新增",
            type: 1,
            btn:['保存'] ,
            content: $("#editForm"),
            end: function(){
                vm.editForm = false;
                layer.closeAll();
            },
            btn1:function (index, layero) {
                vm.saveOrUpdate();
            }
        });
        vm.editForm = true;
        layer.full(index);
    },
    update: function (id) {
        $.get(baseURL + "marketing/scactivitypeer/info/"+id, function(r){
            vm.scActivityPeer = r.scActivityPeer;
        });

        var index = layer.open({
            title: "修改",
            type: 1,
            btn:['保存'] ,
            content: $("#editForm"),
            end: function(){
                vm.editForm = false;
                layer.closeAll();
            },
            btn1:function (index, layero) {
                vm.saveOrUpdate();
            }
        });

        vm.editForm = true;
        layer.full(index);
    },
    show:function (id) {
        $.get(baseURL + "marketing/scactivitypeer/info/"+id, function(r){
            vm.scActivityPeer = r.scActivityPeer;
        });

        var index = layer.open({
            title: "查看",
            type: 1,
            content: $("#showForm"),
            end: function(){
                vm.showForm = false;
                layer.closeAll();
            }
        });

        vm.showForm = true;
        layer.full(index);
    },
    del: function (ids) {
        confirm('确定要删除选中的记录？', function(){
            $.ajax({
                type: "POST",
                url: baseURL + "marketing/scactivitypeer/delete",
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
    updateStatus: function (ids,status,statusName) {
        confirm('确定要'+ statusName + '选中的记录？', function () {
            var params = "status=" + status
            "&id=" + id;
            $.ajax({
                type: "POST",
                url: baseURL + "marketing/scactivitypeer/updateStatus?" + params,
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
    saveOrUpdate: function (event) {
        var url = vm.scActivityPeer.id == null ? "marketing/scactivitypeer/save" : "marketing/scactivitypeer/update";
        $.ajax({
            type: "POST",
            url: baseURL + url,
            contentType: "application/json",
            data: JSON.stringify(vm.scActivityPeer),
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
        var url = baseURL + 'marketing/scactivitypeer/export';
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