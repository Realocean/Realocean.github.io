$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    /**
     * 表单监听
     */
    layui.use('form', function () {
        var form = layui.form;
        var upload = layui.upload;
        var table = layui.table;
        //获取业务负责人
        form.verify({
            idCardNo: function (value, item) {
                if(vm.isNecessary("idCardNo")){
                    if (value == null || value == '') {
                        return "身份证号不能为空";
                    }
                }

            },
            contactPerson: function (value, item) {
                if(vm.isNecessary("contactPerson")){
                    if (value == null || value == '') {
                        return "联系人不能为空";
                    }
                }

            },
            emergencyPerson: function (value, item) {
                if(vm.isNecessary("emergencyPerson")) {
                    if (value == null || value == '') {
                        return "紧急联系人不能为空";
                    }
                }
            },
            emergencyMobile: function (value, item) {
                if(vm.isNecessary("emergencyMobile")) {
                    if (value == null || value == '') {
                        return "紧急联系电话不能为空";
                    }
                }
            },
            contactMobile: function (value, item) {
                if (value == null || value == '') {
                    return "联系电话不能为空";
                }
            },
            customerName: function (value, item) {
                if (value == null || value == '') {
                    return "客户姓名不能为空";
                }
            }
        });
        layui.laydate.render({
            elem: '#birthday',
            trigger: 'click',
            done: function (value) {
                vm.form.birthday = value;
            }
        });
        layui.laydate.render({
            elem: '#joiningTime',
            trigger: 'click',
            done: function (value) {
                vm.form.joiningTime = value;
            }
        });
        form.on('select(sex)', function (data) {
            vm.form.sex = data.value;
        });
        //监听企业客户和普通客户切换
        form.on('radio(radioCustomerType)', function (data) {
            tabMemberType(vm, data.value);
            vm.form.customerType = data.value;
        });
        //监听是否签约司机
        form.on('radio(signedDriver)', function (data) {
            vm.form.signedDriver = data.value;
        });
        //监听业务负责人下拉列表
        form.on('select(businessPerson)', function (data) {
            vm.form.businessPersonId = data.value;
        });

        //监听渠道下拉列表
        form.on('select(channel)', function (data) {
            vm.form.channelId = data.value;
        });
        //监听渠道下拉列表
        form.on('select(bankDeposit)', function (data) {
            vm.form.bankDeposit = data.value;
            var obj = vm.bankSupportList.filter(function (v) {
                return v.bankName === data.value;
            });
            if (obj != null && obj.length > 0){
                vm.form.bankDepositDesc = obj[0].quotaExplain;
            }else {
                vm.form.bankDepositDesc = '';
            }
            vm.daikouCardId = 'daikouCardId_'+ uuid(32);
        });
        //监听客户来源下拉列表
        form.on('select(customerSource)', function (data) {
            vm.form.customerSource = data.value;
        });
        form.on('radio(bankCardType)', function (data) {
            vm.form.bankCardType = data.value;
            if ((vm.form.bankCardType^0) === 1){
                vm.form.expireDate = null;
                vm.form.cvv = null;
            }
            //
            $('#bankDeposit').empty();
            for(var i=0;i<vm.bankSupportList.length;i++){
                var item = vm.bankSupportList[i];
                if ((item.cardType&(Math.abs(~vm.form.bankCardType))) != 0){
                    $('#bankDeposit').append(new Option(item.bankName, item.bankName));
                }
            }
            layui.form.render("select");
            if (vm.form.bankDeposit != null && vm.form.bankDeposit != ''){
                if ((vm.bankSupportList.filter(function (item) {
                    return item.bankName === vm.form.bankDeposit;
                })[0].cardType&(Math.abs(~vm.form.bankCardType))) == 0){
                    vm.form.bankDeposit = '';
                    vm.form.bankDepositDesc = '';
                }
            }
            vm.daikouCardId = 'daikouCardId_'+ uuid(32);
        });

        //上传附件
        upload.render({
            elem: '#addDoc',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'accessory_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.mp4',
            exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|mp4',
            choose: function (obj) {
                // var userName = window.localStorage.getItem("currentUserName");
                obj.preview(function (index, file, result) {
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1:0;
                    var fileType = fileType;
                    var accessoryLength=0;
                    if(vm.accessoryList != null && vm.accessoryList != undefined && vm.accessoryList.length >0){
                        accessoryLength=vm.accessoryList.length;
                    }
                    var d = {"fileName": fileName, "createTime": new Date().format('yyyy-MM-dd hh:mm:ss'),"fileType":fileType};
                    Vue.set(vm.accessoryList, accessoryLength, d);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    var accessory=vm.accessoryList[vm.accessoryList.length-1];
                    accessory.url=res.data[0];
                    Vue.set(vm.accessoryList, vm.accessoryList.length-1, accessory);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delFile();
                }
                layui.table.reload('demo',{data:vm.accessoryList});
            } ,error: function(){
                //请求异常回调
                layer.msg('上传失败', {icon: 5});
                vm.delFile();
                layui.table.reload('demo',{data:vm.accessoryList});
            }

        })

        //上传身份证
        upload.render({
            elem: '#idCardImg',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'idCard_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            done: function (res) {
                if (res.code == '0') {
                    vm.form.idCardImg = res.data[0];
                    $("#idCardImg").attr("src", fileURL + vm.form.idCardImg);
                    //客户是个人类型的时候上传身份证进行识别
                    //识别身份证
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/idCardnew',
                        contentType: "application/json",
                        data: {'path': res.data[0], 'idCardSide':'front'},
                        success: function (res) {
                            if (res.code == 0) {
                                vm.form = Object.assign({}, vm.form, {
                                    customerName: res.data.name,
                                    idCardNo: res.data.idCard
                                });
                                if(vm.form.customerType == 2){
                                    vm.form = Object.assign({}, vm.form, {
                                        address: res.data.address
                                    });
                                }
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
        upload.render({
            elem: '#idCardImgBack',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'idCard_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            before: function (obj) {//文件上传前的回调
                obj.preview(function (index, file, result) {
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.form.idCardImgBack = res.data[0];
                    $("#idCardImgBack").attr("src", fileURL + vm.form.idCardImgBack);
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/idCardnew',
                        contentType: "application/json",
                        data: {'path': res.data[0], 'idCardSide':'back'},
                        success: function (res) {
                            if (res.code == 0) {
                                vm.form = Object.assign({}, vm.form, {
                                    idCardExpirydate: res.data.endDate
                                });
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
        //上传驾驶证
        upload.render({
            elem: '#driverImg',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'driver_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            done: function (res) {
                if (res.code == '0') {
                    vm.form.driverImg = res.data[0];
                    $("#driverImg").attr("src", fileURL + vm.form.driverImg);
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/driverCardnew',
                        contentType: "application/json",
                        data: {'path': res.data[0]},
                        success: function (res) {
                            if (res.code == 0) {
                                vm.form = Object.assign({}, vm.form, {
                                    quasiDrivingType: res.data.carType,
                                    driverNo: res.data.driverNo,
                                    driverValidity: res.data.startTime + "-" + res.data.endTime
                                });
                            } else {
                                layer.msg('驾驶证解析失败', {icon: 5});
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
        upload.render({
            elem: '#driverImgBack',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'driver_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            done: function (res) {
                if (res.code == '0') {
                    vm.form.driverImgBack = res.data[0];
                    $("#driverImgBack").attr("src", fileURL + vm.form.driverImgBack);
                } else {
                    layer.msg('上传失败', {icon: 5});
                }
            }, error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });

        //上传营业执照
        upload.render({
            elem: '#licenseImg',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'license_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#licenseImg').attr('src', result);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.form.licenseImg = res.data[0];
                } else {
                    layer.msg('上传失败', {icon: 5});
                }
            }, error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });

        //上传银行卡
        upload.render({
            elem: '#bankCardFront',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'bankCard_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#bankCardFront').attr('src', result);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.form.bankCardFront = res.data[0];
                    $.ajax({
                        type: "GET",
                        url: baseURL + 'customer/getBankCardInfo',
                        contentType: "application/json",
                        data: {'path': res.data[0]},
                        success: function (res) {
                            if (res.code == 0) {
                                if (res.data.bankCardType == 1){
                                    res.data.validDate = null;
                                    res.data.cvv = null;
                                    res.data.bankCardType = 0;
                                    Vue.set(vm.form, 'bankCardType', 0);
                                }else if (res.data.bankCardType == 0){
                                }else {
                                    res.data.bankCardType = 1;
                                    Vue.set(vm.form, 'bankCardType', 1);
                                }
                                vm.form = Object.assign({}, vm.form, {
                                    bankCardNo: res.data.bankCardNumber,
                                    expireDate: res.data.validDate,
                                    cvv: res.data.cvv,
                                });
                                // console.log(res)
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
                    $('#bankCardFront').attr('src', '');
                }
            }, error: function () {
                layer.msg('上传失败', {icon: 5});
                $('#bankCardFront').attr('src', '');
            }
        });
        //上传银行卡
        upload.render({
            elem: '#bankCardBack',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'bankCard_images'},
            field: 'files',
            accept: 'file', //普通文件
            acceptMime: '.jpg,.png,.jpeg,.webp',
            exts: 'jpg|png|jpeg|webp',
            before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#bankCardBack').attr('src', result);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.form.bankCardBack = res.data[0];
                } else {
                    layer.msg('上传失败', {icon: 5});
                    $('#bankCardBack').attr('src', '');
                }
            }, error: function () {
                layer.msg('上传失败', {icon: 5});
                $('#bankCardBack').attr('src', '');
            }
        });

        //上传附件的操作
        table.on('tool(test)', function (obj) {
            var layEvent = obj.event;
            var data = obj.data;
            if (layEvent === 'show') {
                vm.showDoc(data.url, data.fileName);
            } else if (layEvent === 'down') {
                vm.downDoc(data.url, data.fileName);
            }
        });

        form.render();


        //第一个实例
        table.render({
            id:'demo',
            elem: '#demo',
            page: true ,//开启分页
            cols: [[ //表头
                 {field: 'id', title: '操作', width:'30%', fixed: 'left',templet:'#docTableBarTpl'}
                ,{field: 'fileName', title: '文件名称', width:'40%'}
                ,{field: 'createTime', title: '上传时间', width:'30%'}
            ]],
            data:vm.accessoryList,
            limit:10,
            limits:[10,20,50,100]
        });

    });

    /**
     * 监听表单提交
     */
    layui.form.on('submit(submitEditData)', function () {
        vm.saveOrUpdate();
        return false;
    });

    $('#sendMsg').on('click', function () {
        if (count === 0){
            if (vm.form.bankCardFront == null || vm.form.bankCardFront === '') {
                alert('请上传银行卡正面');
                return;
            }
            if (vm.form.bankCardBack == null || vm.form.bankCardBack === '') {
                alert('请上传银行卡背面');
                return;
            }
            if (vm.form.bankDeposit == null || vm.form.bankDeposit === '') {
                alert('请选择开户行');
                return;
            }
            if (vm.form.bankCardNo == null || vm.form.bankCardNo === '') {
                alert('请输入银行卡号');
                return;
            }
            if (vm.form.mobileNo == null || vm.form.mobileNo === '') {
                alert('请输入手机号');
                return;
            }
            if (vm.form.idCardNo == null || vm.form.idCardNo === '') {
                alert('请输入身份证号');
                return;
            }
            if (vm.form.customerName == null || vm.form.customerName === '') {
                alert('请输入客户姓名');
                return;
            }
            if ((vm.form.bankCardType^0) === 1){
                if (vm.form.expireDate == null || vm.form.expireDate === '') {
                    alert('请输入信用卡有效期');
                    return;
                }
                if (vm.form.cvv == null || vm.form.cvv === '') {
                    alert('请输入信用卡安全码');
                    return;
                }
            }
            sginObj.sginOrderNo = uuid(32);
            var param = {
                orderNo:sginObj.sginOrderNo,
                customerName:vm.form.customerName,
                customerNo:vm.form.customerNo,
                idNo:vm.form.idCardNo,
                bankCardNo:vm.form.bankCardNo,
                mobileNo:vm.form.mobileNo,
                expireDate:vm.form.expireDate,
                cvv:vm.form.cvv,
            }
            sginObj.data = JSON.stringify(param);
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + "customer/sginSendMsg",
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('发送成功', function(index){
                        });
                        count = 61;
                        timer = setInterval(function () {
                            count--;
                            if (count<=0){
                                vm.sendMsgBtnTxt = '获取验证码';
                                clearInterval(timer);
                                vm.daikouCardId = 'daikouCardId_'+ uuid(32);
                            }else{
                                vm.sendMsgBtnTxt = count+'秒后重发';
                                vm.daikouCardId = 'daikouCardId_'+ uuid(32);
                            }

                        }, 1000);
                    } else {
                        alert(r.msg);
                    }
                }
            });
        }else {

        }
    });
});

var count = 0;
var sginObj = {
    sginOrderNo: null,
    data: null
}
var timer = null;
var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {
        hetong:false,
        form: {
            bankDeposit:'',
            bankCardType:'0',
            signedDriver:'0',
        },
        accessory: [],
        editForm: false,
        choiceorderType: false,
        fileName: null,
        createTime: null,
        fileType:null,
        accessoryList: [],
        customerTypeShow: null,
        idCardName: null,
        tMemberBasic: {},
        cropper: {},
        chairPersons:[],
        bankSupportList:[],
        daikouCardId:'daikouCardId_0',
        sendMsgBtnTxt:'获取验证码',
        necessary:'',
    },
    computed: {},
    created: function(){
        $.ajaxSettings.async = false;
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        getBanksupport(_this.bankSupportList, _this.form.bankCardType);
        getBusinessPersonal();
        //获取渠道商
        getChannel();
        // 获取客户来源
        initCustomerSource();
        if (param != null){
            var type = param.type;
            var data = param.data;
            if (type == 1){
                _this.editForm = true;
                tabMemberType(_this, 2);
                _this.insertAttachment = true;
                _this.updateAttachment = false;
                _this.form.customerType = 2;
                _this.form.bankCardType = 0;
                console.log("新增前情况数据:", _this.form);
                $("#idCardImg").attr("src", "${request.contextPath}/statics/images/plus.png");
                $("#idCardImgBack").attr("src", "${request.contextPath}/statics/images/plus.png");
                $("#driverImg").attr("src", "${request.contextPath}/statics/images/plus.png");
                $("#driverImgBack").attr("src", "${request.contextPath}/statics/images/plus.png");
                $("#licenseImg").attr("src", "${request.contextPath}/statics/images/plus.png");
                _this.accessoryList=[];
            } else if (type == 2){
                _this.editForm = true;
                _this.form = data;
                // $("#businessPerson").val(_this.form.businessPersonId);
               // $("#channel").val(_this.form.channelId);
                $("#idCardImg").attr("src", fileURL + _this.form.idCardImg);
                $("#idCardImgBack").attr("src", fileURL + _this.form.idCardImgBack);
                $("#driverImg").attr("src", fileURL + _this.form.driverImg);
                $("#driverImgBack").attr("src", fileURL + _this.form.driverImgBack);
                $("#licenseImg").attr("src", fileURL + _this.form.licenseImg);
                tabMemberTypeEdit(_this, _this.form.customerType);
                console.log("编辑回显数据：", _this.form);
                if(_this.form.accessoryList != null && _this.form.accessoryList != undefined && _this.form.accessoryList.length >0){
                    _this.form.accessoryList.forEach(function (value, index) {
                        var d = {"fileName": value.accessoryName, "createTime": value.createTime,"fileType":value.typeFile ,"url": value.url};
                        _this.accessoryList.push(d);
                    });
                }
                layui.table.reload('demo',{data:_this.accessoryList});
            }
        }
        if (_this.form.bankDeposit == null) _this.form.bankDeposit = '';
        if (_this.form.bankCardType == null) _this.form.bankCardType = 0;
        $("#bankCardFront").attr("src", "${request.contextPath}/statics/images/plus.png");
        $("#bankCardBack").attr("src", "${request.contextPath}/statics/images/plus.png");
        $.ajaxSettings.async = true;
        layui.form.render("radio");

        this.getNecessary();

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        getNecessary(){
            let that = this
            $.get(baseURL + 'sys/tConfig/list', {page:1,
                limit:10,
                paramKey:"CUSTOMER_FORM_REQUIRED_FIELE"
            }, function(r){
                if(r.data){
                    that.necessary = r.data[0]?.paramValue??'';
                    console.log('that.necessary', that.necessary)
                }
            })
        },
        isNecessary:function(field){
            return this.necessary.indexOf(field)>=0
        },
        retractChange:function(data){
            if(data == 1){
                this.hetong = false
            }
        },
        expandChange:function(data){
            console.log(1)
            if(data == 1){
                this.$nextTick(()=>{
                    this.hetong = true
                })

            }
        },
        delFile: function () {
            vm.accessoryList.splice(vm.accessoryList.length -1,1)
        },
        showDoc: function (url, fileName) {
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
        },
        downDoc: function (url, fileName) {
            var uri = baseURL + 'file/download?uri=' + url + "&fileName=" + fileName;
            window.location.href = uri;
        },
        cancel: function () {
            parent.vm.isClose = true;
            var index = parent.layer.getFrameIndex(window.name);
            parent.vm.reload();
            parent.layer.close(index);
        },
        saveOrUpdate: function () {
            vm.form.accessory = vm.accessoryList;
            // vm.form.customerType = $("input[name='radioCustomerType']:checked").val();
            console.log("保存数据:", vm.form);
            if (vm.form.customerName == null || vm.form.customerName == "") {
                layer.msg('客户姓名不能为空!', {icon: 7});
                return false;
            }
            var param = JSON.parse(JSON.stringify(vm.form));
            if (param.id == null && param.customerType == 2){
                if (
                    (param.bankCardFront == null || param.bankCardFront === '')
                    ||(param.bankCardBack == null || param.bankCardBack === '')
                    ||(param.bankDeposit == null || param.bankDeposit === '')
                    ||(param.bankCardNo == null || param.bankCardNo === '')
                    ||(param.mobileNo == null || param.mobileNo === '')
                    ||(param.idCardNo == null || param.idCardNo === '')
                    ||(param.customerName == null || param.customerName === '')
                    ||(param.customerNo == null || param.customerNo === '')
                    ||(param.verificationCode == null || param.verificationCode === '')
                    ||(sginObj.sginOrderNo == null || sginObj.sginOrderNo === '')
                    ||(
                        param.bankCardType == 1
                        && (
                            (param.expireDate == null || param.expireDate === '')
                            ||(param.cvv == null || param.cvv === '')
                        )
                    )
                ) {
                    if (
                        (param.bankCardFront == null || param.bankCardFront === '')
                        &&(param.bankCardBack == null || param.bankCardBack === '')
                        &&(param.bankDeposit == null || param.bankDeposit === '')
                        &&(param.bankCardNo == null || param.bankCardNo === '')
                        &&(param.mobileNo == null || param.mobileNo === '')
                        &&(param.verificationCode == null || param.verificationCode === '')
                        &&(param.expireDate == null || param.expireDate === '')
                        &&(param.cvv == null || param.cvv === '')
                    ){
                        vm.submitDataRequest(param);
                    }else {
                        layer.confirm('代扣信息未填写完整，本次操作不会保存代扣信息，是否确认保存用户信息？', function(index){
                            param.bankCardFront = null;
                            param.bankCardBack = null;
                            param.bankDeposit = null;
                            param.bankCardNo = null;
                            param.mobileNo = null;
                            param.verificationCode = null;
                            param.expireDate = null;
                            param.cvv = null;
                            vm.submitDataRequest(param);
                        });
                    }
                }else {
                    var tmpObj = {
                        orderNo:sginObj.sginOrderNo,
                        customerName:vm.form.customerName,
                        customerNo:vm.form.customerNo,
                        idNo:vm.form.idCardNo,
                        bankCardNo:vm.form.bankCardNo,
                        mobileNo:vm.form.mobileNo,
                        expireDate:vm.form.expireDate,
                        cvv:vm.form.cvv,
                    }
                    if (sginObj.data != JSON.stringify(tmpObj)){
                        layer.msg('签约信息不一致，请重新获取验证码!', {icon: 7});
                        return false;
                    }else {
                        param.sginOrderNo = sginObj.sginOrderNo;
                        vm.submitDataRequest(param);
                    }
                }
            }else {
                vm.submitDataRequest(param);
            }
        },
        submitDataRequest: function (data){
            var url = data.id == null ? "customer/save" : "customer/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function () {
                            vm.cancel();
                        });
                    } else {
                        layer.msg(r.msg, {icon: 5});
                    }
                }
            });
        }
    }
});

