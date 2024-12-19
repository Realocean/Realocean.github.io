$(function () {
        gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/config/list',
        cols: [[
            {type:'checkbox',align:"center"},
            {field:'id', width:100, title: 'ID',align:"center"},
            {field:'paramKey', minWidth:100, title: '参数名',align:"center"},
            {field:'paramValue', minWidth:100, title: '参数值',align:"center"},
            {field:'remark', minWidth:100, title: '备注',align:"center"},
            {title: '操作', width:120, templet:'#barTpl',fixed:"right",align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
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
            var ids = [data.id];
            vm.del(ids);
        }
    });

});

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
            paramKey: null
		},
        showForm: false,
		config: {}
	},
    updated: function(){
        layui.form.render();
    },
	methods: {
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
			vm.config = {};

            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
		},
		update: function (id) {
			$.get(baseURL + "sys/config/info/"+id, function(r){
                vm.config = r.config;
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
		},
		del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/config/delete",
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
			var url = vm.config.id == null ? "sys/config/save" : "sys/config/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.config),
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
        sync: function () {
            confirm('确定同步系统资产数据吗？', function(){
                showloading(true);
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/config/sync",
                    contentType: "application/json",
                    success: function(r){
                        showloading(false);
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
		reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    paramKey: vm.q.paramKey
                }
            });
		}
	}
});