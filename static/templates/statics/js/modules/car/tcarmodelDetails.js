
layui.use(['form', 'layedit', 'laydate'], function () {
	        var form = layui.form;
		    layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		    form.render();
});

var vm = new Vue({
	el: '#rrapp',
	data: {
        q: {
        	carModelId: null,    
		},
		carParamconfData:{},
		tCarModel: {},
		tProPlan:{},
		imgList:[],
		imgListlbt:[],
		carColorList:[],
		dynamicTags: [],
		inputVisible: false,
		fileLstId: '0',
		dialogVisible: false,
		dialogImageUrl:'',
		tagTags:[]
		
	},
	created: function () {
		var _this = this;
		$.ajaxSettings.async = false;
		var param = parent.layer.boxParams.boxParams;
		if (param.carParamconfData != null && param.carParamconfData != ''){
			var conf = JSON.parse(param.carParamconfData);
			for (let key in conf) {
				_this.carParamconfData[key] = conf[key];
			}
		}
		var viewParent = $('#paramConfId>div');
		if (viewParent != null){
			viewParent.empty();
			if (_this.carParamconfData != null && Object.keys(_this.carParamconfData).length > 0){
				for (let key in _this.carParamconfData) {
					var cf = _this.carParamconfData[key];
					var viewItem=''
						+'	<div class="layui-inline layui-col-md6 layui-col-sm6 layui-col-xs6">                   '
						+'		<label class="layui-form-label">'+cf.name+':</label>    '
						+'		<div class="layui-input-inline">                                                   '
						+'			<input type="text" disabled class="layui-input" value="'+cf.value+'">                               '
						+'		</div>                                                                             '
						+'	</div>                                                                                 '
						+''
						+'';
					viewParent.append(viewItem);
				}
			}
		}
		$.ajaxSettings.async = true;
	},
	updated: function () {
		layui.form.render();
	},
	computed:{	
		timeCreateStr:{   
         get:function() {
         	if(this.tProPlan.timeCreate !=null && this.tProPlan.timeCreate !="") {
 				return new Date(this.tProPlan.timeCreate).format("yyyy-MM-dd hh:mm:ss");   //yyyy-MM-dd hh:mm:ss
 			} else {
 				return "--";
 			}
         }
       },
		modelType:{
			get:function() {
				switch(this.tCarModel.styleModelId) {
					case 1: return '轿车';
					case 2: return 'SUV';
					case 3: return '新能源';
					case 4: return 'MPV';
					default:
						return "";
				}
			}
		},
	},
	methods: {
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handlePictureCardPreview(item) {
			vm.dialogImageUrl = item.url;
			this.dialogVisible = true
		},

		// 上传
		handlechange(file, fileList){
			console.log(file,fileList);
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
						url: r.data[0],
						//nameAccessory: fileName,
						//id:uid
					};
					vm.imgListlbt.push(r.data[0]);
				},
				error: function () {
					layer.msg('上传失败', {icon: 5});
				}
			});
		},
		// 删除
		handleRemove(id) {
			for(var i = 0 ;i<vm.imgList.length;i++) {
				if(vm.imgList[i].id === id) {
					vm.imgList.splice(i,1);
					i= i-1;
				}
			}
		},
		cancel: function(){
		   //layer.closeAll();
			parent.vm.isClose = true;
			var index = parent.layer.getFrameIndex(window.name);
			parent.vm.reload();
			parent.layer.close(index);
			//var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
			//parent.layer.close(index); //再执行关闭
	    },
		query: function () {
			vm.reload();
		},
		// 打开图片窗口
		openImgBox:function(e) {
			layer.photos({
				photos: {"data": [{"src": e.target.src}]},
				closeBtn:1
			})
		},
		reload: function (event) {
			layui.table.reload('gridid', {
				page: {
					curr: 1
				},
				where: {}
			});
		},
        
	},

});

