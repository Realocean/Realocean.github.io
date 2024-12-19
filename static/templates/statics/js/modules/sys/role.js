$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/role/list',
        cols: [[
            {title: '操作', width:100, minWidth:100, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'roleName', minWidth:120, title: '角色名称', align: "center",templet: function (d) {return isEmpty(d.roleName);}},
            {field:'remark', minWidth:120, title: '备注', align: "center",templet: function (d) {return isEmpty(d.remark);}},
            {field:'createTime', minWidth:170, align: "center",title: '创建时间',templet: function (d) {return dateFormatYMDHM(d.createTime);}}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
    });
    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data);
        } else if(layEvent === 'del'){
            var roleId = data.roleId;
            vm.del(roleId);
        }
    });

});
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            roleName: null
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        reset:function(){
            vm.q.roleName=null;
        },
        query: function () {
            vm.reload();
        },
        add: function(){
            var param={
                role:{}
            };
            var index = layer.open({
                title: "新增角色",
                type: 2,
                boxParams:param,
                content: tabBaseURL + "modules/sys/roleedit.html",
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        update: function (data) {
            var param={
                role:data
            };
            var index = layer.open({
                title: "修改角色",
                type: 2,
                boxParams:param,
                content: tabBaseURL + "modules/sys/roleedit.html",
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        del: function (roleId) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/role/delete",
                    contentType: "application/json",
                    data: JSON.stringify(roleId),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
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
                where: {
                    roleName: vm.q.roleName
                }
            });
        }
    }
});