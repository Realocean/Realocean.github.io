//数据树
var ztree;
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
    },
    check:{
        enable:false
    },
    callback:{
        onClick: ztreeOnClick
    }
};
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            username: null,
            deptId:null
        }
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function(){
      this.getTree();
    },
    methods: {
        getTree: function() {
            //加载菜单树
            $.get(baseURL + "sys/dept/list", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r);
                //展开所有节点
                ztree.expandAll(true);
                var nodes = ztree.getNodes();
                ztree.selectNode(nodes[0]);
                vm.q.deptId = nodes[0].deptId;
                vm.gridInit(vm.q.deptId);
            });
        },
        gridInit: function(deptId){
            gridTable = layui.table.render({
                id: "gridid",
                elem: '#grid',
                url: baseURL + 'sys/user/list',
                where:{"deptId":deptId},
                cols: [[
                    {type: 'radio'},
                    {field: 'userId', width: 100, title: '用户ID'},
                    {field: 'username', width: 120, title: '用户名'},
                    {field: 'deptName', minWidth: 80, title: '所属部门'},
                    {field: 'email', minWidth: 80, title: '邮箱'},
                    {field: 'mobile', minWidth: 100, title: '手机号'},
                    // {field: 'status', title: '状态', width: 100, align: 'center', templet: '#statusTpl'},
                    {field: 'createTime', minWidth: 170, title: '创建时间'}
                    // {title: '操作', width: 120, templet: '#barTpl', fixed: "right", align: "center"}
                ]],
                page: true,
                loading: true,
                limits: [20, 50, 100, 200],
                limit: 20
            });
        },
        query: function () {
            vm.reload();
        },
        rest: function(){
            vm.q.username = null;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    username: vm.q.username,
                    deptId: vm.q.deptId
                }
            });
        }
    }
});

function ztreeOnClick(event, treeId, treeNode){
    vm.q.deptId = treeNode.deptId;
    vm.reload();
}