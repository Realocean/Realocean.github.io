$(function () {
    if(parent.layui.larryElem != undefined){
        var data = parent.layui.larryElem.boxParams;
        vm.carDisposal = data;
        vm.openCurrent = true;
    }

    layui.use(['form','upload','laydate'], function () {
        var upload = layui.upload;
        var form = layui.form;
        form.on('select(disposalReasonSelect)', function (data) {
            vm.carDisposal.disposalReason = data.value;
        });
        layui.laydate.render({
            elem: '#disposalTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carDisposal.disposalTime = value;
            }
        });
        form.on('submit(save)', function () {
            vm.save();
            return false;
        });
        form.verify({
            disposalReason:function (value) {
                if (value == "" || value == null) {
                    return '处置原因不能为空';
                }
            },
            disposalTime:function(value){
                if (value == "" || value == null) {
                    return '处置时间不能为空';
                }
            }
        });
        uploadAttachment(upload);
        layui.upload.render({
            elem: '#addFile2',
            url: baseURL + 'file/uploadFile',
            data: {'path':'processApprove'},
            field:'files',
            auto:true,
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
        BpmChart({instanceId: vm.instanceId}).initView();
        form.render();
    });
});
var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        carDisposal:{},
        disposalReasonList:[],
        bpmChartDtoList:[],
        instanceId:null,
        openFlow:false,
        boxShow: false,
        fileLst2:[],
        fileLstId2: '0',
        boxInputShow: false,
        boxTitle: '',
        boxMark: '',
        boxHolder: '',
        boxTxt: '',
        viewTag:'add',
        recallNodeName:null,
        processApproveForm:{},
        nodeType:null,
        instanceStatus:null,
        openCurrent:false,
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        $.getJSON(baseURL + "sys/dict/getInfoByType/disposalReason", function (r) {
            _this.disposalReasonList = r.dict;
        });
        var carId = window.localStorage.getItem("carId");
        if(carId != null && carId != '' && carId != undefined){
            $.getJSON(baseURL + "car/disposal/info/" + carId, function (r) {
                _this.carDisposal = {
                    id: r.carDisposal.id,
                    carNo: r.carDisposal.carNo,
                    vinNo: r.carDisposal.vinNo,
                    carBrandSeriesModelName: r.carDisposal.carBrandSeriesModelName,
                    depotName: r.carDisposal.depotName,
                    storageTime: r.carDisposal.storageTime,
                    carId: r.carDisposal.carId,
                    disposalReason: r.carDisposal.disposalReason,
                    disposalTime: r.carDisposal.disposalTime,
                    remark: r.carDisposal.remark,
                    id: r.carDisposal.id
                };
                _this.deliveryFileLst = r.carDisposal.fileLst;
            });
        }

        if(param != undefined){

            _this.instanceId = param.instanceId;
            _this.recallNodeName = param.recallName;
            _this.viewTag = param.viewTag;
            _this.instanceStatus = param.instanceStatus;
            _this.processApproveForm = param;
            $.get(baseURL + "activity/getNodeType",{instanceId:param.instanceId},function(r){
                _this.nodeType = r.nodeType;
            });
            _this.openFlow = true;
            // if(_this.viewTag != 'edit'){
            //     $.get(baseURL + "activity/bpmChart",{processKey:param.processKey,instanceId:param.instanceId}, function (r) {
            //         if (r.code == 0){
            //             _this.bpmChartDtoList = r.bpmChart;
            //             _this.openFlow = true;
            //         }
            //     });
            // }
        }

        if(_this.viewTag == 'add'){
            $.get(baseURL + "activity/bpmInitChart",{processKey:"carDisposalApprove"}, function (r) {
                if (r.code == 0){
                    _this.bpmChartDtoList = r.bpmInitChart;
                    _this.openFlow = r.openFlow;
                }
            });
        }

        $.ajaxSettings.async = true;
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        requestAction: function (action,type) {
            PageLoading();
            vm.processApproveForm.processOperationType = type;
            vm.processApproveForm.businessId = vm.carDisposal.id;
            vm.processApproveForm.approveContent = vm.boxTxt;
            vm.processApproveForm.approveFileList=vm.fileLst2;
            var closeBox = false;
            $.ajax({
                type: "POST",
                url: baseURL + "car/disposal/" + action,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.processApproveForm),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closeBox = true;
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.vm.reload();
                            parent.layer.close(index);
                        });
                    } else {
                        closeBox = false;
                        alert(r.msg);
                    }
                }
            });
            return closeBox;
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
        approve:function(){
            vm.boxTitle = '审核通过';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                return vm.requestAction('handle', 4);
            });
        },
        reject:function(){
            vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('handle', 3);
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
        reedit:function(){
            vm.viewTag = 'reedit';
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
        save: function(){
            vm.carDisposal.fileLst = vm.deliveryFileLst;
            vm.carDisposal.viewTag = vm.viewTag;
            vm.carDisposal.instanceId = vm.processApproveForm.instanceId;
            var url = vm.carDisposal.id == null ? "car/disposal/save" : "car/disposal/updateData";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carDisposal),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            if(vm.openCurrent){
                                closeCurrent();
                            }
                            if(vm.viewTag == 'add'){
                                parent.vm.initStatusCar();
                                parent.vm.initTableCols();
                            }
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        cancel: function(){
            parent.layer.closeAll();
            if(vm.openCurrent){
                closeCurrent();
            }
        },
        delDeliveryFile: function (id) {
            for(var i = 0 ;i<vm.deliveryFileLst.length;i++) {
                if(vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i,1);
                    i= i-1;
                }
            }
        }
    }
});
/**
 * 上传附件
 */
function uploadAttachment(upload){
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path':'record'},
        field:'files',
        auto:true,
        size: 30*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg', //
        multiple: true,
        number:20,
        choose: function(obj){
            PageLoading();
            obj.preview(function(index, file, result){
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1:0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp={
                    id: deliveryFileIdTmp,
                    nameDesc:'附件',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };
                vm.deliveryFileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
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
}
