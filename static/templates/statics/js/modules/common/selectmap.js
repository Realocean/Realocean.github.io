$(function () {
    vm.initMap();
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {

        },
        sysDept:{}
    },
    computed: function () {},
    updated: function () {
        layui.form.render();
    },
    methods: {
        cancel:function(){
            var longitude = $("#lng").val();
            var latitude = $("#lat").val();
            if(longitude =="" && latitude ==""){
                $("#lng").val("");
                $("#lat").val("");
                vm.sysDept.longitude = "";
                vm.sysDept.latitude = "";
                parent.vm.sysDept = Object.assign({}, parent.vm.sysDept,vm.sysDept);
            } else {
                var longitude = window.localStorage.getItem("longitude");
                var latitude = window.localStorage.getItem("latitude");
                if(longitude == "" && latitude == ""){
                    vm.sysDept.longitude = "";
                    vm.sysDept.latitude = "";
                    parent.vm.sysDept = Object.assign({}, parent.vm.sysDept,vm.sysDept);
                }
            }
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },

        initMap:function() {
            var longitude = window.localStorage.getItem("longitude");
            var latitude = window.localStorage.getItem("latitude");
            var contactAddress = window.localStorage.getItem("contactAddress");
            var map = new BMapGL.Map('container'); // 创建Map实例
            if(longitude != "" && latitude != ""){
                $("#lng").val(longitude);
                $("#lat").val(latitude);
                map.centerAndZoom(new BMapGL.Point(longitude, latitude), 12); // 初始化地图,设置中心点坐标和地图级别
                var point = new BMapGL.Point(longitude, latitude);
                var marker = new BMapGL.Marker(point);  // 创建标注
                map.addOverlay(marker);
                if(contactAddress != ""){
                    $("#address").val(contactAddress);
                    $("#getAddress").val(contactAddress);
                } else {
                    $("#address").val("");
                    $("#getAddress").val("");
                }

                //地图标注
                map.addEventListener('click', function(e) {
                    map.clearOverlays();//添加标注前清空以前的所有标注
                    $("#lng").val(e.latlng.lng);
                    $("#lat").val(e.latlng.lat);
                    var point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
                    var marker = new BMapGL.Marker(point);  // 创建标注
                    map.addOverlay(marker);

                    // 获取地址
                    var myGeo = new BMapGL.Geocoder();
                    myGeo.getLocation(point, function(rs){
                        $("#getAddress").val(rs.address);
                    });
                });
            } else {
                map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

                //地图标注
                map.addEventListener('click', function(e) {
                    map.clearOverlays();//添加标注前清空以前的所有标注
                    $("#lng").val(e.latlng.lng);
                    $("#lat").val(e.latlng.lat);
                    var point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
                    var marker = new BMapGL.Marker(point);  // 创建标注
                    map.addOverlay(marker);

                    // 获取地址
                    var myGeo = new BMapGL.Geocoder();
                    myGeo.getLocation(point, function(rs){
                        $("#getAddress").val(rs.address);
                    });
                });
            }

        },

        // 根据地址搜索
        search:function(){
            var keyword = $("#address").val();
            if(keyword == ""){
                alert("请输入搜索地址！");
                var map = new BMapGL.Map('container'); // 创建Map实例
                map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
                var longitude = $("#lng").val();
                var latitude = $("#lat").val();
                if(longitude =="" && latitude ==""){
                    $("#lng").val("");
                    $("#lat").val("");
                }

                //地图标注
                map.addEventListener('click', function(e) {
                    map.clearOverlays();//添加标注前清空以前的所有标注
                    $("#lng").val(e.latlng.lng);
                    $("#lat").val(e.latlng.lat);
                    var point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
                    var marker = new BMapGL.Marker(point);  // 创建标注
                    map.addOverlay(marker);

                    var myGeo = new BMapGL.Geocoder();
                    myGeo.getLocation(point, function(rs){
                        $("#getAddress").val(rs.address);
                    });
                });
            } else {
                var map = new BMapGL.Map('container'); // 创建Map实例
                map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
                map.clearOverlays();//清空原来的标注

                // 执行搜索
                var localSearch = new BMapGL.LocalSearch(map);
                localSearch.enableAutoViewport(); //允许自动调节窗体大小
                localSearch.setSearchCompleteCallback(function (searchResult) {
                    var poi = searchResult.getPoi(0);
                    $("#lng").val(poi.point.lng);
                    $("#lat").val(poi.point.lat);
                    map.centerAndZoom(poi.point, 12);
                    var marker = new BMapGL.Marker(poi.point);  // 创建标注，为要查询的地址对应的经纬度
                    map.addOverlay(marker);

                    var point = new BMapGL.Point(poi.point.lng,poi.point.lat);
                    var myGeo = new BMapGL.Geocoder();
                    myGeo.getLocation(point, function(rs){
                        $("#getAddress").val(rs.address);
                    });
                });
                localSearch.search(keyword);

                //地图标注
                map.addEventListener('click', function(e) {
                    map.clearOverlays();//添加标注前清空以前的所有标注
                    $("#lng").val(e.latlng.lng);
                    $("#lat").val(e.latlng.lat);
                    var point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
                    var marker = new BMapGL.Marker(point);  // 创建标注
                    map.addOverlay(marker);

                    var myGeo = new BMapGL.Geocoder();
                    myGeo.getLocation(point, function(rs){
                        $("#getAddress").val(rs.address);
                    });
                });
            }
        },

        // 保存
        save:function(){
            var longitude = $("#lng").val();
            var latitude = $("#lat").val();
            var address = $("#getAddress").val();
            vm.sysDept.longitude = longitude;
            vm.sysDept.latitude = latitude;
            vm.sysDept.contactAddress = address;
            parent.vm.sysDept = Object.assign({}, parent.vm.sysDept,vm.sysDept);
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
    }
});

