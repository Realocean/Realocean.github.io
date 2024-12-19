$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        init(layui);
        layui.form.render();
    });
});
// var imageURL = "/image-server/";
// var baseURL = "/xz-ys-api/";
var vm = new Vue({
    el: '#rrapp',
    data: {
        subtips: null,
        violationWarning: 0,
        type: 1,
        carOperation: {
            dateTime: '',
            dateTimestart: '',
            dateTimeend: '',
            dateTimetype: '',
            useing: 0,
            backing: 0,
            transfering: 0,
            spareuseing: 0,
            deliverycar: 0,
        },
        financeOperation: {
            dateTime: '',
            dateTimestart: '',
            dateTimeend: '',
            dateTimetype: '',
            receivable: 0,
            received: 0,
            back: 0,
            retired: 0,
            copyWothAmount: 0,
            isPayAmount: 0,
            collectionMoney: 0,
            returnMoney: 0,
            paymentMoney: 0
        },
        bpmData: {
            processApprove: 0,
            processCopy: 0,
            processApply: 0
        },
        riskAlert: {
            leaseExpirationCount: 0,
            rentOverdueCount: 0,
            carIllegalCount: 0,
            waitInsuranceCount: 0,
            waitInspectionCount: 0,
            waitMaintenanceCount: 0,
            carWarningCount: 0
        },
        vehicleOperationData: {
            repairCount: 0,
            allCarCount: 0,
            leasedVehiclesCount: 0,
            bookingTaxiCount: 0,
            standbyTrainCount: 0,
            inPreparationCount: 0,
            transferCount: 0,
            isDisposedCount: 0,
            isSoldCount: 0
        },
        customerOperationData: {
            totalCount: 0,
            rentCount: 0,
            dueSoonCount: 0,
            needPayRentCount: 0,
            overDueCount: 0,
            reminderThresholdCount: 0
        },
        sysUserInfo: {
            username: '-',
            deptName: '-',
            roles: '-'
        },
        unread: null,
        riskShow: false,
        carShow: false,
        orderShow: false,
        customerShow: false,
        caiWuShow: false,
        notice:[]
    },
    created: function () {
        var _this = this;
        // console.log('userId', sessionStorage.getItem("userId"))
    },

    mounted: function () {
        $.get(baseURL + 'mainInfo/getMainInfo', function (r) {
            vm.riskShow = r.data.riskShow;
            vm.carShow = r.data.carShow;
            vm.orderShow = r.data.orderShow;
            vm.customerShow = r.data.customerShow;
            vm.caiWuShow = r.data.caiWuShow;
        });
        $.get(baseURL + "sys/notice/list?page=1&limit=1", function (res) {
            if(res.data&&res.data.length>0){
               vm.notice = res.data;
            }
        })
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        formatRoles: function (roles) {
            if (roles != null && roles != '') {
                var roleArray = roles.split(",");
                if (roleArray.length > 1) {
                    return roleArray[0] + "...";
                } else {
                    return roleArray[0];
                }
            }
        },
        addOrderContract: function () {
            var param = {
                data: {}
            };
            var index = layer.open({
                title: "新增订单合同",
                type: 2,
                boxParams: param,
                content: "./modules/contract/contracordernotemplateedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        processInfoData: function (type) {
            var title;
            var content;
            if (type === '1') {
                title = '待审批';
                content = './modules/activiti/processapprove.html';
            } else if (type === '2') {
                title = '抄送我的';
                content = './modules/activiti/processcopy.html';
            } else {
                title = '我发起的';
                content = './modules/activiti/processinstance.html';
            }
            var index = layer.open({
                title: title,
                type: 2,
                content: content,
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        carOperationalData: function (businessType) {
            var param = {
                businessType: businessType
            };
            var index = layer.open({
                title: "车辆列表",
                type: 2,
                boxParams: param,
                content: "./modules/car/tcarbasic.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },

        customerData: function (businessType) {
            window.localStorage.setItem("businessType", businessType);
            var index = layer.open({
                title: "客户列表",
                type: 2,
                content: "./modules/customer/customerlist.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("businessType", null);
                }
            });
            layer.full(index);
        },

        riskRemindData: function (type, title) {
            var url = "";
            var param = {};
            if (type == 1) {
                window.localStorage.setItem("type1", 0);
                url = "./modules/warn/vehiclerentwarn.html";
            } else if (type == 2 || type == 8) {
                if (type == 2) {
                    window.localStorage.setItem("type", 6);
                } else {
                    window.localStorage.setItem("type", 3);
                }
                url = "./modules/warn/carinsurancewarn.html";
            } else if (type == 3) {
                window.localStorage.setItem("type3", 5);
                url = "./modules/warn/vehicleinspectionwarning.html";
            } else if (type == 4) {
                window.localStorage.setItem("type4", 5);
                url = "./modules/warn/maintenancewarn.html";
            } else if (type == 5) {
                url = "./modules/car/carwarninglist.html";
                param = { processingState: 2 };
            } else if (type == 6) {
                url = "./modules/carrepairorder/carrepairorder.html";
                param = { repairStatus: 2 };
            }
            var index = layer.open({
                title: title,
                type: 2,
                boxParams: param,
                content: url,
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("type", null);
                    window.localStorage.setItem("type1", null);
                    window.localStorage.setItem("type4", null);
                    window.localStorage.setItem("type3", null);
                }
            });
            layer.full(index);
        },
        addOrder: function () {
            var param = {
                callback: function (orderType) {
                    var approve = '';
                    switch (parseInt(orderType)) {
                        case 1://经租
                        case 3: //展示车
                        case 4: {//试驾车
                            approve = 'longRentOrderApprove';
                            break;
                        }
                        case 2: {//以租代购
                            approve = 'rentSaleOrderApprove';
                            break;
                        }
                        case 5: {//融租
                            approve = 'meltsRentOrderApprove';
                            break;
                        }
                        case 6: {//直购
                            approve = 'purchaseOrderApprove';
                            break;
                        }
                        case 7: {//直购
                            approve = 'affiliatedOrderApprove';
                            break;
                        }
                        default: {
                            approve = '';
                        }
                    }
                    $.get(baseURL+"mark/processnode/activitiEnable", { processKey: approve }, function (r) {
                        var param = {
                            data: {},
                            orderType: orderType
                        };
                        var index = layer.open({
                            title: "新增",
                            type: 2,
                            boxParams: param,
                            content: r ? "./modules/order/placeorderedit.html" : "./modules/order/orderedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    });
                }
            };
            var index = layer.open({
                title: "选择订单类型",
                type: 2,
                area: ['700px', '400px'],
                boxParams: param,
                content: "./modules/order/selectordertype.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        nodeCancel: function () {
            layer.closeAll();
        },
        determine: function () {

        },

        addClues: function () {
            var param = {
                data: {
                    customerType: '',
                    cluesState: '',
                    cluesSource: '',
                    intentionStatus: '',
                    followType: 1,
                    operatorId: sessionStorage.getItem("userId"),
                    operatorName: sessionStorage.getItem("username"),
                    operatorDeptId: sessionStorage.getItem("userdeptId"),
                    operatorDeptName: sessionStorage.getItem("userdeptName"),
                    followId: sessionStorage.getItem("userId"),
                    followName: sessionStorage.getItem("username"),
                    followDeptId: sessionStorage.getItem("userdeptId"),
                    followDeptName: sessionStorage.getItem("userdeptName")
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: "./modules/cluesnew/cluesedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        // 数据导入
        dataImport:function (){
            // var index = layer.open({
            //     title: "数据导入",
            //     type: 2,
            //     content: "./modules/import/dataimport.html",
            //     end: function () {
            //         layer.closeAll();
            //     }
            // });
            // layer.full(index);
            addTab('modules/import/dataimport.html','数据导入')
        },
        addCar: function () {
            var index = layer.open({
                title: "新增车辆",
                type: 2,
                content: "./modules/car/tcarbasicadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        addCustomer: function () {
            var param = {
                data: {},
                type: 1
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: "./modules/customer/customer.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },

        addBx: function () {
            var index = layer.open({
                title: "新增保险单",
                type: 2,
                content: "./modules/maintenance/insurancemanageadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        addNj: function () {
            var index = layer.open({
                title: "新增年检",
                type: 2,
                content: "./modules/maintenance/inspectionmanageadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        addBy: function () {
            var index = layer.open({
                title: "维保管理 > 保养管理 > 新增车辆保养",
                type: 2,
                content: "./modules/maintenance/maintenancemanageadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        addWxd: function () {
            var index = layer.open({
                title: "维保管理 > 维修列表 >新增维修单",
                type: 2,
                content: "./modules/carrepairorder/carrepairorderadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        addCxd: function () {
            var index = layer.open({
                title: "维保管理 > 出险列表 >新增出险单",
                type: 2,
                content: "./modules/outinsuranceorder/outinsuranceorderadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        addMessage: function () {
            var index = layer.open({
                title: "系统管理 > 消息推送 > 新增消息",
                type: 2,
                content: "./modules/message/messageadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        noiceMouseout(){
            this.flag = true;
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        noiceMove() {
            var id = '#noiceId';
            var content = this.notice[0].noticeContent||'暂无';
            if (!vm.noice) {
                vm.subtips = layer.tips(content, id, { tips: 1 });
            }
        },
        noiceClick(){
            var index = layer.open({
                title: "更新公告",
                type: 2,
                area:['600px','400px'],
                content: "./modules/car/noiceModel.html",
                end: function () {
                    layer.closeAll();
                }
            });

        },
        move(value) {
            var id = '#LAY_layedit_code' + value;
            var content = "";
            if (value == '1') {
                content = "说明：针对下游客户使用的订单；";
            } else if (value == '2') {
                content = "说明：针对下游客户使用的合同；";
            } else if (value == '3') {
                content = "说明\n" +
                    "\n" +
                    "风险总览：\n" +
                    "\n" +
                    "1、车辆租赁到期的统计规则：根据预设的提醒时间和租赁已到期两个维度进行统计；\n" +
                    "\n" +
                    "2、租金逾期的统计规则：已经超过应付时间的订单；\n" +
                    "\n" +
                    "3、交强险到期的统计规则：根据预设的提醒时间、已到期、未购买的三个维度进行统计；\n" +
                    "\n" +
                    "4、商业险到期的统计规则：根据预设的提醒时间、已到期、未购买的三个维度进行统计；\n" +
                    "\n" +
                    "5、年检到期的统计规则：根据预设的提醒时间、已到期、未购买的三个维度进行统计；\n" +
                    "\n" +
                    "6、保养到期的统计规则：根据预设的提醒时间和未保养的的维度进行统计；";
            } else if (value == '4') {
                content = "说明：车辆总数统计的是可运营的车辆总数；（用车中、预定中、整备中、备发车加起来的总数）";
            } else if (value == '5') {
                content = "说明：待我审批的数据，如有需要查看全部或已审批的数据，请自行筛选；";
            } else if (value == '6') {
                content = "说明：审核拒绝和审核驳回，审核中的数据，如有需要查看全部或审核通过的数据，请自行筛选；";
            }
            if (!vm.subtips) {
                vm.openMsg(id, content, value);
            }
        },
        openMsg(id, content, value) {
            if (value == '3') {
                vm.subtips = layer.tips(content, id, { tips: 1, area: ['20%', '47%'], });
            } else {
                vm.subtips = layer.tips(content, id, { tips: 1 });
            }
        },

        searchIllegal: function () {
            var index = layer.open({
                title: "违章查询",
                type: 2,
                content: "./modules/car/carillegal.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        messageBtn: function () {
            window.localStorage.setItem("msgStatus", 1);
            var index = layer.open({
                title: "消息列表",
                type: 2,
                content: "./modules/message/message.html",
                end: function () {
                    window.localStorage.setItem("msgStatus", null);
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        warningBtn: function () {
            var index = layer.open({
                title: "违章预警列表",
                type: 2,
                content: "./modules/warn/carillegalwarn.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        updatePassword: function () {
            var index = layer.open({
                title: "个人中心",
                type: 2,
                content: "./modules/sys/loginuser.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        reload: function () {

        },
        jumpToOrder: function (statusKey) {
            var timeVal = '';
            if (vm.carOperation.dateTimetype != 5) {
                timeVal = vm.carOperation.dateTimestart.split(' ')[0] + ' - ' + vm.carOperation.dateTimeend.split(' ')[0];
            }
            var param = {
                statusKey: statusKey,
                timeVal: timeVal
            };
            var index = layer.open({
                title: "车辆订单列表",
                type: 2,
                boxParams: param,
                content: "./modules/order/orderlistnew.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },

        jumpTorReceivable: function (statusKey) {
            //debugger
            var timeVal = '';
            if (vm.financeOperation.dateTimestart && vm.financeOperation.dateTimeend) {
                timeVal = vm.financeOperation.dateTimestart.split(' ')[0] + ' / ' + vm.financeOperation.dateTimeend.split(' ')[0];
            }
            /* if (vm.financeOperation.dateTimetype != 5){
                 timeVal = vm.financeOperation.dateTimestart + ' / ' + vm.financeOperation.dateTimeend;
             }*/
            var param = {
                statusKey: statusKey,
                timeVal: timeVal,
            };
            window.localStorage.setItem("statusKey", statusKey);
            window.localStorage.setItem("timeVal", timeVal);
            window.localStorage.setItem("dateTimetype", vm.financeOperation.dateTimetype);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: "./modules/financial/receivables.html?statusKey=" + statusKey,
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("timeVal", null);
                    window.localStorage.setItem("dateTimetype", null);
                }
            });
            layer.full(index);
        },
//收款金额跳转
        jumpTocollectionMoneyPage: function (statusKey) {
            var timeVal = '';
            if (vm.financeOperation.dateTimestart && vm.financeOperation.dateTimeend) {
                timeVal = vm.financeOperation.dateTimestart.split(' ')[0] + ' / ' + vm.financeOperation.dateTimeend.split(' ')[0];
            }
            /* if (vm.financeOperation.dateTimetype != 5){
                 timeVal = vm.financeOperation.dateTimestart + ' / ' + vm.financeOperation.dateTimeend;
             }*/
            var param = {
                statusKey: statusKey,
                timeVal: timeVal,
            };
            window.localStorage.setItem("statusKey", statusKey);
            window.localStorage.setItem("timeVal", timeVal);
            window.localStorage.setItem("dateTimetype", vm.financeOperation.dateTimetype);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: "./modules/financial/collection.html?statusKey=" + statusKey,
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("timeVal", null);
                    window.localStorage.setItem("dateTimetype", null);
                }
            });
            layer.full(index);
        },


        jumpTorCollection: function (statusKey) {
            var timeVal = vm.financeOperation.dateTimestart.split(' ')[0] + ' / ' + vm.financeOperation.dateTimeend.split(' ')[0];
            /*if (vm.financeOperation.dateTimetype != 5){

            }*/
            var param = {
                statusKey: statusKey,
                timeVal: timeVal
            };
            var index = layer.open({
                title: "实收款单列表",
                type: 2,
                boxParams: param,
                content: "./modules/financial/collection.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        // 跳转应退账款列表页
        jumpTorRefund: function (statusKey) {
            var timeVal='';
            if (vm.financeOperation.dateTimestart && vm.financeOperation.dateTimeend) {
                timeVal = vm.financeOperation.dateTimestart + ' / ' + vm.financeOperation.dateTimeend;
            }
            /* if (vm.financeOperation.dateTimetype != 5){
                 timeVal = vm.financeOperation.dateTimestart + ' / ' + vm.financeOperation.dateTimeend;
             }*/
            var type = vm.financeOperation.dateTimetype;
            var param = {
                statusKey: statusKey,
                timeVal: timeVal,
                dateTimetype: type
            };
            window.localStorage.setItem("statusKey", statusKey);
            window.localStorage.setItem("timeVal", timeVal);
            window.localStorage.setItem("dateTimetype", vm.financeOperation.dateTimetype);
            var index = layer.open({
                title: "退款单列表",
                type: 2,
                boxParams: param,
                content: "./modules/financial/shouldrefund.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("timeVal", null);
                    window.localStorage.setItem("dateTimetype", null);
                }
            });
            layer.full(index);
        },

        jumpToPayBill: function (statusKey) {
            var timeVal = '';
            if (vm.financeOperation.dateTimetype != 5 && vm.financeOperation.dateTimestart && vm.financeOperation.dateTimeend) {
                timeVal = vm.financeOperation.dateTimestart + ' / ' + vm.financeOperation.dateTimeend;
            }
            var type = vm.financeOperation.dateTimetype;
            var param = {
                statusKey: statusKey,
                timeVal: timeVal,
                dateTimetype: type
            };
            window.localStorage.setItem("statusKey", statusKey);
            window.localStorage.setItem("timeVal", timeVal);
            window.localStorage.setItem("dateTimetype", vm.financeOperation.dateTimetype);
            var index = layer.open({
                title: "应付单列表",
                type: 2,
                boxParams: param,
                content: "./modules/financial/paymentbill.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("timeVal", null);
                    window.localStorage.setItem("dateTimetype", null);
                }
            });
            layer.full(index);
        },
//跳转已付金额页面
        jumpTopaymentMoneyPage: function (statusKey) {
            var timeVal = '';
            if (vm.financeOperation.dateTimetype != 5 && vm.financeOperation.dateTimestart && vm.financeOperation.dateTimeend) {
                timeVal = vm.financeOperation.dateTimestart + ' / ' + vm.financeOperation.dateTimeend;
            }
            var type = vm.financeOperation.dateTimetype;
            var param = {
                statusKey: statusKey,
                timeVal: timeVal,
                dateTimetype: type
            };
            window.localStorage.setItem("statusKey", statusKey);
            window.localStorage.setItem("timeVal", timeVal);
            window.localStorage.setItem("dateTimetype", vm.financeOperation.dateTimetype);
            var index = layer.open({
                title: "已付单列表",
                type: 2,
                boxParams: param,
                content: "./modules/financial/collection.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("timeVal", null);
                    window.localStorage.setItem("dateTimetype", null);
                }
            });
            layer.full(index);
        }
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
    $('div[type="carOperation"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="carOperation"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.carOperation, "dateTime", '');
        getCarOperationCount(value, null);
    });

    $('div[type="financeOperation"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="financeOperation"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.financeOperation, "dateTime", '');
        getFinanceOperationCount(value, null);
    });
}

function initDate(laydate) {
    laydate.render({
        elem: '#carOperation_dateTime',
        type: 'date',
        range: true,
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="carOperation"]>div').removeClass('task-content-box-tab-child-active');
            vm.carOperation.dateTime = value;
            getCarOperationCount(null, value);
        }
    });

    laydate.render({
        elem: '#financeOperation_dateTime',
        type: 'date',
        range: true,
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="financeOperation"]>div').removeClass('task-content-box-tab-child-active');
            vm.financeOperation.dateTime = value;
            getFinanceOperationCount(null, value);
        }
    });
}

function initData() {
    getIllegalCount();
    getCarOperationCount(1, null);
    getFinanceOperationCount(1, null);
    getRiskAlert();
    getBpmData();
    getVehicleOperationData();
    getCustomerOperationData();
    getSysUserInfo();
    getUnreadMessageTotal();
    // getIllegalWarningTotal();
}
/**
 * 未读消息统计
 */
function getUnreadMessageTotal() {

    // $.get(baseURL + 'message/list/total',{
    //     Headers:{
    //         aaaaaa:111111
    //     },
    // }, function (r) {
    //     vm.unread = r.data.unread;
    // });
    $.ajax({
        headers: {
            // 'Access-Token': $.cookie('access_token')
            // 'cookie':sessionStorage.getItem('cookie')
        },
        url: baseURL + 'message/list/total',
        success: function (res) {
            console.log("hasgdjsagha:"+res.data.unread);
            vm.unread = res.data.unread;
        },
        error: function (err) {
        },
        complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数　
        }
    })
}

/**
 * 违章预警
 */
function getIllegalWarningTotal() {
    $.get(baseURL + 'car/carillegal/queryCountIllegal', function (r) {
        if ('undefined' != typeof (r.carIllegalCount)) {
            vm.violationWarning = r.carIllegalCount.illegalAllCount;
        }

    });
}

function getIllegalCount() {
    $.get(baseURL + 'workbench/workbench/illegalCount', function (r) {

        vm.violationWarning = r.violationWarning;
    });
}

function getCarOperationCount(type, daterange) {
    var param = initializeSearchDate(type, daterange);
    vm.carOperation.dateTimestart = param.start;
    vm.carOperation.dateTimeend = param.end;
    vm.carOperation.dateTimetype = type;
    $.get(baseURL + 'workbench/workbench/carOperationCount?startTime=' + param.start + '&endTime=' + param.end, function (r) {
        if (r.code == 0) {
            Vue.set(vm.carOperation, "useing", r.useing);
            Vue.set(vm.carOperation, "backing", r.backing);
            Vue.set(vm.carOperation, "transfering", r.transfering);
            Vue.set(vm.carOperation, "spareuseing", r.spareuseing);
            Vue.set(vm.carOperation, "deliverycar", r.deliverycar);
        }
    });
}

function getFinanceOperationCount(type, daterange) {
    var param = initializeSearchDate(type, daterange);
    vm.financeOperation.dateTimestart = param.start;
    vm.financeOperation.dateTimeend = param.end;
    vm.financeOperation.dateTimetype = type;
    if (type == 5) {
        vm.financeOperation.dateTimestart = '';
        vm.financeOperation.dateTimeend = '';
    }
    $.get(baseURL + 'workbench/workbench/financeOperationCount?startTime=' + vm.financeOperation.dateTimestart + '&endTime=' + vm.financeOperation.dateTimeend, function (r) {
        if (r.code == 0) {
            Vue.set(vm.financeOperation, "receivable", Number(r.receivables.receivable || 0).toFixed(2));
            Vue.set(vm.financeOperation, "received", Number(r.receivables.received || 0).toFixed(2));
            Vue.set(vm.financeOperation, "back", Number(r.refundData.back || 0).toFixed(2));
            Vue.set(vm.financeOperation, "retired", Number(r.refundData.retired || 0).toFixed(2));
            Vue.set(vm.financeOperation, "isPayAmount", Number(r.payBillData.isPayAmount || 0).toFixed(2));
            Vue.set(vm.financeOperation, "copyWothAmount", Number(r.payBillData.copyWothAmount || 0).toFixed(2));
            Vue.set(vm.financeOperation, "collectionMoney", Number(r.receivables.collectionMoney || 0).toFixed(2));
            Vue.set(vm.financeOperation, "returnMoney", Number(r.refundData.returnMoney || 0).toFixed(2));
            Vue.set(vm.financeOperation, "paymentMoney", Number(r.payBillData.paymentMoney || 0).toFixed(2));
        }
    });
}

function initializeSearchDate(type, daterange) {
    var param = {
        start: '',
        end: ''
    };
    if (type != null) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var day = now.getDate();
        var dayOfWeek = now.getDay();
        switch (parseInt(type)) {
            case 1: {
                param.start = formatDate(now) + ' 00:00:00';
                param.end = formatDate(now) + ' 23:59:59';
                break;
            }
            case 2: {
                param.start = getWeekStartDate(year, month, day, dayOfWeek) + ' 00:00:00';
                param.end = getWeekEndDate(year, month, day, dayOfWeek) + ' 23:59:59';
                break;
            }
            case 3: {
                param.start = year + '-' + formatDayNum(month + 1) + '-01 00:00:00';
                param.end = year + '-' + formatDayNum(month + 1) + '-' + getMonthLastday(year, month + 1) + ' 23:59:59';
                break;
            }
            case 4: {
                param.start = year + '-01-01 00:00:00';
                param.end = year + '-12-31 23:59:59';
                break;
            }
            case 5: {
                param.start = '1900-01-01 00:00:00';
                param.end = '2099-12-31 23:59:59';
                break;
            }
            default: { break; }
        }
    } else if (daterange != null) {
        var dateSelected = daterange.split(' - ');
        param.start = dateSelected[0] + ' 00:00:00';
        param.end = dateSelected[1] + ' 23:59:59';
    }
    return param;
}

function getMonthLastday(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12: {
            return 31;
        }
        case 4:
        case 6:
        case 9:
        case 11: {
            return 30;
        }
        case 2: {
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return 29;
            } else {
                return 28;
            }
        }
    }
}

function getWeekStartDate(year, month, day, dayOfWeek) {
    var weekStartDate = new Date(year, month, day - (dayOfWeek - 1));
    return formatDate(weekStartDate);
}

//获得本周末日期
function getWeekEndDate(year, month, day, dayOfWeek) {
    var weekEndDate = new Date(year, month, day + (7 - dayOfWeek));
    return formatDate(weekEndDate);
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return (year + '-' + formatDayNum(month) + '-' + formatDayNum(day));
}

function formatDayNum(num) {
    if (num < 10) {
        num = '0' + num;
    }
    return num;
}

/**
 * 流程信息
 */
function getBpmData() {
    $.get(baseURL + 'workbench/workbench/bpmData', function (r) {
        if (null != r.bpmData) {
            vm.bpmData = r.bpmData;
        }
    });
}

/**
 * 风险提醒
 */
function getRiskAlert() {
    $.get(baseURL + 'workbench/workbench/riskAlert', function (r) {
        if (null != r.riskAlert) {
            vm.riskAlert = r.riskAlert;
        }
    });

}

/**
 * 车辆运营数据
 */
function getVehicleOperationData() {
    $.get(baseURL + 'workbench/workbench/vehicleOperationData', function (r) {
        if (null != r.vehicleOperationData) {
            vm.vehicleOperationData = r.vehicleOperationData;
        }
    });
}

function getCustomerOperationData() {
    $.get(baseURL + 'workbench/workbench/customerOperationData', function (r) {
        if (null != r.customerOperationData) {
            vm.customerOperationData = r.customerOperationData;
        }
    });
}

function getSysUserInfo() {
    $.get(baseURL + 'workbench/workbench/sysuserinfo', function (r) {
        if (null != r.sysUserInfo) {
            vm.sysUserInfo = r.sysUserInfo;
            window.localStorage.setItem("sysUserInfo", JSON.stringify(r.sysUserInfo));
        }
    });
}

/**
 * 客户运营数据
 */

