$(function () {
	gridTable = layui.table.render({
		id: "gridid",
		elem: '#grid',
		url: baseURL + 'car/electricfence/carbasicList',
		cols: [[
			{type:'checkbox'},
			{field: 'carNo', minWidth: 200,fixed: "left", title: '车牌号',align:"center"},
			{field: 'vinNo', minWidth: 200, title: '车架号'},
			{field: 'gpsDeviceNo', minWidth: 200, title: '设备编号',templet:function (d) {
                     return isEmpty(d.gpsDeviceNo);
			 }},
			{field: 'deptName', minWidth: 200, title: '所属公司', templet: function (d) {
					return isEmpty(d.deptName);
			}},
			{field: 'isElectric', minWidth: 150, title: '绑定状态',templet: function (d) {
				//是否绑定电子围栏（1.是 2.否）
				if(d.isElectric==2){
					return '未绑定';
				}else{
					return  "--";
				}
			}},
			{title: '操作', width: 200, templet: '#barTpl', fixed: "right", align: "center"}
		]],
		where:{"type":1,"deptId":vmbs.deptId},
		page: true,
		loading: true,
		limits: [10,20, 50, 100],
		limit: 10
	});

	layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;
		form.render();
	});
	//操作
	layui.table.on('tool(grid)', function (obj) {
		var layEvent = obj.event,
			data = obj.data;
		if (layEvent === 'binding') {
			vmbs.binding(data);
		}
	});

    $("#closePage").on('click', function(){
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
});
var setting = {
	    data: {
	        simpleData: {
	            enable: true,
	            idKey: "deptId",
	            pIdKey: "parentId",
	            rootPId: -1
	        },
	        key: {
	            url:"nourl"
	        },

	    }
	};
var ztree;
var vmbs = new Vue({
	el: '#rrapp',
	data: {
		q: {
			carNo: null,
			deviceNo: null,
			deptId:null,
			deptName:null
		},
		 user:{
	        	status:1,
	        	deptId:null,
	        	deptName:null,
	        	roleIdList:[],
	        	deptIdList:[]
	        },
		showForm: false,
		editForm: false,
		electricId: null,
		deptId: null,
		electricName: null
	},
	mounted: function () {
		var electricId=localStorage.getItem("electricId");
		var deptId=localStorage.getItem("deptId");
		var electricName=localStorage.getItem("electricName");
		this.deptId=deptId;
		this.electricId=electricId;
		this.electricName=electricName;
	},
	updated: function () {
		layui.form.render();
	},
	methods: {
		//绑定车辆
		binding :function(data){
			//围栏id
			var  electricId=localStorage.getItem("electricId");
			var  fenceId=localStorage.getItem("id");
            var  carId=data.carId;
			var param = {"fenceId": fenceId, "carId": carId,"electricId":electricId};
			var infor="确定要将选中车辆绑定到电子围栏？";
			confirm(infor, function(){
                PageLoading();
				$.ajax({
					type: "POST",
					url: baseURL + "car/electricfence/binding",
					contentType: "application/json",
					data: JSON.stringify(param),
					success: function (r) {
                        RemoveLoading();
						if (r.code == 0) {
							alert("绑定成功");
							vmbs.reload();
						} else {
							alert(r.msg);
						}
					}
				});
			});
		},
		//批量绑定
		bindingAll:function () {
			var list = layui.table.checkStatus('gridid').data;
			console.log(list);
			if(list.length == 0){
				alert("请选择一条记录");
				return ;
			}

			var carIds = [];
			$.each(list, function(index, item) {
				carIds.push(item.carId);
			});

			var  electricId=localStorage.getItem("electricId");
			var  fenceId=localStorage.getItem("id");
			var param = {"fenceId": fenceId, "carIds": carIds,"electricId":electricId};
			var infor="确定要将选中车辆绑定到电子围栏？";
			confirm(infor, function(){
				PageLoading();
				$.ajax({
					type: "POST",
					url: baseURL + "car/electricfence/bindingAll",
					contentType: "application/json",
					data: JSON.stringify(param),
					success: function (r) {
						RemoveLoading();
						if (r.code == 0) {
							alert("绑定成功");
							vmbs.reload();
						} else {
							alert(r.msg);
						}
					}
				});
			});
		},

		query: function () {
			vmbs.reload();
		},

		reset: function () {
			vmbs.q = Object.assign({carNo: ""},{deptName:""},{deviceNo:""});
			vmbs.reload();
		},
		reload: function (event) {
			layui.table.reload('gridid', {
				page: {
					curr: 1
				},
				where: {
					carNo: vmbs.q.carNo,
					deptId: vmbs.deptId,
					deviceNo: vmbs.q.deviceNo,
				}
			});
		},

	}
});
