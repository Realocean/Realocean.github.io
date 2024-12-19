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
    layui.form.on('select(carSelect)', function (data) {
      if(data.value){
        var deviceManufacturerNumber = $(data.elem).find("option:selected").attr("data-deviceManufacturerNumber")
        var simCardNo = $(data.elem).find("option:selected").attr("data-simCardNo")
        var carPlateNo = $(data.elem).find("option:selected").attr("data-carPlateNo")
          vm.q.deviceNo = data.value;
          vm.q.deviceManufacturerNumber =deviceManufacturerNumber;
          vm.q.simCardNo =simCardNo;
          vm.q.carPlateNo =carPlateNo;
          vm.getFence()
      }else{
        vm.q.deviceNo = '';
      }
      vm.onChangeSign(vm.sign)
    });
     //监听选择状态
    layui.form.on('select(signSelect)', function (data) {
      if(data.value){
        vm.sign = data.value;
      }else{
        vm.sign = '';
      }
      vm.onChangeSign(vm.sign)
    });
});
var vm = new Vue({
    el: '#app',
    data: {
        isStretch: true,
        signList:[],
        carList:[],
        isEnable:false,
        sign:null,
        dataType:0,
        //页面查询参数
        q: {
            deviceNo: null,
            deviceManufacturerNumber: null,
            trackStartTime: null,
            trackEndTime: null,
            simCardNo: null,
            carPlateNo: null,
            gpsType:null,
            gpsAccountId:null
        },
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
this.getGpsTypeList()
    },
    mounted() {
        let _self = this;
        layui.use(['form', 'laydate'], function () {
            let from = layui.form,
                slider = layui.slider,
                laydate = layui.laydate;
            from.render();
            //gps厂商类型下拉
            layui.form.on('select(gpsTypeSelect)', function (data) {
                vm.q.gpsAccountId = data.value;
                if(vm.q.gpsAccountId!=null||vm.q.gpsAccountId!=""){
                    vm.getCarList(vm.q.gpsAccountId)
                }

            });
            //开始时间
            layui.laydate.render({
                elem: '#trackStartTime',
                format: 'yyyy-MM-dd HH:mm:ss',
                type: 'datetime',
                trigger: 'click',
                done: function (value, date, endDate) {
                    vm.q.trackStartTime = value;
                    vm.onChangeSign(vm.sign)
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
                    vm.onChangeSign(vm.sign)
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
        //this.getCarList()
    },
    watch: {
        // q: {
        //     handler(val, oldVal) {
        //         this.onChangeSign(this.sign)
        //     },
        //     deep: true,
        //     immediate:false
        // },
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
        // sign: {
        //   handler(val, oldVal) {
        //     this.onChangeSign(val)
        //   },
        //   deep: true, //true 深度监听
        //   immediate:false
        // }
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
        // 获取gps厂商类型
        getGpsTypeList() {
            $.ajax({
                type: "GET",
                sync: false,
                url: baseURL + 'car/tGpsAccount/tGpsTypeList',
                contentType: "application/json",
                data: {},
                success: function (r) {
                    if(r.code==0){
                        vm.gpsTypeList = r.list;
                        if (vm.gpsTypeList && vm.gpsTypeList.length > 0) {
                            vm.gpsTypeList.forEach((item, index) => {
                                $("#gpsTypeSelect").append(`<option value=${item.id}>${item.gpsTypeAndAccount}</option>`);
                            })
                            $("#gpsTypeSelect").val(vm.gpsTypeList[0].id)
                            vm.q.gpsAccountId=vm.gpsTypeList[0].id;
                        }

                        layui.form.render('select');
                        if(vm.gpsTypeList!=null&&vm.gpsTypeList.length>=1){
                            vm.getCarList(vm.gpsTypeList[0].id)
                        }
                    }
                }
            });


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
            html.push('<div class="infoItems" style="background:transparent !important;"><span>开始时间：</span><span>'+item.startTime||'--'+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>结束时间：</span><span>'+item.endTime||'--'+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>停留时间：</span><span>'+item.residenceTime ||'--'+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>经度/维度：</span><span>'+item.longitude+'/'+item.latitude+'</span></div>')
            html.push('<div class="infoItems" style="background:transparent !important;"><span>地址：</span><span>'+ item.address || '--'+'</span></div>')
            html.push('</div>');
            var opts = {
                width: 400, // 信息窗口宽度
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
                    }else{
                        alert('电子围栏不存在，请前往被配置中心设置！')
                    }
                    
                }
            })
        },
        onChangeSign(val){
            let vm = this;
            if (vm.q.deviceNo == null||vm.q.deviceNo == '') {
                vm.sign = null;
                $("#sign")[0].value = null
                layui.form.render('select');
                alert("车辆信息不能为空");
                return;
            }
            if ((vm.q.trackStartTime == null || vm.q.trackStartTime == '') && (vm.q.trackEndTime == null || vm.q.trackEndTime == '')) {
                vm.sign = null;
                $("#sign")[0].value = null
                layui.form.render('select');
                alert("开始时间和结束时间不能为空");
                return;
            }
            if ((vm.q.trackStartTime == null || vm.q.trackStartTime == '') && (vm.q.trackEndTime != null || vm.q.trackEndTime != '')) {
                vm.sign = null;
                $("#sign")[0].value = null
                layui.form.render('select');
                alert("开始时间不能为空");
                return;
            }
            if ((vm.q.trackStartTime != null || vm.q.trackStartTime != '') && (vm.q.trackEndTime == null || vm.q.trackEndTime == '')) {
                vm.sign = null;
                $("#sign")[0].value = null
                layui.form.render('select');
                alert("结束时间不能为空");
                return;
            }
            if (vm.q.trackStartTime != null && vm.q.trackEndTime != null) {
                if (vm.q.trackStartTime > vm.q.trackEndTime) {
                    alert("开始时间不能大于结束时间");
                    return;
                }
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
            $.ajax({
                type: "GET",
                sync: false,
                url: baseURL + `vehiclemonitor/trackPointList?deviceNo=${vm.q.deviceNo}&startTime=${vm.q.trackStartTime}&endTime=${vm.q.trackEndTime}&stayMark=${val}`,
                success: function (r) {
                    vm.clearMapMarker('sign');
                    r.data.map(item=>{
                        var point = new BMap.Point(item.longitude,item.latitude);
                        vm.setSignMarker(point,item)
                    })
                    
                }
            })
        },
        //获取父页面参数
        getParentData() {
            //加载地图
            this.initMap();
        },

        // 设置速度
        changeSpeed(val) {
            this.map.removeOverlay(window.markerHalt)
            this.speed = val;
            this.startLushu()
        },
        getCarList(gpsAccountId){
          var vm = this;
          if(vm.q.gpsAccountId!=null){
              gpsAccountId=vm.q.gpsAccountId
            }
          $.ajax({
            type: "POST",
            sync: false,
            data: JSON.stringify({
                gpsDeviceStatus: 0,
                limit: 99999,
                page: 1,
                gpsAccountId:gpsAccountId
            }),
            contentType: "application/json",
            url: baseURL + 'vehiclemonitor/carlist',
            success: function (r) {
                if (r.data && r.data.length > 0) {
                    let l = []
                     r.data.map(item=>{
                        item.deviceList.map(i=>{
                           l.push({
                                deviceNo: i.deviceNo,
                                carPlateNo:  item.carPlateNo,
                                deviceManufacturerNumber: i.deviceManufacturerNumber,
                                simCardNo: i.simCardNo,
                            })
                        })
                    })
                    vm.carList = l
                    document.getElementById("carSelect").options.length = 1;
                    vm.q.deviceNo = '';
                    vm.q.deviceManufacturerNumber ='';
                    vm.q.simCardNo ='';
                    vm.q.carPlateNo ='';
                    l.forEach((item, index) => {
                        $("#carSelect").append(`<option value=${item.deviceNo} data-deviceManufacturerNumber=${item.deviceManufacturerNumber} data-carPlateNo=${item.carPlateNo}
                        data-simCardNo=${item.simCardNo}>${item.carPlateNo}(${item.deviceNo})</option>`);
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

          if(vm.q.gpsAccountId==null||vm.q.gpsAccountId==""){
              alert("请选择厂商类型")
              return
          }
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