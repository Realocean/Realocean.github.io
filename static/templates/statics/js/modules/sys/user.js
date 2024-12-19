$(function () {
    vm.getDeptTreeList();
    layui.use(['tree'], function(){
        var tree = layui.tree;
        var data1 = vm.deptTreeList;
        //常规用法
        tree.render({
             elem: '#test1' //默认是点击节点可进行收缩
            ,data: data1
            ,onlyIconControl: true  //是否仅允许节点左侧图标控制展开收缩
            ,accordion: true
            ,click: function(obj){
                var deptId=obj.data.id;
                if(deptId == '-1'){
                    deptId=null;
                }
                vm.q.deptId=deptId;
                vm.reload();
            }
        });
    });
    // 单选
    $(document).click(function(e) { // 在页面任意位置点击而触发此事件
        if($(e.target).attr('class') === "layui-tree-txt"){ // 防止因为点击展开按钮把已选中的样式取消
            $(".layui-tree-txt").removeClass("tree-txt-active"); // 移除点击样式
            $(e.target).addClass("tree-txt-active"); // e.target表示被点击的目标
        }
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/user/list1',
        cols: [[
            {title: '操作', width:280, minWidth:280, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'username', width:100, title: '用户名称',align:"center", templet: function (d) {return isEmpty(d.username);}},
            {field:'deptName', minWidth:180, title: '所属公司/部门',align:"center", templet: function (d) {return isEmpty(d.deptName);}},
            {field:'mobile', minWidth: 100, title: '手机号',align:"center", templet: function (d) {return isEmpty(d.mobile);}},
            {field:'roleNames', minWidth: 200, title: '角色',align:"center", templet: function (d) {return isEmpty(d.roleNames);}},
            {field:'tenantCode', minWidth: 200, title: '商户号',align:"center", templet: function (d) {return isEmpty(d.tenantCode);}},
            {field: 'status', title: '用户状态', width:90,align:"center",align:'center', templet: '#statusTpl'},
            {field:'lastLoginTime', minWidth:160, title: '最近登录时间',align:"center", templet: function (d) {return isEmpty(d.lastLoginTime);}},
        ]],
        page: true,
        loading: true,
        limits: [10,20,50,100],
        limit: 10
    });
    layui.use(['form'], function(){
        var form = layui.form;
        form.render();
    });
    layui.form.on('select(statusData)',function (data) {
        vm.q.status=data.value;
    }),
    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data);
        }else if(layEvent === 'updatestatus'){
            vm.updateStatus(data.userId,data.status);
        }else if(layEvent === 'handover'){
            vm.handover(data.userId,data.username);
        }else if(layEvent === 'generateWxQrcode'){
            vm.generateWxQrcode(data);
        }
    });
});
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            mobile:null,
            status:null,
            username: null,
            deptId:null
        },
        deptTreeList:[]
    },
    created: function() {
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        generateWxQrcode:function(data){
                    $.ajax({
                        type: "POST",
                        url: baseURL + "sys/user/generateWxQrcode",
                        data: {userId:data.userId},
                        async: false,
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
        },
        getDeptTreeList:function(){
                $.ajax({
                    type: "GET",
                    url: baseURL + "sys/dept/depttreelist",
                    data: null,
                    async:false,
                    success: function(r){
                        if(r.code == 0){
                            vm.deptTreeList=r.deptList;
                        }else{
                            alert(r.msg);
                        }
                    }
                });
        },
        updateStatus:function(userId,status){
            var title='确定要启用选中的记录';
            var saveStatus='1';
            if(status == 1){
                title='确定要禁用选中的记录';
                saveStatus = '0';
            }
            confirm(title, function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/user/status",
                    data: {userId: userId, status: saveStatus},
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
        query: function () {
            vm.reload();
        },
        add: function(){
            var param={
                user:{}
            };
            var index = layer.open({
                title: "新增用户信息",
                type: 2,
                boxParams:param,
                content: tabBaseURL + "modules/sys/useredit.html",
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        update: function(user){
            var param={
                user:user
            };
            var index = layer.open({
                title: "修改用户信息",
                type: 2,
                boxParams:param,
                content: tabBaseURL + "modules/sys/useredit.html",
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        handover: function(userId,username){
            var param={
                userId:userId,
                username:username
            };
            var index = layer.open({
                title: "员工数据交接",
                type: 2,
                area: ['80%', '80%'],
                boxParams:param,
                content: tabBaseURL + "modules/sys/handover.html",
                end: function(){
                    layer.closeAll();
                }
            });
            /*layer.full(index);*/
        },
        exports: function () {
            var url = baseURL + 'sys/user/export1?1=1';
            if(vm.q.mobile != null){
                url += '&mobile='+vm.q.mobile;
            }
            if(vm.q.status != null){
                url += '&status='+vm.q.status;
            }
            if(vm.q.username != null){
                url += '&username='+vm.q.username;
            }
            if(vm.q.deptId != null){
                url += '&deptId='+vm.q.deptId;
            }
            window.location.href = url;
        },
        reset:function(){
            vm.q.mobile=null;
            vm.q.status=null;
            vm.q.username=null;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    mobile: vm.q.mobile,
                    status: vm.q.status,
                    username: vm.q.username,
                    deptId: vm.q.deptId
                }
            });
        }
    }
});


