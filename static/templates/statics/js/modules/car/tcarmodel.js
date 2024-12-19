$(function () {
	gridTable = layui.table.render({
		id: "gridid",
		elem: '#grid',
		url: baseURL + 'car/tcarmodel/list',
		cols: [[
			{title: '操作', minWidth:180,width: 180, align:'center', templet: '#barTpl', fixed:"left",align:"center"},
			/*{field: 'id',  align:'center',minWidth:180,title: '车型编号', templet: function (d) {
					if (d.id != null && d.id !="") {
						return d.id;
					}else{
						return  "--";
					}
			}},*/
			{field: 'carBrandName',align:'center', minWidth: 180, title: '品牌', templet: function (d) {
					if (d.carBrandName != null && d.carBrandName !="") {
						return d.carBrandName;
					}else{
						return "--";
					}
			}},
			{field: 'carSeriesName',align:'center', minWidth: 180, title: '车系', templet: function (d) {
					if (d.carSeriesName != null && d.carSeriesName !="") {
						return d.carSeriesName;
					}else{
						return "--";
					}
				}},
			{field: 'modelName', align:'center',minWidth: 130, title: '车型', templet: function (d) {
					if (d.modelName != null && d.modelName !="") {
						return d.modelName;
					}else{
						return "--";
					}
			}},
			{field: 'styleModelName',align:'center', minWidth: 100, title: '款型'},
			{field: 'isAvailable', align:'center',minWidth:80, title: '状态',templet: function (d) {
					switch (d.isAvailable) {
						case 0:
							var type = "停用";
							return "<span style='color: red' >"+type+"</span>";
						case 1:
							var type1 = "已启用";
							return "<span style='color: green' >"+type1+"</span>";
					}
				}
			},
			{field: 'carDepreciate',align:'center', minWidth: 100, title: '折旧率（%）'},
			{field: 'timeCreate', align:'center', minWidth: 170, title: '创建时间', templet: '<div>{{new Date(d.timeCreate).format("yyyy-MM-dd hh:mm:ss")}}</div>'}

		]],
		page: true,
		loading: false,
		limits: [10, 20, 50, 100],
		limit: 10
	});

	//初始化数据
	layui.use(['form', 'layedit', 'laydate', 'element'], function () {
		    var form = layui.form;
		    layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		 //    getColorList();
		form.on('submit(saveOrUpdate)', function () {
			vm.saveOrUpdate();
			return false;
		});
		//自定义验证
		form.verify({
			styleModelIdVerify: function (value) {
				if (value == "" || value == null) {
					return '所属款型不能为空';
				}
			},
			modelTypeVerify: function (value) {
				if (value == "" || value == null) {
					return '所属类型不能为空';
				}
			},
			carBrandName: function (value) {
				if (value == "" || value == null) {
					return '所属品牌不能为空';
				}
			},
			carSeriesId: function (value) {
				if (value == "" || value == null) {
					return '所属车系不能为空';
				}
			},
			modelName: function (value) {
				if (value == "" || value == null) {
					return '车型名称不能为空';
				}else if(value.length>100){
					return '车型名称最长不能超过100个字符';
				}
				
			},
			isAvailable:function (value) {
				if (value == "" || value == null) {
					return '请选择车型状态';
				}
			}
/*			seating: function (value) {
				if (value == "" || value == null) {
					return '座位数不能为空';
				}

			},
			load: function (value) {
				if (value == "" || value == null) {
					return '载重不能为空';
				}
				var check=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;  //非负整数保留一位小数
				if(!check.test(value)){
					return "载重数据输入不合法";
				}
			},*/
			/*lengthVerify: function (value) {
				if(value != "" && value != null){
					var reg = /^-?\d+(\.\d{1,3})?$/;
					if (!reg.test(value)) {
						return "请输入正确的长度,且最多三位小数!";
					}
				}
			},
			wideVerify: function (value) {
				if(value != "" && value != null){
					var reg = /^-?\d+(\.\d{1,3})?$/;
					if (!reg.test(value)) {
						return "请输入正确的宽度,且最多三位小数!";
					}
				}
			},
			highVerify: function (value) {
				if(value != "" && value != null){
					var reg = /^-?\d+(\.\d{1,3})?$/;
					if (!reg.test(value)) {
						return "请输入正确的高度,且最多三位小数!";
					}
				}
			},*/
/*			maintenanceMileageVerify: function (value) {
				if(value != "" && value != null){
					var reg = /^[+]{0,1}(\d+)$/;
					if(!reg.test(value)){
						return "保养公里数请输入整数！";
					}
				}
			},
			maintenancePeriodVerify: function (value) {
					if (value == "" || value == null) {
						return '保养周期不能为空';
					}
					var checkData=/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,1})?$/;
					if(!checkData.test(value)){
						return "保养周期数据输入不合法";
					}
			},
			styleModelIdVerif: function (value) {
					if (value == "" || value == null) {
						return '款型不能为空';
					}
			},*/

		});
		form.render();
	});
	
	//监听查询条件品牌下拉列表监听
	layui.form.on('select(brandIdSelect)', function (data) {
		 var brandId= data.value;
		 vm.q.carBrandId = data.value;
		 //通过品牌id 查询对应的车系
		 $.ajax({
			type: "POST",
			async: false,
			url: baseURL + "car/tcarseries/listCarSeriesByBrandId/" + brandId,
			contentType: "application/json",
			success: function (r) {
				vm.allCarSeries = r.list;
				if(vm.allCarSeries.length==0){
					vm.allCarModels = [];
				}
			}
		});
		
	});
	//查询条件所属车系下拉列表监听
	layui.form.on('select(carSeriesIdSelect)', function (data) {
		 vm.q.carSeriesId = data.value;
		$.ajax({
			type: "POST",
			async: false,
			url: baseURL + "car/tcarmodel/listCarmodelByCarSeriesIdAll",
			contentType: "application/json",
			data: JSON.stringify(vm.q.carSeriesId),
			success: function (r) {
				vm.allCarModels = r.carModelList;
			}
		});
	});

	//查询条件所属车系下拉列表监听
	layui.form.on('select(carModelIdSelect)', function (data) {
		vm.q.carModelId = data.value;
	});
	
	//查询调价款型下拉列表监听
	layui.form.on('select(styleModelIdSelect)', function (data) {
		vm.q.styleModelId = data.value;
	});
	
	layui.form.on('checkbox(carColor)', function(data){
		if (data.elem.checked) {
			vm.colorList.push(data.value);
		} else {
			vm.colorList=vm.colorList.filter(function (v) {return v!=data.value});
		}
	});
	layui.form.on('submit(saveOrUpdate)', function () {

		vm.saveOrUpdate();
		return false;
	});

	//车系select
	layui.form.on('select(carSeriesId)', function (data) {
		if (vm.tCarModel.carBrandId == null || vm.tCarModel.carBrandId == '') {
			alert("请选择品牌信息");
		}
		vm.tCarModel = Object.assign({}, vm.tCarModel, {carSeriesId: data.value});
		layui.form.render();
	});
	
	layui.form.on('select(seatQuantity)', function (data) {
		vm.tCarModel = Object.assign({}, vm.tCarModel, {seating: data.value});
		layui.form.render();
	}),
	
	layui.form.on('select(styleModelId)', function (data) {
		vm.tCarModel = Object.assign({}, vm.tCarModel, {styleModelId: data.value});
		layui.form.render();
	}),


		layui.form.on('select(modelTypeFilter)', function (data) {
			vm.tCarModel = Object.assign({}, vm.tCarModel, {modelType: data.value});
			layui.form.render();
		}),

		layui.form.on('switch(isAvailable)', function(data){
			if(data.elem.checked){
				vm.tCarModel.isAvailable = 1;
			}else{
				vm.tCarModel.isAvailable = 0;
			}
		});

		//批量删除
		$(".delBatch").click(function () {
			var ids = vm.selectedRows();
			if (ids == null) {
				return;
			}
			vm.del(ids);
		});

	//操作
	layui.table.on('tool(grid)', function (obj) {
		var layEvent = obj.event,
			data = obj.data;
		if (layEvent === 'edit') {
			vm.update(data);
		} else if (layEvent === 'del') {
			var id = [data.id];
			vm.del(id);
		} else if (layEvent === 'detail') {
			vm.detail(data);
		} else if (layEvent === 'startCarModel') {
			var id = data.id;
			vm.startOrStopCarModel(id, 1);
		} else if (layEvent === 'stopCarModel') {
			var id = data.id;
			vm.startOrStopCarModel(id, 2);
		}

	});
    
	 //tab页切换 
	 layui.use('element', function(){
	   	  var element = layui.element;
	 		  //监听Tab切换
	 		  element.on('tab(enabled)', function(){
	 		    var type=this.getAttribute('lay-id');
	 		    reloadData(1,type);
	 		  });
	  });
	  function reloadData(dataType,type){
	   	if(type != null && type != ''){
		    	if(type == '-1'){//全部
		    		 vm.q = Object.assign({}, {isAvailable:""});
		    	}else if(type == '0' || type == '1'){
		    		 vm.q.isAvailable=type;
		    	}
		    	if(dataType==1){
		    		vm.reload();
		    	}
		    }
	  };

/*	layui.upload.render({
		elem: '#imgList',
		url: baseURL + "file/uploadFile",
		data: {'path':'car_images'},
		field:'files',
		accept:'images',
		done: function(res){
			if(res.code == '0'){
				vm.imgList.push(res.data[0]);
				layer.msg('上传成功', {icon: 1});
			}else{
				layer.msg('上传失败', {icon: 5});
			}
		},
		error:function(){
			layer.msg('上传失败', {icon: 5});
		}
	});*/

	/*var uploadInst = upload.render({
		elem: '#imgList',
		url: baseURL + "file/uploadFile",
		data: {'path':'car_images'},
		field:'files',
		accept:'images'
		,before: function(obj){
			//预读本地文件示例，不支持ie8
			/!*obj.preview(function(index, file, result){
				$('#demo1').attr('src', result); //图片链接（base64）
			});*!/
		}
		,done: function(res){
			if(res.code == '0'){
				vm.imgList.push(res.data[0]);
				layer.msg('上传成功', {icon: 1});
			}else{
				layer.msg('上传失败', {icon: 5});
			}
		}
		,error: function(){
			//演示失败状态，并实现重传
			var demoText = $('#demoText');
			demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
			demoText.find('.demo-reload').on('click', function(){
				uploadInst.upload();
			});
		}
	});*/

	layui.upload.render({
		elem: '#control_video_button', //绑定元素
		url: baseURL + "file/uploadFile",
		field:'files',
		accept: 'video',
		data: {'path':'videoUrl'}
		,before: function(obj){
			//预读本地文件示例，不支持ie8
			obj.preview(function(index, file, result){
				$('#control_video_demo').attr('src', result); //图片链接（base64）
				$('#control_video_demo').css('display','block');
				$('#control_video_del').css('display','inline');
			});
		},
		done: function(res){
			if(res.code == '0'){
				//vm.tCarModel.videoUrl = res.data[0];
				Vue.set(vm.tCarModel,'videoUrl',res.data[0]);
				layer.msg('上传成功', {icon: 1});
			}else{
				layer.msg('上传失败', {icon: 5});
			}

		},error: function(res){
			console.log(res);
			//演示失败状态，并实现重传
			var demoText = $('#demoText');
			demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
			demoText.find('.demo-reload').on('click', function(){
				uploadInst.upload();
			});
		}
	});

	$('#control_video_del').click(function(){
		Vue.set(vm.tCarModel,'videoUrl',null);
	})
});