/**
 * 企业/个人表单内容
 * @param customerType 客户类型;1企业2个人
 */
function tabMemberType(obj, customerType) {
    if (customerType == 1) {
        //隐藏所有个人信息
        $("#personalDiv").hide();
        //显示所有企业信息
        $("#enterpriseDiv").show();
        obj.idCardName = '法人身份证'
        $("#licenseDiv").show();
        $("#driverDiv").hide();
    } else {
        //显示所有个人信息
        $("#personalDiv").show();
        //隐藏所有企业信息
        $("#enterpriseDiv").hide();
        obj.idCardName = '身份证'
        $("#licenseDiv").hide();
        $("#driverDiv").show();
    }
    //清空表单数据
    cleanFormData(obj);
    //清空附件
    $("#trDoc").html("");
}

/**
 * 编辑时候调用
 * @param customerType
 */
function tabMemberTypeEdit(obj, customerType) {
    $("#radioDiv").hide();
    $("#updateCustomerType").show();
    if (customerType == 1) {
        obj.updateCustomerType = "企业";
        //隐藏所有个人信息
        $("#personalDiv").hide();
        //显示所有企业信息
        $("#enterpriseDiv").show();
        obj.idCardName = '法人身份证'
        $("#licenseDiv").show();
        $("#driverDiv").hide();
        obj.set = '';
        obj.birthday = '';
    } else {
        obj.updateCustomerType = "个人";
        //显示所有个人信息
        $("#personalDiv").show();
        //隐藏所有企业信息
        $("#enterpriseDiv").hide();
        obj.idCardName = '身份证'
        $("#licenseDiv").hide();
        $("#driverDiv").show();
    }
    obj.joiningTime = '';
}

