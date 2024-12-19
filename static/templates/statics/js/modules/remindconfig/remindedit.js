
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
        q: {
            keyword: null
        },
        remindConfig: {},
        verify: false,
        fileLstId: '0',
        fileLst:[],
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.remindConfig = param.data;

    },

    mounted:function() {
        // $.ajaxSettings.async = false


    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
              var url = vm.remindConfig.id == null ? "/remindconfig/save" : "/remindconfig/update";
               PageLoading();
           $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.remindConfig),
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
        remindModule: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "提醒模块名称不能为空";
                }
            }
        },
        remindType: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "提醒类型不能为空";
                }
            }
        },
        remindValue: function (value, item) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "提醒值不能为空";
                }

        }


    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('select(remindModule)', function (data) {
        vm.remindConfig.remindModule = data.value;
    });
    form.on('select(remindType)', function (data) {
        vm.remindConfig.remindType = data.value;
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
        elem: '#sendTimeStart',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.sendTimeStart = value;
        }
    });
    laydate.render({
        elem: '#sendTimeEnd',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.sendTimeEnd = value;
        }
    });

    laydate.render({
        elem: '#useTimeStart',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.useTimeStart = value;
        }
    });

    laydate.render({
        elem: '#useTimeEnd',//指定元素
        trigger: 'click',
        type:"datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        done: function(value, date, endDate){
            vm.couponEntity.useTimeEnd = value;
        }
    });
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