var photoSize=null;
var formData = new FormData();
var vm = new Vue({
	el: '#rrapp',
	data: {
		q: {
			carBrandId: null,      //品牌
			carSeriesId: null,     //车系
			carModelId: null,      //车型
			load: null,            //载重
			styleModelId: null,    //款型
			isAvailable:null,      //是否启用
		},
		styleModelData: [],
		modelTypeData: [],
		editForm: false,
		addForm:false,
		setDepreciateForm: false,
		detailForm: false,
		allCarBrand: [],
		allCarSeries: [],
		allCarModels: [],
		tCarModel: {},
//		carHomeImgList: [],
//		photoSize: 0,
//		carHomeImgs: [],
		seatQuantities: [2, 3, 4, 5,7],
//		files: [], //上传的首页车型图片
		colorList: [],
		imgList:[],
		carcolorList:[],
		fileLstId: '0',
		introduce:'',
		//图片查看相关
		dialogVisible: false,
		activeFile: {},
		imgListlbt:[],
		dynamicTags: [],
		inputVisible: false,
		inputValue: '',
		dialogImageUrl:'',
		richText:[],
		imgListlbt1:[],
		carParamconf: [],
		carParamconfData: {},
		cfViewId:'cfViewId_0',
		tagTags: [],
		inputTagVisible: false,
		inputTagValue: ''
	},

	//查询品牌
	created: function () {
		var _this = this;
		$.ajaxSettings.async = false;
		$.getJSON(baseURL + "car/tcarbrand/listAll", function (r) {
			_this.allCarBrand = r.carBrands;
		});

		$.getJSON(baseURL + "sys/dict/getInfoByType/styleModel", function (r) {
			_this.styleModelData = r.dict;
		});
		$.getJSON(baseURL + "sys/dict/getInfoByType/modelType", function (r) {
			_this.modelTypeData = r.dict;
		});
		$.ajaxSettings.async = true;
	},
	updated: function () {
		layui.form.render();
	},
	methods: {
		handleTagClose(tag) {
			for (var i = vm.tagTags.length - 1; i >= 0; i--) {
				if (vm.tagTags[i] == tag) {
					vm.tagTags.splice(i, 1);
				}
			}
		},
		depreciateCancel: function(){
			layer.closeAll();
			vm.tCarModel.carDepreciate=null;
			//vm.reload();
		},
		saveDepreciate: function (event) {
			if(vm.tCarModel.carDepreciate==null){
				alert("请填写折旧率");
				return;
			}
			var url = "car/tcarmodel/saveDepreciate";
			$.ajax({
				type: "POST",
				url: baseURL + url,
				contentType: "application/json",
				data: JSON.stringify(vm.tCarModel),
				success: function (r) {
					if (r.code === 0) {
						alert('操作成功', function (index) {
							layer.closeAll();
							vm.reload();
							layui.form.render();
						});
					} else {
						alert(r.msg);
					}
				}
			});
		},
		setDepreciate: function () {
			$.ajaxSettings.async = false;
			$.ajaxSettings.async = true;
			var viewParent = $('#paramConfId>div');
			var index = layer.open({
				title: "一键设置折旧率",
				type: 1,
				area: ['40%', '60%'],
				content: $("#setDepreciateForm"),
				end: function () {
					vm.setDepreciateForm = false;
					layer.closeAll();
					vm.tCarModel.carDepreciate=null;
				}
			});
			vm.setDepreciateForm = true;
		},
		showTagInput() {
			this.inputTagVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagTagInput.$refs.input.focus();
			});
		},


		handleInputTagConfirm() {
			let inputTagValue = this.inputTagValue;
			if (inputTagValue) {
				this.tagTags.push(inputTagValue);
			}
			this.inputTagVisible = false;
			this.inputTagValue = '';
		},
		startOrStopCarModel: function (id, type) {
			if(type == 1){
				confirm('确认要启用该车型吗？', function(){
					var param = {"id": id, "type": type};
					$.ajax({
						type: "POST",
						url: baseURL + "car/tcarmodel/startorstop",
						contentType: "application/json",
						data: JSON.stringify(param),
						success: function (r) {
							if (r.code == 0) {
								if (type == 1) {
									alert("启用成功");
								} else {
									alert("停用成功");
								}
								vm.reload();
							} else {
								alert(r.msg);
							}
						}
					});
				});
			} else if(type == 2){
				confirm('确认要禁用该车型吗？', function(){
					var param = {"id": id, "type": type};
					$.ajax({
						type: "POST",
						url: baseURL + "car/tcarmodel/startorstop",
						contentType: "application/json",
						data: JSON.stringify(param),
						success: function (r) {
							if (r.code == 0) {
								if (type == 1) {
									alert("启用成功");
								} else {
									alert("停用成功");
								}
								vm.reload();
							} else {
								alert(r.msg);
							}
						}
					});
				});
			}

		},
		alertTab: function () {
			layer.open({
				type: 2,
				title: '车辆品牌选择',
				area: ['700px', '500px'],
				fixed: false, //不固定
				maxmin: true,
//                 closeBtn:0,   //是否显示右上角关闭图标，默认为1，显示
				content: tabBaseURL + 'modules/car/carmodelSelectBrand.html',
			});
		},
		selectedRows: function () {
			var list = layui.table.checkStatus('gridid').data;
			if (list.length == 0) {
				alert("请选择一条记录");
				return;
			}

			var ids = [];
			$.each(list, function (index, item) {
				ids.push(item.id);
			});
			return ids;
		},
		reset: function () {
			vm.q.carBrandId = null;
			vm.q.carSeriesId= null;
			vm.allCarSeries=[];
			vm.q.carModelId = null;
			vm.q.load = null;
			vm.q.styleModelId= null;
//			var element = layui.element;
//            element.tabChange('enabled', -1);
		},

		handleClose(tag) {
			vm.dynamicTags.splice(vm.dynamicTags.indexOf(tag), 1);
		},
		addColor(){
			/*vm.dynamicTags.push({
				name:'标签一',
				checked:'',
			})*/
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				vm.dynamicTags.push({
					name:inputValue,
					checked:'',
				});
			}
			this.inputVisible = false;
			this.inputValue = '';
		},

		handlePictureCardPreview(item) {
			vm.dialogImageUrl = item.url;
			this.dialogVisible = true
		},

		// 新增时图片删除
		handleAddRemove(file, fileList) {
			 
			if(vm.imgListlbt.length>0){
				for (var i = vm.imgListlbt.length - 1; i >= 0; i--) {
					if (vm.imgListlbt[i].id==file.uid) {
						vm.imgListlbt.splice(i, 1);
					}
				}
			}
		},

		// 车型列表图片删除
		carhandleAddRemove(file, fileList) {
			if(vm.imgList.length>0){
				for (var i = vm.imgList.length - 1; i >= 0; i--) {
					if (vm.imgList[i].id==file.uid) {
						vm.imgList.splice(i, 1);
					}
				}
			}
		},


		// 编辑时图片删除
		// 轮播图片删除
		handleRemove(file, fileList) {
			 
			if(vm.imgListlbt.length>0){
				for (var i = vm.imgListlbt.length - 1; i >= 0; i--) {
					if (vm.imgListlbt[i].uid==file.uid) {
						vm.imgListlbt.splice(i, 1);
					}
				}
			}
		},

		// 车型列表图片删除
		carhandleRemove(file, fileList) {
			if(vm.imgList.length>0){
				for (var i = vm.imgList.length - 1; i >= 0; i--) {
					if (vm.imgList[i].uid==file.uid) {
						vm.imgList.splice(i, 1);
					}
				}
			}
		},

		// 轮播上传
		handlechange(file, fileList){
			var fileName = file.raw.name;
			var uid = file.raw.uid;
			var formData = new FormData();
			formData.append("files", file.raw);
			formData.append("path", 'carImageLb');
			vm.activeFile = {};
			$.ajax({
				type: "POST",
				url: baseURL + '/file/uploadFile',
				contentType: false,
				processData: false,
				data: formData,
				success: function (r) {
					var activeFile = {
						url: imageURL+r.data[0],
						nameAccessory: fileName,
						imgUrl:r.data[0],
						id:uid
					};
					vm.imgListlbt.push(activeFile);
				},
				error: function () {
					layer.msg('上传失败', {icon: 5});
				}
			});
		},

		// 车型列表上传
		modelcarchange(file, fileList){
			console.log(file,fileList);
			var fileName = file.raw.name;
			var uid = file.raw.uid;
			var formData = new FormData();
			formData.append("files", file.raw);
			formData.append("path", 'carImage');
			vm.activeFile = {};
			$.ajax({
				type: "POST",
				url: baseURL + '/file/uploadFile',
				contentType: false,
				processData: false,
				data: formData,
				success: function (r) {
					var activeFile = {
						url: imageURL+r.data[0],
						nameAccessory: fileName,
						imgUrl:r.data[0],
						id:uid
					};
					vm.imgList.push(activeFile);
				},
				error: function () {
					layer.msg('上传失败', {icon: 5});
				}
			});
		},

		cancel: function(){
		   layer.closeAll();
			vm.reload();
	    },
		depreciateCancel: function(){
			layer.closeAll();
			vm.tCarModel.carDepreciate=null;
			//vm.reload();
		},
		query: function () {
			vm.reload();
		},

		add: function () {
			$.ajaxSettings.async = false;
			$.get(baseURL + "car/carparamconf/allLastList", function (r) {
				vm.carParamconf = r.data;
			});
			$.ajaxSettings.async = true;
			var viewParent = $('#paramConfId>div');
			if (viewParent != null){
				viewParent.empty();
				if (vm.carParamconf != null && vm.carParamconf.length > 0){
					for (let i = 0; i < vm.carParamconf.length; i++) {
						var cf = vm.carParamconf[i];
						var paramKey = 'param_'+cf.paramKey+'_'+cf.id;
						vm.carParamconfData[paramKey] = {
							name:cf.paramName,
							group:cf.parentName,
							value:cf.defaultValue
						};
						var viewItem=''
							+'	<div class="layui-inline layui-col-md4 layui-col-sm4 layui-col-xs4">                   '
							+'		<label class="layui-form-label layui-form-label-txt"><span style="color:red">*</span>'+cf.paramName+':</label>    '
							+'		<div class="layui-input-inline layui-input-inline-change">                                                   '
							+'			<input type="text" id="carParamconfData_'+paramKey+'" autocomplete="off" maxlength="200" '
							+'				   placeholder="'+cf.paramName+'" class="layui-input" value="'+cf.defaultValue+'">                               '
							+'		</div>                                                                             '
							+'	</div>                                                                                 '
							+''
							+'';
						viewParent.append(viewItem);
					}
				}
			}
			vm.cfViewId = 'cfViewId_'+uuid(32);
			vm.tCarModel = {isAvailable:1,introduce:"请输入数据"};
			vm.files = []; //上传的首页车型图片
			vm.imgList=[];
			vm.imgListlbt=[];
			vm.dynamicTags = [];
			// 新增初始化富文本编辑器内容
			getHtmlData('');

			var index = layer.open({
				title: "新增",
				type: 1,
				content: $("#addForm"),
				end: function () {
					vm.addForm = false;
					layer.closeAll();
					vm.reset();
				}
			});
			vm.addForm = true;
			layer.full(index);
		},
		setDepreciate: function () {
			$.ajaxSettings.async = false;
			$.ajaxSettings.async = true;
			var viewParent = $('#paramConfId>div');
			var index = layer.open({
				title: "一键设置折旧率",
				type: 1,
				area: ['30%', '50%'],
				content: $("#setDepreciateForm"),
				end: function () {
					vm.setDepreciateForm = false;
					layer.closeAll();
					vm.tCarModel.carDepreciate=null;
				}
			});
			vm.setDepreciateForm = true;
		},
		//查看详情
		detail: function (data) {
			var  id=data.id;
			$.get(baseURL + "car/tcarmodel/detail/" + id, function (r) {
				vm.tCarModel = r.tCarModel;
				var url=r.tSysAccessory;
				var plan="";
				var colorList=r.color;
				var imgListlbt = r.imgListlbt;
				var index = layer.open({
		            title: "详情",
		            type: 2,
					boxParams: data,
		            content: tabBaseURL +'modules/car/tcarmodelDetails.html',
		            success: function(layero, index) {
	                    // 获取子页面的iframe
	                    var iframe = window['layui-layer-iframe' + index];
	                    // 向子页面的全局函数child传参
	                    iframe.child(vm.tCarModel,url,plan,colorList,imgListlbt);
		    	    }
		        });
                layer.full(index);
			});
		},

		update: function (data) {
			var id = data.id;
			window.localStorage.setItem("id",id);
			var index = layer.open({
				title: "编辑车型",
				type: 2,
				boxParams: data,
				content: tabBaseURL + "modules/car/tcarmodeledit.html",
				end: function () {
					layer.close(index);
					window.localStorage.setItem("id",null);
					vm.reload();
				}
			});
			layer.full(index);
		},

		del: function (ids) {
			confirm('确定要将该车型删除吗，删除之后将无法恢复？删除之后不影响已创建的数据', function () {
				$.ajax({
					type: "POST",
					url: baseURL + "car/tcarmodel/delete",
					contentType: "application/json",
					data: JSON.stringify(ids),
					success: function (r) {
						if (r.code == 0) {
							alert('操作成功', function (index) {
								vm.reload();
							});
						} else {
							alert(r.msg);
						}
					}
				});
			});
		},

		isJSON: function(cal) {
			if(cal.search(/^[\+\-\*\/\.\)]|[\+\-\*\/\.\(]$|[\+\-\*\/\.]{2}|[^\+\-\*\/\(\)\d\.]|([\d\.\)]\()|(\)[\d\.])|(\([\+\-\*\/\.\)])|([\+\-\*\/\.]\))|(\.\d+\.)/) > -1){
				return false;
			}else{
				var num_left = 0;
				for(i = 0; i < cal.length; i++){
					if(cal[i] == '('){
						num_left++;
					}
					if(cal[i] == ')'){
						if(num_left > 0){
							num_left--;
						}else{
							return false;
						}
					}
				}
				if(num_left >0){
					return false;
				}else{
					return true;
				}
			}
		},

		saveOrUpdate: function (event) {
			/*if(vm.imgList == null || vm.imgList.length==0){
				alert("车型列表图片不能为空！");
				return;
			}

			if(vm.imgListlbt == null || vm.imgListlbt.length==0){
				alert("车型轮播图片不能为空！");
				return;
			}

			if(vm.tCarModel.videoUrl == null || vm.tCarModel.videoUrl == ''){
				alert("车型视频不能为空！");
				return;
			}*/

			// 清除已上传图片的缓存数据
			this.$refs.upload.clearFiles();
			this.$refs.upload1.clearFiles();
			for (let key in vm.carParamconfData) {
				var paramView = $('#carParamconfData_'+key);
				if (paramView.length > 0){
					vm.carParamconfData[key].value = paramView.val();
				}else {
					delete vm.carParamconfData[key];
				}
			}
			console.log(vm.carParamconfData);



			// 获取富文本数据
			//getHtml();

			console.log(editor.txt.html());
			vm.tCarModel.introduce = editor.txt.html();
			vm.tCarModel.basicServices = basicServicesEditor.txt.html();
			vm.tCarModel.incrementServices = incrementServicesEditor.txt.html();
			vm.tCarModel.companyIntroduction = companyIntroductionEditor.txt.html();
			// if(vm.tCarModel.introduce == ""){
			// 	alert("请输入车型介绍！");
			// 	return;
			// }


			var check = [];
			// 保存时处理复选框数据
			if(vm.dynamicTags.length>0){
				for(var i = 0 ;i<vm.dynamicTags.length;i++) {
					if(vm.dynamicTags[i].checked == true) {
						check.push(vm.dynamicTags[i].name);
					}
				}
			}
			if (check instanceof Array) {// 验证是否是数组
				vm.tCarModel.color = check.join(",");
			}


			if(null != vm.tagTags && vm.tagTags.length > 0){
				let strs = "";
				for (let i in vm.tagTags) {
					strs += vm.tagTags[i] + ',';
				}
				vm.tCarModel.tagNames = strs != '' ? strs.substr(0, strs.length - 1) : '';
			}else{
				vm.tCarModel.tagNames = "";
			}

			vm.tCarModel.imgList = vm.imgList;
			vm.tCarModel.imgListlbt = vm.imgListlbt;
			vm.tCarModel.carParamconfData = JSON.stringify(vm.carParamconfData);
			var url = vm.tCarModel.id == null ? "car/tcarmodel/save" : "car/tcarmodel/update";
			$.ajax({
				type: "POST",
				url: baseURL + url,
				contentType: "application/json",
				data: JSON.stringify(vm.tCarModel),
				success: function (r) {
					if (r.code === 0) {
						alert('操作成功', function (index) {
							layer.closeAll();
							vm.reload();
							layui.form.render();
						});
					} else {
						alert(r.msg);
					}
				}
			});
		},
		saveDepreciate: function (event) {
			if(vm.tCarModel.carDepreciate==null){
				alert("请填写折旧率");
				return;
			}
			var url = "car/tcarmodel/saveDepreciate";
			$.ajax({
				type: "POST",
				url: baseURL + url,
				contentType: "application/json",
				data: JSON.stringify(vm.tCarModel),
				success: function (r) {
					if (r.code === 0) {
						alert('操作成功', function (index) {
							layer.closeAll();
							vm.reload();
							layui.form.render();
						});
					} else {
						alert(r.msg);
					}
				}
			});
		},
		exports: function () {
			var url = urlParamByObj(baseURL + 'car/tcarmodel/export', vm.q);
			window.location.href = url;
		},
        excelUpdate:function () {
			var url =baseURL+'car/tcarmodel/excelUpdate';
            window.location.href = url;
        },

		reload: function (event) {
		//	vm.clearImgFiled();
			layui.table.reload('gridid', {
				page: {
					curr: 1
				},
				where: {
					carBrandId: vm.q.carBrandId,        //品牌
					carSeriesId: vm.q.carSeriesId,      //车系
					carModelId: vm.q.carModelId,          //车型名称
					load: vm.q.load,                    //载重
					styleModelId: vm.q.styleModelId,    //款型
					isAvailable:vm.q.isAvailable        //是否启用
					
				}
			});
		},

        // 打开图片窗口
        openImgBox:function(e) {
            layer.photos({
                photos: {"data": [{"src": e.target.src}]},
				closeBtn:1
            })
        },
		// 删除集合中的图片
		deleteImg:function(index){
			vm.deleteImgData(this.imgList[index],3);
			this.imgList.splice(index,1)
		},
		deleteImgData:function (imgList,type) {
			$.ajax({
				type: "POST",
				url: baseURL + "car/tcarmodel/deleteFileByPath",
				dataType:"JSON",
				data: {"imgPath":imgList,"optNo":vm.tCarModel.id,"type":type},
				success: function(r){
					if(r.code == 0){
						alert("删除成功");
					}else{
						alert(r.msg);
					}
				}
			});
		},
		//新增图片上传
	    uploadLicense:function(event){
	    	photoSize=event.target.files.length;
            for (var i=0;i<event.target.files.length;i++){
                var type = event.target.files[i].type;
                var size = event.target.files[i].size; //获取上传图片的实际大小
//              var fileMaxSize = 1024*3;//3M    //定图片大小
                type=type.substring(type.length-3);
                var types="bmp,jpg,png,tif,gif,pcx,peg,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp";
                if(type==""||types.indexOf(type)<0){
                    alert("请上传图片类型的文件");
                    return;
                }
//              if(size>fileMaxSize){
//                	 alert("请上传图片大小不能超过3M");
//                     return;
//              }
                this.imgList.push(this.getObjectURL(event.target.files[i]));
                formData.append('files', event.target.files[i])
            }
            //上传
            vm.businessYEZZ();
        },
    	//建立一個可存取到該file的url
		getObjectURL:function(file) {
			var url = null;
			// 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
			if (window.createObjectURL != undefined) { // basic
				url = window.createObjectURL(file);
			} else if (window.URL != undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL != undefined) { // webkit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			return url;
		},
        //点击上传时触发事件
        businessYEZZ:function () {
            vm.tCarModel.carModelImgs=vm.imgList;   
             if(photoSize==null || photoSize==0){
                alert("请添加文件");
                return;
            }else{
                 formData.append('path','carmodel_pic');
                //调用后台接口方法
                $.ajax({
                    type: "POST",
                    url: baseURL + "file/upload",
                    dataType:"JSON",
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function(r){
                        if(r.code == 0){
                            formData = new FormData();
                            alert("上传成功");
                            if(r.data.length > 0){
                                var m=[];
                                vm.tCarModel.imgList=r.data;
                                for (var i = 0; i < vm.tCarModel.imgList.length; i++) {
                                    var c=imageURL+vm.tCarModel.imgList[i];
                                        m.push(c);
                                }
                                vm.imgList=m;
                            }
                        }else{
                            alert(r.msg);
                        }
                    }
                });

            }
        }
	}
});

