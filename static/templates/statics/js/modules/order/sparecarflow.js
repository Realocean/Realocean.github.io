$(function () {
    var fileIdTmp;
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        initTable(layui.table,layui.soulTable)
        layui.form.render();
    });
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
        var cascader = layui.cascader;
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            vm.selectData = r.carTreeVoList;
            cascader({
                elem: "#a",
                data: vm.selectData,
                success: function (valData,labelData) {
                    vm.spareCarApply.brandId = valData[0];
                    vm.spareCarApply.brandName = labelData[0];
                    vm.spareCarApply.seriesId = valData[1];
                    vm.spareCarApply.seriesName = labelData[1];
                    vm.spareCarApply.modelId = valData[2];
                    vm.spareCarApply.modelName = labelData[2];
                    vm.spareCarApply.brandSelect = labelData[0] + '/' + labelData[1] + '/' + labelData[2]
                }
            });
        });
    });

    layui.use(['layer','form','laydate','upload'], function () {

        layui.form.on('submit(submitEditData)', function () {
            vm.saveOrUpdate();
            return false;
        });
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
        layui.laydate.render({
            elem: '#handleTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.handleTime = value;
            }
        });

        layui.laydate.render({
            elem: '#returnTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.returnTime = value;
            }
        });

        layui.laydate.render({
            elem: '#nextDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.nextDate = value;
            }
        });

        layui.laydate.render({
            elem: '#paymentDay',
            trigger: 'click',
            theme: 'grid',
            type: 'date',
            isInitValue: false,
            showBottom: false,
            value: '1989-10-01',
            min: '1989-10-01',
            max: '1989-10-31',
            done: function (value, date) {
                Vue.set(vm.spareCarApply, "paymentDay", date.date);
                $('input#paymentDayVal').val(date.date);
            },
            ready: function(){//
                $('.laydate-theme-grid>div.layui-laydate-hint').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-header').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-content>table>thead').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-content>table>tbody>tr>td.laydate-disabled').hide();
            }
        });

        layui.form.on('select(handleUserNameFilter)', function (data) {
            var usrid = data.value;
            vm.spareCarApply.handleUserId = usrid;
            var obj = vm.usrLst.filter(function (obj) {
                return obj.userId == usrid;
            })[0];
            if (obj != null){
                vm.spareCarApply.handleUserName = obj.username;
            }else {
                vm.spareCarApply.handleUserName = '';
            }
        });

        layui.form.on('select(feeItem)', function (data) {
            vm.feeItemId = data.value;
        });

        layui.form.on('select(feeItemPaymentMethod)',function (data) {
            var serializeId = data.elem.attributes.sid.value;
            vm.spareRelerecord.feeLst.forEach(function (value) {
                if (value.serializeId == serializeId) {
                    value.paymentMethod = data.value;
                }
            });
        });

        layui.laydate.render({
            elem: '#startTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.startTime = value;
            }
        });

        layui.laydate.render({
            elem: '#endTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.endTime = value;
            }
        });

        layui.form.on('select(contract)', function (data) {
            var id = data.value;
            if (id == null || id === ''){
                vm.resetContract();
            }
            var obj = vm.contractLst.filter(function (obj) {
                return obj.id == id;
            })[0];
            if (obj != null){
                vm.spareCarApply = Object.assign({}, vm.spareCarApply, {
                    id:id,
                    spareContractNo:obj.code,
                    startTime:obj.timeStart,
                    endTime:obj.timeFinish,
                    contractRemark:obj.desc,
                });
                contractUpload.updateFile(obj.fileLst);
                // vm.fileLst1.splice(0,vm.fileLst1.length);
                // if (obj.fileLst != null && obj.fileLst.length > 0){
                //     obj.fileLst.forEach(function (f) {
                //         vm.fileLst1.push(f);
                //     })
                // }
                // vm.fileLstId1 = 'contract_' + uuid(6);
            }
        });

        Upload('fileLst', true, vm.fileLst, null, sessionStorage.getItem("userId"), sessionStorage.getItem("username"), {'path':'spare'}, '备用车附件').initView();
        contractUpload = Upload('fileLst1', true, vm.fileLst1, null, sessionStorage.getItem("userId"), sessionStorage.getItem("username"), {'path':'contract'}, '合同');
        contractUpload.initView();
        BpmChart({instanceId: vm.instanceId}).initView();
        layui.form.render();
    });


});
var instanceStatus = -1;//
var processnode;
var contractUpload;
var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        viewTag: null,
        approveType: null,
        spareCar:{},
        fileLst: [],
        fileLstId: 'sparecar_0',
        fileLst1: [],
        fileLstId1: 'contract_0',
        feeItemId:null,
        spareCarApply:{},
        feeItemLst: [],
        contractLst: [],
        usrLst: [],
        spareRelerecord: {
            operationId: '',
            fileLst: [],
            feeLst: []
        },
        instanceStatus: null,
        nodeId: null,
        businessId: null,
        processNode: {
            nodeField:[],
            nodeOther:[]
        },
        nodeType:-1,
        order:null,
        processKey:'spareCarApprove',
        nodeFields: {},
        bpmChartDtoList: [],
        recallNodeName: '',
        fileLst2:[],
        fileLstId2: '0',
        instanceId: null,
        boxShow: false,
        boxInputShow: false,
        boxTitle: '',
        boxMark: '',
        boxHolder: '',
        boxTxt: '',
        applyData:{},
        isReedit:1
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
            $.get(baseURL + "cartransfer/sparecar/approveInfo/" + param.id, function (r) {
                if (r.code == 0){
                    if(_this.viewTag == 'approve'||_this.viewTag == 'edit'||_this.viewTag == 'approveDetail'||_this.viewTag == 'applyDetail'){
                        _this.spareCarApply = r.spareCarApply;
                        _this.spareCar = r.spareCar;
                        if(r.spareCarApply.deliveryFileLst!=null){
                            _this.fileLst = r.spareCarApply.deliveryFileLst;
                        }
                        if(r.spareCarApply.deliveryFileLst1!=null){
                            _this.fileLst1 = r.spareCarApply.deliveryFileLst1;
                        }
                        _this.spareRelerecord.feeLst = r.feeLst;
                        if(_this.spareCarApply.brandId != null && _this.spareCarApply.brandId != ''){
                            _this.spareCarApply.brandSelect = _this.spareCarApply.brandName + '/' + _this.spareCarApply.seriesName + '/' + _this.spareCarApply.modelName;
                                layui.config({
                                base: "../../statics/common/cascader/layui/lay/mymodules/"
                            }).use(['form',"jquery","cascader","form"], function(){
                                var cascader = layui.cascader;
                                $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                                    _this.selectData = r.carTreeVoList;
                                    cascader({
                                        elem: "#a",
                                        data: _this.selectData,
                                        value: [_this.spareCarApply.brandId, _this.spareCarApply.seriesId, _this.spareCarApply.modelId],
                                        success: function (valData,labelData) {
                                            _this.spareCarApply.brandId = valData[0];
                                            _this.spareCarApply.brandName = labelData[0];
                                            _this.spareCarApply.seriesId = valData[1];
                                            _this.spareCarApply.seriesName = labelData[1];
                                            _this.spareCarApply.modelId = valData[2];
                                            _this.spareCarApply.modelName = labelData[2];
                                            _this.spareCarApply.brandSelect = labelData[0] + '/' + labelData[1] + '/' + labelData[2]
                                        }
                                    });
                                });
                            });
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
        flowFieldPolishing(_this.nodeFields);
        console.log(JSON.stringify(_this.nodeFields));

        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });

        if(_this.spareCar.rentTypeItem!=null && _this.spareCar.rentTypeItem!=''){
            $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + _this.spareCar.rentTypeItem, function (r) {
                _this.feeItemLst = r.datas;
            });
            $.get(baseURL + "contract/contracordernotemplate/contractLst/"+ _this.spareCar.rentTypeItem, function (r) {
                _this.contractLst = r.contractLst;
            });
        }

    },
    computed: {},
    updated: function(){
        layui.form.render();
    },
    methods: {
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        delFile1: function (id) {
            for(var i = 0 ;i<vm.fileLst1.length;i++) {
                if(vm.fileLst1[i].id === id) {
                    vm.fileLst1.splice(i,1);
                    i= i-1;
                }
            }
        },
        delContractFile: function (id) {
            for(var i = 0 ;i<vm.fileLst1.length;i++) {
                if(vm.fileLst1[i].id === id) {
                    vm.fileLst1.splice(i,1);
                    i= i-1;
                }
            }
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
        addFeeItem: function(){
            if (vm.feeItemId == null || vm.feeItemId == ''){
                alert('请先选择费用项类型');
                return;
            }
            if(vm.feeItemId == 'monthly_rent'){
                if(vm.spareCarApply.handleTime == null || vm.spareCarApply.handleTime == '' || vm.spareCarApply.returnTime == null || vm.spareCarApply.returnTime == ''){
                    alert('填写月租之前需要先填写交车时间和预计归还时间');
                    return false;
                }
            }
            if (vm.spareRelerecord.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            if (vm.feeItemId == 'monthly_rent' && vm.spareRelerecord.feeLst.filter(function (value) {
                return value.typeFieldName == 'monthly_rent';
            }).length > 0) {
                alert('月租只能添加一条');
                return;
            }
            var feeItem = vm.feeItemLst.filter(function (f) {
                return f.fieldName == vm.feeItemId;
            })[0];
            // var oldFeePlan = vm.selectCar.planList.filter(function (f) {
            //     return f.typeFieldName == vm.feeItemId;
            // })[0];
            // if (oldFeePlan == null )oldFeePlan = {};
            var serializeId = 0;
            if(vm.spareRelerecord.feeLst.length > 0){
                vm.spareRelerecord.feeLst.forEach(function (value) {
                    if (value.serializeId > serializeId) serializeId = value.serializeId;
                })
            }
            var item = {
                serializeId:serializeId+1,
                elid: 'serializeId_'+(serializeId+1),
                typeFieldName:feeItem.fieldName,
                typeFieldDesc:feeItem.name,
                multiple:feeItem.multiple,
                money:'',
                // money:oldFeePlan.money,
                paymentMethod:feeItem.defaultPaymentMethod,
                timePayment1st:''
                // timePayment1st:oldFeePlan.timePayment1st
            };
            vm.spareRelerecord.feeLst.push(item);
            vm.reloadFeeItem();
        },
        reloadFeeItem: function () {
            layui.table.reload('feeLstid', {
                page: {
                    curr: getCurrPage('feeLstid', vm.spareRelerecord.feeLst.length)
                },
                data: vm.spareRelerecord.feeLst});
        },
        selectCar: function(){
            var index = layer.open({
                title: "选择车辆订单",
                type: 2,
                content: tabBaseURL + "modules/order/selectordercar.html",
                end: function(){
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        initData: function(data){
            vm.spareCarApply.orderCarId = data.id;
            vm.spareCar = Object.assign({}, vm.spareCar,{
                carNo:data.carNo,
                vinNo:data.vinNo,
                rentType:data.rentType,
                carId:data.carId,
                brandModelName:data.brandModelName,
                customer:data.customer,
                businessType:data.businessType,
                contractNo:data.contractNo,
                orderCarNo:data.orderCarNo,
                payType:data.payType,
                payDay:data.payDay,
                rentStart:data.rentStart,
                rentEnd:data.rentEnd
            });
            if(data.rentTypeItem!=null && data.rentTypeItem!=''){
                $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + data.rentTypeItem, function (r) {
                    vm.feeItemLst = r.datas;
                });
                $.get(baseURL + "contract/contracordernotemplate/contractLst/"+ data.rentTypeItem, function (r) {
                    vm.contractLst = r.contractLst;
                });
            }
        },
        editfeeItemlistener: function (obj) {
            //
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regInt = /^[0-9]*$/;
            var v;
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
                v = '';
            }else {
                if (field === 'money') {//分期金额
                    v = Number(value).toFixed(2);
                }
            }
            vm.spareRelerecord.feeLst.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) value.money = v;
            });
            vm.reloadFeeItem();
        },
        feeItemDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.spareRelerecord.feeLst.length;i++) {
                    if(vm.spareRelerecord.feeLst[i].serializeId === serializeId) {
                        vm.spareRelerecord.feeLst.splice(i,1);
                        i= i-1;
                        break;
                    }
                }
                vm.reloadFeeItem();
            });
        },
        transferCar: function(){
            var param = {
                brandId: vm.spareCarApply.brandId,
                seriesId: vm.spareCarApply.seriesId,
                modelId: vm.spareCarApply.modelId,
                isSpareCar: 1
            };
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/common/selectcarcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        initCommonData: function(data){
            vm.spareCarApply = Object.assign({},vm.spareCarApply,{
                carNo:data.carNo,
                vinNo:data.vinNo,
                carId:data.carId
            })
        },
        resetContract: function () {
            vm.spareCarApply = Object.assign({}, vm.spareCarApply, {
                spareContractNo:null,
                startTime:null,
                endTime:null,
                contractRemark:null
            });
            contractUpload.clearFile();
        },
        cancel: function () {
            //取消
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
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
        requestAction: function (action,type) {
            PageLoading();
            var closeBox = false;
            vm.spareCarApply.fileLst = vm.fileLst;
            vm.spareCarApply.contractLst = vm.fileLst1;
            vm.spareCarApply.feeLst = vm.spareRelerecord.feeLst;
            if (vm.spareRelerecord.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            if(vm.spareRelerecord.feeLst.filter(function (value) {
                return value.typeFieldName == 'monthly_rent';
            }).length > 0){
                if(vm.spareCarApply.paymentDay == null || vm.spareCarApply.paymentDay == ''){
                    alert('备用车申请有月租,需要填写付款日！');
                    return;
                }
                var paymentMethod = vm.spareRelerecord.feeLst.filter(function(value){
                    if(value.typeFieldName == 'monthly_rent'){
                        return value.paymentMethod;
                    }
                })[0].paymentMethod;
                $.ajaxSettings.async = false;
                var verificationTime;
                $.get(baseURL + 'order/ordercar/verificationTime?startTime='+vm.spareCarApply.handleTime+'&endTime='+vm.spareCarApply.returnTime+'&paymentMethod='+paymentMethod, function (r) {
                    verificationTime = r;
                });
                $.ajaxSettings.async = true;
                if (verificationTime == null || parseInt(verificationTime.code) !== 0){
                    RemoveLoading();
                    alert(verificationTime.msg);
                    return;
                }
            }else{
                var startTime = new Date(Date.parse(vm.spareCarApply.handleTime));
                var endTime = new Date(Date.parse(vm.spareCarApply.returnTime));
                if(startTime>endTime){
                    alert("预计归还时间小于备用车交车时间！")
                    return;
                }
            }
            vm.spareCarApply.id = vm.businessId;
            vm.spareCarApply.processApproveForm = {
                approveId:vm.approveId,
                instanceId:vm.instanceId,
                approveContent:vm.boxTxt,
                processKey:vm.processKey,
                nodeId:vm.nodeId,
                processOperationType:type,
                approveFileList:vm.fileLst2,
            };
            $.ajax({
                type: "POST",
                url: baseURL + "cartransfer/sparecar/" + action,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.spareCarApply),
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
                return vm.requestAction('handelNoBusiness',4);
            });
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
                content: tabBaseURL + "modules/order/sparecarflow.html",
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
                return vm.requestAction('handelNoBusiness',3);
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
                return vm.requestAction('handelNoBusiness',1);
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
                return vm.requestAction('handelNoBusiness',2);
            });
        },
        inputBindtapHandleMile: function () {
            this.spareCarApply.handleMile = checkNum(this.spareCarApply.handleMile);
        },
        inputBindtapNextMile: function (){
            this.spareCarApply.nextMile = checkNum(this.spareCarApply.nextMile);
        },
        saveOrUpdate: function () {
            if(vm.spareCarApply.orderCarId == null || vm.spareCarApply.orderCarId == ''){
                alert('请根据车牌号或订单号选择车辆订单！');
                return false;
            }
            //保存
            vm.spareCarApply.fileLst = vm.fileLst;
            vm.spareCarApply.contractLst = vm.fileLst1;
            vm.spareCarApply.feeLst = vm.spareRelerecord.feeLst;
            if (vm.spareRelerecord.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            if(vm.spareRelerecord.feeLst.filter(function (value) {
                return value.typeFieldName == 'monthly_rent';
            }).length > 0){
                if(vm.spareCarApply.paymentDay == null || vm.spareCarApply.paymentDay == ''){
                    alert('备用车申请有月租,需要填写付款日！');
                    return;
                }
                var paymentMethod = vm.spareRelerecord.feeLst.filter(function(value){
                    if(value.typeFieldName == 'monthly_rent'){
                        return value.paymentMethod;
                    }
                })[0].paymentMethod;
                $.ajaxSettings.async = false;
                var verificationTime;
                $.get(baseURL + 'order/ordercar/verificationTime?startTime='+vm.spareCarApply.handleTime+'&endTime='+vm.spareCarApply.returnTime+'&paymentMethod='+paymentMethod, function (r) {
                    verificationTime = r;
                });
                $.ajaxSettings.async = true;
                if (verificationTime == null || parseInt(verificationTime.code) !== 0){
                    RemoveLoading();
                    alert(verificationTime.msg);
                    return;
                }
            }else{
                var startTime = new Date(Date.parse(vm.spareCarApply.handleTime));
                var endTime = new Date(Date.parse(vm.spareCarApply.returnTime));
                if(startTime>endTime){
                    alert("预计归还时间小于备用车交车时间！")
                    return;
                }
            }
            vm.spareCarApply.spareCarStatus = 1;
            vm.spareCarApply.isApply = 1;
            vm.spareCarApply.processKey = vm.processKey;
            vm.spareCarApply.id = vm.businessId;
            var url =  (vm.isReedit === 1) ?"cartransfer/sparecar/save":"cartransfer/sparecar/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.spareCarApply),
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
        }
    }
});

