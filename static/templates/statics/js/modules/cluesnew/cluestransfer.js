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
            var userId = data.value;
            vm.user.handoverUserId=userId;
            var obj = vm.handoveruserlist.filter(function (obj) {
                return obj.userId == userId;
            })[0];
            if (obj != null){
                vm.user.handoverUserName = obj.username;
            }else {
                vm.user.handoverUserName = '';
            }
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
            desc:null,
            handoverUserId:null,
            handoverUserName:null,
            handoverDeptId:null,
            handoverDeptName:null
        },
        clues:{},
        cluesRecord:{},
        handoveruserlist:[]
    },
    created: function() {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.clues=param.data;
        _this.cluesRecord = {
            cluesId: param.data.cluesId,
            oldFollowId: param.data.followId,
            oldFollowName: param.data.followName,
            oldFollowDeptId: param.data.followDeptId,
            oldFollowDeptName: param.data.followDeptName,
            operatorId: sessionStorage.getItem("userId"),
            operatorName: sessionStorage.getItem("username"),
            operatorDeptId: sessionStorage.getItem("userdeptId"),
            operatorDeptName: sessionStorage.getItem("userdeptName"),
        }
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
            vm.cluesRecord.desc = vm.user.desc;
            vm.cluesRecord.newFollowId = vm.user.handoverUserId;
            vm.cluesRecord.newFollowName = vm.user.handoverUserName;
            vm.cluesRecord.newFollowDeptId = vm.user.handoverDeptId;
            vm.cluesRecord.newFollowDeptName = vm.user.handoverDeptName;
            vm.clues.followId = vm.user.handoverUserId;
            vm.clues.followName = vm.user.handoverUserName;
            vm.clues.followDeptId = vm.user.handoverDeptId;
            vm.clues.followDeptName = vm.user.handoverDeptName;
            // vm.clues.countFollow = vm.clues.countFollow + 1;
            vm.clues.cluesRecord = vm.cluesRecord;
            // if (vm.cluesRecord.newFollowId == vm.cluesRecord.oldFollowId){
            //     vm.clues.followType = 1;
            // }else vm.clues.followType = 2;
            if (vm.clues.followId == vm.clues.operatorId){
                vm.clues.followType = 1;
            }else vm.clues.followType = 2;
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + "cluesnew/clues/cluestransfer",
                contentType: "application/json",
                data: JSON.stringify(vm.clues),
                success: function(r){
                    RemoveLoading();
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
        },
        getUserList :function(deptId){
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


