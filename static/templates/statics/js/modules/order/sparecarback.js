$(function () {
    var deliveryFileIdTmp;
    var fileIdTmp;
    //退换车时间
    layui.laydate.render({
        elem: '#date',
        type: 'date',
        // min:minTime,
        trigger:'click',
        done: function (value) {
            vm.spareCarReturn.returnTime = value;
        }
    });

    initUpload(layui.upload);

    //保存
    layui.form.on('submit(submitEditData)', function () {
        vm.saveOrUpdate();
        return false;
    });
    editcallback();
    BpmChart({instanceId: vm.instanceId}).initView();
    layui.form.render();

});
var instanceStatus = -1;//
var processnode;
var bpmcharlist;
var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        spareCarReturn: {
            illegalScore:0,
            illegalFee:0,
            outInsurance:0,
            outFee:0,
            actualFee:0,
            discountFee:0,
            otherFee:0,
            defaultFee:0
        },
        title: null,
        dateLabel:null,
        settleAmount: null,
        amount: {},
        settleType: null,
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        spareCarReturnTitleId: 'spareCarReturnTitleId_0',
        approveType: null,
        instanceStatus: null,
        //仓库数据源
        warehouseData: {},
        processNode: {
            nodeField:[],
            nodeOther:[]
        },
        businessId:null,
        approveId:null,
        processKey:'spareCarReturnApprove',
        nodeFields: {},
        bpmChartDtoList: [],
        recallNodeName: '',
        instanceId: null,
        viewTag: null,
        boxShow: false,
        boxInputShow: false,
        boxTitle: '',
        boxMark: '',
        fileLst2:[],
        fileLstId2: '0',
        boxHolder: '',
        nodeId:'',
        boxTxt: '',
        applyData:{},
        initData:{},
        nodeType:-1,
        order:null,
        isReedit:1,
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
        if(param.viewTag != 'apply'){
            _this.instanceId = param.instanceId;
            $.get(baseURL + "cartransfer/sparecarreturn/info/" + param.id, function (r) {
                if (r.code == 0){
                    if(_this.viewTag == 'approve'||_this.viewTag == 'edit'||_this.viewTag == 'approveDetail'||_this.viewTag == 'applyDetail'){
                        _this.spareCarReturn = r.spareCarReturn;
                        if(r.deliveryFileLst!=null){
                            _this.deliveryFileLst = r.deliveryFileLst;
                        }
                    }
                }
            });
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
        console.log(JSON.stringify(_this.nodeFields))
        if (_this.spareCarReturn.feeItemSnapshoot && _this.spareCarReturn.feeItemSnapshoot.length > 50) {
            var snapshoot = JSON.parse(_this.spareCarReturn.feeItemSnapshoot);
            _this.feeItemSnapshoot.view = snapshoot.view;
            _this.settlementFeeItem = snapshoot.settlementFeeItem;
            initSettlementFeeSnapshoot(snapshoot.view);
        } else {
            _this.feeItemSnapshoot.view = initSettlementFeeItemView(_this.nodeFields, _this.settlementFeeItem, 'spareCarReturn_spareCarReturn_', {
                suitType: 3,
                suitRentType: 1
            });
            if (_this.settlementFeeItem.otherFee) {
                _this.settlementFeeItem.otherFee.value = _this.spareCarReturn.otherFee;
            }
            if (_this.settlementFeeItem.rentPay) {
                _this.settlementFeeItem.rentPay.value = _this.spareCarReturn.rentPay;
            }
            if (_this.settlementFeeItem.margin) {
                _this.settlementFeeItem.margin.value = _this.spareCarReturn.margin;
            }
        }
        visibleStateModification(_this.nodeFields, 'spareCarReturn_spareCarReturn_serviceConfig');
        flowFieldPolishing(_this.nodeFields);
        console.log(JSON.stringify(_this.nodeFields));
    },
    watch: {
        spareCarReturn:{
            handler(val,oldVal){
                var feeVal = (parseFloat(validateNaN(val.illegalFee)) + parseFloat(validateNaN(val.rentPay)) + parseFloat(validateNaN(val.outFee)) + parseFloat(validateNaN(val.actualFee)) - parseFloat(validateNaN(val.discountFee))-parseFloat(validateNaN(val.margin)) + parseFloat(validateNaN(val.otherFee)) + parseFloat(validateNaN(val.defaultFee))).toFixed(2);
                if(feeVal>0){
                    val.feeType = 0;
                }else{
                    val.feeType = 1;
                }
                val.feeValue = Math.abs(feeVal);
            },
            deep:true
        }
    },
    computed: {},
    updated: function(){
        layui.form.render();
    },
    methods: {
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
            var obj = settlementFeeItemAmount(vm.settlementFeeItem);
            vm.settleAmount = obj.settleAmount;
            vm.spareCarReturn.feeValue = vm.settleAmount;
            vm.spareCarReturn.feeType = obj.type;
            vm.spareCarReturn.fileLst = vm.deliveryFileLst;
            vm.spareCarReturn.processKey = vm.processKey;
            vm.spareCarReturn.processApproveForm = {
                approveId:vm.approveId,
                instanceId:vm.instanceId,
                approveContent:vm.boxTxt,
                processKey:vm.processKey,
                nodeId:vm.nodeId,
                processOperationType:type,
                approveFileList:vm.fileLst2,
            };
            vm.spareCarReturn.settlementFeeItem = vm.settlementFeeItem;
            vm.feeItemSnapshoot.settlementFeeItem = vm.settlementFeeItem;
            vm.spareCarReturn.feeItemSnapshoot = JSON.stringify(vm.feeItemSnapshoot);
            $.ajax({
                type: "POST",
                url: baseURL + "cartransfer/sparecarreturn/" + action,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.spareCarReturn),
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
            return closeBox;
        },
        applydel: function(){
            vm.boxTitle = '提示';
            vm.boxMark = '确定要删除？\n删除成功之后，将无法恢复';
            vm.boxHolder = '撤回原因/选填';
            vm.boxInputShow = false;
            vm.showBox(function () {
                return vm.requestAction('handleNoBusiness',4);
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
        delFile2: function (id) {
            for(var i = 0 ;i<vm.fileLst2.length;i++) {
                if(vm.fileLst2[i].id === id) {
                    vm.fileLst2.splice(i,1);
                    i= i-1;
                }
            }
        },
        reedit: function(){
            var param = {
                id: vm.businessId,
                instanceId: vm.instanceId,
                viewTag: 'edit'
            };
            var index = layer.open({
                title: "重新编辑",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/sparecarback.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.isReedit = 2;
                },
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
                return vm.requestAction('handleNoBusiness',3);
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
                /*if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }*/
                return vm.requestAction('handleWithBusiness',1);
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
                return vm.requestAction('handleNoBusiness',1);
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
                return vm.requestAction('handleNoBusiness',2);
            });
        },
        saveOrUpdate: function () {
            var obj = settlementFeeItemAmount(vm.settlementFeeItem);
            vm.settleAmount = obj.settleAmount;
            vm.spareCarReturn.feeValue = vm.settleAmount;
            vm.spareCarReturn.feeType = obj.type;
            vm.spareCarReturn.fileLst = vm.deliveryFileLst;
            vm.spareCarReturn.isFlow = 1;
            vm.spareCarReturn.processKey = vm.processKey;
            vm.spareCarReturn.settlementFeeItem = vm.settlementFeeItem;
            vm.feeItemSnapshoot.settlementFeeItem = vm.settlementFeeItem;
            vm.spareCarReturn.feeItemSnapshoot = JSON.stringify(vm.feeItemSnapshoot);
            var url =  (vm.isReedit === 1) ?"cartransfer/sparecarreturn/save":"cartransfer/sparecarreturn/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                async:false,
                contentType: "application/json",
                data: JSON.stringify(vm.spareCarReturn),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            if(vm.isReedit === 2){
                                parent.parent.layer.closeAll();
                                parent.parent.vm.reload();
                            }else{
                                parent.layer.closeAll();
                                parent.vm.reload();
                            }
                        });
                    }else{
                        alert(r.msg);
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
                    vm.spareCarReturn = Object.assign({}, vm.spareCarReturn,{
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
        }
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
function initUpload(upload){
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path':'order-delivery'},
        field:'files',
        auto:false,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar,.mp4',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar|mp4', //
        choose: function(obj){
            PageLoading();
            obj.preview(function(index, file){
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1:0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp={
                    id: deliveryFileIdTmp,
                    nameDesc:'长租退车附件',
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType
                };
                vm.deliveryFileLst.push(fileTmp);
                obj.upload(index, file);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (parseInt(res.code) === 0) {
                vm.deliveryFileLst.forEach(function (value) {
                    if (value.id === deliveryFileIdTmp) value.url = res.data[0];
                });
                vm.deliveryFileLstId = 'deliveryFileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
            }
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });

    upload.render({
            elem: '#addFile2',
            url: baseURL + 'file/uploadFile',
            data: {'path':'processApprove'},
            field:'files',
            auto:false,
            size: 50*1024*1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
            choose: function(obj){
                // PageLoading();
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
                // RemoveLoading();
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

}
function validateNaN(num){
    if(isNaN(num) || num == null || num == '' || num == 'null' || num == undefined){
        return 0;
    }else return num;
}

function editcallback(event, val) {
    console.log(event+"="+val)
    var obj = settlementFeeItemAmount(vm.settlementFeeItem);
    vm.settleAmount = obj.settleAmount;
    vm.spareCarReturn.feeValue = vm.settleAmount;
    vm.spareCarReturn.feeType = obj.type;
    vm.spareCarReturnTitleId = 'spareCarReturnTitleId_' + uuid(16);
    console.log(vm.spareCarReturn);
}