//父页面给子页面传参
function  child(tCarModel,imgList,plan,colorList,imgListlbt){
	vm.tCarModel=tCarModel;
	//vm.imgList=url;
	if(imgList != null){
		imgList.forEach(item => {  //处理图片需要转格式
			let imageUrl = imageURL + item.url;
			vm.imgList.push({
				"url": imageUrl,
				"name":item.name,
				"id": item.id
			})
		})
	}
	/*var myimg = new Array();
	for(var i=0;i< url.length;i++){
		myimg.push(url[i].url);
	}
	vm.imgList = myimg;*/

	if(imgListlbt != null){
		imgListlbt.forEach(item => {  //处理图片需要转格式
			let imageUrl = imageURL + item.url;
			vm.imgListlbt.push({
				"url": imageUrl,
				"name":item.name,
				"id": item.id
			})
		})
	}


	if(vm.tCarModel.tagNames != null && vm.tCarModel.tagNames !=''){
		vm.tagTags = vm.tCarModel.tagNames.split(',');
	}


	getHtmlData(tCarModel.introduce);


	if(tCarModel.basicServices == null){
		setHtmlData(basicServicesEditor,"");
	} else {
		setHtmlData(basicServicesEditor,tCarModel.basicServices);
	}


	if(tCarModel.incrementServices == null){
		setHtmlData(incrementServicesEditor,"");
	} else {
		setHtmlData(incrementServicesEditor,tCarModel.incrementServices);
	}


	if(tCarModel.companyIntroduction == null){
		setHtmlData(companyIntroductionEditor,"");
	} else {
		setHtmlData(companyIntroductionEditor,tCarModel.companyIntroduction);
	}

	if(tCarModel.color != null && tCarModel.color !=''){
		var stringResult = tCarModel.color.split(',');
		for(var i=0;i< stringResult.length;i++){
			vm.dynamicTags.push({
				name:stringResult[i],
				checked:true,
			});
		}

	}

	if(tCarModel.styleModelId==1){
		vm.tCarModel.styleModel =  "轿车";
	}else if(tCarModel.styleModelId==2){
		vm.tCarModel.styleModel =  "SUV";
	}else if(tCarModel.styleModelId==3){
		vm.tCarModel.styleModel = "新能源";
	}else if(tCarModel.styleModelId==4){
		vm.tCarModel.styleModel = "MPV";
	}

	if(plan!=null && plan!=""){
		vm.tProPlan=plan;
	}else{
		vm.tProPlan.name='--';
		vm.tProPlan.timeCreate='--';
	}

/*	if(colorList!=null && colorList.length>0){
		var checkboxs = '';
		$.each(colorList, function(i, item) {
			checkboxs += '<div class="column layui-col-xs2"><input type="checkbox"';
			var colorArray=new Array();
			colorArray= typeof vm.tCarModel.color == "string" ? vm.tCarModel.color.split(",") : [];
			$.each(colorArray, function(n, s) {
				if (item.id == s) {
					checkboxs += 'checked=""';
				}
			});
			checkboxs += 'name="commissionId"  value="' + item.id
				+ '" title="' + item.value + '"></div>';
		});
		$("#commissionBox").html("");
		$("#commissionBox").append(checkboxs);
	}*/
}

// 富文本编辑
const E = window.wangEditor;
const editor = new E('#Editor')
// 或者 const editor = new E( document.getElementById('div1') )
// 设置编辑区域高度为 500px
editor.config.height = 500;
editor.config.zIndex = 1;
editor.config.placeholder = '请输入内容';
// 图片上传
editor.config.customUploadImg = function (resultFiles, insertImgFn) {
	// resultFiles 是 input 中选中的文件列表
	// insertImgFn 是获取图片 url 后，插入到编辑器的方法
	console.log(resultFiles);
	// 上传图片，返回结果，将图片插入到编辑器中
	insertImgFn('https://cn.vuejs.org/images/logo.png')
}

function getHtml() {
	vm.introduce = editor.txt.html()
	console.log(editor.txt.html());
}

function getHtmlData(value){
	editor.txt.html('<p>' + value + '</p>')
}

editor.create();
editor.$textElem.attr('contenteditable', false);


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
	editor.$textElem.attr('contenteditable', false);
}

function setHtmlData(editor, value){
	//editor.txt.html('<p>' + value + '</p>');
	editor.txt.html('<p>' + value + '</p>');
}

