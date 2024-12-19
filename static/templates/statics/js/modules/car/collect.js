var viewer;
$(function () {
	layui.config({
		base: '../../statics/common/'
	}).extend({
		soulTable: 'layui/soultable/ext/soulTable.slim'
	});
	layui.use(['form', 'layedit', 'laydate', 'upload','element', 'table', 'soulTable'], function () {
		init(layui);
		layui.form.render();
	});

    //选择收车处理人
	layui.form.on('select(handlerId)', function (data) {
		vm.collectInfo.handlerId = data.value;
	});

	layui.upload.render({
		elem: '#addFile2',
		url: baseURL + 'file/uploadFile',
		data: {'path':'processApprove'},
		field:'files',
		auto:true,
		size: 50*1024*1024,
		accept: 'file', //普通文件
		acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
		exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
		multiple: true,
		number:20,
		choose: function(obj){
			// PageLoading();
			obj.preview(function(index, file, result){
				var fileName = file.name;
				var extIndex = fileName.lastIndexOf('.');
				var ext = fileName.slice(extIndex);
				var fileNameNotext = fileName.slice(0, extIndex);
				var regExt = /png|jpg|jpeg/;
				var fileType = regExt.test(ext) ? 1:0;
				fileIdTmp = vm.fileLst2.length + '_' + uuid(60);
				var fileTmp={
					id: fileIdTmp,
					operationId:sessionStorage.getItem("userId"),
					operationName:sessionStorage.getItem("username"),
					nameDesc:'审批附件',
					nameAccessory:fileNameNotext,
					nameFile:fileName,
					nameExt:ext,
					typeFile:fileType,
				};
				vm.fileLst2.push(fileTmp);
			});
		},
		done: function (res) {
			// RemoveLoading();
			if (res.code == '0') {
				vm.fileLst2.forEach(function (value) {
					if (value.id === fileIdTmp) value.url = res.data[0];
				});
				vm.fileLstId2 = 'fileLstId_' + uuid(6);
			} else {
				layer.msg('上传失败', {icon: 5});
				vm.delFile2(fileIdTmp);
			}
			fileIdTmp = null;
		},
		error: function () {
			RemoveLoading();
			layer.msg('上传失败', {icon: 5});
			vm.delFile2(fileIdTmp);
			fileIdTmp = null;
		}
	});
	//自定义验证
	layui.form.verify({
		collectTime: function(value){
			if(value=="" || value==null){
				return '收车时间不能为空';
			}
		},
        handlerId: function(value){
			if(value=="" || value==null){
				return '收车处理人不能为空';
			}
		},
		collectReasonName: function(value){
			if(value=="" || value==null){
				return '收车原因不能为空';
			}
		},
	});
	layui.form.on('submit(saveCollect)', function(){
		vm.saveCollect();
		return false;
	});
});


