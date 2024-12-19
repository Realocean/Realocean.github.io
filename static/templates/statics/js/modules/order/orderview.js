$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});
var viewer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        feeItemLstShow: false,
        tenancyCalcType: 1,
        detailsTabContentList: [
            '车辆订单详情',
            '还款明细',
            '操作记录',
        ],
        detailsSupTabContentList: [
            '基本信息',
            '车辆信息',
            '交车信息',
            '合同信息',
            '其他关联单据',
            '退车信息',
            '换车信息',
            '换车记录',
            '续租信息',
            '过户信息',
            '费用减免'
        ],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        order: {},
        meltsRent:false, //融租
        leasePurchase:false, //以租代购
        directPurchase:false, //直购
        longRent:false, //经租
        isShow:false,
        isEditSalePerson:false,
        oldOrderCarShow:false, //是否显示续租订单号,
        orderFileLst: [],
        deliveryFileLst: [],
        contractFileLst: [],
        orderreleFileLst: [],
        bpmChartList: [],
        accessoryItems: [],
        salePersonList: [],
        instanceId: null,
        contentViewId: 'contentViewId_0',
        lessor_title:'出租方',
        leasee_title:'承租方'
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        if(param.id){
            $.get(baseURL + "order/order/info/" + param.id, function (r) {
                _this.order = r.order;
                _this.order.contractContentUrl =   _this.order.contract.urlHtm ||  _this.order.contractContentUrl;

            });
        }else{
            _this.order = param.data;
        }
        if (_this.order.contract != null){
            _this.contractFileLst = _this.order.contract.fileLst;

            /*$.get(baseURL + "contract/contraccontent/bodyByContract/"+_this.order.contract.id, function(r){
                _this.order.contract.body = r;
            });*/
        }
        var instanceId = param.instanceId;
        var processKey = param.processKey;
        if (isNotEmpty(instanceId) && isNotEmpty(processKey)){
            _this.detailsSupTabContentList.push('审核信息');
        }
        _this.instanceId = param.instanceId;
        // if (isNotEmpty(instanceId) && isNotEmpty(processKey)){
        //     $.get(baseURL + "activity/bpmApproveList?instanceId=" + instanceId, function (r) {
        //         _this.bpmChartList = r.bpmChartList;
        //     });
        // }
        // if (_this.bpmChartList == null || _this.bpmChartList.length < 1) _this.bpmChartList = [];
        // if (_this.bpmChartList.length > 0){
        //     _this.detailsSupTabContentList.push('审核信息');
        // }
        $.get(baseURL + "sys/config/getparam/tenancy_calc_type", function (r) {
            if (r.config != null){
                _this.tenancyCalcType = parseInt(r.config['paramValue']);
            } else {
                _this.tenancyCalcType = 1;
            }
        });
        $.get(baseURL + "order/order/getOrderAccessory/" + _this.order.orderCar.id, function (r) {
            if (r['orderFileLst'] != null && r['orderFileLst'].length > 0){
                _this.orderFileLst = r['orderFileLst'];
            }
            if (r['deliveryFileLst'] != null && r['deliveryFileLst'].length > 0){
                _this.deliveryFileLst = r['deliveryFileLst'];
            }
            // if (r['contractFileLst'] != null && r['contractFileLst'].length > 0){
            //     _this.contractFileLst = r['contractFileLst'];
            // }
            if (r['orderreleFileLst'] != null && r['orderreleFileLst'].length > 0){
                _this.orderreleFileLst = r['orderreleFileLst'];
            }
        });
        $.get(baseURL + "sys/dict/getInfoByType/accessoryItem", function (r) {
            _this.accessoryGroupList = r.dict;
            if (_this.accessoryGroupList != null && _this.accessoryGroupList.length > 0){
                var parent = $('#accessoryGroup');
                _this.accessoryGroupList.forEach(function (d) {
                    parent.append('<input type="checkbox" disabled v-model="accessoryItems" name="accessoryItems" value="'+d.value+'" lay-skin="primary" title="'+d.value+'">');
                });
            }
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.salePersonList=r.usrLst;
        });
        if(_this.order == null){
            _this.order ={};
        }
        if(_this.order.plan == null){
            _this.order.plan ={};
        }
        if(_this.order.orderCar == null){
            _this.order.orderCar ={};
        }else{
            if(_this.order.orderCar.rentType!=null){
                if(_this.order.orderCar.rentType == 5){
                    _this.meltsRent = true;
                }
                if(_this.order.orderCar.rentType == 2){
                    _this.leasePurchase = true;
                }
                if(_this.order.orderCar.rentType == 6){
                    _this.directPurchase = true;
                }
                if(_this.order.orderCar.rentType == 1 || _this.order.orderCar.rentType == 7){
                    _this.longRent = true;
                }
            }
            if(_this.order.orderCar.tenancy == null || _this.order.orderCar.tenancy == '' || _this.order.orderCar.tenancy == 'null'){
                _this.order.orderCar.tenancy = calculateDateDifferMonths(_this.order.orderCar.timeStartRent,_this.order.orderCar.timeFinishRent,_this.tenancyCalcType);
            }
        }
        if(_this.order.planList == null){
            _this.order.planList =[];
        }
        if(_this.order.plan.feeLst == null){
            _this.order.plan.feeLst = [];
        }else{
            _this.feeItemLstShow = true;
        }
        if (_this.order.moneyPlanList != null && _this.order.moneyPlanList.length > 0){
            for (var i = 0; i < _this.order.plan.feeLst.length; i++) {
                var item1 = _this.order.plan.feeLst[i];
                for (var j = 0; j < _this.order.moneyPlanList.length; j++) {
                    var item2 = _this.order.moneyPlanList[j];
                    if (item1.id == item2.id){
                        _this.order.plan.feeLst.splice(i,1);
                        i = i - 1;
                    }
                }
            }
        }
        if (_this.order.plan.feeLst.length < 1){
            _this.feeItemLstShow = false;
        }
        if(_this.order.oldPlan == null){
            _this.order.oldPlan ={};
        }
        if(_this.order.orderCar.deliveryFileLst == null){
            _this.order.orderCar.deliveryFileLst =[];
        }
        if(_this.order.orderCar.accessoryItemList == null){
            _this.order.orderCar.accessoryItemList =[];
        }
        if (_this.order.orderCar.accessoryItemsName != null && _this.order.orderCar.accessoryItemsName !== ''){
            _this.accessoryItems = _this.order.orderCar.accessoryItemsName.split(',');
        }
        if(_this.order.relRecordList!=null && _this.order.relRecordList.length>0){
            _this.oldOrderCarShow = true;
        }
        if(_this.order.contract == null){
            _this.order.contract = {};
            // _this.detailsSupTabContentList=_this.detailsSupTabContentList.filter(t => t != "合同信息");
        }
        if(_this.order.orderCar.transferCar == null){
            _this.order.orderCar.transferCar = {};
            _this.detailsSupTabContentList=_this.detailsSupTabContentList.filter(t => t != "过户信息");
        }
        if(_this.order.renewalList == null || _this.order.renewalList.length == 0){
            _this.order.renewalList = [];
            _this.detailsSupTabContentList=_this.detailsSupTabContentList.filter(t => t != "续租信息");
        }
        if(_this.order.orderCar.orderCarReturnAlteration == null){
            _this.order.orderCar.orderCarReturnAlteration ={};
            _this.detailsSupTabContentList=_this.detailsSupTabContentList.filter(t => t != "退车信息");
        }
        if(_this.order.orderCar.orderCarTransferAlteration == null){
            _this.order.orderCar.orderCarTransferAlteration ={};
            _this.detailsSupTabContentList=_this.detailsSupTabContentList.filter(t => t != "换车信息");
        }
        if (_this.order.orderType == 2) {
            _this.detailsSupTabContentList=_this.detailsSupTabContentList.filter(t => t != "合同信息");
        }
        if(_this.order.orderCar.replacedVehicleList == null){
            _this.order.orderCar.replacedVehicleList =[];
        }
        if(_this.order.orderCar.replacementVehicleList == null){
            _this.order.orderCar.replacementVehicleList =[];
        }
        if(_this.order.orderCar.receivablesList == null){
            _this.order.orderCar.receivablesList =[]
        }
        if(_this.order.orderCar.orderCarRelation == null){
            _this.order.orderCar.orderCarRelation ={
                totalViolation :0,
                notHandleViolation:0,
                totalRepair:0,
                totalInsurance:0,
                totalMaintain:0
            };
        }
        if(_this.order.orderCar.replacementVehicleList.length == 0 && _this.order.orderCar.replacedVehicleList.length == 0 ){
            _this.detailsSupTabContentList=_this.detailsSupTabContentList.filter(t => t != "换车记录");
        }
        if(_this.order.orderCar.orderCarReturnAlteration.sysAccessoryList == null){
            _this.order.orderCar.orderCarReturnAlteration.sysAccessoryList =[];
        }
        if(_this.order.orderCar.orderCarTransferAlteration.sysAccessoryList == null){
            _this.order.orderCar.orderCarTransferAlteration.sysAccessoryList =[];
        }
        if(_this.order.orderCar.orderCarReturnAlteration.feeItemList == null){
            _this.order.orderCar.orderCarReturnAlteration.feeItemList =[];
        }
        if(_this.order.orderCar.orderCarTransferAlteration.feeItemList == null){
            _this.order.orderCar.orderCarTransferAlteration.feeItemList =[];
        }
        if (_this.order.orderCar.rentType == 6) {
            _this.lessor_title = '售卖方';
            _this.leasee_title = '购买方';
        }


        _this.detailsSupTabContentList.push('还款明细')
        _this.detailsSupTabContentList.push('操作记录')

        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        printBack: function(){
            layer.open({
                title: "打印预览",
                type: 2,
                boxParams:{
                    alterationId: vm.order.orderCar.orderCarReturnAlteration.id,
                    alterationType: vm.order.orderCar.orderCarReturnAlteration.alterationType,
                    repayAmount: vm.order.orderCar.orderCarReturnAlteration.repayAmount,
                    repayType: vm.order.orderCar.orderCarReturnAlteration.repayType,
                    order: vm.order
                },
                area: ['100%', '100%'],
                content: tabBaseURL+"modules/order/print_back.html",
                end: function(){
                    vm.reload();
                }
            });
        },
        printTransfer: function(){
            layer.open({
                title: "打印预览",
                type: 2,
                area: ['100%', '100%'],
                boxParams:vm.order.orderCar.orderCarTransferAlteration.id,
                content: tabBaseURL+"modules/order/print_transfer.html",
                end: function(){
                    vm.reload();
                }
            });

        },
        getFileData:function (data){
            let param={
                data:data
            }
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL +"modules/common/approvefileview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        transferCar: function(){
            //申请过户
            layer.confirm('请您确认过户车辆相关金额是否已交清', {btn: ['取消','已交清']},
                function(){
                    layer.closeAll();
                },
                function(){
                    $.get(baseURL + "order/order/info/" + vm.order.orderCar.id, function (r) {
                        if(r.order.orderCar.isTransferCar == 0){
                            alert("订单有应收未收金额，请财务确认收款后进行过户！");
                            return false;
                        }else{
                            var index = layer.open({
                                title: "申请过户",
                                type: 2,
                                content: tabBaseURL + "modules/car/cartransferedit.html",
                                success: function(layero,num){
                                    var iframe = window['layui-layer-iframe'+num];
                                    iframe.vm.carTransfer = Object.assign({},iframe.vm.carTransfer,{
                                        orderNo:vm.order.orderCar.id,
                                        orderCarNo:vm.order.orderCar.code,
                                        carId:vm.order.orderCar.carId,
                                        estimatedTransferTime:vm.order.orderCar.transferCar.estimatedTransferTime,
                                        transferTime:vm.order.orderCar.transferCar.transferTime,
                                        operatorId:vm.order.orderCar.transferCar.operatorId,
                                        operator:vm.order.orderCar.transferCar.operator,
                                        remarks:vm.order.orderCar.transferCar.remarks,
                                        transferId:vm.order.orderCar.transferCar.transferId
                                    });
                                    iframe.vm.deliveryFileLst = vm.order.orderCar.transferFileLst;
                                },
                                end: function () {
                                    vm.showForm = false;
                                    layer.closeAll();
                                }
                            });
                            vm.showForm = true;
                            layer.full(index);
                        }
                    });

                });
        },
        reload:function(){
            //父级页面调用，勿删除
        },
        rentOrderNo: function(oldOrderCarId){
            $.get(baseURL + "order/order/info/" + oldOrderCarId, function (r) {
                var param = {
                    data: r.order
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/orderview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = 0;
                vm.detailsSupTabContentListActiveValue = '基本信息';
            }else{
                vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
            }
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
        showDoc: function (url, fileName) {
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
        downDoc: function (url, fileName) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        applyRenturnOrTransferCar: function (type) {
            var title="申请退车";
            var processKey = '';
            var url = ''
            if(type == 1){
                if(vm.order.orderCar.rentType == 2 || vm.order.orderCar.rentType == 5){
                    title="申请换车";
                    processKey = 'rentSaleTransferCar'
                    url = "modules/order/applyrenttransfercar.html";
                }else{
                    title="申请换车";
                    processKey = 'rentTransferCar'
                    url = "modules/order/applytransfercar.html";
                }
            }else{
                if(vm.order.orderCar.rentType == 2 || vm.order.orderCar.rentType == 5){
                    processKey = 'rentSaleApprove'
                    url = "modules/order/applyrentback.html";
                }else if(vm.order.orderCar.rentType == 6){
                    processKey = 'purchaseBackApprove'
                    url = "modules/order/applypurchaseback.html";
                }else{
                    processKey = 'carBackApprove'
                    url = "modules/order/applycarback.html";
                }
            }
            window.localStorage.setItem("code",vm.order.orderCar.code);
            window.localStorage.setItem("type",type);
            //查看流程审批是否启动
            $.get(baseURL + "mark/processnode/activitiEnable",{processKey:processKey}, function (r) {
                if(r && vm.order.orderCar.rentType != 8){
                    var param = {
                        viewTag: 'apply',
                        data: vm.order
                    };
                    var index = layer.open({
                        title: title,
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + url,
                        end: function () {
                            window.localStorage.setItem("code",null);
                            window.localStorage.setItem("type",null);
                            closePage();
                        }
                    });
                    layer.full(index);
                }else{
                    var index = layer.open({
                        title: title,
                        type: 2,
                        boxParams: {
                            processKey:processKey
                        },
                        content: tabBaseURL + "modules/order/applyFor.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.initOrderData(vm.order);
                        },
                        end: function () {
                            window.localStorage.setItem("code",null);
                            window.localStorage.setItem("type",null);
                            closePage();
                        }
                    });
                    layer.full(index);
                }
            });
        },
        toOtherPage:function(type,id){
            if (!isNotEmpty(id)){
                return;
            }
            if(type == 1){
                window.localStorage.setItem("id",id);
                var index = layer.open({
                    title: "客户详情",
                    type: 2,
                    content: tabBaseURL + "modules/customer/customerdetail.html",
                    end: function () {
                        window.localStorage.setItem("id",null);
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 2){
                var index = layer.open({
                    title: "车辆详情",
                    type: 2,
                    content: tabBaseURL + "modules/car/tcarbasicdetail.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.initEditData(id);
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 3){
                var index = layer.open({
                    title: "违章列表",
                    type: 2,
                    content: tabBaseURL + "modules/car/carillegal.html",
                    boxParams:vm.order.orderCar.carNo,
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 4){
                var index = layer.open({
                    title: "出险记录",
                    type: 2,
                    content: tabBaseURL + "modules/outinsuranceorder/outinsuranceorder.html",
                    boxParams:vm.order.orderCar.carNo,
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 5){
                var index = layer.open({
                    title: "保养记录",
                    type: 2,
                    content: tabBaseURL + "modules/maintenance/maintenancemanage.html",
                    boxParams:vm.order.orderCar.carNo,
                    /*success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.q.carPlateNo = vm.order.orderCar.carNo;
                        iframe.vm.initParam(vm.order.orderCar.carNo);
                    },*/


                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else if(type == 6){
                var index = layer.open({
                    title: "维修记录",
                    type: 2,
                    content: tabBaseURL + "modules/carrepairorder/carrepairorder.html",
                    carPlateNoVinNo:vm.order.orderCar.carNo,
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }
        },
        viewAccessoryOrder:function(){
            //订单附件查看
            window.localStorage.setItem("objType", 27);
            window.localStorage.setItem("objId", vm.order.orderCar.id);
            window.localStorage.setItem("objCode", vm.order.orderCar.code);
            var index = layer.open({
                title: "车辆订单管理 > 订单表 >查看订单详情 > 订单附件",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },
        viewAccessoryTransfer :function(){
            //合同附件查看
            window.localStorage.setItem("objType", 26);
            window.localStorage.setItem("objId", vm.order.orderCar.transferCar.transferId);
            window.localStorage.setItem("objCode", null);
            var index = layer.open({
                title: "车辆订单管理 > 订单表 >查看订单详情 > 过户资料",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },
        viewAccessoryContract:function(){
            //合同附件查看
            window.localStorage.setItem("objType", 4);
            window.localStorage.setItem("objId", vm.order.contract.id);
            window.localStorage.setItem("objCode", vm.order.contract.code);
            var index = layer.open({
                title: "车辆订单管理 > 订单表 >查看订单详情 > 合同附件",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },
        // 附件查看
        viewAccessory:function(){
            window.localStorage.setItem("objType", 8);
            window.localStorage.setItem("objId", vm.order.orderCar.id);
            window.localStorage.setItem("objCode", vm.order.orderCar.code);
            var index = layer.open({
                title: "车辆订单管理 > 订单表 >查看订单详情 > 交车附件",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },
        downloadDoc: function () {
            var uri = baseURL + 'file/download?uri='+encodeURI(vm.order.contract.urlPdf)+"&fileName="+vm.order.contract.code+".pdf";
            window.location.href = uri;
        },
        printDoc: function () {
            // var urlPath = vm.order.contractContentUrl || vm.order.contract.urlHtm;
            //
            // var htmlUrl = location.origin+'/image-server/' + urlPath;
            //
            // htmlUrl = htmlUrl.replace(/\\/g, '/');
            // console.log("打印地址：",htmlUrl);
            // // 查找最后一个“/”，并截取之前的内容
            // var htmlUrlPrefix = htmlUrl.substring(0,htmlUrl.lastIndexOf("/"));
            // var htmlContent = $("#docIframe1")[0].contentWindow.document.body.outerHTML;
            // if (htmlContent) {
            //     htmlContent = htmlContent.replaceAll("./",htmlUrlPrefix+"/");
            //     PrintHtml(htmlContent);
            // } else {
            //     printJS({printable: vm.order.contract.base64, type: 'pdf', base64: true});
            // }
            if (vm.order && vm.order.contract && vm.order.contract.base64 && vm.order.contract.base64 != '') {
                printJS({printable: vm.order.contract.base64, type: 'pdf', base64: true});
            } else {
                var urlPath = vm.order.contractContentUrl || vm.order.contract.urlHtm;

                var htmlUrl = location.origin+'/image-server/' + urlPath;

                htmlUrl = htmlUrl.replace(/\\/g, '/');
                console.log("打印地址：",htmlUrl);
                // 查找最后一个“/”，并截取之前的内容
                var htmlUrlPrefix = htmlUrl.substring(0,htmlUrl.lastIndexOf("/"));
                var htmlContent = $("#docIframe1")[0].contentWindow.document.body.outerHTML;

                htmlContent = htmlContent.replaceAll("./",htmlUrlPrefix+"/");
                PrintHtml(htmlContent);
            }
            // if (vm.order.contract.body) {
            //     PrintHtml(vm.order.contract.body);
            // }else {
            //     printJS({printable: vm.order.contract.base64, type: 'pdf', base64: true});
            //
            // }
        },
        regenerateDoc: function () {
            var defaultTemplate = null;
            if (vm.order.contract.templateBody != null && vm.order.contract.templateBody !== '') {
                defaultTemplate = {
                    nameTpl: "当前订单使用模板",
                    countUse: "--",
                    desc: "当前订单使用模板",
                    operationName: "--",
                    timeCreate: "",
                    body: vm.order.contract.templateBody,
                    id: -1,
                }
            }
            var _index = layer.open({
                title: "选择合同模板",
                type: 2,
                area: ['80%', '80%'],
                boxParams: {
                    editTemplate: true,
                    defaultTemplate: defaultTemplate,
                    rentType: vm.order.orderCar.rentType,
                    action: 'regenerateDocSelector',
                    callback: function (templateId, nameTpl, body) {
                        layer.confirm('确定要根据该模板生成合同？', function(index) {
                            var map = {
                                templateId: templateId,
                                orderCarId: vm.order.orderCar.id,
                                oldContractId: vm.order.contract.id||-1,
                                templateBody: body,
                            };
                            PageLoading();
                            $.ajax({
                                type: "POST",
                                url: baseURL + 'order/order/regenerateDoc',
                                contentType: "application/json",
                                data: JSON.stringify(map),
                                async: false,
                                success: function(r){
                                    RemoveLoading();
                                    if(r.code === 0){
                                        vm.order.contract = r.contract;
                                        alert('操作成功', function () {
                                            layer.close(index);
                                            layer.close(_index);
                                            vm.contentViewId = ('contentViewId_' + uuid(16));
                                        });
                                    }else{
                                        alert(r.msg);
                                    }
                                }
                            });
                        });
                    }
                },
                content: tabBaseURL + "modules/order/selectortemplate.html",
                end: function () {
                    layer.close(_index);
                }
            });
        },
        //申请费用减免
        feeRemission:function () {
            var param = {
                data: vm.order,
                data2: 0
            };
            var index = layer.open({
                title: "申请费用减免",
                type: 2,
                boxParams: param,
                content: tabBaseURL + 'modules/order/feeRemission.html',
                end: function () {
                    closePage();
                }
            });
            layer.full(index);
        },
        editOrderDesc: function () {
            layer.open({
                id:1,
                type: 1,
                title:'请输入备注',
                area: ['50%', '50%'],
                content: "<div style='display:flex;justify-content:center;'><textarea id='area' style='width:100%;height:200px;resize: none;'></textarea></div>",
                btn:['保存','取消'],
                yes:function (index,layero) {
                    //获取输入框里面的值
                    var closeContent = top.$("#area").val() || $("#area").val();
                    if(closeContent){
                        console.log(closeContent);
                    }
                    var param = {
                        orderDesc:closeContent,
                        id:vm.order.orderCar.id,
                    }
                    PageLoading();
                    $.ajax({
                        type: "POST",
                        url: baseURL + 'order/ordercar/update',
                        contentType: "application/json",
                        data: JSON.stringify(param),
                        success: function(r){
                            RemoveLoading();
                            if(r.code === 0){
                                alert('操作成功', function () {
                                    layer.close(index);
                                    vm.order.orderCar.orderDesc = closeContent;
                                });
                            }else{
                                alert(r.msg);
                            }
                        }
                    });
                },
                no:function (index,layero) {
                    layer.close(index);
                }
            });
        },
        editRenewalDesc: function () {
            layer.open({
                id:1,
                type: 1,
                title:'请输入备注',
                area: ['50%', '50%'],
                content: "<div style='display:flex;justify-content:center;'><textarea id='area' style='width:100%;height:200px;resize: none;'></textarea></div>",
                btn:['保存','取消'],
                yes:function (index,layero) {
                    //获取输入框里面的值
                    var closeContent = top.$("#area").val() || $("#area").val();
                    if(closeContent){
                        console.log(closeContent);
                    }
                    var param = {
                        desc:closeContent,
                        id:vm.order.orderCar.reletId,
                    }
                    PageLoading();
                    $.ajax({
                        type: "POST",
                        url: baseURL + 'order/orderrelerecord/update',
                        contentType: "application/json",
                        data: JSON.stringify(param),
                        success: function(r){
                            RemoveLoading();
                            if(r.code === 0){
                                alert('操作成功', function () {
                                    layer.close(index);
                                    vm.order.orderCar.renewalRemark = closeContent;
                                });
                            }else{
                                alert(r.msg);
                            }
                        }
                    });
                },
                no:function (index,layero) {
                    layer.close(index);
                }
            });
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initCosreliefTable(layui.table, layui.soulTable);
    initOrderLongRentPlanTable(layui.table, layui.soulTable);
    initOrderChainTable(layui.table, layui.soulTable);
    initFeeItemLst(layui.table, layui.soulTable);
    initOrderRentSalePlanTable(layui.table, layui.soulTable);
    initMeltsRentTable(layui.table, layui.soulTable);
    initDirectPurchaseTable(layui.table, layui.soulTable);
    initRentSaleMoneyTable(layui.table, layui.soulTable);
    initReturnCarAccessoriesTable(layui.table, layui.soulTable);
    initExchangeCarAccessoriesTable(layui.table, layui.soulTable);
    initReplacementVehicleTable(layui.table, layui.soulTable);
    initReplacedVehicleTable(layui.table, layui.soulTable);
    initRenewalTable(layui.table,layui.soulTable);
    initRepaymentDetailsTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initUpload(layui.upload);
    initBpmChart();
    initData();
}

function initBpmChart() {
    BpmChart({elid:'bpmChart', instanceId: vm.instanceId}).initView();
}

function initUpload(upload) {
    var callBack = function (action, arg1, arg2) {
        var file;
        var url;
        switch (action) {
            case 'success':{
                file = arg2;
                url = baseURL + 'sys/sysaccessory/addByBindObj';
                break;
            }
            case 'delect':{
                file = arg1;
                url = baseURL + 'sys/sysaccessory/delByBindObj';
                break;
            }
        }
        PageLoading();
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(file),
            success: function(r){
                RemoveLoading();
                if(r.code === 0){
                    alert('操作成功');
                }else{
                    alert(r.msg);
                }
            }
        });
    };

    Upload({
        elid: 'orderFileLst',
        edit: true,
        fileLst: vm.orderFileLst,
        param: {'path':'order-order'},
        fidedesc: '订单附件',
        bindObj: {objId:vm.order.orderCar.id, objType:27},
        callBack: callBack
    }).initView();

    Upload({
        elid: 'deliveryFileLst',
        edit: true,
        fileLst: vm.deliveryFileLst,
        param: {'path':'order-delivery'},
        fidedesc: '交车附件',
        bindObj: {objId:vm.order.orderCar.id, objType:8},
        callBack: callBack
    }).initView();

    Upload({
        elid: 'contractFileLst',
        edit: true,
        fileLst: vm.contractFileLst,
        param: {'path':'contract'},
        fidedesc: '订单合同附件',
        bindObj: {objId:vm.order.orderCar.contractId, objType:4},
        callBack: callBack
    }).initView();

    Upload({
        elid: 'orderreleFileLst',
        edit: true,
        fileLst: vm.orderreleFileLst,
        param: {'path':'order-rele'},
        fidedesc: '续租附件',
        bindObj: {objId:vm.order.orderCar.reletId, objType:30},
        callBack: callBack
    }).initView();

    upload.render({
        elem: '#replenishTransferCarAccessories',
        url: baseURL + 'order/ordercaralteration/replenishTransferCarAccessories',
        data: {'path':'processApprove','alterationId':vm.order.orderCar.orderCarTransferAlteration.id},
        field:'files',
        auto:false,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
        multiple: true,
        number:20,
        choose: function(obj){
            obj.preview(function(index, file, result){
                obj.upload(index, file);
            });
        },
        done: function (res) {
            if (res.code == '0') {
                layui.table.reload('exchangeCarAccessoriesTable', {page: {curr: 1}});
            } else {
                layer.msg('上传失败', {icon: 5});
            }
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
        }
    });

    upload.render({
        elem: '#replenishReturnCarAccessories',
        url: baseURL + 'order/ordercaralteration/replenishReturnCarAccessories',
        data: {'path':'processApprove','alterationId':vm.order.orderCar.orderCarReturnAlteration.id},
        field:'files',
        auto:false,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
        multiple: true,
        number:20,
        choose: function(obj){
            // PageLoading();
            obj.preview(function(index, file, result){
                // var fileName = file.name;
                // var extIndex = fileName.lastIndexOf('.');
                // var ext = fileName.slice(extIndex);
                // var fileNameNotext = fileName.slice(0, extIndex);
                // var regExt = /png|jpg|jpeg/;
                // var fileType = regExt.test(ext) ? 1:0;
                // fileIdTmp = vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList.length + '_' + uuid(60);
                // var fileTmp={
                //     id: fileIdTmp,
                //     operationId:sessionStorage.getItem("userId"),
                //     operationName:sessionStorage.getItem("username"),
                //     nameDesc:'退车附件',
                //     nameAccessory:fileNameNotext,
                //     nameFile:fileName,
                //     nameExt:ext,
                //     typeFile:fileType,
                //     timeCreate:dateFormat(new Date().valueOf()),
                // };
                // vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList.push(fileTmp);
                obj.upload(index, file);
            });
        },
        done: function (res) {
            // RemoveLoading();
            if (res.code == '0') {
                // vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList.forEach(function (value) {
                //     if (value.id === fileIdTmp) value.url = res.data[0];
                // });
                layui.table.reload('returnCarAccessoriesTable', {page: {curr: 1}});
            } else {
                layer.msg('上传失败', {icon: 5});
                // for(var i = 0 ;i<vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList.length;i++) {
                //     if(vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList[i].id === fileIdTmp) {
                //         vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList.splice(i,1);
                //         i= i-1;
                //     }
                // }
            }
            // fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            // for(var i = 0 ;i<vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList.length;i++) {
            //     if(vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList[i].id === fileIdTmp) {
            //         vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList.splice(i,1);
            //         i= i-1;
            //     }
            // }
            // fileIdTmp = null;
        }
    });
}

// var fileIdTmp = null;

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(salePerson)', function (data) {
        vm.order.orderCar.salePersonId = data.value;
        if(data.value != null && data.value != ''){
            vm.order.orderCar.salePersonName=data.elem[data.elem.selectedIndex].text
        }else{
            vm.order.orderCar.salePersonName='';
        }
        var param = {
            id: vm.order.orderCar.id,
            salePersonId: vm.order.orderCar.salePersonId,
            salePersonName: vm.order.orderCar.salePersonName,
        };
        $.ajax({
            type: "POST",
            url: baseURL + "order/ordercar/editSalePerson",
            contentType: "application/json",
            data: JSON.stringify(param),
            success: function(r){
                if (parseInt(r.code) === 0) {
                    alert('修改成功', function () {
                        vm.isEditSalePerson = false;
                        $('div#editSalePersonId>div.layui-form-select').remove();
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#editOrderDesc").on('click', function(){
        vm.editOrderDesc();
    });

    $("#editRenewalDesc").on('click', function(){
        vm.editRenewalDesc();
    });

    $("#editSalePerson").on('click', function(){
        vm.isEditSalePerson = true;
    });
}
function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[0];
}
function initTableEvent(table,type) {
    if(type == 1 || type == 2){
        var toolStr="returnCarAccessoriesTable";
        if(type == 1){
            toolStr="exchangeCarAccessoriesTable";
        }
        //监听工具条
        table.on('tool('+toolStr+')', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            if(layEvent === 'showDoc'){ //查看
                vm.showDoc(data.url, data.nameFile)
            } else if(layEvent === 'downDoc'){ //删除
                vm.downDoc(data.url, data.nameFile)
            }
        });
    }else if(type == 3 || type == 4){
        var toolStr="replacementVehicleTable";
        if(type == 4){
            toolStr="replacedVehicleTable";
        }
        //监听工具条
        table.on('tool('+toolStr+')', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            if(layEvent === 'toOtherPage'){ //查看
                vm.rentOrderNo(data.id);
                // vm.toOtherPage(2, data.carId);
            }
        });
    }
}
function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}

/**
 * 初始化操作记录
 * @param table
 * @param soulTable
 */
function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.order.id,
            auditType: 3
        },
        // cellMinWidth: 630,
        cols: [[
            {field:'operatorName', title: '操作人', align: "center",templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容', align: "center",templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间', align: "center",templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: false,
        limits: [10, 20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
}


function initCosreliefTable(table, soulTable){
    table.render({
        id: "cosreliefLog",
        elem: '#cosreliefLog',
        url: baseURL + 'sys/log/costReliefOperationLogLst',
        where: {
            businessNo: vm.order.orderCarIds,
            auditType: 29
        },
        cols: [[
            {field:'operatorName', title: '操作人', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: false,
        limits: [10, 20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count) {
            soulTable.render(this);
        }
    });
}

/**
 * 初始化融租和以租代购尾款方案列表
 * @param table
 * @param soulTable
 */
function initRentSaleMoneyTable(table,soulTable){
    if(vm.order.plan.hasBalancePayment == 1 && vm.order.moneyPlanList !=undefined && vm.order.moneyPlanList.length>0){
        table.render({
            id: "rentSaleMoneyTable",
            elem: '#rentSaleMoneyTable',
            /*defaultToolbar: ['filter'],*/
            data: vm.order.moneyPlanList,
            cols: [[
                {field:'typeFieldDesc', title: '费用项', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.typeFieldDesc);}},
                {field:'money', title: '金额/元', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.money);}},
                {field:'paymentMethodStr', title: '付款方式', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.paymentMethodStr);}},
                {field:'paymentDay', title: '付款日', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.paymentDay);}},
                {field:'timePayment1st', title: '预计第一次付款日期', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.timePayment1st);}},
            ]],
            page: false,limit: 500,
            autoColumnWidth: {
                init: true
            },
            done: function(res, curr, count){
                soulTable.render(this);
            }
        });
    }
}

/**
 * 初始化直购订单方案列表
 * @param table
 * @param soulTable
 */
function initDirectPurchaseTable(table,soulTable){
    table.render({
        id: "orderDirectPurchaseTable",
        elem: '#orderDirectPurchaseTable',
        /*defaultToolbar: ['filter'],*/
        data: vm.order.planList,
        cols: [[
            {field:'brandName', title: '品牌/车系/车型', minWidth:150, align: "center",templet: function (d) {return formatBrandSeriesModelName(d.brandName,d.seriesName,d.modelName);}},
            {field:'totalPrice', title: '车辆总单价/元/台', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.totalPrice);}},
            {field:'chlRebate', title: '渠道返利', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.chlRebate);}},
        ]],
        page: false,limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
}

/**
 * 初始化融租订单方案列表
 * @param table
 * @param soulTable
 */
function initMeltsRentTable(table,soulTable){
    table.render({
        id: "orderMeltsRentTable",
        elem: '#orderMeltsRentTable',
        /*defaultToolbar: ['filter'],*/
        data: vm.order.planList,
        cols: [[
            {field:'brandName', title: '品牌/车系/车型', minWidth:150, align: "center",templet: function (d) {return formatBrandSeriesModelName(d.brandName,d.seriesName,d.modelName);}},
            {field:'downPayment', title: '首付款/元/台', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.downPayment);}},
            {field:'downPaymentPeriods', title: '首付款期数', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.downPaymentPeriods);}},
            {field:'monthlyRent', title: '租金/元/台', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'balancePayment', title: '尾款/元/台', templet: function (d) {return isEmpty(d.balancePayment);}},
            {field:'balancePaymentPeriods', title: '尾款期数', templet: function (d) {return isEmpty(d.balancePaymentPeriods);}},
            {field:'financeCompanyName', title: '金融公司名称', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.financeCompanyName);}},
            {field:'chlRebate', title: '渠道返利', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.chlRebate);}},
        ]],
        page: false,limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
}

/**
 * 初始化以租代购订单方案列表
 * @param table
 * @param soulTable
 */
function initOrderRentSalePlanTable(table, soulTable) {
    table.render({
        id: "orderRentSalePlanTable",
        elem: '#orderRentSalePlanTable',
        /*defaultToolbar: ['filter'],*/
        data: vm.order.planList,
        cols: [[
            {field:'brandName', title: '品牌/车系/车型', minWidth:150, align: "center",templet: function (d) {return formatBrandSeriesModelName(d.brandName,d.seriesName,d.modelName);}},
            {field:'servicingFee', title: '整备费/元/台', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.servicingFee);}},
            {field:'servicingFeePeriods', title: '整备费期数', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.servicingFeePeriods);}},
            {field:'monthlyRent', title: '租金/元/台', minWidth:150, align: "center",templet: function (d) {
                    return toMoney(Number(d.monthlyRent||0) - Number(d.coverCharge||0));
                }},
            {field:'coverCharge', title: '服务费', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.coverCharge);}},
            {field:'balancePayment', title: '尾款/元/台', templet: function (d) {return isEmpty(d.balancePayment);}},
            {field:'balancePaymentPeriods', title: '尾款期数', templet: function (d) {return isEmpty(d.balancePaymentPeriods);}},
            {field:'chlRebate', title: '渠道返利', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.chlRebate);}},
        ]],
        page: false,limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
}

/**
 * 初始化订单续租或者换车增加的费用项目
 */
function initFeeItemLst(table, soulTable) {
    table.render({
        id: "feeItemLst",
        elem: '#feeItemLst',
        data: vm.order.plan.feeLst,
        cols: [[
            {field:'typeFieldDesc', title: '费用项', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.typeFieldDesc);}},
            {field:'money', title: '金额/元', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.money);}},
            {field:'paymentMethodStr', title: '付款方式', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.paymentMethodStr);}},
            {field:'timePayment1st', title: '第一次付款日期', minWidth:150, align: "center",templet: function (d) {return isEmpty(d.timePayment1st);}},
        ]],
        page: false,
        limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
}

