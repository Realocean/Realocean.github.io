$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'mark/processinfo/list',
        cols: [[
            {title: '操作', width:150, minWidth:150, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'processStatus',align:"center", minWidth:100, title: '状态', templet: '#statusTpl'},
            {field:'processName',align:"center", minWidth:100, title: '流程名称'},
            {field:'processDes',align:"center", minWidth:200, title: '流程描述'},
            {field:'createTime',align:"center", minWidth:150, title: '创建时间'},
            {field:'createUserName',align:"center", minWidth:150, title: '创建用户'}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
    });

    layui.form.on('switch(status)', function(data){
        var index = layer.msg('修改中，请稍候',{icon: 16,time:false});
        var processStatus = 0;
        if(data.elem.checked){
            processStatus = 1;
        }
        vm.updateStatus(data.value, processStatus);
        layer.close(index);
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
        } else if(layEvent === 'editNode'){
            vm.editNode(data.processKey, data.processType);
        } else if(layEvent === 'detail'){
            vm.detail(data.id,data.processKey);
        }else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        }
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            processName: null,
            processKey:null
        },
        showForm: false,
        nodeForm: false,
        detailForm: false,
        processInfo: {},
        processNodeData:[]
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        updateStatus: function (id, processStatus) {
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processinfo/status",
                data: {id: id, processStatus: processStatus},
                success: function(r){
                    if(r.code == 0){
                        layer.alert('操作成功', function(index){
                            layer.close(index);
                            vm.reload();
                        });
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
        editNode: function(processKey, processType){
            var index = layer.open({
                title: "设置流程环节",
                type: 2,
                content: tabBaseURL + "modules/activiti/processnodeadd.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.processKey = processKey;
                    iframe.vm.processType = processType;
                    iframe.vm.initData(processKey);
                    iframe.vm.initFieldData(processKey);
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        detail: function(id,processKey){
            var index = layer.open({
                title: "流程详情",
                type: 2,
                content: tabBaseURL + "modules/activiti/processnodeadd.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.processKey = processKey;
                    iframe.vm.isDetail = true;
                    iframe.vm.initData(processKey);
                    iframe.vm.initFieldData(processKey);
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
            // $.get(baseURL + "mark/processinfo/info/"+id, function(r){
            //     vm.processInfo = r.processInfo;
            // });
            //
            // $.get(baseURL + "mark/processinfo/processNodeInfo/"+processKey, function(r){
            //     vm.processNodeData = r.processNodeData;
            //     var step = steps({
            //         el: "#step",
            //         data: vm.processNodeData,
            //         direction: "vertical",
            //         iconType: "bullets"
            //     });
            // });
            //
            // var index = layer.open({
            //     title: "流程详情",
            //     type: 1,
            //     area: ['700px', '600px'],
            //     content: $("#detailForm"),
            //     end: function(){
            //         vm.detailForm = false;
            //         layer.closeAll();
            //     }
            // });
            //
            // vm.detailForm = true;
        },
        rest: function(){
            vm.q.processName = null;
            vm.q.processKey = null;
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
        update: function (id) {
            $.get(baseURL + "mark/processinfo/info/"+id, function(r){
                vm.processInfo = r.processInfo;
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
                    url: baseURL + "mark/processinfo/delete",
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
        nodeSave: function(){
            //将流程环节信息缓存至流程定义页面，流程定义进行保存后台更改流程环节信息
        },
        nodeCancel: function(){
            layer.close(layer.index);
        },
        saveOrUpdate: function (event) {
            var url = vm.processInfo.id == null ? "mark/processinfo/save" : "mark/processinfo/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.processInfo),
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
            var url = baseURL + 'mark/processinfo/export';
            if(vm.q.keyword != null){
                url += '?keyword='+vm.q.keyword;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    processName: vm.q.processName,
                    processKey:vm.q.processKey
                }
            });
        }
    }
});