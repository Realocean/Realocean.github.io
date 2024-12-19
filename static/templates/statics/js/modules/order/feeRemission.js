$(function () {
    layui.use(['form', 'layedit', 'laydate', 'element', 'table'], function () {
        init(layui);
        layui.form.render();
    });
});

var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        order:{},
        costRelief:{
            applyTime:new Date().format("yyyy-MM-dd hh:mm:ss")
        },
        //附件
        deliveryFileLst:[],
        deliveryFileLstId: 'deliveryFileLstId_0',
        type:null,
    },
    computed: {},
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.order = param.data;
        _this.type = param.data2;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function () {
             //子订单id
            if(vm.type==0){
                vm.costRelief.orderCarId =vm.order.orderCarIds;

            }else{
                vm.costRelief.orderCarId =vm.order.orderCarId;

            }
            vm.costRelief.sysAccessoryEntityList = vm.deliveryFileLst;

            $.ajax({
                type: "POST",
                url: baseURL + "costrelief/cosrelief/save",
                contentType: "application/json",
                data: JSON.stringify(vm.costRelief),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            parent.layer.closeAll();
                        });
                    } else {
                        alert(r.msg);
                        parent.layer.closeAll();
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


function init(layui) {
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);

}



function initEventListener(layui) {
    initChecked(layui.form);
    initVerify(layui.form);
}
function initDate(laydate) {
    laydate.render({
        elem: '#applyTimeStr',
        type: 'datetime',
        trigger: 'click',
        done: function (value) {
            vm.costRelief.applyTime = value;
        }
    });
}
function initChecked(form) {
    form.on('submit(submitEditData)', function () {
        vm.saveOrUpdate();
        return false;
    });
}


function initVerify(form) {
    form.verify({
        creditAmount_verify: function (value, item) {
            if (value == null || value == '') {
                return "申请减免金额/元不能为空";
            }
        },
        /*applyTime_verify: function (value, item) {
            if (value == null || value == '') {
                return "申请时间不能为空";
            }
        },*/
    });
}


function initUpload(upload) {
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path': 'costrelief'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
        multiple: true,
        number:20,
        choose: function (obj) {
            PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
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
//金额输入处理
function moneyInput(value) {
    //修复第一个字符是小数点 的情况.
    let fa = '';
    if (value !== '' && value.substr(0, 1) === '.') {
        value = "";
    }
    value = value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf(".") < 0 && value !== "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (value.substr(0, 1) === '0' && value.length === 2) {
            value = value.substr(1, value.length);
        }
    }
    value = fa + value;
    return value;
}