/**
 * 初始化经租订单方案列表
 * @param table
 * @param soulTable
 */
function initOrderLongRentPlanTable(table, soulTable) {
    table.render({
        id: "orderLongRentPlanTable",
        elem: '#orderLongRentPlanTable',
        /*defaultToolbar: ['filter'],*/
        data: vm.order.planList,
        // cellMinWidth: 130,
        // skin: 'line',
        cols: [[
            {field:'brandName', title: '品牌/车系/车型', align: "center",templet: function (d) {return formatBrandSeriesModelName(d.brandName,d.seriesName,d.modelName);}},
            {field:'cashDeposit', title: '保证金/元/台', align: "center",templet: function (d) {return isEmpty(d.cashDeposit);}},
            {field:'cashDepositPeriods', title: '保证金期数', align: "center",templet: function (d) {return isEmpty(d.cashDepositPeriods);}},
            {field:'monthlyRent', title: '租金/元/台', align: "center",templet: function (d) {
                    return toMoney(Number(d.monthlyRent||0) - Number(d.coverCharge||0));
                }},
            {field:'coverCharge', title: '服务费', align: "center",templet: function (d) {return isEmpty(d.coverCharge);}},
            {field:'chlRebate', title: '渠道返利/元/台', align: "center",templet: function (d) {return isEmpty(d.chlRebate);}},
            {field:'hasFreeDays', title: '免费用车天数', align: "center",templet: function (d) {
                    if (d.hasFreeDays&1 === 1){
                        return '有';
                    } else {
                        return '无';
                    }
                }},
            {field:'hasFreeDays', title: '免费用车天数类型', align: "center",templet: function (d) {
                    if (d.hasFreeDays == 3){
                        return '租期前';
                    }else if (d.hasFreeDays == 1) {
                        return '租期后';
                    }else {
                        return '--';
                    }
                }},
            {field:'freeDays', title: '免费用车时间/天数/台', align: "center",templet: function (d) {
                    if (d.hasFreeDays&1 === 1){
                        return isEmpty(d.freeDays);
                    } else {
                        return '--';
                    }
                }
            }
        ]],
        page: false,limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            // $("orderLongRentPlanTable").css("width", "100%");
            soulTable.render(this);
        }
    });
}

