let enterpriseAll = null;
let vMap = null;
let extendComponent = null;
const PeriodDiv = Vue.extend({
    template: `<div class="car-details__box">
                 <div> 
                     <div class="car-details__container">
                        <div class="car-details__title">基本信息</div>
                        <div class="PeriodDiv-car-info">
                            <p class="car-details__item">
                                <span >车牌号：</span>
                                <span style="color: #3FACB3;cursor: pointer" @click="carList(data.carInfo.carNo)">{{data.carInfo.carNo | valueData}}</span> 
                            </p>
                            <p class="car-details__item"><span class=" ">车架号：</span>{{data.carInfo.vinNo | valueData}}</p>
                            <p class="car-details__item"><span class=" ">品牌/车型/车系：</span>
                                 {{data.carInfo.brandName | valueData}}
                                 {{data.carInfo.seriesName | valueData}}
                                 {{data.carInfo.modelName | valueData}}
                            </p>
                            <p class="car-details__item"><span class=" ">车辆状态：</span>{{data.carInfo.carStatusStr | valueData}}</p>
        <!--                    <p class="car-details__item"><span class=" ">GPS状态：</span>{{this.data.deviceStatusShow | valueData}}</p>-->
                           <!-- <p><span class="periodDiv-label">当前定位状态：</span>已定位</p>-->
                            <p class="car-details__item"><span class=" ">行驶里程数：</span>{{data.carInfo.sumOdograph | useMileage }}</p>
                        </div>
                    </div>
                     <div class="car-details__container" v-if="this.data.deviceInfo">
                        <div class="car-details__title">设备信息</div>
                        <div class="PeriodDiv-car-info">
                             <p class="car-details__item"><span class=" ">设备编号：</span>{{data.deviceInfo.deviceNo | valueData}}</p>
<!--                             <p class="car-details__item"><span class=" ">订单编号：</span>{{data.deviceInfo.deviceManufacturerNumber | valueData}}</p>-->
                             <p class="car-details__item"><span class=" ">状态：</span>{{data.deviceInfo.deviceStatusStr | valueData}}</p>
                             <p class="car-details__inner"><span class=" ">最近定位系统时间：</span>{{data.deviceInfo.timeReported | valueData}}</p>
                            <p class="locationAddress car-details__inner"><span class=" ">最近定位位置：</span>
                              <span style="display: inline-block;width: 300px">{{data.deviceInfo.addrDetail | valueData}}</span>
                            </p>
                            <p class="locationAddress car-details__inner"><span class=" ">报警信息：</span>
                              <span style="display: inline-block;width: 300px">{{data.deviceInfo.alarmType | '--'}}</span>
                            </p>
                        </div>
                     </div>
                     <div class="car-details__container" v-if="this.data.orderInfo !=null && this.data.orderInfo.orderCarCode !=''">
                        <div class="car-details__title">租赁信息</div>
                        <div class="PeriodDiv-car-info" >
                            <p class="car-details__item"><span class=" ">客户名称：</span>{{data.orderInfo.customerName | valueData}}</p>
                            <p class="car-details__item"><span class=" ">车辆用途：</span>{{data.orderInfo.rentTypeStr | valueData}}</p>
                            <p class="car-details__inner">
                                <span >订单编号：</span>
                                <sapn style="color: #3FACB3;cursor: pointer" @click="orderlistnew(data.orderInfo.orderCarCode)">{{data.orderInfo.orderCarCode | valueData}}</sapn>  
                                </p>
                            <p class="car-details__inner"><span class=" ">联系电话：</span>{{data.orderInfo.customerTel | valueData}}</p>
                            <p class="car-details__inner"><span class=" ">租期：</span>
                                    {{data.orderInfo.timeStartRent | valueData}}至
                                    {{data.orderInfo.timeFinishRent | valueData}}
                            </p>
                        </div>
                     </div>
                 </div>
                 <div class="text-center" style="margin-bottom: 10px">
<!--                    <button class="layui-btn search-btn" @click="seeTrack">查看轨迹</button>-->
<!--                    <button class="layui-btn search-btn" @click="closeInfo">关闭</button>-->
<!--                    <button class="layui-btn search-btn" @click="sendInstructions(rentDate)">发送指令</button>-->
                    <span class="car-details__btn pointer" @click="seeTrack">查看轨迹</span>
<!--                    <span class="car-details__btn pointer" @click="closeInfo">关闭</span>-->
<!--                    <span class="car-details__btn pointer" @click="carTrace">追踪</span>-->
                    <span class="car-details__btn pointer" @click="sendInstructions(data)">发送指令</span>
                </div>
            </div>`,
    props: ['data', 'send', 'vehiclePosition'],
    computed: {
        rentDate: function () {
            if ((this.data.timeStartRent != null && this.data.timeStartRent != '')
                && (this.data.timeFinishRent != null && this.data.timeFinishRent != '')) {
                return this.data.timeStartRent + "至" + this.data.timeFinishRent;
            } else {
                return '--';
            }
        },
        /*addrDetail:function(){
            if((this.data.longitude !=null &&this.data.longitude!='')&&(this.data.latitude !=null &&this.data.latitude!='')){
                var point = new BMap.Point(Number(this.data.longitude),Number(this.data.latitude));
                var gc = new BMap.Geocoder();
                gc.getLocation(point, function(rs){
                    var addComp = rs.addressComponents;
                    let address=addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                    return address;
                });
            }
        }*/
    },
    filters: {
        valueData: function (value) {
            if (value == null || value == '' || value == undefined) {
                return '--';
            } else {
                return value;
            }
        },
        useMileage: function (value) {
            if (value == null || value == '') {
                return '--';
            } else {
                return value + "KM";
            }
        },
        currentDayMileage: function (value) {
            if (value == null || value == '') {
                return '--';
            } else {
                return value + "KM";
            }
        },
    },
    methods: {

        // lockGPS() {
        //     $.ajax({
        //         type: "POST",
        //         sync: false,
        //         url: baseURL + 'monitorBasicInformation/lockGPS',
        //         contentType: "application/json",
        //         data: JSON.stringify({
        //             'deviceNo': this.data.deviceInfo.deviceNo,
        //             'deviceManufacturerNumber': this.data.deviceInfo.deviceManufacturerNumber
        //         }),
        //         success: (r) => {
        //             if (r.code == '0') {
        //                 alert("关闭动力成功");
        //             } else {
        //                 alert("关闭动力失败");
        //             }
        //         }
        //     });
        // },
        // unLockGPS() {
        //     $.ajax({
        //         type: "POST",
        //         sync: false,
        //         url: baseURL + 'monitorBasicInformation/unLockGPS',
        //         contentType: "application/json",
        //         data: JSON.stringify({
        //             'deviceNo': this.data.deviceInfo.deviceNo,
        //             'deviceManufacturerNumber': this.data.deviceInfo.deviceManufacturerNumber
        //         }),
        //         success: (r) => {
        //             if (r.code == '0') {
        //                 alert("开启动力成功");
        //             } else {
        //                 alert("开启动力失败");
        //             }
        //         }
        //     });
        // },
        //弹出页面查看轨迹跳转页面
        seeTrack() {
            //let open = window.open(tabBaseURL + "modules/car/tracknew.html");
            let open = window.open(tabBaseURL + "modules/car/cartrack.html");
            localStorage.setItem('point', JSON.stringify(this.data))
        },
        // 关闭
        closeInfo() {
            let info = enterpriseAll.infoWindow;
            info.close();
            localStorage.setItem("clickData", null);
        },

        // 发送指令
        sendInstructions(rentDate) {
            console.log('发送指令', rentDate);
            let info = enterpriseAll.infoWindow;
            info.close();
            this.send({
                rentDate: rentDate
            })
        },

        // 追踪
        carTrace() {
            this.vehiclePosition()
        },

        // 跳转车辆列表
        carList(carNo) {
            console.log(' 跳转车辆列表')
            localStorage.setItem('carNo', carNo)
            top.parent.window.larryTab.tabAdd({
                title: '车辆列表',
                href: tabBaseURL + 'xz-admin/modules/car/tcarbasic.html',
                id: 'larry-530'
            })
        },

        // 订单列表
        orderlistnew(orderCarCode) {
            console.log(' 跳转订单列表')
            /*localStorage.setItem('businessNo', orderCarCode)
            top.parent.window.larryTab.tabAdd({
                title: '订单列表',
                href: tabBaseURL + 'xz-admin/modules/order/orderlistnew.html',
                id: 'larry-562'
            })*/
        }
    }
})


