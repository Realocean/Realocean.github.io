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
        lessorAuth: {},
        fileLst:[],
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.lessorAuth = param.data;
        if (_this.lessorAuth.sealType == 0){
            fileLst.push(_this.lessorAuth.localSeal);
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if (isBlank(vm.lessorAuth.localSeal) && vm.lessorAuth.sealType == 0) {
                alert('印章内容不能为空');
                return;
            }
            var url = vm.lessorAuth.id == null ? "sys/lessorauth/save" : "sys/lessorauth/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.lessorAuth),
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
                    vm.lessorAuth.localSeal = arg1;
                    break;
                }
                case 'delect':{
                    vm.lessorAuth.localSeal = '';
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
        deptNameVerify: function (value) {
            if (isBlank(value)) {
                return "企业名称不能为空";
            }
        },
        unifiedSocialCreditCodeVerify: function (value) {
            if (isBlank(value)) {
                return "统一社会信用代码不能为空";
            }
        },
        legalPersonVerify: function (value) {
            if (isBlank(value)) {
                return "法人不能为空";
            }
        },
        contactsVerify: function (value) {
            if (isBlank(value)) {
                return "管理员不能为空";
            }
        },
        phoneNumberVerify: function (value) {
            if (isBlank(value)) {
                return "联系电话不能为空";
            } else{
                var myreg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
                if (!myreg.test(value)) {
                    return '请输入正确的联系电话';
                }
            }
        },
        bankNameVerify: function (value) {
            if (isBlank(value)) {
                return "开户银行不能为空";
            }
        },
        branchBankNameVerify: function (value) {
            if (isBlank(value)) {
                return "开户支行不能为空";
            }
        },
        bankAccountVerify: function (value) {
            if (isBlank(value)) {
                return "开户账号不能为空";
            }
        },
        idNumberVerify: function (value) {
            if (isBlank(value)) {
                return "证件号码不能为空";
            }
        },
        addressVerify: function (value) {
            if (isBlank(value)) {
                return "联系地址不能为空";
            }
        },
        localSealVerify: function (value) {
            if (isBlank(value) && vm.lessorAuth.sealType == 1) {
                return "印章内容不能为空";
            }
        },
        mailbox: function (value) {
            if (isBlank(value)) {
                return "邮箱不能为空";
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
        vm.lessorAuth.contactsType = data.value;
    });
    //监听印章类型
    form.on('radio(sealType)', function (data) {
        if (vm.lessorAuth.sealType == data.value) return;
        vm.lessorAuth.sealType = data.value;
        vm.lessorAuth.localSeal = '';
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
