
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
    data: {
        tabConfig: {},
        verify: false,
        fileLstId: '0',
        fileLst:[],
        tabOrders:[],
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.tabConfig = param.data;
        if(_this.tabConfig.moduleName !='' && _this.tabConfig.moduleName !=null ){
            $.get(baseURL + "tabconfig/getTabOrder?moduleName="+_this.tabConfig.moduleName, function(r){
                _this.tabOrders = r.data;
            });
        }

    },

    mounted:function() {
        // $.ajaxSettings.async = false


    },


    updated: function () {
        layui.form.render();
    },
    methods: {

        saveOrUpdate: function (event) {
              var url = vm.tabConfig.id == null ? "/tabconfig/save" : "/tabconfig/update";
               PageLoading();
           $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tabConfig),
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
    Upload({
        elid: 'fileLstId',
        edit: true,
        fileLst: vm.fileLst,
        param: {'path':'chlchannel'},
        fidedesc: '司机预支工资附件'
    }).initView();
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
        moduleName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "模块名称不能为空";
                }
            }
        },
        tabOrder: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "页签位置不能为空";
                }
            }
        },
        tabValue: function (value, item) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "页签值不能为空";
                }

        }


    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('select(moduleName)', function (data) {
        vm.tabConfig.moduleName = data.value;
        let module=  vm.tabConfig.moduleName;
        if(module==null ||module==''){
            alert("请先选择模块名称");
            return;
        }
        $.get(baseURL + "tabconfig/getTabOrder?moduleName="+module, function(r){
            vm.tabOrders = r.data;
        });
    });
    form.on('select(tabOrder)', function (data) {
        vm.tabConfig.tabOrder = data.value;
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
    parent.vm.reload();
    parent.layer.close(index);
}

function matchNum(theObj){
    var reg = /^[0-9]+\.?[0-9]*$/;
    if (reg.test(theObj)) {
        return 1;
    }
    return 0;
}


function matchZhengShu(theObj){
    var reg = /^\d+(?=\.{1}\d+$|$)/
    // var reg2= /^(\-)*(\d+)\.(\d\d).*$/;
    if (reg.test(theObj)) {
        return 1;
    }
    return 0;
}


