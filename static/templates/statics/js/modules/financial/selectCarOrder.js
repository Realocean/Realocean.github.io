$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'financial/shouldrefund/findCarOrderList',
        cols: [[
                        {title: '操作', width:100, templet:'#barTpl',fixed:"left",align:"center"},
                        {field:'carOrderNo', minWidth:200, title: '订单号',align:"center",fixed: "left", templet: function (d) {return isEmpty(d.carOrderNo);}},
                        {field:'carNo', minWidth:100, title: '车牌号', templet: function (d) {return isEmpty(d.carNo);}},
                        {field:'vinNo', minWidth:200, title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                        {field:'carStatusShow', minWidth:100, title: '订单状态', templet: function (d) {
                                return isEmpty(d.orderStatusShow);
                        }},


        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 50],
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
            carOrderNo:null,
        },
        result:{}
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
        vm.q.carOrderNo='';
    },
    selector: function (data) {
        parent.vm.receivables = Object.assign({}, parent.vm.receivables, {
            carPlateNo: data.carNo,
            vin: data.vinNo,
            rentTypeShow: data.rentTypeShow,
            orderStatusShow: data.orderStatusShow,
            carOrderNo: data.carOrderNo,
            customerId:data.customerId,
            customerName:data.customerName,
        });
        parent.vm.shouldRefund = Object.assign({}, parent.vm.shouldRefund, {
            carId: data.carId,
            carNo: data.carNo,
            vinNo: data.vinNo,
            rentTypeShow: data.rentTypeShow,
            orderStatusShow: data.orderStatusShow,
            carOrderNo: data.carOrderNo,
            customerId:data.customerId,
            customerName:data.customerName
        });
        parent.vm.payment = Object.assign({}, parent.vm.payment, {
            carId: data.carId,
            carNo: data.carNo,
            vinNo: data.vinNo,
            rentTypeShow: data.rentTypeShow,
            orderStatusShow: data.orderStatusShow,
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
                carOrderNo: vm.q.carOrderNo,
            }
        });
    }
}
});

