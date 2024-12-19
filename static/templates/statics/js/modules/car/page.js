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
            alarmStatisticsTypeCardTypeList:[],
            //设备状态
            deviceStatus: 1,
            gpsAccountId:null,
        },
        deviceState:-1,
        //部门下拉
        sysDeptEntityList: [],
        //gps类型下拉
        gpsTypeList:[],
        // 报警类型下拉
        typeList:[],
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
        oringCarList:[],
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
        vehicleCountdown: 60, // 车辆刷新时间
        vehicleCountdownTimer: null, // 车辆计时器
        paused: false,  // 报警铃声
        singleAll: 1,
        currentCar: null,
        obj: null,   // 设备信息
        centerAndZoom: true,  // 设置地图中心点
        carId: null,
        deviceId: null,
        xmSelect:null,
        carListId:'carList_id0',
    },

    created: function () {
        // 车辆监控总数统计
       // this.carCount(gpsAccountId)
      //  this.getCarlistCount(gpsAccountId)  //
    },

    watch: {
        // q: {
        //     handler(val, oldVal) {
        //         if (val.carNo == null && val.deptId == null && val.deviceStatus == null) {
        //             vm.carlist()
        //         }
        //     },
        //     deep: true //true 深度监听
        // },
        actionState: {
            handler(val, oldVal) {
                vm.q.alarmStatisticsTypeCardTypeList = []
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

    mounted() {
        layui.use(['form', 'layedit', 'laydate', 'element', 'laypage'], function () {
            var form = layui.form
            form.render();
            //所属部门下拉
            layui.form.on('select(deptIdSelect)', function (data) {
                vm.q.deptId = data.value;
            });
            //gps厂商类型下拉
            layui.form.on('select(gpsTypeSelect)', function (data) {
                vm.q.gpsAccountId = data.value;
            });
            //监听选择状态
            layui.form.on('select(carNoSelect)', function (data) {
                if(data.value){
                    vm.q.carNo=data.value
                }else{
                    vm.q.carNo = '';
                }
            });
        });

        this.getCompany();
        this.getTypeList();
        this.$refs.map.init();
        this.getCarNumber();
        this.getGpsTypeList();
    },

    methods: {
        move() {
            layer.closeAll()
        },
        enter(list){
            var content = list.join(",");
            layer.tips(content, '#tips', {tips: 1});
        },
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
                            vm.q.gpsAccountId=vm.gpsTypeList[0].id
                        }
                        layui.form.render('select');
                        if(vm.gpsTypeList!=null&&vm.gpsTypeList.length>=1){
                            vm.carCount(vm.gpsTypeList[0].id)
                            vm.getCarlistCount(vm.gpsTypeList[0].id)
                        }
                    }
                }
            });
        },
        // 获取车辆所属部门和公司
        getTypeList(){
            var vm = this;
            $.ajax({
                type: "GET",
                url: baseURL + "alarmStatistics/cardStatistics",
                success: function (r) {
                    vm.typeList = r.data || []
                    vm.xmSelect = xmSelect.render({
                        el: '#typeSelect', 
                        data: vm.typeList.map(item=>{return {name:item.label,value:item.cardType}}),
                        tips:'请选择报警类型',
                        on: function(data){
                            if(data.arr.length){
                                vm.q.alarmStatisticsTypeCardTypeList = data.arr.map(item=>item.value);
                            }else{
                                vm.q.alarmStatisticsTypeCardTypeList = [];
                            }
                        }
                    })
                }
              });
            vm.typeList = [
                {
                    value:'1',
                    name:'断电报警'
                },
                {
                    value:'2',
                    name:'低电报警'
                }
            ];
           
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

        // onVehicle(item, index) {
        //     if (item.isEquipment) {
        //         Vue.set(this.carList[index], 'isEquipment', false)
        //     } else {
        //         Vue.set(this.carList[index], 'isEquipment', true)
        //     }
        // },

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
            vm.q.carNo='';
            if(type!=4){
                vm.xmSelect.setValue([])
                vm.q.alarmStatisticsTypeCardTypeList = []
            }
            this.carNum()
        },

        // 刷新当前车辆列表
        refreshList() {
            if(vm.q.gpsAccountId==null||vm.q.gpsAccountId==""){
                alert("请选择厂商类型");
                return;
            }
            this.carCount(vm.q.gpsAccountId);
            this.carNum(vm.q.gpsAccountId);

        },

        reset: function () {
            this.q.carNo = '';
            this.q.deptId = '';
            this.q.alarmStatisticsTypeCardTypeList = [] ;
            vm.xmSelect = xmSelect.render({
                el: '#typeSelect', 
                data: [],
                tips:'请选择报警类型',
                on: function(data){
                    if(data.arr.length){
                        vm.q.alarmStatisticsTypeCardTypeList = data.arr.map(item=>item.value);
                    }else{
                        vm.q.alarmStatisticsTypeCardTypeList = [];
                    }
                }
            })
            console.log('清空数据')
            $('#typeSelect').val([])
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
            let {carInfo, deviceInfo, orderInfo} = data.rentDate;
            this.carInfo = carInfo;
            this.deviceInfo = deviceInfo;
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
        carCount(gpsAccountId) {
            if(vm.q.gpsAccountId!=null){
                gpsAccountId=vm.q.gpsAccountId
            }
            let data = {
                gpsAccountId: gpsAccountId,
                carNo:vm.q.carNo
            };
            $.ajax({
                type: "POST",
                sync: false,
                url: baseURL + 'vehiclemonitor/carCount',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (r) {
                    console.log(r);
                    vm.allCount = r.vehicleMonitorCarCount.allCount;
                    vm.offLineCount = r.vehicleMonitorCarCount.offLineCount;
                    vm.staticCount = r.vehicleMonitorCarCount.staticCount;
                    vm.travelCount = r.vehicleMonitorCarCount.travelCount;
                    vm.warnCount = r.vehicleMonitorCarCount.warnCount;
                    // if (vm.actionState == 0) {
                    //     vm.setPage(vm.allCount);
                    // } else if (vm.actionState == 1) {
                    //     vm.setPage(vm.travelCount);
                    // } else if (vm.actionState == 2) {
                    //     vm.setPage(vm.staticCount);
                    // } else if (vm.actionState == 3) {
                    //     vm.setPage(vm.offLineCount);
                    // } else if (vm.actionState == 4) {
                    //     vm.setPage(vm.warnCount);
                    // }
                }
            });
        },

        // 设置车辆分页
        setPage(pageCount,gpsAccountId) {
            let _self = this;
            console.log(pageCount)
            layui.use('laypage', function () {
                let laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'vehicle-li-page' //注意，这里的 test1 是 ID，不用加 # 号
                    , layout: ['page']
                    , limit: 10
                    , count: pageCount //数据总数，从服务端得到
                    , jump: function (obj, first) {
                        // //obj包含了当前分页的所有参数，比如：
                        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                        // let thisData = _self.oringCarList.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                        // _self.page = obj.curr;
                        // _self.carList = thisData;
                        vm.page = obj.curr^0;
                        vm.carlist(gpsAccountId);
                    }
                });
            })
        },
        // 获取车辆列表
        carlist(gpsAccountId) {
            if(vm.q.gpsAccountId!=null){
                gpsAccountId=vm.q.gpsAccountId
            }
            let data = {
                carNo: this.q.carNo,
                deptId: this.q.deptId,
                alarmStatisticsTypeCardTypeList: this.q.alarmStatisticsTypeCardTypeList,
                gpsDeviceStatus: this.q.deviceStatus,
                carId: '',
                page: vm.page,
                limit: 10,
                gpsAccountId:gpsAccountId,
            };
            console.log(data);
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
                            this.oringCarList = carList;
                            vm.carListId = 'carListId_' + uuid(16);
                            if(r.data.length>0&&vm.q.carNo==""||vm.deviceState!=vm.q.deviceStatus){
                                vm.deviceState=vm.q.deviceStatus
                                document.getElementById("carNoSelect").options.length = 1;
                                r.data.forEach((item, index) => {
                                    $("#carNoSelect").append(`<option value=${item.carPlateNo}>${item.carPlateNo}(${item.deviceNo})</option>`);
                                })
                                layui.form.render('select');
                            }
                        }
                    }
                },
                error: (r) => {
                }
            });
        },

        carNum(gpsAccountId) {
            if(vm.q.gpsAccountId!=null){
                gpsAccountId=vm.q.gpsAccountId
            }
            let data = {
                carNo: this.q.carNo,
                deptId: this.q.deptId,
                alarmStatisticsTypeCardTypeList: this.q.alarmStatisticsTypeCardTypeList,
                gpsDeviceStatus: this.q.deviceStatus,
                carId: '',
                page: this.page,
                limit: 10,
                gpsAccountId:gpsAccountId,
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
                            this.oringCarList = carList;
                            this.setPage(r.count,gpsAccountId);
                        }
                    }
                },
                error: (r) => {
                }
            });
        },

        getCarlistCount(type) {
            // 第一次加载车辆列表，并设置分页
            this.carNum(type)
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
        },

        // 获取车辆信息
        getMonitorlist(obj) {
            let _self = this;
            let data = {
                carNo: this.q.carNo,
                deptId: this.q.deptId,
                gpsDeviceStatus: this.q.deviceStatus,
                carId: this.carId,   // 监控单车必传
                deviceId: this.deviceId,   // 监控单车必传
                gpsAccountId:this.q.gpsAccountId,//gps厂商类型
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
                            _self.$refs.map.centerAndZoom([monitorList[0].longitude,monitorList[0].latitude], 16);
                            if (_self.singleAll == 2) {
                                _self.point = monitorList;
                            } else {
                                _self.$refs.map.setMarker(...monitorList);
                            }
                        }
                    }
                },
                error: function (e) {
                    // _self.vehicleTiming()
                }
            });
        },
    }
});


document.addEventListener('visibilitychange', function () {
    var isHidden = document.hidden;
    if (isHidden) {
      
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
