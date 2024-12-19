$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});
var map;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        detailsTabContentList: [
                            '电子围栏',
                            '操作记录',
                    ],
        detailsSupTabContentList: [
                            '地图查看',
                            '已绑定车辆',
                    ],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        address: '',
        list: [],
        electricFence: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.electricFence = param.data;
        console.log(param.data);
        _this.list = param.list;
        if(_this.electricFence.provinceName!=null&&_this.electricFence.provinceName!=''){
            if(_this.electricFence.cityName!=null&&_this.electricFence.cityName!=''){
                if(_this.electricFence.areaName!=null&&_this.electricFence.areaName!=''){
                    _this.address= _this.electricFence.provinceName+''+_this.electricFence.cityName+''+_this.electricFence.areaName;
                }else{
                    _this.address= _this.electricFence.provinceName+''+_this.electricFence.cityName;
                }
            }else{
                _this.address= _this.electricFence.provinceName;
            }
        }else{
            _this.address= "陕西省西安市";
        }
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function () {
        map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(116.403765, 39.914850), 5);
        map.enableScrollWheelZoom();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
        //解绑车辆
        noBinding :function(data){
             
            //围栏id
            var fenceId=vm.electricFence.id;
            var carId=data.carId;
            confirm("是否对当前车辆进行解绑", function(){
                PageLoading();
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/electricfence/unbundling/"+fenceId+"/"+carId,
                    contentType: "application/json",
                    data: {},
                    success: function (r) {
                        RemoveLoading();
                        if (r.code == 0) {
                            alert("解绑成功");
                            vm.reloadCar(carId);
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reloadCar: function (rmid) {
            layui.table.reload('grid1Id', {
                page: {
                    curr: 1
                },
                where :{"fenceId":vm.electricFence.id},
            });
            /*if (vm.list.length > 0 && rmid != null && rmid != ''){
                for(var i = 0 ;i<vm.list.length;i++) {
                    if(vm.list[i].id === rmid) {
                        vm.list.splice(i,1);
                        i= i-1;
                    }
                }
                getBoundary(vm.address, vm.list);
            }*/
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[0];
    getBoundary(vm.address, vm.list);
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
     // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.electricFence.id,
            auditType: 16
        },
        cols: [[
            {field:'operatorName', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    table.render({
        elem: '#grid1',
        id: 'grid1Id',
        url: baseURL +'car/electricfence/boundCarList',
        cols: [[
            {field: 'carNo', minWidth: 200, title: '车牌号',align:"center",fixed: "left",},
            {field: 'vinNo', minWidth: 200, title: '车架号'},
            {field: 'deptName', minWidth: 200, title: '所属公司', templet: function (d) {
                    if(d.deptName!=null&&d.deptName!=''){
                        return d.deptName;
                    }else{
                        return "--";
                    }
                }},
           /* {field: 'isElectric', minWidth: 200, title: '绑定状态',templet: function (d) {
                   //是否绑定电子围栏（1.是 2.否）
                    if(d.isElectric==1){
                        return "已绑定";
                    }else if(d.isElectric==2){
                        return "未绑定";
                    }else{
                        return  "--";
                    }
                }},*/
            {field: 'bindingTime', minWidth: 200, title: '绑定时间', templet: "<div>{{new Date(d.bindingTime).format(\"yyyy-MM-dd hh:mm:ss\")}}</div>"},
            {title: '操作', width: 200, templet: '#barTpl1', fixed: "right", align: "center"}
        ]],
        where :{"fenceId":vm.electricFence.id},
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid1)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'bindingCar') {
            vm.noBinding(data);
        }
    });
}

function initDate(laydate) {

}

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function getBoundary(address,list){
     
    var bdary = new BMap.Boundary();
    bdary.get(address, function(rs){       //获取行政区域
        map.clearOverlays();        //清除地图覆盖物
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            alert('未能获取当前输入行政区域');
            return ;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor : "#014F99",
                fillColor: " #DDE4F0"}); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
        }

        map.setViewport(pointArray);    //调整视野
        if(list!=null&&list.length>0){
            addlabel(list)
        }
    });
}

function addlabel(list) {
    for (var i = 0; i < list.length; i++) {
        var point = new BMap.Point(list[i].lon,list[i].lat);
        var label = new BMap.Label("车牌号:["+list[i].carNo+"]",{offset:new BMap.Size(20,-10)});
        addMarker(point,label);
    }
}

function addMarker(point,label){
    myIcon = new BMap.Icon(baseURL + '/statics/images/car/car_green.png', new BMap.Size(26, 52));
    var marker = new BMap.Marker(point, {icon: myIcon});
    map.addOverlay(marker);
    marker.setLabel(label);
}
