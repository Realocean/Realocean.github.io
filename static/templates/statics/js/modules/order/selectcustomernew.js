$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});
var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {
        form:{
            customerType:null,
            idCardImg:null,
            bankCardImg:null,
            licenseImg:null,
            driverImg:null,
            customerName:null,
            address:null,
            idCardNo:null,
            driverNo:null,
            driverValidity:null,
            nowAddress:null,
            contactMobile:null,
            email:null,
            emergencyPerson:null,
            emergencyMobile:null,
            contactPerson:null,
            license:null,
            note:null,
            businessPersonId:null,
            channelId:null,
            accessory:[]
        },
        fileName:null,
        createTime:null,
        accessoryList:[],
        updateDoc:false,
        customerTypeShow:null,
        idCardName:null,
        editForm:false,
        tMemberBasic:{}
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        // _this.orderCarAlteration = param.data;
        /**
         * 获取业务负责人下拉框数据
         */
        $.ajax({
            type: "GET",
            url: baseURL + 'customer/getBusinessPersonList',
            contentType: "application/json",
            async: false,
            success: function(data){
                $.each(data.data, function (index, item) {
                    // 下拉菜单里添加元素
                    $('#businessPerson').append(new Option(item.contactName, item.userId));
                });
                // form.render("select");

            },
            error:function(e){
                console.log(e);
            }
        });
        _this.form.businessPersonId = sessionStorage.getItem("userId");
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function () {
            vm.form.customerType = $("input[name='radioCustomerType']:checked").val();
            if (vm.form.customerName == null || vm.form.customerName == "") {
                layer.msg('客户姓名不能为空!', {icon: 7});
                return false;
            }
            // if (vm.form.customerType == '1'){
            //     if (vm.form.idCardImg == null || vm.form.idCardImg == ''){
            //         alert('请上传法人身份证');
            //         return;
            //     }
            //     if (vm.form.bankCardImg == null || vm.form.bankCardImg == ''){
            //         alert('请上传银行卡');
            //         return;
            //     }
            //     if (vm.form.licenseImg == null || vm.form.licenseImg == ''){
            //         alert('请上传营业执照');
            //         return;
            //     }
            //     if (vm.form.customerName == null || vm.form.customerName == ''){
            //         alert('请输入客户姓名');
            //         return;
            //     }
            //     if (vm.form.contactPerson == null || vm.form.contactPerson == ''){
            //         alert('请输入联系人');
            //         return;
            //     }
            //     if (vm.form.contactMobile == null || vm.form.contactMobile == ''){
            //         alert('请输入联系电话');
            //         return;
            //     }
            //     if (vm.form.license == null || vm.form.license == ''){
            //         alert('请输入营业执照');
            //         return;
            //     }
            //     if (vm.form.address == null || vm.form.address == ''){
            //         alert('请输入公司地址');
            //         return;
            //     }
            //     if (vm.form.email == null || vm.form.email == ''){
            //         alert('请输入邮箱');
            //         return;
            //     }
            // } else if (vm.form.customerType == '2') {
            //     if (vm.form.idCardImg == null || vm.form.idCardImg == ''){
            //         alert('请上传个人身份证');
            //         return;
            //     }
            //     if (vm.form.bankCardImg == null || vm.form.bankCardImg == ''){
            //         alert('请上传个人银行卡');
            //         return;
            //     }
            //     if (vm.form.driverImg == null || vm.form.driverImg == ''){
            //         alert('请上传驾驶证');
            //         return;
            //     }
            //     if (vm.form.customerName == null || vm.form.customerName == ''){
            //         alert('驾驶证解析出错，请重新上传');
            //         return;
            //     }
            //     if (vm.form.address == null || vm.form.address == ''){
            //         alert('请输入现住地址');
            //         return;
            //     }
            //     // if (vm.form.nowAddress == null || vm.form.nowAddress == ''){
            //     //     alert('请输入现住地址');
            //     //     return;
            //     // }
            //     if (vm.form.contactMobile == null || vm.form.contactMobile == ''){
            //         alert('请输入联系电话');
            //         return;
            //     }
            //     if (vm.form.email == null || vm.form.email == ''){
            //         alert('请输入邮箱');
            //         return;
            //     }
            //     if (vm.form.emergencyPerson == null || vm.form.emergencyPerson == ''){
            //         alert('请输入紧急联系人');
            //         return;
            //     }
            //     if (vm.form.emergencyMobile == null || vm.form.emergencyMobile == ''){
            //         alert('请输入紧急联系电话');
            //         return;
            //     }
            // } else {
            //     alert('请选择客户类型');
            //     return;
            // }
            // if (vm.form.businessPersonId == null || vm.form.businessPersonId == ''){
            //     alert('请选择业务负责人');
            //     return;
            // }
            // if (vm.form.channelId == null || vm.form.channelId == ''){
            //     alert('请选择所属渠道');
            //     return;
            // }
            // if (vm.form.accessory == null || vm.form.accessory.length < 1){
            //     alert('请添加附件');
            //     return;
            // }
            $.ajax({
                type: "POST",
                url: baseURL + 'customer/save',
                contentType: "application/json",
                data: JSON.stringify(vm.form),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            parent.vm.order = Object.assign({}, parent.vm.order, {
                                customerId: r.data.id,
                                customerName: r.data.customerName,
                                customerType: r.data.customerType,
                                customerAddr: r.data.address,
                                customerTel: r.data.contactMobile,
                                contactPerson: r.data.contactPerson,
                            });
                            closePage(r.data);
                        });
                    }else{
                        layer.msg(r.msg, {icon: 5});
                    }
                }
            });
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData(layui.form);
    initUpload(layui.upload);
}