function inputSelect(){
    var code = $("#contractValue").val();
    var id = $('datalist>option[value="'+code+'"]').attr("text");
    if (id == null || id === ''){
        vm.resetContract();
        Vue.set(vm.spareCarApply, 'spareContractNo', code);
    }
    var obj = vm.contractLst.filter(function (obj) {
        return obj.id == id;
    })[0];
    if (obj != null){
        vm.spareCarApply = Object.assign({}, vm.spareCarApply, {
            id:id,
            spareContractNo:obj.code,
            startTime:obj.timeStart,
            endTime:obj.timeFinish,
            contractRemark:obj.desc,
        });
        vm.spareCarApply = Object.assign({},vm.spareCarApply,{
            contractId:id
        });
        contractUpload.updateFile(obj.fileLst);
    }
}
function isShowContent() {
    return instanceStatus == 2 || instanceStatus == 5 ||instanceStatus == 6;
}
function getAuditStatusStr() {
    return '备用车申请审核中';
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

function initTable(table, soulTable) {
    table.render({
        id: 'feeLstid',
        elem: '#feeLst',
        data: vm.spareRelerecord.feeLst,
        cols: [[
            {field:'typeFieldDesc', title: '类型'},
            {field:'money', title: '金额/元', edit: 'text'},
            {field:'paymentMethod', title: '付款方式', templet: '#selectPaymentMethod'},
            {field:'paymentMethod', title: '总期数'
                , templet: function (d) {
                    var txt = '--';
                    if (d.typeFieldName === 'monthly_rent' && vm.spareCarApply.handleTime != null && vm.spareCarApply.handleTime != '' && vm.spareCarApply.returnTime != null && vm.spareCarApply.returnTime != ''){
                        txt = calculateDateDifferMonths(vm.spareCarApply.handleTime, vm.spareCarApply.returnTime);
                    }
                    return txt;
                }
            },
            {field:'timePayment1st', title: '第一次付款日期', event: 'selectTimePayment1st'
                , templet: function (d) {
                    var txt = d.timePayment1st;
                    if ((/\d+/).test(txt)){
                        txt = isEmpty(dateFormatYMD(txt));
                    }else if (d.typeFieldName === 'monthly_rent'){
                        txt = '--';
                    }else txt = '请选择第一次付款日期';
                    return txt;
                }
            },
            {title: '操作', width: 120, templet: '#feeItemBarTpl', fixed: "right", align: "center"}
        ]],
        page: true,
        limits: [5, 8, 15],
        limit: 5,
        done: function (res, curr, count) {
            $('td[data-field="paymentMethod"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;
                var value = vm.spareRelerecord.feeLst.filter(function (value) {
                    return value.serializeId == serializeId;
                })[0].paymentMethod;
                $(this).val(value);
            });
            layui.form.render('select');
            $('td[data-field="timePayment1st"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {
    table.on('edit(feeLst)', function(obj){
        vm.editfeeItemlistener(obj);
    });
}

function initTableEvent(table) {
    table.on('tool(feeLst)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'delect') {
            vm.feeItemDelectObj(obj);
        }else if (layEvent === 'selectTimePayment1st') {
            if (data.typeFieldName == 'monthly_rent'){
                return;
            }
            var txt = '';
            if ((/\d+/).test(data.timePayment1st)){
                txt = isEmpty(dateFormatYMD(data.timePayment1st));
            }else {
                var now = new Date();
                txt = now.format('yyyy-MM-dd');
            }
            this.firstChild.textContent = txt;
            layui.laydate.render({
                elem: this.firstChild,
                trigger: 'click',
                closeStop: this,
                isInitValue: false,
                value: txt,
                show: true,
                done: function (value, date) {
                    data.timePayment1st = new Date(value).getTime();
                    vm.spareRelerecord.feeLst.forEach(function (value) {
                        if (value.serializeId === data.serializeId) value.timePayment1st = data.timePayment1st;
                    });
                    vm.reloadFeeItem();
                }
            });
        }
    });
}

function calculateDateDifferMonths(start, end) {
    var start_datas = start.split('-');
    var end_datas = end.split('-');
    var start_year = parseInt(start_datas[0]);
    var start_month = parseInt(start_datas[1]);
    var start_day = parseInt(start_datas[2]);
    var end_year = parseInt(end_datas[0]);
    var end_month = parseInt(end_datas[1]);
    var end_day = parseInt(end_datas[2]);
    return differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
}
function differMonths(start_year, start_month, start_day, end_year, end_month, end_day) {
    if (start_year === end_year){//同一年
        if (start_month === end_month){//同月
            if (start_day < end_day){//开始日小于结束日
                if (start_day > 1 || !isMonthLastday(end_year, end_month, end_day)){//不足一个月
                    return 0;
                } else {
                    if (vm.tenancyCalcType === 2) {
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
                        if (vm.tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
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
                        if (vm.tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
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

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

