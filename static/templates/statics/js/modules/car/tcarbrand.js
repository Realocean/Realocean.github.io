$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'car/tcarbrand/list',
        cols: [[
            {title: '操作', width:120, align:'center',templet:'#barTpl'},
            {field:'brandName', width:150, align:'center',title: '品牌名称',event:'selectBrandName',templet:function(d){
            	if(d.brandName!=null && d.brandName != ''){
            		return d.brandName;
            	}else{
            		return "--";
            	}
            }},
            {field:'disabled', width:150, title: '启停用',align:'center',templet:function(d){
            	//是否启用 0未启用，1启用
            	if(d.disabled == 0 ){
            		return "停用";
            	}else if(d.disabled ==1){
            		return "启用";
            	}else{
            		return "--";
            	}
            }}
        ]],
        page: true,
        loading: false,
        limits: [10,20, 50, 100],
        limit: 10,
        done: function(res){
            //初始化加载车系，默认加载第一条数据的
            var  arr1=res.data;
            var data=arr1[0];
            vm.selectBrandName(data);
        },
    });
    
    gridTable = layui.table.render({
        id: "gridid2",
        elem: '#grid2',
        cols: [[
            {title: '操作',width:120,  align:'center',templet:'#barTpl2'},
            {field:'seriesName', width:150, title: '车系名称',align:'center',templet:function(data){
            	if(data.seriesName == null || data.seriesName == '' ){
            		return "-";
            	}
            	return data.seriesName;
                
            }},
            {field:'disabled', width:150, title: '启停用',align:'center',templet:function(d){
            	//是否启用 0未启用，1启用
            	if(d.disabled == 0 ){
            		return "停用";
            	}else if(d.disabled ==1){
            		return "启用";
            	}else{
            		return "--";
            	}
            }}
        ]],
        done: function(res, curr, count){
           data=vm.tCarSeries;
        },
        page: true,
        loading: false,
        limits: [10,20, 50, 100],
        limit: 10
    });
    
    layui.use('element', function(){
    	  var element = layui.element;
  		  //监听Tab切换
  		  element.on('tab(vehicleBrand)', function(){
  		    var type=this.getAttribute('lay-id');
  		    reloadData(type,type);
  		  });
    });
    function reloadData(dataType,type){
    	if(type != null && type != ''){
	    	if(type == '-1'){//全部
	    		 vm.q = Object.assign({}, {disabled:""});
	    		 //车系相关信息
	    		 $("#addBrand").hide();
	             $("#brandNameData").html(""); 
	             layui.table.reload('gridid2',{
                     data : ''
                 });
	             
	    	}else if(type == '0' || type == '1'){
	    		 vm.q.disabled=type;
	    		 //车系相关信息
	    		 $("#addBrand").hide();
	             $("#brandNameData").html("");
	             layui.table.reload('gridid2',{
                     data : ''
                 });
	    	}
	    	if(dataType!=3){
	    		vm.reload();
	    	}
	    }
    }
    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
    
    layui.form.on('submit(saveOrUpdateTCarSeries)', function(){
    	vm.saveOrUpdateTCarSeries();
    	return false;
    });

    
    layui.use('form', function(){
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
        $("#addBrand").hide();
        form.render();
    });
    
    layui.form.verify({
    	brandName:function(value){
            if(value==null || value==""){
	              return '品牌名称不能为空';
	          }
       }
    });

    layui.form.verify({
        seriesNameVerify:function(value){
            if(value==null || value==""){
                return '车系名称不能为空';
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
            vm.update(data.id);   //编辑
        } else if(layEvent === 'disable'){
            vm.disable(data.id,data.carBrandName);  //停用
        }else if(layEvent === 'startUsing'){
    	    vm.startUsing(data.id);  //启用
        }
    });

    layui.table.on('row(grid)',function(obj){
        var data = obj.data;
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
        vm.selectBrandName(data);
    });

    layui.table.on('tool(grid2)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'tcarseriesEdit'){
            vm.tcarseriesUpdate(data.id);
        }else if(layEvent === 'tcarseriesDisable'){
        	vm.tcarseriesDisable(data);
        }else if(layEvent === 'tcarseriesStartUsing'){
        	vm.tcarseriesStartUsing(data);
        }
    });

    layui.use('upload', function(){
  	  var upload = layui.upload;
  	  upload.render({
            elem: '#addFile',
            url: baseURL + 'file/uploadFile',
            data: {'path':'car_images'},
            field:'files',
            auto:true,
            size: 50*1024*1024,
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg',
            exts: 'jpg|png|jpeg',
            multiple: true,
             number:20,
            choose: function(obj){
                obj.preview(function(index, file, result){
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var fileNameNotext = fileName.slice(0, extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1:0;
                    fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                    var fileTmp={
                        id: fileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc:'品牌图片',
                        nameAccessory:fileNameNotext,
                        nameFile:fileName,
                        nameExt:ext,
                        typeFile:fileType,
                    };
                    vm.fileLst.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.fileLst.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });


});
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            brandName: null,
            disabled:null,  //是否启用
        },
        editForm: false,
        carSeriesEditForm:false,
        tCarBrand: {},
        tCarSeries:{},
        fileLst:[],
        fileLstId: '0'
    },
	computed : {

	},
    updated: function(){
        layui.form.render();
    },
    methods: {
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        showDoc: function (fileName, url) {
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
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
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
        reset: function(){

            vm.q.brandName=null;
            $("#addBrand").hide();
            $("#brandNameData").html("");

           /* layui.table.reload('gridid2',{
                data : ''
            });
            var element = layui.element;
            element.tabChange('vehicleBrand', -1);
            layui.form.render();*/
        },
        addBrand: function(){
            vm.tCarBrand = {};
            vm.fileLst = [];
            var index = layer.open({
                title: "新增品牌",
                type: 1,
                resize:false,  //不允许拉伸
                content: $("#editForm"),
                end: function(){
                    vm.editForm = false;
                    layer.closeAll();
                }
            });
            vm.editForm = true;
            layer.full(index);
        },
        addCarSeries: function(){
        	vm.tCarSeries = {};
        	var brandNameData=$("#brandNameData").text().substring(5); //获取品牌名称
        	var index = layer.open({
        		title: "添加车系--"+"<span style='color:blue;'>"+brandNameData+"</span>",
        		type: 1,
        		resize:false,  //不允许拉伸
        		content: $("#carSeriesEditForm"),
        		area:['540px','240px'],
        		end: function(){
        			vm.carSeriesEditForm = false;
        			layer.closeAll();
        		}
        	});
        	vm.carSeriesEditForm = true;
        },
//        carSeriesManage: function(id,brandName){
//        	localStorage.setItem("brandId",id);
//        	localStorage.setItem("brandName",brandName);
//            var index = layer.open({
//                title: "车系列表",
//                type: 2,
//                content: tabBaseURL+"modules/car/tcarseries.html",
//                end: function(){
//                    layer.closeAll();
//                }
//            });
//            layer.full(index);
//        },
        disable:function(id,carBrandName){   //停用
        	 vm.tCarBrand.disabled=0; //是否启用 0未启用，1启用
        	 vm.tCarBrand.id=id;
             vm.tCarBrand.carBrandName = carBrandName;
        	  confirm('确定要停用？', function(){
        			$.ajax({
                        type: "POST",
                        url: baseURL + "car/tcarbrand/update",
                        contentType: "application/json",
                        data: JSON.stringify(vm.tCarBrand),
                        success: function(r){
                            if(r.code == 0){
                                alert('操作成功', function(index){
                                	layer.closeAll();
                                    vm.reload();
                                });
                            }else{
                                alert(r.msg);
                            }
                        }
                    });
              });
        	
        
        },
        startUsing:function(id){   //启用
        	vm.tCarBrand.disabled=1; //是否启用 0未启用，1启用
        	vm.tCarBrand.id=id;
            confirm('确定要启用？', function(){
            	$.ajax({
                    type: "POST",
                    url: baseURL + "car/tcarbrand/update",
                    contentType: "application/json",
                    data: JSON.stringify(vm.tCarBrand),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                            	layer.closeAll();
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        selectBrandName:function(data){
           if(data!=undefined){
               var brandName=data.brandName;
               var carBrandId=data.id;
               var disabled=null;
               $.ajax({
                type: "POST",
                url: baseURL + 'car/tcarbrand/info/' + carBrandId,
                contentType: "application/json",
                data: {},
                async: false,
                success: function (r) {
                    disabled = r.tCarBrand.disabled;
                }
            });
        	$("#brandNameData").html("<font>车辆品牌-"+brandName+"</font>");
        	$("#brandIdData").val(carBrandId); 
        	if(disabled==1){
                $("#addBrand").show();
            }else if(disabled==0){
                $("#addBrand").hide();
            }
        	$.ajax({
              type: "POST",
              url: baseURL + 'car/tcarseries/listCarSeriesByBrandId/'+carBrandId,
              contentType: "application/json",
              data: {},
              async: false,
              success: function(r){
                 var tCarSeries=r.list;
                 //重新加載表格
                 layui.table.reload('gridid2',{
                     data : tCarSeries
                 });
              }
             });
            }else{
               var carBrandId=null;
               $("#brandNameData").html("");
               $("#addBrand").hide();
               $.ajax({
                   type: "POST",
                   url: baseURL + 'car/tcarseries/listCarSeriesByBrandId/'+carBrandId,
                   contentType: "application/json",
                   data: {},
                   async: false,
                   success: function(r){
                       var tCarSeries=r.list;
                       //重新加載表格
                       layui.table.reload('gridid2',{
                           data : tCarSeries
                       });
                   }
               });

           }
        },
        update: function (id) {
            $.get(baseURL + "car/tcarbrand/info/"+id, function(r){
                vm.tCarBrand = r.tCarBrand;
                vm.fileLst = r.tCarBrand.fileLst;
                var index = layer.open({
                    title: "修改品牌",
                    type: 1,
                    resize:false,  //不允许拉伸
                    content: $("#editForm"),
                    end: function(){
                        vm.editForm = false;
                        layer.closeAll();
                    }
                });
                vm.editForm = true;
                layer.full(index);
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/tcarbrand/delete",
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
        //保存品牌
        saveOrUpdate: function (event) {
            vm.tCarBrand.fileLst = vm.fileLst;
             var url = vm.tCarBrand.id == null ? "car/tcarbrand/save" : "car/tcarbrand/update";
             $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.tCarBrand),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                layer.closeAll();
                                vm.reload();
                            });
                        }else{
                        	layer.msg(r.msg);
                        }
                    }
                });
        },
        //保存车系
        saveOrUpdateTCarSeries: function (event) {
          var carBrandId=$("#brandIdData").val();
       	  vm.tCarSeries.carBrandId=$("#brandIdData").val();
       	  var url = vm.tCarSeries.id == null ? "car/tcarseries/save" : "car/tcarseries/update";
          $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tCarSeries),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                    		$.ajax({
              	              type: "POST",
              	              url: baseURL + 'car/tcarseries/listCarSeriesByBrandId/'+carBrandId,
              	              contentType: "application/json",
              	              data: {},
              	              success: function(r){
              	                 var tCarSeries=r.list;
              	                 //重新加載表格
              	                 layui.table.reload('gridid2',{
              	                     data : tCarSeries
              	                 });
              	              }
              	          });
                        	layer.closeAll();
                        });
                    }else{
                    	alert(r.msg);
                    }
                }
            });
        },
        //车系编辑
        tcarseriesUpdate: function (id) {
        	 $.get(baseURL + "car/tcarseries/info/"+id, function(r){
                 vm.tCarSeries = r.tCarSeries;
                 var index = layer.open({
                     title: "修改车系",
                     type: 1,
                     content: $("#carSeriesEditForm"),
                     area:['430px','250px'],
                     end: function(){
                         vm.carSeriesEditForm = false;
                         layer.closeAll();
                     }
                 });
                 vm.carSeriesEditForm = true;
             });
        },
        tcarseriesDisable:function(data){
        	  var carBrandId=data.carBrandId;
        	  vm.tCarSeries.disabled=0; //是否启用 0未启用，1启用
        	  vm.tCarSeries.id=data.id;
        	  confirm('确定要停用？', function(){
        			$.ajax({
                        type: "POST",
                        url: baseURL + "car/tcarseries/update",
                        contentType: "application/json",
                        data: JSON.stringify(vm.tCarSeries),
                        success: function(r){
                            if(r.code == 0){
                                alert('操作成功', function(index){
                                	$.ajax({
                        	              type: "POST",
                        	              url: baseURL + 'car/tcarseries/listCarSeriesByBrandId/'+carBrandId,
                        	              contentType: "application/json",
                        	              data: {},
                        	              success: function(r){
                        	                 var tCarSeries=r.list;
                        	                 //重新加載表格
                        	                 layui.table.reload('gridid2',{
                        	                     data : tCarSeries
                        	                 });
                        	              }
                        	        });
                                	layer.closeAll();
                                });
                            }else{
                                alert(r.msg);
                            }
                        }
                    });
              });
        },
        tcarseriesStartUsing:function(data){
        	 var carBrandId=data.carBrandId;
       	     vm.tCarSeries.disabled=1; //是否启用 0未启用，1启用
       	     vm.tCarSeries.id=data.id;
       	     confirm('确定要启用？', function(){
  			  $.ajax({
                    type: "POST",
                    url: baseURL + "car/tcarseries/update",
                    contentType: "application/json",
                    data: JSON.stringify(vm.tCarSeries),
                    success: function(r){
                      if(r.code == 0){
                          alert('操作成功', function(index){
                          	$.ajax({
                  	              type: "POST",
                  	              url: baseURL + 'car/tcarseries/listCarSeriesByBrandId/'+carBrandId,
                  	              contentType: "application/json",
                  	              data: {},
                  	              success: function(r){
                  	                 var tCarSeries=r.list;
                  	                 //重新加載表格
                  	                 layui.table.reload('gridid2',{
                  	                     data : tCarSeries
                  	                 });
                  	              }
                  	        });
                          	layer.closeAll();
                          });
                      }else{
                          alert(r.msg);
                      }
                  }
              });
           });
        },
        exports: function () {
            var url = baseURL + 'car/tcarbrand/export';
            if(vm.q.keyword != null){
                url += '?keyword='+vm.q.keyword;
            }
            window.location.href = url;
        },
        cancel: function(){
        	//点击取消时关闭当前页面 
//          var index = parent.layer.getFrameIndex(window.name);  
//        	parent.layer.close(index);//关闭当前页  
        	layer.closeAll();
        },
        cancelTCarSeries: function(){
      	   layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    id: vm.q.id,
                    brandName: vm.q.brandName,
                    disabled:vm.q.disabled	
                }
            });
        }
    }
});