const E1 = window.wangEditor;
const editor = new E1('#EditorAdd')
// 或者 const editor = new E( document.getElementById('div1') )
// 设置编辑区域高度为 500px
editor.config.height = 500;
editor.config.zIndex = 1;
editor.config.placeholder = '请输入内容';
editor.config.pasteFilterStyle = true;

// 配置菜单栏，设置不需要的菜单
editor.config.excludeMenus = [
	'emoticon',
	'video',
	'link',
	'splitLine',
	'backColor',
]

// 图片上传
editor.config.customUploadImg = function (resultFiles, insertImgFn) {
	// resultFiles 是 input 中选中的文件列表
	// insertImgFn 是获取图片 url 后，插入到编辑器的方法
	console.log(resultFiles);
	// 上传图片，返回结果，将图片插入到编辑器中
	//insertImgFn('https://cn.vuejs.org/images/logo.png')
	const formData = new FormData();
	formData.append("files", resultFiles[0]);
	formData.append("path", 'carIntroduce');
	//图片名称
	const fileName = resultFiles.name;
	$.ajax({
		type: "POST",
		url: baseURL + '/file/uploadFile',
		contentType: false,
		processData: false,
		data: formData,
		success: function (r) {
			const activeFile = {
				url: r.data[0],
				name: fileName,
				uid: uuid(6)
			};
			vm.richText.push(activeFile);
			insertImgFn(imageURL+r.data[0])
		},
		error: function () {
			layer.msg('上传失败', {icon: 5});
		}
	});
}