function initUpload(upload) {
    /**
     * 上传附件
     */
    upload.render({
        elem: '#addDoc',
        url: baseURL + 'file/uploadFile',
        data: {'path': 'accessory_images'},
        field: 'files',
        size: 30*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg',
        before: function (obj) {
            // var userName = window.localStorage.getItem("currentUserName");
            obj.preview(function (index, file, result) {
                var date = new Date().format('yyyy-MM-dd hh:mm:ss');
                vm.fileName = file.name;
                vm.createTime = date;
            });
        },
        done: function (res) {
            var ext = vm.fileName.slice(vm.fileName.lastIndexOf('.'));
            var regExt = /png|jpg|jpeg/;
            var fileType = regExt.test(ext) ? 1:0;
            var id = 'id_' + uuid(16);
            var html = '<tr id="'+id+'" ><td>';
            if (fileType == 1){
                html += '<a class="layui-btn layui-btn-xs" onclick=showDoc("'+res.data[0]+'","'+vm.fileName+'")>查看</a>';
            }
            html += '<a class="layui-btn layui-btn-xs" onclick=downDoc("'+res.data[0]+'","'+vm.fileName+'")>下载</a>';
            html += '<a class="layui-btn layui-btn-xs" onclick=delDoc("'+id+'")>删除</a></td>';
            html += '<td>'+vm.fileName+'</td>';
            html += '<td>'+vm.createTime+'</td></tr>';
            $("#trDoc").append(html);
            var d = {"fileName": vm.fileName, "createTime": vm.createTime, "url": res.data[0], uid: id};
            vm.form.accessory.push(d);
        }
    });

    /**
     * 身份证
     */
    upload.render({
        elem: '#idCardImg',
        url: baseURL +'file/uploadFile',
        data: {'path':'idCard_images'},
        field:'files',
        accept:'images',
        before: function(obj){//文件上传前的回调
            obj.preview(function(index, file, result){
                $('#idCardImg').attr('src', result);
            });
        },
        done: function(res){
            if(res.code == '0'){
                vm.form.idCardImg = res.data[0];
                //客户是个人类型的时候上传身份证进行识别
                if(vm.form.customerType == 2){
                    //识别身份证
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/idCard',
                        contentType: "application/json",
                        data: {'path':res.data[0]},
                        success: function(res){
                            vm.form.customerName = res.data.name;
                            vm.form.address = res.data.address;
                            vm.form.idCardNo = res.data.idCard;
                        },
                        error:function(e){
                            console.log(e);
                        }
                    });
                }
            }else{
                layer.msg('上传失败', {icon: 5});
            }
        },error:function(){
            layer.msg('上传失败', {icon: 5});
        }
    });
    /**
     * 驾驶证
     */
    upload.render({
        elem: '#driverImg',
        url: baseURL +'file/uploadFile',
        data: {'path':'driver_images'},
        field:'files',
        accept:'images',
        before: function(obj){//文件上传前的回调
            obj.preview(function(index, file, result){
                $('#driverImg').attr('src', result);
            });
        },
        done: function(res){
            if(res.code == '0'){
                vm.form.driverImg = res.data[0];
                if(vm.form.customerType == 2){
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/driverCard',
                        contentType: "application/json",
                        data: {'path':res.data[0]},
                        success: function(res){
                            vm.form.driverNo = res.data.driverNo;
                            vm.form.driverValidity = res.data.startTime+"-"+res.data.endTime;
                        },
                        error:function(e){
                            console.log(e);
                        }
                    });
                }
            }else{
                layer.msg('上传失败', {icon: 5});
            }
        },error:function(){
            layer.msg('上传失败', {icon: 5});
        }
    });

    /**
     * 营业执照
     */
    upload.render({
        elem: '#licenseImg',
        url: baseURL +'file/uploadFile',
        data: {'path':'license_images'},
        field:'files',
        accept:'images',
        before: function(obj){
            obj.preview(function(index, file, result){
                $('#licenseImg').attr('src', result);
            });
        },
        done: function(res){
            if(res.code == '0'){
                vm.form.licenseImg=res.data[0];
            }else{
                layer.msg('上传失败', {icon: 5});
            }
        },error:function(){
            layer.msg('上传失败', {icon: 5});
        }
    });

    /**
     * 银行卡图片
     */
    upload.render({
        elem: '#bankCardImg',
        url: baseURL +'file/uploadFile',
        data: {'path':'bankCard_images'},
        field:'files',
        accept:'images',
        before: function(obj){
            obj.preview(function(index, file, result){
                $('#bankCardImg').attr('src', result);
            });
        },
        done: function(res){
            if(res.code == '0'){
                vm.form.bankCardImg=res.data[0];
            }else{
                layer.msg('上传失败', {icon: 5});
            }
        },error:function(){
            layer.msg('上传失败', {icon: 5});
        }
    });
}

