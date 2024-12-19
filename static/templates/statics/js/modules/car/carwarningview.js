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
        electricFence: {},
        address: '',
        map: null
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.electricFence = param.data;
        _this.map = param.map;
        if (_this.electricFence.provinceName != null && _this.electricFence.provinceName !== '') {
            _this.address = _this.electricFence.provinceName;
            if (_this.electricFence.cityName != null && _this.electricFence.cityName !== '') {
                _this.address = _this.address + '' + _this.electricFence.cityName;
                if (_this.electricFence.areaName != null && _this.electricFence.areaName !== '') {
                    _this.address = _this.address + '' + _this.electricFence.areaName;
                }
            }
        } else {
            _this.address = "陕西省西安市";
        }
        
    },
    updated: function(){
        layui.form.render();
    },
    mounted : function() {
        map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(116.403765, 39.914850), 5);
        map.enableScrollWheelZoom();
    },

});

function init(layui) {
    initClick();
    initData();
}

function initData() {
    getBoundary(vm.address, vm.map);
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}


function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
function getBoundary(address, warningMap) {
    var bdary = new BMap.Boundary();
    bdary.get(address, function(rs) { // 获取行政区域
        map.clearOverlays(); // 清除地图覆盖物
        var count = rs.boundaries.length; // 行政区域的点有多少个
        if (count === 0) {
            //alert('未能获取当前输入行政区域');
            return;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight : 2,
                strokeColor : "#014F99",
                fillColor: " #DDE4F0"
            }); // 建立多边形覆盖物
            map.addOverlay(ply); // 添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
        }
        map.setViewport(pointArray); // 调整视野
        if (map != null) {
            //通过经纬度解析位置信息
            if((warningMap.warningLon !=null && warningMap.warningLon!='')&&(warningMap.warningLat !=null && warningMap.warningLat!='')){
                let  pointData = new BMap.Point(Number(warningMap.warningLon),Number(warningMap.warningLat));
                var gc = new BMap.Geocoder();
                gc.getLocation(pointData, function(rs){
                    var addComp = rs.addressComponents;
                    if(addComp!=null && addComp!=''){
                        let address=addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                        warningMap.address=address;
                        addlabel(warningMap)
                    }else{
                        warningMap.address='--';
                        addlabel(warningMap)
                    }
                });
            }
        }
    });
}


function addlabel(warningMap) {
    if (warningMap.warningTime != null && warningMap.warningTime != '') {
        warningMap.warningTime = new Date(warningMap.warningTime).format('yyyy-MM-dd hh:mm:ss');
    } else {
        warningMap.warningTime = '--';
    }
    //报警类型（1.驶入报警 2.驶出报警）
    let warningTypeStr='--';
    if (warningMap.warningType != null && warningMap.warningType != '') {
         if(warningMap.warningType==2){
             warningTypeStr='驶出报警';
         }else if(warningMap.warningType==1){
             warningTypeStr='驶入报警';
         }
    }

    // 百度地图API功能
    var sContent = "<div>报警时间：" + warningMap.warningTime + "</div><div>报警类型："+warningTypeStr+"</div><div>报警地址：" + warningMap.address + "</div>";
    var point = new BMap.Point(Number(warningMap.warningLon), Number(warningMap.warningLat));
    var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
    map.openInfoWindow(infoWindow, point); // 开启信息窗口
    //document.getElementById("r-result").innerHTML = "信息窗口的内容是：<br />" + infoWindow.getContent();
    var myIcon = new BMap.Icon(baseURL + '/statics/images/car/car_green.png', new BMap.Size(26, 52));
    var marker = new BMap.Marker(point, {
        icon : myIcon
    });
    map.addOverlay(marker);
    marker.addEventListener("click", function(){
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    });
}
