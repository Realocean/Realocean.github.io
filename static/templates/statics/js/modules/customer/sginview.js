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

var count = 0;
var sginObj = {
    sginOrderNo: null,
    data: null
}
var timer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        form: {
            bankCardType:0
        },
        customer: {},
        bankSupportList:[],
        bankSupportListFilter:[],
        daikouCardId:'daikouCardId_0',
        sendMsgBtnTxt:'获取验证码',
        verify: false
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async = false;
        var param = parent.layer.boxParams.boxParams;
        _this.customer = param.data;
        _this.form.idCardNo = _this.customer.idCardNo;
        _this.form.customerName = _this.customer.customerName;
        _this.form.customerId = _this.customer.id;

        $.get(baseURL + "sys/banksupport/getAllSupportList", function (r) {
            for(var i=0;i<r.datas.length;i++){
                _this.bankSupportList.push(r.datas[i]);
            }
        });
        if (_this.form.bankDeposit == null) _this.form.bankDeposit = '';
        $("#bankCardFront").attr("src", "${request.contextPath}/statics/images/plus.png");
        $("#bankCardBack").attr("src", "${request.contextPath}/statics/images/plus.png");
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if (vm.form.bankCardFront == null || vm.form.bankCardFront === '') {
                alert('请上传银行卡正面');
                return false;
            }
            if (vm.form.bankCardBack == null || vm.form.bankCardBack === '') {
                alert('请上传银行卡背面');
                return false;
            }
            if (vm.form.bankDeposit == null || vm.form.bankDeposit === '') {
                alert('请选择开户行');
                return false;
            }
            if (vm.form.bankCardNo == null || vm.form.bankCardNo === '') {
                alert('请输入银行卡号');
                return false;
            }
            if (vm.form.mobileNo == null || vm.form.mobileNo === '') {
                alert('请输入手机号');
                return false;
            }
            if (vm.form.verificationCode == null || vm.form.verificationCode === '') {
                alert('请输入手机验证码');
                return false;
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
            var param = JSON.parse(JSON.stringify(vm.form));
            var tmpObj = {
                orderNo:sginObj.sginOrderNo,
                customerName:vm.form.customerName,
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
                param.orderNo = sginObj.sginOrderNo;
                PageLoading();
                $.ajax({
                    type: "POST",
                    url: baseURL + 'customer/sginBankCard',
                    contentType: "application/json",
                    data: JSON.stringify(param),
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
                    success: function (resp) {
                        if (resp.code == 0) {
                            if (resp.data.bankCardType == 1){
                                resp.data.validDate = null;
                                resp.data.cvv = null;
                                resp.data.bankCardType = 0;
                                Vue.set(vm.form, 'bankCardType', 0);
                            }else if (resp.data.bankCardType == 0){
                            }else {
                                resp.data.bankCardType = 1;
                                Vue.set(vm.form, 'bankCardType', 1);
                            }
                            vm.form = Object.assign({}, vm.form, {
                                bankCardNo: resp.data.bankCardNumber,
                                expireDate: resp.data.validDate,
                                cvv: resp.data.cvv,
                            });
                            // console.log(resp)
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
}

function initData() {
    initializeBankSupportList();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_nameTpl: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入模版名称";
                }
            }
        },
        validate_rentType: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择模版租赁类型";
                }
            }
        }
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('select(rentType)', function (data) {
        vm.contractemplate.rentType = data.value;
    });

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

    form.on('radio(bankCardType)', function (data) {
        vm.form.bankCardType = data.value;
        if ((vm.form.bankCardType^0) === 1){
            vm.form.expireDate = null;
            vm.form.cvv = null;
        }
        initializeBankSupportList();
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
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
                alert('该客户无身份证号');
                return;
            }
            if (vm.form.customerName == null || vm.form.customerName === '') {
                alert('该客户无客户姓名');
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

function initializeBankSupportList() {
    vm.bankSupportListFilter.splice(0);
    for(var i=0;i<vm.bankSupportList.length;i++){
        var item = vm.bankSupportList[i];
        if ((item.cardType&(Math.abs(~vm.form.bankCardType))) != 0){
            vm.bankSupportListFilter.push(item);
        }
    }
    if (vm.form.bankDeposit != null && vm.form.bankDeposit != ''){
        if (vm.bankSupportListFilter.filter(function (item) {
            return item.bankName === vm.form.bankDeposit;
        }).length > 0){

        }else {
            vm.form.bankDeposit = '';
            vm.form.bankDepositDesc = '';
        }
    }
    vm.daikouCardId = 'daikouCardId_'+ uuid(32);
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.bankcardReload();
    parent.layer.close(index);
}
