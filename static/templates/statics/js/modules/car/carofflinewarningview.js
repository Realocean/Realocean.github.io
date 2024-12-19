$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var map;
var vm = new Vue({
    el: '#rrapp',
    data: {
        carOfflineWarning: {},
        address: '',
        //  map: null
    },
    created: function () {
        let _this = this;
        let param = parent.layer.boxParams.boxParams;
        _this.carOfflineWarning = param.data;
        console.log('param', param)
        if (_this.carOfflineWarning.provinceName != null && _this.carOfflineWarning.provinceName !== '') {
            _this.address = _this.carOfflineWarning.provinceName;
            if (_this.carOfflineWarning.cityName != null && _this.carOfflineWarning.cityName !== '') {
                _this.address = _this.address + '' + _this.carOfflineWarning.cityName;
                if (_this.carOfflineWarning.areaName != null && _this.carOfflineWarning.areaName !== '') {
                    _this.address = _this.address + '' + _this.carOfflineWarning.areaName;
                }
            }
        } else {
            _this.address = "西安市";
        }
    },
    updated: function () {
        layui.form.render();
    },
    mounted: function () {
        map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(116.403765, 39.914850), 5);
        map.enableScrollWheelZoom();
    }

});

function init(layui) {
    initClick();
    getBoundary(vm.address, vm.carOfflineWarning);
}


function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });
}

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function getBoundary(address = '西安', warningMap) {
    console.log('address, warningMap', address, warningMap);
    var bdary = new BMap.Boundary();
    console.log('bdary', bdary);

    if (map != null) {
        if ((warningMap.warningLon != null && warningMap.warningLon != '') && (warningMap.warningLat != null && warningMap.warningLat != '')) {
            let pointData = new BMap.Point(Number(warningMap.warningLon), Number(warningMap.warningLat));
            var gc = new BMap.Geocoder();
            gc.getLocation(pointData, function (rs) {
                var addComp = rs.addressComponents;
                if (addComp != null && addComp != '') {
                    let address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                    warningMap.address = address;
                    addlabel(warningMap)
                } else {
                    warningMap.address = '--';
                    addlabel(warningMap)
                }
            });
        }
    }
    return false;

    bdary.get(address, function (rs) { // 获取行政区域
        console.log('rs', rs)
        map.clearOverlays(); // 清除地图覆盖物
        var count = rs.boundaries.length; // 行政区域的点有多少个
        if (count === 0) {
            //alert('未能获取当前输入行政区域');
            return;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 2,
                strokeColor: "#014F99",
                fillColor: " #DDE4F0"
            }); // 建立多边形覆盖物
            map.addOverlay(ply); // 添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
        }
        map.setViewport(pointArray); // 调整视野

    });
}


function addlabel(warningMap) {
    if (warningMap.warningTime != null && warningMap.warningTime != '') {
        warningMap.warningTime = new Date(warningMap.warningTime).format('yyyy-MM-dd hh:mm:ss');
    } else {
        warningMap.warningTime = '--';
    }
    if (warningMap.address == null || warningMap.address == '') {
        warningMap.address = '--';
    }
    // 百度地图API功能
    var sContent = "<div>报警时间：" + warningMap.warningTime + "</div>" + "<div>报警地址：" + warningMap.address + "</div>";
    var point = new BMap.Point(Number(warningMap.warningLon), Number(warningMap.warningLat));
    var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
    map.openInfoWindow(infoWindow, point); // 开启信息窗口
    // document.getElementById("r-result").innerHTML = "信息窗口的内容是：<br />" + infoWindow.getContent();
    myIcon = new BMap.Icon(baseURL + '/statics/images/car/car_green.png', new BMap.Size(26, 52));
    var marker = new BMap.Marker(point, {
        icon: myIcon
    });
    map.addOverlay(marker);
    marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
}
