$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        maintenancePlaceEntity:{
            lonlat:'',
            storeName:'',
            contacts:'',
            contactNumber:'',
            storeAddress:'',
            types:'',
            repairTimeSlot:'',
            deptId:'',
            deptName:'',
        },
        sysDeptParam:{},
        storeType:[],
        companyLst: [],
        verify: false,
        defaultObj:{}
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.maintenancePlaceEntity = param.data;
        if(param.data.types!= null && param.data.types != ''){
            var unitType = [];
            unitType = param.data.types.split(",");
            for (var j = 0; j < unitType.length; j++) {
                _this.storeType.push(unitType[j]);
                _this.defaultObj[`types[${unitType[j]}]`] = true
                // var unitTypeCheckbox = $("input[name='types']");
                // for (var i = 0; i < unitTypeCheckbox.length; i++) {
                //     if (unitTypeCheckbox[i].defaultValue == unitType[j]) {
                //         unitTypeCheckbox[i].value = unitType[j];
                //         unitTypeCheckbox[i].checked = true;
                //     }
                // }
            }
        }
        _this.maintenancePlaceEntity.lonlat = param.data.lon?param.data.lon+","+param.data.lat:'';
    },
    updated: function () {
        layui.form.render();
    },
    mounted:function () {
        layui.form.val('example', this.defaultObj)
        if(this.maintenancePlaceEntity.repairTimeSlot == null || this.maintenancePlaceEntity.repairTimeSlot == ''){
            this.maintenancePlaceEntity.repairTimeSlot= '[{"serNo":1,"timeSlot":"9:00-9:30","number":1},{"serNo":2,"timeSlot":"9:30-10:00","number":1},{"serNo":3,"timeSlot":"10:00-10:30","number":1},{"serNo":4,"timeSlot":"10:30-11:00","number":1},{"serNo":5,"timeSlot":"11:00-11:30","number":1},{"serNo":6,"timeSlot":"11:30-12:00","number":1},{"serNo":7,"timeSlot":"13:00-13:30","number":1},{"serNo":8,"timeSlot":"13:30-14:00","number":1},{"serNo":9,"timeSlot":"14:00-14:30","number":1},{"serNo":10,"timeSlot":"14:30-15:00","number":1},{"serNo":11,"timeSlot":"15:00-15:30","number":1},{"serNo":12,"timeSlot":"15:30-16:00","number":1},{"serNo":13,"timeSlot":"16:00-16:30","number":1},{"serNo":14,"timeSlot":"16:30-17:00","number":1}]'
            this.$forceUpdate()
        }
    },
    methods: {
        // 获取百度地图坐标数据
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
            if(vm.maintenancePlaceEntity.storeAddress != null){
                window.localStorage.setItem("storeAddress",vm.maintenancePlaceEntity.storeAddress);
            } else {
                window.localStorage.setItem("storeAddress","");
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
                    if(vm.maintenancePlaceEntity.lon != "" && vm.maintenancePlaceEntity.lat !=""){
                        lnglat = lon+","+lat;
                    } else {
                        lnglat = "";
                    }
                    vm.maintenancePlaceEntity = Object.assign({}, vm.maintenancePlaceEntity,{
                        lon:vm.maintenancePlaceEntity.lon,
                        lat:vm.maintenancePlaceEntity.lat,
                        storeAddress:vm.maintenancePlaceEntity.storeAddress,
                        lonlat:lnglat,
                    });
                    console.log(vm.maintenancePlaceEntity,22222)
                }
            });
            layer.full(index);
        },
        saveOrUpdate: function (event) {
            if (vm.maintenancePlaceEntity.contactNumber != null && vm.maintenancePlaceEntity.contactNumber != '') {
                if (vm.maintenancePlaceEntity.contactNumber.indexOf("-") != -1) {
                    var reg = /^0\d{2,3}-\d{7,8}$/
                    if (!reg.test(vm.maintenancePlaceEntity.contactNumber)) {
                        console.log('联系电话格式有误');
                        return;
                    }
                } else {
                    if (!/(^\d{11}$)|(^\d{13}$)/g.test(vm.maintenancePlaceEntity.contactNumber)) {
                        alert('联系电话格式有误');
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        return;
                    }
                }
            }
            var url = "maintenance/repairstore/saveOrUpdate" ;
            if(vm.storeType.length == 0){
                alert('请选择维修类型！');
                return;
            }
            vm.maintenancePlaceEntity.types = vm.storeType.sort().join(',');
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.maintenancePlaceEntity),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
            },
        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.maintenancePlaceEntity,"deptId",treeNode.deptId);
            Vue.set(vm.maintenancePlaceEntity,"deptName",treeNode.name);
            layer.closeAll();
        },
    }
});

function init(layui) {
    initEventListener(layui);
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.on('radio(types)', function (data) {
        vm.maintenancePlaceEntity.types = data.value;
    });
    form.verify({
        validate_storeName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "门店名称不能为空";
                }
            }
        },
        validate_lonlat: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "经纬度不能为空";
                }
            }
        },
        validate_storeAddress: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "门店地址不能为空";
                }
            }
        },
        deptNameVerify: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "所属部门不能为空";
                }
            }
        },
        validate_repairTimeSetting: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                }else {
                    if (typeof value == 'string') {
                        try {
                            var obj=JSON.parse(value);
                            if(typeof obj == 'object' && obj ){
                            }else{
                                return "预约时间段设置值格式不正确！";
                            }

                        } catch(e) {
                            console.log('error：'+value+'!!!'+e);
                            return "预约时间段设置值格式不正确！";
                        }
                    }
                }
            }
        },

    });

    layui.form.on('checkbox(storeType)', function (data) {
        if(data.elem.checked){
            vm.storeType.push(data.value);
        }else{
            vm.storeType= vm.storeType.filter(item=>item!==data.value);
        }

    });
}


function isJSON(str) {
    debugger;

    console.log('It is not a string!')
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });
    $("#save").on('click', function () {
        vm.verify = true;
    });
}


function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