/**
 * 清空表单数据
 */
function cleanFormData(obj) {
    $("#radioDiv").show();
    $("#updateCustomerType").hide();
    $("#newCardImage").attr('src', "");
    $("#bankCardImg").attr('src', "");
    $("#bankCardFront").attr('src', "");
    $("#bankCardBack").attr('src', "");
    $("#licenseImg").attr('src', "");
    $("#driverImage").attr('src', "");
    $("#idCardImg").attr('src', "");
    $("#idCardImgBack").attr('src', "");
    $("#driverImg").attr('src', "");
    $("#driverImgBack").attr('src', "");
    document.getElementById("businessPerson").value = '';
    document.getElementById("channel").value = '';
    obj.form = {
        bankCardType:0,
        bankDeposit:''
    };
    layui.form.render();
}

function showDoc(url, fileName) {
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

function downDoc(url, fileName) {
    console.log("下载");
    var uri = baseURL + 'file/download?uri=' + url + "&fileName=" + fileName;
    window.location.href = uri;
}


/**
 * 获取业务负责人下拉框数据
 */
function getBusinessPersonal() {
    $.ajax({
        type: "GET",
        url: baseURL + 'customer/getBusinessPersonList',
        contentType: "application/json",
        success: function (data) {
            $.each(data.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#businessPerson').append(new Option(item.contactName, item.userId));
            });
            layui.form.render("select");
        },
        error: function (e) {
            console.log(e);
        }
    });
}


