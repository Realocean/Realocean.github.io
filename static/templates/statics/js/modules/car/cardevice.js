$(function () {

    layui.use(['form', 'table'], function(){
        initTable(layui.table);
        layui.form.render();
    });
    //设备状态
    layui.form.on('select(gpsDeviceStatusSelect)', function (data) {
        vm.q.gpsDeviceStatus = data.value;
    });


});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carNo:null,
            deviceNo:null,
            gpsDeviceStatus:1
        }
    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.carNo=null;
            vm.q.deviceNo=null;
            vm.q.gpsDeviceStatus=1;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo:vm.q.carNo,
                    deviceNo:vm.q.deviceNo,
                    gpsDeviceStatus:vm.q.gpsDeviceStatus
                }
            });
        },
        exports: function () {
            var url = baseURL + 'car/device/export?a=a';
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
            }
            if(vm.q.deviceNo != null){
                url += '&deviceNo='+vm.q.deviceNo;
            }
            if(vm.q.gpsDeviceStatus != null){
                url += '&gpsDeviceStatus='+vm.q.gpsDeviceStatus;
            }
            window.location.href = url;

        }

    }
});
function initTable(table) {
    table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + "car/device/list",
        where: {'gpsDeviceStatus':vm.q.gpsDeviceStatus},
        cols: [[
            {field : 'carPlateNo', minWidth : 200, title : '车牌号',align:"center",fixed: "left",templet:function (d) {
                    return isEmpty(d.carPlateNo);
            }},
            {field : 'deviceNo', minWidth : 200, title : '设备编号',templet:function (d) {
                    return isEmpty(d.deviceNo);
            }},
            {field : 'deviceStatusShow', minWidth : 200, title : '设备状态',templet:function (d) {
                    if(d.gpsDeviceStatus == 1){
                        return "<span style='color: green' >"+d.deviceStatusShow+"</span>"
                    }else if(d.gpsDeviceStatus == 2){
                        return "<span style='color: orange' >"+d.deviceStatusShow+"</span>"
                    }else if(d.gpsDeviceStatus == 3 || d.gpsDeviceStatus == 4){
                        return "<span style='color: red' >"+d.deviceStatusShow+"</span>"
                    }else{
                        return "--";
                    }
             }},
            {field : 'mileage', minWidth : 200,  title : '总里程/KM',templet:function (d) {
                    return isEmpty(d.mileage);
            }},
            {field : 'gpsTime', minWidth : 200, title : '最后上报时间',templet:function (d) {
                    return isEmpty(d.gpsTime);
            }}
        ]],
        page: true,
        loading: true,
        limits: [10,20],
        limit: 10
    });
}








