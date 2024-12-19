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
    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/" + "gpsEquipmentSupplier",
        contentType: "application/json",
        data: null,
        success: function (r) {
            vm.gpsEquipmentSupplier = r.dict;
        }
    });

    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/" + "gpsEquipmentType",
        contentType: "application/json",
        data: null,
        success: function (r) {
            vm.gpsEquipmentType = r.dict;
        }
    });
    $.ajax({
        type: "POST",
        url: baseURL + "web/deviceinstruct/getInstructs",
        data: null,
        success: function (r) {
            vm.deviceCommands = r.list;
        }
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            keyword: null
        },
        isCode: 0,
        //设备生产商下拉列表数据源
        gpsEquipmentSupplier: [],
        deviceManagement: {
            manufacturerNumber: null,
            managementEntityList: [],

        },
        commandsShow: false,
        gpsEquipmentType: [],
        addArr: [
            {
                id: null,
                deviceTypeNo: null,
                num: null,
                deviceKind: null,
                deviceCommands: null
            },
        ],
        deviceCommands: [],
        arr: [],
        index: null,
        verify: false,
    },
    created: function () {

    },
    mounted() {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.deviceManagement = param.data;
        let code = param.code;
        console.log("code is " + code);
        _this.addArr[0].id = param.data.id;
        _this.addArr[0].deviceTypeNo = param.data.deviceTypeNo;
        _this.addArr[0].num = param.data.num;
        _this.addArr[0].deviceKind = param.data.deviceKind;
        if (code == 0) {
            $("#manu").attr("disabled", true);
            $("#dom0").attr("disabled", true);
            $("#dot0").attr("disabled", true);
        } else {
            $("#manu").attr("disabled", false);
            $("#dom0").attr("disabled", false);
            $("#dot0").attr("disabled", false);
        }
        if (param.data.deviceKind == 0) {
            $("#step0").hide();
        } else {
            $("#step0").show();
            _this.addArr[0].deviceCommands = param.data.deviceCommands;
        }
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        add() {
            vm.arr.length = 0;
            let obj = {
                id: null,
                deviceTypeNo: '',
                num: '',
                deviceKind: '',
                deviceCommands: ''
            };
            this.addArr.push(obj)
            $('input[type=checkbox]').prop('checked', false);
        },
        step(index) {
            return "step" + index;
        },
        dom(index) {
            return "dom" + index;
        },
        dot(index) {
            return "dot" + index;
        },
        del(index) {
            this.addArr.splice(index, 1);
        },
        chooseCommands(im) {
            console.log(im);
            vm.commandsShow = true;
            var index = layer.open({
                title: "设备指令",
                type: 1,
                area: ['50%', '50%'],
                btn: ['确定', '取消'],
                btn1: function () {
                    if (vm.arr.length == 0) {
                        alert("请选择指令");
                    } else {
                        vm.addArr[im].deviceCommands = vm.arr.toString();
                        layui.layer.closeAll();
                    }
                },
                btn2: function () {
                    vm.addArr[im].deviceCommands = null;
                    vm.arr.length = 0;
                    $('input[type=checkbox]').prop('checked', false);
                },
                content: $("#commands"),
                end: function () {
                    vm.commandsShow = false;
                    layer.close(index);
                }
            });


        },

        saveOrUpdate: function (event) {
            vm.deviceManagement.managementEntityList = this.addArr;
            var url = vm.deviceManagement.id == null ? "web/devicemanagement/save" : "web/devicemanagement/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.deviceManagement),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
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
    // initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {

    //初始化查询数据字典-设备生产商


}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_manufacturerNumber: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "制造商编号不能为空";
                }
            }
        },
        validate_deviceTypeNo: function (value, item) {
            if (value == null || value == '') {
                return "设备型号不能为空";
            }
        },
        validate_num: function (value, item) {
            if (value == null || value == '') {
                return "数量不能为空";
            }
            if (value <= 0) {
                return "数量必须为正整数";
            }
        },
        validate_deviceKind: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "设备类型不能为空";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });

    //设备生产商
    form.on('select(manufacturerNumber)', function (data) {
        vm.deviceManagement.manufacturerNumber = data.value;
        layui.form.render();
    });

    form.on('select(deviceKind)', function (data) {
        let index = data.elem.name;
        //vm.index = index;
        vm.addArr[index].deviceKind = data.value;
        if (data.value == 0) {
            vm.addArr[index].deviceCommands = null;
            $("#step" + index).hide();
        } else {
            $("#step" + index).show();
        }
        layui.form.render();
    });

    layui.form.on('checkbox(comList)', function (data) {

        console.log('indexOf', data);
        if ($(this).is(":checked") == true) {
            //选中触发事件
            console.log('273', 1);
            vm.arr.push(data.value);
        } else {
            //取消选中触发事件
            console.log('276', 2);
            vm.arr.forEach((item, index) => {
                if (item == data.value) {
                    vm.arr.splice(index, 1);
                }
            })
        }
        console.log(vm.arr);
        layui.form.render();
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