/**
 * 获取渠道商下拉框数据
 */
function getChannel() {
    $.ajax({
        type: "GET",
        url: baseURL + 'customer/getChannel',
        contentType: "application/json",
        success: function (data) {
            $.each(data.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#channel').append(new Option(item.channelName, item.id));
            });
            layui.form.render("select");
        },
        error: function (e) {
            console.log(e);
        }
    });
}

/**
 * 初始化客户来源下拉框
 */
function initCustomerSource(){
    $.getJSON(baseURL + "sys/dict/getInfoByType/customerSource", function (data) {
        console.log('初始化客户来源下拉框')
        $.each(data.dict, function (index, item) {
            // 下拉菜单里添加元素
            $('#customerSource').append(new Option(item.value, item.code));
        });
        layui.form.render("select");
    });
}
function getBanksupport(bankSupportList,bankCardType) {
    $.ajax({
        type: "GET",
        url: baseURL + 'sys/banksupport/getAllSupportList',
        contentType: "application/json",
        success: function (data) {
            $('#bankDeposit').empty();
            $.each(data.datas, function (index, item) {
                // 下拉菜单里添加元素
                if ((item.cardType&(Math.abs(~bankCardType))) != 0){
                    $('#bankDeposit').append(new Option(item.bankName, item.bankName));
                }
                bankSupportList.push(item);
            });
            layui.form.render("select");
        },
        error: function (e) {
            console.log(e);
        }
    });
}
