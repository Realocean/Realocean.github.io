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
    callback: {
        beforeClick: zTreeBeforeClick,
        onClick: parent.vm.zTreeClickTwo
    }
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    return true;
};

$(function(){
    vm.getDept();
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
                var node = dept_ztree.getNodeByParam("deptId", "");
                if(node != null){
                    dept_ztree.selectNode(node);
                }
            })
        }
    }
});