/**
 * 初始化直营订单方案列表
 * @param table
 * @param soulTable
 */
function initOrderChainTable(table, soulTable) {
    table.render({
        id: "orderChainTable",
        elem: '#orderChainTable',
        /*defaultToolbar: ['filter'],*/
        data: vm.order.planList,
        // cellMinWidth: 130,
        // skin: 'line',
        cols: [[
            {field:'brandName', title: '品牌/车系/车型', align: "center",templet: function (d) {return formatBrandSeriesModelName(d.brandName,d.seriesName,d.modelName);}},
            {field:'cashDeposit', title: '保证金/元/台', align: "center",templet: function (d) {return isEmpty(d.cashDeposit);}},
            {field:'cashDepositPeriods', title: '保证金期数', align: "center",templet: function (d) {return isEmpty(d.cashDepositPeriods);}},
            {field:'targetAmount', title: '达标额/元/天', templet: function (d) {return isEmpty(d.targetAmount);}},
            {field:'yesTargetAmount', title: '达标使用费/元/台', templet: function (d) {return isEmpty(d.yesTargetAmount);}},
            {field:'noTargetAmount', title: '不达标使用费/元/台', templet: function (d) {return isEmpty(d.noTargetAmount);}},
            {field:'coverCharge', title: '服务费', templet: function (d) {return isEmpty(d.coverCharge);}},
            {field:'chlRebate', title: '渠道返利', templet: function (d) {return isEmpty(d.chlRebate);}},
            {field:'chlRebatePeriods', title: '返利分期', templet: function (d) {return isEmpty(d.chlRebatePeriods);}},
            {field:'hasFreeDays', title: '免费用车天数', align: "center",templet: function (d) {
                    if (d.hasFreeDays&1 === 1){
                        return '有';
                    } else {
                        return '无';
                    }
                }},
            {field:'hasFreeDays', title: '免费用车天数类型', align: "center",templet: function (d) {
                    if (d.hasFreeDays == 3){
                        return '租期前';
                    }else if (d.hasFreeDays == 1) {
                        return '租期后';
                    }else {
                        return '--';
                    }
                }},
            {field:'freeDays', title: '免费用车时间/天数/台', align: "center",templet: function (d) {
                    if (d.hasFreeDays&1 === 1){
                        return isEmpty(d.freeDays);
                    } else {
                        return '--';
                    }
                }
            }
        ]],
        page: false,limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            // $("orderLongRentPlanTable").css("width", "100%");
            soulTable.render(this);
        }
    });
}

