$(function () {
    vm.detail(window.localStorage.getItem("maintenanceId"));
    var maintenanceNumber = window.localStorage.getItem("maintenanceNumber");
    var carNo = window.localStorage.getItem("carNo");


    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "carByRecordList",
            elem: '#carByRecordList',
            url: baseURL + 'maintenance/maintenancemanage/carMaintenceList',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
            where: { 'carId': window.localStorage.getItem("carId") },
            cols: [[
                { type: 'numbers', align: 'center', title: '序号' },
                {
                    field: '', align: "center", minWidth: 110, title: '操作', templet: function (d) {
                        return "<a class='layui-btn search-btn' onclick=editData(\'" + d.maintenanceNumber + "\',\'" + d.maintenanceId + "\')>编辑</a>";
                    }
                },
                {
                    field: 'maintenanceNumber', minWidth: 130, title: '保养创建单号', align: "center", templet: function (d) {
                        if (d.maintenanceNumber != null && d.maintenanceNumber != "") {
                            return d.maintenanceNumber;
                        } else {
                            return "--";
                        }
                    }
                },
                /*{field:'maintenanceStatusStr', minWidth:100, title: '保养状态',align:"center", templet:function (d) {
                        if(d.isDataRenewal!=null && d.isKileRenewal!=null){
                            if(d.isDataRenewal == 1 || d.isKileRenewal == 1){
                                return  "<span style='color: red'>待保养</span>";
                            } else if(d.isDataRenewal == 0 || d.isKileRenewal == 0){
                                return  "<span style='color: blue'>已保养</span>";
                            }
                        }else {
                            return "--";
                        }
                    }},*/
                /*{field:'customer', minWidth:100, title: '客户名称',align:"center", templet:function (d) {
                        if(d.customer!=null && d.customer!=""){
                            return  d.customer;
                        }else {
                            return "--";
                        }
                    }},
                {field:'orderNo', minWidth:100, title: '车辆订单号',align:"center", templet:function (d) {
                        if(d.orderNo!=null && d.orderNo!=""){
                            return  "<span style='color: blue'>"+d.orderNo+"</span>";
                        }else {
                            return "--";
                        }
                    }},
                {field:'vehicleUseStr', minWidth:100, title: '车辆用途',align:"center"},*/
                {
                    field: 'currentMile', minWidth: 150, title: '当前公里数/km', align: "center", templet: function (d) {
                        if (d.currentMile != null && d.currentMile != "") {
                            return d.currentMile;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'nextMile', minWidth: 150, title: '下次保养公里数/km', align: "center", templet: function (d) {
                        if (d.nextMile != null && d.nextMile != "") {
                            return d.nextMile;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'maintenanceDate', minWidth: 150, title: '本次保养时间', align: "center", templet: function (d) {
                        if (d.maintenanceDate != null) {
                            var date = new Date(d.maintenanceDate).format("yyyy-MM-dd");
                            return date;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'nextDate', minWidth: 150, title: '下次保养时间', align: "center", templet: function (d) {
                        if (d.nextDate != null) {
                            var date = new Date(d.nextDate).format("yyyy-MM-dd");
                            return date;
                        } else {
                            return "--";
                        }
                    }
                },

                {
                    field: 'serviceSite', minWidth: 100, title: '服务站', align: "center", templet: function (d) {
                        if (d.serviceSite != null && d.serviceSite != "") {
                            return d.serviceSite;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'maintenanceRemark', minWidth: 100, title: '保养备注', align: "center", templet: function (d) {
                        if (d.maintenanceRemark != null && d.maintenanceRemark != "") {
                            return d.maintenanceRemark;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'maintenanceRemark', minWidth: 300, title: '保养项目/费用（元）', align: "center", templet: function (d) {
                        if (d.maintenanceProject != null && d.maintenanceProject != "") {
                            return d.maintenanceProject;
                        } else {
                            return "--";
                        }
                    }
                },
                /* {field:'maintenanceFee', minWidth:180, title: '保养费用合计费用',align:"center", templet:function (d) {
                         if(d.maintenanceFee!=null && d.maintenanceFee!=""){
                             return  d.maintenanceFee;
                         }else {
                             return "--";
                         }
                     }},*/
                {
                    field: '', align: "center", minWidth: 110, title: '附件查看', templet: function (d) {
                        return "<a class='layui-btn search-btn' onclick=fileView(\'" + d.maintenanceNumber + "\',\'" + d.maintenanceId + "\')>查看</a>";
                    }
                },
                /*{
                    field: '', align: "center", title: '文件下载', templet: function (d) {
                        return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.maintenanceNumber+"\')>查看</a>";
                    }
                },*/
                {
                    field: 'operator', minWidth: 100, title: '创建人', align: "center", templet: function (d) {
                        if (d.operator != null && d.operator != "") {
                            return d.operator;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'timeCreate', minWidth: 120, title: '创建时间', align: "center", templet: function (d) {
                        if (d.timeCreate != null) {
                            var date = new Date(d.timeCreate).format("yyyy-MM-dd");
                            return date;
                        } else {
                            return "--";
                        }
                    }
                },
            ],],
            page: true,
            loading: true,
            limits: [10, 20, 50, 100],
            limit: 10,
            /* autoColumnWidth: {
                 init: true
             },
             done: function (res) {
                 soulTable.render(this);
             },*/
        });
    });


    layui.table.render({
        id: "insuranceTypeGrid",
        elem: '#insuranceTypeGrid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'maintenance/maintenancemanage/maintenanceRecordlist',
        where: { 'maintenanceNumber': maintenanceNumber },
        cols: [[
            { field: 'maintenanceItemName', align: "center", title: '保养项目' },
            { field: 'maintenanceItemFee', align: "center", title: '保养金额/元' },
        ]],
        page: false,
        limit: 500,
    });

    //应收罚款记录
    layui.table.render({
        id: "compulsoryInsurance3",
        elem: '#compulsoryInsurance3',
        url: baseURL + '/maintenance/insurancemanage/maintenanceFineList',
        where: {
            'carId': window.localStorage.getItem("carId"),
            'maintenanceId':window.localStorage.getItem("maintenanceId"),
            'maintenanceType': 2,
            'payType':1
        },
        cols: [[
            {
                field: 'payerName', title: '客户信息', align: "center", width: 200, templet: function (d) {
                    if(d.payerPhone != null && d.payerPhone != ''){
                        return d.payerName+" / "+d.payerPhone;
                    }else {
                        return d.payerName;
                    }
                }
            },
            {
                field: 'payAmount', title: '应收金额/元', align: "center", width: 200
            },
            {
                field: 'payTime', title: '应收日期', align: "center", templet: function (d) {
                    var txt = d.payTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                width: 200
            },
            {
                field: 'isGenerateBill', title: '生成应收账单', align: "center", width: 200, templet: function (d) {
                    if(d.isGenerateBill == 1){
                        return '是';
                    }else {
                        return '否';
                    }
                }
            },
            {
                field: 'createUserName', title: '创建人', align: "center", width: 200
            },
            {
                field: 'timeCreate', title: '创建时间', align: "center", width: 200
            },


        ]],
        page: true,
        limits: [5, 10, 20, 100],
        limit: 5
    });

    //应付罚款记录
    layui.table.render({
        id: "compulsoryInsurance4",
        elem: '#compulsoryInsurance4',
        url: baseURL + '/maintenance/insurancemanage/maintenanceFineList',
        where: {
            'carId': window.localStorage.getItem("carId"),
            'maintenanceId':window.localStorage.getItem("maintenanceId"),
            'maintenanceType': 2,
            'payType':2
        },
        cols: [[
            {
                field: 'payerName', title: '供应商信息', align: "center", width: 200, templet: function (d) {
                    if(d.payerPhone != null && d.payerPhone != ''){
                        return d.payerName+" / "+d.payerPhone;
                    }else {
                        return d.payerName;
                    }
                }
            },
            {
                field: 'payAmount', title: '应付金额/元', align: "center", width: 200
            },
            {
                field: 'payTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '请选择应还日期';
                    return txt;
                },
                width: 200
            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", width: 200, templet: function (d) {
                    if(d.isGenerateBill == 1){
                        return '是';
                    }else {
                        return '否';
                    }
                }
            },
            {
                field: 'createUserName', title: '创建人', align: "center", width: 200
            },
            {
                field: 'timeCreate', title: '创建时间', align: "center", width: 200
            },


        ]],
        page: true,
        limits: [5, 10, 20, 100],
        limit: 5
    });

    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#yslogid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: { 'businessNo': carNo, 'auditType': 15 },
        cols: [[
            {
                field: 'operatorName', align: "center", title: '操作人', templet: function (d) {
                    return isEmpty(d.operatorName);
                }
            },
            {
                field: 'memo', align: "center", title: '操作内容', templet: function (d) {
                    return isEmpty(d.memo);
                }
            },
            {
                field: 'operatorTime', align: "center", title: '操作时间', templet: function (d) {
                    return isEmpty(d.operatorTime);
                }
            }
        ]],
        page: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });

    // 订单记录
    layui.table.render({
        id: "orderList",
        elem: '#orderList',
        url: baseURL + 'maintenance/order/list',
        where: { 'carId': window.localStorage.getItem("carId"), 'type': 2 },
        cols: [[
            { field: '', fixed: 'left', align: "center", minWidth: 80, title: '序号', type: 'numbers' },
            {
                field: 'code', align: "center", minWidth: 150, title: '订单编号', templet: function (d) {
                    if (!isEmpty(d.code)) {
                        return '--'
                    }
                    return "<span style='color: blue' onclick = hrefCarOrderView(\'" + d.id + "\',\'" + d.code + "\')>" + isEmpty(d.code) + "</span>";
                }
            },
            {
                field: 'rentType', align: "center", title: '订单类型', templet: function (d) {
                    return getRentTypeStr(d.rentType);
                }
            },
            { field: 'customerName', minWidth: 150, align: "center", title: '客户名称' },
            { field: 'timeStartRent', minWidth: 150, align: "center", title: '租赁开始时间' },
            { field: 'timeFinishRent', minWidth: 150, align: "center", title: '租赁结束时间' },
            { field: 'timeDelivery', minWidth: 150, align: "center", title: '交车时间' },
            {
                field: 'timeReturn', align: "center", minWidth: 150, title: '实际退车时间', templet: function (d) {
                    return isEmpty(d.timeReturn);
                }
            },
            {
                field: 'deliveryCarMileage', align: "center", minWidth: 150, title: '交车公里数/km', templet: function (d) {
                    return isEmpty(d.deliveryCarMileage);
                }
            },
            {
                field: 'returnCarMileage', align: "center", minWidth: 150, title: '退车公里数/km', templet: function (d) {
                    return isEmpty(d.returnCarMileage);
                }
            },
            /* {field:'',align: "center",minWidth:120, title: '保养创建单号', templet:function (d) {
                     if(d.maintenanceList != null){
                         for(var i = 0 ; i <d.maintenanceList.length ;i++){
                             return '<span style=\'color: #269CFF\' onclick = hrefMaintanceView("'+d.maintenanceList[i].id+'")>'+isEmpty(d.maintenanceList[i].no)+'</span>'
                         }
                     } else {
                         return str;
                     }
                 }},*/
            {
                field: '', align: "center", minWidth: 450, title: '说明', templet: function (d) {
                    var str = '';
                    if (d.maintenanceList != null) {
                        for (var i = 0; i < d.maintenanceList.length; i++) {
                            var serial = i + 1;
                            if (d.maintenanceList[i].type != null) {
                                if (d.maintenanceList[i].type == 3) {
                                    if (d.maintenanceList[i].bizType == 1) {
                                        str += '<span style="color: red">' + serial + '、保养单号:'
                                            + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.maintenanceList[i].id + '")>' + isEmpty(d.maintenanceList[i].no) + '</span>' + '-' +
                                            '开始时间:' + d.maintenanceList[i].startTime + '至' + d.maintenanceList[i].endTime + '(' + d.maintenanceList[i].desc + ')</span><br>';
                                    } else {
                                        str += '<span style="color: red">' + serial + '、保养单号:'
                                            + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.maintenanceList[i].id + '")>' + isEmpty(d.maintenanceList[i].no) + '</span>' + '-' +
                                            '开始里程:' + d.maintenanceList[i].startMileage + '至' + d.maintenanceList[i].endMileage + '(' + d.maintenanceList[i].desc + ')</span><br>';
                                    }


                                    // str += '<span style="color: red">'+d.maintenanceList[i].desc+'</span><br>';
                                } else {
                                    if (d.maintenanceList[i].bizType == 1) {
                                        str += '<span style="color: black">' + serial + '、保养单号:'
                                            + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.maintenanceList[i].id + '")>' + isEmpty(d.maintenanceList[i].no) + '</span>' + '-' +
                                            '开始时间:' + d.maintenanceList[i].startTime + '至' + d.maintenanceList[i].endTime + '(' + d.maintenanceList[i].desc + ')</span><br>';
                                    } else {
                                        str += '<span style="color: black">' + serial + '、保养单号:'
                                            + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.maintenanceList[i].id + '")>' + isEmpty(d.maintenanceList[i].no) + '</span>' + '-' +
                                            '开始里程:' + d.maintenanceList[i].startMileage + '至' + d.maintenanceList[i].endMileage + '(' + d.maintenanceList[i].desc + ')</span><br>';
                                    }
                                }
                            } else {
                                if (d.maintenanceList[i].bizType == 1) {
                                    str += '<span style="color: black">' + serial + '、保养单号:'
                                        + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.maintenanceList[i].id + '")>' + isEmpty(d.maintenanceList[i].no) + '</span>' + '-' +
                                        '开始时间:' + d.maintenanceList[i].startTime + '至' + d.maintenanceList[i].endTime + '(' + d.maintenanceList[i].desc + ')</span><br>';
                                } else {
                                    str += '<span style="color: black">' + serial + '、保养单号:'
                                        + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.maintenanceList[i].id + '")>' + isEmpty(d.maintenanceList[i].no) + '</span>' + '-' +
                                        '开始里程:' + d.maintenanceList[i].startMileage + '至' + d.maintenanceList[i].endMileage + '(' + d.maintenanceList[i].desc + ')</span><br>';
                                }
                            }
                        }
                    } else {
                        str = "--";
                    }
                    return str;
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
    });

    layui.table.on('tool(carByRecordList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'syxdataEdit') {
            vm.dataEdit(data.maintenanceId, data.maintenanceNumber);
        }
    });

    layui.table.on('tool(jqxList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'jqxdataEdit') {
            vm.dataEdit(data.maintenanceId, data.maintenanceNumber);
        }
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        detailForm: true,
        //保险项目集合
        maintenanceTypeList: [],
        //保险单数据源
        maintenanceManage: {},
        //商业险种列表数据源
        maintenanceProjectList: [],
        detailsTabContentList: ['保养详情', '订单记录', '保养记录', '超保罚款', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '保养详情',
        byFileList: [],
        dataArr: [],
        inspectionPayIds: [],
        dataliat3: [{ num: 1, type: '王益', money: 200, date: '2023-06-03', bill: '是', remarks: '王二', creatTime: '2021-09-01 00:00:00' }],
        dataliat4: [{ num: 1, type: '王益', money: 200, date: '2023-06-03', bill: '是', remarks: '王二', creatTime: '2021-09-01 00:00:00' }],
    },
    computed: {
        getPayRecord: function () {
            for (let i = 0; i < this.inspectionPayIds.length; i++) {
                let payId = vm.maintenanceManage.inspectionPayId;
                if (this.inspectionPayIds[i].code == payId) {
                    return this.inspectionPayIds[i].value;
                }

            }
            // if (vm.maintenanceManage.inspectionPayId == 1) {
            //     return "客户";
            // } else if (vm.maintenanceManage.inspectionPayId == 2) {
            //     return "出租方";
            // } else if (vm.maintenanceManage.inspectionPayId == 3) {
            //     return "供应商";
            // }else{
            //     return "--";
            // }
        },
    },
    created: function () {
        //获取保养类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/" + "maintenanceType",
            contentType: "application/json",
            data: null,
            success: function (r) {
                //险种集合
                vm.maintenanceTypeList = r.dict;
            }
        });
        let _this = this;
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/" + "insurancePaymentTarget",
            contentType: "application/json",
            data: null,
            success: function (r) {
                _this.inspectionPayIds = r.dict;
            }
        });
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        reload: function () {

        },
        jumpToOrder: function (data) {
            if (data.orderType == 1) {
                $.get(baseURL + "order/order/info/" + data.orderCarId, function (r) {
                    r.order.orderCar.orderCarStatusStr = data.statusStr;
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
            } else if (data.orderType == 2) {
                $.get(baseURL + "cartransfer/sparecar/info/" + data.orderId, function (r) {
                    var index = layer.open({
                        title: "备用车详情",
                        type: 2,
                        content: tabBaseURL + "modules/order/sparecardetail.html",
                        success: function (layero, num) {
                            var iframe = window['layui-layer-iframe' + num];
                            iframe.vm.spareCarApply = r.spareCar;
                            iframe.vm.receivablesList = r.spareCar.receivablesList;
                            if (r.spareCar.isApply == 1) {
                                iframe.vm.payDayShow = true;
                            } else {
                                iframe.vm.payDayShow = false;
                            }
                            if (r.spareCar.spareCarStatus == 2) {
                                iframe.vm.returnCarBtn = true;
                            } else {
                                iframe.vm.returnCarBtn = false;
                            }
                            if (r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3) {
                                iframe.vm.returnCarForm = true;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息',
                                    '备用车退车信息'
                                ];
                            } else {
                                iframe.vm.returnCarForm = false;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息'
                                ];
                            }
                            iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                            iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                            iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                            iframe.vm.reloadData();
                            iframe.vm.initOperatorLog(id);
                        },
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }
        },
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 4) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '保养详情';
            } else if (param === 1) {
                this.detailsSupTabContentListActiveValue = '订单记录';
            } else if (param === 2) {
                this.detailsSupTabContentListActiveValue = '保养记录';
            } else if (param === 3) {
                this.detailsSupTabContentListActiveValue = '超保罚款';
            }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },


        // 取消
        cancel: function () {
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        // 查看详情
        detail: function (maintenanceId) {
            var type = "maintenanceView";//保养详情标识
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/maintenancemanage/info/" + maintenanceId + "/" + type,
                contentType: "application/json",
                data: null,
                success: function (r) {
                    if (r.code === 0) {
                        vm.maintenanceManage = r.maintenanceManage;
                        vm.maintenanceManage.kilometreWarning = window.localStorage.getItem("kilometreWarning");
                        vm.byFileList = vm.maintenanceManage.byFileList;
                        console.log(vm.byFileList);
                        // if(vm.byFileList.length == 0){
                        //     $("#fileModel").hide();
                        // }
                        Upload({
                            elid: 'fileModel',
                            edit: false,
                            fileLst: vm.byFileList
                        }).initView();
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },

        // 附件查看
        viewAccessory: function () {
            window.localStorage.setItem("objType", 20);
            window.localStorage.setItem("objId", vm.maintenanceManage.maintenanceNumber);
            window.localStorage.setItem("objCode", vm.maintenanceManage.maintenanceId);
            var index = layer.open({
                title: "维保管理 > 保养管理 > 查看保养详情 > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },

        reloadBySourceTable: function (carNo) {
            layui.config({
                base: '../../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            });
            layui.use(['form', 'element', 'table', 'soulTable'], function () {
                var soulTable = layui.soulTable;
                layui.table.render({
                    id: "carByRecordList",
                    elem: '#carByRecordList',
                    url: baseURL + 'maintenance/maintenancemanage/carMaintenceList',
                    //  toolbar: true,
                    //  defaultToolbar: ['filter'],
                    where: { 'carPlateNo': carNo },
                    cols: [[
                        { type: 'numbers', align: 'center', title: '序号' },
                        {
                            field: '', align: "center", title: '操作', templet: function (d) {
                                return "<a class='layui-btn search-btn' onclick=editData(\'" + d.maintenanceNumber + "\',\'" + d.maintenanceId + "\')>编辑</a>";
                            }
                        },
                        {
                            field: 'maintenanceNumber', minWidth: 100, title: '保养申请单', align: "center", templet: function (d) {
                                if (d.maintenanceNumber != null && d.maintenanceNumber != "") {
                                    return "<span style='color: blue'>" + d.maintenanceNumber + "</span>";
                                } else {
                                    return "--";
                                }
                            }
                        },
                        { field: 'maintenanceStatusStr', minWidth: 100, title: '保养状态', align: "center" },
                        {
                            field: 'customer', minWidth: 100, title: '客户名称', align: "center", templet: function (d) {
                                if (d.customer != null && d.customer != "") {
                                    return d.customer;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'orderNo', minWidth: 100, title: '车辆订单号', align: "center", templet: function (d) {
                                if (d.orderNo != null && d.orderNo != "") {
                                    return "<span style='color: blue'>" + d.orderNo + "</span>";
                                } else {
                                    return "--";
                                }
                            }
                        },
                        { field: 'vehicleUseStr', minWidth: 100, title: '车辆用途', align: "center" },
                        {
                            field: 'currentMile', minWidth: 100, title: '当前公里数', align: "center", templet: function (d) {
                                if (d.currentMile != null && d.currentMile != "") {
                                    return d.currentMile;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'nextMile', minWidth: 150, title: '下次保养公里数', align: "center", templet: function (d) {
                                if (d.nextMile != null && d.nextMile != "") {
                                    return d.nextMile;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'nextDate', minWidth: 150, title: '下次保养时间', align: "center", templet: function (d) {
                                if (d.nextDate != null) {
                                    var date = new Date(d.nextDate).format("yyyy-MM-dd");
                                    return date;
                                } else {
                                    return "--";
                                }
                            }
                        },

                        {
                            field: 'serviceSite', minWidth: 100, title: '服务站名称', align: "center", templet: function (d) {
                                if (d.serviceSite != null && d.serviceSite != "") {
                                    return d.serviceSite;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'maintenanceRemark', minWidth: 100, title: '保养备注', align: "center", templet: function (d) {
                                if (d.maintenanceRemark != null && d.maintenanceRemark != "") {
                                    return d.maintenanceRemark;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'maintenanceRemark', minWidth: 100, title: '保养项目', align: "center", templet: function (d) {
                                if (d.maintenanceProject != null && d.maintenanceProject != "") {
                                    return d.maintenanceProject;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'maintenanceFee', minWidth: 180, title: '保养费用合计费用', align: "center", templet: function (d) {
                                if (d.maintenanceFee != null && d.maintenanceFee != "") {
                                    return d.maintenanceFee;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: '', align: "center", title: '附件查看', templet: function (d) {
                                return "<a class='layui-btn search-btn' onclick=fileView(\'" + d.maintenanceNumber + "\',\'" + d.maintenanceId + "\')>查看</a>";
                            }
                        },
                        /*{
                            field: '', align: "center", title: '文件下载', templet: function (d) {
                                return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.maintenanceNumber+"\')>查看</a>";
                            }
                        },*/
                        {
                            field: 'operator', minWidth: 100, title: '记录人', align: "center", templet: function (d) {
                                if (d.operator != null && d.operator != "") {
                                    return d.operator;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'timeCreate', minWidth: 120, title: '记录时间', align: "center", templet: function (d) {
                                if (d.timeCreate != null) {
                                    var date = new Date(d.timeCreate).format("yyyy-MM-dd");
                                    return date;
                                } else {
                                    return "--";
                                }
                            }
                        },
                    ],],
                    page: true,
                    loading: true,
                    limits: [10, 20, 50, 100],
                    limit: 10,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function (res) {
                        soulTable.render(this);
                    },
                });
            });
        },

    }
});

// 附件查看
function fileView(maintenanceNumber, maintenanceId) {
    window.localStorage.setItem("objId", maintenanceNumber);
    window.localStorage.setItem("objCode", maintenanceId);
    window.localStorage.setItem("objType", 20);
    var index = layer.open({
        title: "维保管理 > 保养管理 > 查看保养详情 > 附件查看",
        type: 2,
        area: ['850px', '530px'],
        fixed: false, //不固定
        maxmin: true,
        content: tabBaseURL + 'modules/common/viewAccessories.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("objId", null);
            window.localStorage.setItem("objType", null);
            window.localStorage.setItem("objCode", null);
        }
    });
    layer.full(index);
}


function editData(maintenanceNumber, maintenanceId) {
    window.localStorage.setItem("maintenanceId", maintenanceId);
    window.localStorage.setItem("maintenanceNumber", maintenanceNumber);
    var index = layer.open({
        title: "维保管理 > 保养管理 > 编辑保养单",
        type: 2,
        content: tabBaseURL + 'modules/maintenance/maintenancemanageupdate.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("maintenanceId", maintenanceId);
            window.localStorage.setItem("maintenanceNumber", maintenanceNumber);
        }
    });
    layer.full(index);

}

// 查看订单详情
function hrefCarOrderView(orderCarId, code) {
    if(orderCarId != 'null' && code != 'null') {
        $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
            if (r.code != 0) {
                alert("获取订单数据异常！");
            }
            // 获取订单状态
            var statusStr = "";
            $.get(baseURL + "modules/insurancemanage/getCarOrderStatusStr/" + code, function (r) {
                if (r.order.statusStr != null) {
                    statusStr = r.order.statusStr;
                }
            });
            r.order.orderCar.orderCarStatusStr = statusStr;
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
}
// 查看保险详情
function hrefMaintanceView(id) {
    // 根据保单号查询保养相关数据，然后进入详情界面
    $.get(baseURL + "maintenance/maintenancemanage/getMaintenanceById/" + id, function (r) {
        if (r.data != null) {
            window.localStorage.setItem("maintenanceId", r.data.maintenanceId);
            window.localStorage.setItem("maintenanceNumber", r.data.maintenanceNumber);
            window.localStorage.setItem("carNo", r.data.carNo);
            window.localStorage.setItem("carId", r.data.carId);
            var index = layer.open({
                title: "维保管理 > 保养管理 > 查看保养单",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/maintenancemanagedetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("maintenanceId", null);
                    window.localStorage.setItem("maintenanceNumber", null);
                    window.localStorage.setItem("carNo", null);
                    window.localStorage.setItem("carId", null);
                    vm.reload();
                }
            });
            layer.full(index);
        } else {
            alert("查询保养数据不存在！");
        }
    });

}

