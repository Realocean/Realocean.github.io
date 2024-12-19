$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'financial/shouldrefund/getVehicleList',
        cols: [[
                        {title: '操作', width:100, templet:'#barTpl',fixed:"left",align:"center"},
                        {field:'carNo', minWidth:100, title: '车牌号',align:"center", fixed: "left",templet: function (d) {return isEmpty(d.carNo);}},
                        {field:'vinNo', minWidth:200, title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                        {field:'carStatusShow', minWidth:100, title: '车辆状态', templet: function (d) {
                                return isEmpty(d.carStatusShow);
                        }},
                        {field:'carOrderNo', minWidth:200, title: '车辆订单号', templet: function (d) {return isEmpty(d.carOrderNo);}},

        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selector(data);
        }
    });

    layui.form.on('select(carNo)', function (data) {
        vm.q.carNo = data.value;
    });

    layui.form.on('select(vinNo)', function (data) {
        vm.q.vinNo = data.value;

    });

    //getVehicleInfo();
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carNo:null,
            vinNo:null,
        },
        result:{},
        getCarNoAndVinNo:{}
},
updated: function(){
    layui.form.render();
},
methods: {
    query: function () {
        vm.reload();
    },
    reset: function () {
        vm.q.carNo = '';
        vm.q.vinNo = '';
    },
    selector: function (data) {
        parent.vm.receivables = Object.assign({}, parent.vm.receivables, {
            carPlateNo: data.carNo,
            vin: data.vinNo,
            carStatus: data.carStatus,
            carStatusShow: data.carStatusShow,
            carOrderNo: data.carOrderNo,
            customerId:data.customerId,
            customerName:data.customerName,
        });
        parent.vm.shouldRefund = Object.assign({}, parent.vm.shouldRefund, {
            carNo: data.carNo,
            vinNo: data.vinNo,
            vehicleState: data.carStatus,
            vehicleStateShow: data.carStatusShow,
            carOrderNo: data.carOrderNo,
            customerId:data.customerId,
            customerName:data.customerName,
            brand:data.brand,
            carModel:data.carModel,
            leaseType:data.leaseType,
            lessorId:data.lessorId,
            lessorName:data.lessorName
        });
        parent.vm.payment = Object.assign({}, parent.vm.payment, {
            carId: data.carId,
            carNo: data.carNo,
            vinNo: data.vinNo,
            carStatus: data.carStatus,
            carStatusShow: data.carStatusShow,
            customerId:data.customerId,
            customerName:data.customerName,
            carOrderNo:data.carOrderNo,
        });
        parent.vm.customer.customerName=data.customerName;
        parent.vm.customer.customerId=data.customerId;
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    },
    reload: function (event) {
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: {
                carNo: vm.q.carNo,
                vinNo: vm.q.vinNo,
            }
        });
    }
}
});

/**
 * 获取车辆信息:车牌号、车架号、车辆状态、车辆订单
 */
function getVehicleInfo(){
    $.ajax({
        type: "GET",
        url: baseURL + "financial/shouldrefund/getCarNoAndVinNo",
        contentType: "application/json",
        success: function(res){
            vm.getCarNoAndVinNo = res.data;
        },
        error:function(error){
            console.log(error);
        }
    });
}
