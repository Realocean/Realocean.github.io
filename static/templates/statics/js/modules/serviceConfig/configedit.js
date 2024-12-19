
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
        serviceConfig: {},
        verify: false,
        fileLstId: '0',
        fileLst:[],
        groupLst: [],
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.serviceConfig = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "serviceconfig/serviceconfiggroup/listAll", function (r) {
            _this.groupLst = r.data;
        });
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
              var url = vm.serviceConfig.id == null ? "/serviceConfig/addConfig" : "/serviceConfig/editConfig";
               PageLoading();
           $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.serviceConfig),
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
        serviceName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "费用名称不能为空";
                }
            }
        },
        groupKey: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "费用类型不能为空";
                }
            }
        },
        serviceProperty: function (value, item) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "预支金额不能为空";
                }

        },
        serviceField: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "费用性质不能为空";
                }
            }
        },
        suitType: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "适用业务类型不能为空";
                }
            }
        },
        suitRentType: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "适用租赁类型不能为空";
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

    form.on('select(groupKey)', function (data) {
        vm.serviceConfig.groupKey = data.value;
        if(data.value != null && data.value != ''){
            vm.serviceConfig.groupName=data.elem[data.elem.selectedIndex].text
        }else{
            vm.serviceConfig.groupName='';
        }
    });
    form.on('select(serviceProperty)', function (data) {
        vm.serviceConfig.serviceProperty = data.value;
    });
    form.on('select(suitType)', function (data) {
        let value=data.value;
        if(value==2){
            let suitRentType = vm.serviceConfig.suitRentType;
            if(suitRentType!=null && suitRentType!=''&& suitRentType==6){
                vm.serviceConfig.suitType=null;
            }
        }
        vm.serviceConfig.suitType = data.value;
    });

    form.on('select(suitRentType)', function (data) {
        let value=data.value;
        if(value==6){
          let suitType = vm.serviceConfig.suitType;
          if(suitType!=null && suitType!=''&& suitType==2){
              vm.serviceConfig.suitType=null;
          }
        }
        vm.serviceConfig.suitRentType = data.value;
    });

    form.on('radio(serviceConfigRequired)', function (data) {
        vm.serviceConfig.required = data.value;
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
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload('feeItem');
    }
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


