var lushu;
var vm = new Vue({
    el: '#app',
    data: {
        isStretch: true,
        signList:[],
        isEnable:false,
        sign:'',
        dataType:0,
        //页面查询参数
        q: {
            deviceNo: null,
            deviceManufacturerNumber: null,
            trackStartTime: null,
            trackEndTime: null,
        },
        //轨迹详情内容
        trackDetails: {},
        // 获取电子围栏
        fenceList:{},
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
        longitude: 0,
        latitude: 0,
        //返回数据，起点终点
        startPoint: {},
        endPoint: {},
    },
    created() {

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
        //初始化页面加载父页面数据 -- 加载地图
        this.getParentData();
        this.getSignList();
        this.getFence()
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

                    // clearInterval(v.interval);
                    // v.interval = null;
                    v.map.removeOverlay(markerHalt);
                    v.map.clearOverlays(); // 清除地图所有
                    //  v.intervalIndex = 0;

                }
            },
            deep: true //true 深度监听
        },
        isEnable: {
            handler(val, oldVal) {
                if(val){
                    this.area(['四川省','成都市','武侯区'])
                }else{
                    this.getParentData()
                }
                console.log(val)
            },
            deep: true, //true 深度监听
            immediate:false
        },
        sign: {
            handler(val) {
               this.onChangeSign(val)
            },
            deep: true //true 深度监听
        },
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
        area(districtNames){
            this.polygonArr = []
            let boundary = new BMap.Boundary();
            boundary.get(districtNames.join(""), rs => {
                if (rs.boundaries.length !== 0) {
                    for (let i = 0; i < rs.boundaries.length; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeStyle: 'dashed',
                        strokeWeight: 2,   //边框宽度
                        strokeColor: "#CB7C93",   //边框颜色
                        fillOpacity: 0.1,
                        fillColor: " #3A2B5D" //填充颜色
                        }); //建立多边形覆盖物
                        this.polygonArr.push(ply)
                        this.map.addOverlay(ply);  //添加覆盖物
                    }
                }
            })
        },
        addCircle(mPoint,circleSize){
            this.map.enableScrollWheelZoom();
            this.map.centerAndZoom(mPoint,15);
            var circle = new BMap.Circle(mPoint,circleSize,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
            this.map.addOverlay(circle);
        },
        searchBymPoint(myKeys) {
            let that = this;
            var local = new BMap.LocalSearch(that.map, {
                renderOptions:{map: that.map}, //展现结果的地图实例。当指定参数map后，搜索结果的标注、线路等均会自动添加到此地图上
                pageCapacity:200, //设置每页容量，取值范围：1 - 100，对于多关键字检索，容量表示每个关键字的数量，如果有2个关键字，则实际检索结果数量范围为：2 - 200
                //onSearchComplete 检索完成后的回调函数。 参数：results: LocalResult或Array 如果是多关键字检索，回调函数参数返回一个LocalResult的数组，数组中的结果顺序和检索中多关键字数组中顺序一致
                onSearchComplete: function(results){
                    results[1].Yr&&results[1].Yr.map(item=>{
                        that.setMarker(item.point)
                        that.addCircle(item.point,1000)
                    })
                    local.clearResults(); //清除最近一次检索的结果
                }
            });
            local.searchInBounds(myKeys,that.map.getBounds());
        },
        setMarker(position){
            this.removeMarker()
            let positionIcon = new BMap.Icon("./../../statics/images/mapMark.png", new BMap.Size(30, 30));
            positionIcon.setImageSize(new BMap.Size(30,30))
            let marker = new BMap.Marker(position, {
              icon: positionIcon,
              offset: new BMap.Size(0, -8),
            });
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
            var content = !this.fenceList.hasFence?"展示并悬浮文字说明围栏报警类型":"当前设备未设置电子围栏";
            layer.tips(content, '#tips', {tips: 1});
        },
        getFence(){
            this.fenceList = {
                // 行政区域电子围栏
                area:[
                    {name:['四川省','成都市','武侯区'],cityCode:[61,6101,610113]},
                ],
                // 关键字围栏
                keywords:[],
                hasFence:false
            }

        },
        onChangeSign(val){
            let list = [{
               lat: 30.59648,
               lng: 104.058565,
               startTime:'2023-05-04 12:18:17',
               endTime:'2023-05-05 12:18:17',
               time:'24小时0分钟0秒',
               address:'上海 上海市 宝山区'
            }]
            list.map(item=>{
                var point = new BMap.Point(item.lat, item.lng);
                that.setMarker(point)
            })
            console.log(val)
        },
        //获取父页面参数
        getParentData() {
            var parentData = localStorage.getItem("point");
            console.log('parentData:', parentData);
            if (parentData != null) {
                let {deviceInfo} = JSON.parse(parentData);
                if (deviceInfo) {
                    this.q.deviceNo = deviceInfo.deviceNo;
                    this.q.deviceManufacturerNumber = deviceInfo.deviceManufacturerNumber;
                    //获取上一个页面车辆所在经纬度
                    this.longitude = Number(deviceInfo.longitude);
                    this.latitude = Number(deviceInfo.latitude);
                }
            }

            this.setTime();
            //加载地图
            this.initMap();
        },

        // 设置速度
        changeSpeed(val) {
            // this.map.clearOverlays();
            this.map.removeOverlay(window.markerHalt)
            this.speed = val;
            this.startLushu()
        },
        // 获取停留标记
        getSignList(){
            var vm = this;
            vm.signList = [
                {
                    id:'1',
                    name:'10分钟'
                },
                {
                    id:'2',
                    name:'15分钟'
                }
            ];
            if (vm.signList && vm.signList.length > 0) {
                vm.signList.forEach((item, index) => {
                    $("#signSelect").append(`<option value=${item.id}>${item.name}</option>`);
                })
            }
            layui.form.render('select');
        },

        setTime() {
            //查询条件日期初始化赋值
            var start = new Date(new Date().toLocaleDateString()).format("yyyy-MM-dd hh:mm:ss");
            //var  end=new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).format("yyyy-MM-dd hh:mm:ss");
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
            this.map.centerAndZoom(point, 15);
            this.map.enableScrollWheelZoom();
            console.log(this.longitude, this.latitude);
            if (this.longitude && this.latitude) {
                //起点坐标
                let longitude = this.longitude;
                let latitude = this.latitude;
                let point = new BMap.Point(longitude, latitude);
                // this.map.centerAndZoom(point, this.config.zoom);// 根据经纬度显示地图的范围
                this.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                // 添加车辆标记
                this.addStartMarker(point, '起点', this.map);

            } else {
                // 根据经纬度显示地图的范围
                this.map.centerAndZoom("北京", this.config.zoom);
            }
            this.searchBymPoint(['四川省成都市武侯区','医院'])
        },

        startLushu() {
            var fly = localStorage.getItem("car_icon");
            //var fly = 'data:image/png;base64,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';
            let speed = this.speed;
            let path = this.polyline.getPath();
            lushu = new BMapLib.LuShu(this.map, path, {/*
                geodesic: true,
                autoCenter: true,*/
                icon: new BMap.Icon(fly, new BMap.Size(48, 48), {anchor: new BMap.Size(24, 24)}),
                // speed: speed,
                // autoView: true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                // enableRotation: true

                // defaultContent: "从北京到天津",//"从天安门到百度大厦"
                autoView: true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                // icon: new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png',
                //     new BMap.Size(52, 26),
                //     {anchor: new BMap.Size(27, 13)}),
                speed: speed,
                enableRotation: true,//是否设置marker随着道路的走向进行旋转
                landmarkPois: []
            });
            lushu.start();
            // setTimeout('lushu.start()', 3000);
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
                let trackStartTime = new Date(vm.q.trackStartTime).format("yyyy-MM-dd hh:mm:ss");
                let trackEndTime = new Date(vm.q.trackEndTime).format("yyyy-MM-dd hh:mm:ss");
                // 开始时间
                let startData = new Date(trackStartTime.replace(/\-/g, "-"));
                // 结束时间
                let endData = new Date(trackEndTime.replace(/\-/g, "-"));
                let hours = (endData - startData) / (1000 * 3600);
                // if (hours > 24) {
                //     alert("结束时间与开始时间不能超过24小时");
                //     return;
                // }
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
                        deviceManufacturerNumber: vm.q.deviceManufacturerNumber  // 设备厂商编号
                    }),
                    success: function (r) {
                        let {code, trackPayback, msg} = r;
                        if (code === 0) {
                            if (trackPayback != null) {
                                //坐标点
                                // Vue.set(v.trackDetails, 'trackPlaybackList', v.dataConversion(trackPlayDTO));
                                let {trackPlayList, startLongitude, startLatitude, endLongitude, endLatitude, totalMileage} = trackPayback;
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

        //添加起始图标
        addStartMarker(point, name, mapInit) {
            if (name == "起点") {
                let car_icon = localStorage.getItem("car_icon");
                var myIcon = new BMap.Icon(car_icon, new BMap.Size(52, 26), {});
                window.markerHalt = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                mapInit.addOverlay(markerHalt);               // 将标注添加到地图中
            }
        },

        //播放方法
        onPalay() {

            if (window.markerHalt) {
                this.map.removeOverlay(window.markerHalt); // 开始运动前清除停止位车辆
            }
            // this.getCarLocation();
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
            this.map.clearOverlays();

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
                this.carIcon(new BMap.Point(longitude, latitude), startIcon, this.map);
            }
            // 终点
            console.log("终点坐标:", this.endPointArr);
            if (this.endPointArr.length > 0) {
                let longitudeEnd = this.endPointArr[0].lng;
                let latitudeEnd = this.endPointArr[0].lat;
                this.carIcon(new BMap.Point(longitudeEnd, latitudeEnd), endIcon, this.map)
            }
        },

        carIcon(point, car_icon, mapInit) {
            var myIcon = new BMap.Icon(car_icon, new BMap.Size(52, 36), {});
            // 创建标注
            window.marker = new BMap.Marker(point, {icon: myIcon});
            // 将标注添加到地图中
            mapInit.addOverlay(marker);

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

        //本地测试使用数据
        getCarLocation() {
            let data = [
                {lat: 36.10339957700999, lng: 120.4207801005104},
                {lat: 36.10349055332635, lng: 120.42113539348455},
                {lat: 36.10370795896673, lng: 120.42162977768736},
                {lat: 36.10411490190429, lng: 120.42166901055167},
                {lat: 36.104232027406695, lng: 120.42185015059275},
                {lat: 36.10425620255758, lng: 120.42202022562539},
                {lat: 36.104265908631284, lng: 120.42208225102176},
                {lat: 36.104399968669526, lng: 120.42187425183421},
                {lat: 36.10452708476511, lng: 120.42076268466177},
                {lat: 36.10480132817409, lng: 120.4196557913201},
                {lat: 36.10560773716036, lng: 120.418951386886},
                {lat: 36.10621159088823, lng: 120.41900182905378},
                {lat: 36.1064641068988, lng: 120.41992809616544},
                {lat: 36.10679444086644, lng: 120.42102125032955},
                {lat: 36.107010189089046, lng: 120.42182982905027},
                {lat: 36.107014665948654, lng: 120.42193587265254},
                {lng: 120.42201589513277, lat: 36.10700627324672},
                {lng: 120.42201589513277, lat: 36.10700627324672},
                {lng: 120.42236704579075, lat: 36.10708566579729},
                {lng: 120.42269817692573, lat: 36.107201270041955},
                {lng: 120.42239277578172, lat: 36.10812797579566},
                {lng: 120.42175457671763, lat: 36.10947659586882},
                {lng: 120.42144906678747, lat: 36.11028554037044},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.4213722360578, lat: 36.110547069787465},
                {lng: 120.42134433787885, lat: 36.110691285540966},
                {lng: 120.42234193234574, lat: 36.110931417305515},
                {lng: 120.42374305054953, lat: 36.11109804633305},
                {lng: 120.42478859440246, lat: 36.111102173671576},
                {lng: 120.42606467439863, lat: 36.11129314178323},
                {lng: 120.4274220550685, lat: 36.11148065963647},
                {lng: 120.42831965719076, lat: 36.111638311669736},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42839951065358, lat: 36.11164240198062},
                {lng: 120.42869196887202, lat: 36.1116737914188},
                {lng: 120.43031048017785, lat: 36.11190642360766},
                {lng: 120.43239173942534, lat: 36.11229570404404},
                {lng: 120.43368467575368, lat: 36.11281195352835},
                {lng: 120.43371757862009, lat: 36.11284016439977},
                {lng: 120.43379230066179, lat: 36.11284161798212},
                {lng: 120.43441423254144, lat: 36.113205746094536},
                {lng: 120.43549342023326, lat: 36.11391074053337},
                {lng: 120.43637497341942, lat: 36.11441797319607},
                {lng: 120.4365024200745, lat: 36.11445405475196},
                {lng: 120.43670459776231, lat: 36.11458083085174},
                {lng: 120.43745246924915, lat: 36.11507070008782},
                {lng: 120.43821097991501, lat: 36.115416050767585},
                {lng: 120.43821097991501, lat: 36.115416050767585},
                {lng: 120.43821097991501, lat: 36.115416050767585},
                {lng: 120.43821097991501, lat: 36.115416050767585},
                {lng: 120.43821097991501, lat: 36.115416050767585},
                {lng: 120.43823585473245, lat: 36.11541929557907},
                {lng: 120.43823585473245, lat: 36.11541929557907},
                {lng: 120.43823585473245, lat: 36.11541929557907},
                {lng: 120.43823585473245, lat: 36.11541929557907},
                {lng: 120.43823585473245, lat: 36.11541929557907},
                {lng: 120.43823585473245, lat: 36.11541929557907},
                {lng: 120.43823585473245, lat: 36.11541929557907},
                {lng: 120.43859812511984, lat: 36.115583971494395},
                {lng: 120.43901701857004, lat: 36.115714318017346},
                {lng: 120.43928467292172, lat: 36.11582517772885},
                {lng: 120.43959708522435, lat: 36.115963587312805},
                {lng: 120.43986466921422, lat: 36.116047547858166},
                {lng: 120.44007952157578, lat: 36.11611896447754},
                {lng: 120.440167025596, lat: 36.11612294605039},
                {lng: 120.440167025596, lat: 36.11612294605039},
                {lng: 120.44024360205321, lat: 36.116138815526504},
                {lng: 120.44024360205321, lat: 36.116138815526504},
                {lng: 120.44024360205321, lat: 36.116138815526504},
                {lng: 120.44026150723737, lat: 36.11614702160796},
                {lng: 120.44027344364953, lat: 36.11615215895656},
                {lng: 120.44027344364953, lat: 36.11615215895656},
                {lng: 120.44028836484941, lat: 36.1161593311561},
                {lng: 120.44034209724579, lat: 36.116201960713745},
                {lng: 120.44048233691922, lat: 36.116254585044935},
                {lng: 120.44048233691922, lat: 36.116254585044935},
                {lng: 120.4405738257871, lat: 36.116276646228826},
                {lng: 120.44073595695149, lat: 36.11635856195875},
                {lng: 120.44115463412841, lat: 36.11652357056175},
                {lng: 120.44118546544034, lat: 36.11653994619434},
                {lng: 120.44118546544034, lat: 36.11653994619434},
                {lng: 120.44121529948468, lat: 36.1165533090833}
            ];
            let v = this;
            //起点坐标
            // {lat: 36.10339957700999, lng: 120.4207801005104},
            Vue.set(v.startPoint, 'lat', 36.10339957700999);
            Vue.set(v.startPoint, 'lng', 120.4207801005104);
            v.PointArr = [];
            v.PointArr.push(v.startPoint);

            //车辆终点坐标设置
            //{lng: 120.44121529948468, lat: 36.1165533090833}
            Vue.set(v.endPoint, 'lat', 36.1165533090833);
            Vue.set(v.endPoint, 'lng', 120.44121529948468);
            v.endPointArr = [];
            v.endPointArr.push(v.endPoint);


            let arr = []
            let fieldLocation = new Promise((resolve, reject) => {
                data.map((item, index) => {
                    let location = new BMap.Point(item.lng, item.lat)
                    arr.push(location)
                })
                resolve(arr);
            })
            fieldLocation.then(locationArr => {
                this.positionPoint();
                this.vehicleLines(locationArr)
            })
        },
    }
})