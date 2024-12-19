$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/user/list',
        cols: [[

            {field:'username', width:120, title: '用户名'},
            {field:'deptName', minWidth:80, title: '所属部门'},
            {field:'mobile', minWidth: 100, title: '手机号'},
            {field: 'status', title: '状态', width:100, align:'center', templet: '#statusTpl',templet:function (d) {
                    if(d.status==1){
                        return "正常";
                    }else if(d.status==0){
                        return "禁用";
                    }else {
                        return "--";
                    }
                }},
            {title: '操作', width:120, templet:'#barTpl',fixed:"right",align:"center"}
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
        if(layEvent === 'selectUser'){
            vm.selectUser(data);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            username: null
        },
        showForm: false,
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
                ids.push(item.userId);
            });
            return ids;
        },

        selectUser: function (data) {
            var personnelId = data.userId;
            var personnelName = data.username;
            parent.$("#returnpersonnelId").val(personnelId);
            parent.$("#returnpersonnelName").val(personnelName);
            parent.vm.returnCarCheck.personnelId = personnelId;
            parent.vm.returnCarCheck.personnelName = personnelName;
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        query: function () {
            vm.reload();
        },

        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    username: vm.q.username,
                    status:1
                }
            });
        }
    }
});

