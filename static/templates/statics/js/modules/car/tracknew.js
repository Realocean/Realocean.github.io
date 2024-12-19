let config = {
    city: '', // 设置城市
    point: {
        longitude: '116.404',
        latitude: '39.915',
    },
    zoom: 15, // 地图级别,
    strokeColor: 'red'
}


var vm = new Vue({
    el: '#app',
    data: {
        isStretch: true,
        config: config,
        runMap: null,
        isLushu: 1,
        sliderVal: 50,
        lushu: null,
        q: {
            deviceNo: null,
            deviceManufacturerNumber: null,
            trackStartTime: null,
            trackEndTime: null,
        },
        trackDetails: {},
        map: null,
        //轨迹起点坐标点
        PointArr: [{
            lat: 36.10339957700999, lng: 120.4207801005104
        }],
        startPoint: {},
        endPoint: {},
        //轨迹终点坐标{
        endPointArr: [{
            lng: 120.44121529948468, lat: 36.1165533090833
        }],
        interval: null,// 行驶路线计时器
        intervalIndex: 0,
        //终点坐标展示的mark对象定义
        carMk: null,
        // 小车行驶图标
        drivingPoint: null,
        // 终点图标
        terminalPoint: null,
        //longitude: 120.4207801005104,
        //latitude: 36.10339957700999,
        //经度
        longitude: null,
        //纬度
        latitude: null,
        dataState: false,
        //播放按钮状态控制
        repeatState: true,
        stopState: false,
        isPlay: false,
        //暂停
        suspend: false,
        isEnd: 'product', // product   loca
        arr: [{lat: 36.10339957700999, lng: 120.4207801005104}],
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
                min: 0,
                step: 10,
                max: 100
                , theme: "#3FACB3"
                , value: _self.sliderVal //初始值
                , change: function (vals) {
                    _self.sliderVal = (100 - vals) * 10;
                    if (_self.sliderVal <= 100) {
                        _self.sliderVal = 100;
                    }
                }
            });
        })
        //页面初始化数据加载
        //this.initData();
        //初始化页面加载父页面数据 -- 加载地图
        this.getParentData();
    },
    watch:{
        q:{
            handler(val,oldVal){
                let v=this;
                v.repeatState = true;
                v.isPlay = false; // 播放
                v.suspend = false; // 暂停
                v.stopState = false; // 停止

                if(val.trackStartTime==""|| val.trackEndTime==""){
                    v.repeatState = true;
                    v.isPlay = false; // 播放
                    v.suspend = false; // 暂停
                    v.stopState = false; // 停止

                    clearInterval(v.interval);
                    v.interval = null;
                    v.map.removeOverlay(markerHalt);
                    v.map.clearOverlays(); // 清除地图所有
                    v.intervalIndex = 0;

                }
            },
            deep:true //true 深度监听
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
        //获取父页面参数
        getParentData() {
            var parentData = localStorage.getItem("point");
            console.log('parentData:', parentData);
            if (parentData != null) {
                let parent = JSON.parse(parentData);
                this.q.deviceNo = parent.deviceNo;
                this.q.deviceManufacturerNumber = parent.deviceManufacturerNumber;
                //获取上一个页面车辆所在经纬度
                this.longitude = Number(parent.longitude);
                this.latitude = Number(parent.latitude);
                //this.longitude = 120.4207801005104;
                //this.latitude = 36.10339957700999;

                //客户名称
                Vue.set(this.trackDetails, 'customerName', parent.customerName);
                //车牌号
                Vue.set(this.trackDetails, 'carNo', parent.carNo);

            }
            this.initTrack();
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

        //轨迹详情搜索方法
        search() {
            this.clearAll();
            return new Promise((resolve, resject) => {
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
                if (hours > 24) {
                    alert("结束时间与开始时间不能超过24小时");
                    return;
                }

                $.ajax({
                    type: "POST",
                    sync: false,
                    url: baseURL + 'monitorBasicInformation/getTrack',
                    contentType: "application/json",
                    data: JSON.stringify(vm.q),
                    success: function (r) {
                        console.log("调用轨迹查询方法返回结果:", r.trackPayback);
                        if (r.trackPayback != null) {
                            //坐标点
                            Vue.set(v.trackDetails, 'trackPlaybackList', v.dataConversion(r.trackPayback.trackPlayDTO));
                            //最大时速
                            Vue.set(v.trackDetails, 'maximumSpeed', r.trackPayback.maximumSpeed);
                            // 平均时速
                            Vue.set(v.trackDetails, 'averageSpeed', r.trackPayback.averageSpeed);
                            //行驶耗时
                            Vue.set(v.trackDetails, 'travelTime', r.trackPayback.travelTime);
                            //总里程
                            Vue.set(v.trackDetails, 'totalMileage', r.trackPayback.totalMileage);
                            //起点坐标
                            if (r.trackPayback.startLatitude != null && r.trackPayback.startLatitude != '') {
                                Vue.set(v.startPoint, 'lat', Number(r.trackPayback.startLatitude));
                            }
                            if (r.trackPayback.startLongitude != null && r.trackPayback.startLongitude != '') {
                                Vue.set(v.startPoint, 'lng', Number(r.trackPayback.startLongitude));
                            }

                            v.PointArr = [];
                            v.PointArr.push(v.startPoint);
                            console.log("车辆轨迹起点打印:", v.PointArr);
                            //终点坐标
                            if (r.trackPayback.endLatitude != null && r.trackPayback.endLatitude != '') {
                                Vue.set(v.endPoint, 'lat', Number(r.trackPayback.endLatitude));
                            }
                            if (r.trackPayback.endLongitude != null && r.trackPayback.endLongitude != '') {
                                Vue.set(v.endPoint, 'lng', Number(r.trackPayback.endLongitude));
                            }

                            v.endPointArr = [];
                            v.endPointArr.push(v.endPoint);

                            v.repeatState = false;
                            v.isPlay = false; // 播放
                            v.suspend = true; // 暂停
                            v.stopState = true; // 停止

                            console.log("车辆轨迹终点打印:", v.endPointArr);
                            console.log("v.trackDetails:", v.trackDetails);

                            resolve(r.trackPayback)
                        } else {
                             alert("当前车辆暂无历史轨迹");
                            //如果沒有数据的时候重新进行起点车位置
                            /*if (v.longitude && v.latitude) {
                                //起点坐标
                                let longitude = v.longitude;
                                let latitude = v.latitude;
                                let point = new BMap.Point(longitude, latitude);
                                v.map.centerAndZoom(point, v.config.zoom);// 根据经纬度显示地图的范围
                                v.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                                // 添加车辆标记
                                v.addStartMarker(new BMap.Point(longitude, latitude), '起点', v.map);

                            } else {
                                // 根据经纬度显示地图的范围
                                v.map.centerAndZoom("北京", v.config.zoom);
                            }*/
                            v.repeatState = true;
                            if (v.isEnd === 'loca') {
                                v.isPlay = false; // 播放
                                v.suspend = true; // 暂停
                                v.stopState = true // 停止
                            }
                            resject('');
                            return;
                        }
                    }
                });
            })
        },

        /**
         * 初始化地图
         *
         * */
        initTrack() {
            this.map = new BMap.Map("container");
            this.map.enableScrollWheelZoom(); // 开启鼠标滚轮缩放
            console.log('this.longitude - initTrack:', this.longitude);
            console.log('this.latitude - initTrack :', this.latitude);
            if (this.longitude && this.latitude) {
                //起点坐标
                let longitude = this.longitude;
                let latitude = this.latitude;
                let point = new BMap.Point(longitude, latitude);
                this.map.centerAndZoom(point, this.config.zoom);// 根据经纬度显示地图的范围
                this.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                // 添加车辆标记
                this.addStartMarker(new BMap.Point(longitude, latitude), '起点', this.map);

            } else {
                // 根据经纬度显示地图的范围
                this.map.centerAndZoom("北京", this.config.zoom);
            }
        },

        // 绘制位置 起,终点
        positionPoint() {
            console.log("this.PointArr", this.PointArr);
            let startIcon = fileURL + 'carLocation/startlocation.png';
            let endIcon = fileURL + 'carLocation/endlocation.png';
            if (this.PointArr.length > 0) {
                //起点坐标
                let longitude = this.PointArr[0].lng;
                let latitude = this.PointArr[0].lat;
                this.carIcon(new BMap.Point(longitude, latitude), startIcon, this.map);
            }
            if (this.endPointArr.length > 0) {
                //起点坐标
                // 终点
                let longitudeEnd = this.endPointArr[0].lng;
                let latitudeEnd = this.endPointArr[0].lat;
                this.carIcon(new BMap.Point(longitudeEnd, latitudeEnd), endIcon, this.map)
            }
        },

        // 暂停
        onPause() {
            if (this.intervalIndex == 0) return false;
            clearInterval(this.interval);
            this.interval = null;
            this.isPlay = true;
            this.stopState = true;
            this.repeatState = false;
            this.suspend = false;
            // this.intervalIndex = 0;
        },
        //重启
        play() {

            // setTimeout(this.setPosition2, 500)
            if(this.isEnd==='loca'){
                this.setPosition2();
            }else{
                this.setPosition();
            }
            this.isPlay = false;
            this.stopState = true;
            this.repeatState = false;
            this.suspend = true;
        },

        onPalay() {
            // 1. 请求数据  3. 添加起点，终点，划线   4. 播放
            this.search().then(() => {
                this.positionPoint();
                this.setPosition()
            }).catch((e) => {
                if(this.isEnd==='loca'){
                    this.positionPoint();
                    this.setPosition2();
                }
            })
        },

        // 清除
        clearAll() {
            clearInterval(this.interval);
            this.interval = null;
            this.map.removeOverlay(markerHalt);
            this.map.clearOverlays(); // 清除地图所有
            this.intervalIndex = 0;
         // this.longitude = 0;
         // this.latitude = 0;
            this.repeatState = true;
            this.isPlay = false;
            //暂停
            this.suspend = false;
            this.stopState = false;

            // product   loca
            if (this.isEnd === 'product') {
                this.PointArr = [];
            } else {
                this.arr = [{lat: 36.10339957700999, lng: 120.4207801005104}]
            }
            // window.location.reload();
        },

        carIcon(point, car_icon, mapInit) {
            var myIcon = new BMap.Icon(car_icon, new BMap.Size(52, 36), {});
            // 创建标注
            window.marker = new BMap.Marker(point, {icon: myIcon});
            // 将标注添加到地图中
            mapInit.addOverlay(marker);

        },

        // 动态获取位置并划线  --  // 播放
        setPosition() {
            let _self = this;
            if (window.markerHalt) {
                this.map.removeOverlay(markerHalt); // 开始运动前清除停止位车辆
            }

            let data = this.trackDetails.trackPlaybackList;
            if(data.length >0){
                var pointLocationArray=[];
                for (var i = 0; i < data.length; i++) {
                    pointLocationArray.push(new BMap.Point(data[i].lng, data[i].lat));
                }
                var view = this.map.getViewport(pointLocationArray);
                var mapZoom = view.zoom;
                var centerPoint = view.center;
                this.map.centerAndZoom(centerPoint,mapZoom);
            }
            if (!this.interval) {
                this.interval = setInterval(function () {
                    if (_self.intervalIndex >= data.length) {
                        clearInterval(_self.interval);
                        _self.interval = null;
                        return;
                    }
                    _self.drowLine(_self.map, data[_self.intervalIndex], data[_self.intervalIndex + 1]);//画线调用
                    _self.intervalIndex = _self.intervalIndex + 1;

                }, _self.sliderVal || 1000);
            }
        },

        setPosition2() {
            let _self = this;
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
                {lng: 120.44121529948468, lat: 36.1165533090833}];
            // let data = this.trackDetails.trackPlaybackList;
            if (window.markerHalt) {
                this.map.removeOverlay(markerHalt); // 开始运动前清除停止位车辆
            }
            console.log('开启', this.intervalIndex, _self.arr.length)
            this.interval = setInterval(function () {
                if (_self.intervalIndex >= _self.arr.length) {
                    clearInterval(this.interval);
                    console.log('清除了 -- ', _self.intervalIndex)
                    return;
                }
                console.log('快走 -- ', _self.intervalIndex)
                // _self.drowLine(_self.map,data[i],data[i+1]);//画线调用
                _self.intervalIndex = _self.intervalIndex + 1;
                if (!data[_self.intervalIndex]) {
                    clearInterval(this.interval);
                }
                _self.arr.push(data[_self.intervalIndex]);
                console.log(_self.intervalIndex)
                _self.drowLine(_self.map, _self.arr[_self.intervalIndex - 1], _self.arr[_self.intervalIndex]);//画线调用
            }, 100);
        },

        // 划线
        drowLine(map, PointArr, PointArrNext) {
            var latitude = PointArr.lat;
            var longitude = PointArr.lng;

            if (PointArrNext != undefined) {
                let nextLatitude = PointArrNext.lat;
                let nextLongitude = PointArrNext.lng;
                var polyline = new BMap.Polyline(
                    [
                        new BMap.Point(longitude, latitude),
                        new BMap.Point(nextLongitude, nextLatitude)
                    ],
                    {
                        strokeColor: this.config.strokeColor,
                        strokeWeight: 7,
                        strokeOpacity: 1
                    });   //创建折线
                map.addOverlay(polyline);
                this.addMarkerEnd(new BMap.Point(nextLongitude, nextLatitude), '小车行驶', this.map, PointArrNext, new BMap.Point(longitude, latitude));//添加图标
            } else {
                this.addMarkerEnd(new BMap.Point(longitude, latitude), '终点', this.map);//添加终点图标
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

        //添加行驶和终点图标
        addMarkerEnd(point, name, mapInit, trackUnit, prePoint) {
            let car_icon = localStorage.getItem("car_icon");
            if (name == "小车行驶") {
                if (this.carMk) {//先判断第一次进来的时候这个值有没有定义，有的话就清除掉上一次的。然后在进行画图标。第一次进来时候没有定义也就不走这块，直接进行画图标
                    mapInit.removeOverlay(this.carMk);
                }
                var myIcon = new BMap.Icon(car_icon, new BMap.Size(52, 26), {});
                this.carMk = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                this.carMk.setRotation(trackUnit.route);//trackUnit.route
                this.carMk.setRotation(this.getAngle(point, prePoint) - 90);// 旋转的角度
                mapInit.addOverlay(this.carMk);               // 将标注添加到地图中
                //carMk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            } else {
                // 终点停止计时
                this.onPause();
                this.intervalIndex = 0;

                this.isPlay = true;
                this.stopState = false;
                this.repeatState = false;
                this.suspend = false;
            }
        },

        //获得角度的函数
        getAngle(n, next) {
            var ret
            var w1 = n.lat / 180 * Math.PI;
            var j1 = n.lng / 180 * Math.PI;

            var w2 = next.lat / 180 * Math.PI;
            var j2 = next.lng / 180 * Math.PI;

            ret = 4 * Math.pow(Math.sin((w1 - w2) / 2), 2) - Math.pow(Math.sin((j1 - j2) / 2) * (Math.cos(w1) - Math.cos(w2)), 2);
            ret = Math.sqrt(ret);

            var temp = Math.sin((j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
            ret = ret / temp;

            ret = Math.atan(ret) / Math.PI * 180;
            ret += 90;

            // 这里用如此臃肿的if..else是为了判定追踪单个点的具体情况,从而调整ret的值
            if (j1 - j2 < 0) {
                if (w1 - w2 < 0) {
                    ret;
                } else {
                    ret = -ret + 180;
                }
            } else {
                if (w1 - w2 < 0) {
                    ret = 180 + ret;
                } else {
                    ret = -ret;
                }
            }
            return ret;
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
        }

    }
})



