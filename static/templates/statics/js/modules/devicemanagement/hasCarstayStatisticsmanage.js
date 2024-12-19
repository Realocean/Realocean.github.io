var lushu;
$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form'], function () {
      layui.form.render();
  });
     //监听选择状态
    layui.form.on('select(signSelect)', function (data) {
      if(data.value){
        vm.q.sign = data.value;
      }else{
        vm.q.sign = '';
      }
      vm.timeFilter()
    });
});
var vm = new Vue({
    el: '#app',
    data: {
        isStretch: true,
        signList:[],
        carList:[],
        isEnable:false,
        dataType:0,
        //页面查询参数
        q: {
            deviceNo: null,
            deviceManufacturerNumber: null,
            trackStartTime: null,
            trackEndTime: null,
            sign:null,
            gpsAccountId:null
        },
        detail:{},
        //轨迹详情内容
        trackDetails: {},
        // 获取电子围栏
        fenceList:{
            administrativeAreaFenceList:[],
            keywordFenceList:[],
            existFenceFlag:false,
        },
        PointArr: [],
        endPointArr: [],
        //全局map
        map: null,
        //速度
        speed: 100,
        polyline: null,
        pathLocation: [], // 线路点
        //播放按钮状态控制
        repeatState: true,
        stopState: false,
        isPlay: false,
        //暂停
        suspend: false,
        longitude: 116.403925,
        latitude: 39.913903,
        //返回数据，起点终点
        startPoint: {},
        endPoint: {},
    },
    created() {
        debugger
        let getData = getQueryVariable("data")
        let gpsAccountId = getQueryVariable("gpsAccountId")
        this.q.gpsAccountId=gpsAccountId
        var base = new Base64();
        let query = base.decode(getData).replace(/(^\s*)|(\s*$)/g, "")
        let data = eval("("+query+")")
        this.q.deviceNo = data.deviceNo;
        this.q.deviceManufacturerNumber = data.deviceManufacturerNumber;
        this.detail = data;
        this.getFence();
    },
    mounted() {
        let _self = this;
        layui.use(['form', 'laydate'], function () {
            let from = layui.form,
                slider = layui.slider,
                laydate = layui.laydate;
            from.render();
            //开始时间
            layui.laydate.render({
                elem: '#trackStartTime',
                format: 'yyyy-MM-dd HH:mm:ss',
                type: 'datetime',
                trigger: 'click',
                done: function (value, date, endDate) {
                    vm.q.trackStartTime = value;
                    vm.timeFilter()
                }
            });
            //结束时间
            layui.laydate.render({
                elem: '#trackEndTime',
                format: 'yyyy-MM-dd HH:mm:ss',
                type: 'datetime',
                trigger: 'click',
                done: function (value, date, endDate) {
                    vm.q.trackEndTime = value;
                    vm.timeFilter()
                }
            });
            //回放速度设置
            slider.render({
                elem: '#slideTest1',
                min: 10,
                max: 1000
                , theme: "#3FACB3"
                , value: _self.speed //初始值
                , change: function (vals) {
                    _self.speed = vals;
                    console.log(" _self.speed:", _self.speed);
                }
            });
        })
        //初始化 -- 加载地图
        this.initMap();
        //初始化 -- 开始时间
        this.setTime();
        this.getSignList();
        this.getCarList()
        // this.onChangeSign()
    },
    watch: {
        q: {
            handler(val, oldVal) {
                let v = this;
                v.repeatState = true;
                v.isPlay = false; // 播放
                v.suspend = false; // 暂停
                v.stopState = false; // 停止

                if (val.trackStartTime == "" || val.trackEndTime == "") {
                    v.repeatState = true;
                    v.isPlay = false; // 播放
                    v.suspend = false; // 暂停
                    v.stopState = false; // 停止
                    v.map.removeOverlay(markerHalt);
                    v.clearMapMarker('polyline')
                }
            },
            deep: true,
            immediate:false
        },
        isEnable: {
            handler(val, oldVal) {
                if(val){
                    if(this.q.deviceNo&this.q.deviceNo!=''){
                        this.area()
                        this.searchBymPoint()
                    }else{
                        vm.isEnable = false;
                        $("#isEnable")[0].value = false;
                        layui.form.render();
                        alert('车辆信息不能为空！')
                    }
                }else{
                  this.clearMapMarker('polygon')
                }
            },
            deep: true,
            immediate:false
        },
        'q.sign': {
          handler(val, oldVal) {
            this.onChangeSign()
          },
          deep: true, //true 深度监听
          immediate:false
        }
    },
    filters: {
        valueData: function (value) {
            if (value == null || value == '' || value == undefined) {
                return '--';
            } else {
                return value;
            }
        },
        maximumSpeed: function (value) {
            if (value == null || value == '') {
                return '--';
            } else {
                return value + "/h";
            }
        },
        averageSpeed: function (value) {
            if (value == null || value == '') {
                return '--';
            } else {
                return value + "km/h";
            }
        },
        travelTime: function (value) {
            if (value == null || value == '') {
                return '--';
            } else {
                return value + "小时";
            }
        },
        totalMileage: function (value) {
            if (value == null || value == '') {
                return '--';
            } else {
                return value + "km";
            }
        }
    },

    methods: {
        // 实时追踪
        realTimeClick(){
            let _this = this;
            var base = new Base64();
            let item = _this.detail;
            const params = {}
            for(let key in item){   
              params[key] = item[key]?item[key]+'':''
            }
            let data = JSON.stringify(JSON.parse(JSON.stringify(params)))
            var result = base.encode(data); 
            window.open(tabBaseURL + "modules/devicemanagement/hasCarTrackStatisticsmanage.html?data="+result+"&gpsAccountId="+_this.q.gpsAccountId,"_self");
        },
        timeFilter(){
            let vm = this;
                let trackStartTime = new Date(vm.q.trackStartTime).format("yyyy-MM-dd hh:mm:ss");
                let trackEndTime = new Date(vm.q.trackEndTime).format("yyyy-MM-dd hh:mm:ss");
                // 开始时间
                let startData = new Date(trackStartTime.replace(/\-/g, "-"));
                // 结束时间
                let endData = new Date(trackEndTime.replace(/\-/g, "-"));
                let hours = (endData - startData) / (1000 * 3600);
                if (hours > 48) {
                    alert("结束时间与开始时间不能超过48小时");
                    return false;
                }
                if ((vm.q.trackStartTime == null || vm.q.trackStartTime == '') && (vm.q.trackEndTime == null || vm.q.trackEndTime == '')) {
                    vm.q.sign = null;
                    $("#sign")[0].value = null
                    layui.form.render('select');
                    alert("开始时间和结束时间不能为空");
                    return false;
                }
                if ((vm.q.trackStartTime == null || vm.q.trackStartTime == '') && (vm.q.trackEndTime != null || vm.q.trackEndTime != '')) {
                    vm.q.sign = null;
                    $("#sign")[0].value = null
                    layui.form.render('select');
                    alert("开始时间不能为空");
                    return false;
                }
                if ((vm.q.trackStartTime != null || vm.q.trackStartTime != '') && (vm.q.trackEndTime == null || vm.q.trackEndTime == '')) {
                    vm.q.sign = null;
                    $("#sign")[0].value = null
                    layui.form.render('select');
                    alert("结束时间不能为空");
                    return false;
                }
                if (vm.q.trackStartTime != null && vm.q.trackEndTime != null) {
                    if (vm.q.trackStartTime > vm.q.trackEndTime) {
                        alert("开始时间不能大于结束时间");
                        return false;
                    }
                }
                this.onChangeSign()
        },
      clearMapMarker(name){
        const allOverlays = this.map.getOverlays()
        if(name==='polyline'){
            for (let i = 0; i < allOverlays.length; i++) {
             if ((allOverlays[i].name && allOverlays[i].name === name)||!allOverlays[i].name) {
                this.map.removeOverlay(allOverlays[i])
              }
            }
        }else{
            for (let i = 0; i < allOverlays.length; i++) {
                if(name===allOverlays[i].name){
                    this.map.removeOverlay(allOverlays[i])
                }
            }
        }
      },
        addInfoWindow(marker,orginItem, item) {
        var html = [];
        html.push('<div>');
        html.push('<div class="infoItems" style="background:transparent !important;"><span>名称：</span><span>'+item.name+'</span></div>')
        html.push('<div class="infoItems" style="background:transparent !important;"><span>行政区域：</span><span>'+orginItem.areaName+'</span></div>')
        html.push('<div class="infoItems" style="background:transparent !important;"><span>具体地址：</span><span>'+item.address+'</span></div>')
        html.push('<div class="infoItems" style="background:transparent !important;"><span>联系电话：</span><span>'+item.telephone+'</span></div>')
        html.push('<div class="infoItems" style="background:transparent !important;"><span>报警类型：</span><span>'+orginItem.alarmSettings+'</span></div>')
        html.push('</div>');
        var opts = {
            width: 250, // 信息窗口宽度
            height: 150, // 信息窗口高度
            title: '', // 信息窗口标题
            enableMessage: true, //设置允许信息窗发送短息
        }
    
        var infoWindow = new BMap.InfoWindow(html.join(""), opts);
        var openInfoWinFun = function () {
            marker.openInfoWindow(infoWindow);
        };
        marker.addEventListener("click", openInfoWinFun);
        return openInfoWinFun;
        },
        addSignWindow(marker,item) {
            var html = [];
            html.push('<div>');
            html.push('<div class="infoItems" style="font-weight:700;">停车信息</div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>开始时间：</span><span>'+item.startTime||'--'+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>结束时间：</span><span>'+item.endTime||'--'+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>停留时间：</span><span>'+item.residenceTime ||'--'+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>经度/纬度：</span><span>'+Number(item.longitude||0).toFixed(6)+'/'+Number(item.latitude||0).toFixed(6)+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>地址：</span><span>'+ item.address || '--'+'</span></div>')
            html.push('</div>');
            var opts = {
                width: 260, // 信息窗口宽度
                height: 130, // 信息窗口高度
                title: '', // 信息窗口标题
                enableMessage: true, //设置允许信息窗发送短息
            }
        
            var infoWindow = new BMap.InfoWindow(html.join(""), opts);
            var openInfoWinFun = function () {
                marker.openInfoWindow(infoWindow);
            };
            marker.addEventListener("click", openInfoWinFun);
            return openInfoWinFun;
            },
        area(){
            let list = this.fenceList.administrativeAreaFenceList;
            list.map(item=>{
                this.polygonArr = []
                let boundary = new BMap.Boundary();
                boundary.get(item.administrativeAreaNameList.join(""), rs => {
                    if (rs.boundaries.length !== 0) {
                        for (let i = 0; i < rs.boundaries.length; i++) {
                            let ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeStyle: 'dashed',
                            strokeWeight: 2,   //边框宽度
                            strokeColor: "#CB7C93",   //边框颜色
                            fillOpacity: 0.1,
                            fillColor: " #3A2B5D" //填充颜色
                            }); //建立多边形覆盖物
                            ply.name = 'polygon'
                            this.polygonArr.push(ply)
                            this.map.addOverlay(ply);  //添加覆盖物
                        }
                    }
                })
            })
        },
        addCircle(mPoint,radius){
            this.map.enableScrollWheelZoom();
            var circle = new BMap.Circle(mPoint,radius,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
            circle.name = 'polygon'
            this.map.addOverlay(circle);
        },
        searchBymPoint() {
          let that = this;
          let list = that.fenceList.keywordFenceList;
          list.map(item=>{
            let key0 = item.keyWord
            let key1 = item.areaName
            let radius = item.radius
            $.ajax({
                type: "GET",
                dataType:'text',
                url: '/xz-admin-api/baidu/search?output=json&query=' + key0 + "&region="+ key1+"&ak=lOg1cACjgBWi6hmjj9L3KR4sATnuzfk3",
                success: function (r) {
                  let data = JSON.parse(r)
                  if(data.status==0){
                    data.results.map(i=>{
                      var point = new BMap.Point(i.location.lng, i.location.lat);
                      that.setFMarker(point,item,i)
                      that.addCircle(point,radius)
                    })
                  }else{
                    alert('获取数据失败')
                  }
                }
            });
          })
        },
        setMarker(position){
            let positionIcon = new BMap.Icon("./../../statics/images/mapMark.png", new BMap.Size(30, 30));
            positionIcon.setImageSize(new BMap.Size(30,30))
            let marker = new BMap.Marker(position, {
              icon: positionIcon,
              offset: new BMap.Size(0, -8),
            });
            marker.name = 'polygon';
            this.map.addOverlay(marker);
        },
        setSignMarker(position,item){
            let positionIcon = new BMap.Icon("./../../statics/images/sign.png", new BMap.Size(30, 30));
            positionIcon.setImageSize(new BMap.Size(30,30))
            let marker = new BMap.Marker(position, {
              icon: positionIcon,
              offset: new BMap.Size(0, -8),
            });
            let openInfoWinFun = this.addSignWindow(marker,item);
            openInfoWinFun();
            marker.name = 'sign';
            this.map.addOverlay(marker);
        },
        setFMarker(position,orginItem,item){
            let positionIcon = new BMap.Icon("./../../statics/images/mapMark.png", new BMap.Size(30, 30));
            positionIcon.setImageSize(new BMap.Size(30,30))
            let marker = new BMap.Marker(position, {
              icon: positionIcon,
              offset: new BMap.Size(0, -8),
            });
            marker.name = 'polygon';
            let openInfoWinFun = this.addInfoWindow(marker,orginItem,item);
            openInfoWinFun();
            this.map.addOverlay(marker);
        },
        removeMarker() {
            // 地图上所有的标注都会被获取
            let markers = this.map.getOverlays()
            // 保证最后一个是我们自己打的标注且只有一个标注点位
            if (markers.length > 0 && markers[markers.length - 1].DQ === 'Marker') {
              this.map.removeOverlay(markers[markers.length - 1])
            }
        },
        move() {
            layer.closeAll()
        },
        enter(){
            if(!this.fenceList.existFenceFlag){
                var content = this.fenceList.existFenceFlag?"":"当前设备未设置电子围栏";
                layer.tips(content, '#tips', {tips: 1});
            }
        },
        getFence(){
            let _this = this;
            $.ajax({
                type: "GET",
                sync: false,
                url: baseURL + `vehiclemonitor/electronicFence/${_this.q.deviceNo}`,
                success: function (r) {
                    if(r.data.existFenceFlag){
                        _this.fenceList = r.data
                    }
                }
            })
        },
        onChangeSign(){
            let _this = this;
            if (_this.q.deviceNo == null||_this.q.deviceNo == '') {
                _this.q.sign = null;
                $("#sign")[0].value = null
                layui.form.render('select');
                alert("车辆信息不能为空");
                return false;
            }
           
            $.ajax({
                type: "GET",
                sync: false,
                url: baseURL + `vehiclemonitor/trackPointList?deviceNo=${_this.q.deviceNo}&startTime=${_this.q.trackStartTime}&endTime=${_this.q.trackEndTime}&stayMark=${_this.q.sign}&gpsAccountId=${_this.q.gpsAccountId}`,
                success: function (r) {
                    _this.clearMapMarker('sign');
                    r.data.map(item=>{
                        var point = new BMap.Point(item.longitude,item.latitude);
                        _this.setSignMarker(point,item)
                    })
                    
                }
            })
        },
        // 设置速度
        changeSpeed(val) {
            this.map.removeOverlay(window.markerHalt)
            this.speed = val;
            this.startLushu()
        },
        getCarList(){
          var vm = this;
          $.ajax({
            type: "POST",
            sync: false,
            data: JSON.stringify({
                gpsDeviceStatus: 0,
                limit: 99999,
                page: 1,
                gpsAccountId:vm.q.gpsAccountId
            }),
            contentType: "application/json",
            url: baseURL + 'vehiclemonitor/carlist',
            success: function (r) {
                if (r.data && r.data.length > 0) {
                    let l = []
                     r.data.map(item=>{
                        item.deviceList.map(i=>{
                           l.push({
                                deviceNo: item.deviceNo,
                                carPlateNo:  item.carPlateNo,
                                deviceManufacturerNumber: i.deviceManufacturerNumber,
                            })
                        })
                    })
                    vm.carList = l
                    l.forEach((item, index) => {
                        $("#carSelect").append(`<option value=${item.deviceNo} data-deviceManufacturerNumber=${item.deviceManufacturerNumber}>${item.carPlateNo}(${item.deviceNo})</option>`);
                    })
                    layui.form.render('select');
                }
            }
         })
          
      },
        // 获取停留标记
        getSignList(){
            var vm = this;
            vm.signList = [
                {
                    id:'10',
                    name:'10分钟'
                },
                {
                    id:'15',
                    name:'15分钟'
                },
                {
                    id:'30',
                    name:'30分钟'
                },
                {
                    id:'45',
                    name:'45分钟'
                },
                {
                    id:'60',
                    name:'1小时'
                },
                {
                    id:'120',
                    name:'2小时'
                },
                {
                    id:'360',
                    name:'6小时'
                },
                {
                    id:'720',
                    name:'12小时'
                },
                {
                    id:'1440',
                    name:'24小时'
                },
            ];
            vm.signList.forEach((item, index) => {
                $("#sign").append(`<option value=${item.id}>${item.name}</option>`);
            })
            layui.form.render('select');
        },

        setTime() {
            //查询条件日期初始化赋值
            var start = new Date(new Date().toLocaleDateString()).format("yyyy-MM-dd hh:mm:ss");
            var end = new Date().format("yyyy-MM-dd hh:mm:ss");
            this.q.trackStartTime = start;
            this.q.trackEndTime = end;
        },

        stretch() {
            this.isStretch = !this.isStretch;
        },

        initMap() {
            // 百度地图API功能
            this.map = new BMap.Map("allmap");
            var point = new BMap.Point(this.longitude, this.latitude);
            this.map.centerAndZoom(point, 5);
            this.map.enableScrollWheelZoom();
            if (this.longitude && this.latitude) {
                //起点坐标
                let longitude = this.longitude;
                let latitude = this.latitude;
                let point = new BMap.Point(longitude, latitude);
                this.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                
            } else {
                // 根据经纬度显示地图的范围
                this.map.centerAndZoom("北京", this.config.zoom);
            }
        },

        startLushu() {
            // var fly = localStorage.getItem("car_icon");
            var fly = './../../statics/images/car_green.png';
            let speed = this.speed;
            let path = this.polyline.getPath();
            lushu = new BMapLib.LuShu(this.map, path, {
                icon: new BMap.Icon(fly, new BMap.Size(48, 48), {anchor: new BMap.Size(24, 24)}),
                autoView: true,
                speed: speed,
                enableRotation: true,
                landmarkPois: []
            });
            lushu.start();
        },
        // 车辆路线
        vehicleLines(locationArr) {
            if (locationArr.length > 0) {
                let map = this.map;
                this.polyline = new BMap.Polyline(locationArr, {
                    clip: false,
                    geodesic: true,
                    strokeWeight: 3
                });
                this.polyline.name = 'polyline'
                map.addOverlay(this.polyline);
                this.startLushu()
            }
        },
        //轨迹详情搜索方法
        search() {
            let fieldLocation = new Promise((resolve, resject) => {
                let v = this;
                if ((vm.q.trackStartTime == null || vm.q.trackStartTime == '') && (vm.q.trackEndTime == null || vm.q.trackEndTime == '')) {
                    alert("开始时间和结束时间不能为空");
                    return;
                }
                if ((vm.q.trackStartTime == null || vm.q.trackStartTime == '') && (vm.q.trackEndTime != null || vm.q.trackEndTime != '')) {
                    alert("开始时间不能为空");
                    return;
                }
                if ((vm.q.trackStartTime != null || vm.q.trackStartTime != '') && (vm.q.trackEndTime == null || vm.q.trackEndTime == '')) {
                    alert("结束时间不能为空");
                    return;
                }
                if (vm.q.trackStartTime != null && vm.q.trackEndTime != null) {
                    if (vm.q.trackStartTime > vm.q.trackEndTime) {
                        alert("开始时间不能大于结束时间");
                        return;
                    }
                }
                if (vm.q.deviceNo == null|| vm.q.deviceNo == '') {
                  alert("请选择车辆");
                  return;
                }
                let trackStartTime = new Date(vm.q.trackStartTime).format("yyyy-MM-dd hh:mm:ss");
                let trackEndTime = new Date(vm.q.trackEndTime).format("yyyy-MM-dd hh:mm:ss");
                // 开始时间
                let startData = new Date(trackStartTime.replace(/\-/g, "-"));
                // 结束时间
                let endData = new Date(trackEndTime.replace(/\-/g, "-"));
                let hours = (endData - startData) / (1000 * 3600);
                if (hours > 48) {
                    alert("结束时间与开始时间不能超过48小时");
                    return;
                }
                var arr = [];
                $.ajax({
                    type: "POST",
                    sync: false,
                    url: baseURL + 'vehiclemonitor/getTrack',
                    contentType: "application/json",
                    data: JSON.stringify({
                        trackStartTime: vm.q.trackStartTime,
                        trackEndTime: vm.q.trackEndTime,
                        deviceNo: vm.q.deviceNo, // 设备编号
                        deviceManufacturerNumber: vm.q.deviceManufacturerNumber,  // 设备厂商编号
                        gpsAccountId:vm.q.gpsAccountId
                    }),
                    success: function (r) {
                        let {code, trackPayback, msg} = r;
                        if (code === 0) {
                            if (trackPayback != null) {
                                //坐标点
                                let {trackPlayList, startLongitude, startLatitude, endLongitude, endLatitude, totalMileage} = trackPayback;
                                let point = new BMap.Point(startLongitude, startLatitude);
                                // v.map.clearOverlays();
                                vm.clearMapMarker('polyline')
                                v.map.centerAndZoom(point, 16);
                                //总里程
                                Vue.set(v.trackDetails, 'totalMileage', totalMileage);
                                //车辆起点坐标设置
                                if (startLongitude && startLatitude) {
                                    Vue.set(v.startPoint, 'lat', Number(startLatitude));
                                    Vue.set(v.startPoint, 'lng', Number(startLongitude));
                                }
                                v.PointArr = [];
                                v.PointArr.push(v.startPoint);

                                //车辆终点坐标设置
                                if (endLatitude && endLongitude) {
                                    Vue.set(v.endPoint, 'lat', Number(endLatitude));
                                    Vue.set(v.endPoint, 'lng', Number(endLongitude));
                                }
                                v.endPointArr = [];
                                v.endPointArr.push(v.endPoint);

                                //按钮设置
                                v.repeatState = false;
                                v.isPlay = false; // 播放
                                v.suspend = true; // 暂停
                                v.stopState = true; // 停止

                                //添加起点，终点标注
                                v.positionPoint();
                                trackPlayList.map((item, index) => {
                                    let location = new BMap.Point(item.lng, item.lat)
                                    arr.push(location)
                                })
                                resolve(arr)
                            } else {
                                alert("当前车辆暂无历史轨迹");
                                v.repeatState = true;
                                resject();
                                return;
                            }
                        } else {
                            alert(msg);
                        }
                    }
                });
            })

            fieldLocation.then(locationArr => {
                this.vehicleLines(locationArr)
            }).catch(() => {
            })

        },

        //坐标点转化方法
        dataConversion(trackPlaybackList) {
            if (trackPlaybackList != null && trackPlaybackList.length > 0) {
                let latLngList = [];
                for (let i = 0; i < trackPlaybackList.length; i++) {
                    let latLng = {};
                    latLng.lat = Number(trackPlaybackList[i].lat);
                    latLng.lng = Number(trackPlaybackList[i].lng)
                    latLngList.push(latLng);
                }
                return latLngList;
            }
        },

        //播放方法
        onPalay() {
            if (window.markerHalt) {
                this.map.removeOverlay(window.markerHalt); // 开始运动前清除停止位车辆
            }
            //点击播放查询数据
            this.search();
        },

        //播放
        play() {
            lushu.start();
            this.isPlay = false;
            this.stopState = true;
            this.repeatState = false;
            this.suspend = true;
        },

        //暂停
        onPause() {
            this.isPlay = true;
            this.stopState = true;
            this.repeatState = false;
            this.suspend = false;
            lushu.pause();
        },

        //停止
        clearAll() {
            this.repeatState = true;
            this.isPlay = false;
            //暂停
            this.suspend = false;
            this.stopState = false;
            if (lushu) {
                lushu.stop();
            }
            // this.map.clearOverlays();
            this.clearMapMarker('polyline')
        },
        //轨迹起点，终点绘制
        positionPoint() {
            console.log("起点坐标:", this.PointArr);
            //起点位置图标
            let startIcon = fileURL + 'carLocation/startlocation.png';
            //终点位置图标
            let endIcon = fileURL + 'carLocation/endlocation.png';

            //起点坐标
            if (this.PointArr.length > 0) {
                let longitude = this.PointArr[0].lng;
                let latitude = this.PointArr[0].lat;
                // this.carIcon(new BMap.Point(longitude, latitude), startIcon, this.map);
            }
            // 终点
            console.log("终点坐标:", this.endPointArr);
            if (this.endPointArr.length > 0) {
                let longitudeEnd = this.endPointArr[0].lng;
                let latitudeEnd = this.endPointArr[0].lat;
                // this.carIcon(new BMap.Point(longitudeEnd, latitudeEnd), endIcon, this.map)
            }
        },

        carIcon(point, car_icon, mapInit) {
            var myIcon = new BMap.Icon('./../../statics/images/car_green.png', new BMap.Size(52, 36), {});
            // 创建标注
            let marker = new BMap.Marker(point, {icon: myIcon});
            marker.name = 'polyline'
            this.map.addOverlay(marker);
        },


        // 日期补0
        appendZero(obj) {
            if (obj < 10) {
                return '0' + obj
            } else {
                return obj
            }
        },

        // 日期选择
        GetDateStr(AddDayCount) {
            let dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            let y = dd.getFullYear();
            let m = dd.getMonth() + 1;//获取当前月份的日期
            let d = dd.getDate();
            return y + "-" + this.appendZero(m) + "-" + this.appendZero(d);
        },
        GetEndDateStr() {
            let dd = new Date();
            let y = dd.getFullYear();
            let m = dd.getMonth() + 1;//获取当前月份的日期
            let d = dd.getDate();
            return y + "-" + this.appendZero(m) + "-" + this.appendZero(d);
        },
        GetMonday(type, dates) {
            var now = new Date();
            var nowTime = now.getTime();
            var day = now.getDay();
            var longTime = 24 * 60 * 60 * 1000;
            var n = longTime * 7 * (dates || 0);
            if (type == "s") {
              var dd = nowTime - (day - 1) * longTime + n;
            };
            if (type == "e") {
              var dd = nowTime + (7 - day) * longTime + n;
            };
            dd = new Date(dd);
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;
            var d = dd.getDate();
            m = m < 10 ? "0" + m: m;
            d = d < 10 ? "0" + d: d;
            var day = y + "-" + m + "-" + d;
            return day;
        },

        onDate(type) {
            this.dataType = type;
            if(type===-3){
                let curTime = this.GetMonday('s');
                let endTime = this.GetEndDateStr();
                let start = `${curTime} 00:00:00`;
                let end = `${endTime} 23:59:59`;
                this.q.trackStartTime = start;
                this.q.trackEndTime = end;
                console.log(this.q)
                this.clearAll()  // 清空数据
                this.search()
            }else if(type===0||type===-1||type===-2){
                let curTime = this.GetDateStr(type);
                let start = `${curTime} 00:00:00`;
                let end = `${curTime} 23:59:59`;
                this.q.trackStartTime = start;
                this.q.trackEndTime = end;
                console.log(this.q)
                this.clearAll()  // 清空数据
                this.search()
            }else{
                let curTime = this.GetDateStr(type);
                let endTime = this.GetEndDateStr();
                console.log(`curTime:${curTime}:00:00:00 - ${curTime}:23:59:59`);
                let start = `${curTime} 00:00:00`;
                let end = `${endTime} 23:59:59`;
                this.q.trackStartTime = start;
                this.q.trackEndTime = end;
                console.log(this.q)
                this.clearAll()  // 清空数据
                this.search()
            }
        },
    }
})

function Base64() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // 公共编码方法
    this.encode = function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = _utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
      }
      return output;
    }
  
    // 公共解码方法
    this.decode = function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = _utf8_decode(output);
      return output;
    }
  
    // UTF-8编码的私有方法
    _utf8_encode = function (string) {
    //   string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }
  
    // UTF-8解码的私有方法
    _utf8_decode = function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;
      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }
  }
  function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
    }