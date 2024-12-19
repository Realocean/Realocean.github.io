$(function () {
    var deliveryFileIdTmp;
     var fileIdTmp;
    var type = window.localStorage.getItem("type");
    vm.settleType = type;
    if(vm.viewTag === 'apply'){
        vm.applyForDTO.alterationType = type;
    }
    layui.form.on('select(type)', function (data) {
        vm.applyForDTO.returnType = data.value;
    })
    layui.upload.render({
        elem: '#addFile2',
        url: baseURL + 'file/uploadFile',
        data: {'path':'processApprove'},
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
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1:0;
                fileIdTmp = vm.fileLst2.length + '_' + uuid(60);
                var fileTmp={
                    id: fileIdTmp,
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameDesc:'审批附件',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };
                vm.fileLst2.push(fileTmp);
                obj.upload(index, file);
            });
        },
        done: function (res) {
            if (res.code == '0') {
                vm.fileLst2.forEach(function (value) {
                    if (value.id === fileIdTmp) value.url = res.data[0];
                });
                vm.fileLstId2 = 'fileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delFile2(fileIdTmp);
            }
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delFile2(fileIdTmp);
            fileIdTmp = null;
        }
    });
    //退换车时间
    layui.laydate.render({
        elem: '#date',
        type: 'date',
        // min:minTime,
        trigger:'click',
        done: function (value) {
            vm.applyForDTO.timeApply = value;
            if (returncar_rent_settlement && returncar_rent_settlement_model == 1) {
                $.get(baseURL + "order/ordercaralteration/monthlyRentDebt/"+vm.businessNo+"/"+new Date(value).getTime(), function (r) {
                    console.log(r);
                    Vue.set(vm.applyForDTO, "rentAmount", toMoney(r.monthlyRentDebt));
                    if (vm.settlementFeeItem.rentAmount) {
                        Vue.set(vm.settlementFeeItem.rentAmount, "value", vm.applyForDTO.rentAmount);
                    }
                    Vue.set(vm.applyForDTO, "rentAmountRefundable", toMoney(r.monthlyRentRefundable));
                    if (vm.settlementFeeItem.rentAmountRefundable) {
                        Vue.set(vm.settlementFeeItem.rentAmountRefundable, "value", vm.applyForDTO.rentAmountRefundable);
                    }
                    Vue.set(vm.applyForDTO, "badBillRemark", r.badBillRemark);
                    Vue.set(vm.applyForDTO, "astrideOtherOrderRemark", r.astrideOtherOrderRemark);
                    vm.settleBodyId = 'settleBodyId_'+uuid(32);
                    editcallback();
                });
            }
        }
    });
    //退款时间
    layui.laydate.render({
        elem: '#dateRefund',
        type: 'date',
        trigger:'click',
        done: function (value) {
            vm.applyForDTO.refundTime = value;
        }
    });

    layui.form.on('radio(shipType)', function (data) {
        vm.applyForDTO.shipType = data.value;
        if(data.value == 1){
            //整备中
            vm.applyForDTO.faultType = 1;
        }
        if(data.value == 2){
            //备发车
            vm.applyForDTO.startType = 1;
        }
    });

    editcallback();
    BpmChart({instanceId: vm.instanceId}).initView();
    layui.form.render();
    //附件上传
    var uploadParams = {
        "path": "order-delivery",
        "nameDesc": "交车附件",
        "vm": vm,
        "vmPropertyName":["deliveryFileLstId","deliveryFileLst"],
        "layui": layui,
        "delFileMethod":"delDeliveryFile",
    };
    initUploadCommons(uploadParams,"#addDeliveryFile");
    //保存
    layui.form.on('submit(submitEditData)', function () {
        vm.saveOrUpdate();
        return false;
    });

    layui.form.on('submit(approve)', function () {
        vm.approve();
        return false;
    });

});
var instanceStatus = -1;//
var processnode;
var bpmcharlist;
var viewer;
var returncar_rent_settlement = 1;
var returncar_rent_settlement_model = 2;
var vm = new Vue({
    el: '#rrapp',
    data: {
        applyForDTO: {},
        title: null,
        dateLabel:null,
        settleAmount: null,
        amount: {},
        settleType: null,
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        approveType: null,
        instanceStatus: null,
        //仓库数据源
        warehouseData: {},
        processNode: {
            nodeField:[],
            nodeOther:[],
            currentNodeData:{},
            approveData:{}
        },
        businessId:null,
        businessNo:null,
        approveId:null,
        processKey:'rentSaleApprove',
        nodeFields: {},
        bpmChartDtoList: [],
        recallNodeName: '',
        instanceId: null,
        viewTag: null,
        boxShow: false,
        boxInputShow: false,
        boxTitle: '',
        fileLst2:[],
        fileLstId2: '0',
        boxMark: '',
        boxHolder: '',
        nodeId:'',
        boxTxt: '',
        applyData:{},
        initData:{},
        nodeType:-1,
        order:null,
        reedit:0,
        startAgain:0,
        feeItemSnapshoot: {},
        settlementFeeItem:{}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.viewTag = param.viewTag;
        _this.approveType = param.approveType;
        _this.instanceStatus = param.instanceStatus;
        _this.nodeId = param.nodeId;
        _this.businessId = param.id;
        _this.order = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/config/getConfVal/returncar_rent_settlement", function (r) {
            returncar_rent_settlement = r==='0'?0:1;
        });
        $.get(baseURL + "sys/config/getConfVal/returncar_rent_settlement_model", function (r) {
            returncar_rent_settlement_model = r==='1' && _this.order.orderCar.rentType != 8?1:2;
        });
        if(param.viewTag != 'apply'){
            _this.instanceId = param.instanceId;
            $.get(baseURL + "order/ordercaralteration/info/" + param.id, function (r) {
                if (r.code == 0){
                    if(_this.viewTag == 'approve'|| _this.viewTag == 'reedit' ||_this.viewTag == 'edit'||_this.viewTag == 'approveDetail'||_this.viewTag == 'applyDetail'){
                        _this.applyForDTO = r.applyForDTO;
                        _this.deliveryFileLst = r.applyForDTO.attachment;
                        _this.initData.rentAmount = r.applyForDTO.rentAmount;
                        _this.settleAmount = r.applyForDTO.repayAmount;
                        if(_this.viewTag === 'reedit'){
                            _this.reedit = 1;
                            _this.startAgain = param.startAgain;
                        }
                        _this.businessNo = r.applyForDTO.orderCarCode;
                    }
                }
            });
        }else{
            if(window.localStorage.getItem("code")!='' && window.localStorage.getItem("code")!=null){
                _this.businessNo = window.localStorage.getItem("code");
                $.get(baseURL + "order/ordercaralteration/detailData/" + window.localStorage.getItem("code"), function (r) {
                    _this.initData = r.data;
                    if(_this.order.customerType === 1){
                        _this.applyForDTO.contactPerson = _this.order.contactPerson;
                    }else{
                        _this.applyForDTO.contactPerson = _this.order.customerName;
                    }
                    _this.applyForDTO.carNo = _this.order.orderCar.carNo;
                    _this.applyForDTO.orderCarCode = _this.order.orderCar.code;
                    _this.applyForDTO.customerName = _this.order.customerName;
                    _this.applyForDTO.rentTypeStr = _this.order.orderCar.rentTypeStr;
                    _this.applyForDTO.rentType = _this.order.orderCar.rentType;
                    _this.applyForDTO.customerTel = _this.order.customerTel;
                    _this.applyForDTO.lessorName = _this.order.lessorName;
                    _this.applyForDTO.engineNo =  _this.order.orderCar.engineNo;
                    _this.applyForDTO.timeDeliveryShow =  _this.order.orderCar.timeDeliveryShow;
                    _this.applyForDTO.timeStartRent = dateFormatYMD(_this.order.orderCar.timeStartRent);
                    _this.applyForDTO.timeFinishRent = dateFormatYMD(_this.order.orderCar.timeFinishRent);
                    _this.applyForDTO.vinNo = _this.order.orderCar.vinNo;
                    _this.applyForDTO.carBrandModel = _this.order.orderCar.brandName+'/'+_this.order.orderCar.seriesName+'/'+_this.order.orderCar.modelName;
                    _this.applyForDTO.deptName = _this.order.orderCar.deptName;
                    _this.applyForDTO.otherFee =  r.data.otherFee;
                    _this.applyForDTO.collectionTypeName = r.data.collectionTypeName;
                });
            }
        }
        var url = '';
        if( _this.instanceId!=null && _this.instanceId!=null && _this.instanceId!=''){
            url = "mark/processnode/getProcessInit?processKey="+_this.processKey+"&instanceId=" + _this.instanceId;
        }else{
            url = "mark/processnode/getProcessInit?processKey="+_this.processKey+"&instanceId=null";
        }
        $.get(baseURL + url, function (r) {
            if (r.code == 0 && (processnode = r.data) != null){
                processnode['approveId'] = param.approveId;
                _this.approveId = param.approveId;
                if (processnode['currentNodeData'] != null && processnode['currentNodeData'] != ''){
                    _this.processNode.currentNodeData = processnode['currentNodeData'];
                    _this.nodeType = _this.processNode.currentNodeData.nodeType;
                    if (processnode['currentNodeData']['nodeBigValue'] != null && processnode['currentNodeData']['nodeBigValue'] != ''){
                        _this.processNode['nodeField'] = JSON.parse(processnode['currentNodeData']['nodeBigValue']);
                    }
                    if (processnode['currentNodeData']['nodeOtherValue'] != null && processnode['currentNodeData']['nodeOtherValue'] != ''){
                        _this.processNode['nodeOther'] = JSON.parse(processnode['currentNodeData']['nodeOtherValue']);
                    }
                    if (processnode['currentNodeData']['recallNodeName'] != null && processnode['currentNodeData']['recallNodeName'] != ''){
                        _this.recallNodeName = processnode['currentNodeData']['recallNodeName'];
                    }
                }
                if (processnode['instanceStatus'] != null && processnode['instanceStatus'] != ''){
                    instanceStatus = Number(processnode['instanceStatus']);
                }
                if (processnode['bpmChartDtoList'] != null && processnode['bpmChartDtoList'] != ''){
                    _this.bpmChartDtoList = processnode['bpmChartDtoList'];
                }
                if (processnode['approveData'] != null && processnode['approveData'] != ''){
                    _this.processNode.approveData = processnode['approveData'];
                }
                processnode = _this.processNode;
                bpmcharlist = _this.bpmChartDtoList;
            }
        });
        initializeShowLv(_this.nodeFields, _this.processNode.nodeField,_this.viewTag);
        if (_this.applyForDTO.feeItemSnapshoot && _this.applyForDTO.feeItemSnapshoot.length > 50) {
            var snapshoot = JSON.parse(_this.applyForDTO.feeItemSnapshoot);
            _this.feeItemSnapshoot.view = snapshoot.view;
            _this.settlementFeeItem = snapshoot.settlementFeeItem;
            initSettlementFeeSnapshoot(snapshoot.view);
        } else {
            _this.feeItemSnapshoot.view = initSettlementFeeItemView(_this.nodeFields, _this.settlementFeeItem, 'applyCarBack_carBack_', {
                suitType: 1,
                suitRentType: 2
            });
            if (_this.settlementFeeItem.otherFee) {
                _this.settlementFeeItem.otherFee.value = _this.applyForDTO.otherFee;
            }
            if (_this.settlementFeeItem.rentAmount && returncar_rent_settlement) {
                _this.settlementFeeItem.rentAmount.value = _this.initData.rentAmount;
            }
            if (_this.settlementFeeItem.margin) {
                _this.settlementFeeItem.margin.value = _this.initData.margin;
            }
        }
        visibleStateModification(_this.nodeFields, 'applyCarBack_carBack_serviceConfig');
        flowFieldPolishing(_this.nodeFields);
        // console.log(JSON.stringify(_this.nodeFields));
    },
    computed: {},
    updated: function(){
        layui.form.render();
    },
    methods: {
        inputAlterationMileage:function(){
            this.applyForDTO.alterationMileage = checkNum(this.applyForDTO.alterationMileage);
        },
        showBox: function (submit) {
            vm.boxTxt = '';
            var index = layer.open({
                title: vm.boxTitle,
                type: 1,
                area: ['90%', '95%'],
                btn:['取消','确定'] ,
                content: $("#boxShow"),
                btnAlign: 'c',
                end: function(){
                    vm.boxShow = false;
                    vm.fileLst2=[];
                    layer.close(index);
                },
                btn1:function (index, layero) {
                    vm.boxShow = false;
                    vm.fileLst2=[];
                    layer.close(index);
                },
                btn2:function (index, layero) {
                    return submit();
                }
            });
            vm.boxShow = true;
        },
        requestAction: function (action,type) {
            PageLoading();
            var closeBox = false;
            if(vm.nodeFields.applyCarBack_carBack_shipType.hide){
                vm.applyForDTO.shipType = null;
            }
            vm.applyForDTO.processApproveForm = {
                approveId:vm.approveId,
                instanceId:vm.instanceId,
                approveContent:vm.boxTxt,
                processKey:vm.processKey,
                nodeId:vm.nodeId,
                processOperationType:type,
                approveFileList:vm.fileLst2,
            };
            vm.applyForDTO.attachment = vm.deliveryFileLst;
            vm.applyForDTO.processKey = vm.processKey;
            vm.applyForDTO.margin = vm.initData.margin;
            vm.applyForDTO.rentAmount = vm.initData.rentAmount;
            vm.applyForDTO.repayAmount = vm.settleAmount;
            vm.applyForDTO.settlementFeeItem = vm.settlementFeeItem;
            vm.feeItemSnapshoot.settlementFeeItem = vm.settlementFeeItem;
            vm.applyForDTO.feeItemSnapshoot = JSON.stringify(vm.feeItemSnapshoot);
            $.ajaxSettings.async = false;
            $.ajax({
                type: "POST",
                url: baseURL + "order/ordercaralteration/" + action,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.applyForDTO),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closeBox = true;
                            layer.closeAll();
                            closePage();
                        });
                    } else {
                        closeBox = false;
                        alert(r.msg);
                    }
                }
            });
            $.ajaxSettings.async = true;
            return closeBox;
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
        delFile2: function (id) {
            for(var i = 0 ;i<vm.fileLst2.length;i++) {
                if(vm.fileLst2[i].id === id) {
                    vm.fileLst2.splice(i,1);
                    i= i-1;
                }
            }
        },
        applydel: function(){
            vm.boxTitle = '提示';
            vm.boxMark = '确定要删除？\n删除成功之后，将无法恢复';
            vm.boxHolder = '撤回原因/选填';
            vm.boxInputShow = false;
            vm.showBox(function () {
                return vm.requestAction('delectOrder');
            });
        },
        reeditAgain: function(){
            var param = {
                id: vm.businessId,
                instanceId: vm.instanceId,
                viewTag: 'reedit',
                startAgain: 1
            };
            var index = layer.open({
                title: "重新编辑",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/applyrentback.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        recall: function(){
            //撤回
            vm.boxTitle = '撤回确认';
            vm.boxMark = '确定要撤回申请单？撤回成功之后，将无法恢复';
            vm.boxHolder = '撤回原因/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                return vm.requestAction('handle',1);
            });
        },
        approve: function(){
            //审核通过
            vm.boxTitle = '审核通过';
            vm.boxMark = '审核反馈';
        //  vm.boxHolder = '可以输入审核意见/必填';
            vm.boxHolder = '可以输入审核意见/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
               /* if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }*/
                return vm.requestAction('edit');
            });
        },
        reject: function(){
            //审核驳回
            vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('handle',3);
            });
        },
        refuse: function(){
            //审核拒绝
            vm.boxTitle = '审核拒绝';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('handle',2);
            });
        },
        saveOrUpdate: function () {
            if(vm.settleType == 2 && vm.nodeFields.applyCarBack_carBack_carType.required){
                if(vm.applyForDTO.returnType == null || vm.applyForDTO.returnType == ''){
                    alert('退车类别不能为空');
                    return false;
                }
            }
            if(vm.nodeFields.applyCarBack_carBack_uploadAttach.required){
                if(vm.deliveryFileLst.length==0){
                    alert('上传附件为空');
                    return false;
                }
            }
            if(vm.nodeFields.applyCarBack_carBack_shipType.required){
                if(vm.applyForDTO.shipType == null || vm.applyForDTO.shipType == ''){
                    alert('修改车辆状态不能为空');
                    return false;
                }
            }
            if(vm.nodeFields.applyCarBack_carBack_shipType.hide){
                vm.applyForDTO.shipType = null;
            }
            var url = vm.businessId == null ? "order/ordercaralteration/process/save" : "order/ordercaralteration/edit";
            vm.applyForDTO.attachment = vm.deliveryFileLst;
            vm.applyForDTO.processKey = vm.processKey;
            vm.applyForDTO.rentAmount = vm.initData.rentAmount;
            vm.applyForDTO.repayAmount = vm.settleAmount;
            vm.businessId == null ? vm.applyForDTO.orderCarCode = window.localStorage.getItem("code"):vm.applyForDTO.orderCarCode
            vm.applyForDTO.alterationType = 2;
            vm.applyForDTO.processApproveForm = {
                processKey : vm.processKey,
                instanceId : vm.instanceId,
                reedit : vm.reedit
            };
            vm.applyForDTO.settlementFeeItem = vm.settlementFeeItem;
            vm.feeItemSnapshoot.settlementFeeItem = vm.settlementFeeItem;
            vm.applyForDTO.feeItemSnapshoot = JSON.stringify(vm.feeItemSnapshoot);
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.applyForDTO),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            if(vm.startAgain === 1){
                                parent.parent.layer.closeAll();
                                parent.parent.vm.reload();
                            }else{
                                parent.layer.closeAll();
                                parent.vm.reload();
                            }
                        });
                    } else {
                        alert(r.msg);
                        // parent.layer.closeAll();
                    }
                }
            });
        },
        cancel: function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);


        },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        chooseWarehouse:function(){
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function(){
                    vm.applyForDTO = Object.assign({}, vm.applyForDTO,{
                        depotId:vm.warehouseData.warehouseId,
                        depotName:vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
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

    }
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function isShowContent() {
    return instanceStatus == 2 || instanceStatus == 5 ||instanceStatus == 6;
}
function getAuditStatusStr() {
    return '退车审核中';
}
function getOrderStatusStr() {
    if (instanceStatus == 2){
        return '已拒绝';
    } else if (instanceStatus == 3){
        return '已完成';
    } else if (instanceStatus == 5){
        return '已撤回';
    }else if(instanceStatus === -1){

    } else {
        if (processnode != null && processnode.currentNodeData != null){
            return processnode.currentNodeData.nodeName;
        }
    }
}
function getAuditMarkType() {
    if (instanceStatus == 2 || instanceStatus == 6) {
        return '审核反馈';
    }else if (instanceStatus == 5) {
        return '撤回原因';
    }
}
function getAuditMarkStr() {
    if (processnode != null && processnode.approveData != null){
        return processnode.approveData.approveContent;
    } else {
        return '---';
    }
}

function editcallback(event, val) {
    console.log(event+"="+val)
    var obj = settlementFeeItemAmount(vm.settlementFeeItem);
    vm.settleAmount = obj.settleAmount;
    vm.applyForDTO.repayAmount = vm.settleAmount;
    vm.applyForDTO.repayType = obj.type;
}