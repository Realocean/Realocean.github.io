$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        upload = layui.upload;

        form.verify({
            paidAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(value!=''){
                    if(!reg.test(value)){
                        return '实际付款金额输入格式不正确(大于0或保留两位小数的正整数)!';
                    }

                    var copeWithAmount = vm.payment.copeWithAmount;
                    if(eval(value) > eval(copeWithAmount)){
                        return '实际付款金额不能大于应付金额';
                    }
                }
            },

        });
        laydate.render({
            elem: '#paymentTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.payment.paymentTime=value;
            }
        });

        form.render();
    });

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

    layui.form.on('select(paymentMethod)', function (data) {
        vm.payment.paymentMethod = data.value;
    });


    // 上传附件
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#addFile',
            url: baseURL + 'file/uploadFile',
            data: {'path':'voucher'},
            field:'files',
            auto:true,
            size: 50*1024*1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar',
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
                    fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                    var fileTmp={
                        id: fileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc:'收款凭证',
                        nameAccessory:fileNameNotext,
                        nameFile:fileName,
                        nameExt:ext,
                        typeFile:fileType,
                    };
                    vm.fileLst.push(fileTmp);
                });
            },
            done: function (res) {
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
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });
});


var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        paymentItems :true,
        acountMoneyShow : false,
        extraMoneyShow : false,
        payment: {},
        carSourceOrder:{},
        fileLst: [],
        fileLstId: '0',
        isType:1,
        title:null,
        amountLabel:null,
        dateLabel: null,
    },

    computed: {
        collectionTypeStr : {
            get : function () {
                if (this.payment.paymentType == 0) {
                    return '全部';
                } else if (this.payment.paymentType == 1) {
                    return '保证金';
                } else if (this.payment.paymentType == 2) {
                    return '租金';
                } else if (this.payment.paymentType == 3) {
                    return '首付款';
                } else if (this.payment.paymentType == 4) {
                    return '退车结算款';
                } else if (this.payment.paymentType == 5) {
                    return '换车结算款';
                } else if (this.payment.paymentType == 6) {
                    return '备用车结算款';
                } else if (this.payment.paymentType == 7) {
                    return '整备费结算款';
                }else if (this.payment.paymentType == 8) {
                    return '尾款结算款';
                }else if (this.payment.paymentType == 9) {
                    return '定金结算款';
                }else if (this.payment.paymentType == 10) {
                    return '其他费用结算款';
                }else if (this.payment.paymentType == 11) {
                    return '车辆总单价';
                }else {
                    return '--';
                }
            }
        },
        colleTypeStr : {
            get : function () {
                if (this.payment.paymentType == 0) {
                    return '费用明细';
                } else if (this.payment.paymentType == 1) {
                    return '保证金费用明细';
                } else if (this.payment.paymentType == 2) {
                    return '租金费用明细';
                } else if (this.payment.paymentType == 3) {
                    return '首付款费用明细';
                } else if (this.payment.paymentType == 4) {
                    return '退车费用明细';
                } else if (this.payment.paymentType == 5) {
                    return '换车费用明细';
                } else if (this.payment.paymentType == 6) {
                    return '备用车费用明细';
                } else if (this.payment.paymentType == 7) {
                    return '整备费费用明细';
                }else if (this.payment.paymentType == 8) {
                    return '尾款费用明细';
                }else if (this.payment.paymentType == 9) {
                    return '定金费用明细';
                }else if (this.payment.paymentType == 10) {
                    return '其他费用费用明细';
                }else if (this.payment.paymentType == 11) {
                    return '车辆总单价';
                }else {
                    return '--';
                }
            }
        },
        paymentMethodStr : {
            get : function () {
                if (this.payment.collectionType == 2) {

                    if(this.payment.paymentMethod==0){
                        return "全部"
                    }else if(this.payment.paymentMethod==1){
                        return "月付"
                    }else if(this.payment.paymentMethod==2){
                        return "两月付"
                    }else if(this.payment.paymentMethod==3){
                        return "季付"
                    }else if(this.payment.paymentMethod==6){
                        return "半年付"
                    }else if(this.payment.paymentMethod==4){
                        return "年付"
                    }else if(this.payment.paymentMethod==5){
                        return "一次性结清"
                    }else if(this.payment.paymentMethod==7){
                        return "日付"
                    }else if(this.payment.paymentMethod==8){
                        return "周付"
                    }else{
                        return "--";
                    }
                }  else {
                    return '--'
                }
            }
        },
    },

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

        selectPayDate:function (type){
            vm.isType = type;
            if(type == 3){
                $("#pay").css('display','block');
            } else {
                $("#paymentTime").val("");
                $("#pay").css('display','none');
            }
        },

        cancel: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },

        saveOrUpdate: function () {
            vm.payment.fileLst = vm.fileLst;
            vm.payment.isType = vm.isType;
            var url = "pay/carsourceorder/confirmPayBill";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.payment),
                success: function(r){
                    if(r.code == 0){
                        layer.alert('操作成功', function(index){
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                            parent.vm.reloadPayBillPage(vm.carSourceOrder.id,1);
                            parent.vm.reloadPaidBillPage(vm.carSourceOrder.id,2);
                        });
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
    }
});

//编辑时父页面传过来的值
function sendData(data,orderData) {
    vm.payment = data;
    vm.carSourceOrder = orderData;
    if (data.paymentType == 0) {
        if(data.paymentContent != null){
            vm.title =  data.paymentContent;
        } else {
            vm.title = "其他";
        }
    } else if (data.paymentType == 1) {
        vm.title = "保证金";
    } else if (data.paymentType == 2) {
        vm.title = "月租金";
    } else if (data.paymentType == 3) {
        vm.title = "首付款";
    } else if (data.paymentType == 4) {
        vm.title = "退车结算款";
    } else if (data.paymentType == 5) {
        vm.title = "换车结算款";
    } else if (data.paymentType == 6) {
        vm.title = "备用车结算款";
    } else if (data.paymentType == 7) {
        vm.title = "整备费结算款";
    }else if (data.paymentType == 8) {
        vm.title = "尾款结算款";
    }else if (data.paymentType == 9) {
        vm.title = "定金结算款";
    }else if (data.paymentType == 10) {
        vm.title = "其他费用结算款";
    }else if (data.paymentType == 11) {
        vm.title = "车辆总单价";
    }else {
        vm.title = "--";
    }
    vm.payment.note = ""
    layui.form.render();
}
