
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


    // layui.upload.render({
    //     elem: '#addFile',
    //     url: baseURL + 'file/uploadFile',
    //     data: {'path':'advance'},
    //     field:'files',
    //     auto:true,
    //     size: 50*1024*1024,
    //     accept: 'file', //普通文件
    //     acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
    //     exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
    //     multiple: true,
    //     number:10,
    //     choose: function(obj){
    //         PageLoading();
    //         obj.preview(function(index, file, result){
    //             var fileName = file.name;
    //             var extIndex = fileName.lastIndexOf('.');
    //             var ext = fileName.slice(extIndex);
    //             var fileNameNotext = fileName.slice(0, extIndex);
    //             var regExt = /png|jpg|jpeg/;
    //             var fileType = regExt.test(ext) ? 1:0;
    //             fileIdTmp = vm.fileLst.length + '_' + uuid(60);
    //             var fileTmp={
    //                 id: fileIdTmp,
    //                 operationId:sessionStorage.getItem("userId"),
    //                 operationName:sessionStorage.getItem("username"),
    //                 nameDesc:'司机预支工资附件',
    //                 nameAccessory:fileNameNotext,
    //                 nameFile:fileName,
    //                 nameExt:ext,
    //                 typeFile:fileType,
    //             };
    //             vm.fileLst.push(fileTmp);
    //         });
    //     },
    //     done: function (res) {
    //         RemoveLoading();
    //         if (res.code == '0') {
    //             vm.fileLst.forEach(function (value) {
    //                 if (value.id === fileIdTmp) value.url = res.data[0];
    //             });
    //             vm.fileLstId = 'fileLstId_' + uuid(6);
    //         } else {
    //             layer.msg('上传失败', {icon: 5});
    //             vm.delFile(fileIdTmp);
    //         }
    //         fileIdTmp = null;
    //     },
    //     error: function () {
    //         RemoveLoading();
    //         layer.msg('上传失败', {icon: 5});
    //         vm.delFile(fileIdTmp);
    //         fileIdTmp = null;
    //     }
    //
    // });
});


var vm = new Vue({
    el:'#rrapp',
    data: {
        q: {
            keyword: null
        },
        advanceEntity: {},
        verify: false,
        fileLstId: '0',
        fileLst:[],
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.advanceEntity = param.data;
        _this.fileLst = param.data.accessoryEntities;

    },

    mounted:function() {
        // $.ajaxSettings.async = false


    },
    updated: function () {
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
        saveOrUpdate: function (event) {
              var url = vm.advanceEntity.id == null ? "/driveradvance/save" : "/driveradvance/update";
              vm.advanceEntity.accessoryEntities=vm.fileLst;
               PageLoading();
           $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.advanceEntity),
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
    Upload({
        elid: 'fileLstId',
        edit: true,
        fileLst: vm.fileLst,
        param: {'path':'chlchannel'},
        fidedesc: '司机预支工资附件'
    }).initView();
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
        driverName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "司机名称不能为空";
                }
            }
        },
        mobile: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "手机号不能为空";
                }
            }
        },
        advanceAmount: function (value, item) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "预支金额不能为空";
                }
                if(matchZhengShu(value)!=1){
                    return "预支金额必须为数字";
                }
                if(value <=0){
                    return "预支金额必须大于0";
                }

        },
        carPlateNo: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "车牌号不能为空";
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
    laydate.render({
        elem: '#sendTimeStart',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.sendTimeStart = value;
        }
    });
    laydate.render({
        elem: '#sendTimeEnd',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.sendTimeEnd = value;
        }
    });

    laydate.render({
        elem: '#useTimeStart',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.useTimeStart = value;
        }
    });

    laydate.render({
        elem: '#useTimeEnd',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.useTimeEnd = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function matchNum(theObj){
    var reg = /^[0-9]+\.?[0-9]*$/;
    if (reg.test(theObj)) {
        return 1;
    }
    return 0;
}


function matchZhengShu(theObj){
    var reg = /^\d+(?=\.{1}\d+$|$)/
    // var reg2= /^(\-)*(\d+)\.(\d\d).*$/;
    if (reg.test(theObj)) {
        return 1;
    }
    return 0;
}