/**
 * 初始化退车附件
 * @param table
 * @param soulTable
 */
function initReturnCarAccessoriesTable(table, soulTable) {
    table.render({
        id: "returnCarAccessoriesTable",
        elem: '#returnCarAccessoriesTable',
        /*defaultToolbar: ['filter'],*/
        url: baseURL + 'sys/sysaccessory/getSysAccessoryList',
        where: {'objId': vm.order.orderCar.orderCarReturnAlteration.id, "objType":14},
        // data:vm.order.orderCar.orderCarReturnAlteration.sysAccessoryList,
        cols: [[
            {field:'nameFile', title: '名称', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.nameFile);}},
            {field:'timeCreate', title: '提交时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeCreate);}},
            {field:'operationName', title: '提交人', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.operationName);}},
            {title: '操作', minWidth:200, align: "center", toolbar: '#barTpl'},
        ]],
        // page: false,
        loading: false,
        // limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
    initTableEvent(table,2);
}
/**
 * 初始化换车附件
 * @param table
 * @param soulTable
 */
function initExchangeCarAccessoriesTable(table, soulTable) {
    table.render({
        id: "exchangeCarAccessoriesTable",
        elem: '#exchangeCarAccessoriesTable',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/sysaccessory/getSysAccessoryList',
        where: {'objId': vm.order.orderCar.orderCarTransferAlteration.id, "objType":13},
        // data:vm.order.orderCar.orderCarTransferAlteration.sysAccessoryList,
        cols: [[
            {field:'nameFile', title: '名称', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.nameFile);}},
            {field:'timeCreate', title: '提交时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeCreate);}},
            {field:'operationName', title: '提交人', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.operationName);}},
            {title: '操作', minWidth:200, align: "center", toolbar: '#barTpl'},
        ]],
        page: false,
        loading: false,
        limit: 500,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
    initTableEvent(table,1);
}
/**
 * 初始化换车记录(本车替换其他车)
 * @param table
 * @param soulTable
 */
