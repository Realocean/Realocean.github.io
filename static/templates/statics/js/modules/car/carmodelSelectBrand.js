$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        where:{disabled:1},
        url: baseURL + 'car/tcarbrand/list',
        cols: [[
            {field:'id', width:300, title: '主键id'},
            {field:'brandName', width:476, title: '品牌名'},
            /*{field:'logo', minWidth:100, title: '品牌图标'},*/
            /*{field:'timeCreate', minWidth:100, title: '创建时间',templet:'<div>{{new Date(d.timeCreate).format("yyyy-MM-dd hh:mm:ss")}}</div>'},
            {field:'timeUpdate', minWidth:100, title: '更新时间',templet:'<div>{{new Date(d.timeUpdate).format("yyyy-MM-dd hh:mm:ss")}}</div>'},*/
            {title: '操作', width:200, templet:'#barTpl'}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        done:function(res,curr,count){
            //隐藏列--不显示ID
            $(".layui-table-box").find("[data-field='id']").css("display","none");   
           
        }
    });

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
    
    
    //批量删除
    $(".delBatch").click(function(){
        var carBrandIds = vm.selectedRows();
        if(carBrandIds == null){
            return;
        }
        vm.del(carBrandIds);
    });

    //操作
    layui.table.on('tool(grid)', function(obj){

        var layEvent = obj.event,
        //获取当前行    
        data = obj.data;
        if(layEvent === 'select'){
        	//获取选中行字段
        	var carBrandId = data.id;
        	var carBrandName=data.brandName;
        	var tCarModel = parent.vm.tCarModel;
//        	var sId = parent.vm.tCarSeries.id;
//        	var groupName = parent.vm.tCarSeries.groupName;
//        	var seriesName = parent.vm.tCarSeries.seriesName;
        	//给前台文本框赋值
        	parent.vm.tCarModel = Object.assign({}, tCarModel, {carBrandId: carBrandId}, {carBrandName: carBrandName});
        	/*$.ajax({
                type: "POST",
                url: baseURL+"car/tcarseries/listCarSeriesByBrandId"",
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
            });*/

        	/*$.getJSON(baseURL+"car/tcarseries/listCarSeriesByBrandIdPro/"+carBrandId,function(data) {
        		parent.vm.allCarSeries = data.list;
        	});*/

            $.ajax({
                type: "POST",
                async: false,
                url: baseURL + "car/tcarseries/listCarSeriesByBrandIdPro/" + carBrandId,
                contentType: "application/json",
                success: function (r) {
                    parent.vm.allCarSeries = r.list;
                }
            });


        	//先得到当前iframe层的索引
        	var index = parent.layer.getFrameIndex(window.name); 
        	//关闭当前窗口 
        	parent.layer.close(index); 
        	
        } 
    });

});


var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
        	keyword: null,
            id: null,
            brandName: null
        },
        showForm: false,
        carBrand: {}
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
            var carBrandIds = [];
            $.each(list, function(index, item) {
            	carBrandIds.push(item.carBrandId);
            });
            return carBrandIds;
        },
        query: function () {
            vm.reload();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                	id: vm.q.id,
                    brandName: vm.q.brandName
                }
            });
        }
    }
});