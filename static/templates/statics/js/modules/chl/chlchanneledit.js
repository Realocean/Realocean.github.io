$(function () {
    vm.detail(window.localStorage.getItem("id"));

    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        var upload = layui.upload;
        form.verify({
            channelNameVerify: function (value) {
                if (value == "" || value == null) {
                    return '渠道商名称不能为空';
                }
            },
            salesmanId:function(value){
                if (value == "" || value == null) {
                    return '请选择业务员';
                }
            },
            contacts:function(value){
                if (value == "" || value == null) {
                    return '请输入联系人';
                }
            },
            phone:function(value){
                if (value == "" || value == null) {
                    return '请输入联系电话';
                }
            },
            cardNo:function(value){
                if (value == "" || value == null) {
                    return '身份证号不能为空';
                }
            },
            bankCardNo:function(value){
                if (value == "" || value == null) {
                    return '银行卡号不能为空';
                }
            },
            cardName:function(value){
                if (value == "" || value == null) {
                    return '证件姓名不能为空';
                }
            }
            // taxpayerId:function(value){
            //     if (!/^[a-zA-Z0-9]{18}$/g.test(value)) {
            //         return '纳税人识别号格式有误';
            //     }
            // },
            // bankAccount:function (value) {
            //     if (!/^[^\u4E00-\u9FA5]{6,28}$/g.test(value)) {
            //         return '账号格式有误';
            //     }
            // }
        });

        //业务员
        form.on('select(salesmanId)', function (data) {
            vm.chlChannel.salesmanId = data.value;
        });
        layui.form.on('radio(consociationStatus)', function(data){
            vm.chlChannel.consociationStatus=data.value;
        });
        layui.form.on('radio(billType)', function(data){
            vm.chlChannel.billType=data.value;
        });
        layui.form.on('radio(chlType)', function(data){
            vm.chlChannel.chlType=data.value;
        });
        layui.upload.render({
            elem: '#addFile',
            url: baseURL + 'file/uploadInsuranceFile',
            data: {'path':'chlchannel'},
            field:'files',
            auto:true,
            size: 50*1024*1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg .zip,.rar',
            exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
            multiple: true,
            number:20,
            done: function (res) {
                RemoveLoading();
                if (res.code != '0') {
                    layer.msg('上传失败', {icon: 5});
                    vm.delFile(fileIdTmp);
                    fileIdTmp = null;
                    return false;
                }
                res.data.forEach(function (value) {
                    var extIndex = value.resultFilePath.lastIndexOf('.');
                    var ext = value.resultFilePath.slice(extIndex);
                    var fileNameNotext = value.fileName;
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc: '渠道商附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileNameNotext,
                        nameExt: ext,
                        typeFile: fileType,
                        url: value.resultFilePath
                    };
                    vm.fileLst.push(fileTmp);
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                });
                fileIdTmp = null;
            },
            error: function () {
                RemoveLoading();
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
            }
        });

        layui.upload.render({
            elem: '#idCardImg',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'idCard_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            done: function (res) {
                if (res.code == '0') {
                    vm.idCardImg= res.data[0];
                    $("#idCardImg").attr("src", imageURL + vm.chlChannel.idCardImg);
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/idCardnew',
                        contentType: "application/json",
                        data: {'path': res.data[0], 'idCardSide':'front'},
                        success: function (res) {
                            if (res.code == 0) {
                                alert("身份证识别成功");
                                Vue.set(vm.chlChannel, "idCardImg", vm.idCardImg);
                                Vue.set(vm.chlChannel, "channelName", res.data.name);
                                Vue.set(vm.chlChannel, "cardName", res.data.name);
                                Vue.set(vm.chlChannel, "cardNo", res.data.idCard);
                                Vue.set(vm.chlChannel, "addrDetail", res.data.address);
                            } else {
                                layer.msg('身份证解析失败', {icon: 5});
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                } else {
                    layer.msg('上传失败', {icon: 5});
                }
            }, error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });
        layui.upload.render({
            elem: '#bankCardImg',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'bankCard_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            done: function (res) {
                if (res.code == '0') {
                    vm.bankCardImg= res.data[0];
                    $("#bankCardImg").attr("src", imageURL + vm.bankCardImg);
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/getBankCardInfo?path='+res.data[0],
                        success: function (res) {
                            if (res.code == 0) {
                                alert("银行卡识别成功");
                                Vue.set(vm.chlChannel, "bankCardImg", vm.bankCardImg);
                                Vue.set(vm.chlChannel, "bankCardNo", res.data.bankCardNumber);
                            } else {
                                layer.msg('银行卡解析失败', {icon: 5});
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                } else {
                    layer.msg('上传失败', {icon: 5});
                }
            }, error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });
        form.render();
    });


    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

});
var upload;
var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        chlChannel: {},
        salesmanLst:[],
        yyzzFileList: [],
        frsfFileList: [],
        fjList:[],
        fileLstId: '0',
        fileLst:[],
        idCardImg:null,
        bankCardImg:null

    },
    created: function(){
        var _this = this;
        // 业务员
        $.ajax({
            type: "POST",
            url: baseURL + "/sys/user/usrLst",
            contentType: "application/json",
            async:false,
            data:null,
            success: function(r){
                _this.salesmanLst= r.usrLst;
            }
        });

    },
    computed:{

    },
    updated: function () {
        layui.form.render();
    },
    methods: {

        showImg: function () {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+vm.idCardImg,
                    title: '身份证照片预览'
                }
            ], {
                appendTo:'body',
                zIndex:99891018
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
        //保存修改方法
        saveOrUpdate: function (event) {
            var url = vm.chlChannel.id == null ? "chl/chlchannel/save" : "chl/chlchannel/update";
            vm.chlChannel.yyzzFileList = vm.yyzzFileList;
            vm.chlChannel.frsfFileList = vm.frsfFileList;
            vm.chlChannel.fjList = vm.fjList;
            vm.chlChannel.channelfjList=vm.fileLst;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.chlChannel),
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
        },
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "chl/chlchannel/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.chlChannel = r.chlChannel;
                        vm.yyzzFileList = vm.chlChannel.yyzzFileList;
                        vm.frsfFileList = vm.chlChannel.frsfFileList;
                        vm.fjList = vm.chlChannel.fjList;
                        vm.fileLst = r.chlChannel.channelfjList;
                        if(r.chlChannel.idCardImg!=null && r.chlChannel.idCardImg!=''){
                            vm.idCardImg = r.chlChannel.idCardImg;
                            $("#idCardImg").prop("src",imageURL+r.chlChannel.idCardImg);
                        }
                        if(r.chlChannel.bankCardImg!=null && r.chlChannel.bankCardImg!=''){
                            vm.bankCardImg = r.chlChannel.bankCardImg;
                            $("#bankCardImg").prop("src",imageURL+r.chlChannel.bankCardImg);
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

    }
})
