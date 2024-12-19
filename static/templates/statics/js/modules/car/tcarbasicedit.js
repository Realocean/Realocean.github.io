$(function () {
    if(parent.layui.larryElem != undefined){
        var params = parent.layui.larryElem.boxParams;
        vm.initEditData(params.carId,params.businessType);
    }

    //监听input是否发生改变 只要触发显示保存按钮
    $('.details-content-box :input').blur('input propertychange', function(){
        if(vm.tCarBasic.businessType==5 ||vm.tCarBasic.businessType==7){
            vm.activeBtn = false;
        }else{
            vm.activeBtn = true;
        }


    })
    $('textarea').on('keyup  input', function() {
        if(vm.tCarBasic.businessType==5 ||vm.tCarBasic.businessType==7){
            vm.activeBtn = false;
        }else{
            vm.activeBtn = true;

        }

    })
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
        var cascader = layui.cascader;
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            vm.selectData = r.carTreeVoList;
            if(vm.tCarBasic!=null && vm.tCarBasic.carId != null){
            }else{
                vm.editDetailForm = false;
                cascader({
                    elem: "#a",
                    data: vm.selectData,
                    success: function (valData,labelData) {
                        vm.tCarBasic.brandId = valData[0];
                        vm.tCarBasic.seriesId = valData[1];
                        vm.tCarBasic.modelId = valData[2];
                        vm.tCarBasic.brandName = labelData[0];
                        vm.tCarBasic.seriesName = labelData[1];
                        vm.tCarBasic.modelName = labelData[2];
                    }
                });
            }
        });
    });
    layui.use(['layer','form', 'upload'], function(){
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功

        /***
         * 监听所有下拉框内容，只要触发显示保存按钮
         */
        form.on('select', function (data) {
            if(vm.tCarBasic.businessType==5 ||vm.tCarBasic.businessType==7){
                vm.activeBtn = false;
            }else{
                vm.activeBtn = true;
            }


        });


        form.on('select(hpCode)', function (data) {
            vm.tCarBasic.hpCode = data.value;
            var obj = vm.hpList.filter(function (obj) {
                return obj.hpCode == data.value;
            })[0];
            if (obj != null){
                vm.tCarBasic.hpName = obj.hpName;
            }else {
                vm.tCarBasic.hpName = '';
            }
        });
        /**
         * 监听所有按钮内容，只要触发显示保存按钮
         */
        form.on('radio', function (data) {
            if(vm.tCarBasic.businessType==5 ||vm.tCarBasic.businessType==7){
                vm.activeBtn = false;
            }else{
                vm.activeBtn = true;
            }


        });

        /**
         * 监听所有多选框内容，只要触发显示保存按钮
         */
        form.on('checkbox',function (data) {
            if(vm.tCarBasic.businessType==5 ||vm.tCarBasic.businessType==7){
                vm.activeBtn = false;
            }else{
                vm.activeBtn = true;
            }


        })


        form.on('submit(save)', function () {
            vm.save();
            return false;
        });
        form.verify({
            userNumVerify: function(value){
                if (value != "" && value != null){
                    var reg = /^[+]{0,1}(\d+)$/;
                    if(!reg.test(value)){
                        return "载客人数请输入整数！";
                    }
                }
            },
            carWeightVerify: function(value){
                if (value != "" && value != null){
                    var reg = /^[+]{0,1}(\d+)$/;
                    if(!reg.test(value)){
                        return "车辆总重量请输入整数！";
                    }
                }
            },
            vinNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '车架号不能为空';
                }
            },

            //GPS供应商校验
            /* gpsSupplierId: function (value) {
                 if(vm.tCarBasic.gpsDeviceNo!=null && vm.tCarBasic.gpsDeviceNo!=''){
                     if(value==null || value==''){
                         return 'GPS供应商不能为空';
                     }
                 }
             },*/

            modelVerify: function(value){
                if (value == "" || value == null) {
                    return '品牌/车系/车型不能为空';
                }
            },
            deptNameVerify: function(value){
                if(vm.tCarBasic.businessType!=3 && vm.tCarBasic.businessType!=4){
                    if (value == "" || value == null) {
                        return '车辆归属不能为空';
                    }
                }
            },
            depotNameVerify: function (value) {
                if(vm.carDispotIsneed === '1' && (vm.tCarBasic.businessType === 1 || vm.tCarBasic.businessType === 2)){
                    if (value == "" || value == null) {
                        return '仓库不能为空';
                    }
                }
            }
        });
        form.on('select(sideDoorSelect)', function (data) {
            vm.tCarBasic.sideDoor = data.value;
        });

        form.on('select(carColorSelect)', function (data) {
            vm.tCarBasic.carColor = data.value;
        });

        form.on('select(sourceTypeSelect)', function (data) {
            vm.tCarBasic.sourceType = data.value;
            //加载车辆来源
            if(isNotEmpty(vm.tCarBasic.sourceType)){
                vm.sourceDetailContent = true;
            }else{
                vm.sourceDetailContent = false;
            }
            vm.initSourceGrid(vm.tCarBasic.sourceType);
        });

        form.on('select(repaymentMethods)', function (data) {
            vm.sourceDataList[0].refundType = data.value;
        });

        form.on('select(carPowerSelect)', function (data) {
            vm.tCarBasic.carPower = data.value;
        });

        form.on('select(isCreateOrder)', function (data) {
            vm.sourceDataList[0].isCreateOrder = data.value;
        });

        form.on('radio(disputeCheck)', function (data) {
            vm.tCarBasic.isDisputeCar = data.value;
        });

        form.on('radio(faultCheck)', function (data) {
            vm.tCarBasic.isFaultCar = data.value;
        });

        form.on('radio(businessCheck)', function (data) {
            vm.tCarBasic.businessType = data.value;
        });

        form.on('checkbox(itemCheck)', function(data){
            if(vm.tCarBasic.items==null||vm.tCarBasic.items==''||vm.tCarBasic.items=='null'){
                vm.tCarBasic.items = [];
                vm.tCarBasic.itemsName = [];
            }
            if (data.elem.checked) {
                vm.tCarBasic.items.push(data.value);
                vm.tCarBasic.itemsName.push(data.elem.title);
            }else {
                vm.tCarBasic.items=vm.tCarBasic.items.filter(function (v) {return v!=data.value});
                vm.tCarBasic.itemsName=vm.tCarBasic.itemsName.filter(function (v) {return v!=data.elem.title});
            }
        });

        //gps供应商下拉列表监听事件
        form.on('select(gpsSupplierId)', function (data) {
            vm.tCarBasic.gpsSupplierId = data.value;
        });
        upload = Upload({
            elid: 'carDetailId',
            edit: true,
            fileLst: vm.fileLst,
            param: {'path':'car_images'},
            fidedesc: '车辆详情照片',
            callBack:function (tag) {//成功以后显示保存按钮
                if('success' === tag){
                    vm.activeBtn = true;
                }
            }
        });
        upload.initView();
        form.render();//在最后添加这句代码
    });

    layui.use('laydate', function () {
        layui.laydate.render({
            elem: '#registerDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.tCarBasic.registerDate = value;
            }
        });

        layui.laydate.render({
            elem: '#licenseDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.tCarBasic.licenseDate = value;
            }
        });

        layui.laydate.render({
            elem: '#storageTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.tCarBasic.storageTime = value;
            }
        })

        layui.laydate.render({
            elem: '#nextMaintenanceDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.tCarBasic.nextMaintenanceDate = value;
            }
        });
    });

    layui.table.on('edit(grid)', function (obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data;
        var field = obj.field;
        var value = obj.value;
        vm.sourceDataList.forEach(function (d) {
            if (d.id == data.id) {
                if (field == 'purchasePrice') {
                    d.purchasePrice = value;
                } else if (field == 'payType') {
                    d.payType = value;
                } else if (field == 'rentMarginPrice') {
                    d.rentMarginPrice = value;
                } else if (field == 'rentMonthPrice') {
                    d.rentMonthPrice = value;
                } else if (field == 'dueDate') {
                    d.dueDate = value;
                } else if (field == 'amountPaid') {
                    d.amountPaid = value;
                } else if (field == 'refundType') {
                    d.refundType = value;
                }
            }
        })
    });

    //车辆档案
    layui.table.on('tool(test8)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){//修改车辆档案
            vm.update(data.id);
        } else if(layEvent === 'del'){//删除车辆档案
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'detail'){//查看车辆档案
            vm.detail(data.id);
        }else if(layEvent === 'closeReturn'){//关闭当前页面返回列表
            vm.closeReturn();
        }
    });
    // 供应商
    layui.form.on('select(tCarBasic.purchaseSupplierId)', function (data) {
        vm.tCarBasic.purchaseSupplierId = data.value;
        vm.tCarBasic.purchaseSupplierName = vm.purchasesupplierMap[data.value];
    });
    // 车务
    layui.form.on('select(vehicleUserId)', function (data) {
        vm.tCarBasic.vehicleUserId = data.value;
        vm.tCarBasic.vehicleUserName = vm.vehicleUserMap[data.value].username;
        vm.tCarBasic.vehicleUserPhone = vm.vehicleUserMap[data.value].mobile;
    });
});
var upload;
var viewer;
var carDataBackup;
var vm = new Vue({
    el: '#rrapp',
    data: {
        //车辆详情
        detailsTabContentList: ['车辆详情','车辆操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '基础信息',
            '年检记录',
            '保养记录',
            '保险记录',
            '违章记录',
            '出险记录',
            '维修记录',
            '移库记录',
            '换牌记录',
            '车辆档案',
            '过户记录',
            '处置记录',
            '车辆订单'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '基础信息',
        // tCarBasic:{},
        accessoryList:[],
        carCountDto:{},
        illegalData:[],
        insuranceData:[],
        vehicleData:[],
        maintenanceData:[],
        outInsuranceData:[],
        repairData:[],
        orderData:[],
        moveHouseData:[],
        recordData:[],
        transferData:[],
        carDisposal:{},
        deliveryFileLst:[],
        disposalReasonList:[],
        vehicleCarList:[],
        hpshow:true,
        czshow:true,
        balancePaymentLst:[],
        fileLst1:[],

        tCarBasic: {isDisputeCar:1,businessType:1,isFaultCar:1},
        carColorList:[],
        carPowerData:[],
        sysDept:{deptId:null},
        sysDeptParam:{},
        sourceDetailContent:false,
        editDetailForm:false,
        cols:[[]],
        sourceDataList:[],
        obj:null,
        fileLst: [],
        fileLstId: '0',
        selectData:[],
        imgDrivinglicenseFront:null,
        //选择仓库数据源
        warehouseData:{},
        choiceorderType:false,
        carDispotIsneed: null,
        feeItemLst:[],
        basicSourceFileLst:[],
        //新增或者编辑
        workType:null,
        plan:null,
        //gps设备数据-选择GPS设备时使用
        deviceInformation:{},
        accessoryGroupList:[],
        activeBtn: false,//控制保存按钮是否显示 默认为false不显示 显示true
        drivingFilter: true,//控制行驶证信息 收缩false 展开true
        vehicleFilter: true,//控制车辆信息 收缩false 展开true
        hpList:[],
        // 供应商列表
        purchasesupplierList:[],
        purchasesupplierMap: {},
        // 车务列表
        vehicleUserList:[],
        vehicleUserMap:{}
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async = false;
        $.getJSON(baseURL + "sys/dict/getInfoByType/color", function (r) {
            _this.carColorList = r.dict;
        });
        $.getJSON(baseURL + "sys/dict/getInfoByType/carPower", function (r) {
            _this.carPowerData = r.dict;
        });
        $.getJSON(baseURL + "sys/config/getparam/CAR_DISPOT_ISNEED", function (r) {
            _this.carDispotIsneed = r.config.paramValue;
        });
        $.get(baseURL + "sys/dict/getInfoByType/accessoryItem", function (r) {
            _this.accessoryGroupList = r.dict;
            if (_this.accessoryGroupList != null && _this.accessoryGroupList.length > 0){
                var parent = $('#accessoryGroup');
                console.log(_this.accessoryGroupList);
                _this.accessoryGroupList.forEach(function (d) {
                    parent.append('<input type="checkbox" lay-filter="itemCheck" v-model="tCarBasic.items" name="accessoryItems" value="'+d.code+'" lay-skin="primary" title="'+d.value+'" '+'>');
                });
            }
        });
        $.get(baseURL + "car/tcarbasic/getHpList", function (r) {
            _this.hpList = r.hpList;
        });
        // 供应商列表
        $.get(baseURL + "purchase/purchasesupplier/selectSupList?enalbe=1", function (r) {
            _this.purchasesupplierList = r.data;
            if (_this.purchasesupplierList.length < 1) {
                return false;
            }
            for (let i = 0; i < _this.purchasesupplierList.length; i++) {
                _this.purchasesupplierMap[_this.purchasesupplierList[i].purchaseSupplierId] = _this.purchasesupplierList[i].supplierName;
            }
        });
        // 车务
        $.ajax({
            type: "POST",
            url: baseURL + "/sys/user/usrLst",
            contentType: "application/json",
            data:null,
            success: function(r){
                _this.vehicleUserList = r.usrLst;
                if (_this.vehicleUserList.length < 1) {
                    return false;
                }
                for (let i = 0; i < _this.vehicleUserList.length; i++) {
                    _this.vehicleUserMap[_this.vehicleUserList[i].userId] = _this.vehicleUserList[i];
                }
            }
        });
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 行驶证信息收缩展开
        bindDrivingFilter: function () {
            this.drivingFilter = !this.drivingFilter;
        },
        // 车辆信息收缩展开
        bindVehicleFilter:function () {
            this.vehicleFilter = !this.vehicleFilter;
        },
        impVehicle: function () {//年检
            var url = tabBaseURL + "modules/utils/imptemplet.html";
            var title = "年检数据导入";
            var param = {
                typeStr:'年检',
                templetUrl:'importData/clnj/clnjdr.xlsx',
                actionUrl:'maintenance/inspectionmanage/import',
                beanName:'io.xz.modules.maintenance.excel.InspectionManageBean'
            };
            addTab(url, title, param);
        },
        impInsurance: function () {//保险
            var url = tabBaseURL + "modules/utils/imptemplet.html";
            var title = "保险数据导入";
            var param = {
                typeStr:'保险',
                templetUrl:'importData/clbx/bxdr.xlsx',
                actionUrl:'maintenance/insurancemanage/import',
                beanName:'io.xz.modules.maintenance.excel.InsuranceManageImportBean'
            };
            addTab(url, title, param);
        },
        impMaintenance: function () {//保养
            var url = tabBaseURL + "modules/utils/imptemplet.html";
            var title = "保养数据导入";
            var param = {
                typeStr:'保养',
                templetUrl:'importData/clby/bydr.xlsx',
                actionUrl:'maintenance/maintenancemanage/importExcel',
                beanName:'io.xz.modules.maintenance.excel.MaintenanceManageImportBean'
            };
            addTab(url, title, param);
        },
        impOutInsurance: function () {//出险
            var url = tabBaseURL + "modules/utils/imptemplet.html";
            var title = "出险数据导入";
            var param = {
                typeStr:'出险',
                templetUrl:'importData/clcx/cxdr.xlsx',
                actionUrl:'outinsuranceorder/ouinsuranceorder/importExcel',
                beanName:'io.xz.modules.outinsuranceorder.excel.OutinsuranceOrderImportBean',
                reviewFieldTransformMap:{
                    outLevel:{1:'一般事故',2:'较大事故',3:'重大事故',4:'特别重大事故'},
                    sxIsPay:{1:'是',2:'否'},
                    qxIsPay:{1:'是',2:'否'}
                }
            };
            addTab(url, title, param);
        },
        impRepair: function () {//维修
            var url = tabBaseURL + "modules/utils/imptemplet.html";
            var title = "维修数据导入";
            var param = {
                typeStr:'维修',
                templetUrl:'importData/clwx/wxdr.xlsx',
                actionUrl:'carrepairorder/carrepairorder/importExcel',
                beanName:'io.xz.modules.carrepairorder.excel.CarRepairOrderImportBean',
                reviewFieldTransformMap:{
                    repairStatus:{1:'未维修',2:'维修中',3:'已维修'},
                    isSpareCar:{1:'是',2:'否'}
                }
            };
            addTab(url, title, param);
        },
        impOrder: function () {//订单
            var param = {
                callback: function(orderType){
                    var conf = {
                        typeStr:getRentTypeStr(orderType)+'订单',
                        actionUrl:'order/order/inports',
                        dataParam:{rentType:orderType},
                        reviewFieldTransformMap:{
                            customerType:{1:'企业',2:'个人'},
                            paymentMethod:{7:'日付',8:'周付',1:'月付',2:'两月付',3:'季付',6:'半年付',4:'年付',5:'一次性结清'}
                        }
                    };
                    switch (parseInt(orderType)) {
                        case 1://经租
                        case 3: //展示车
                        case 4: {//试驾车
                            conf.templetUrl = 'importData/order/jz/jzdr.xlsx';
                            conf.beanName = 'io.xz.modules.order.excel.OrderImportType1Bean';
                            break;
                        }
                        case 2:{//以租代购
                            conf.templetUrl = 'importData/order/yzdg/yzdgdr.xlsx';
                            conf.beanName = 'io.xz.modules.order.excel.OrderImportType2Bean';
                            break;
                        }
                        case 5: {//融租
                            conf.templetUrl = 'importData/order/rz/rzdr.xlsx';
                            conf.beanName = 'io.xz.modules.order.excel.OrderImportType5Bean';
                            break;
                        }
                        case 6: {//直购
                            conf.templetUrl = 'importData/order/zg/zgdr.xlsx';
                            conf.beanName = 'io.xz.modules.order.excel.OrderImportType6Bean';
                            break;
                        }
                    }
                    var url = tabBaseURL + "modules/utils/imptemplet.html";
                    var title = "订单数据导入";
                    addTab(url, title, conf);
                }
            };
            var index = layer.open({
                title: "选择订单类型",
                type: 2,
                area: ['700px', '400px'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selectordertype.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        showImg: function () {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+vm.imgDrivinglicenseFront,
                    title: '行驶证照片预览'
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        showDoc: function (fileName, url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        initEditData: function(carId,businessType){
            var loading = layer.load(0, {
                shade: true,
                time: 5*1000
            });
            $.ajax({
                type: "POST",
                url: baseURL + 'car/tcarbasic/detailInfo/' + carId,
                contentType: "application/json",
                success: function (r) {
                    vm.tCarBasic = r.detailInfo.tCarBasic;
                    if(businessType === 34){
                        vm.tCarBasic.businessTypeStr = '直购-已过户';
                    }
                    vm.carCountDto = r.detailInfo.carCountDto;
                    vm.tCarBasic.brandSeriesModelName = r.detailInfo.tCarBasic.brandName + '/' + r.detailInfo.tCarBasic.seriesName + '/' + r.detailInfo.tCarBasic.modelName ;
                    if(r.detailInfo.tCarBasic.imgDrivinglicenseFront!=null && r.detailInfo.tCarBasic.imgDrivinglicenseFront!=''){
                        vm.imgDrivinglicenseFront = r.detailInfo.tCarBasic.imgDrivinglicenseFront;
                        $("#imgDrivinglicenseFront").prop("src",imageURL+r.detailInfo.tCarBasic.imgDrivinglicenseFront);
                    }
                    // vm.fileLst = r.detailInfo.tCarBasic.fileLst;
                    upload.updateFile(r.detailInfo.tCarBasic.fileLst);
                    vm.sourceDataList = r.detailInfo.sourceDataList;
                    vm.accessoryList = r.detailInfo.tCarBasic.items;
                    if(vm.sourceDataList!=null && vm.sourceDataList.length>0 ){
                        vm.sourceDetailContent = true;
                        vm.balancePaymentLst = r.detailInfo.balancePaymentLst;
                        vm.fileLst1 = r.detailInfo.fileLst1;
                        vm.editSourceGrid(vm.tCarBasic.sourceType);
                    }
                    if(r.detailInfo.illegalData!=null && r.detailInfo.illegalData.length>0){
                        vm.illegalData = r.detailInfo.illegalData;
                    }
                    if(r.detailInfo.insuranceData!=null && r.detailInfo.insuranceData.length>0){
                        vm.insuranceData = r.detailInfo.insuranceData;
                    }
                    if(r.detailInfo.vehicleData!=null && r.detailInfo.vehicleData.length>0){
                        vm.vehicleData = r.detailInfo.vehicleData;
                    }
                    if(r.detailInfo.maintenanceData!=null && r.detailInfo.maintenanceData.length>0){
                        vm.maintenanceData = r.detailInfo.maintenanceData;
                    }
                    if(r.detailInfo.outInsuranceData!=null && r.detailInfo.outInsuranceData.length>0){
                        vm.outInsuranceData = r.detailInfo.outInsuranceData;
                    }
                    if(r.detailInfo.repairData!=null && r.detailInfo.repairData.length>0){
                        vm.repairData = r.detailInfo.repairData;
                    }
                    if(r.detailInfo.orderData!=null && r.detailInfo.orderData.length>0){
                        vm.orderData = r.detailInfo.orderData;
                    }
                    if(r.detailInfo.moveHouseData!=null && r.detailInfo.moveHouseData.length>0){
                        vm.moveHouseData = r.detailInfo.moveHouseData;
                    }
                    if(r.detailInfo.transferData!=null && r.detailInfo.transferData.length>0){
                        vm.transferData = r.detailInfo.transferData;
                    }
                    if(r.detailInfo.recordData!=null && r.detailInfo.recordData.length>0){
                        vm.recordData = r.detailInfo.recordData;
                    }else{
                        vm.recordData = [];
                    }
                    if(r.detailInfo.carDisposal!=null){
                        vm.carDisposal = r.detailInfo.carDisposal;
                        vm.deliveryFileLst = r.detailInfo.carDisposal.fileLst;
                    }else{
                        vm.detailsSupTabContentList=vm.detailsSupTabContentList.filter(t => t != "处置记录");
                        vm.czshow = false;
                    }
                    if(r.detailInfo.vehicleLog!=null&&r.detailInfo.vehicleLog.length>0){
                        vm.vehicleCarList = r.detailInfo.vehicleLog;
                    }else{
                        vm.detailsSupTabContentList=vm.detailsSupTabContentList.filter(t => t != "换牌记录");
                        vm.hpshow = false;
                    }
                    if (vm.tCarBasic.businessType == 3 || vm.tCarBasic.businessType == 4){
                        $('#storageTime').attr('disabled','disabled');
                    }
                    layui.config({
                        base: "../../statics/common/cascader/layui/lay/mymodules/"
                    }).use(['form',"jquery","cascader","form"], function(){
                        var cascader = layui.cascader;
                        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                            vm.selectData = r.carTreeVoList;
                            if(vm.tCarBasic!=null && vm.tCarBasic.carId != null){
                                vm.editDetailForm = true;
                                cascader({
                                    elem: "#a",
                                    data: vm.selectData,
                                    value: [vm.tCarBasic.brandId, vm.tCarBasic.seriesId, vm.tCarBasic.modelId],
                                    success: function (valData,labelData) {
                                        vm.tCarBasic.brandId = valData[0];
                                        vm.tCarBasic.seriesId = valData[1];
                                        vm.tCarBasic.modelId = valData[2];
                                        vm.tCarBasic.brandName = labelData[0];
                                        vm.tCarBasic.seriesName = labelData[1];
                                        vm.tCarBasic.modelName = labelData[2];
                                    }
                                });
                            }
                        });
                    });
                    vm.initAllGrid();
                    vm.initOperatorLog();
                    vm.activeBtn = false;
                    layer.close(loading);
                }
            });
        },
        confirmSup: function(data){
            var newdata = {"supplierName":data.data.supplierName,"supplierId":data.data.supplierId};
            vm.obj.update(newdata);
            vm.sourceDataList[0].supplierName = data.data.supplierName;
            vm.sourceDataList[0].supplierId = data.data.purchaseSupplierId;
            // vm.tCarBasic.purchaseSupplierId = data.data.purchaseSupplierId;
            // vm.tCarBasic.purchaseSupplierName = data.data.supplierName;
            vm.tCarBasic = Object.assign({}, vm.tCarBasic,{
                purchaseSupplierId:data.data.purchaseSupplierId,
                purchaseSupplierName:data.data.supplierName,
            });
            layer.closeAll();
        },
        confirmContract: function(data){
            var newdata = {"contractNo":data.data.code};
            vm.obj.update(newdata);
            vm.sourceDataList[0].contractNo = data.data.code;
            vm.sourceDataList[0].contractId = data.data.id;
            layer.closeAll();
        },
        editSourceGrid: function(sourceType){
            vm.initCols(sourceType);
            vm.initGrid();
        },
        initSourceData: function(sourceType){
            var id = 0;
            vm.sourceDataList = [];
            if(sourceType==1){
                var sourceData = {
                    id: id + 1,
                    contractNo: '',
                    sourceTypeName: '直购',
                    supplierName: '',
                    purchasePrice: '',
                    purchaseDate: '',
                    payType: '',
                    carSourceType: 1,
                    supplierId: '',
                    isCreateOrder: 0
                };
                vm.sourceDataList.push(sourceData);
            }
            if(sourceType==2){
                var sourceData = {
                    id: id + 1,
                    contractNo: '',
                    sourceTypeName: '长租',
                    supplierName: '',
                    rentStartDate: '',
                    rentEndDate: '',
                    rentMarginPrice: '',
                    rentMonthPrice: '',
                    payType: '',
                    dueDate: '',
                    amountPaid: '',
                    carSourceType: 2,
                    supplierId: '',
                    isCreateOrder: 0
                };
                vm.sourceDataList.push(sourceData);
            }
            if(sourceType==3){
                var sourceData = {
                    id: id + 1,
                    contractNo: '',
                    sourceTypeName: '以租代购',
                    supplierName: '',
                    rentStartDate: '',
                    rentEndDate: '',
                    rentMarginPrice: '',
                    rentMonthPrice: '',
                    refundType: '',
                    dueDate: '',
                    payType: '',
                    amountPaid: '',
                    carSourceType: 3,
                    supplierId: '',
                    isCreateOrder: 0
                };
                vm.sourceDataList.push(sourceData);
            }
        },
        initCols: function(sourceType){
            $.ajaxSettings.async = false;
            $.get(baseURL + "car/tcarbasic/hasPlan/" + vm.tCarBasic.carId, function (r) {
                if(r){
                    vm.plan = 1;
                }else{
                    vm.plan = 2;
                }
            });
            vm.cols = [[
                {field: 'contractNo',width:300, title: '车辆来源合同', event:'selectContract'},
                {field: 'supplierName',width:300, title: '供应商', event:'selectSupplier'},
                {field: 'purchasePlan',width:300, title: '采购方案', templet: '#barPlanTpl'}
            ]];

        },
        initGrid: function(){
            layui.table.render({
                elem: '#grid',
                id: "gridid",
                cols: vm.cols,
                page: false,
                limits: [500],
                limit: 500,
                done: function (res, curr, count) {
                    if(vm.plan == 1){
                        $('#updateplan').css("display",'none');
                        $('#viewplan').css("display",'block');
                    }
                    if(vm.plan ==2){
                        $('#updateplan').css("display",'block');
                        $('#viewplan').css("display",'none');
                    }
                }
            });
            layui.table.on('tool(gridid)', function (obj) {
                vm.obj = obj;
                var data = obj.data;
                var newdata = {};
                if (obj.event === 'date') {
                    var field = $(this).data('field');
                    layui.laydate.render({
                        elem: this.firstChild
                        , show: true //直接显示
                        , closeStop: this
                        , done: function (value, date) {
                            newdata[field] = value;
                            obj.update(newdata);
                        }
                    });
                }else if (obj.event === 'selectSupplier'){
                    var index = layer.open({
                        title: "选择供应商",
                        type: 2,
                        area: ['80%', '80%'],
                        content: tabBaseURL + "modules/common/selectsupplier.html",
                        end: function(){
                            layer.close(index);
                        }
                    });
                }else if(obj.event === 'selectContract'){
                    var index = layer.open({
                        title: "选择车辆来源合同",
                        type: 2,
                        area: ['80%', '80%'],
                        content: tabBaseURL + "modules/common/selectcontract.html",
                        end: function(){
                            layer.close(index);
                        }
                    });
                }else if(obj.event === 'editPlan'){
                    vm.editPlan();
                }else if(obj.event === 'detailPlan'){
                    vm.detailPlan();
                }
            });
            vm.reloadSourceTable();
        },
        detailPlan:function(){
            var url;
            var title;
            if(vm.tCarBasic.sourceType != null && vm.tCarBasic.sourceType != ''){
                if(vm.tCarBasic.sourceType === '1' || vm.tCarBasic.sourceType === 1){
                    title = '查看直购方案';
                    url = tabBaseURL + "modules/car/directpurchase.html";
                }else if(vm.tCarBasic.sourceType === '2' || vm.tCarBasic.sourceType === 2){
                    title = '查看长租方案'
                    url = tabBaseURL + "modules/car/longrent.html";
                }else if(vm.tCarBasic.sourceType === '3' || vm.tCarBasic.sourceType === 3){
                    title = '查看以租代购方案';
                    url = tabBaseURL + "modules/car/leasepurchase.html";
                }
                    var index = layer.open({
                        title: title,
                        type: 2,
                        content: url,
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.isDetail = true;
                            iframe.vm.promptFlag = false;
                            iframe.vm.initFeeItem();
                            iframe.vm.carBasicSource = Object.assign({},iframe.vm.carBasicSource,vm.sourceDataList[0]);
                            iframe.vm.balancePaymentLst = vm.balancePaymentLst;
                            iframe.vm.fileLst = vm.basicSourceFileLst;
                            iframe.vm.feeItemId = vm.sourceDataList[0].feeItemId;
                            iframe.vm.reloadFeeItem();
                        },
                        end: function () {
                            layer.closeAll();
                        }

                    });
                    layer.full(index);

            }
        },
        initSourceGrid: function(sourceType){
            //sourceType 1直购 2租赁 3租售
            vm.carBasicSource = {};
            vm.feeItemLst = [];
            vm.basicSourceFileLst = [];
            vm.initCols(sourceType);
            vm.initSourceData(sourceType);
            vm.initGrid();
        },
        reloadSourceTable: function(){
            layui.table.reload('gridid', {
                data: vm.sourceDataList
            });
        },
        deptInto: function(){
            if (vm.tCarBasic.businessType == 3 || vm.tCarBasic.businessType == 4){
                return;
            }
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdepttwo.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        deptTree: function(){
            if (vm.tCarBasic.businessType == 3 || vm.tCarBasic.businessType == 4){
                return;
            }
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClickTwo: function(event, treeId, treeNode){
            Vue.set(vm.tCarBasic,"intoDeptId",treeNode.deptId);
            Vue.set(vm.tCarBasic,"intoDeptName",treeNode.name);
            layer.closeAll();
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.tCarBasic,"deptId",treeNode.deptId);
            Vue.set(vm.tCarBasic,"deptName",treeNode.name);
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        save: function() {
            vm.tCarBasic.fileLst = vm.fileLst;
            vm.tCarBasic.imgDrivinglicenseFront = vm.imgDrivinglicenseFront;
            if(vm.sourceDataList!=null && vm.sourceDataList.length>0){
                vm.sourceDataList[0].basicSourceFileLst = vm.basicSourceFileLst;
                vm.sourceDataList[0].feeItemLst = vm.feeItemLst;
            }
            $.ajaxSettings.async = false;
            var rdata;
            $.ajax({
                type: "POST",
                url: baseURL + 'car/tcarbasic/verifyCaeData',
                contentType: "application/json",
                data: JSON.stringify({
                    carBasic:vm.tCarBasic,
                    carDataBackup: carDataBackup
                }),
                success: function(r){
                    rdata = r;
                }
            });
            $.ajaxSettings.async = true;
            var rtmsg = rdata.rtmsg;
            var rtcode = rdata.rtcode;
            if (rtcode == 0){
                alert(rtmsg);
                return false;
            }
            if (rtcode == 1){
                layer.confirm(rtmsg, function(index){
                    var url = vm.tCarBasic.carId == null ? "car/tcarbasic/save" : "car/tcarbasic/update";
                    $.ajax({
                        type: "POST",
                        url: baseURL + url,
                        contentType: "application/json",
                        data: JSON.stringify({
                            carBasic:vm.tCarBasic,
                            carDataBackup: carDataBackup,
                            carBasicSource:vm.sourceDataList[0]
                        }),
                        success: function(r){
                            if(r.code === 0){
                                alert('操作成功', function(index){
                                    /*parent.layer.closeAll();
                                    parent.vm.initStatusCar();
                                    parent.vm.initTableCols();
                                    parent.vm.reload();*/
                                    vm.refresh();
                                });
                            }else{
                                alert(r.msg);
                            }
                        }
                    });
                });
            }
        },
        cancel: function(){
            parent.layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    supplierName: vm.q.supplierName,
                    type: vm.q.type,
                    auditStatus: vm.q.auditStatus,
                    isUse: vm.q.isUse,
                }
            });
        },
        selectwarehouse:function () {
            if (vm.tCarBasic.businessType == 3 || vm.tCarBasic.businessType == 4){
                return;
            }
            var index = layer.open({
                title: "仓库/城市名称选择",
                type: 2,
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function(){
                    vm.tCarBasic = Object.assign({}, vm.tCarBasic,{
                        depotId:vm.warehouseData.warehouseId,
                        depotName:vm.warehouseData.warehouseName,
                    });
                }
            });
            layer.full(index);
        },
        selectContract:function(){

        },
        selectSupplier:function () {
            var index = layer.open({
                title: "供应商选择",
                type: 2,
                content: tabBaseURL + "modules/common/selectsupplier.html",
                end: function(){
                    /*vm.tCarBasic = Object.assign({}, vm.tCarBasic,{
                        purchaseSupplierId:vm.warehouseData.warehouseId,
                        purchaseSupplierName:vm.warehouseData.warehouseName,
                    });*/
                }
            });
            layer.full(index);
        },
        showDiv:function () {
            $("#showWarehouse").show();
            $("#hidenWarehouse").hide();
        },
        hideDiv:function () {
            $("#showWarehouse").hide();
            $("#hidenWarehouse").show();
        },
        editPlan:function(){
            var url;
            var title;
            if(vm.tCarBasic.sourceType != null && vm.tCarBasic.sourceType != ''){
                if(vm.tCarBasic.sourceType === '1' || vm.tCarBasic.sourceType === 1){
                    title = '填写直购方案';
                    url = tabBaseURL + "modules/car/directpurchase.html";
                }else if(vm.tCarBasic.sourceType === '2' || vm.tCarBasic.sourceType === 2){
                    title = '填写长租方案'
                    url = tabBaseURL + "modules/car/longrent.html";
                }else if(vm.tCarBasic.sourceType === '3' || vm.tCarBasic.sourceType === 3){
                    title = '填写以租代购方案';
                    url = tabBaseURL + "modules/car/leasepurchase.html";
                }
                var index = layer.open({
                    title: title,
                    type: 2,
                    content: url,
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.carBasicSource = Object.assign({},iframe.vm.carBasicSource,vm.sourceDataList[0]);
                        iframe.vm.balancePaymentLst = vm.feeItemLst;
                        iframe.vm.fileLst = vm.basicSourceFileLst;
                        iframe.vm.feeItemId = vm.sourceDataList[0].feeItemId;
                        if(vm.workType == 2){
                            iframe.vm.isEdit = true;
                            iframe.vm.promptFlag = false;
                        }else if(vm.workType == 1){
                            iframe.vm.promptFlag = true;
                        }
                        iframe.vm.reloadFeeItem();
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }
        },
        /* //选择GPS 设备
         selectGPS:function () {
             var index = layer.open({
                 title: "选择GPS设备",
                 type: 2,
                 content: tabBaseURL + "modules/deviceinformation/selectgpsdevice.html",
                 end: function(){

                 }
             });
             layer.full(index);
         },*/
        resetDeviceNo:function () {
            vm.tCarBasic.deviceId=null;
            vm.tCarBasic.gpsDeviceNo=null;
            vm.tCarBasic.manufacturerNumber=null;
        },

        /***
         * 按钮点击切换
         * @param param
         * @param val
         */
        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },
        /**
         * 刷新
         */
        reloadRecordTable: function(){
            vm.initEditData(vm.tCarBasic.carId);
            layui.table.reload('test8id', {
                data: vm.recordData
            });
        },
        //初始化列表
        initAllGrid:function(){
            /**
             * 违章列表
             */
            layui.config({
                base: '../../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            });
            layui.use(['form', 'element', 'table', 'soulTable'], function () {
                soulTable = layui.soulTable
                layui.table.render({
                    id: "test1id",
                    elem: '#test1',
                    data:vm.illegalData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',fixed: 'left',type:'numbers'},
                        {field:'contractNo', minWidth:100, title: '合同编号',align: "center",templet: function (d) {return isEmpty(d.contractNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'contact', minWidth:100, title: '联系电话',align: "center",templet: function (d) {return isEmpty(d.contact);}},
                        {field:'illegalContent', minWidth:100, title: '违章内容',align: "center",templet: function (d) {return isEmpty(d.illegalContent);}},
                        {field:'illegalAddr', minWidth:100, title: '违章地点',align: "center",templet: function (d) {return isEmpty(d.illegalAddr);}},
                        {field:'illegalTime', minWidth:100, title: '违章时间',align: "center",templet: function (d) {return isEmpty(d.illegalTime);}},
                        {field:'illegalPoints', minWidth:100, title: '扣分',align: "center",templet: function (d) {return isEmpty(d.illegalPoints);}},
                        {field:'illegalFine', minWidth:100, title: '违章罚款/元',align: "center",templet: function (d) {return isEmpty(d.illegalFine);}},
                        {field:'illegalHandleStatus', minWidth:100, title: '处理状态',align: "center",templet: function (d) {return isEmpty(d.illegalHandleStatus);}},
                        {field:'illegalLog', minWidth:100, title: '违章记录备注',align: "center",templet: function (d) {return isEmpty(d.illegalLog);}},
                        {field:'illegalLogDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.illegalLogDate);}}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: true,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test1id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 保险列表
                 */
                layui.table.render({
                    id: "test2id",
                    elem: '#test2',
                    data:vm.insuranceData,
                    cols: [
                        [
                            {rowspan: 2,field:'zizeng', minWidth:100, title: '序号',align: "center",type:'numbers'},
                            {rowspan: 2,field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                            {rowspan: 2,field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                            {field:'a', minWidth:100, title: '交强险',colspan:6,align:'center'},
                            {field:'b', minWidth:100, title: '商业险',colspan:7,align:'center'}
                        ],
                        [
                            {field:'applyNoQx', minWidth:100, title: '申请单号',align: "center",templet: function (d) {return isEmpty(d.applyNoQx);}},
                            {field:'compulsoryCompany', minWidth:100, title: '保险公司名称',align: "center",templet: function (d) {return isEmpty(d.compulsoryCompany);}},
                            {field:'applyTypeQx', minWidth:100, title: '保单时效',align: "center"},
                            {field:'insuranceStartQx', minWidth:100, title: '开始时间',align: "center",templet: function (d) {return isEmpty(d.insuranceStartQx);}},
                            {field:'insuranceEndQx', minWidth:100, title: '结束时间',align: "center",templet: function (d) {return isEmpty(d.insuranceEndQx);}},
                            {field:'insuranceFeeQx', minWidth:100, title: '费用/元',align: "center",templet: function (d) {return isEmpty(d.insuranceFeeQx);}},
                            {field:'applyNoSy', minWidth:100, title: '申请单号',align: "center",templet: function (d) {return isEmpty(d.applyNoSy);}},
                            {field:'commercialCompany', minWidth:100, title: '保险公司名称',align: "center",templet: function (d) {return isEmpty(d.commercialCompany);}},
                            {field:'applyTypeSy', minWidth:100, title: '保单时效',align: "center"},
                            {field:'insuranceTypeSy', minWidth:100, title: '险种',align: "center",templet: function (d) {return isEmpty(d.insuranceTypeSy);}},
                            {field:'insuranceStartSy', minWidth:100, title: '开始时间',align: "center",templet: function (d) {return isEmpty(d.insuranceStartSy);}},
                            {field:'insuranceEndSy', minWidth:100, title: '结束时间',align: "center",templet: function (d) {return isEmpty(d.insuranceEndSy);}},
                            {field:'insuranceFeeSy', minWidth:100, title: '总费用/元',align: "center",templet: function (d) {return isEmpty(d.insuranceFeeSy);}}
                        ],
                    ],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test2id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 年检列表
                 */
                layui.table.render({
                    id: "test3id",
                    elem: '#test3',
                    data:vm.vehicleData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',fixed: 'left',type:'numbers'},
                        {field:'applyNo', minWidth:100, title: '年检申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'vehicleStatus', minWidth:100, title: '年检状态',align: "center",templet: function (d) {return isEmpty(d.vehicleStatus);}},
                        {field:'nowVehicleDate', minWidth:100, title: '本次年检时间',align: "center",templet: function (d) {return isEmpty(d.nowVehicleDate);}},
                        {field:'nextVehicleDate', minWidth:100, title: '下次年检时间',align: "center",templet: function (d) {return isEmpty(d.nextVehicleDate);}},
                        {field:'vehicleFee', minWidth:100, title: '费用/元',align: "center",templet: function (d) {return isEmpty(d.vehicleFee);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'vehicleLogDate', minWidth:100, title: '年检记录时间',align: "center",templet: function (d) {return isEmpty(d.vehicleLogDate);}},
                        {field:'vehicleLogUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.vehicleLogUser);}}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: true,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test3id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 保养列表
                 */
                layui.table.render({
                    id: "test4id",
                    elem: '#test4',
                    data:vm.maintenanceData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',fixed: 'left',type:'numbers'},
                        {field:'applyNo', minWidth:100, title: '保养申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'nowMills', minWidth:100, title: '当前公里数',align: "center",templet: function (d) {return isEmpty(d.nowMills);}},
                        {field:'nextMills', minWidth:100, title: '下次保养公里数',align: "center",templet: function (d) {return isEmpty(d.nextMills);}},
                        {field:'maintenanceDate', minWidth:100, title: '本次保养时间',align: "center",templet: function (d) {return isEmpty(d.maintenanceDate);}},
                        {field:'nextMaintenanceDate', minWidth:100, title: '下次保养时间',align: "center",templet: function (d) {return isEmpty(d.nextMaintenanceDate);}},
                        {field:'serviceName', minWidth:100, title: '服务站名称',align: "center",templet: function (d) {return isEmpty(d.serviceName);}},
                        {field:'maintenanceItem', minWidth:100, title: '保养项目',align: "center",templet: function (d) {return isEmpty(d.maintenanceItem);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'maintenanceTotalFee', minWidth:100, title: '保养项目合计费用',align: "center",templet: function (d) {return isEmpty(d.maintenanceTotalFee);}},
                        {field:'maintenanceLogUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.maintenanceLogUser);}},
                        {field:'maintenanceLogDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.maintenanceLogDate);}}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test4id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 出险列表
                 */
                layui.table.render({
                    id: "test5id",
                    elem: '#test5',
                    data:vm.outInsuranceData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',fixed: 'left',type:'numbers'},
                        {field:'applyNo', minWidth:100, title: '出险申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'receivableDate', minWidth:100, title: '接收时间',align: "center",templet: function (d) {return isEmpty(d.receivableDate);}},
                        {field:'outInsuranceDate', minWidth:100, title: '出险时间',align: "center",templet: function (d) {return isEmpty(d.outInsuranceDate);}},
                        {field:'outInsuranceAddr', minWidth:100, title: '出险地点',align: "center",templet: function (d) {return isEmpty(d.outInsuranceAddr);}},
                        {field:'user', minWidth:100, title: '报案人',align: "center",templet: function (d) {return isEmpty(d.user);}},
                        {field:'reason', minWidth:100, title: '出险经过及原因',align: "center",templet: function (d) {return isEmpty(d.reason);}},
                        {field:'qxInsuranceCompany', minWidth:100, title: '交强险公司',align: "center",templet: function (d) {return isEmpty(d.qxInsuranceCompany);}},
                        {field:'sxInsuranceCompany', minWidth:100, title: '商业险公司',align: "center",templet: function (d) {return isEmpty(d.sxInsuranceCompany);}},
                        {field:'level', minWidth:100, title: '事故等级',align: "center",templet: function (d) {return isEmpty(d.level);}},
                        {field:'responsibility', minWidth:100, title: '责任方',align: "center",templet: function (d) {return isEmpty(d.responsibility);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'logUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.logUser);}},
                        {field:'logDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.logDate);}}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test5id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 维修列表
                 */
                layui.table.render({
                    id: "test6id",
                    elem: '#test6',
                    data:vm.repairData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',fixed: 'left',type:'numbers'},
                        {field:'applyNo', minWidth:100, title: '维修申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'repairStatus', minWidth:100, title: '维修状态',align: "center",templet: function (d) {return isEmpty(d.repairStatus);}},
                        {field:'repairStart', minWidth:100, title: '维修开始时间',align: "center",templet: function (d) {return isEmpty(d.repairStart);}},
                        {field:'repairEnd', minWidth:100, title: '维修结束时间',align: "center",templet: function (d) {return isEmpty(d.repairEnd);}},
                        {field:'faultDesc', minWidth:100, title: '故障描述',align: "center",templet: function (d) {return isEmpty(d.faultDesc);}},
                        {field:'repairServiceName', minWidth:100, title: '维修服务站',align: "center",templet: function (d) {return isEmpty(d.repairServiceName);}},
                        {field:'totalFee', minWidth:100, title: '费用结算',align: "center",templet: function (d) {return isEmpty(d.totalFee);}},
                        {field:'repairContent', minWidth:100, title: '维修内容',align: "center",templet: function (d) {return isEmpty(d.repairContent);}},
                        {field:'repairStatus', minWidth:100, title: '维修状态',templet:function (d) {return isEmpty(d.repairStatus);}},
                        {field:'repairItemInfo', minWidth:100, title: '维修各详细项目费用',align: "center",templet: function (d) {return isEmpty(d.repairItemInfo);}},
                        {field:'logUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.logUser);}},
                        {field:'logDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.logDate);}}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test6id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 车辆订单记录
                 */
                layui.table.render({
                    id: "test7id",
                    elem: '#test7',
                    data: vm.orderData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',type:'numbers'},
                        {field:'contractNo', minWidth:100, title: '合同编号',align: "center",templet: function (d) {return isEmpty(d.contractNo);}},
                        {field:'rentType', minWidth:100, title: '租赁类型',align: "center",templet: function (d) {return isEmpty(d.rentType);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'orderStatus', minWidth:100, title: '状态',align: "center",templet: function (d) {return isEmpty(d.orderStatus);}},
                        {field:'statusExplain', minWidth:100, title: '车辆状态说明',align: "center",templet: function (d) {return isEmpty(d.statusExplain);}},
                        {field:'spareExplain', minWidth:100, title: '备用车说明',align: "center",templet: function (d) {return isEmpty(d.spareExplain);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'rentStart', minWidth:100, title: '租赁开始时间',align: "center",templet: function (d) {return isEmpty(d.rentStart);}},
                        {field:'rentEnd', minWidth:100, title: '租赁结束时间',align: "center",templet: function (d) {return isEmpty(d.rentEnd);}},
                        {field:'getCarDate', minWidth:100, title: '提车时间',align: "center",templet: function (d) {return isEmpty(d.getCarDate);}},
                        {field:'returnCarDate', minWidth:100, title: '实际还车时间',align: "center",templet: function (d) {return isEmpty(d.returnCarDate);}},
                        {field:'useDays', minWidth:100, title: '使用总天数',align: "center",templet: function (d) {
                            if (d.useDays > 0) {
                                return d.useDays;
                            } else
                            return 0;
                        }},
                        {field:'balanceType', minWidth:100, title: '欠款类型',align: "center",templet: function (d) {return isEmpty(d.balanceType);}},
                        {field:'balanceFee', minWidth:100, title: '欠款金额/元',align: "center",templet: function (d) {return isEmpty(d.balanceFee);}},
                        {field:'handleCarMills', minWidth:100, title: '交车公里数',align: "center",templet: function (d) {return isEmpty(d.handleCarMills);}},
                        {field:'returnCarMills', minWidth:100, title: '退车公里数',align: "center",templet: function (d) {return isEmpty(d.returnCarMills);}}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test7id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 车辆档案
                 */
                layui.table.render({
                    id: "test8id",
                    elem: '#test8',
                    data: vm.recordData,
                    cols: [[
                        {field:'recordName', title: '档案名称',align: "center",templet: function (d) {return isEmpty(d.recordName);}},
                        {field:'remark', title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'uploadTime', title: '上传时间',minWidth:100,maxWidth:150,align: "center",templet: function (d) {return isEmpty(d.uploadTime);}},
                        {field:'uploadUserName', title: '操作人',align: "center",templet: function (d) {return isEmpty(d.uploadUserName);}},
                        {title: '操作', minWidth:200, templet: '#barTpl', align:"center"}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false
                });

                /**
                 * 换牌信息
                 */
                layui.table.render({
                    id: "test13id",
                    elem: '#test13',
                    data: vm.vehicleCarList,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',fixed: 'left',type:'numbers'},
                        {field:'oldCarNo', minWidth:100, title: '更换之前的车牌号',align: "center",templet: function (d) {return isEmpty(d.oldCarNo);}},
                        {field:'vinNo', minWidth:100, title: '车架号',align: "center",templet: function (d) {return isEmpty(d.vinNo);}},
                        {field:'isVehicleCarPhoto', minWidth:100, title: '是否更换行驶证',align: "center",templet: function (d) {
                                if(d.isVehicleCarPhoto == 1){
                                    return '否';
                                }else if(d.isVehicleCarPhoto == 2){
                                    return '是'
                                }else{
                                    return '--';
                                }
                            }},
                        {field:'newCarNo', minWidth:100, title: '新更换的车牌号',align: "center",templet: function (d) {return isEmpty(d.newCarNo);}},
                        {field:'vehicleRemark', minWidth:100, title: '换牌原因',align: "center",templet: function (d) {return isEmpty(d.vehicleRemark);}},
                        {field:'oldDriverImg', minWidth:100, title: '更换之前的行驶证附件',align: "center"
                            ,templet: function (d) {
                                if(d.oldDriverImg!=null && d.oldDriverImg !=''){
                                    return "<span style='color:#419BEA;cursor:pointer;' onclick=checkFJ(\'"+d.oldDriverImg+"\')>查看</span>";
                                }else{
                                    return '--';
                                }
                            }
                        },
                        {field:'newDriverImg', minWidth:100, title: '新更换的行驶证附件',align: "center"
                            ,templet: function (d) {
                                if(d.newDriverImg!=null && d.newDriverImg!=''){
                                    return "<span style='color:#419BEA;cursor:pointer;' onclick=checkFJ(\'"+d.newDriverImg+"\')>查看</span>";
                                }else{
                                    return '--';
                                }
                            }
                        },
                        {field:'operateTime', minWidth:100, title: '更换操作时间',align: "center",templet: function (d) {return isEmpty(d.operateTime);}},
                        {field:'operator', minWidth:100, title: '操作人',align: "center",templet: function (d) {return isEmpty(d.operator);}}
                    ]],
                    // page: false,
                    // limits: [500],
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test13id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 车辆过户信息
                 */
                layui.table.render({
                    id: "test12id",
                    elem: '#test12',
                    data: vm.transferData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center", title: '序号',fixed: 'left',type:'numbers'},
                        {field:'estimatedTransferTime', minWidth:100, title: '预计过户时间',align: "center",templet: function (d) {return isEmpty(d.estimatedTransferTime);}},
                        {field:'transferTime', minWidth:100, title: '实际过户时间',align: "center",templet: function (d) {return isEmpty(d.transferTime);}},
                        {field:'remarks', minWidth:100, title: '备注信息',align: "center",templet: function (d) {return isEmpty(d.remarks);}},
                        {field:'file', minWidth:100, title: '过户资料',align: "center",templet:function(d){
                                if(d.file==0){
                                    return '--';
                                }else{
                                    return '<span style="color:blue;cursor:pointer;" onclick="previewFile(\''+d.transferId+'\')">查看</span>'
                                }
                            }},
                        {field:'createTime', minWidth:100, title: '操作时间',align: "center",templet: function (d) {return isEmpty(d.createTime);}},
                        {field:'operator', minWidth:100, title: '操作人',align: "center",templet: function (d) {return isEmpty(d.operator);}}
                    ]],
                    // page: false,
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test12id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });


                /**
                 * 车辆移库记录
                 */
                layui.table.render({
                    id: "test10id",
                    elem: '#test10',
                    data: vm.moveHouseData,
                    cols: [[
                        {field:'zizeng', width:60,align:"center",fixed: "left",title: '序号',type:'numbers'},
                        {field:'carPlateNo', minWidth:100, title: '车牌号',fixed: "left",align: "center",templet: function (d) {return isEmpty(d.carPlateNo);}},
                        {field:'vinNo', minWidth:100, title: '车架号',align: "center",templet: function (d) {return isEmpty(d.vinNo);}},
                        {field:'carBrandSeriesModelName', minWidth:100, title: '品牌/车系/车型',align: "center",templet: function (d) {return isEmpty(d.carBrandSeriesModelName);}},
                        {field:'moveType', minWidth:100, title: '移库类型',align: "center",templet: function (d) {return isEmpty(d.moveType);}},
                        {field:'outHouseName', minWidth:100, title: '移出仓库',align: "center",templet: function (d) {return isEmpty(d.outHouseName);}},
                        {field:'intoHouseName', minWidth:100, title: '移入仓库',align: "center",templet: function (d) {return isEmpty(d.intoHouseName);}},
                        {field:'transferTime', minWidth:100, title: '移库时间',align: "center",templet: function (d) {return isEmpty(d.transferTime);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'operatorDate', minWidth:100, title: '操作时间',align: "center",templet: function (d) {return isEmpty(d.operatorDate);}},
                        {field:'operator', minWidth:100, title: '操作人',align: "center",templet: function (d) {return isEmpty(d.operator);}}
                    ]],
                    // page: false,
                    // limit: 500,
                    page:true,
                    limit:10,
                    limits:[5,10,20,30],
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test10id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });
            });
        },
        //初始化车辆操作纪录
        initOperatorLog: function(){
            /**
             * 车辆操作纪录
             */
            layui.table.render({
                id: 'test11id',
                elem: '#test11',
                url: baseURL + 'sys/log/operationLogLst',
                where: {
                    businessNo: vm.tCarBasic.id,
                    auditType: 11
                },
                cols: [[
                    {field:'operatorName', title: '操作人', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.operatorName);}},
                    {field:'memo', title: '操作内容', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.memo);}},
                    {field:'timeCreate', title: '操作时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeCreate);}},
                ]],
                page: true,
                loading: false,
                limits: [10, 20, 50, 100],
                limit: 10
            });
        },
        /***
         * 查看车辆档案
         * @param id
         */
        detail: function(id){
            $.get(baseURL + "car/carrecord/info/"+id, function(r){
                var index = layer.open({
                    title: "查看车辆档案",
                    type: 2,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/car/carrecorddetail.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.carRecord = r.carRecord;
                        iframe.vm.deliveryFileLst = r.carRecord.deliveryFileLst;
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
            });
        },
        /**
         * 修改车辆档案
         * @param id
         */
        update: function (id) {
            $.get(baseURL + "car/carrecord/info/"+id, function(r){
                var index = layer.open({
                    title: "修改车辆档案",
                    type: 2,
                    area: ['80%', '80%'],
                    boxParams: {
                        data:r.carRecord
                    },
                    content: tabBaseURL + "modules/car/carrecord.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.carRecord = r.carRecord;
                        if(r.carRecord.deliveryFileLst != null){
                            iframe.vm.deliveryFileLst = r.carRecord.deliveryFileLst;
                        }else{
                            iframe.vm.deliveryFileLst = [];
                        }
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
            });
        },
        /***
         * 新增车辆档案
         */
        addCarRecord:function(){
            var index = layer.open({
                title: "新增车辆档案",
                type: 2,
                area: ['80%', '85%'],
                content: tabBaseURL + "modules/car/carrecord.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.carRecord.carId = vm.tCarBasic.id;
                },
                end: function(){
                    layer.close(index);
                }
            });
        },
        /**
         * 删除车辆档案记录
         * @param ids
         */
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/carrecord/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reloadRecordTable();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        /***
         * 返回列表关闭当前页面
         */
        closeReturn: function(){
            console.log('进来了')
            // parent.layer.close(parent.layer.getFrameIndex(window.name));//关闭当前页面
            // parent.vm.reload();
            closeCurrent()
        },
        /***
         * 多类型新增
         * @param type
         */
        addedType:function (type) {
            if(type === 'nj'){//年检
                addTab('modules/maintenance/inspectionmanageadd.html','新增年检',{"carId":vm.tCarBasic.carId})
            }else if(type === 'by'){//保养
                addTab('modules/maintenance/maintenancemanageadd.html','新增保养',{"carId":vm.tCarBasic.carId})
            }else if (type === 'bx'){//保险
                addTab('modules/maintenance/insurancemanageadd.html','新增保险',{"carId":vm.tCarBasic.carId})
            }else if (type === 'cx'){//出险
                addTab('modules/outinsuranceorder/outinsuranceorderadd.html','新增出险',{"carId":vm.tCarBasic.carId})
            }else if (type === 'wx'){//维修
                addTab('modules/carrepairorder/carrepairorderadd.html','新增维修',{"carId":vm.tCarBasic.carId})
            }else if (type === 'xd'){//下单
                var param = {
                   callback: function (orderType) {
                            var approve = '';
                            switch (parseInt(orderType)) {
                                case 1://经租
                                case 3: //展示车
                                case 4: {//试驾车
                                    approve = 'longRentOrderApprove';
                                    break;
                                }
                                case 2: {//以租代购
                                    approve = 'rentSaleOrderApprove';
                                    break;
                                }
                                case 5: {//融租
                                    approve = 'meltsRentOrderApprove';
                                    break;
                                }
                                case 6: {//直购
                                    approve = 'purchaseOrderApprove';
                                    break;
                                }
                                case 7: {//
                                    approve = 'affiliatedOrderApprove';
                                    break;
                                }
                                default: {
                                    approve = '';
                                }
                            }
                            $.get(baseURL + "mark/processnode/activitiEnable", {processKey: approve}, function (r) {
                               var param = {
                                    data: {},
                                    orderType: orderType
                                };
                                var url = r ? 'modules/order/placeorderedit.html' : 'modules/order/orderedit.html';
                                addTab(url,'新增订单',param)
                            });
                        }
                }
                addTab('modules/order/selectordertype.html','选择订单类型',param)
            }else if (type === 'wzcx'){//违章查询
                addTab('modules/car/carillegalquery.html','违章查询',{"carNo":vm.tCarBasic.carNo})
            }
        },
        /***
         * 刷新
         */
        refresh:function () {
            location.reload();
        }
    }
})


// 裁剪上传
var cropper;
var index;
var image = document.getElementById('cardImage');

// 画布
function cropperFun(imgBase64Data) {

    cropper = new Cropper(image, {
        viewMode: 1,
//                dragMode: 'none',
//                initialAspectRatio: 1,
//                preview: '.before',
//                background: true,
//                autoCropArea: 0.6
    })
    image.cropper.replace(imgBase64Data);
};

// 上传
function imageChange1(img) {
    var reader = new FileReader();
    reader.readAsDataURL(img.files[0]);
    reader.onload = function (e) {
        $('#imgDrivinglicenseFront').attr('src', '');
        $('#imgDrivinglicenseFront').attr('src', e.target.result);

        cropperFun(e.target.result);
        index = layer.open({
            title: "图片裁剪",
            type: 1,
            area: ['100%', '100%'],
            content: $("#choiceorderType"),
            end: function () {
                vm.choiceorderType = false;
                layer.close();
            }
        });
        //显示保存按钮
        vm.activeBtn = true;
    }
}

function imageClick() {
    $('#image2').val('');
    $('#image2').click();
};

// 裁剪
function clipImage() {
    vm.choiceorderType = false;
    var that = this;
    let baseUrl = image.cropper.getCroppedCanvas({
        imageSmoothingQuality: 'high'
    }).toDataURL('image/jpeg');
    $('#imgDrivinglicenseFront').attr('src', baseUrl);
    var arr = baseUrl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    var extension = mime.split('/')[1];

    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    var newFileImg = new File([u8arr], 'new_file_img.' + extension, {type: mime});
    var formatData = new FormData();
    formatData.append("files", newFileImg);
    formatData.append('path', "xsz_images")
    console.log(newFileImg);
    //上传图片
    uploadNewFile(formatData);
}

//上传裁剪后图片
function uploadNewFile(formatData) {
    $.ajax({
        type: "POST",
        url: baseURL + 'file/uploadFile',
        data: formatData,
        processData: false,
        contentType: false,
        async: false,
        success: function (res) {
            vm.imgDrivinglicenseFront = res.data[0];
            rcrXsz(res.data[0]);
            layer.close(index);
        },
        error: function (e) {
            layer.close(index);
            console.log(e);
        }
    });
}

/**
 * 行驶证识别
 */
function rcrXsz(pathUrl) {
    $.ajax({
        type: "GET",
        url: baseURL + "car/tcarbasic/getCarDataByXszUrl?drivingLicenseUrl=" + pathUrl,
        data: null,
        success: function (result) {
            if (result.code == 0) {
                alert("识别行驶证照片成功！");
                Vue.set(vm.tCarBasic, "carOwner", result.driverData.carOwner);
                Vue.set(vm.tCarBasic, "carType", result.driverData.carType);
                Vue.set(vm.tCarBasic, "carOwnerAddr", result.driverData.carOwnerAddr);
                Vue.set(vm.tCarBasic, "useType", result.driverData.useType);
                Vue.set(vm.tCarBasic, "carModelNo", result.driverData.carModelNo);
                Vue.set(vm.tCarBasic, "registerDate", result.driverData.registerDate);
                Vue.set(vm.tCarBasic, "licenseDate", result.driverData.licenseDate);
                Vue.set(vm.tCarBasic, "carNo", result.driverData.carPlateNo);
                Vue.set(vm.tCarBasic, "vinNo", result.driverData.vinNo);
                Vue.set(vm.tCarBasic, "engineNo", result.driverData.engineNo);
                //显示保存按钮
                vm.activeBtn = true;
            } else {
                vm.choiceorderType = false;
                alert("未识别出行驶证照片！")
            }
        },
        error:function (res) {
            vm.choiceorderType = false;
            console.log(e);
        }
    });
}


function checkFJ(url){
    if (viewer != null) {
        viewer.close();
        viewer = null;
    }
    viewer = new PhotoViewer([
        {
            src: imageURL + url,
            title: "驾驶证查看"
        }
    ], {
        appendTo: 'body',
        zIndex: 99891018
    });
}
function previewFile(transferId){
    var index = layer.open({
        title: '过户资料查看',
        type: 2,
        content: tabBaseURL + "modules/car/file.html",
        success: function(layero,num){
            var iframe = window['layui-layer-iframe'+num];
            iframe.vm.initTransferData(transferId,26);
        },
        end: function () {
            layer.closeAll();
        }
    });
    layer.full(index);
}