function getHtml() {
	//vm.introduce = editor.txt.html();
	vm.introduce = editor.txt.html();
	console.log(editor.txt.html());
}

function getHtmlData(value){
	//editor.txt.html('<p>' + value + '</p>');
	editor.txt.html('<p>' + value + '</p>');
}

//editor.create();
editor.create();



const basicServicesE = window.wangEditor;
const basicServicesEditor = new basicServicesE('#basicServices');


const incrementServicesE = window.wangEditor;
const incrementServicesEditor = new incrementServicesE('#incrementServices');


const companyIntroductionE = window.wangEditor;
const companyIntroductionEditor = new companyIntroductionE('#companyIntroduction');


createEditor(basicServicesEditor);
createEditor(incrementServicesEditor);
createEditor(companyIntroductionEditor);



function createEditor(editor){
	// 或者 const editor = new E( document.getElementById('div1') )
	// 设置编辑区域高度为 500px
	editor.config.height = 500;
	editor.config.zIndex = 1;
	editor.config.placeholder = '请输入内容';
	editor.config.pasteFilterStyle = true;

// 配置菜单栏，设置不需要的菜单
	editor.config.excludeMenus = [
		'emoticon',
		'video',
		'link',
		'splitLine',
		'backColor',
	]

// 图片上传
	editor.config.customUploadImg = function (resultFiles, insertImgFn) {
		// resultFiles 是 input 中选中的文件列表
		// insertImgFn 是获取图片 url 后，插入到编辑器的方法
		console.log(resultFiles);
		// 上传图片，返回结果，将图片插入到编辑器中
		//insertImgFn('https://cn.vuejs.org/images/logo.png')
		const formData = new FormData();
		formData.append("files", resultFiles[0]);
		formData.append("path", 'carIntroduce');
		//图片名称
		const fileName = resultFiles.name;
		$.ajax({
			type: "POST",
			url: baseURL + '/file/uploadFile',
			contentType: false,
			processData: false,
			data: formData,
			success: function (r) {
				const activeFile = {
					url: r.data[0],
					name: fileName,
					uid: uuid(6)
				};
				vm.richText.push(activeFile);
				insertImgFn(imageURL+r.data[0])
			},
			error: function () {
				layer.msg('上传失败', {icon: 5});
			}
		});
	}
	editor.create();
}






