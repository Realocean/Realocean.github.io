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
var vm = new Vue({
    el:'#rrapp',
    data:{
        accountObj: {},
        purchasesupplierList:[],
        addrDict:[],
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.accountObj = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "purchase/purchasesupplier/selectSupList?enalbe=1", function (r) {
            _this.purchasesupplierList = r.data;
        });
        $.get(baseURL + "car/carsurvieladdr/select", function (r) {
            _this.addrDict = r.data;
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.accountObj.id == null ? "car/workOrderAccount/save" : "car/workOrderAccount/update";
            var param = JSON.parse(JSON.stringify(vm.accountObj));
            param.workOrderAccountDeptList = [
                {
                    deptId: vm.accountObj.purchaseSupplierId,
                    deptName: vm.accountObj.supplierName
                }
            ]
            var res;
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(param),
                success: function(r){
                    RemoveLoading();
                    res = r;
                }
            });
            if(res.code === 0){
                alert('操作成功', function(index){
                    closePage();
                });
            }else{
                alert(res.msg);
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
        validate_account: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "账号不能为空";
                }
            }
        },
        validate_password: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "密码不能为空";
                }
            }
        },
        validate_platform: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择所属平台";
                }
            }
        },
        validate_addrCode: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.accountObj.platform == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择地区";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('select(addrCode)', function (data) {
        vm.accountObj.addrCode = data.value;
        var obj = vm.addrDict.filter(function (item) {
            return item.addrCode == vm.accountObj.addrCode;
        });
        if (obj) {
            vm.accountObj.addrName = obj[0].addrName;
        }
    });

    form.on('select(purchaseSupplierId)', function (data) {
        vm.accountObj.purchaseSupplierId = data.value;
        var obj = vm.purchasesupplierList.filter(function (item) {
            return item.purchaseSupplierId == vm.accountObj.purchaseSupplierId;
        });
        if (obj) {
            vm.accountObj.supplierName = obj[0].supplierName;
        }
    });

    form.on('select(platform)', function (data) {
        vm.accountObj.platform = data.value;
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
    if (parent.vm.hasOwnProperty('query')){
        parent.vm.query();
    }
    parent.layer.close(index);
}
