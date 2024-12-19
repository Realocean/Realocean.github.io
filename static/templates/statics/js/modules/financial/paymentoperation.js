$(function () {
    vm.detail(window.localStorage.getItem("id"));

    layui.use('form', function(){
        var form = layui.form;
        form.render(); //更新全部
    });
    layui.form.on('select(paymentMethod)', function (data) {
        vm.payment.paymentMethod = data.value;
    });


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
        fileLst: [],
        fileLstId: '0'
    },

    computed: {
        collectionTypeStr : {
            get : function () {
                if (this.payment.paymentType == 0) {
                    return isEmpty(this.payment.paymentContent);
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
                }else if (this.payment.paymentType == 12) {
                    return "挂靠费"
                } else if (this.payment.paymentType == 13) {
                    return "应付转下期"
                } else if (this.payment.paymentType == 14) {
                    return "渠道返利"
                }  else if (this.payment.paymentType == 15) {
                    if(this.payment.extendType != null) {
                        if (13 == this.payment.extendType) {
                            return "超险罚款"
                        } else if (14 == this.payment.extendType) {
                            return "超保罚款"
                        } else if (11 == this.payment.extendType || 12 == this.payment.extendType) {
                            return this.payment.extendTypeName
                        } else if (2 == this.payment.extendType) {
                            return "商业险"
                        } else if (3 == this.payment.extendType) {
                            return "交强险"
                        } else if (4 == this.payment.extendType) {
                            return "承运险"
                        }else if(20 == this.payment.extendType) {
                            return "保养费用"
                        }else if(21 == this.payment.extendType) {
                            return "出险费用"
                        }

                        return "维保相关费用";
                    }
                } else{
                    return "--"
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
                    }else if(this.payment.paymentMethod==3){
                        return "半年付"
                    }else if(this.payment.paymentMethod==4){
                        return "年付"
                    }else if(this.payment.paymentMethod==5){
                        return "一次性结清"
                    } else if (this.payment.paymentMethod == 7) {
                        return "日付";
                    } else if (this.payment.paymentMethod == 8) {
                        return "周付";
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
        query: function () {
            vm.reload();
        },

        detail: function (id) {
            $.get(baseURL + "financial/paymentbill/detail/"+id, function(res){
                vm.payment = res.data;
            });

        },
        nodeCancel: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        selectPayDate: function () {
            var index = layer.open({
                title: "其他时间付款",
                type: 1,
                content: '<div style="margin: 30px"><input id="payDate" type="text" class="layui-input" placeholder="请选择付款时间" autocomplete="off" readonly/></div>',
                btn: ['确定'],
                success: function(layero,num){
                    layui.laydate.render({
                        elem: '#payDate',
                        trigger: 'click',
                        done: function (value) {}
                    });
                },
                btn1: function () {
                    // 创建一个链接，模拟点击下载
                    var payDate = $('#payDate').val();
                    if (!payDate) {
                        alert('请选择付款时间');
                        return;
                    }
                    console.log(payDate)
                    // confirm('新增流水', function () {
                    // });
                    vm.payment.payDate = payDate;
                    vm.save(3);
                },
                end: function () {
                    layer.close(index);
                }
            });
        },
        save: function (type) {
            vm.payment.fileLst = vm.fileLst;
            vm.payment.condition = type;
            var url = "financial/paymentbill/payment";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.payment),
                success: function (r) {
                    if (r.code == 0) {
                        layer.alert('操作成功', function (index) {
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    } else {
                        layer.alert(r.msg);
                    }
                }
            });
        },

        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    keyword: vm.q.keyword
                }
            });
        }
    }
});
