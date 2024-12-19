$(function () {
    var param = parent.layer.boxParams.boxParams;
    vm.detail(param.jqxId, param.syxId);
    var policyApplyNo = param.policyApplyNo;
    var commercialApplyNo = param.commercialApplyNo;
    if (!commercialApplyNo) {
        commercialApplyNo = policyApplyNo;
    }
    var carNo = param.carNo;
    var carId = param.carId;

    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "syxList",
            elem: '#syxList',
            url: baseURL + 'maintenance/insurancemanage/carSyxInsurancelist',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
            where: { 'carId': carId },
            cols: vm.attrCols,
            page: true,
            loading: true,
            limits: [5, 10, 20, 100],
            limit: 5,
            autoColumnWidth: {
                //init: true
            },
            done: function (res, curr, count) {
                // 获取动态商业险种列数据，追加到现有列表数据。
                /*
                for(var k = 0; k < res.data.length; ++k){
                    vm.insuranceManage.policyApplyNo = res.data[k].policyApplyNo;
                    $.ajax({
                        url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceCols",
                        type : "POST",
                        contentType: "application/json",
                        data: JSON.stringify(vm.insuranceManage)
                        , success: function(result) {
                            //处理数据，res.data
                            //生成动态列二维数组col
                            var ield = ["math", "chinese", "english"];
                            var subjectField = result.fileds;
                            var subjectTitle = result.titles;

                            for (var i = 0; i < subjectTitle.length; ++i) {
                                for (var j = 0; j < res.data.length; ++j) {
                                    res.data[j][subjectTitle[i]] = subjectTitle[i];
                                }
                            }

                            for (var i = 0; i < subjectTitle.length; ++i) {
                                //vm.attrCols[0].push({field:subjectField[i],title:subjectTitle[i], minWidth: 200, align:'center'});
                                vm.attrCols[0].splice(vm.attrCols[0].length, 0, {field: subjectTitle[i], title: subjectField[i],minWidth: 200, align:'center'});
                            }

                            layui.table.render({
                                elem: "#syxList"
                                , id: "syxList"
                                , data: res.data
                                , cols: vm.attrCols
                            });
                        }
                    });
                }*/


                soulTable.render(this);
            },
        });
    });

    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "cyxList",
            elem: '#cyxList',
            url: baseURL + 'maintenance/insurancemanage/carInsuranceCyxlist',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
            where: { 'carId': carId },
            cols: vm.cyxAttrCols,
            page: true,
            loading: true,
            limits: [5, 10, 20, 100],
            limit: 5,
            autoColumnWidth: {
                //init: true
            },
            done: function (res, curr, count) {
                soulTable.render(this);
            },
        });
    });

    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "jqxList",
            elem: '#jqxList',
            url: baseURL + 'maintenance/insurancemanage/carInsurancelist',
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
            where: { 'carId': carId },
            cols: [
                [
                    { type: 'numbers', align: 'center', title: '序号' },
                    // {
                    //     field: '',minWidth:130, align: "center", title: '操作', templet: function (d) {
                    //         return "<a class='layui-btn search-btn' onclick=editData(\'"+d.policyApplyNo+"\',\'"+d.insuranceManageId+"\')>编辑</a>";
                    //     }
                    // },
                    {
                        field: 'insuranceNo', minWidth: 130, title: '交强险保单号', align: 'center', templet: function (d) {
                            if (d.insuranceNo != null && d.insuranceNo != "") {
                                return d.insuranceNo;
                            } else {
                                return "--";
                            }
                        }
                    },
                    /*{field:'policyApplyNo', minWidth:100, title: '保单号',align:'center'},*/
                    /* {field:'confirmedStr', minWidth:100, title: '状态',align:'center'},*/
                    /*                    {field:'customerName', minWidth:100, title: '客户名称',align:'center',templet:function (d) {
                                                if(d.customerName!=null && d.customerName!=""){
                                                    return  d.customerName;
                                                }else {
                                                    return "--";
                                                }
                                            }},
                                        {field:'departureNo', minWidth:200, title: '车辆订单号',align:'center', templet:function (d) {
                                                if(d.departureNo!=null && d.departureNo!=""){
                                                    return  "<span style='color: blue'>"+d.departureNo+"</span>";
                                                }else {
                                                    return "--";
                                                }
                                            }},*/
                    /*{field:'vehicleUseStr', minWidth:100, title: '车辆用途',align:'center'},*/
                    {
                        field: 'insuranceCompanyName', minWidth: 150, title: '保险公司', align: 'center', templet: function (d) {
                            if (d.insuranceCompanyName != null && d.insuranceCompanyName != "") {
                                return d.insuranceCompanyName;
                            } else {
                                return "--";
                            }
                        }
                    },

                    {
                        field: 'insuranceStartTime', minWidth: 240, title: '交强险开始时间', align: 'center', templet: function (d) {
                            if (d.insuranceStartTime != null) {
                                var date = new Date(d.insuranceStartTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }
                        }
                    },
                    {
                        field: 'insuranceEndTime', minWidth: 240, title: '交强险结束时间', align: 'center', templet: function (d) {
                            if (d.insuranceEndTime != null) {
                                var date = new Date(d.insuranceEndTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }
                        }
                    },
                    {
                        field: 'insuranceAmount', minWidth: 100, title: '交强险费用', align: 'center', templet: function (d) {
                            if (d.insuranceAmount != null) {
                                return d.insuranceAmount;
                            } else {
                                return "--";
                            }
                        }
                    },
                    {
                        field: 'insuranceEndTime', minWidth: 100, title: '分期设置', align: 'center', templet: function (d) {
                            if (d.insuranceEndTime != null) {
                                return "<a class='layui-btn search-btn' onclick=tableView(\'" + d.policyApplyNo + "\',\'" + 1 + "\',\'" + d.carId + "\')>查看</a>";
                            } else {
                                return "--";
                            }
                        }
                    },
                    {
                        field: 'insurancePayName', minWidth: 100, title: '付款对象', align: 'center', templet: function (d) {
                            if (d.insurancePayName != null && d.insurancePayName != "") {
                                return d.insurancePayName;
                            } else {
                                return "--";
                            }
                        }
                    },

                    {
                        field: 'insuranceRemark', minWidth: 100, title: '备注', align: 'center', templet: function (d) {
                            if (d.insuranceRemark != null && d.insuranceRemark != "") {
                                return d.insuranceRemark;
                            } else {
                                return "--";
                            }
                        }
                    },
                    { field: 'bxPrescription', minWidth: 100, title: '保单时效', align: 'center' },
                    {
                        field: '', minWidth: 150, align: "center", title: '附件查看', templet: function (d) {
                            return "<a class='layui-btn search-btn' onclick=fileView(\'" + d.policyApplyNo + "\',\'" + 15 + "\',\'" + d.insuranceManageId + "\')>查看</a>";
                        }
                    },
                    /*{
                        field: '',minWidth:150, align: "center", title: '附件下载', templet: function (d) {
                            return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.policyApplyNo+"\',\'"+15+"\')>查看</a>";
                        }
                    },*/
                    { field: 'notesUser', minWidth: 100, title: '创建人', align: 'center' },
                    {
                        field: 'timeCreate', minWidth: 100, title: '创建时间', align: 'center', templet: function (d) {
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
            limits: [5, 10, 20, 100],
            limit: 5,
            /* autoColumnWidth: {
                 init: true
             },
             done: function (res) {
                 soulTable.render(this);
             },*/
        });
    });

    // 保险订单记录
    layui.table.render({
        id: "orderList",
        elem: '#orderList',
        url: baseURL + 'maintenance/order/list',
        where: { 'carId': carId, 'type': 1 },
        cols: [[
            { field: '', align: "center", minWidth: 80, title: '序号', type: 'numbers' },
            {
                field: 'code', align: "center", minWidth: 160, title: '订单编号', templet: function (d) {
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
                field: '', align: "center", minWidth: 450, title: '商业险保单号-商业险使用时间段', templet: function (d) {
                    var str = '';
                    if (d.commercialInsuranceList != null) {
                        for (var i = 0; i < d.commercialInsuranceList.length; i++) {
                            var serial = i + 1;
                            if (d.commercialInsuranceList[i].type == 1) {
                                str += '<span style="color: black">' + serial + '、商业险保单号:'
                                    + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.commercialInsuranceList[i].id + '")>' + isEmpty(d.commercialInsuranceList[i].no) + '</span>' + '-' +
                                    '开始时间:' + d.commercialInsuranceList[i].startTime + '至' + d.commercialInsuranceList[i].endTime + '(' + d.commercialInsuranceList[i].desc + ')</span><br>';
                            } else if (d.commercialInsuranceList[i].type == 2) {
                                str += '<span style="color: green">' + serial + '、商业险保单号:'
                                    + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.commercialInsuranceList[i].id + '")>' + isEmpty(d.commercialInsuranceList[i].no) + '</span>' + '-' +
                                    '开始时间:' + d.commercialInsuranceList[i].startTime + '至' + d.commercialInsuranceList[i].endTime + '(' + d.commercialInsuranceList[i].desc + ')</span><br>';
                            } else if (d.commercialInsuranceList[i].type == 3) {
                                str += '<span style="color: red">' + serial + '、商业险保单号:'
                                    + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.commercialInsuranceList[i].id + '")>' + isEmpty(d.commercialInsuranceList[i].no) + '</span>' + '-' +
                                    '开始时间:' + d.commercialInsuranceList[i].startTime + '至' + d.commercialInsuranceList[i].endTime + '(' + d.commercialInsuranceList[i].desc + ')</span><br>';
                            }
                        }
                    } else {
                        str = "--";
                    }
                    return str;
                }
            },
            {
                field: '', align: "center", minWidth: 450, title: '交强险保单号-交强险使用时间段', templet: function (d) {
                    var str = '';
                    if (d.compulsoryInsuranceList != null) {
                        for (var i = 0; i < d.compulsoryInsuranceList.length; i++) {
                            var serial = i + 1;
                            if (d.compulsoryInsuranceList[i].type == 1) {
                                str += '<span style="color: black">' + serial + '、交强险保单号:'
                                    + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.compulsoryInsuranceList[i].id + '")>' + isEmpty(d.compulsoryInsuranceList[i].no) + '</span>' + '-' +
                                    '开始时间:' + d.compulsoryInsuranceList[i].startTime + '至' + d.compulsoryInsuranceList[i].endTime + '(' + d.compulsoryInsuranceList[i].desc + ')</span><br>';
                            } else if (d.compulsoryInsuranceList[i].type == 2) {
                                str += '<span style="color: green">' + serial + '、交强险保单号:'
                                    + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.compulsoryInsuranceList[i].id + '")>' + isEmpty(d.compulsoryInsuranceList[i].no) + '</span>' + '-' +
                                    '开始时间:' + d.compulsoryInsuranceList[i].startTime + '至' + d.compulsoryInsuranceList[i].endTime + '(' + d.compulsoryInsuranceList[i].desc + ')</span><br>';
                            } else if (d.compulsoryInsuranceList[i].type == 3) {
                                str += '<span style="color: red">' + serial + '、交强险保单号:'
                                    + '<span style=\'color: blue\' onclick = hrefMaintanceView("' + d.compulsoryInsuranceList[i].id + '")>' + isEmpty(d.compulsoryInsuranceList[i].no) + '</span>' + '-' +
                                    '开始时间:' + d.compulsoryInsuranceList[i].startTime + '至' + d.compulsoryInsuranceList[i].endTime + '(' + d.compulsoryInsuranceList[i].desc + ')</span><br>';
                            }
                        }
                    } else {
                        return "<span style='color: red'>" + str + "</span>";
                    }
                    return str;
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
    });

    layui.table.render({
        id: "insuranceTypeGrid",
        elem: '#insuranceTypeGrid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'commercialinsurancerecord/commercialinsurancerecord/list',
        where: { 'policyApplyNo': commercialApplyNo },
        cols: [[
            //{title:'操作',width:300,templet:'#barTpl',fixed:"left",align:"center"},
            { field: 'commercialInsuranceName', align: "center", title: '商业险种' },
            { field: 'amountInsured', align: "center", title: '保额/万元' },
            { field: 'insuranceExpenses', align: "center", title: '保险费/元' }
        ]],
        page: false,
        //loading: false,
        limit: 500,
    });

    //停复保记录
    layui.table.render({
        id: "gridid",
        elem: '#stopResumelogId',
        url: baseURL + 'maintenance/insurancemanage/stopResumelist',
        where: { 'carId': carId },
        cols: [[
            {
                field: 'type', align: "center", title: '保险类型', templet: function (d) {
                    if (d.type == 1) {
                        return "<span'>交强险</span>";
                    } else if (d.type == 2) {
                        return "<span >商业险</span>";
                    } else {
                        return "<span>--</span>";
                    }
                }
            },
            {
                field: 'insuranceNo', align: "center", title: '保单号', templet: function (d) {
                    return isEmpty(d.insuranceNo);
                }
            },
            {
                field: 'insuranceCompanyName', align: "center", title: '保险公司', templet: function (d) {
                    return isEmpty(d.insuranceCompanyName);
                }
            },
            {
                field: 'insuranceStartTime', align: "center", title: '保险开始时间', templet: function (d) {
                    return isEmpty(d.insuranceStartTime);
                }
            },
            {
                field: 'stopResumeStatus', align: "center", title: '停/复保', templet: function (d) {
                    if (d.stopResumeStatus == 1) {
                        return "<span'>停保</span>";
                    } else if (d.stopResumeStatus == 2) {
                        return "<span >复保</span>";
                    } else {
                        return "<span>--</span>";
                    }
                }
            },
            {
                field: 'stopResumeStr', align: "center", title: '停/复保时间', templet: function (d) {
                    return isEmpty(d.stopResumeStr);
                }
            },
            {
                field: 'remark', align: "center", title: '说明', templet: function (d) {
                    return isEmpty(d.remark);
                }
            },
            {
                field: 'voucher', align: "center", title: '凭证附件', templet: function (d) {
                    var objType = null;
                    if (d.stopResumeStatus == 1) {
                        if (d.type == 1) {
                            objType = 51;
                        } else if (d.type == 2) {
                            objType = 52;
                        }
                    } else if (d.stopResumeStatus == 2) {
                        if (d.type == 1) {
                            objType = 53;
                        } else if (d.type == 2) {
                            objType = 54;
                        }
                    }
                    if (objType == null) {
                        return "--";
                    }
                    return "<a class='layui-btn search-btn' onclick=fileView(\'" + d.id + "\',\'" + objType + "\',\'" + d.insuranceManageId + "\')>查看</a>";
                }
            },
            {
                field: 'operator', align: "center", title: '操作人', templet: function (d) {
                    return isEmpty(d.operator);
                }
            },
            {
                field: 'operationTime', align: "center", title: '操作时间', templet: function (d) {
                    return isEmpty(d.operationTime);
                }
            }
        ]],
        page: true,
        limits: [5, 10, 20, 100],
        limit: 5
    });


    //应收罚款记录
    layui.table.render({
        id: "compulsoryInsurance3",
        elem: '#compulsoryInsurance3',
        url: baseURL + '/maintenance/insurancemanage/maintenanceFineList',
        where: {
            'carId': carId,
            'maintenanceId': param.jqxId,
            'maintenanceType': 1,
            'payType': 1
        },
        cols: [[
            {
                field: 'payerName', title: '客户信息', align: "center", width: 200, templet: function (d) {
                    if (d.payerPhone != null && d.payerPhone != '') {
                        return d.payerName + " / " + d.payerPhone;
                    } else {
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
                    if (d.isGenerateBill == 1) {
                        return '是';
                    } else {
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
            'carId': carId,
            'maintenanceId': param.jqxId,
            'maintenanceType': 1,
            'payType': 2
        },
        cols: [[
            {
                field: 'payerName', title: '供应商信息', align: "center", width: 200, templet: function (d) {
                    if (d.payerPhone != null && d.payerPhone != '') {
                        return d.payerName + " / " + d.payerPhone;
                    } else {
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
                    if (d.isGenerateBill == 1) {
                        return '是';
                    } else {
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
        where: { 'businessNo': carNo, 'auditType': 7 },
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
        limits: [5, 10, 20, 100],
        limit: 5
    });

    layui.table.on('tool(syxList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'syxdataEdit') {
            vm.dataEdit(data.insuranceManageId, data.policyApplyNo);
        }
    });

    layui.table.on('tool(jqxList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'jqxdataEdit') {
            vm.dataEdit(data.insuranceManageId, data.policyApplyNo);
        }
    });

    layui.table.on('tool(attachmentList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'showDoc') {
            vm.showDoc(data.url, data.nameAccessory);
        } else if (layEvent === 'downDoc') {
            vm.downDoc(data.url, data.nameAccessory);
        }
    });

    layui.table.on('tool(jqxattachmentList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'showDoc') {
            vm.showDoc(data.url, data.nameAccessory);
        } else if (layEvent === 'downDoc') {
            vm.downDoc(data.url, data.nameAccessory);
        }
    });
    // 交强险费用表单
    gridTable1 = layui.table.render({
        id: "compulsoryInsurance",
        elem: '#compulsoryInsurance',
        minWidth: 150,
        data: vm.dataliat,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center" },
            {
                field: 'payableAmount', title: '应付金额/元',minWidth: 100, align: "center"
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '';
                    return txt;
                },

            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    if (d.isGenerateBill == 1) {
                        return "是";
                    } else {
                        return "否";
                    }
                }

            },
            {
                field: 'remark', title: '备注', align: "center"
            },

        ]],
        page: false,
        loading: false,
        limit: 500,

    });
    // 承运险费用表单
    gridTable2 = layui.table.render({
        id: "compulsoryInsurance1",
        elem: '#compulsoryInsurance1',
        minWidth: 150,
        data: vm.dataliat1,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center" },
            {
                field: 'payableAmount', title: '应付金额/元',minWidth: 100,  align: "center"
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '';
                    return txt;
                },

            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    if (d.isGenerateBill == 1) {
                        return "是";
                    } else {
                        return "否";
                    }
                }

            },
            {
                field: 'remark', title: '备注', align: "center"
            },
        ]],
        page: false,
        loading: false,
        limit: 500,

    });
    // 承运险费用表单
    gridTable3 = layui.table.render({
        id: "compulsoryInsurance2",
        elem: '#compulsoryInsurance2',
        minWidth: 150,
        data: vm.dataliat2,
        cols: [[

            { field: 'feeName', title: '账单类型', align: "center" },
            {
                field: 'payableAmount', title: '应付金额/元',minWidth: 100, align: "center"
            },
            {
                field: 'payableTime', title: '应付日期', align: "center", templet: function (d) {
                    var txt = d.payableTime;
                    if ((/\d+/).test(txt)) {
                        txt = isEmpty(dateFormatYMD(txt));
                    } else txt = '';
                    return txt;
                },

            },
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    if (d.isGenerateBill == 1) {
                        return "是";
                    } else {
                        return "否";
                    }
                }

            },
            {
                field: 'remark', title: '备注', align: "center"
            },
        ]],
        page: false,
        loading: false,
        limit: 500,

    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        detailForm: true,
        insuranceManage: {},
        //交强险保险公司下拉列表数据源
        //compulsoryInsuranceList:[],
        //商业险保险公司下拉列表数据源
        //commercialInsuranceList:[],
        //险种集合
        insuranceTypeList: [],
        //保险单数据源
        insuranceManage: {},
        //商业险种列表数据源
        commercialInsuranceTableList: [],
        detailsTabContentList: ['保险详情', '订单记录', '购买记录', '超险罚款', '停复保记录', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '保险详情',
        jqxFileList: [],
        syxxFileList: [],
        cyxxFileList: [],
        dataArr: [],
        attrCols: [[
            { type: 'numbers', align: 'center', title: '序号' },
            // {
            //     field: '', align: "center", minWidth:130,title: '操作', templet: function (d) {
            //         return "<a class='layui-btn search-btn' onclick=editData(\'"+d.policyApplyNo+"\',\'"+d.insuranceManageId+"\')>编辑</a>";
            //     }
            // },
            /*{field:'policyApplyNo', minWidth:100, title: '保单号',align:'center'},*/
            {
                field: 'insuranceNo', minWidth: 130, title: '保单号', align: 'center', templet: function (d) {
                    if (d.insuranceNo != null && d.insuranceNo != "") {
                        return d.insuranceNo;
                    } else {
                        return "--";
                    }
                }
            },
            /*{field:'confirmedStr', minWidth:100, title: '状态',align:'center'},*/
            /*            {field:'customerName', minWidth:100, title: '客户名称',align:'center',templet:function (d) {
                                if(d.customerName!=null && d.customerName!=""){
                                    return  d.customerName;
                                }else {
                                    return "--";
                                }
                            }},
                        {field:'departureNo', minWidth:220, title: '车辆订单号',align:'center', templet:function (d) {
                                if(d.departureNo!=null && d.departureNo!=""){
                                    return  "<span style='color: blue'>"+d.departureNo+"</span>";
                                }else {
                                    return "--";
                                }
                            }},
                        {field:'vehicleUseStr', minWidth:100, title: '车辆用途',align:'center'},*/
            {
                field: 'insuranceCompanyName', minWidth: 150, title: '保险公司', align: 'center', templet: function (d) {
                    if (d.insuranceCompanyName != null && d.insuranceCompanyName != "") {
                        return d.insuranceCompanyName;
                    } else {
                        return "--";
                    }
                }
            },

            {
                field: 'insuranceStartTime', minWidth: 200, title: '商业险开始时间', align: 'center', templet: function (d) {
                    if (d.insuranceStartTime != null) {
                        var date = new Date(d.insuranceStartTime).format("yyyy-MM-dd");
                        return date;
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insuranceEndTime', minWidth: 200, title: '商业险结束时间', align: 'center', templet: function (d) {
                    if (d.insuranceEndTime != null) {
                        var date = new Date(d.insuranceEndTime).format("yyyy-MM-dd");
                        return date;
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insuranceTypeName', minWidth: 260, title: '商业险种/保额(万)/保费(元)', align: 'center', templet: function (d) {
                    if (d.insuranceTypeName != null && d.insuranceTypeName != "") {
                        return d.insuranceTypeName;
                    } else {
                        return "--";
                    }
                }
            },
            { field: 'insuranceAmount', minWidth: 150, title: '商业险合计金额', align: 'center' },
            {
                field: 'insurancePayName', minWidth: 100, title: '付款对象', align: 'center', templet: function (d) {
                    if (d.insurancePayName != null && d.insurancePayName != "") {
                        return d.insurancePayName;
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insuranceEndTime', minWidth: 100, title: '分期设置', align: 'center', templet: function (d) {
                    if (d.insuranceEndTime != null) {
                        return "<a class='layui-btn search-btn' onclick=tableView1(\'" + d.policyApplyNo + "\',\'" + 2 + "\',\'" + d.carId + "\')>查看</a>";
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insuranceRemark', minWidth: 100, title: '备注', align: 'center', templet: function (d) {
                    if (d.insuranceRemark != null && d.insuranceRemark != "") {
                        return d.insuranceRemark;
                    } else {
                        return "--";
                    }
                }
            },
            { field: 'bxPrescription', minWidth: 100, title: '保单时效', align: 'center' },

            {
                field: '', minWidth: 150, align: "center", title: '附件查看', templet: function (d) {
                    return "<a class='layui-btn search-btn' onclick=fileView(\'" + d.policyApplyNo + "\',\'" + 12 + "\',\'" + d.insuranceManageId + "\')>查看</a>";
                }
            },
            { field: 'notesUser', minWidth: 100, title: '创建人', align: 'center' },
            {
                field: 'timeCreate', minWidth: 100, title: '创建时间', align: 'center', templet: function (d) {
                    if (d.timeCreate != null) {
                        var date = new Date(d.timeCreate).format("yyyy-MM-dd");
                        return date;
                    } else {
                        return "--";
                    }
                }
            },
        ]],
        cyxAttrCols: [[
            { type: 'numbers', align: 'center', title: '序号' },
            {
                field: 'insuranceNo', minWidth: 130, title: '保单号', align: 'center', templet: function (d) {
                    if (d.insuranceNo != null && d.insuranceNo != "") {
                        return d.insuranceNo;
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insuranceCompanyName', minWidth: 150, title: '保险公司', align: 'center', templet: function (d) {
                    if (d.insuranceCompanyName != null && d.insuranceCompanyName != "") {
                        return d.insuranceCompanyName;
                    } else {
                        return "--";
                    }
                }
            },

            {
                field: 'insuranceStartTime', minWidth: 200, title: '承运险开始时间', align: 'center', templet: function (d) {
                    if (d.insuranceStartTime != null) {
                        var date = new Date(d.insuranceStartTime).format("yyyy-MM-dd");
                        return date;
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insuranceEndTime', minWidth: 200, title: '承运险结束时间', align: 'center', templet: function (d) {
                    if (d.insuranceEndTime != null) {
                        var date = new Date(d.insuranceEndTime).format("yyyy-MM-dd");
                        return date;
                    } else {
                        return "--";
                    }
                }
            },

            { field: 'insuranceAmount', minWidth: 150, title: '承运险费用', align: 'center' },
            {
                field: 'insuranceEndTime', minWidth: 100, title: '分期设置', align: 'center', templet: function (d) {
                    if (d.insuranceEndTime != null) {
                        return "<a class='layui-btn search-btn' onclick=tableView2(\'" + d.policyApplyNo + "\',\'" + 3 + "\',\'" + d.carId + "\')>查看</a>";
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insurancePayName', minWidth: 100, title: '付款对象', align: 'center', templet: function (d) {
                    if (d.insurancePayName != null && d.insurancePayName != "") {
                        return d.insurancePayName;
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'insuranceRemark', minWidth: 100, title: '备注', align: 'center', templet: function (d) {
                    if (d.insuranceRemark != null && d.insuranceRemark != "") {
                        return d.insuranceRemark;
                    } else {
                        return "--";
                    }
                }
            },
            { field: 'bxPrescription', minWidth: 100, title: '保单时效', align: 'center' },

            {
                field: '', minWidth: 150, align: "center", title: '附件查看', templet: function (d) {
                    return "<a class='layui-btn search-btn' onclick=fileView(\'" + d.policyApplyNo + "\',\'" + 49 + "\',\'" + d.insuranceManageId + "\')>查看</a>";
                }
            },
            { field: 'notesUser', minWidth: 100, title: '创建人', align: 'center' },
            {
                field: 'timeCreate', minWidth: 100, title: '创建时间', align: 'center', templet: function (d) {
                    if (d.timeCreate != null) {
                        var date = new Date(d.timeCreate).format("yyyy-MM-dd");
                        return date;
                    } else {
                        return "--";
                    }
                }
            },
        ]],
        dataliat: [],
        dataliat1: [],
        dataliat2: [],
        dataliat3: [{ num: 1, type: '王益', money: 200, date: '2023-06-03', bill: '是', remarks: '王二', creatTime: '2021-09-01 00:00:00' }],
        dataliat4: [{ num: 1, type: '王益', money: 200, date: '2023-06-03', bill: '是', remarks: '王二', creatTime: '2021-09-01 00:00:00' }],
        timeList: [],
        showInsurance: false,
        showInsurance1: false,
        showInsurance2: false,
    },
    computed: {
        brandNameAndModelName: {
            get: function () {
                if (this.insuranceManage.brandName != null && this.insuranceManage.modelName != null) {
                    return this.insuranceManage.brandName + "/" + this.insuranceManage.modelName;
                } else if (this.insuranceManage.brandName != null && this.insuranceManage.modelName == null) {
                    return this.insuranceManage.brandName
                } else if (this.insuranceManage.brandName == null && this.insuranceManage.modelName != null) {
                    return this.insuranceManage.modelName
                } else {
                    return "--";
                }
            }
        }
    },
    watch: {
        insuranceManage: {
            handler(newValue, oldValue) {
                this.insuranceManage = newValue
            },
            deep: true
        }
    },
    created: function () {

        //初始化加载保险公司下拉列表
        /*        $.ajax({
                    type: "POST",
                    url: baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList",
                    contentType: "application/json",
                    data:null,
                    success: function(r){
                        //交强险
                        vm.compulsoryInsuranceList= r.compulsoryInsuranceList;
                        //商业险
                        vm.commercialInsuranceList= r.commercialInsuranceList;
                    }
                });*/
        //获取险种类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/" + "insuranceType",
            contentType: "application/json",
            data: null,
            success: function (r) {
                //险种集合
                vm.insuranceTypeList = r.dict;
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
                                    '备用车退车信息',
                                    '还款明细',
                                    '操作记录'
                                ];
                            } else {
                                iframe.vm.returnCarForm = false;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息',
                                    '还款明细',
                                    '操作记录'
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
        //修改
        dataEdit: function (insuranceManageId, policyApplyNo) {
            window.localStorage.setItem("insuranceManageId", insuranceManageId);
            window.localStorage.setItem("policyApplyNo", policyApplyNo);
            var index = layer.open({
                title: "维保管理 > 保险管理 > 编辑保险单",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/insurancemanageedit.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("insuranceManageId", insuranceManageId);
                    window.localStorage.setItem("policyApplyNo", policyApplyNo);
                }
            });
            layer.full(index);
        },
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 2) {
                this.detailsSupTabContentListActiveValue = '购买记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '保险详情';
            } else if (param === 1) {
                this.detailsSupTabContentListActiveValue = '订单记录';
            } else if (param === 3) {
                this.detailsSupTabContentListActiveValue = '停复保记录';
            } else if (param === 4) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 5) {
                this.detailsSupTabContentListActiveValue = '超险罚款';
            }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },

        attachment: function (policyApplyNo) {
            layui.table.render({
                id: "attachmentList",
                elem: '#attachmentList',
                url: baseURL + 'maintenance/record/attachment',
                where: { id: policyApplyNo, type: "11" },
                cols: [[
                    { field: 'nameAccessory', title: '附件名称' },
                    { field: 'timeCreate', title: '提交时间' },
                    {
                        field: 'operationName', title: '提交人', templet: function (d) {
                            return isEmpty(d.operationName);
                        }
                    },
                    { title: '操作', templet: '#operation', fixed: "right", align: "center" },
                ]],
                page: true,
                limits: [5, 10, 20, 100],
                limit: 5,
            });
            var index = layer.open({
                title: '附件信息查看',
                type: 1,
                area: ['500px', '300px'],
                content: $("#attachmentDiv"),
                end: function () {
                    $("#attachmentDiv").hide();
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        jqxattachment: function (policyApplyNo) {
            console.log(policyApplyNo);
            layui.table.render({
                id: "jqxattachmentList",
                elem: '#jqxattachmentList',
                url: baseURL + 'maintenance/record/attachment',
                where: { id: policyApplyNo, type: "12" },
                cols: [[
                    { field: 'nameAccessory', title: '附件名称' },
                    { field: 'timeCreate', title: '提交时间' },
                    {
                        field: 'operationName', title: '提交人', templet: function (d) {
                            return isEmpty(d.operationName);
                        }
                    },
                    { title: '操作', templet: '#operation', fixed: "right", align: "center" },
                ]],
                page: true,
                limits: [5, 10, 20, 100],
                limit: 5,
            });
            var index = layer.open({
                title: '附件信息查看',
                type: 1,
                area: ['500px', '300px'],
                content: $("#jqxattachmentDiv"),
                end: function () {
                    $("#jqxattachmentDiv").hide();
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        showDoc: function (fileName, url) {
            if (viewer != null) {
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL + url,
                    title: fileName
                }
            ], {
                appendTo: 'body',
                zIndex: 99891018
            });
        },
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri=' + url + "&fileName=" + fileName;
            window.location.href = uri;
        },


        // 取消
        cancel: function () {
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        // 查看详情
        detail: function (jqxId, syxId) {
            var type = "insuranceXq";// 续保标识
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/info",
                data: {
                    jqxId: isEmptyReturnNull(jqxId),
                    syxId: isEmptyReturnNull(syxId),
                    type: type
                },
                success: function (r) {
                    if (r.code === 0) {
                        vm.insuranceManage = r.insuranceManage;
                        vm.jqxFileList = vm.insuranceManage.jqxFileList;
                        // if(vm.jqxFileList.length == 0){
                        //     $("#jqxmodel").hide();
                        // }
                        Upload({
                            elid: 'jqxmodel',
                            edit: false,
                            fileLst: vm.jqxFileList
                        }).initView();
                        vm.syxxFileList = vm.insuranceManage.syxxFileList;
                        // if(vm.syxxFileList.length == 0){
                        //     $("#syxmodel").hide();
                        // }
                        Upload({
                            elid: 'syxmodel',
                            edit: false,
                            fileLst: vm.syxxFileList
                        }).initView();
                        vm.cyxxFileList = vm.insuranceManage.cyxxFileList;
                        Upload({
                            elid: 'cyxmodel',
                            edit: false,
                            fileLst: vm.cyxxFileList
                        }).initView();
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        // 附件查看
        viewAccessory: function (objType) {
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("objId", vm.insuranceManage.policyApplyNo);
            window.localStorage.setItem("objCode", vm.insuranceManage.insuranceManageId);
            var index = layer.open({
                title: "维保管理 > 保险管理 > 查看保险详情 > 附件查看",
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

        reloadJQXSourceTable: function (carId) {
            layui.table.render({
                id: "jqxList",
                elem: '#jqxList',
                url: baseURL + 'maintenance/insurancemanage/carInsurancelist',
                //  toolbar: true,
                //  defaultToolbar: ['filter'],
                where: { 'carId': carId },
                cols: [
                    [
                        { type: 'numbers', align: 'center', title: '序号' },
                        // {
                        //     field: '',minWidth:130, align: "center", title: '操作', templet: function (d) {
                        //         return "<a class='layui-btn search-btn' onclick=editData(\'"+d.policyApplyNo+"\',\'"+d.insuranceManageId+"\')>编辑</a>";
                        //     }
                        // },
                        {
                            field: 'insuranceNo', minWidth: 130, title: '交强险保单号', align: 'center', templet: function (d) {
                                if (d.insuranceNo != null && d.insuranceNo != "") {
                                    return d.insuranceNo;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        /*{field:'policyApplyNo', minWidth:100, title: '保单号',align:'center'},*/
                        /* {field:'confirmedStr', minWidth:100, title: '状态',align:'center'},*/
                        /*                    {field:'customerName', minWidth:100, title: '客户名称',align:'center',templet:function (d) {
                                                    if(d.customerName!=null && d.customerName!=""){
                                                        return  d.customerName;
                                                    }else {
                                                        return "--";
                                                    }
                                                }},
                                            {field:'departureNo', minWidth:200, title: '车辆订单号',align:'center', templet:function (d) {
                                                    if(d.departureNo!=null && d.departureNo!=""){
                                                        return  "<span style='color: blue'>"+d.departureNo+"</span>";
                                                    }else {
                                                        return "--";
                                                    }
                                                }},*/
                        /*{field:'vehicleUseStr', minWidth:100, title: '车辆用途',align:'center'},*/
                        {
                            field: 'insuranceCompany', minWidth: 150, title: '保险公司', align: 'center', templet: function (d) {
                                if (d.insuranceCompany != null && d.insuranceCompany != "") {
                                    return d.insuranceCompany;
                                } else {
                                    return "--";
                                }
                            }
                        },

                        {
                            field: 'insuranceStartTime', minWidth: 240, title: '交强险开始时间', align: 'center', templet: function (d) {
                                if (d.insuranceStartTime != null) {
                                    var date = new Date(d.insuranceStartTime).format("yyyy-MM-dd");
                                    return date;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'insuranceEndTime', minWidth: 240, title: '交强险结束时间', align: 'center', templet: function (d) {
                                if (d.insuranceEndTime != null) {
                                    var date = new Date(d.insuranceEndTime).format("yyyy-MM-dd");
                                    return date;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'insuranceAmount', minWidth: 100, title: '交强险费用', align: 'center', templet: function (d) {
                                if (d.insuranceAmount != null) {
                                    return d.insuranceAmount;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        {
                            field: 'insurancePayName', minWidth: 100, title: '付款对象', align: 'center', templet: function (d) {
                                if (d.insurancePayName != null && d.insurancePayName != "") {
                                    return d.insurancePayName;
                                } else {
                                    return "--";
                                }
                            }
                        },

                        {
                            field: 'insuranceRemark', minWidth: 100, title: '备注', align: 'center', templet: function (d) {
                                if (d.insuranceRemark != null && d.insuranceRemark != "") {
                                    return d.insuranceRemark;
                                } else {
                                    return "--";
                                }
                            }
                        },
                        { field: 'bxPrescription', minWidth: 100, title: '保单时效', align: 'center' },
                        {
                            field: '', minWidth: 150, align: "center", title: '附件查看', templet: function (d) {
                                return "<a class='layui-btn search-btn' onclick=fileView(\'" + d.policyApplyNo + "\',\'" + 15 + "\',\'" + d.insuranceManageId + "\')>查看</a>";
                            }
                        },
                        /*{
                            field: '',minWidth:150, align: "center", title: '附件下载', templet: function (d) {
                                return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.policyApplyNo+"\',\'"+15+"\')>查看</a>";
                            }
                        },*/
                        { field: 'notesUser', minWidth: 100, title: '创建人', align: 'center' },
                        {
                            field: 'timeCreate', minWidth: 100, title: '创建时间', align: 'center', templet: function (d) {
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
                limits: [5, 10, 20, 100],
                limit: 5,
                autoColumnWidth: {
                    //init: true
                },
                done: function (res) {
                    //soulTable.render(this);
                },
            });
        },

        reloadSYXSourceTable: function (carId) {
            layui.table.render({
                id: "syxList",
                elem: '#syxList',
                url: baseURL + 'maintenance/insurancemanage/carSyxInsurancelist',
                //  toolbar: true,
                //  defaultToolbar: ['filter'],
                where: { 'carId': carId },
                cols: vm.attrCols,
                page: true,
                loading: true,
                limits: [5, 10, 20, 100],
                limit: 5,
                autoColumnWidth: {
                    //init: true
                },
                done: function (res, curr, count) {

                },
            });
        },

        reloadCYXSourceTable: function (carId) {
            layui.table.render({
                id: "cyxList",
                elem: '#cyxList',
                url: baseURL + 'maintenance/insurancemanage/carCyxInsurancelist',
                //  toolbar: true,
                //  defaultToolbar: ['filter'],
                where: { 'carId': carId },
                cols: vm.cyxAttrCols,
                page: true,
                loading: true,
                limits: [5, 10, 20, 100],
                limit: 5,
                autoColumnWidth: {
                    //init: true
                },
                done: function (res, curr, count) {

                },
            });
        },

    }
});

// 附件查看
function fileView(policyApplyNo, type, insuranceManageId) {
    window.localStorage.setItem("objId", policyApplyNo);
    window.localStorage.setItem("objCode", insuranceManageId);
    window.localStorage.setItem("objType", type);
    var index = layer.open({
        title: "维保管理 > 保险管理 > 查看保险详情 > 附件查看",
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

function editData(policyApplyNo, insuranceManageId) {
    window.localStorage.setItem("insuranceManageId", insuranceManageId);
    window.localStorage.setItem("policyApplyNo", policyApplyNo);
    var index = layer.open({
        title: "维保管理 > 保险管理 > 编辑保险单",
        type: 2,
        content: tabBaseURL + 'modules/maintenance/insurancemanageupdate.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("insuranceManageId", insuranceManageId);
            window.localStorage.setItem("policyApplyNo", policyApplyNo);
        }
    });
    layer.full(index);

}

// 查看订单详情
function hrefCarOrderView(orderCarId, code) {
    if(orderCarId != 'null' && code != 'null'){
        $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
            if (r.code != 0) {
                alert("获取订单数据异常！");
            }
            // 获取订单状态
            var statusStr = "";
            $.get(baseURL + "modules/insurancemanage/getCarOrderStatusStr/" + code, function (data) {
                if (data.order.statusStr != null) {
                    statusStr = data.order.statusStr;
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
    // 根据保单号查询保险相关数据，然后进入详情界面
    $.get(baseURL + "maintenance/insurancemanage/getInsuranceById/" + id, function (r) {
        if (r.data != null) {
            window.localStorage.setItem("insuranceManageId", r.data.insuranceManageId);
            window.localStorage.setItem("policyApplyNo", r.data.policyApplyNo);
            window.localStorage.setItem("carNo", r.data.carNo);
            window.localStorage.setItem("carId", r.data.carId);
            var index = layer.open({
                title: "维保管理 > 保险管理 > 查看保险单",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/insurancemanagedetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("insuranceManageId", null);
                    window.localStorage.setItem("policyApplyNo", null);
                    window.localStorage.setItem("carNo", null);
                    window.localStorage.setItem("carId", null);
                    // vm.reload();
                }
            });
            layer.full(index);
        } else {
            alert("查询保险数据不存在！");
        }
    });

}

// 分期设置查看-交强
function tableView(policyApplyNo, type, carId) {
    $.get(baseURL + "maintenance/insurancemanage/carInsuranceFeePeriodsInfo?policyApplyNo=" + policyApplyNo + "&type=" + type + "&carId=" + carId, function (res) {
        if (res.code == 0) {
            vm.dataliat = res.data.feePeriodsList;
            Vue.set(vm.insuranceManage, 'recordCompulsoryPeriodsAmount', res.data.insuranceAmount)
            vm.insuranceManage.recordCompulsoryPeriodsAmount = res.data.insuranceAmount;
            vm.insuranceManage.recordCompulsoryPeriods = res.data.periods;
            var index = layer.open({
                title: "交强险分期详情",
                type: 1,
                content: $("#showInsurance"),
                end: function () {
                    vm.showInsurance = false;
                }
            });
            layer.full(index);
            reloadPlan()
        }
    });

}
// 分期设置查看-商业
function tableView1(policyApplyNo, type, carId) {
    $.get(baseURL + "maintenance/insurancemanage/carInsuranceFeePeriodsInfo?policyApplyNo=" + policyApplyNo + "&type=" + type + "&carId=" + carId, function (res) {
        if (res.code == 0) {
            vm.dataliat2 = res.data.feePeriodsList;
            Vue.set(vm.insuranceManage, 'recordCommercialPeriodsAmount', res.data.insuranceAmount)
            vm.insuranceManage.recordCommercialPeriodsAmount = res.data.insuranceAmount;
            vm.insuranceManage.recordCommercialPeriods = res.data.periods;
            var index = layer.open({
                title: "商业险分期详情",
                type: 1,
                content: $("#showInsurance1"),
                end: function () {
                    vm.showInsurance1 = false;
                }
            });
            layer.full(index);
            reloadPlan1()
        }
    });


}
// 分期设置查看-承运
function tableView2(policyApplyNo, type, carId) {
    $.get(baseURL + "maintenance/insurancemanage/carInsuranceFeePeriodsInfo?policyApplyNo=" + policyApplyNo + "&type=" + type + "&carId=" + carId, function (res) {
        if (res.code == 0) {
            vm.dataliat1 = res.data.feePeriodsList;
            Vue.set(vm.insuranceManage, 'recordCarrierPeriodsAmount', res.data.insuranceAmount)
            vm.insuranceManage.recordCarrierPeriodsAmount = res.data.insuranceAmount;
            vm.insuranceManage.recordCarrierPeriods = res.data.periods;
            var index = layer.open({
                title: "承运险分期详情",
                type: 1,
                content: $("#showInsurance2"),
                end: function () {
                    vm.showInsurance2 = false;
                }
            });
            layer.full(index);
            reloadPlan2()
        }
    });

}
function reloadPlan() {
    if ($('div[lay-id="compulsoryInsurance"]').length > 0) {
        console.log(vm.dataliat, 455454545454)
        layui.table.reload('compulsoryInsurance', { data: vm.dataliat });
    }
}
function reloadPlan1() {
    if ($('div[lay-id="compulsoryInsurance1"]').length > 0) {
        console.log(vm.dataliat2, 455454545454)
        layui.table.reload('compulsoryInsurance1', { data: vm.dataliat2 });
    }
}
function reloadPlan2() {
    if ($('div[lay-id="compulsoryInsurance2"]').length > 0) {
        console.log(vm.dataliat1, 455454545454)
        layui.table.reload('compulsoryInsurance2', { data: vm.dataliat1 });
    }
}

