$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'mark/processnode/listNoPage',
        where:{"processKey":window.localStorage.getItem("processKey")},
        cols: [[
            // {type:'checkbox'},
            // {field:'id', minWidth:100, title: ''},
            {field:'nodeName', minWidth:100, title: '环节名称'},
            {field:'nodeDesc', minWidth:100, title: '环节描述'},
            // {field:'nodeApplyId', minWidth:100, title: '环节申请人id'},
            // {field:'nodeApplyName', minWidth:100, title: '环节申请人名称'},
            // {field:'nodeApproveId', minWidth:100, title: '环节审批人id'},
            {field:'nodeApproveName', minWidth:100, title: '审批人'},
            // {field:'nodeCopyId', minWidth:100, title: '环节抄送人id'},
            {field:'nodeCopyName', minWidth:100, title: '抄送人'},
            {field:'nodeOrder', minWidth:100, title: '环节排序'},
            // {field:'processKey', minWidth:100, title: '流程编码'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"right",align:"center"}
        ]],
        page: false,limit: 500,
        loading: true
    });

    layui.form.on('submit(saveOrUpdate)', function(){
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
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'editFirst'){
            vm.updateFirst(data.id);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            nodeName: null
        },
        showForm: false,
        showFirstForm: false,
        processNode: {}
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectType: function(){
            //选择审批人类型
            var index = layer.open({
                title: "选择审批人",
                type: 2,
                content: tabBaseURL + "modules/activiti/selectflag.html",
                btn: ['确定', '取消'],
                btn1: function(index,layero){
                    var approveType = window[layero.find('iframe')[0]['name']].vm.approveFlag;
                    var approveLevel = window[layero.find('iframe')[0]['name']].vm.approveType.level;
                    if(approveType == 1){
                        //上级,获取approveLevel,判断为直接上级或第二级上级
                        vm.processNode.nodeFlag = approveType;
                        vm.processNode.nodeLevel = approveLevel;
                        if(approveLevel == 2){
                            $("#approveId").val('第二级上级');
                            vm.processNode.nodeApproveId = '第二级上级';
                            vm.processNode.nodeApproveName = '第二级上级';
                        }else{
                            $("#approveId").val('直接上级');
                            vm.processNode.nodeApproveId = '直接上级';
                            vm.processNode.nodeApproveName = '直接上级';
                        }
                    }else if(approveType==2){
                        //单个成员
                        vm.selectApproveUser(approveType);
                    }else if(approveType==3){
                        //申请人
                        $("#approveId").val('申请人');
                        vm.processNode.nodeApproveId = '申请人';
                        vm.processNode.nodeApproveName = '申请人';
                        vm.processNode.nodeLevel = '';
                        vm.processNode.nodeFlag = approveType;
                    }
                    layer.close(index);
                },
                end: function (index) {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        selectApproveUser: function(approveType){
            //选择审批人
            var index = layer.open({
                title: "选择审批人",
                type: 2,
                content: tabBaseURL + "modules/activiti/selectuser.html",
                btn: ['确定', '取消'],
                btn1: function(index,layero){
                    var list = window[layero.find('iframe')[0]['name']].layui.table.checkStatus('gridid').data;
                    if(list.length == 0){
                        alert("请选择至少一个审批人");
                        return ;
                    }
                    if(list.length>1){
                        alert("每个环节只能选择一个审批人");
                    }
                    // var ids = [];
                    // $.each(list, function(index, item) {
                    //     ids.push(item.userId);
                    // });
                    $("#approveId").val(list[0].username);
                    vm.processNode.nodeApproveName = list[0].username;
                    vm.processNode.nodeApproveId = list[0].userId;
                    vm.processNode.nodeFlag = approveType;
                    vm.processNode.nodeLevel = '';
                    layer.close(index);
                },
                end: function (index) {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        selectCopyUser: function(){
            //选择抄送人
            var index = layer.open({
                title: "选择抄送人",
                type: 2,
                content: tabBaseURL + "modules/activiti/selectuser.html",
                btn: ['确定', '取消'],
                btn1: function(index,layero){
                    var list = window[layero.find('iframe')[0]['name']].layui.table.checkStatus('gridid').data;
                    if(list.length == 0){
                        alert("请选择至少一个抄送人");
                        return ;
                    }
                    var copyName = [];
                    var copyId = [];
                    $.each(list, function(index, item) {
                        copyId.push(item.userId);
                        copyName.push(item.username);
                    });
                    vm.processNode.nodeCopyName = copyName.join(',');
                    vm.processNode.nodeCopyId = copyId.join(',');
                    layer.close(index);
                },
                end: function (index) {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        cancel: function(){
            layer.closeAll();
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.processNode = {};
            //nodeOrder需要通过查询获取
            var processKey = window.localStorage.getItem("processKey");
            $.ajax({
                type: "POST",
                url: baseURL + "/mark/processnode/queryNodeOrder",
                data: {"processKey":processKey},
                success: function(r){
                    if(r.code === 0){
                        vm.processNode.nodeOrder = r.nextNodeOrder;
                        var index = layer.open({
                            title: "新增环节",
                            type: 1,
                            area: ['700px', '600px'],
                            content: $("#editForm"),
                            end: function(){
                                vm.showForm = false;
                                layer.closeAll();
                            }
                        });
                        vm.showForm = true;
                    }
                }
            });
        },
        updateFirst: function(id){
            $.get(baseURL + "mark/processnode/info/"+id, function(r){
                vm.processNode = r.processNode;
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                area: ['700px', '600px'],
                content: $("#editFirstForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showFirstForm = true;
        },
        update: function (id) {
            $.get(baseURL + "mark/processnode/info/"+id, function(r){
                vm.processNode = r.processNode;
                window.localStorage.setItem("nodeFlag",vm.processNode.nodeFlag);
                window.localStorage.setItem("nodeLevel",vm.processNode.nodeLevel);
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                area: ['700px', '600px'],
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "mark/processnode/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
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
        saveOrUpdate: function (event) {
            var url = vm.processNode.id == null ? "mark/processnode/save" : "mark/processnode/update";
            if(vm.processNode.id == null){
                vm.processNode.processKey = window.localStorage.getItem("processKey");
            }
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.processNode),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        exports: function () {
            var url = baseURL + 'mark/processnode/export';
            if(vm.q.keyword != null){
                url += '?keyword='+vm.q.keyword;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: false,
                limit: 500,
                where: {
                    nodeName: vm.q.nodeName,
                    processKey: window.localStorage.getItem("processKey")
                }
            });
        }
    }
});