vMap = Vue.component('vMap', {
    template: `<div id="map">
                    <!--<div class="info">最新版GL地图命名空间为BMapGL, 可按住鼠标右键控制地图旋转、修改倾斜角度。</div>-->
                <div id="container"></div>
              </div>
            `,
    props: {
        mapPoint: {
            type: String,
            default: '1'
        },
        config: {
            type: Object,
            default: function () {
                return null
            }
        },
        mapTrack: {
            type: Number,
            default: 0,
        },
        pointList: {
            type: Array,
            default: function () {
                return []
            }
        },
        centerZoom: {
            type: Boolean,
            default: true,
        }
    },

    watch: {
        mapPoint(n) {
            this.isCenter = n
        },
        pointList(n) {
            if (n.length < 0) return false;
            this.point = n;
            this.addMarker2();
        },
    },

    data() {
        return {
            map: null,
            infoWindow: null,
            isCenter: '1',
            isStop: true,
            point: [],
            //车辆基本信息数据源
            detailsInfor: {},
            singleMarker: null
        }
    },

    mounted() {
        enterpriseAll = this;
        /*this.init();*/
    },


    methods: {
        // 初始化地图
        init(callback) {
            this.map = new BMap.Map('container'); // 创建Map实例
            if (this.isCenter === '1') {
                if (this.point != undefined && this.point != null && this.point.length > 0) {
                    let point = vm.point;
                    var pointLocationArray = [];
                    if (point.length > 0) {
                        for (var i = 0; i < point.length; i++) {
                            pointLocationArray.push(new BMap.Point(point[i].longitude, point[i].latitude));
                        }
                    }
                    var view = this.map.getViewport(pointLocationArray);
                    var mapZoom = view.zoom;
                    var centerPoint = view.center;
                    this.map.centerAndZoom(centerPoint, mapZoom);
                } else {
                    console.log('this.config ********', this.config);
                    let point = new BMap.Point(this.config.point.longitude, this.config.point.latitude);
                    console.log(point);
                    this.map.centerAndZoom(point, this.config.zoom); // 初始化地图,设置中心点坐标和地图级别
                }
            } else {
                this.map.centerAndZoom('北京', 10); // 初始化地图,设置中心点坐标和地图级别
            }
            this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

            typeof callback === 'function' && callback(this.map);
        },
        centerAndZoom(point,mapZoom) {
            // 重新设置车辆地图坐标
            this.map.centerAndZoom(new BMap.Point(point[0], point[1]), mapZoom); 
        },

        // 添加标记点
        addMarker() {
            //删除覆盖物
            let point = this.point;
            // let clickData = localStorage.getItem("clickData");
            // let allOverlay = this.map.getOverlays(); 获取当前地图上的所有覆盖物，返回覆盖物对象的集合
            // if (allOverlay.length > 0) {
            //     for (let i = 0; i <= allOverlay.length - 1; i++) {
            //         if (clickData != null && clickData != '' && clickData != 'null') {
            //             let pointData = JSON.parse(clickData);
            //             try {
            //                 if (allOverlay[i] && allOverlay[i].getLabel().content != pointData.plateNO) {
            //                     this.map.removeOverlay(allOverlay[i]);
            //                 }
            //             } catch (error) {
            //             }
            //         } else {
            //             this.map.removeOverlay(allOverlay[i]);
            //         }
            //     }
            // }
            let pointLocationArray = [];
            if (point.length > 0) {
                for (var i = 0; i < point.length; i++) {
                    // if (clickData != null && clickData != '' && clickData != 'null') {
                    //     let pointData = JSON.parse(clickData);
                    //     if (point[i].carId == pointData.carId) {
                    //         point.slice(i, 1);
                    //     }
                    // }

                    pointLocationArray.push(new BMap.Point(point[i].longitude, point[i].latitude))
                    var view = this.map.getViewport(pointLocationArray);
                    var mapZoom = view.zoom;
                    var centerPoint = view.center;
                    this.map.centerAndZoom(centerPoint, mapZoom);

                    this.setMarker(point[i]);
                }
            }
        },


        // 添加多个标记点
        addMarker2() {
            //删除覆盖物
            let point = this.point;
            let getOverlays = this.map.getOverlays();


            if (getOverlays.length > 0) {
                let points = []
                for (let i in getOverlays) {
                    if (getOverlays[i].isVisible()) {
                        points.push(getOverlays[i]);
                    }
                }
                points.map(item => {
                    let mapMarker = item.getLabel().content;
                    point.map(car => {
                        if (mapMarker == car.carPlateNo) {
                            item.setPosition(new BMap.Point(car.longitude, car.latitude))
                        }
                    })
                })
                console.log('设置位置')
            } else {
                this.removeOverlay();
                console.log('创建小车')
                if (point.length > 0) {
                    let pointLocationArray = point.map(item => {
                        let point = new BMap.Point(item.longitude, item.latitude);
                        let MyCar = null;
                        let marker = null;
                        if (item.icon) {
                            MyCar = new BMap.Icon(item.icon, new BMap.Size(52, 26));
                            marker = new BMap.Marker(point, {
                                icon: MyCar
                            });
                        } else {
                            console.log('默认图标')
                            marker = new BMap.Marker(point);
                        }
                        this.createMarker(marker, item);
                        return point
                    });
                    console.log('this.centerZoom', this.centerZoom);
                    if (this.centerZoom) {
                        // console.log(pointLocationArray);
                        var view = this.map.getViewport(pointLocationArray);
                        var mapZoom = view.zoom;
                        var centerPoint = view.center;
                        this.map.centerAndZoom(centerPoint, mapZoom);
                    }
                }
            }
        },

        clearMarker() {
            this.singleMarker = null;
        },

        createMarker(marker, pointData, callback) {
            if (!pointData) return;
            let {latitude, longitude, plateNO, carPlateNo, icon} = pointData;
            // 创建marker标注,使用小车图片
            let point = null;
            let MyCar = null;
            if (longitude && latitude) {
                point = new BMap.Point(longitude, latitude);
            }
            if (marker) {
                this.setLabel(marker, carPlateNo);
                this.map.addOverlay(marker);
                console.log('添加点')
            } else {
                console.log('存在,设置位置')
                marker.setPosition(point)
            }
            marker.addEventListener("click", () => {
                var index = layer.open({
                    title: "车辆监控",
                    type: 2,
                    boxParams: pointData,
                    content: tabBaseURL + "modules/car/pageModel.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
            typeof callback === 'function' && callback(marker);
        },

        // 设置标签
        setMarker(pointData, callback) {
            if (!pointData) return;
            let {latitude, longitude, plateNO, carPlateNo, icon,gpsAccountId} = pointData;
            // 创建小车
            let MyCar = null;
            let point = null;
            let marker = null;

            // 创建marker标注,使用小车图片
            if (longitude && latitude) {
                point = new BMap.Point(longitude, latitude);
            }
            if (this.singleMarker) {
                console.log('设置车辆位置')
                this.singleMarker.setPosition(point)
            } else {
                if (icon) {
                    MyCar = new BMap.Icon(icon, new BMap.Size(52, 26));
                    this.singleMarker = new BMap.Marker(point, {
                        icon: MyCar
                    });
                } else {
                    console.log('默认图标')
                    this.singleMarker = new BMap.Marker(point);
                }
                this.setLabel(this.singleMarker, carPlateNo);
                this.map.addOverlay(this.singleMarker);
                console.log('添加标记点')
            }
            this.singleMarker.addEventListener("click", () => {
                var index = layer.open({
                    title: "车辆监控",
                    type: 2,
                    boxParams: pointData,
                    content: tabBaseURL + "modules/car/pageModel.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
            typeof callback === 'function' && callback(this.singleMarker);
        },

        carInfo(marker, pointData) {
            let {carId, deviceId, deviceNo, deviceManufacturerNumber, icon,gpsAccountId} = pointData;
            $.ajax({
                type: "POST",
                //sync: false,
                url: baseURL + 'vehiclemonitor/info',
                contentType: "application/json",
                data: JSON.stringify({
                    carId: carId,
                    deviceId: deviceId,
                    deviceNo: deviceNo,
                    deviceManufacturerNumber: deviceManufacturerNumber
                }),
                success: (r) => {
                    if (r.code === 0) {
                        localStorage.setItem("clickData", JSON.stringify(pointData));
                        this.addInfoWindow2(marker, r.vehicleMonitorInfo)
                        localStorage.setItem("car_icon", icon);
                    }
                }
            });
        },

        // 添加文字标签
        setLabel(marker, plateNO) {
            if (!marker && !plateNO) return;
            // 添加文字标签
            let textLabel = plateNO;
            var label = new BMap.Label(textLabel, {offset: new BMap.Size(20, -10)});
            marker.setLabel(label);
        }
        ,

        // 信息窗口
        addInfoWindow2(marker, data) {
            let _self = this;
            let point = new BMap.Point(Array.from(data).join(','))
            var opts = {
                title: '', // 信息窗口标题
            }
            // //通过经纬度解析位置信息
            // if ((data.longitude != null && data.longitude != '') && (data.latitude != null && data.latitude != '')) {
            //     let pointData = new BMap.Point(Number(data.longitude), Number(data.latitude));
            //     var gc = new BMap.Geocoder();
            //     gc.getLocation(pointData, function (rs) {
            //         var addComp = rs.addressComponents;
            //         if (addComp != null && addComp != '') {
            //             let address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            //             data.addrDetail = address;
            //         }
            //     });
            // }

            extendComponent = new PeriodDiv({
                propsData: {
                    data: data,
                    send: _self.onSend,
                    vehiclePosition: _self.vehiclePosition
                },
            }).$mount();
            console.log('extendComponent', extendComponent);
            this.infoWindow = new BMap.InfoWindow(extendComponent.$el, opts);  // 创建信息窗口对象
            //设置窗口高度
            console.log(this.infoWindow);
            //this.infoWindow.setHeight(520);
           
            //页面提示信息右上角叉号触发事件
            this.infoWindow.addEventListener("clickclose", function (type, e) {
                localStorage.setItem("clickData", null);
            })
        }
        ,

        // 删除覆盖物
        removeOverlay() {
            let map = this.map;
            map.clearOverlays();
        }
        ,

        // 发送数据
        onSend(e) {
            console.log(e);
            this.$emit('send', e);
        }
        ,

        // 车辆实时轨迹信息
        vehiclePosition() {
            console.log('车辆实时轨迹信息')
            this.$emit('vehicle-position', {
                id: '12'
            });
        }
    }
})










