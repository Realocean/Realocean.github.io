$(function () {
    $("#skAmount").attr("lay-verify","required");
    vm.detail(window.localStorage.getItem("receivablesId"));

    layui.use('form', function(){
        var form = layui.form;
        form.render(); //更新全部
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;


        laydate.render({
            elem: '#collectionTime',
            trigger: 'click',
            type:"datetime",
            done: function (value, date, endDate) {
                vm.receivables.collectionTime = value;
            }
        });

        form.render();
    });


    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
    layui.form.on('select(paymentType)', function (data) {
        vm.receivables.paymentType = data.value;
    });
    layui.form.on('radio(extraMoney)', function (data) {
        vm.receivables.extraMoney = data.value;
    });
    layui.form.on('select(isBalance)', function (data) {
        vm.receivables.isBalance = data.value;

        if(data.value==1){
            vm.acountMoneyShow = true;
            $("#dkAcountMoney").attr("lay-verify","required");

            var n = parseFloat(vm.receivables.dkAcountMoney==null||vm.receivables.dkAcountMoney==""?0:vm.receivables.dkAcountMoney) + parseFloat(vm.receivables.skAmount==null||vm.receivables.skAmount==""?0:vm.receivables.skAmount);
            if(parseFloat(vm.receivables.dkAcountMoney==null||vm.receivables.dkAcountMoney==""?0:vm.receivables.dkAcountMoney)>parseFloat(vm.receivables.uncollectedAmount)){
                vm.extraMoneyShow = false;
            }else  if(parseFloat(n) > parseFloat(vm.receivables.uncollectedAmount)){
                vm.extraMoneyShow = true;
            }else{
                vm.extraMoneyShow = false;
            }
            vm.receivables.paymentType = 10;
        }else{
            vm.acountMoneyShow = false;
            $("#dkAcountMoney").removeAttr("lay-verify");

            var n = parseFloat(vm.receivables.skAmount==null||vm.receivables.skAmount==""?0:vm.receivables.skAmount);
            if(parseFloat(n) > parseFloat(vm.receivables.uncollectedAmount)){
                vm.extraMoneyShow = true;
            }else{
                vm.extraMoneyShow = false;
            }
            vm.receivables.paymentType = 4;
        }
    });

    layui.form.on('select(isCarUse)', function (data) {

        vm.receivables.isCarUse = data.value;
       // Vue.set(vm.receivables,'isCaaassrUse',"2");
        if(data.value==1){
            $("#remarks").removeAttr("lay-verify");
            $("#dkAcountMoney").attr("lay-verify","required");
            $("#skAmount").attr("lay-verify","required");
            vm.paymentItems = true;
        }else{
            $("#remarks").attr("lay-verify","required");
            $("#dkAcountMoney").removeAttr("lay-verify");
            $("#skAmount").removeAttr("lay-verify");
            vm.paymentItems = false;
        }

    });

    layui.form.on('select(isMargin)', function (data) {
        vm.receivables.isMargin = data.value;
        if(data.value==1){
            vm.orderMoneyShow = true;
            $("#marginMoney").attr("lay-verify","required");
        }else{
            vm.orderMoneyShow = false;
            $("#marginMoney").removeAttr("lay-verify");
        }
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
        orderMoneyShow:false,
        extraMoneyShow : false,
        receivables: {
        },
        fileLst: [],
        fileLstId: '0',
        isType:0,
        collectionType:null,
        middleAmount:null,
        accountVal:null,
        marginVal:null,

    },

    mounted:function (){
        let receivablesId= window.localStorage.getItem("receivablesId");
        $.get(baseURL + "financial/receivables/skReceivablesInfo/"+receivablesId, function(r){
            vm.collectionType= r.receivables.collectionType;
        });
    },

    computed: {
        collectionTypeStr : {
            get : function () {
                let currCollectionTypeStr = getCollectionTypeStr(this.receivables.collectionType);
                if(15 == this.receivables.collectionType || 0 == this.receivables.collectionType){
                    if(this.receivables.collectionTypeName != null && this.receivables.collectionTypeName != ''){
                        currCollectionTypeStr = this.receivables.collectionTypeName;
                    }
                }
                return currCollectionTypeStr;
            }
        },
        colleTypeStr : {
            get : function () {
                return '账单明细';
                // if (this.receivables.collectionType == 0) {
                //     return '费用明细';
                // } else if (this.receivables.collectionType == 1) {
                //     return '保证金费用明细';
                // } else if (this.receivables.collectionType == 2) {
                //     return '租金费用明细';
                // } else if (this.receivables.collectionType == 3) {
                //     return '首付款费用明细';
                // } else if (this.receivables.collectionType == 4) {
                //     return '退车费用明细';
                // } else if (this.receivables.collectionType == 5) {
                //     return '换车费用明细';
                // } else if (this.receivables.collectionType == 6) {
                //     return '备用车费用明细';
                // } else if (this.receivables.collectionType == 7) {
                //     return '整备费费用明细';
                // }else if (this.receivables.collectionType == 8) {
                //     return '尾款费用明细';
                // }else if (this.receivables.collectionType == 9) {
                //     return '定金费用明细';
                // }else if (this.receivables.collectionType == 10) {
                //     return '其他费用费用明细';
                // }else if (this.receivables.collectionType == 11) {
                //     return '车辆总单价';
                // }else if (this.receivables.collectionType == 12) {
                //     return "挂靠费用费用明细";
                // } else {
                //     return '--';
                // }

            }
        },
        paymentMethodStr : {
            get : function () {
                // if (this.receivables.collectionType == 2) {
                    if(this.receivables.paymentMethod==1){
                        return "月付"
                    }else if(this.receivables.paymentMethod==2){
                        return "两月付"
                    }else if(this.receivables.paymentMethod==3){
                        return "季付"
                    }else if(this.receivables.paymentMethod==6){
                        return "半年付"
                    }else if(this.receivables.paymentMethod==4){
                        return "年付"
                    }else if(this.receivables.paymentMethod==5){
                        return "一次性结清"
                    }else if(this.receivables.paymentMethod==7){
                        return "日付"
                    }else if(this.receivables.paymentMethod==8){
                        return "周付"
                    }else{
                        return "--";
                    }
                // }  else {
                //     return '--'
                // }
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


        // formatCollectionType: function (value) {
        //     if (value == 0) {
        //         return '全部'
        //     } else if (value == 1) {
        //         return '保证金'
        //     } else if (value == 2) {
        //         return '租金'
        //     } else if (value == 3) {
        //         return '首付款'
        //     } else if (value == 4) {
        //         return '退车结算款'
        //     } else if (value == 5) {
        //         return '换车结算款'
        //     } else if (value == 6) {
        //         return '备用车结算款'
        //     } else {
        //         return ''
        //     }
        // },

        inputBindtap (param) {
            this.receivables.skAmount = checkNum(this.receivables.skAmount);

            if(this.receivables.isBalance==1){
                var n = parseFloat(this.receivables.dkAcountMoney==null||this.receivables.dkAcountMoney==""?0:this.receivables.dkAcountMoney) + parseFloat(this.receivables.skAmount==null||this.receivables.skAmount==""?0:this.receivables.skAmount);

                if(parseFloat(this.receivables.dkAcountMoney==null||this.receivables.dkAcountMoney==""?0:this.receivables.dkAcountMoney)>parseFloat(this.receivables.uncollectedAmount)){
                    this.extraMoneyShow = false;
                }else if(parseFloat(n) > parseFloat(this.receivables.uncollectedAmount)){
                    this.extraMoneyShow = true;
                }else{
                    this.extraMoneyShow = false;
                }

            }else {
                var n = parseFloat(this.receivables.skAmount==null||this.receivables.skAmount==""?0:this.receivables.skAmount);
                if(parseFloat(n) > parseFloat(this.receivables.uncollectedAmount)){
                    this.extraMoneyShow = true;
                }else{
                    this.extraMoneyShow = false;
                }
            }

             // if (param > this.receivables.uncollectedAmount) {
             //    this.receivables.skAmount = this.receivables.uncollectedAmount;
             // }
        },
        inputAcountMoney (param) {

            this.receivables.dkAcountMoney =  checkNum(this.receivables.dkAcountMoney);
            if (param > this.receivables.acountMoney) {
                this.receivables.dkAcountMoney = this.receivables.acountMoney;
            }

            if(this.receivables.isBalance==1){
                var n = parseFloat(this.receivables.dkAcountMoney==null||this.receivables.dkAcountMoney==""?0:this.receivables.dkAcountMoney) + parseFloat(this.receivables.skAmount==null||this.receivables.skAmount==""?0:this.receivables.skAmount);

                if(parseFloat(this.receivables.dkAcountMoney==null||this.receivables.dkAcountMoney==""?0:this.receivables.dkAcountMoney)>parseFloat(this.receivables.uncollectedAmount)){
                    this.extraMoneyShow = false;
                }else if(parseFloat(n) > parseFloat(this.receivables.uncollectedAmount)){
                    this.extraMoneyShow = true;
                }else{
                    this.extraMoneyShow = false;
                }

            }else {
                var n = parseFloat(this.receivables.skAmount==null||this.receivables.skAmount==""?0:this.receivables.skAmount);
                if(parseFloat(n) > parseFloat(this.receivables.uncollectedAmount)){
                    this.extraMoneyShow = true;
                }else{
                    this.extraMoneyShow = false;
                }
            }
        },

        query: function () {
            vm.reload();
        },

        selectPayDate:function (type){
            vm.isType = type;
            if(type == 3){
                $("#pay").css('display','block');
            } else {
                $("#collectionTime").val("");
                $("#pay").css('display','none');
            }
        },

        detail: function (receivablesId) {
            $.get(baseURL + "financial/receivables/skReceivablesInfo/"+receivablesId, function(r){
                vm.receivables = r.receivables;
                // Vue.set(vm.receivables,'isCarUse',"1");
                // Vue.set(vm.receivables,'isBalance',"1");
                // Vue.set(vm.receivables,'paymentType',"4");
                vm.receivables = Object.assign({}, vm.receivables, {isCarUse: "1"}, {isBalance: 2},{isMargin:2}, {paymentType: "4"}, {skAmount: r.receivables.uncollectedAmount}, {dkAcountMoney: r.receivables.acountMoney}, {balanceDeductionAmount: ''},
                    {remarks: null}, {extraMoney: "1"},{marginDeductionAmount:""},{orderMarginMoney:r.receivables.orderMarginMoney});
                var view_skAmount = $('#skAmount');
                var view_dkAcountMoney = $('#dkAcountMoney');
                var margin_money = $('#marginMoney');
                if (r.receivables.uncollectedAmount && r.receivables.uncollectedAmount > 0){
                    view_skAmount.removeAttr('maxlength');
                    view_skAmount.attr("oninput", "edit(this, 'num', 'skAmount', 'onSkAmountChange', "+(r.receivables.uncollectedAmount||9999999999.99)+", 0)");
                    view_skAmount.attr('oldValue', (r.receivables.uncollectedAmount||9999999999.99));
                }else {
                    view_skAmount.attr('maxlength', 0);
                }

                if (r.receivables.acountMoney && r.receivables.acountMoney > 0){
                    view_dkAcountMoney.removeAttr('maxlength');
                    view_dkAcountMoney.attr("oninput", "edit(this, 'num', 'dkAcountMoney', 'onDkAcountMoneyChange', "+(r.receivables.acountMoney||9999999999.99)+", 0)");
                }else {
                    view_dkAcountMoney.attr('maxlength', 0);
                }
                if (r.receivables.orderMarginMoney && r.receivables.orderMarginMoney > 0){
                    margin_money.removeAttr('maxlength');
                    margin_money.attr("oninput", "edit(this, 'num', 'dkAcountMoney', 'onMarginMoneyChange', "+(r.receivables.orderMarginMoney||9999999999.99)+", 0)");
                }else {
                    margin_money.attr('maxlength', 0);
                }
            });

        },
        nodeCancel: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        saveOrUpdate: function (event) {
            console.log(vm.isType);
            if(vm.isType == 0){
                alert("请选择收款时间!");
                return false;
            } else if(vm.isType == 3){
                console.log(vm.receivables.collectionTime);
                if(vm.receivables.collectionTime == null){
                    alert("请选择收款时间!");
                    return false;
                }
            }

            vm.receivables.fileLst = vm.fileLst;
            vm.receivables.isType = vm.isType;
            var param = JSON.parse(JSON.stringify(vm.receivables));
            param.dkAcountMoney = param.balanceDeductionAmount;
            var url = "financial/receivables/skReceivablesEntity";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function(r){
                    if(r.code == 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                            parent.vm.searchTotalAmount();
                        });
                    }else{
                        alert(r.msg, function(index){
                            //location.reload();
                        });
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

function onSkAmountChange(event, val) {
    var uncollectedAmount = Number(vm.receivables.uncollectedAmount)||0;
    var dkAmount = Number(vm.receivables.balanceDeductionAmount)||0;
    var marginDeductionAmount = Number(vm.receivables.marginDeductionAmount)||0;
    var skAmount = Number(val)||0;
    if (skAmount > uncollectedAmount){
        var view_skAmount = $('#skAmount');
        skAmount = uncollectedAmount;
        vm.receivables.skAmount = skAmount;
        view_skAmount.val(skAmount);
        view_skAmount.attr('oldValue', skAmount);
    }
    var _dkAmount = toMoney(uncollectedAmount-skAmount-marginDeductionAmount);
    if ((skAmount + dkAmount + marginDeductionAmount) > uncollectedAmount && _dkAmount < dkAmount){
        var view_dkAcountMoney = $('#dkAcountMoney');
        vm.receivables.balanceDeductionAmount = _dkAmount;
        view_dkAcountMoney.val(_dkAmount);
        view_dkAcountMoney.attr('oldValue', _dkAmount);
        dkAmount = _dkAmount;
    }
    var _mdAmount = toMoney(uncollectedAmount-skAmount-dkAmount);
    if ((skAmount + dkAmount + marginDeductionAmount) > uncollectedAmount && _mdAmount < marginDeductionAmount){
        var view_mdAcountMoney = $('#marginMoney');
        vm.receivables.marginDeductionAmount = _mdAmount;
        view_mdAcountMoney.val(_mdAmount);
        view_mdAcountMoney.attr('oldValue', _mdAmount);
    }
}

function onDkAcountMoneyChange(event, val) {
    var uncollectedAmount = Number(vm.receivables.uncollectedAmount)||0;
    var skAmount =Number( vm.receivables.skAmount)||0;
    var marginDeductionAmount = Number(vm.receivables.marginDeductionAmount)||0;
    var dkAmount = Number(val)||0;
    if (dkAmount > uncollectedAmount){
        var view_dkAcountMoney = $('#dkAcountMoney');
        dkAmount = uncollectedAmount;
        vm.receivables.balanceDeductionAmount = dkAmount;
        view_dkAcountMoney.val(dkAmount);
        view_dkAcountMoney.attr('oldValue', dkAmount);
    }
    var _skAmount = toMoney(uncollectedAmount-dkAmount-marginDeductionAmount);
    if ((skAmount + dkAmount + marginDeductionAmount) > uncollectedAmount && _skAmount < skAmount){
        var view_skAmount = $('#skAmount');
        if(_skAmount <0){
            _skAmount=0;
        }
        vm.receivables.skAmount = _skAmount;
        view_skAmount.val(_skAmount);
        view_skAmount.attr('oldValue', _skAmount);
        skAmount = _skAmount;
    }
    var _mdAmount = toMoney(uncollectedAmount-skAmount-dkAmount);
    if ((skAmount + dkAmount + marginDeductionAmount) > uncollectedAmount && _mdAmount < marginDeductionAmount){
        var view_mdAcountMoney = $('#marginMoney');
        vm.receivables.marginDeductionAmount = _mdAmount;
        view_mdAcountMoney.val(_mdAmount);
        view_mdAcountMoney.attr('oldValue', _mdAmount);
    }
}

function onMarginMoneyChange(event, val) {
    var uncollectedAmount = Number(vm.receivables.uncollectedAmount)||0;
    var skAmount = Number(vm.receivables.skAmount)||0;
    var dkAmount = Number(vm.receivables.balanceDeductionAmount)||0;
    var mdAmount = Number(val)||0;
    if (mdAmount > uncollectedAmount){
        var view_mdAcountMoney = $('#marginMoney');
        mdAmount = uncollectedAmount;
        vm.receivables.marginDeductionAmount = mdAmount;
        view_mdAcountMoney.val(mdAmount);
        view_mdAcountMoney.attr('oldValue', mdAmount);
    }
    var _skAmount = toMoney(uncollectedAmount-mdAmount-dkAmount);
    if ((skAmount + dkAmount + mdAmount) > uncollectedAmount && _skAmount < skAmount){
        var view_skAmount = $('#skAmount');
        if(_skAmount <0){
            _skAmount=0;
        }
        vm.receivables.skAmount = _skAmount;
        view_skAmount.val(_skAmount);
        view_skAmount.attr('oldValue', _skAmount);
        skAmount = _skAmount;
    }
    var _dkAmount = toMoney(uncollectedAmount-mdAmount-skAmount);
    if ((skAmount + dkAmount + mdAmount) > uncollectedAmount && _dkAmount < dkAmount){
        var view_dkAcountMoney = $('#dkAcountMoney');
        vm.receivables.balanceDeductionAmount = _dkAmount;
        view_dkAcountMoney.val(_dkAmount);
        view_dkAcountMoney.attr('oldValue', _dkAmount);
    }
}

function surplusReceivableAmount(receivables) {
    if (!receivables){
        return 0;
    }
    var uncollectedAmount = Number(receivables.uncollectedAmount)||0;
    var skAmount = Number(receivables.skAmount)||0;
    var dkAmount = Number(receivables.balanceDeductionAmount)||0;
    var marginDeductionAmount = Number(receivables.marginDeductionAmount)||0;
    return Math.abs(toMoney(uncollectedAmount - skAmount - dkAmount - marginDeductionAmount));
}

// function onSkAmountChange(event, val) {
//     var uncollectedAmount = vm.receivables.uncollectedAmount||0;
//     var dkAmount = vm.receivables.balanceDeductionAmount||0;
//     var skAmount = val||0;
//     var _dkAmount = uncollectedAmount-skAmount;
//     if ((skAmount + dkAmount) > uncollectedAmount && _dkAmount < dkAmount){
//         var view_dkAcountMoney = $('#dkAcountMoney');
//         vm.receivables.balanceDeductionAmount = _dkAmount;
//         view_dkAcountMoney.val(_dkAmount);
//         view_dkAcountMoney.attr('oldValue', _dkAmount);
//     }
// }
//
// function onDkAcountMoneyChange(event, val) {
//     var uncollectedAmount = vm.receivables.uncollectedAmount||0;
//     var view_skAmount = $('#skAmount');
//     if(vm.middleAmount !=null){
//         if(val==null || val== ''){
//             var _skAmount = vm.middleAmount+vm.accountVal;
//             vm.receivables.skAmount = _skAmount;
//             view_skAmount.val(_skAmount);
//             view_skAmount.attr('oldValue', _skAmount);
//             vm.middleAmount=_skAmount;
//             return;
//         }
//     }
//     if(vm.middleAmount ==null){
//         var skAmount = vm.receivables.skAmount||0;
//         var dkAmount = val||0;
//         var _skAmount = uncollectedAmount-dkAmount;
//         if ((skAmount + dkAmount) > uncollectedAmount && _skAmount < skAmount){
//             vm.receivables.skAmount = _skAmount;
//             vm.middleAmount=_skAmount;
//             vm.accountVal=Number(dkAmount);
//             view_skAmount.val(_skAmount);
//             view_skAmount.attr('oldValue', _skAmount);
//         }
//     }else{
//         var skAmount = vm.receivables.skAmount||0;
//         var dkAmount = val||0;
//         var _skAmount = vm.middleAmount-dkAmount;
//         if ((skAmount + dkAmount) > vm.middleAmount && _skAmount < skAmount){
//             vm.receivables.skAmount = _skAmount;
//             vm.middleAmount=_skAmount;
//             vm.accountVal=Number(dkAmount);
//             view_skAmount.val(_skAmount);
//             view_skAmount.attr('oldValue', _skAmount);
//         }
//     }
//
// }
//
// function  onMarginMoneyChange(event, val){
//     var uncollectedAmount = vm.receivables.uncollectedAmount||0;
//     var view_skAmount = $('#marginMoney');
//     if(vm.middleAmount !=null){
//         if(val==null || val== ''){
//             var _skAmount = vm.middleAmount+vm.marginVal;
//             vm.receivables.skAmount = _skAmount;
//             view_skAmount.val(_skAmount);
//             view_skAmount.attr('oldValue', _skAmount);
//             vm.middleAmount=_skAmount;
//             return;
//         }
//     }
//     if(vm.middleAmount ==null){
//         var skAmount = vm.receivables.skAmount||0;
//         var dkAmount = val||0;
//         var _skAmount = uncollectedAmount-dkAmount;
//         if ((skAmount + dkAmount) > uncollectedAmount && _skAmount < skAmount){
//             vm.receivables.skAmount = _skAmount;
//             vm.middleAmount=_skAmount;
//             vm.marginVal=Number(dkAmount);
//             view_skAmount.val(_skAmount);
//             view_skAmount.attr('oldValue', _skAmount);
//         }
//     }else{
//         var skAmount = vm.receivables.skAmount||0;
//         var dkAmount = val||0;
//         var _skAmount = vm.middleAmount-dkAmount;
//         if ((skAmount + dkAmount) > vm.middleAmount && _skAmount < skAmount){
//             var view_skAmount = $('#marginMoney');
//             vm.receivables.skAmount = _skAmount;
//             vm.middleAmount=_skAmount;
//             vm.marginVal=Number(dkAmount);
//             view_skAmount.val(_skAmount);
//             view_skAmount.attr('oldValue', _skAmount);
//         }
//     }
//
// }