let config = {
    city: '', // 设置城市
    point: {
        longitude: '108.949915',
        latitude: '34.347507',
    },
    zoom: 4, // 地图级别
}


var socket;
var vm = new Vue({
    el: '#app',
    data: {
        q: {
            carNo: '',
            deptId: '',
            //设备状态
            deviceStatus: 1,
        },
        //部门下拉
        sysDeptEntityList: [],
        isStretch: true,
        config: config,
        mapPoint: '1',
        //车辆定位数据源
        point: [],
        allCount: 0,
        offLineCount: 0,
        staticCount: 0,
        travelCount: 0,
        warnCount: 0,
        arraydata: {},
        actionState: 1,
        //定时器
        timerData: null,

        //左侧数据
        carList: [],
        isVehicle: true,
        pagination: 1,
        page: 1,
        pageCount: 12,
        isEquipment: false,
        isSendInstructions: false, // 发送指令
        isEquipment: false, // 指令参数
        activeDirective: 'send',
        carInfo: {},  // 车辆信息
        deviceInfo: {}, // 设备信息
        instructionsList: [],  // 指令列表
        myVideo: null,
        listCountdown: 60, //列表计数
        listCountdownTimer: null,// 列表计时器
        vehicleCountdown: 60, // 车辆刷新时间
        isVehicleCountdown: false,
        vehicleCountdownTimer: null, // 车辆计时器
        paused: false,  // 报警铃声
        singleAll: 1,
        currentCar: null,
        obj: null,   // 设备信息
        isDisable: true,
        centerAndZoom: true,  // 设置地图中心点
        carId: null,
        deviceId: null
    },

    created: function () {
        // this.timer();
        // // 车辆监控总数统计
        this.carCount()
        this.getCarlistCount()  //
    },

    watch: {
        q: {
            handler(val, oldVal) {
                if (val.carNo == null && val.deptId == null && val.deviceStatus == null) {
                    // vm.search();
                    vm.carlist()
                }
            },
            deep: true //true 深度监听
        },
    },

    computed: {
        setTextColor() {
            return function (status) {
                if (status == 1) {
                    return 'driving'
                } else if (status == 2) {
                    return 'off-line'
                } else if (status == 4) {
                    return 'alarm'
                }
            }
        }
    },

    updated: function () {
        // layui.form.render();
        // console.log('页面跟新')
    },

    mounted() {
        let _self = this;

        layui.use(['form', 'layedit', 'laydate', 'element', 'laypage'], function () {
            var form = layui.form,
                layer = layui.layer,
                layedit = layui.layedit,
                laydate = layui.laydate,
                laypage = layui.laypage,
                element = layui.element;

            form.render();

            //所属部门下拉
            layui.form.on('select(deptIdSelect)', function (data) {
                console.log('deptIdSelect', data)
                vm.q.deptId = data.value;
            });
        });

        this.getCompany();
        //初始化查询
        // this.getMonitorVehicleInformationList()

        this.$refs.map.init();

        this.getCarNumber();
    },

    methods: {

        getMonitorVehicleInformationList() {
            $.ajax({
                type: "POST",
                sync: false,
                url: baseURL + 'monitorBasicInformation/getMonitorVehicleInformationList',
                contentType: "application/json",
                data: JSON.stringify(this.q),
                success: function (r) {
                    var point = r.monitorVehicleInfor.monitorVehicleInformation;
                    console.log("初始化数据打印point:", point);
                    vm.point = [];
                    if (point != null) {
                        vm.point = point;
                        console.log("vm.point:", vm.point);
                    }
                    vm.allCount = r.monitorVehicleInfor.allCount;
                    vm.offLineCount = r.monitorVehicleInfor.offLineCount;
                    vm.staticCount = r.monitorVehicleInfor.staticCount;
                    vm.travelCount = r.monitorVehicleInfor.travelCount;
                }
            });
        },

        // 获取车辆所属部门和公司
        getCompany() {
            $.ajax({
                type: "POST",
                sync: false,
                url: baseURL + 'sys/dept/list',
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.sysDeptEntityList = r;
                    if (r && r.length > 0) {
                        // vm.q.deptId = r[0].deptId;
                        // $("#deptSelect").val(r[0].deptId)
                        r.forEach((item, index) => {
                            $("#deptSelect").append(`<option value=${item.deptId}>${item.name}</option>`);
                        })
                    }
                    layui.form.render('select');
                }
            });
        },

        // 车辆列表跳转执行
        getCarNumber() {
            let car = localStorage.getItem('monitoringCar');
            if (car) {
                let {
                    carNo,
                    depotName,
                    deptId
                } = JSON.parse(car);
                this.q.deptId = deptId;
                this.q.carNo = carNo
            }
        },

        onVehicle(item, index) {
            console.log(item);
            // item.isEquipment == true ? false : true;
            if (item.isEquipment) {
                Vue.set(this.carList[index], 'isEquipment', false)
            } else {
                Vue.set(this.carList[index], 'isEquipment', true)
            }
        },

        onIsVehicle() {
            this.isVehicle = !this.isVehicle;
        },

        // 添加标记点
        addMarker() {
            this.$refs.map.addMarker();
        },

        stretch() {
            this.isStretch = !this.isStretch;
        },

        timer() {
            // this.timerData = window.setInterval(() => {
            //     this.refresh();
            // }, 10000)
        },

        refresh: function () {
            $.ajax({
                type: "POST",
                sync: false,
                url: baseURL + 'monitorBasicInformation/getMonitorVehicleInformationList',
                contentType: "application/json",
                data: JSON.stringify(this.q),
                success: function (r) {
                    var point = r.monitorVehicleInfor.monitorVehicleInformation;
                    console.log("初始化数据打印point:", point);
                    vm.point = [];
                    if (point != null) {
                        vm.point = point;
                    }
                    vm.allCount = r.monitorVehicleInfor.allCount;
                    vm.offLineCount = r.monitorVehicleInfor.offLineCount;
                    vm.staticCount = r.monitorVehicleInfor.staticCount;
                    vm.travelCount = r.monitorVehicleInfor.travelCount;
                }
            });
        },

        //点击搜索按钮
        search: function (event) {
            $.ajax({
                type: "POST",
                sync: false,
                url: baseURL + 'monitorBasicInformation/getMonitorVehicleInformationList',
                contentType: "application/json",
                data: JSON.stringify({"carNo": vm.q.carNo, "deptId": vm.q.deptId, "deviceStatus": vm.q.deviceStatus}),
                success: function (r) {
                    var point = r.monitorVehicleInfor.monitorVehicleInformation;
                    vm.point = [];
                    if (point != null) {
                        vm.point = point;
                    }
                    vm.allCount = r.monitorVehicleInfor.allCount;
                    vm.offLineCount = r.monitorVehicleInfor.offLineCount;
                    vm.staticCount = r.monitorVehicleInfor.staticCount;
                    vm.travelCount = r.monitorVehicleInfor.travelCount;
                    vm.$refs.map.init();
                }
            });
        },

        //车辆状态类型选择
        chooseState: function (type) {
            vm.actionState = type;
            vm.q.deviceStatus = type;
            // vm.search();
            this.carlist().then(num => {
                this.setPage(num);
            })
            this.clearSetIntervalList(() => {
                this.waitfor()
            });
        },

        // 刷新当前车辆列表
        refreshList() {
            this.carCount();

            this.carlist().then(num => {
                this.setPage(num);
            });

            this.clearSetIntervalList(() => {
                this.waitfor()
            })
        },

        reset: function () {
            this.q.carNo = '';
            this.q.deptId = '';
            $("#deptSelect").val('')
            //设备状态
            this.q.deviceStatus = 1;
            this.actionState = 1;
            console.log('清空数据')
            layui.form.render('select');
        },

        /**
         *   车辆监控 - 版本迭代
         *    1. 监控车辆总数统计
         *    2. 新增车辆列表数据
         * */

        // 设置报警播放关闭铃声
        controlVideo() {
            this.myVideo = document.getElementById('#myVideo');
            this.paused = myVideo.paused;  // 设置或返回音频是否暂停。
            if (myVideo.paused) {
                myVideo.play()
                console.log('播放')
            } else {
                myVideo.pause()
                console.log('暂停')
            }
        },

        // 打开车辆实时追踪
        onVehiclePosition(data) {
            console.log('车辆追踪', data)
            top.parent.window.larryTab.tabAdd({
                title: '车辆追踪',
                href: tabBaseURL + 'xz-admin/modules/car/liveLocation.html',
                id: '车辆追踪'
            })
        },

        //    2.0
        // 接收 发送指令数据
        onDirective(data) {
            console.log('接收收据', data);
            let {carInfo, deviceInfo, orderInfo} = data.rentDate;
            this.carInfo = carInfo;
            this.deviceInfo = deviceInfo;
            console.log('this.carInfo *******', this.carInfo)
            this.instructionslist(this.deviceInfo.deviceId);
            this.isSendInstructions = true;
            vm.isSendInstructions = true;
        },

        // 指令发送成功
        sendSuccess() {
            this.isSendInstructions = true;
            layer.alert('指令发送成功')
        },

        // 获取设备指令
        instructionslist(deviceId) {
            $.ajax({
                type: "get",
                url: baseURL + 'vehiclemonitor/instructionslist/' + deviceId,
                success: (r) => {
                    console.log(r);
                    let {code, instructionsList} = r;
                    if (code === 0) {
                        this.instructionsList = instructionsList;
                    }
                }
            });
        },

        changeDirective(flag) {
            this.isEquipment = flag;
        },

        handleClick(tab, event) {
            console.log(tab, event);
        },

        // 监控总数统计
        carCount() {
            $.ajax({
                type: "POST",
                sync: false,
                url: baseURL + 'vehiclemonitor/carCount',
                // contentType: "application/json",
                success: function (r) {
                    console.log(r);
                    vm.allCount = r.vehicleMonitorCarCount.allCount;
                    vm.offLineCount = r.vehicleMonitorCarCount.offLineCount;
                    vm.staticCount = r.vehicleMonitorCarCount.staticCount;
                    vm.travelCount = r.vehicleMonitorCarCount.travelCount;
                    vm.warnCount = r.vehicleMonitorCarCount.warnCount;
                }
            });
        },

        // 设置车辆分页
        setPage(pageCount) {
            let _self = this;
            layui.use('laypage', function () {
                let laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'vehicle-li-page' //注意，这里的 test1 是 ID，不用加 # 号
                    , layout: ['page']
                    , limit: 10
                    , count: pageCount //数据总数，从服务端得到
                    , jump: function (obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                        _self.page = obj.curr;
                        _self.carlist()
                        //首次不执行
                        if (!first) {
                            //do something
                        }
                    }
                });
            })
        },

        // 5秒请求一次列表数据
        waitfor() {
            /*this.listCountdownTimer = setInterval(() => {
                this.listCountdown--;
                // console.log(this.listCountdown);
                if (this.listCountdown < 1) {
                    this.listCountdown = 60;
                    this.carlist()
                }
            }, 1000);*/
        },

        // 清除列表定时器
        clearSetIntervalList(callback) {
            /*console.log('清除定时器')
            clearInterval(this.listCountdownTimer);
            typeof callback === 'function' && callback()*/
        },

        // 获取车辆列表
        carlist() {
            return new Promise((resolve, reject) => {
                let data = {
                    carNo: this.q.carNo,
                    deptId: this.q.deptId,
                    gpsDeviceStatus: this.q.deviceStatus,
                    carId: '',
                    page: this.page,
                    limit: 10
                };
                $.ajax({
                    type: "POST",
                    url: baseURL + 'vehiclemonitor/carlist',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: r => {
                        console.log(r);
                        if (r.code === 0) {
                            if (r.data) {
                                let carArr = r.data;
                                let carList = carArr.map(item => {
                                    item['isEquipment'] = false;
                                    return item
                                });
                                this.carList = carList;
                                this.pageCount = r.count;
                                resolve(this.pageCount)
                            }
                        } else {
                            this.clearSetIntervalList()
                        }
                    },
                    error: () => {
                        this.clearSetIntervalList()
                    }
                });
            })
        },

        getCarlistCount() {
            // 第一次加载车辆列表，并设置分页
            this.carlist().then(num => {
                this.setPage(num);

                // 五秒定时器
                this.waitfor();
            })
        },

        // 点击监控全部或者监控单车获取监控参数
        needmonitorlist(id) {
            return new Promise((resolve, reject) => {
                let data = {
                    carNo: this.q.carNo,
                    deptId: this.q.deptId,
                    gpsDeviceStatus: this.q.deviceStatus,
                    carId: id,   // 监控单车必传
                };
                $.ajax({
                    type: "POST",
                    url: baseURL + 'vehiclemonitor/needmonitorlist',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (r) {
                        if (r.code === 0) {
                            resolve(r.needMonitorList)
                        } else {
                            reject([])
                        }
                    },
                });
            });
        },

        // 监控车辆
        onDevice(type, item) {
            let carId = type == 1 ? item.carId : null;
            let deviceId = type == 1 ? item.deviceId : null;
            // 点击健康所以时，清楚覆盖物
            this.$refs.map.clearMarker()
            this.singleAll = type;
            this.currentCar = item;
            this.centerAndZoom = true;
            this.$refs.map.removeOverlay();
            this.carId=carId;
            this.deviceId=deviceId;
            this.getMonitorlist(null);
            /*this.needmonitorlist(carId).then(data => {
                if (data.length > 0) {
                    let deviceManufacturerNumberAndNo = data.map(item => {
                        return item.deviceManufacturerNumberAndNo
                    })
                    this.obj = {
                        deviceNoList: deviceManufacturerNumberAndNo
                    };
                    console.log('data', item)
                    this.getMonitorlist(this.obj)
                }
            }).catch(e => {
            })*/
        },

        // 获取车辆信息
        getMonitorlist(obj) {
            let _self = this;
            this.isDisable = false;
            let data = {
                carNo: this.q.carNo,
                deptId: this.q.deptId,
                gpsDeviceStatus: this.q.deviceStatus,
                carId: this.carId,   // 监控单车必传
                deviceId: this.deviceId,   // 监控单车必传
            };
            $.ajax({
                type: "POST",
                url: baseURL + 'vehiclemonitor/monitorlist',
                contentType: "application/json",
                timeout: 8000,
                data: JSON.stringify(data),
                success: r => {
                    let {code, monitorList} = r;
                    if (code === 0) {
                        if (monitorList && monitorList.length > 0) {
                            _self.vehicleTiming();
                            _self.isDisable = true;
                            if (_self.singleAll == 2) {
                                _self.point = monitorList;
                            } else {
                                _self.$refs.map.setMarker(...monitorList);
                            }

                            if (!_self.isVehicleCountdown) {
                                _self.isVehicleCountdown = true;
                            }
                        }
                    }
                },
                error: function (e) {
                    console.log('超时', e)
                    _self.vehicleTiming()
                }
            });
        },

        //当点击监控车辆的时候 十秒请求一次车辆监控的信息数据
        vehicleTiming() {
            this.clearSetIntervalVehicle();
            this.vehicleCountdownTimer = setInterval(() => {
                this.vehicleCountdown--;
                if (this.vehicleCountdown < 1) {
                    this.vehicleCountdown = 60;
                    this.centerAndZoom = false;
                    this.getMonitorlist(this.obj)
                }
                console.log('重置')
            }, 60*1000)
        },

        // 清除 车辆信息的定时器
        clearSetIntervalVehicle() {
            clearInterval(this.vehicleCountdownTimer)
        },
    }
});

// 监听页面关闭
window.onunload = function () {
    console.log('close')
    // 清除列表定时器
    vm.clearSetIntervalList();
    // 清除地图车辆信息定时器
    vm.clearSetIntervalVehicle();
}


document.addEventListener('visibilitychange', function () {
    var isHidden = document.hidden;
    console.log('页面影藏')
    if (isHidden) {
        // 清除列表定时器
        vm.clearSetIntervalList();
        // 清除地图车辆信息定时器
        vm.clearSetIntervalVehicle();
        clearInterval(vm.timerData);
    } else {
        // vm.timer();
        if (vm.obj) {
            vm.getMonitorlist(vm.obj)
        }
        vm.getCarlistCount()
    }
});

if (window.addEventListener) {
    window.addEventListener("storage", showStorage);
} else {
    window.attachEvent("onstorage", showStorage);
}

function showStorage(e) {
    console.log(e)
    vm.getCarNumber()
}