function initReplacementVehicleTable(table, soulTable) {
    table.render({
        id: "replacementVehicleTable",
        elem: '#replacementVehicleTable',
        data: vm.order.orderCar.replacementVehicleList,
        cols: [[
            {field:'carNo', title: '替换情况', minWidth:140, align: "center",templet: function (d) {
                    return "本车替换其他车";}},
            {field:'carNo', title: '被替换的车牌号', minWidth:140,event: 'toOtherPage', align: "center",templet: function (d) {
                    return   "<span style='color: #3FACB3'>"+isEmpty(d.carNo)+"</span>"
                }},
            {field:'vinNo', title: '被替换的车架号', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.vinNo);}},
            {field:'brandName', title: '被替换的车辆品牌/车系/车型', minWidth:200, align: "center",templet: function (d) {return formatBrandSeriesModelName(d.brandName,d.seriesName,d.modelName);}},
            {field:'timeCreate', title: '操作时间', minWidth:140, align: "center",templet: function (d) {return dateFormatYMDHM(d.timeCreate);}},
            {field:'deliveryOperationName', title: '操作人', minWidth:140, align: "center",templet: function (d) {return isEmpty(d.deliveryOperationName);}},
        ]],
        page: true,
        loading: false,
        limits: [10, 20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
    initTableEvent(table,3);
}

/**
 * 初始化续租信息
 * @param table
 * @param soulTable
 */
function initRenewalTable(table, soulTable){
    if(vm.order.renewalList != null && vm.order.renewalList.length > 0){
        table.render({
            id: "renewalTable",
            elem: '#renewalTable',
            data:vm.order.renewalList,
            cols: [[
                {field:'code', title: '续租订单号', minWidth:200, align: "center",templet:function (d) {
                        if(d.code!=null && d.code!=""){
                            return "<span style='color:#419BEA;cursor:pointer;' onclick='vm.rentOrderNo(\""+d.id+"\")'>"+d.code+"</span>";
                        }else {
                            return "--";
                        }
                    }},
                {field:'timeStartRent', title: '续租开始时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeStartRent);}},
                {field:'timeFinishRent', title: '续租结束时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeFinishRent);}},
                {field:'renewalRemark', title: '续租备注', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.renewalRemark);}},
                {field:'renewalUser', title: '所属业务员', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.renewalUser);}}
            ]],
            page: false,
            loading: false,
            limit: 500,
            autoColumnWidth: {
                init: true
            },
            done: function(res, curr, count){
                soulTable.render(this);
            }
        });
    }
}

