$(function () {
    vm.showForm = true;
    //状态
    layui.form.on('switch(status)', function(data){
        var index = layer.msg('修改中，请稍候',{icon: 16,time:false});
        var status = 0;
        if(data.elem.checked){
            status = 1;
        }
        vm.updateStatus(data.value, status);

        layer.close(index);
    });

    layui.form.on('submit(saveOrUpdate)', function(data){
        vm.user.roleIdList = [];
        $("input:checkbox[name='roleIdList']:checked").each(function() {
            vm.user.roleIdList.push($(this).val());
        });

        if(data.field.status == 'on'){
            vm.user.status = 1;
        }else{
            vm.user.status = 0;
        }
        if(data.field.isHeader == 'on'){
            vm.user.isHeader = 1;
        }else{
            vm.user.isHeader = 0 ;
        }

        vm.saveOrUpdate();
        return false;
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
            vm.update(data.userId);
        } else if(layEvent === 'view'){
            vm.view(data.userId);
        } else if(layEvent === 'del'){
            var userIds = [data.userId];
            vm.del(userIds);
        }
    });

});


var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            username: null
        },
        showForm: false,
        detailForm:true,
        roleList:{},
        indexUser:null,
        user:{
            status:1,
            deptId:null,
            deptName:null,
            roleIdList:[]
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {

        cancel: function(){
            parent.layer.close(vm.indexUser);
        },


        update: function () {
            vm.getUser();

            var index = layer.open({
                title: "修改密码",
                type: 1,
                // btn: ['确认', '关闭'],
                // btnAlign: 'c',
                content: $("#editForm"),

            });

            vm.showForm = true;
            layer.full(index);
        },

        saveOrUpdate: function () {
            vm.saveData();
        },
        saveData: function(){
            $.ajax({
                type: "POST",
                url: baseURL + "sys/user/updatepassword",
                contentType: "application/json",
                data: JSON.stringify(vm.user),
                success: function(r){
                    if(r.code === 0){
                        layer.alert('操作成功', function(){
                            layer.close(layer.index);
                            parent.location.reload(); // 父页面刷新
                        });
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
        getUser: function(){
            $.get(baseURL + "sys/user/getUserInfo", function(r){
                vm.user = r.user;
            });
        },
    }
});

