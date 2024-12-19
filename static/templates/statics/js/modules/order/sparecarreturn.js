$(function () {
    layui.use(['layer','form','laydate','upload'], function () {

        layui.form.on('submit(save)', function () {
            vm.save();
            return false;
        });
        layui.laydate.render({
            elem: '#returnTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarReturn.returnTime = value;
            }
        });

        layui.upload.render({
            elem: '#addFile',
            url: baseURL + 'file/uploadFile',
            data: {'path':'car_images'},
            field:'files',
            auto:true,
            size: 50*1024*1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar,mp4',
            exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar|mp4',
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
                        nameDesc:'备用车退车附件',
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

    calculate2();
    layui.form.render();
});
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{
        applyForDTO: {},
        spareCarReturn:{
            // illegalScore:0,
            // illegalFee:0,
            // outInsurance:0,
            // outFee:0,
            // actualFee:0,
            // discountFee:0,
            // otherFee:0,
            // defaultFee:0
        },
        feeValue:null,
        fileLst: [],
        fileLstId: '0',
        backAmount:[],
        illLegalAmount:[],
        insuranceAmount:[],
        decutionAmount:[],
        bankInfo:[],
        notice:[]
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        console.log("vm.spareCarReturn.rentType  === ",param.rentType)
        _this.getConfig(param.rentType);
    },
    updated: function(){
        layui.form.render();
    },
    // watch: {
    //     spareCarReturn:{
    //         handler(val,oldVal){
    //             var feeVal = (parseFloat(validateNaN(val.illegalFee)) + parseFloat(validateNaN(val.rentPay)) + parseFloat(validateNaN(val.outFee)) + parseFloat(validateNaN(val.actualFee)) - parseFloat(validateNaN(val.discountFee))-parseFloat(validateNaN(val.margin)) + parseFloat(validateNaN(val.otherFee)) + parseFloat(validateNaN(val.defaultFee))).toFixed(2);
    //             if(feeVal>0){
    //                 val.feeType = 0;
    //             }else{
    //                 val.feeType = 1;
    //             }
    //             val.feeValue = Math.abs(feeVal);
    //         },
    //         deep:true
    //     }
    // },
    methods: {
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
        inputReturnMile:function(){
            this.spareCarReturn.returnMile = checkNum(this.spareCarReturn.returnMile);
        },
        inputRentPay:function(){
            this.spareCarReturn.rentPay = checkNum(this.spareCarReturn.rentPay);
        },
        // inputIllegalScore:function(){
        //     this.spareCarReturn.illegalScore = checkNum(this.spareCarReturn.illegalScore);
        // },
        // inputIllegalFee:function(){
        //     this.spareCarReturn.illegalFee = checkNum(this.spareCarReturn.illegalFee);
        // },
        // inputOutInsurance:function(){
        //     this.spareCarReturn.outInsurance = checkNum(this.spareCarReturn.outInsurance);
        // },
        // inputOutFee:function(){
        //     this.spareCarReturn.outFee = checkNum(this.spareCarReturn.outFee);
        // },
        // inputActualFee:function(){
        //     this.spareCarReturn.actualFee = checkNum(this.spareCarReturn.actualFee);
        // },
        // inputDiscountFee:function(){
        //     this.spareCarReturn.discountFee = checkNum(this.spareCarReturn.discountFee);
        // },
        // inputOtherFee:function(){
        //     this.spareCarReturn.otherFee = checkNum(this.spareCarReturn.otherFee);
        // },
        // inputDefaultFee:function(){
        //     this.spareCarReturn.defaultFee = checkNum(this.spareCarReturn.defaultFee);
        // },
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
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        change:function (field){
            calculate2()
        },

        check:function (field,item){
            let fr=  checkNum(field);
            Vue.set(vm.spareCarReturn, item, fr);
        },

        marginChange: function () {
            calculate2();
        },
        rentPayChange: function () {
            calculate2();
        },
        getConfig:function(getConfig){
            $.get(baseURL + "serviceConfig/getServiceConfig?suitType=3&suitRentType=", function (r) {
                vm.backAmount=r.backAmount;
                vm.illLegalAmount=r.illLegalAmount;
                vm.insuranceAmount=r.insuranceAmount;
                vm.decutionAmount=r.decutionAmount;
                vm.bankInfo=r.bankInfo;
                vm.notice=r.notice;
                console.log("dyyyyy:",vm.backAmount)
            });
        },
        save: function(){
            vm.spareCarReturn.fileLst = vm.fileLst;
            vm.spareCarReturn.isFlow = 0;
            var url =  "cartransfer/sparecarreturn/save2";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.spareCarReturn),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
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
        }
    }
});
function validateNaN(num){
    if(isNaN(num) || num == null || num == '' || num == 'null' || num == undefined){
        return 0;
    }else return num;
}

function calculate2() {
    $.ajax({
        type: "POST",
        url: baseURL + "cartransfer/sparecarreturn/calculateConfig",
        contentType: "application/json",
        data: JSON.stringify(vm.spareCarReturn),
        success: function (r) {
            if (r.code === 0) {
                vm.feeValue=r.data.feeValue;
                vm.spareCarReturn.feeValue = r.data.feeValue;
                vm.spareCarReturn.feeType = r.data.feeType;
                if(0 == r.data.feeValue){
                    vm.spareCarReturn.feeType = 1;
                }
            } else {
                alert(r.msg);
            }
        }
    });


}