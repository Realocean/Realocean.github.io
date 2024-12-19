//部门结构树
var dept_ztree;
var dept_setting = {
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
        enable:false,
        nocheckInherit:true
    },
    callback: {
        beforeClick: zTreeBeforeClick,
        onClick: parent.vm.zTreeClick
    }
};

// 部门树-多选
var dept_ztree2;
var dept_setting2 = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl",
            icon:null
        },

    },
    check:{
        enable:true,
        nocheckInherit:true,
        chkStyle: "checkbox",
        // 故意加该参数，勾选时没有任何级联操作，选谁就谁
        chkboxType: { "Y": "", "N": "" }
    },
    callback: {
        onCheck: parent.vm.zTreeOnCheck
    }
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    return true;
};

$(function(){
    // 单选初始化
    if(multiple==0){
        vm.getDept();
    }else{
        // 多选初始化
        console.log("多选初始化")
        vm.getDept2();
    }
});



var vm = new Vue({
    el:'#rrapp',
    data:{

    },
    computed: function () {
        layui.form.render();
    },
    mounted:function(){
        layui.form.render();
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list",parent.vm.sysDeptParam,function(r){
                dept_ztree = $.fn.zTree.init($("#deptTree"), dept_setting, r);
                dept_ztree.expandAll(true);
                var node = dept_ztree.getNodeByParam("deptId", "");
                if(node != null){
                    dept_ztree.selectNode(node);
                }
            })
        },
        /**
         * 部门树多选
         */
        getDept2: function() {
            $('#deptTree').html('');
            //加载菜单树
            $.get(baseURL + "sys/dept/list", function(r){
                dept_ztree2 = $.fn.zTree.init($("#deptTree"), dept_setting2, r);
                //展开所有节点
                dept_ztree2.expandAll(true);
                //数据回显
                var deptIdList = parent.vm.q.deptIdList;
                if(deptIdList && deptIdList.length>0){
                    var nodes = dept_ztree2.transformToArray(dept_ztree2.getNodes());
                    for (let i = 0; i < nodes.length; i++) {
                        if(deptIdList.includes(nodes[i].deptId)){
                            //勾选
                            dept_ztree2.checkNode(nodes[i],true);
                        }
                    }
                }
                parent.vm.q.deptZtreeObj = dept_ztree2;
            });
        }
    }
});