/**
 * 初始化换车记录(他车替换本车)
 * @param table
 * @param soulTable
 */
function initReplacedVehicleTable(table, soulTable) {
    table.render({
        id: "replacedVehicleTable",
        elem: '#replacedVehicleTable',
        data: vm.order.orderCar.replacedVehicleList,
        cols: [[
            {field:'carNo', title: '替换情况', minWidth:140, align: "center",templet: function (d) {
                    return "本车被其他车替换";}},
            {field:'carNo', title: '替换的车牌号', minWidth:140,event: 'toOtherPage', align: "center",templet: function (d) {
                    return   "<span style='color: #3FACB3'>"+isEmpty(d.carNo)+"</span>"
                }},
            {field:'vinNo', title: '替换的车架号', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.vinNo);}},
            {field:'brandName', title: '替换的车辆品牌/车系/车型', minWidth:200, align: "center",templet: function (d) {return formatBrandSeriesModelName(d.brandName,d.seriesName,d.modelName);}},
            {field:'timeCreate', title: '替换时间', minWidth:140, align: "center",templet: function (d) {return dateFormatYMDHM(d.timeCreate);}},
            {field:'deliveryOperationName', title: '操作人', minWidth:140, align: "center",templet: function (d) {return isEmpty(d.deliveryOperationName);}},
        ]],
        page: true,
        loading: false,
        limits: [10, 20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
    initTableEvent(table,4);
}
/**
 * 初始化还款明细
 * @param table
 * @param soulTable
 */
function initRepaymentDetailsTable(table, soulTable) {
    var limit = 0;
    if(null != vm.order.orderCar.receivablesList){
        limit = vm.order.orderCar.receivablesList.length;
    }

    table.render({
        id: "repaymentDetailsTable",
        elem: '#repaymentDetailsTable',
        data:vm.order.orderCar.receivablesList,
        cols: [[
            {field:'stageStr', title: '期数', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.stageStr);}},
            {field:'uncollectedAmount', title: '欠款金额', minWidth:200, align: "center",templet: function (d) {return toMoney(d.uncollectedAmount);}},
            {field:'collectionTypeName', title: '还款类型', minWidth:200, align: "center",templet: function (d) {
                    return d.collectionTypeName||getCollectionTypeStr(d.collectionType);
                }},
            {field:'overdueDays', title: '逾期天数', minWidth:200, align: "center",templet: function (d) {
                    return isEmpty(receivableOverdueDays(d.status,d.hzType,d.overdueDate,d.actualDate)||d.overdueDays);
                }
            },
            {field:'receivableDate', title: '应还日期', minWidth:200, align: "center",templet: function (d) {
                    return dateFormatYMD(isEmpty(d.receivableDateDesc || d.receivableDate));
                }},
            {field: 'overdueDate', align: "center", minWidth:200, title: '逾期期限', templet: function (d) {return isEmpty(d.overdueDate);}},
            {field:'billStartTime', minWidth:200, align: "center", title: '账单开始时间', templet: function (d) {return isEmpty(d.billStartTime)}},
            {field:'billEndTime', minWidth:200, align: "center", title: '账单结束时间', templet: function (d) {return isEmpty(d.billEndTime)}},
            {field:'receivableAmount', title: '应还总金额', minWidth:200, align: "center",templet: function (d) {
                return toMoney(d.receivableAmount);
                // return add(d.receivableAmount,d.lateFeeAmount);
            }},
            {field:'receivedAmount', title: '已还总金额', minWidth:200, align: "center",templet: function (d) {return toMoney(d.receivedAmount);}},
            {field:'statusStr', title: '还款状态', minWidth:200, align: "center",templet: function (d) {
                    if (d.hzType == 2 && d.status == 1){
                        return '部分坏账-待收款';
                    }
                    if (d.status == 4){
                        return '已坏帐';
                    }else if (d.status == 5){
                        return '已作废';
                    }else
                        return isEmpty(d.statusStr);
                }}
        ]],
        page: true,
        loading: false,
        limits: [10, 20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });
}
function calculateDateDifferMonths(start, end, tenancyCalcType) {
    if(start!=null && end!=null && start.indexOf('-')!=-1 && end.indexOf('-')!=-1){
        var start_datas = start.split('-');
        var end_datas = end.split('-');
        var start_year = parseInt(start_datas[0]);
        var start_month = parseInt(start_datas[1]);
        var start_day = parseInt(start_datas[2]);
        var end_year = parseInt(end_datas[0]);
        var end_month = parseInt(end_datas[1]);
        var end_day = parseInt(end_datas[2]);
        return differMonths(start_year, start_month, start_day, end_year, end_month, end_day, tenancyCalcType);
    }else{
        return '--';
    }
}
function differMonths(start_year, start_month, start_day, end_year, end_month, end_day, tenancyCalcType) {
    if (start_year === end_year){//同一年
        if (start_month === end_month){//同月
            if (start_day < end_day){//开始日小于结束日
                if (start_day > 1 || !isMonthLastday(end_year, end_month, end_day)){//不足一个月
                    return 0;
                } else {
                    if (tenancyCalcType === 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            } else {//开始日大于结束日
                return 0;
            }
        } else {//不同月
            if (start_month < end_month){//开始月小于结束月
                if ((start_month + 1) < end_month) {//开始月后延一月小于结束月
                    start_month++;
                    // if (start_day > getMonthLastday(start_year, start_month)) {
                    //     start_day = getMonthLastday(start_year, start_month);
                    // }
                    return 1 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
                } else {
                    if (start_day === end_day) {
                        return 1;
                    } else if (start_day < end_day) {
                        if (tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
                            return 2;
                        } else return 1;
                    } else {//开始月后延一月等于结束月并且开始日大于结束日
                        if (isMonthLastday(end_year, end_month, end_day)) {//结束日是当月最后一天
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            } else {//开始月大于结束月
                return 0;
            }
        }
    } else if (start_year < end_year) {//跨年-开始年小于结束年
        if ((start_year + 1) < end_year) {//开始年与结束年相差大于一年
            start_year++;
            return 12 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
        } else if ((start_year + 1) === end_year) {//开始年与结束年相差一年
            var diff = 13 - start_month;
            if (end_month === 2){//开始时间与结束时间相差一个月
                start_year++;
                start_month = 1;
                if (start_day > end_day) diff--;
                return diff + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
            }else if (end_month > 1){//开始时间与结束时间相差超过一个月
                start_year++;
                start_month = 1;
                return diff + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
            } else {
                if (diff > 1) {//开始时间与结束时间相差超过一个月
                    start_month++;
                    return 1 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
                } else {//开始时间与结束时间相差一个月或不足一个月
                    if (start_day === end_day){
                        return 1;
                    } else if (start_day < end_day) {
                        if (tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
                            return 2;
                        } else return 1;
                    } else {//开始月后延一月等于结束月并且开始日大于结束日
                        if (isMonthLastday(end_year, end_month, end_day)) {//结束日是当月最后一天
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        }
    } else {
        return 0;
    }
}

function isMonthLastday(year, month, day) {
    return day === getMonthLastday(year, month);
}

function getMonthLastday(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:{
            return 31;
        }
        case 4:
        case 6:
        case 9:
        case 11:{
            return 30;
        }
        case 2:{
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return 29;
            } else {
                return 28;
            }
        }
    }
}

function getTimeFinishRent(order) {
    var timeFinishRent = order.orderCar.timeFinishRent;
    var hasFreeDays = order.plan.hasFreeDays;
    var freeDays = order.plan.freeDays;
    var finishRent;
    if(timeFinishRent == null){
        return '--';
    }
    if (hasFreeDays == 1 && freeDays != null && freeDays != ''){
        finishRent =  new Date(timeFinishRent);
        finishRent.setDate(finishRent.getDate() + freeDays);
    }
    return finishRent ? finishRent.format('yyyy-MM-dd') : timeFinishRent;
}

function getContractNo(order) {
    var contractCode;
    if (order) {
        if (order.orderType == 2) {
            contractCode = order.contractCode;
        } else {
            contractCode = order.orderCar.contractCode;
        }
    }
    return isEmpty(contractCode);
}
