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
        sysDept:{

        },
        companyLst: [],
        verify: false
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.sysDept = param.data;
        $.get(baseURL + "sys/dept/listCompany", function (r) {
            _this.companyLst = r.deptList;
        });
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 获取百度地图坐标数据
        getBaiduData:function (){
            if(vm.sysDept.longitude != null){
                window.localStorage.setItem("longitude",vm.sysDept.longitude);
            } else {
                window.localStorage.setItem("longitude","");
            }
            if(vm.sysDept.latitude != null){
                window.localStorage.setItem("latitude",vm.sysDept.latitude);
            } else {
                window.localStorage.setItem("latitude","");
            }
            if(vm.sysDept.contactAddress != null){
                window.localStorage.setItem("contactAddress",vm.sysDept.contactAddress);
            } else {
                window.localStorage.setItem("contactAddress","");
            }

            var index = layer.open({
                title: "获取经纬度",
                type: 2,
                content: tabBaseURL + "modules/common/selectmap.html",
                end: function(){
                    // 获取选择的标点坐标和地址数据
                    var longitude = vm.sysDept.longitude;
                    var latitude = vm.sysDept.latitude;
                    var lnglat;
                    if(vm.sysDept.longitude != "" && vm.sysDept.latitude !=""){
                        lnglat = longitude+","+latitude;
                    } else {
                        lnglat = "";
                    }
                    var contactAddress = vm.sysDept.contactAddress;
                    vm.sysDept = Object.assign({}, vm.sysDept,{
                        longitude:vm.sysDept.longitude,
                        latitude:vm.sysDept.latitude,
                        contactAddress:vm.sysDept.contactAddress,
                        lonlat:lnglat,
                    });
                }
            });
            layer.full(index);
        },
        saveOrUpdate: function (event) {//

                if(vm.sysDept.uscCode != null && vm.sysDept.uscCode != ''){
                    if (!/^[a-zA-Z0-9]{18}$/g.test(vm.sysDept.uscCode)) {
                        alert('统一社会信用代码格式有误');
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        return;
                    }
                }

                if (vm.sysDept.contactEmail != null && vm.sysDept.contactEmail != '') {
                    if (!/\w+@\w+\.\w+/g.test(vm.sysDept.contactEmail)) {
                        alert('联系邮箱格式有误');
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        return;
                    }
                }

                if (vm.sysDept.contactTel != null && vm.sysDept.contactTel != ''){
                    if (!/(^\d{11}$)|(^\d{13}$)/g.test(vm.sysDept.contactTel)) {
                        alert('联系电话格式有误');
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        return;
                    }
                }

            var url = "sys/dept/storeSaveOrUpdate" ;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.sysDept),
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
    form.verify({
        validate_storeName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "门店名称不能为空";
                }
            }
        },
        validate_deptId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "所属公司不能为空";
                }
            }
        },

    });

    //选择所属公司
    layui.form.on('select(filterDeptId)', function (data) {
        vm.sysDept.deptId = data.value;
    });
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
