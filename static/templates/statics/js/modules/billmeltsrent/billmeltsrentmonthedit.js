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
        q:{
            keyword: null
        },
        billMeltsRentmonth: {},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.billMeltsRentmonth = JSON.parse(JSON.stringify(param.data));
        $.ajaxSettings.async= false;
        $('.input-readonly').attr('disabled', 'disabled');
        $('#receivedAmount').attr('oninput', "edit(this, 'num', 'receivedAmount', 'editCallback','"+_this.billMeltsRentmonth.receivableAmount+"')");
        $('#receivableAmount').attr('oninput', "edit(this, 'num', 'receivableAmount', 'editCallback', '9999999')");
        // view_receivableAmount.attr('oninput', "edit(this, 'num', 'receivableAmount', 'editCallback', '9999999', '"+_this.billMeltsRentmonth.receivedAmount+"')");

        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            vm.billMeltsRentmonth.status = (vm.billMeltsRentmonth.uncollectedAmount <= 0) + 1;
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + 'billmeltsrent/billmeltsrentmonth/update',
                contentType: "application/json",
                data: JSON.stringify(vm.billMeltsRentmonth),
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
        validate_receivableAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "应收金额不能为空";
                }
            }
        },
        validate_receivedAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "已收金额不能为空";
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

    form.on('radio(repaymentType)', function (data) {
        vm.billMeltsRentmonth.repaymentType = data.value;
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

function editCallback(event, val) {
    switch (event) {
        case 'receivableAmount':{
            var view_receivedAmount = $('#receivedAmount');
            if (val && val > 0){
                view_receivedAmount.removeAttr('maxlength');
                view_receivedAmount.attr('oninput', "edit(this, 'num', 'receivedAmount', 'editCallback','"+val+"')");
            }else {
                view_receivedAmount.attr('maxlength', 0);
            }
            if (val < vm.billMeltsRentmonth.receivedAmount){
                Vue.set(vm.billMeltsRentmonth, 'receivedAmount', val);
            }
            break;
        }
        case 'receivedAmount':{
            break;
        }
    }
    var uncollectedAmount = sub(vm.billMeltsRentmonth.receivableAmount, vm.billMeltsRentmonth.receivedAmount);
    Vue.set(vm.billMeltsRentmonth, 'uncollectedAmount', uncollectedAmount);
}

function sub(arg1, arg2) {
    return toMoney(new Number(arg1||0) - new Number(arg2||0));
}