function initData(form) {
    tabMemberType('2');
    vm.form.customerType = 2;
    $("#idCardImg").attr("src","${request.contextPath}/statics/images/plus.png");
    $("#bankCardImg").attr("src","${request.contextPath}/statics/images/plus.png");
    $("#driverImg").attr("src","${request.contextPath}/statics/images/plus.png");
    $("#licenseImg").attr("src","${request.contextPath}/statics/images/plus.png");




    /**
     * 获取渠道商下拉框数据
     */
    $.ajax({
        type: "GET",
        url: baseURL + 'customer/getChannel',
        contentType: "application/json",
        success: function(data){
            $.each(data.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#channel').append(new Option(item.channelName, item.id));
            });
            form.render("select");

        },
        error:function(e){
            console.log(e);
        }
    });
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {

}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });

    /**
     * 监听企业客户和普通客户切换
     */
    form.on('radio(radioCustomerType)', function(data){
        vm.form.customerType = data.value;
        tabMemberType(data.value);
    });

    /**
     * 监听业务负责人下拉列表
     */
    form.on('select(businessPerson)', function(data){
        vm.form.businessPersonId =data.value;
    });

    /**
     * 监听渠道下拉列表
     */
    form.on('select(channel)', function(data){
        vm.form.channelId =data.value;
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
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

}

function closePage(data) {
    // parent.vm.reloadSelect(data);
    parent.vm.reload();
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

/**
 * 企业/个人表单内容
 * @param customerType 客户类型;1企业2个人
 */
function tabMemberType(customerType){
    if(customerType == '1'){
        //隐藏所有个人信息
        $("#personalDiv").hide();
        //显示所有企业信息
        $("#enterpriseDiv").show();
        vm.idCardName = '法人身份证';
        $("#licenseDiv").show();
        $("#driverDiv").hide();
    }else{
        //显示所有个人信息
        $("#personalDiv").show();
        //隐藏所有企业信息
        $("#enterpriseDiv").hide();
        vm.idCardName = '身份证';
        $("#licenseDiv").hide();
        $("#driverDiv").show();
    }
    //清空表单数据
    cleanFormData();
    //清空附件
    document.getElementById("trDoc").innerHTML = '';
}

/**
 * 编辑时候调用
 * @param customerType
 */
function tabMemberTypeEdit(customerType){
    $("#radioDiv").hide();
    $("#updateCustomerType").show();
    if(customerType == 1){
        vm.updateCustomerType = "企业";
        //隐藏所有个人信息
        $("#personalDiv").hide();
        //显示所有企业信息
        $("#enterpriseDiv").show();
        vm.idCardName = '法人身份证';
        $("#licenseDiv").show();
        $("#driverDiv").hide();
    }else{
        vm.updateCustomerType = "个人";
        //显示所有个人信息
        $("#personalDiv").show();
        //隐藏所有企业信息
        $("#enterpriseDiv").hide();
        vm.idCardName = '身份证';
        $("#licenseDiv").hide();
        $("#driverDiv").show();
    }

}

/**
 * 清空表单数据
 */
function cleanFormData(){
    $("#idCardImg").attr('src',"");
    $("#bankCardImg").attr('src',"");
    $("#licenseImg").attr('src',"");
    $("#driverImg").attr('src',"");
    vm.form.customerName = null;
    vm.form.address = null;
    vm.form.idCardNo = null;
    vm.form.driverNo = null;
    vm.form.driverValidity = null;
    vm.form.nowAddress = null;
    vm.form.contactMobile = null;
    vm.form.email = null;
    vm.form.emergencyPerson = null;
    vm.form.emergencyMobile = null;
    vm.form.contactPerson = null;
    vm.form.license = null;
    vm.form.note = null;
    document.getElementById("businessPerson").value = '';
    document.getElementById("channel").value = '';
    layui.form.render();
}

function showDoc (url, fileName) {
    console.log("查看附件");
    if (viewer != null) {
        viewer.close();
        viewer = null;
    }
    viewer = new PhotoViewer([
        {
            src: fileURL + url,
            title: fileName
        }
    ], {
        appendTo: 'body',
        zIndex: 99891018
    });
}
function downDoc (url, fileName) {
    console.log("下载");
    var uri = baseURL + 'file/download?uri=' + url + "&fileName=" + fileName;
    window.location.href = uri;
}

function delDoc(uid) {
    for(var i = 0 ;i<vm.form.accessory.length;i++) {
        if(vm.form.accessory[i].uid === uid) {
            vm.form.accessory.splice(i,1);
            i= i-1;
        }
    }
    $("tr").remove('#'+uid+'');
}
