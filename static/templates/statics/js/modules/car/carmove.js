$(function () {
	vm.getTransferReason();
	//保存
	layui.form.on('submit(submitEditData)', function () {
		vm.saveOrUpdate();
		return false;
	});

	//移库原因下拉列表事件监听
	layui.form.on('select(transferReasonSerch)', function (data) {
		vm.inOutRecords.transferReason = data.value;
	});

	if(vm.nodeFields.moveHouse_carMove_transferReason && vm.nodeFields.moveHouse_carMove_transferReason.required){
		layui.form.verify({
			transferReasonVerify: function(value) {
				if (value == "" || value == null) {
					return '必填项不能为空';
				}
			},
		});
	}
	layui.use('upload', function () {
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
	}),
	layui.use('laydate', function () {
		layui.laydate.render({
			elem: '#transferTime',
			format: 'yyyy-MM-dd HH:mm:ss',
			type: 'datetime',
			trigger: 'click',
			done: function (value, date, endDate) {
				vm.inOutRecords.transferTime= value;
			}
		});
	});

	BpmChart({instanceId: vm.instanceId}).initView();
	layui.form.render();

});
var instanceStatus = -1;//
var processnode;
var bpmcharlist;
var viewer;
var vm = new Vue({
	el: '#rrapp',
	data: {
		inOutRecords: {},
		inOutRecordsInfor: {},
		title: null,
		dateLabel:null,
		settleAmount: null,
		amount: {},
		settleType: null,
		approveType: null,
		instanceStatus: null,
		//仓库数据源
		warehouseData: {},
		processNode: {
			nodeField:[],
			nodeOther:[]
		},
		transferReasonList:[],
		businessId:null,
		approveId:null,
		processKey:'carMoveApprove',
		nodeFields: {},
		bpmChartDtoList: [],
		recallNodeName: '',
		instanceId: null,
		viewTag: null,
		boxShow: false,
		boxInputShow: false,
		fileLst2:[],
		fileLstId2: '0',
		boxTitle: '',
		boxMark: '',
		boxHolder: '',
		nodeId:'',
		boxTxt: '',
		applyData:{},
		initData:{},
		nodeType:-1,
		order:null
	},
	created: function(){
		var _this = this;
		var param = parent.layer.boxParams.boxParams;
		_this.viewTag = param.viewTag;
		_this.approveType = param.approveType;
		_this.instanceStatus = param.instanceStatus;
		_this.nodeId = param.nodeId;
		_this.businessId = param.id;
		_this.order = param.data;
		$.ajaxSettings.async = false;
		if (!_this.viewTag) {
			_this.viewTag = 'apply';
		}
		if(param.viewTag != 'apply'){
			_this.instanceId = param.instanceId;
			$.get(baseURL + "car/carshift/info/" + param.id, function (r) {
				if (r.code === 0){
					if(_this.viewTag === 'approve'||_this.viewTag === 'edit'||_this.viewTag === 'approveDetail'||_this.viewTag === 'applyDetail'){
						_this.inOutRecords = {
							code:r.carShift.code,
							transferReason:r.carShift.transferReason,
							transferReasonStr:r.carShift.transferReasonStr,
							warehouseId: r.carShift.purposeDepotId,
							warehouseName:r.carShift.purposeDepotName,
							transferTime:r.carShift.transferTime,
							transferPersonnel:r.carShift.moveUser,
							transferDeptId:r.carShift.purposeDeptId,
							transferDeptName:r.carShift.purposeDeptName,
							remarks:r.carShift.remarks
						}
						_this.inOutRecordsInfor = {
							carPlate:r.carShift.carNo,
							vin:r.carShift.vinNo,
							carBrandSeriesModelName:r.carShift.brandModel,
							depotName:r.carShift.depotName,
							storageTime:r.carShift.storageTime,
							deptName:r.carShift.deptName,
							deptId:r.carShift.deptId,
							carId:r.carShift.carId,
							depotId:r.carShift.depotId
						}
					}
				}
			});
		}

		var url = '';
		if( _this.instanceId!=null && _this.instanceId!=null && _this.instanceId!=''){
			url = "mark/processnode/getProcessInit?processKey="+_this.processKey+"&instanceId=" + _this.instanceId;
		}else{
			url = "mark/processnode/getProcessInit?processKey="+_this.processKey+"&instanceId=null";
		}
		$.get(baseURL + url, function (r) {
			if (r.code == 0 && (processnode = r.data) != null){
				processnode['approveId'] = param.approveId;
				_this.approveId = param.approveId;
				if (processnode['currentNodeData'] != null && processnode['currentNodeData'] != ''){
					_this.processNode.currentNodeData = processnode['currentNodeData'];
					_this.nodeType = _this.processNode.currentNodeData.nodeType;
					if (processnode['currentNodeData']['nodeBigValue'] != null && processnode['currentNodeData']['nodeBigValue'] != ''){
						_this.processNode['nodeField'] = JSON.parse(processnode['currentNodeData']['nodeBigValue']);
					}
					if (processnode['currentNodeData']['nodeOtherValue'] != null && processnode['currentNodeData']['nodeOtherValue'] != ''){
						_this.processNode['nodeOther'] = JSON.parse(processnode['currentNodeData']['nodeOtherValue']);
					}
					if (processnode['currentNodeData']['recallNodeName'] != null && processnode['currentNodeData']['recallNodeName'] != ''){
						_this.recallNodeName = processnode['currentNodeData']['recallNodeName'];
					}
				}
				if (processnode['instanceStatus'] != null && processnode['instanceStatus'] != ''){
					instanceStatus = Number(processnode['instanceStatus']);
				}
				if (processnode['bpmChartDtoList'] != null && processnode['bpmChartDtoList'] != ''){
					_this.bpmChartDtoList = processnode['bpmChartDtoList'];
				}
				if (processnode['approveData'] != null && processnode['approveData'] != ''){
					_this.processNode.approveData = processnode['approveData'];
				}
				processnode = _this.processNode;
				bpmcharlist = _this.bpmChartDtoList;
			}
		});
		initializeShowLv(_this.nodeFields, _this.processNode.nodeField,_this.viewTag);
		flowFieldPolishingNull(_this.nodeFields);
	},
	computed: {},
	updated: function(){
		layui.form.render();
	},
	methods: {
		getTransferReason:function(){
			var type="TRANSFER_REASON";
			$.ajax({
				type: "POST",
				url: baseURL + 'sys/dict/getInfoByType/'+type,
				contentType: "application/json",
				async:false,
				data:{},
				success: function(r){
					if(r.code === 0){
						vm.transferReasonList=r.dict;
					}else{
						alert(r.msg);
					}
				}
			});
		},
		deptTree: function(){
			var index = layer.open({
				title: "选择组织机构",
				type: 2,
				area: ['80%', '80%'],
				content: tabBaseURL + "modules/common/selectdept.html",
				end: function(){
					layer.close(index);
				}
			});
		},
		zTreeClick: function(event, treeId, treeNode){
			Vue.set(vm.inOutRecords,"transferDeptId",treeNode.deptId);
			Vue.set(vm.inOutRecords,"transferDeptName",treeNode.name);
			layer.closeAll();
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
		requestAction: function (action,type) {
			PageLoading();
			var closeBox = false;
			vm.inOutRecords.warehouseIdOld=vm.inOutRecordsInfor.depotId;
			vm.inOutRecords.carId=vm.inOutRecordsInfor.carId;
			vm.inOutRecords.deptId=vm.inOutRecordsInfor.deptId;
			vm.inOutRecords.deptName=vm.inOutRecordsInfor.deptName;
			vm.inOutRecords.storageTime = vm.inOutRecordsInfor.storageTime;
			vm.inOutRecords.carBrandSeriesModelName = vm.inOutRecordsInfor.carBrandSeriesModelName;
			vm.inOutRecords.carPlate = vm.inOutRecordsInfor.carPlate;
			vm.inOutRecords.vin = vm.inOutRecordsInfor.vin;
			vm.inOutRecords.instanceId = vm.instanceId;
			vm.inOutRecords.processApproveForm = {
				approveId:vm.approveId,
				instanceId:vm.instanceId,
				approveContent:vm.boxTxt,
				processKey:vm.processKey,
				nodeId:vm.nodeId,
				processOperationType:type,
				approveFileList:vm.fileLst2,
			};
			$.ajax({
				type: "POST",
				url: baseURL + "car/carshift/process/" + action,
				contentType: "application/json",
				async:false,
				data: JSON.stringify(vm.inOutRecords),
				success: function (r) {
					RemoveLoading();
					if (parseInt(r.code) === 0) {
						alert('操作成功', function () {
							closeBox = true;
							layer.closeAll();
							closePage();
						});
					} else {
						closeBox = false;
						alert(r.msg);
					}
				}
			});
			return closeBox;
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
		applydel: function(){
			vm.boxTitle = '提示';
			vm.boxMark = '确定要删除？\n删除成功之后，将无法恢复';
			vm.boxHolder = '撤回原因/选填';
			vm.boxInputShow = false;
			vm.showBox(function () {
				return vm.requestAction('del');
			});
		},
		reedit: function(){
			var param = {
				id: vm.businessId,
				instanceId: vm.instanceId,
				viewTag: 'edit'
			};
			var index = layer.open({
				title: "重新编辑",
				type: 2,
				boxParams: param,
				content: tabBaseURL + "modules/car/carmove.html",
				end: function () {
					layer.close(index);
				}
			});
			layer.full(index);
		},
		recall: function(){
			//撤回
			vm.boxTitle = '撤回确认';
			vm.boxMark = '确定要撤回申请单？撤回成功之后，将无法恢复';
			vm.boxHolder = '撤回原因/选填';
			vm.boxInputShow = true;
			vm.showBox(function () {
				return vm.requestAction('handle',1);
			});
		},
		approve: function(){
			//审核通过
			vm.boxTitle = '审核通过';
			vm.boxMark = '审核反馈';
			vm.boxHolder = '可以输入审核意见/选填';
			vm.boxInputShow = true;
			vm.showBox(function () {
				// if (vm.boxTxt == null || vm.boxTxt == ''){
				//     alert('请输入审核意见');
				//     return false;
				// }
				return vm.requestAction('edit');
			});
		},
		reject: function(){
			//审核驳回
			vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
			vm.boxMark = '审核反馈';
			vm.boxHolder = '可以输入审核意见/必填';
			vm.boxInputShow = true;
			vm.showBox(function () {
				if (vm.boxTxt == null || vm.boxTxt == ''){
					alert('请输入审核意见');
					return false;
				}
				return vm.requestAction('handle',3);
			});
		},
		refuse: function(){
			//审核拒绝
			vm.boxTitle = '审核拒绝';
			vm.boxMark = '审核反馈';
			vm.boxHolder = '可以输入审核意见/必填';
			vm.boxInputShow = true;
			vm.showBox(function () {
				if (vm.boxTxt == null || vm.boxTxt == ''){
					alert('请输入审核意见');
					return false;
				}
				return vm.requestAction('handle',2);
			});
		},
		saveOrUpdate: function () {
			var url = vm.businessId == null ? "car/carshift/process/save" : "car/carshift/process/edit";
			vm.inOutRecords.warehouseIdOld=vm.inOutRecordsInfor.warehouseIdOld;
			vm.inOutRecords.carId=vm.inOutRecordsInfor.carId;
			vm.inOutRecords.modelId=vm.inOutRecordsInfor.modelId;
			vm.inOutRecords.deptId=vm.inOutRecordsInfor.deptId;
			vm.inOutRecords.deptName=vm.inOutRecordsInfor.deptName;
			if(vm.inOutRecordsInfor.storageTime != '--'){
				vm.inOutRecords.storageTime = vm.inOutRecordsInfor.storageTime;
			}
			vm.inOutRecords.carBrandSeriesModelName = vm.inOutRecordsInfor.carBrandSeriesModelName;
			vm.inOutRecords.carPlate = vm.inOutRecordsInfor.carPlate;
			vm.inOutRecords.vin = vm.inOutRecordsInfor.vin;
			vm.inOutRecords.instanceId = vm.instanceId;
			vm.inOutRecords.processApproveForm = {
				processKey : vm.processKey,
				instanceId : vm.instanceId
			};
			$.ajax({
				type: "POST",
				url: baseURL + url,
				contentType: "application/json",
				async:false,
				data: JSON.stringify(vm.inOutRecords),
				success: function (r) {
					if (r.code === 0) {
						alert('操作成功', function (index) {
							parent.layer.closeAll();
							parent.vm.reload();
						});
					} else {
						alert(r.msg);
						// parent.layer.closeAll();
					}
				}
			});
		},
		cancel: function () {
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.close(index);
			parent.vm.reload();
		},
		chooseWarehouse:function(){
			var index = layer.open({
				title: "选择仓库",
				type: 2,
				area: ['80%', '80%'],
				content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
				end: function(){
					if(vm.warehouseData.warehouseId != null){
						vm.inOutRecords = Object.assign({}, vm.inOutRecords,{
							warehouseId:vm.warehouseData.warehouseId,
							warehouseName:vm.warehouseData.warehouseName,
						});
					}
					layer.close(index);
				}
			});
		}
	}
});

function closePage() {
	var index = parent.layer.getFrameIndex(window.name);
	parent.vm.reload();
	parent.layer.close(index);
}

function isShowContent() {
	return instanceStatus == 2 || instanceStatus == 5 ||instanceStatus == 6;
}
function getAuditStatusStr() {
	return '移库审核中';
}
function getOrderStatusStr() {
	if (instanceStatus == 2){
		return '已拒绝';
	} else if (instanceStatus == 3){
		return '已完成';
	} else if (instanceStatus == 5){
		return '已撤回';
	}else if(instanceStatus === -1){

	} else {
		if (processnode != null && processnode.currentNodeData != null){
			return processnode.currentNodeData.nodeName;
		}
	}
}
function getAuditMarkType() {
	if (instanceStatus == 2 || instanceStatus == 6) {
		return '审核反馈';
	}else if (instanceStatus == 5) {
		return '撤回原因';
	}
}
function getAuditMarkStr() {
	if (processnode != null && processnode.approveData != null){
		return processnode.approveData.approveContent;
	} else {
		return '---';
	}
}
