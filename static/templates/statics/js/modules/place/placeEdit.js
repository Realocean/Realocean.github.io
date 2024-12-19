
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
        maintenancePlaceEntity: {},

    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.maintenancePlaceEntity = param.data;
        if(_this.maintenancePlaceEntity.type == null){
            _this.maintenancePlaceEntity.type=0;
        }

    },

    updated: function () {
        layui.form.render();
    },
    methods: {
        getBaiduData:function (){
            if(vm.maintenancePlaceEntity.lon != null){
                window.localStorage.setItem("lon",vm.maintenancePlaceEntity.lon);
            } else {
                window.localStorage.setItem("lon","");
            }
            if(vm.maintenancePlaceEntity.lat != null){
                window.localStorage.setItem("lat",vm.maintenancePlaceEntity.lat);
            } else {
                window.localStorage.setItem("lat","");
            }
            if(vm.maintenancePlaceEntity.mainAddress != null){
                window.localStorage.setItem("mainAddress",vm.maintenancePlaceEntity.mainAddress);
            } else {
                window.localStorage.setItem("mainAddress","");
            }

            var index = layer.open({
                title: "获取经纬度",
                type: 2,
                content: tabBaseURL + "modules/common/selectmap2.html",
                cancel:function (){
                    vm.maintenancePlaceEntity.lonlat = null;
                },
                end: function(){
                    // 获取选择的标点坐标和地址数据
                    var lon = vm.maintenancePlaceEntity.lon;
                    var lat = vm.maintenancePlaceEntity.lat;
                    var lnglat;
                    if(vm.maintenancePlaceEntity.lon != "" && vm.maintenancePlaceEntity.lat !=""
                    && vm.maintenancePlaceEntity.lon != undefined  && vm.maintenancePlaceEntity.lat !=undefined
                    ){
                        lnglat = lon+","+lat;
                    } else {
                        lnglat = null;
                    }
                    vm.maintenancePlaceEntity = Object.assign({}, vm.maintenancePlaceEntity,{
                        lon:vm.maintenancePlaceEntity.lon,
                        lat:vm.maintenancePlaceEntity.lat,
                        mainAddress:vm.maintenancePlaceEntity.mainAddress,
                        lonlat:lnglat
                    });
                }
            });
            layer.full(index);
        },

        saveOrUpdate: function (event) {
            var url = vm.maintenancePlaceEntity.id == null ? "/mainPlace/insertMainPlace" : "/mainPlace/updateMainPlace";
            PageLoading();
           $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.maintenancePlaceEntity),
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



}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        mainName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "地点名称不能为空";
                }
            }
        },
        lonlat: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "经纬度信息不能为空";
                }
            }
        },
        mainAddress: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "详细地址不能为空";
                }
            }
        }
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
    form.on('radio(type)', function (data) {
        vm.maintenancePlaceEntity.type = data.value;
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



