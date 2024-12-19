$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
            where: { repairStatus: vm.q.repairStatus, carPlateNoVinNo: vm.q.carPlateNoVinNo },
            url: baseURL + "carrepairorder/carrepairorder/list",
            cols: [[
                { title: '操作', width: 170, minWidth: 170, templet: '#barTpl', fixed: "left", align: "center" },
                {
                    field: 'carPlateNo', minWidth: 100, title: '车牌号', fixed: "left", align: "center", templet: function (d) {
                        if (d.carPlateNo != null && d.carPlateNo != '') {
                            return "<span style='color:#419BEA;cursor:pointer;' onclick=goToCarDetail(\'" + d.carId + "\')>" + d.carPlateNo + "</span>";

                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'faultDesc', minWidth: 100, title: '工单号', templet: function (d) {
                        if (d.faultDesc != null && d.faultDesc != '') {
                            return d.faultDesc;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'repairStartDate', minWidth: 100, title: '工单状态', templet: function (d) {
                        if (d.repairStartDate != null && d.repairStartDate != '') {
                            return d.repairStartDate;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'repairEndDate', minWidth: 100, title: '工单类型', templet: function (d) {
                        if (d.repairEndDate != null && d.repairEndDate != '') {
                            return d.repairEndDate;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'serviceName', minWidth: 100, title: '提醒事项', templet: function (d) {
                        if (d.serviceName != null && d.serviceName != '') {
                            return d.serviceName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'carStatus', minWidth: 100, title: '车辆状态', templet: function (d) {
                        //当前状态 1整备中，2备发车，3 预定中  4.用车中 5.已过户
                        if (d.carStatus == 1) {
                            return "整备中";
                        } else if (d.carStatus == 2) {
                            return "备发车";
                        } else if (d.carStatus == 3) {
                            return "预定中";
                        } else if (d.carStatus == 4) {
                            return "用车中";
                        } else if (d.carStatus == 5) {
                            return "已过户";
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: ' insurancePay', minWidth: 100, title: '总费订单类型用/元', templet: function (d) {
                        if (d.insurancePay != null && d.insurancePay != '') {
                            return d.insurancePay;
                        } else {
                            return "--";
                        }

                    }
                },
                {
                    field: ' maintenanceItems', minWidth: 100, title: '关联订单号', templet: function (d) {
                        if (d.maintenanceItems != null && d.maintenanceItems != '') {
                            return d.maintenanceItems;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: ' maintenanceDays', minWidth: 100, title: '客户名称', templet: function (d) {
                        if (d.maintenanceDays != null && d.maintenanceDays != '') {
                            return d.maintenanceDays;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'carMileage', minWidth: 100, title: '联系电话', templet: function (d) {
                        if (d.carMileage != null && d.carMileage != '') {
                            return d.carMileage;
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'applyNo', minWidth: 100, title: '工单创建时间' },

                { field: 'flowApproveStatus', minWidth: 100, title: '最后跟进时间' },

                {
                    field: 'rentType', minWidth: 150, title: '跟进人', align: "center", templet: function (d) {
                        if (d.rentType != null && d.rentType != '') {
                            return d.rentType;
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'vinNo', minWidth: 100, title: '跟进次数' },

                {
                    field: 'deptName', minWidth: 100, title: '车架号', templet: function (d) {
                        if (d.deptName != null && d.deptName != '') {
                            return d.deptName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'deptName', minWidth: 100, title: '业务负责人', templet: function (d) {
                        if (d.deptName != null && d.deptName != '') {
                            return d.deptName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'carBrandModelName', minWidth: 100, title: '品牌/车系/车型', templet: function (d) {
                        if (d.carBrandModelName != null && d.carBrandModelName != '') {
                            return d.carBrandModelName;
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'vinNo', minWidth: 100, title: '车辆归属' },
                {
                    field: 'depotName', minWidth: 100, title: '所在仓库', templet: function (d) {
                        if (d.depotName != null && d.depotName != '') {
                            return d.depotName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'carOwner', minWidth: 100, title: '车辆所有人', templet: function (d) {
                        if (d.carOwner != null && d.carOwner != '') {
                            return d.carOwner;
                        } else {
                            return "--";
                        }
                    }
                },



            ]],
            page: true,
            loading: true,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });
    })

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        init(layui);
        form.render();
    });

    //所属部门
    layui.form.on('select(deptIdSelect)', function (data) {
        vm.q.deptId = data.value;
    });
    //品牌车型
    layui.form.on('select(brandSelect)', function (data) {
        vm.q.brand = data.value;
    });

    //维修状态
    layui.form.on('select(repairStatusSelect)', function (data) {
        vm.q.repairStatus = data.value;
    });

    //车辆状态
    layui.form.on('select(carStatusSelect)', function (data) {
        vm.q.carStatus = data.value;
    });
    //车辆用途
    layui.form.on('select(carPurposeSelect)', function (data) {
        vm.q.carPurpose = data.value;
    });

    //费用结算
    layui.form.on('select(costSettlement)', function (data) {
        vm.q.costSettlement = data.value;
    });


    layui.form.on('submit(saveOrUpdate)', function () {
        console.log(123124)
        vm.saveOrUpdate();
        return false;
    });
    layui.form.on('submit(cancellation)', function () {
        vm.cancel();
        return false;
    });
    layui.form.on('submit(saveOrUpdate1)', function () {
        console.log(123124)
        vm.saveOrUpdate1();
        return false;
    });
    layui.form.on('submit(cancellation1)', function () {
        vm.cancel1();
        return false;
    });


    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.follow(data.id);
        } else if (layEvent === 'feedbackCheck') {
            vm.feedbackCheck(data.id)
        }
    });
    // 标记工单已完结
    layui.form.on('switch(switchTest12)', function (obj) {
        let a = $.trim($('#contractSwitch12').is(":checked"));
        // let data2 = obj.elem.attributes.onlyname.value
        console.log(obj, 111111)
        if (a == 'true') {
            this.followInfo.statue = 'true'

        } else {
            this.followInfo.statue = 'false'

        }
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            //车牌号
            carPlateNoVinNo: null,
            //车辆归属
            deptId: null,
            deptName: null,
            //品牌车系车型
            brandId: null,
            seriesId: null,
            modelId: null,
            maintenanceItems: null,
            //维修时车辆状态
            carStatus: null,
            //客户名称
            customer: null,
            //订单编号
            orderNo: null,
            //所在仓库
            depotName: null,
            depotId: null,
            //维修状态
            repairStatus: null,
            //维修厂名称
            serviceName: null,
            //费用结算
            costSettlement: null,
            //故障描述
            faultDesc: null,
            //维修申请号
            applyNo: null,
            //维修开始时间时间类型
            repairStartTimeType: null,
            //维修开始时间，自定义时间段
            repairStarDateStr: null,

            //维修结束时间时间类型
            repairEndTimeType: null,
            //维修结束时间，自定义时间段
            repairEndDateStr: null,
            carOwner: null,


        },
        showForm: false,
        carRepairOrder: {},
        allCarModels: [],
        carRepairOrderEdit: {},
        warehouseData: {},
        isFilter: false,
        settingInfo: {},
        fineStaues: null,
        workOrderSetting: false,
        workOrderFollow: false,
        storeList: [
            {
                storeType: 0,
                label: '门店一'
            },
            {
                storeType: 1,
                label: '门店二'
            }
        ],
        followInfo: {},


    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
        this.getTypeList();
        var _this = this;
        var param = parent.layer.boxParams.boxParams;

        if (param != undefined && param != null) {
            _this.q.repairStatus = param.repairStatus;
        }

        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form', "jquery", "cascader", "form"], function () {
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.allCarModels,
                    success: function (valData, labelData) {
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });
        _this.q.carPlateNoVinNo = parent.layer.boxParams.carPlateNoVinNo;
    },
    methods: {
        // 获取车辆所属部门和公司
        getTypeList() {
            var vm = this;
            $.ajax({
                type: "GET",
                url: baseURL + "sys/dept/findStoreList",
                success: function (r) {
                    vm.storeList = r.deptList || []
                    vm.xmSelect = xmSelect.render({
                        el: '#typeSelect',
                        data: vm.storeList.map(item => { return { name: item.companyName, value: item.deptId } }),
                        tips: '请选择',
                        on: function (data) {
                            if (data.arr.length) {
                                vm.settingInfo.arr = data.arr.map(item => item.value);
                            } else {
                                vm.settingInfo.arr = [];
                            }
                        }
                    })
                }
            });
        },
        initParam: function (carNo) {
            vm.q.carPlateNo = carNo;
            vm.reload();
        },
        chooseWarehouse: function () {
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function () {
                    vm.q = Object.assign({}, vm.q, {
                        depotId: vm.warehouseData.warehouseId,
                        depotName: vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }
            var ids = [];
            $.each(list, function (index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        deptTree: function () {
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.q, "deptId", treeNode.deptId);
            Vue.set(vm.q, "deptName", treeNode.name);
            layer.closeAll();
        },
        reset: function () {
            //车牌号
            vm.q.carPlateNoVinNo = null;
            //车辆归属
            vm.q.deptId = null;
            vm.q.deptName = null;
            //品牌车系车型
            vm.q.brandId = null;
            vm.q.seriesId = null;
            vm.q.modelId = null;
            //维修时车辆状态
            vm.q.carStatus = null;
            //客户名称
            vm.q.customer = null;
            //订单编号
            vm.q.orderNo = null;
            //所在仓库
            vm.q.depotName = null;
            vm.q.depotId = null;
            //维修状态
            vm.q.repairStatus = null;
            //维修厂名称
            vm.q.serviceName = null;
            //费用结算
            vm.q.costSettlement = null;
            //故障描述
            vm.q.faultDesc = null;
            //维修项目内容
            vm.q.maintenanceItems = null;
            //维修申请号
            vm.q.applyNo = null;
            //维修开始时间时间类型
            vm.q.repairStartTimeType = null;
            //维修开始时间，自定义时间段
            vm.q.repairStarDateStr = null;

            //维修结束时间时间类型
            vm.q.repairEndTimeType = null;
            //维修结束时间，自定义时间段
            vm.q.repairEndDateStr = null;
            //车辆所有人
            vm.q.carOwner = null;

            $("#carBrandSeriesModel").val("");
            $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.reload();

        },
        query: function () {
            vm.reload();
        },
        add: function () {
            var index = layer.open({
                title: "超险罚款",
                type: 1,
                area: ['600px', '330px'],
                content: $("#workOrderSetting"),
                end: function () {
                    vm.workOrderSetting = false;

                }
            });
            vm.fineStaues = index
        },
        follow: function () {
            var index = layer.open({
                title: "工单跟进",
                type: 1,

                area: ['600px', '400px'],
                content: $("#workOrderFollow"),
                end: function () {
                    vm.workOrderFollow = false;

                }
            });
        },
        cancel: function () {
            layer.closeAll();
            vm.workOrderSetting = false;
        },
        cancel1: function () {
            layer.closeAll();
            vm.workOrderFollow = false;
        },

        //维修完成查看
        feedbackCheck: function (id) {
            window.localStorage.setItem("carRepairOrderId", id);
            var index = layer.open({
                title: "维保管理 > 风控工单 >风控工单查看",
                type: 2,
                content: tabBaseURL + 'modules/rskWorkOrder/workOrdeDetil.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },

        update: function (id) {
            var index = layer.open({
                title: "维保管理 > 维修列表 >编辑维修单",
                type: 2,
                content: tabBaseURL + "modules/carrepairorder/carrepairorderedit.html",
                success: function (layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.vm.sendEditInfor(id);

                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        saveOrUpdate: function (event) {
            var url = vm.carRepairOrder.id == null ? "carrepairorder/carrepairorder/save" : "carrepairorder/carrepairorder/update";
            console.log("asdasjkh:",JSON.stringify(vm.carRepairOrder));
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carRepairOrder),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                            vm.workOrderSetting = false;
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        saveOrUpdate1: function (event) {
            var url = vm.carRepairOrder.id == null ? "carrepairorder/carrepairorder/save" : "carrepairorder/carrepairorder/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carRepairOrder),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                            vm.workOrderFollow = false;
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },

        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carPlateNoVinNo: vm.q.carPlateNoVinNo,
                    deptId: vm.q.deptId,
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    modelId: vm.q.modelId,
                    carStatus: vm.q.carStatus,
                    customer: vm.q.customer,
                    orderNo: vm.q.orderNo,
                    depotId: vm.q.depotId,
                    repairStatus: vm.q.repairStatus,
                    serviceName: vm.q.serviceName,
                    costSettlement: vm.q.costSettlement,
                    faultDesc: vm.q.faultDesc,
                    applyNo: vm.q.applyNo,
                    //维修开始时间时间类型
                    repairStartTimeType: vm.q.repairStartTimeType,
                    //维修开始时间自定义时间段
                    repairStarDateStr: vm.q.repairStarDateStr,
                    //维修结束时间类型
                    repairEndTimeType: vm.q.repairEndTimeType,
                    //维修结束时间自定义时间段
                    repairEndDateStr: vm.q.repairEndDateStr,
                    carOwner: vm.q.carOwner,
                    maintenanceItems: vm.q.maintenanceItems,
                }
            });
        },
    }
});


function init(layui) {
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}


function initClick() {
    $('div[type="repairStartDate"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "repairStarDateStr", '');
        //维修开始时间类型
        vm.q.repairStartTimeType = value;
    });

    $('div[type="repairEndDate"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "repairEndDateStr", '');
        vm.q.repairEndTimeType = value;
    });
}

function initDate(laydate) {
    //维修开始时间，自定义时间
    laydate.render({
        elem: '#repairStartDate',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.repairStarDateStr = value;
            vm.q.repairStartTimeType = null;
        }
    });

    //维修结束时间，自定义时间
    laydate.render({
        elem: '#repairEndDate',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.repairEndDateStr = value;
            vm.q.repairEndTimeType = null;

        }
    });
}

function initData() {


}
/**
 * 跳转至辆详情页面
 */

function goToCarDetail(carId) {
    var index = layer.open({
        title: "车辆详情",
        type: 2,
        content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
        success: function (layero, num) {
            var iframe = window['layui-layer-iframe' + num];
            iframe.vm.initEditData(carId);
        },
        end: function () {
            vm.showForm = false;
            layer.closeAll();
        }
    });
    vm.showForm = true;
    layer.full(index);
}

/**
 * 跳转至订单详情
 */
function goToOrderDetail(orderCarId) {
    $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
        //   r.order.orderCar.orderCarStatusStr = data.statusStr;
        var param = {
            data: r.order
        };
        var index = layer.open({
            title: "查看",
            type: 2,
            boxParams: param,
            content: tabBaseURL + "modules/order/orderview.html",
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
    });
}









