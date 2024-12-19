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

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        contraccarSource: {},
        fileLst: [],
        fileLstId: '0',
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.contraccarSource = param.data;
        if (_this.contraccarSource.fileLst != null){
            _this.fileLst = _this.contraccarSource.fileLst;
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            vm.contraccarSource.fileLst = vm.fileLst;
            var url = vm.contraccarSource.id == null ? "order/contraccarsource/save" : "order/contraccarsource/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.contraccarSource),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
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
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {
    upload.render({
        elem: '#addFile',
        url: baseURL + 'file/uploadFile',
        data: {'path':'contract'},
        field:'files',
        auto:true,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        choose: function(obj){
            PageLoading();
            obj.preview(function(index, file, result){
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1:0;
                fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                var fileTmp={
                    id: fileIdTmp,
                    nameDesc:'车辆来源合同附件',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };
                vm.fileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.fileLst.forEach(function (value) {
                    if (value.id === fileIdTmp) value.url = res.data[0];
                });
                vm.fileLstId = 'fileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
            }
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delFile(fileIdTmp);
            fileIdTmp = null;
        }
    });
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
                    validate_code: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "合同编号不能为空";
                    }
                }
            },
                    validate_contractStart: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "合同生效日期不能为空";
                    }
                }
            },
                    validate_contractEnd: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "合同终止日期不能为空";
                    }
                }
            },
            });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}

function initTable(table, soulTable) {

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {
    var timeStart = laydate.render({
        elem: '#timeStart',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contraccarSource.contractStart = value;
        }
    });

    var timeFinish = laydate.render({
        elem: '#timeFinish',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contraccarSource.contractEnd = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}