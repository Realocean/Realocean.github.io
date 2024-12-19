var callback;

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
        skType: 1,
        skAmount: null,
        billMeltsRentmonth:{},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.billMeltsRentmonth = param.data;
        callback = param.callback;
        $.ajaxSettings.async= false;
        $('.input-readonly').attr('disabled', 'disabled');
        $('#skAmount').attr('oninput', "editSimple(this, 'num', '"+_this.billMeltsRentmonth.uncollectedAmount+"')");
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            confirm('确定要提交收款吗？', function () {
                var param = JSON.parse(JSON.stringify(vm.billMeltsRentmonth));
                var receivedAmount = new Number(param.receivedAmount) > 0 ? param.receivedAmount:0;
                var uncollectedAmount = new Number(param.uncollectedAmount) > 0 ? param.uncollectedAmount:0;
                receivedAmount = add(receivedAmount, vm.skAmount);
                uncollectedAmount = sub(uncollectedAmount, vm.skAmount);
                if (uncollectedAmount <= 0){
                    uncollectedAmount = 0;
                    param.status = 2;
                }
                param.receivedAmount = receivedAmount;
                param.uncollectedAmount = uncollectedAmount;
                param.skAmount = vm.skAmount;
                $.ajax({
                    type: "POST",
                    url: baseURL + 'billmeltsrent/billmeltsrentmonth/update',
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                callback();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
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
        validate_skAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入收款金额";
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

function sub(arg1, arg2) {
    return toMoney(new Number(arg1||0) - new Number(arg2||0));
}

function add(arg1, arg2) {
    return toMoney(new Number(arg1||0) + new Number(arg2||0));
}