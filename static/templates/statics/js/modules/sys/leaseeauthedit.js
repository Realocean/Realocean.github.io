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
var localSealF = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        leaseeAuth: {},
        fileLst:[],
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.leaseeAuth = param.data;
        if (_this.leaseeAuth.sealType == 0){
            fileLst.push(_this.leaseeAuth.localSeal);
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if (isBlank(vm.leaseeAuth.localSeal) && vm.leaseeAuth.sealType == 0) {
                alert('印章内容不能为空');
                return;
            }
            var url = vm.leaseeAuth.id == null ? "sys/leaseeauth/save" : "sys/leaseeauth/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.leaseeAuth),
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
    localSealF = Upload({
        elid: 'localSealF',
        edit: true,
        fileLst: vm.fileLst,
        param: {'path':'seal-local'},
        fidedesc: '签章附件',
        maxLength: 1,
        callBack: function (action,arg1) {
            switch (action) {
                case 'success':{
                    vm.leaseeAuth.localSeal = arg1;
                    break;
                }
                case 'delect':{
                    vm.leaseeAuth.localSeal = '';
                    break;
                }
            }
        }
    });
    localSealF.initView();
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
        validate_nickname: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return transformTypeByMap(vm.leaseeAuth.memberType, {
                        2: '企业',
                        1: '客户'
                    })+"名称不能为空";
                }
            }
        },
        validate_phone: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "联系电话不能为空";
                }
            }
        },
        validate_contacts: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.leaseeAuth.memberType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "管理员姓名不能为空";
                }
            }
        },
        validate_idNumber: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "证件号码不能为空";
                }
            }
        },
        validate_branchBankName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.leaseeAuth.memberType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "开户支行名称不能为空";
                }
            }
        },
        validate_bankName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.leaseeAuth.memberType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "银行卡发卡行名称不能为空";
                }
            }
        },
        validate_bankCardNumber: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.leaseeAuth.memberType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "开户行卡号不能为空";
                }
            }
        },
        validate_email: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "邮箱不能为空";
                }
            }
        },
        validate_addrDetail: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "详细地址不能为空";
                }
            }
        },
        validate_corp: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.leaseeAuth.memberType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "法人不能为空";
                }
            }
        },
        localSealVerify: function (value) {
            if (isBlank(value) && vm.leaseeAuth.sealType == 1) {
                return "印章内容不能为空";
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
    //监听联系人类型
    form.on('radio(contactsType)', function (data) {
        vm.leaseeAuth.contactsType = data.value;
    });
    //监听印章类型
    form.on('radio(sealType)', function (data) {
        if (vm.leaseeAuth.sealType == data.value) return;
        vm.leaseeAuth.sealType = data.value;
        vm.leaseeAuth.localSeal = '';
        localSealF.clearFile();
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

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}
