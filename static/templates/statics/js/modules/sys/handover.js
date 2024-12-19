$(function () {
    vm.getDept();
    layui.use(['form'], function(){
        var form = layui.form;
        form.render();
        //自定义验证
        form.verify({
            handoverDeptNameVerify: function(value){
                if(value=="" ||value==null){
                    return '交接部门不能为空!';
                }
            },
            handoverUserIdVerify: function(value){
                if(value=="" || value==null){
                    return '交接用户不能为空!';
                }
            }
        });
        form.on('select(handoverUserId)', function(data){
            vm.user.handoverUserId=data.value;
        });
        form.on('submit(saveOrUpdate)', function(data){
            vm.saveOrUpdate();
            return false;
        });
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
        showForm: true,
        user:{
            oldUserId:null,
            username:null,
            handoverUserId:null,
            handoverDeptId:null,
            handoverDeptName:null
        },
        handoveruserlist:[]
    },
    created: function() {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.user.oldUserId=param.userId;
        _this.user.username=param.username;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        closePage: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.vm.reload();
            parent.layer.close(index);
        },
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r);
                if(vm.user.handoverDeptId != null && vm.user.handoverDeptId != undefined){
                    var node = ztree.getNodeByParam("deptId", vm.user.handoverDeptId);
                    if(node != null){
                        ztree.selectNode(node);
                        vm.user.handoverDeptName = node.name;
                    }
                }
            })
        },
        saveOrUpdate: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "sys/user/handover",
                contentType: "application/json",
                data: JSON.stringify(vm.user),
                success: function(r){
                    if(r.code === 0){
                        layer.alert('操作成功', function(){
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.vm.reload();
                            parent.layer.close(index);
                        });
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '350px'],
                shade: 0,
                shadeClose: false,
                content: $("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级部门
                    vm.user.handoverDeptId = node[0].deptId;
                    vm.user.handoverDeptName = node[0].name;
                    vm.getUserList(vm.user.handoverDeptId);
                    layer.close(index);
                },
                end: function(){
                    $("#deptLayer").hide();
                }
            });
        },getUserList :function(deptId){
                vm.handoveruserlist=[];
                $.ajax({
                    async :false,
                    type: "GET",
                    url: baseURL + "sys/user/listall?deptId="+deptId,
                    success: function(r){
                        vm.handoveruserlist=r.userList;
                    }
                });
        }
    }
});


