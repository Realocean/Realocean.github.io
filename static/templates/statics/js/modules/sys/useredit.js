$(function () {
    if(vm.tempUser == null || vm.tempUser.userId == null ){
        vm.getDept();
        vm.getRoleList();
        vm.getDataTree();
    }else{
        vm.getUser(vm.tempUser.userId);
        vm.getRoleList();
        vm.getDataTree(vm.tempUser.userId);
        if(vm.tempUser.permissionsType != undefined && vm.tempUser.permissionsType != null && vm.tempUser.permissionsType == 4 ){
            vm.showPermissions =true;
        }
    }
    layui.use(['form'], function(){
        var form = layui.form;
        form.render();
        //自定义验证
        form.verify({
            username: function(value){
                if(value=="" ||value==null){
                    return '用户名不能为空';
                }
            },
            password: function(value){
                if(value=="" || value==null){
                    return '密码不能为空';
                }
            },
            deptName: function(value){
                if(value=="" || value==null){
                    return '所属部门不能为空';
                }
            },
            status: function(value){
                if(value=="" || value==null){
                    return '用户状态不能为空';
                }
            },
            roleIdList: function(value){
                if(vm.user.roleIdList.length==0){
                    return "账户角色不能为空";
                }
            },
            permissionsType: function(value){
                if(value=="" || value==null){
                    return '数据权限类型不能为空';
                }
            },

            emailV: function(value){
                if(value != null && value.trim()!=''){
                    var reg = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");
                    if(!reg.test(value)){
                        return "邮箱格式不正确";
                    }
                }

            }
        });
    });
    layui.form.on('checkbox(roleIdList)', function(data){
        if(data.elem.checked){
            vm.user.roleIdList.push(data.value);
        }else{
            vm.user.roleIdList=vm.user.roleIdList.filter(t => t != data.value);
        }
        var set = new Set(vm.user.roleIdList);
        vm.user.roleIdList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
    });
    layui.form.on('radio(permissionsType)', function(data){
        vm.user.permissionsType = data.value;
        if(data.value !=  4){
            vm.showPermissions =false;

            var treeObj = $.fn.zTree.getZTreeObj("dataTree");
            treeObj.checkAllNodes(false);
        }else{
            vm.showPermissions =true;
        }
    });
    layui.form.on('switch(status)', function(data){
        if(data.elem.checked){
            vm.user.status = 1;
        }else{
            vm.user.status = 0;
        }
    });
    layui.form.on('radio(choiceRadio)', function (data) {
        if(data.value ==1){
            alert("选择后，全系统的数据此用户都可以看到");
        }
        vm.user.isAdmin = data.value;
        layui.form.render();
    });
    layui.form.on('submit(saveOrUpdate)', function(data){
        vm.saveOrUpdate();
        return false;
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

//数据树
var data_ztree;
var data_setting = {
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
    },
    check:{
        // chkStyle:"checkbox",
        // enable:true,
        // nocheckInherit:true,
        // autoCheckTrigger: true,
        // chkboxType:{ "Y" : "", "N" : "" }
        enable:true,
        nocheckInherit:true
    }
};
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{
        showForm: true,
        roleList:{},
        deptIdList:{},
        showPermissions:false,
        subtips: null,
        user:{
            deptId:null,
            username:null,
            password:'******',
            realname:null,
            mobile:null,
            email:null,
            officialPartner:null,
            deptName:null,
            deptId:null,
            status:1,
            isAdmin:0,
            roleIdList:[],
            deptIdList:[],
            permissionsType:3
        },
        tempUser:{

        }
    },
    created: function() {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.tempUser = param.user;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        mouseout() {
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        move(value) {
            var id = '#LAY_layedit_code' + value;
            var content = "";
            if (value == '1') {
                content = "说明：可以看到全公司（含子公司）下的数据";
            } else if (value == '2') {
                content = "说明：只能看到自己操作的数据";
            } else if (value == '3') {
                content = "说明：只能看到自己所属部门下的所有数据";
            } else if (value == '4') {
                content = "说明：可以看到指定部门下的所有数据";
            }
            if (!vm.subtips) {
                vm.openMsg(id, content, value);
            }
        },
        openMsg(id, content, value) {
            if (value == '3') {
                vm.subtips = layer.tips(content, id, { tips: 1, area: ['20%', '20%'], });
            } else {
                vm.subtips = layer.tips(content, id, { tips: 1 });
            }
        },
            downDoc: function (fileName, url) {
                    console.log(fileName);
                    var uri = baseURL + 'file/download?uri='+encodeURI(url)+"&fileName="+encodeURI(fileName);
                    window.location.href = uri;
            },
            showDoc: function (fileName, url) {
            console.log("showDoc"+fileName);
                        if (viewer != null){
                            viewer.close();
                            viewer = null;
                        }
                        viewer = new PhotoViewer([
                            {
                                src: fileURL+url,
                                title: fileName
                            }
                        ], {
                            appendTo:'body',
                            zIndex:99891018
                        });
            },
        closePage: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.vm.reload();
            parent.layer.close(index);
        },
        refreshPassword: function(){
            confirm('确定要恢复初始密码吗?', function(){
                    $.ajax({
                        type: "POST",
                        url: baseURL + "sys/user/refreshpassword",
                        data: {userId: vm.user.userId},
                        success: function(r){
                            if(r.code == 0){
                                alert("恢复初始密码成功");
                            }else{
                                alert(r.msg);
                            }
                        }
                    });
            });
        },
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r);
                if(vm.user.deptId != null && vm.user.deptId != undefined){
                    var node = ztree.getNodeByParam("deptId", vm.user.deptId);
                    if(node != null){
                        ztree.selectNode(node);
                        vm.user.deptName = node.name;
                    }
                }
            })
        },
        getDataTree: function(userId) {
            //加载菜单树
            $.get(baseURL + "sys/dept/list", function(r){
                data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, r);
                //展开所有节点
                data_ztree.expandAll(true);
                if(userId != null){
                    vm.getUserPermissions(userId);
                }
            });
        },
        getUserPermissions : function(userId){
            var deptIds = vm.user.deptIdList;
            if(deptIds != undefined &&  deptIds != null && deptIds.length >0){
                for(var i=0; i<deptIds.length; i++) {
                    var node = data_ztree.getNodeByParam("deptId", deptIds[i]);
                    data_ztree.checkNode(node, true, false);
                }
            }
        },
        getUser: function(userId){
            $.ajax({
                type: "GET",
                url: baseURL + "sys/user/userInfo/"+userId,
                async:false,
                success: function(r){
                    if(r.code == 0){
                        if(vm.user != undefined && vm.user != null ){
                            vm.user = r.user;
                            if(vm.user.roleIdList == undefined || vm.user.roleIdList == null){
                                vm.user.roleIdList = [];
                            }
                            if(vm.user.roleIdList == undefined || vm.user.deptIdList == null){
                                vm.user.deptIdList = [];
                            }if(vm.user.permissionsType == undefined || vm.user.permissionsType == null){
                                vm.user.permissionsType = 3;
                            }
                            Vue.set(vm.user, "password", '******');
                        }
                        vm.getDept();
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
        getRoleList: function(){
            vm.roleList=[];
            $.get(baseURL + "sys/role/select", function(r){
                if(r.list  != undefined &&  r.list != null){
                    vm.roleList = r.list;
                }
            });
        },
        saveOrUpdate: function () {
            //获取选择的数据,数据权限
            var nodes = data_ztree.getCheckedNodes(true);
            var deptIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                deptIdList.push(nodes[i].deptId);
            }
            if(vm.user.permissionsType == 4){
                if(deptIdList.length == 0){
                    alert("数据权限为指定公司/部门时,一定要选择数据权限!");
                    return ;
                }
            }
            vm.user.deptIdList = deptIdList;
            var url = vm.user.userId == null ? "sys/user/save" : "sys/user/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
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
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: $("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级部门
                    vm.user.deptId = node[0].deptId;
                    vm.user.deptName = node[0].name;
                    layer.close(index);
                },
                end: function(){
                    $("#deptLayer").hide();
                }
            });
        }

    }
});