var vm = new Vue({
	el:'#rrapp',
	data:{
		userList:[],
		collectInfo:{},
		collectFileList:[],
		collectForm:true,
		openFlow:false,
		bpmChartDtoList:[],
		instanceId:null,
		boxShow: false,
		boxInputShow: false,
		boxTitle: '',
		boxMark: '',
		fileLst2:[],
		fileLstId2: '0',
		boxHolder: '',
		boxTxt: '',
		viewTag:'add',
		recallNodeName:null,
		processApproveForm:{},
		nodeType:null,
		instanceStatus:null
	},
	updated: function(){
		layui.form.render();
	},
	created: function(){
	    var _this = this;
		$.ajaxSettings.async = false;
		var param = parent.layer.boxParams.boxParams;
		var carCollectId = window.localStorage.getItem("carCollectId");
        $.get(baseURL + "sys/user/usrLst",function(r){
			_this.userList=r.usrLst;
        });
		if(carCollectId != null && carCollectId != '' && carCollectId != undefined){
			$.getJSON(baseURL + "car/carcollect/getCollectById", {carCollectId:carCollectId}, function (r) {
				_this.collectInfo=r.carCollectInfo;
				_this.collectFileList = _this.collectInfo.collectFileList;
			});
		}
		if(param != undefined){
			_this.instanceId = param.instanceId;
			_this.recallNodeName = param.recallName;
			_this.viewTag = param.viewTag;
			_this.instanceStatus = param.instanceStatus;
			_this.processApproveForm = param;
			$.get(baseURL + "activity/getNodeType",{instanceId:param.instanceId},function(r){
				_this.nodeType = r.nodeType;
			});
			_this.openFlow = true;
			// if(_this.viewTag != 'add'){
			// 	$.get(baseURL + "activity/bpmChart",{processKey:param.processKey,instanceId:param.instanceId}, function (r) {
			// 		if (r.code == 0){
			// 			_this.bpmChartDtoList = r.bpmChart;
			// 			_this.openFlow = true;
			// 		}
			// 	});
			// }
		}

		if(_this.viewTag == 'add'){
			$.get(baseURL + "activity/bpmInitChart",{processKey:"carCollectApprove"}, function (r) {
				if (r.code == 0){
					_this.bpmChartDtoList = r.bpmInitChart;
					_this.openFlow = r.openFlow;
				}
			});
		}

		$.ajaxSettings.async = true;
	},
	methods: {
		requestAction: function (action,type) {
			PageLoading();
			vm.processApproveForm.processOperationType = type;
			vm.processApproveForm.businessId = vm.collectInfo.carCollectId;
			vm.processApproveForm.approveContent = vm.boxTxt;
			vm.processApproveForm.approveFileList=vm.fileLst2;
			var closeBox = false;
			$.ajax({
				type: "POST",
				url: baseURL + "car/carcollect/" + action,
				contentType: "application/json",
				async:false,
				data: JSON.stringify(vm.processApproveForm),
				success: function (r) {
					RemoveLoading();
					if (parseInt(r.code) === 0) {
						alert('操作成功', function () {
							closeBox = true;
							layer.closeAll();
							var index = parent.layer.getFrameIndex(window.name);
							parent.vm.reload();
							parent.layer.close(index);
						});
					} else {
						closeBox = false;
						alert(r.msg);
					}
				}
			});
			return closeBox;
		},
		showBox: function (submit) {
			vm.boxTxt = '';
			var index = layer.open({
				title: vm.boxTitle,
				type: 1,
				area: ['90%', '95%'],
				btn:['取消','确定'] ,
				content: $("#boxShow"),
				btnAlign: 'c',
				end: function(){
					vm.boxShow = false;
					vm.fileLst2=[];
					layer.close(index);
				},
				btn1:function (index, layero) {
					vm.boxShow = false;
					vm.fileLst2=[];
					layer.close(index);
				},
				btn2:function (index, layero) {
					return submit();
				}
			});
			vm.boxShow = true;
		},
		approve:function(){
			vm.boxTitle = '审核通过';
			vm.boxMark = '审核反馈';
			vm.boxHolder = '可以输入审核意见/选填';
			vm.boxInputShow = true;
			vm.showBox(function () {
				return vm.requestAction('handle', 4);
			});
		},
		getFileData:function (data){
			let param={
				data:data
			}
			var index = layer.open({
				title: "查看",
				type: 2,
				boxParams: param,
				content: tabBaseURL +"modules/common/approvefileview.html",
				end: function () {
					layer.close(index);
				}
			});
			layer.full(index);
		},
		delFile2: function (id) {
			for(var i = 0 ;i<vm.fileLst2.length;i++) {
				if(vm.fileLst2[i].id === id) {
					vm.fileLst2.splice(i,1);
					i= i-1;
				}
			}
		},
		reject:function(){
			vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
			vm.boxMark = '审核反馈';
			vm.boxHolder = '可以输入审核意见/必填';
			vm.boxInputShow = true;
			vm.showBox(function () {
				if (vm.boxTxt == null || vm.boxTxt == ''){
					alert('请输入审核意见');
					return false;
				}
				return vm.requestAction('handle', 3);
			});
		},
		reedit:function(){
			vm.viewTag = 'reedit';
		},
		cancel:function(){
			vm.collectForm=false;
			var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
			parent.layer.close(index);
		},
		saveCollect: function (event) {
			var url =vm.collectInfo.carCollectId == null ? "car/carcollect/save" : "car/carcollect/update";
			if(vm.collectFileList != null && vm.collectFileList.length >0){
                vm.collectInfo.collectFileList=vm.collectFileList;
			}
			vm.collectInfo.viewTag = vm.viewTag;
			vm.collectInfo.instanceId = vm.processApproveForm.instanceId;
			$.ajax({
				type: "POST",
				url: baseURL + url,
				contentType: "application/json",
				data: JSON.stringify(vm.collectInfo),
				success: function(r){
					if(r.code === 0){
						alert('操作成功', function(index){
							var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
							parent.layer.close(index);
							parent.vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		}
	}
});
function  toChildren(collectInfo){
	vm.collectInfo=collectInfo;
	vm.collectInfo.handlerId=sessionStorage.getItem("userId");
}
function init(layui){
	initDate(layui.laydate);
	initUpload(layui.upload);
	initBpmChart();
}

function initBpmChart() {
	BpmChart({instanceId: vm.instanceId}).initView();
}

function initDate(laydate){
	laydate.render({
		elem: '#collectTime',
		trigger: 'click',
		type: 'datetime',
		done: function (value) {
			vm.collectInfo.collectTime = value;
		}
	});
}
function initUpload(layUpload){
	uploadView = Upload({
		elid: 'collectFileListId',
		edit: vm.viewTag === 'add',
		fileLst: vm.collectFileList,
		param: {'path':'car-collect'},
		fidedesc: '收车附件'
	});
	uploadView.initView();
}

var uploadView;