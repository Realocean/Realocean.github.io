$(function () {
	layui.use(['form', 'layedit', 'laydate'], function () {
			var form = layui.form;
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
			vm.getTransferReason();
			vm.getWarehouseList();

			form.verify({
				transferReasonVerify: function (value) {
					if (value == "" || value == null) {
						return '移库原因不能为空';
					}
				},
				transferDeptVerify: function(value) {
					if (value == "" || value == null) {
						return '目前车辆归属不能为空';
					}
				},
				warehouseNameVerify: function (value) {
					if (value == "" || value == null) {
						return '目的仓库不能为空';
					}

				},
				transferTimeVerify: function (value) {
					if (value == "" || value == null) {
						return '移库时间不能为空';
					}

			    },
				transferPersonnelIdVerify: function (value) {
					if (value == "" || value == null) {
						return '移库人员不能为空';
					}
				}
		});
		form.render();
	});

	//移库原因下拉列表事件监听
	layui.form.on('select(transferReasonSerch)', function (data) {
		vm.inOutRecords.transferReason = data.value;
	});

	//目的仓库下拉列表事件监听
	layui.form.on('select(warehouseIdSerch)', function (data) {
		vm.inOutRecords.warehouseId = data.value;
	});


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
	layui.form.on('submit(saveOrUpdate)', function () {
		vm.saveOrUpdate();
		return false;
	});
});
var vm = new Vue({
	el: '#rrapp',
	data: {
		editForm: true,
		//基础信息数据源
		inOutRecordsInfor:{},
		//移库数据源
		inOutRecords:{},
		//移库原因数据源
		transferReasonList:[],
		//仓库数据源
		warehouseData:{},
		warehouseList:[],
		carInfor:{}
	},
	updated: function () {
		layui.form.render();
	},
	methods: {
		deptTree: function(){
			var index = layer.open({
				title: "选择组织机构",
				type: 2,
				area: ['60%', '55%'],
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
		cancel: function(){
			var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
			parent.layer.close(index);
		},
		selectwarehouse:function () {
			var index = layer.open({
				title: "仓库/城市名称选择",
				type: 2,
				content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
				end: function(){
					vm.inOutRecords = Object.assign({}, vm.inOutRecords,{
						warehouseId:vm.warehouseData.warehouseId,
						warehouseName:vm.warehouseData.warehouseName,
					});
				}
			});
			layer.full(index);
		},
		//仓库查询方法
		getWarehouseList:function (){
			$.ajax({
				type: "POST",
				url:baseURL + "warehouse/warehouse/getWarehouseEntityList",
				contentType: "application/json",
				data:{},
				success: function(r){
					vm.warehouseList=[];
					if(r.warehouseList != null && localStorage.getItem("depotId") != undefined && localStorage.getItem("depotId") != null){
						r.warehouseList.forEach(function (item, index) {
							if(item.warehouseId != localStorage.getItem("depotId")){
								vm.warehouseList.push(item);
							}
						});
					}
				}
			});
		},
		//移库原因查询方法
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
						vm.transferReasonList=[];
						vm.transferReasonList=r.dict;
						/*if(r.dict != null){
							r.dict.forEach(function (item, index) {
								if(item.code != 1 && item.code != 6  && item.code != 7){
									vm.transferReasonList.push(item);
								}
							});
						}*/
					}else{
						alert(r.msg);
					}
				}
			});
		},
		saveOrUpdate: function (event) {
			vm.inOutRecords.warehouseIdOld=vm.inOutRecordsInfor.warehouseIdOld;
			vm.inOutRecords.carId=vm.inOutRecordsInfor.carId;
			vm.inOutRecords.deptId=vm.inOutRecordsInfor.deptId;
			vm.inOutRecords.deptName=vm.inOutRecordsInfor.deptName;
			if(vm.inOutRecordsInfor.storageTime != '--'){
				vm.inOutRecords.storageTime = vm.inOutRecordsInfor.storageTime;
			}
			vm.inOutRecords.carBrandSeriesModelName = vm.inOutRecordsInfor.carBrandSeriesModelName;
			vm.inOutRecords.modelId = vm.inOutRecordsInfor.modelId;
			$.ajax({
				type: "POST",
				url: baseURL + "inoutrecords/inourecords/save",
				contentType: "application/json",
				data: JSON.stringify(vm.inOutRecords),
				success: function (r) {
					if (r.code === 0) {
						alert('操作成功', function (index) {
							parent.layer.closeAll();
						//	parent.vm.getWarehouseListAndCarNumCount();
							parent.vm.reload();

						});
					} else {
						alert(r.msg);
					}
				}

			});
		},
	}
});




