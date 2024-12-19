$(function () {
	var brandId=parent.localStorage.getItem("brandId");
	var brandName=parent.localStorage.getItem("brandName");
	vm.q.carBrandId=brandId;
	vm.q.carBrandName=brandName;
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'car/tcarseries/list',
        where:{'carBrandId':brandId},
        cols: [[
            {field:'carBrandName', minWidth:100, title: '所属品牌',templet:function(data){
            	if(data.carBrandName == null || data.carBrandName == '' ){
            		return "-";
            	}
            	return data.carBrandName;
            }},
            {field:'groupName', minWidth:100, title: '车系组名',templet:function(data){
            	if(data.groupName == null || data.groupName == '' ){
            		return "-";
            	}
            	return data.groupName;
            }},
            {field:'seriesName', minWidth:100, title: '车系具体名称',templet:function(data){
            	if(data.seriesName == null || data.seriesName == '' ){
            		return "-";
            	}
            	return data.seriesName;
            }},
            {field:'timeUpdate', minWidth:100, title: '更新时间',templet:function(data){
            	if(data.timeUpdate == null || data.timeUpdate == '' ){
            		return "-";
            	}
            	return new Date(data.timeUpdate).format("yyyy-MM-dd hh:mm:ss");
            }},
            {title: '操作', width:120, templet:'#barTpl'}
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
    layui.use('form', function(){
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
        form.render();
    });
    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

    layui.form.on('input(brandId)',function (data) {
    	vm.tCarSeries.carBrandId = data.value;
    });
    
    //自定义验证
    layui.form.verify({
    	carBrandName: function(value){
          if(value =="" || value==null){
            return '所属品牌不能为空';
          }
        },
        groupName: function(value){
            if(value =="" || value==null){
              return '车系组名不能为空';
            }
        },
        seriesName: function(value){
            if(value =="" || value==null){
                return '车系具体名称不能为空';
              }
         }

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
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
        	seriesName: null,
            carBrandName: null,
            carBrandId:null
        },
        showForm: false,
        tCarSeries: {}
    },
    updated: function(){
    	vm.tCarSeries.carBrandId = vm.tCarSeries.carBrandId;
    	vm.tCarSeries.carBrandName = vm.tCarSeries.carBrandName;
    	vm.tCarSeries.groupName = vm.tCarSeries.groupName;
    	vm.tCarSeries.seriesName = vm.tCarSeries.seriesName;
        layui.form.render();
    },
    methods: {
    	
        alertTab:function(){
        	layer.open({
        		  type: 2,
        		  title:'车辆品牌选择',
        		  area: ['650px', '550px'],
        		  fixed: false, //不固定
        		  maxmin: true,
        		  content: tabBaseURL +'modules/car/carbrandSelectOne.html',
        		
        	});
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
            vm.tCarSeries = {};
            var index = layer.open({
                title: "新增车系",
                type: 1,
                content: $("#editForm"),
                area: ['550px', '500px'],
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
        },
        update: function (id) {
            $.get(baseURL + "car/tcarseries/info/"+id, function(r){
                vm.tCarSeries = r.tCarSeries;
                var index = layer.open({
                    title: "修改车系",
                    type: 1,
                    content: $("#editForm"),
                    area: ['550px', '500px'],
                    end: function(){
                        vm.showForm = false;
                        layer.closeAll();
                    }
                });
                vm.showForm = true;
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/tcarseries/delete",
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
            var url = vm.tCarSeries.id == null ? "car/tcarseries/save" : "car/tcarseries/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tCarSeries),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                    	layer.msg(r.msg, {icon: 5});
                    }
                }
            });
        },
        reset: function() {
        	vm.q.seriesName = null
		},
        exports: function () {
            var url = baseURL + 'car/tcarseries/export';
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
//                	id: vm.q.id,
                	seriesName: vm.q.seriesName,
                	carBrandId: vm.q.carBrandId
                }
            });
        }
    }
});