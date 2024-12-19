$(function () {
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

        form.on('select(carCategory)', function (data) {
            vm.tCarBasic.carCategory = data.value;
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
            fidedesc: '车辆详情照片'
        });
        upload.initView();


        // layui.upload.render({
        //     elem: '#imgDrivinglicenseFront',
        //     url: baseURL + 'file/uploadMonofile',
        //     data: {'path': 'doc'},
        //     field: 'file',
        //     auto: true,
        //     size: 30 * 1024 * 1024,
        //     accept: 'file', //普通文件,
        //     multiple: true,
        //     number:20,
        //     acceptMime: '.jpg,.png,.jpeg',
        //     exts: 'jpg|png|jpeg', //
        //     done: function (res) {
        //         if (res.code == '0') {
        //             console.log(res.data);
        //             $('#imgDrivinglicenseFront').attr('src', '');
        //             $('#imgDrivinglicenseFront').attr('src', imageURL+res.data);
        //             cropperFun(imageURL+res.data);
        //             index = layer.open({
        //                 title: "图片裁剪",
        //                 type: 1,
        //                 area: ['100%', '100%'],
        //                 content: $("#choiceorderType"),
        //                 end: function () {
        //                     vm.choiceorderType = false;
        //                     layer.close();
        //                 }
        //             });
        //         } else {
        //             layer.msg('上传失败', {icon: 5});
        //         }
        //     },
        //     error: function () {
        //         layer.msg('上传失败', {icon: 5});
        //     }
        // });
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

    var importaaa = new Import({
        elid:'impBody',
        typeStr:'车辆',
        templetUrl:"importData/cl/cldr.xls",
        actionUrl:'car/tcarbasic/import',
        fieldName:'file',
        hasShowReview: false,
        reviewFieldTransformMap:{
            businessType:{1:'整备中',2:'备发车',3:'预定中',4:'用车中',5:'已过户',6:'已处置',7:'已出售'},
            sideDoor:{1:'有',2:'无'}
        }
    }).initView();
    // importaaa.hasShowReview = false;

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
    // 加载渲染所有layui组件
    layui.form.render();
});
var upload;
var viewer;
var carDataBackup;
var vm = new Vue({
    el: '#rrapp',
    data: {
        hetong:false,
        checked:true,
        box:{
            box1:true
        },
        tCarBasic: {isDisputeCar:1,businessType:1,isFaultCar:1,hpCode:'02',hpName:'小型汽车'},
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
        hpList:[],
        // 供应商列表
        purchasesupplierList:[],
        purchasesupplierMap: {},
        // 车务列表
        vehicleUserList:[],
        vehicleUserMap:{},
        carCategoryList:[
            {name:"自有",
            value:0},
            {name:"合作",
                value:1},
            {name:"外调",
                value:2}
        ],
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
        retractChange:function(data){
            if(data == 1){
                this.hetong = false
            }
        },
        expandChange:function(data){
            console.log(1)
            if(data == 1){
                this.$nextTick(()=>{
                    this.hetong = true
                })
                
            }
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
        initEditData: function(id){
            $.ajax({
                type: "POST",
                url: baseURL + 'car/tcarbasic/info/' + id,
                contentType: "application/json",
                success: function (r) {
                    vm.tCarBasic = r.tCarBasic;
                    carDataBackup = JSON.parse(JSON.stringify(r.tCarBasic));
                    if(r.tCarBasic.imgDrivinglicenseFront!=null && r.tCarBasic.imgDrivinglicenseFront!=''){
                        vm.imgDrivinglicenseFront = r.tCarBasic.imgDrivinglicenseFront;
                        $("#imgDrivinglicenseFront").prop("src",imageURL+r.tCarBasic.imgDrivinglicenseFront);
                    }
                    // vm.fileLst = r.tCarBasic.fileLst;
                    upload.updateFile(r.tCarBasic.fileLst);
                    vm.sourceDataList = r.sourceDataList;
                    vm.basicSourceFileLst = r.basicSourceFileLst;
                    vm.feeItemLst = r.feeItemLst;
                    if(vm.sourceDataList!=null && vm.sourceDataList.length>0 ){
                        vm.sourceDetailContent = true;
                        vm.editSourceGrid(vm.tCarBasic.sourceType);
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
                    if (vm.tCarBasic.businessType == 3 || vm.tCarBasic.businessType == 4){
                        $('#storageTime').attr('disabled','disabled');
                    }
                }
            });
        },
        confirmSup: function(data){
            vm.tCarBasic.purchaseSupplierId=data.data.purchaseSupplierId;
            vm.tCarBasic.purchaseSupplierName=data.data.supplierName;
            $("#purchaseSupplierName").val(data.data.supplierName);
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
                limit: 500,
                done: function (res, curr, count) {
                    if(vm.plan === 1){
                        $('#updateplan').css("display",'none');
                        $('#viewplan').css("display",'block');
                    }
                    if(vm.plan === 2){
                        $('#updateplan').css("display",'block');
                        $('#viewplan').css("display",'none');
                    }
                }
            });
            layui.table.on('tool(grid)', function (obj) {
                vm.obj = obj;
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
                        iframe.vm.balancePaymentLst = vm.feeItemLst;
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
            vm.tCarBasic.vinNo=vm.tCarBasic.vinNo.replace(/\s*/g,"");
            if(vm.tCarBasic.carNo!="undefined"&&vm.tCarBasic.carNo!=null){
                vm.tCarBasic.carNo=vm.tCarBasic.carNo.replace(/\s*/g,"");
            }
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
                                    parent.layer.closeAll();
                                    parent.vm.initStatusCar();
                                    parent.vm.initTableCols();
                                    parent.vm.reload();
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
}

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
    }
}

function imageClick() {

    $('#image2').val('');
    $('#image2').click();
}

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

