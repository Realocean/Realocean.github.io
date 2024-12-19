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
        skDate: new Date().format("yyyy-MM-dd hh:mm:ss"),
        skRemark: null,
        skAmount: null,
        txtPrompt:'确定收款选中的应收单吗？',
        requestData:{},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.requestData = param.data;
        callback = param.callback;
        if (_this.requestData && _this.requestData.receivablesIds && _this.requestData.receivablesIds.length > 0){
            _this.txtPrompt = '确定收款选中的应收单吗？';
        }else {
            _this.txtPrompt = '确定收款全部筛选的应收单吗？';
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            confirm('确定要提交收款吗？', function () {
                var param = JSON.parse(JSON.stringify(vm.requestData));
                param['skAmount'] = vm.skAmount;
                param['skDate'] = vm.skDate;
                param['skRemark'] = vm.skRemark;
                $.ajax({
                    type: "POST",
                    url: baseURL + "financial/receivables/batchYJSkReceivables",
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                callback();
                            });
                        } else {
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
            if (vm.verify && vm.skType == 2) {
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

    form.on('radio(skType)', function (data) {
        vm.skType = data.value;
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
    laydate.render({
        elem: '#skDate',
        trigger: 'click',
        type: 'datetime',
        done: function (value) {
            vm.skDate = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}
