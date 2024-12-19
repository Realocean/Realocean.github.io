let config = {
    city: '', // 设置城市
    point: {
        longitude: '116.404',
        latitude: '39.915',
    },
    zoom: 15, // 地图级别,
}

var vm=new Vue({
    el: '#app',
    data: {
        isStretch: true,
        config: config,
        runMap: null,   //
        isLushu: 1,
        sliderVal: 20,
        lushu: null,
        q:{
            deviceNo:null,
            deviceManufacturerNumber:null,
            trackStartTime:null,
            trackEndTime:null,
        },
        trackDetails:{},
    },
    created(){
        this.getParentData();
    },
    mounted() {
        this.$refs.map.removeOverlay();
        // this.track();
        // this.line();
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
                     
                    vm.q.trackStartTime= value;
                }
            });
            //结束时间
            layui.laydate.render({
                elem: '#trackEndTime',
                format: 'yyyy-MM-dd HH:mm:ss',
                type: 'datetime',
                trigger: 'click',
                done: function (value, date, endDate) {
                     
                    vm.q.trackEndTime= value;

                }
            });

            slider.render({
                elem: '#slideTest1',
                min:10,
                max:250
                ,theme:"#3FACB3"
                , value: _self.sliderVal //初始值
                , change: function (vals) {
                    _self.sliderVal = vals;
                }
            });
        })
        this.vehicleRun();
        this.getTrack();
    },
    methods: {
        //获取轨迹
        getTrack(){
            let v=this;
            let parentData=JSON.parse(localStorage.getItem("point"));
            //客户名称
            Vue.set(v.trackDetails, 'customerName', parentData.customerName);
            //车牌号
            Vue.set(v.trackDetails, 'carNo', parentData.carNo);

            $.ajax({
                type: "POST",
                sync:false,
                url: baseURL + '/monitorBasicInformation/getTrack',
                contentType: "application/json",
                data: JSON.stringify(v.q),
                success: function(r){

                }
           });
        },
        getParentData(){
            //获取父页面参数
            var parentData=localStorage.getItem("point");
            if(parentData!=null){
                //this.q = JSON.parse(parentData);
                this.q.deviceNo=JSON.parse(parentData).deviceNo;
                this.q.deviceManufacturerNumber=JSON.parse(parentData).deviceManufacturerNumber;
            }

        },
        stretch() {
            this.isStretch = !this.isStretch;
        },
        serch(){
            if(vm.q.trackStartTime==null || vm.q.trackEndTime ==null){
                alert("开始时间和结束时间不能为空");
                return;
            }
            if(vm.q.trackStartTime!=null && vm.q.trackEndTime !=null){
                if(vm.q.trackStartTime>vm.q.trackEndTime){
                    alert("开始时间不能大于结束时间");
                    return;
                }
                if(vm.q.trackEndTime < vm.q.trackStartTime){
                    alert("结束时间不能小于开始时间");
                    return;
                }
            }
            $.ajax({
                type: "POST",
                sync:false,
                url: baseURL + 'monitorBasicInformation/getTrack',
                contentType: "application/json",
                data: JSON.stringify(vm.q),
                success: function(r){

                }
            });

        },
        // 标记当前车辆的位置
        track() {
            let point = localStorage.getItem('point');
            if (!point) return;
            let data = JSON.parse(point)
            this.$refs.map.setMarker(data);
        },

        // 设置起点到终点的路线
        line() {
            var myP1 = new BMap.Point(116.380967, 39.913285);    //起点
            var myP2 = new BMap.Point(116.424374, 39.914668);    //终点
            var myIcon = new BMap.Icon(baseURL + '/statics/images/map/Online_90.png', new BMap.Size(32, 70), {    //小车图片
                //offset: new BMap.Size(0, -5),    //相当于CSS精灵
                imageOffset: new BMap.Size(0, 0)    //图片的偏
            })
            var driving2 = new BMap.DrivingRoute(map, {renderOptions: {map: map, autoViewport: true}});    //驾车实例
            driving2.search(myP1, myP2)
        },

        // 单点沿线运行
        start() {
            let {myIcon, myP1, myP2, map} = this.runMap;
            // map.clearOverlays();  // 清除所有覆盖物
            this.$refs.map.run(myIcon, myP1, myP2);
        },

        // 获取参数
        run(e) {
            this.runMap = e;
        },

        /**
         *   路书运动轨迹
         *   事件绑定
         *     1. 运行
         *     2. 停止
         *     3. 暂停
         **/
        vehicleRun() {
            let _self = this;
            let {map} = _self.runMap;
            let lushu;
            // 实例化一个驾车导航用来生成路线
            let drv = new BMap.DrivingRoute('北京', {
                onSearchComplete: function (res) {
                    // 定位成功
                    if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                        var plan = res.getPlan(0);  // 返回索引指定的方案。索引0表示第一条方案
                        var arrPois = [];
                        // plan.getNumRoutes() 返回方案包含的线路的个数
                        for (var j = 0; j < plan.getNumRoutes(); j++) {
                            // 返回方案中索引指定的线路。索引0表示第一条线路
                            var route = plan.getRoute(j);
                            arrPois = arrPois.concat(route.getPath());
                        }
                        // 使用浏览器的矢量制图工具（如果可用）在地图上绘制折线的地图叠加层。
                        // transparent
                        map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: 'red'}));
                        map.setViewport(arrPois);

                        _self.lushu = new BMapLib.LuShu(map, arrPois, {
                            defaultContent: "",//"从天安门到百度大厦"
                            autoView: false,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                            icon: new BMap.Icon(baseURL + '/statics/images/map/Online_90.png', new BMap.Size(52, 26), {anchor: new BMap.Size(27, 13)}),
                            speed: _self.sliderVal,
                            enableRotation: true,//是否设置marker随着道路的走向进行旋转
                            landmarkPois: [
                                {lng: 116.314782, lat: 39.913508, html: '加油站', pauseTime: 2},
                                {
                                    lng: 116.315391,
                                    lat: 39.964429,
                                    html: '高速公路收费<div><img src="//map.baidu.com/img/logo-map.gif"/></div>',
                                    pauseTime: 3
                                },
                                {lng: 116.381476, lat: 39.974073, html: '肯德基早餐', pauseTime: 2}
                            ]
                        });
                    }
                },
            });

            // var longitude = vehicles[i].longitude.split(',');
            // var latitude = vehicles[i].latitude.split(',');
            // var start = new BMap.Point(longitude[0], longitude[1]);
            // var end = new BMap.Point(latitude[0], latitude[1]);
            // drv.search(start, end);

            var myP1 = new BMap.Point(116.380967, 39.913285);    //起点
            var myP2 = new BMap.Point(116.424374, 39.914668);    //终点


            drv.search(myP1, myP2);
            setTimeout(function () {
                _self.lushu.start();
            }, 1000);

            map.addEventListener('click', _self.setlushuSpeed);

            // function startlushu(e) {
            //     if (!!e.overlay) {
            //         var markerId = _self.lushu._marker.ba;
            //         if (e.overlay.ba == markerId) {
            //             alert('你点击了高铁，速度即将变快');
            //             _self.lushu._opts.speed = _self.lushu._opts.speed + 2000;
            //         }
            //     }
            // }
        },
        setlushuSpeed(e) {
            let _self = this;
            if (!!e.overlay) {
                var markerId = _self.lushu._marker.ba;
                if (e.overlay.ba == markerId) {
                    _self.lushu._opts.speed = _self.sliderVal;
                }
            }
        },

        // 开始
        playback() {
            this.isLushu = 1;
            this.lushu.start()
        },

        // 暂停
        pause() {
            this.isLushu = 2;
            this.lushu.pause();
        },

        // 停止
        stop() {
            this.lushu.stop()
        },

        temp() {
            window.close();
        }
    }
})