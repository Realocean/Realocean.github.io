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

    // 购买时间
    layui.laydate.render({
        elem: '#buyingTime',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: (value)=>vm.deviceInformation.buyingTime = value
    });
    // 设备到期时间
    layui.laydate.render({
        elem: '#deviceExpirationTime',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: (value)=>vm.deviceInformation.deviceExpirationTime = value
    });
    // SIM到期时间
    layui.laydate.render({
        elem: '#simExpirationTime',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: (value)=>vm.deviceInformation.simExpirationTime = value
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q: {
            keyword: null
        },
        //设备生产商下拉列表数据源
        gpsEquipmentSupplier: [],
        deviceInformation: {},
        deviceTypeNoList: [],
        verify: false
    },
    created: function () {
    },
    mounted() {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.deviceInformation = param.data;
        this.deviceInformation.deviceTypeNo = param.data.deviceTypeNo;
        _this.deviceInformation.powerFlag = param.data.powerFlag;
        $.ajax({
            type: "POST",
            url: baseURL + "web/devicemanagement/getDeviceType?manufacturerNumber=" + this.deviceInformation.manufacturerNumber,
            data: null,
            success: function (r) {
                _this.deviceTypeNoList = r.entity;
            }
        });

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.deviceInformation.deviceId == null ? "deviceinformation/deviceinformation/save" : "deviceinformation/deviceinformation/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.deviceInformation),
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
        //选择车辆设备号
        selectCarInfor:function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                content: tabBaseURL + "modules/deviceinformation/selectgpsdevice.html",
                end: function(){

                }
            });
            layer.full(index);
        },
        resetDeviceNo:function () {
            vm.deviceInformation.carId=null;
            vm.deviceInformation.carNo=null;
        }
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

    //初始化查询数据字典-设备生产商
    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/"+"gpsEquipmentSupplier",
        contentType: "application/json",
        data:null,
        success: function(r){
            vm.gpsEquipmentSupplier = r.dict;
        }
    });


}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_deviceNo: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "设备编号不能为空";
                }
            }
        },
        validate_manufacturerNumber: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "制造商编号不能为空";
                }
            }
        },
        validate_simCard: function (value, item) {
            if (value == null || value == '') {
                return "SIM卡不能为空";
            }
        },
        validate_deviceTypeNo: function (value, item) {
            if (value == null || value == '') {
                return "设备型号不能为空";
            }
        },
        validate_deviceBatch: function (value, item) {
            if (value == null || value == '') {
                return "设备批次不能为空";
            }
        },
        validate_buyingTime: function (value, item) {
            if (value == null || value == '') {
                return "购买时间不能为空";
            }
        },
        validate_deviceExpirationTime: function (value, item) {
            if (value == null || value == '') {
                return "设备到期时间不能为空";
            }
        },
        validate_simExpirationTime: function (value, item) {
            if (value == null || value == '') {
                return "SIM到期时间不能为空";
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    //设备生产商
    form.on('select(manufacturerNumber)', function (data) {
        vm.deviceInformation.manufacturerNumber = data.value;
        if (data.value != null) {
            $.ajax({
                type: "POST",
                url: baseURL + "web/devicemanagement/getDeviceType?manufacturerNumber=" + data.value,
                data: null,
                success: function (r) {
                    vm.deviceTypeNoList = r.entity;
                }
            });
        }
    });
    //是否断油电
    form.on('select(powerFlag)', function (data) {
        vm.deviceInformation.powerFlag = data.value;
    });
    form.on('select(deviceTypeNo)', function (data) {
        vm.deviceInformation.deviceTypeNo = data.value;
        layui.form.render();
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
