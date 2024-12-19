$(function () {
    initClick();
    vm.count = 0;
    vm.statusIndex = 1;

    //window.localStorage.removeItem("statusKey");
    vm.getBusinessType(window.localStorage.getItem("statusKey"));

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
            cellMinWidth: 150,
            url: baseURL + 'financial/receivables/list',
            where: JSON.parse(JSON.stringify(vm.q)),
            cols: vm.cols,
            page: true,
            loading: false,
            limits: [10, 20, 50, 100],
            limit: 10,
            parseData: function (res) {
                res.data.forEach(function (d) {
                    d.LAY_CHECKED = false;
                    if ($.inArray(d.receivablesId, vm.ids) >= 0) {
                        d.LAY_CHECKED = true;
                    }
                });

                receivablesDatas = res.data;
                checkAllStatusChange();
                return res;
            },
            autoColumnWidth: {
                init: true
            },
            done: function (res) {
                // 动态控制表格title，对最后一个备注做处理
                res.data.forEach(function (d) {
                    if (d.status == 1 || d.status == 2) {
                        $("[data-field='remark']").find('span').text('备注');
                    } else if (d.status == 3) {
                        $("[data-field='remark']").find('span').text('追帐备注');
                    } else if (d.status == 4) {
                        $("[data-field='remark']").find('span').text('坏帐备注');
                    } else if (d.status == 5) {
                        // $("[data-field='uncollectedAmount']").find('span').text('作废金额');
                        $("[data-field='remark']").find('span').text('作废原因');
                    }
                });

                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            }
        });

    });

    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });

    layui.form.on('submit(saveOrUpdate2)', function () {
        vm.saveOrUpdate2();
        return false;
    });

    layui.form.on('submit(saveManualWithhold)', function () {
        vm.saveManualWithhold();
        return false;
    });

    layui.form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });

    layui.form.on('select(customerType)', function (data) {
        vm.q.customerType = data.value;
    });

    layui.form.on('select(paymentMethod)', function (data) {
        vm.q.paymentMethod = data.value;
    });

    layui.form.on('select(collectionType)', function (data) {
        vm.q.collectionType = data.value;
    });
    layui.form.on('select(statistics)', function (data) {
        vm.q.statistics = data.value;
    });
    layui.form.on('select(orderStatus)', function (data) {
        vm.q.orderStatus = data.value;
    });
    layui.form.on('select(channelSelect)', function (data) {
        vm.q.channelId = data.value;
    });
    layui.form.on('select(repaymentMethod)', function (data) {
        vm.q.repaymentMethod = data.value;
    });
    layui.form.on('select(recheckStatus)', function (data) {
        vm.q.recheckStatus = data.value;
    });


    layui.use(['form', 'layedit', 'laydate', 'upload'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            upload = layui.upload;

        initDate(laydate);
        initVerify(form);

        laydate.render({
            elem: '#receivableDate',
            format: 'yyyy-MM-dd HH:mm:ss',
            type: 'datetime',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.receivableDateStr = value;
            }
        });
        //新增已收账款-实收时间
        laydate.render({
            elem: '#receivableDateForm',
            //type: 'datetime',
            type: 'date',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.receivables.receivableDate = value;
            }
        });
        //监听付款方
        form.on('select(customer)', function (data) {
            vm.receivables.customerId = data.value;
        })
        //监听单选按钮
        form.on('radio(radioCustomer)', function (data) {
            vm.receivables.customerType = data.value;
            if (data.value == 5) {
                //获取客户下拉选;
                // getCustomer();
                vm.receivables.customerId = null;
                vm.qudaoShow = false;
                vm.kehuShow = true;
            } else if (data.value == 6) {
                //获取渠道商下拉选
                $('#customer').html("<option value=''>请选择付款方</option>");
                vm.receivables.customerId = null;
                vm.qudaoShow = true;
                vm.kehuShow = false;
                getDistributors();
            }
            vm.customer = {};

        });
        uploadAttachment(upload);
        uploadEditAttachment(upload);
        form.render();
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        laydate.render({
            elem: '#actualDate',
            format: 'yyyy-MM-dd HH:mm:ss',
            type: 'datetime',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.actualDateStr = value;
            }
        });
        form.render();
    });

    //批量删除
    $(".delBatch").click(function () {
        var receivablesIds = vm.selectedRows();
        if (receivablesIds == null) {
            return;
        }
        vm.del(receivablesIds);
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.receivablesId);
        } else if (layEvent === 'del') {
            var receivablesId = [data.receivablesId];
            vm.del(receivablesId);
        } else if (layEvent === 'collectionsk') {
            var receivablesId = [data.receivablesId];
            vm.collectionsq(receivablesId);
        } else if (layEvent === 'detail') {
            var receivablesId = [data.receivablesId];
            var receivablesNo = [data.receivablesNo];
            vm.detail(receivablesId, receivablesNo);
        } else if (layEvent === 'delChasingBz') {
            vm.delChasingBz(data.receivablesId);
        } else if (layEvent === 'delBadBz') {
            vm.delBadBz(data.receivablesId);
        } else if (layEvent === 'applyWithHold') {
            vm.applyWithHold(data);
        } else if (layEvent === 'manualAliWithhold') {
            vm.manualAliWithhold(data);
        } else if (layEvent === 'receivabledit') {
            vm.receivabledit(data);
        } else if (layEvent === 'recheck') {
            vm.recheckReceivable(data.receivablesId);
        } else if (layEvent === 'recheckcancel') {
            vm.cancelcheckReceivable(data.receivablesId);
        } else if (layEvent === 'clearWithHold') {
            vm.clearWithHold(data);
        }
    });

    layui.form.on('checkbox(siam_all)', function () {
        var checked = $(this)[0].checked;
        if (receivablesDatas != null && receivablesDatas.length > 0) {
            receivablesDatas.forEach(function (d) {
                ysCheckedChange(d, d.receivablesId, checked);
            });
        }
        var status = $(this).prop("checked");
        $.each($("input[name=siam_one]"), function (i, value) {
            if (!value.disabled)
                $(this).prop("checked", status);
        });
        layui.form.render();
    });

    layui.form.on('checkbox(siam_one)', function () {
        var checked = $(this)[0].checked;
        var id = $(this).attr("data-id");
        var obj = receivablesDatas.filter(function (d) {
            return d.receivablesId == id;
        })[0];
        ysCheckedChange(obj, id, checked);
        //checkAllStatusChange();
        layui.form.render();
    });
    /**
     * 批量导入
     */
    layui.upload.render({
        elem: '#batchImportReceivables',
        url: baseURL + 'financial/receivables/batchImportReceivables',
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        done: function (r) {
            // if (parseInt(res.code) != 0) {
            //     layer.msg('批量收款数据导入失败:' + res.msg, {icon: 5});
            //     return false;
            // }else{
            //     layer.msg('批量收款数据导入成功！', {icon: 1});
            //     vm.reload();
            // }
            // todo 报错的话生成一个文件
            if (r.resultFlag == 1) {
                layer.msg(r.msg, {icon: 1});
                vm.reload();
            } else {
                layer.confirm(r.msg, {
                    btn: ['下载导入失败的数据！', '取消'] //可以无限个按钮
                }, function (index, layero) {
                    window.location.href = baseURL + 'financial/receivables/exportExcel?numberNo=' + r.numberNo;
                }, function (index) {
                    layer.close(index);
                    vm.reload();
                });
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
        }
    });

    layui.form.verify({
        validate_collectionTypeName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择收款类型";
            }
        }
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            status: 1,
            //车牌号/车架号
            carPlateNo: null,
            //车辆/车系/车型
            carBrandName: null,
            carSeriesName: null,
            carModelName: null,
            //客户/渠道名称
            customerName: null,
            contactMobile: null,
            //订单编号
            businessNo: null,
            //租赁类型
            rentType: null,
            //应收单号
            receivablesNo: null,
            //月租金付款方式
            paymentMethod: null,
            // 支付方式
            repaymentMethod: null,
            recheckStatus: null,
            //收款类型
            collectionType: null,
            //付款方类型
            customerType: null,
            //合同编号
            contractNo: null,
            //应收时间类型
            receivableDateType: null,
            //应收时间
            receivableDateStr: null,
            //实收时间类型
            actualDateType: null,
            //实收时间
            actualDateStr: null,
            entrance: null,
            stage: null,
            channelId: null,
            leaseId: null,
            leaseName: null,
        },
        deliveryFileLst: [],
        costTypeList: [],
        costTypeMap: {},
        deliveryFileLstId: 'deliveryFileLstId_0',
        showForm: false,
        showForm2: false,
        showForm3: false,
        showDaiKouEdit: false,
        receivables: {},
        receivableAmounts: 0,
        receivedAmounts: 0,
        chasingAmount: 0,
        badAmount: 0,
        nullifyAmount: 0,
        remindMoney: 0,
        title: null,
        status: null,
        amountLabel: null,
        dateLabel: null,
        type: null,
        ids: [],
        isFilter: false,
        statusIndex: null,
        statusType: null,
        count: 0,
        channelList: [],
        uncollectedAmount: 0,
        cols: [[
            {
                templet: "#checkbd",
                title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                width: 50,
                fixed: "left",
                align: "center"
            },
            {title: '&nbsp;操作&nbsp;&nbsp;', width: 200, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'carPlateNo', align: "center", title: '车牌号', fixed: "left", templet: function (d) {
                    return isEmpty(d.carPlateNo);
                }
            },
            {
                field: 'stage', align: "center", title: '账单期数', templet: function (d) {
                    if (d.stage == null || d.stage == '' || d.stage == 0) {
                        return '--';
                    } else {
                        return d.stage + "期";
                    }
                }
            },
            {
                field: 'customerName', align: "center", title: '客户名称', templet: function (d) {
                    return isEmpty(d.customerName);
                }
            },
            {
                field: 'contactMobile', align: "center", title: '客户联系电话', templet: function (d) {
                    return isEmpty(d.contactMobile);
                }
            },
            {
                field: 'receivableDate', align: "center", title: '应收日期', templet: function (d) {
                    return isEmpty(d.receivableDateDesc || d.receivableDate);
                    // return isEmpty(d.receivableDate);
                }
            },
            {
                field: 'overdueDate', align: "center", title: '逾期期限', templet: function (d) {
                    return isEmpty(d.overdueDate);
                }
            },
            {
                field: 'remindDate', align: "center", title: '提醒时间', templet: function (d) {
                    return isEmpty(d.remindDate);
                }
            },
            {
                field: 'collectionType', align: "center", title: '收款类型', templet: function (d) {
                    let collectionTypeStr = getCollectionTypeStr(d.collectionType);
                    if (15 == d.collectionType) {
                        collectionTypeStr = d.collectionTypeName;
                    } else if (0 == d.collectionType) {
                        collectionTypeStr = d.collectionTypeName;
                    }
                    return collectionTypeStr;
                }
            },
            {
                field: 'status', align: "center", title: '支付状态', templet: function (d) {
                    if (d.status == 1) {
                        return "<span style='color: red' >待收款</span>";
                    } else if (d.status == 2) {
                        return "<span style='color: red' >已收款</span>";
                    } else if (d.status == 3) {
                        return "<span style='color: red' >待追帐</span>";
                    } else if (d.status == 4) {
                        return "<span style='color: red' >已坏帐</span>";
                    } else if (d.status == 5) {
                        return "<span style='color: red' >已作废</span>";
                    } else if (d.status == 6) {
                        return "<span style='color: red' >已退款</span>";
                    } else if (d.status == 7) {
                        return "<span style='color: red' >代扣扣款中</span>";
                    } else if (d.status == 8) {
                        return "<span style='color: red' >代扣失败</span>";
                    } else if (d.status == 9) {
                        return "<span style='color: red' >部分扣款成功</span>";
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'hzType', align: "center", title: '坏账类型', templet: function (d) {
                    if (d.hzType == 0) {
                        return "未坏账";
                    } else if (d.hzType == 1) {
                        return "全额坏账";
                    } else if (d.hzType == 2) {
                        return "部分坏账";
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'receivableAmount', title: '应收总金额', templet: function (d) {
                    return d.receivableAmount;
                }
            },
            {
                field: 'receivableAmount', title: '应收金额', templet: function (d) {
                    var ysje = d.receivableAmount - d.lateFeeAmount;
                    return ysje.toFixed(2);
                }
            },
            {
                field: 'lateFeeAmount', title: '滞纳金', templet: function (d) {
                    return d.lateFeeAmount == null ? '--' : d.lateFeeAmount;
                }
            },
            {field: 'receivedAmount', title: '已收金额'},
            {
                field: 'uncollectedAmount', title: '待收金额', templet: function (d) {
                    return d.status == 5 ? '--' : d.uncollectedAmount;
                }
            },
            {
                field: 'uncollectedAmount', title: '作废金额', templet: function (d) {
                    return d.status == 5 ? d.uncollectedAmount : '--';
                }
            },
            {field: 'discountAmount', title: '优惠金额'},
            {field: 'balanceDeductionAmount', title: '余额抵扣金额'},
            {field: 'marginDeductionAmount', title: '保证金抵扣金额'},
            {field: 'badBillAmount', title: '坏账金额'},
            {
                field: 'netReceipts', title: '实收金额', templet: function (d) {
                    return sub(sub(sub(sub(d.netReceipts, d.marginDeductionAmount), d.badBillAmount), d.balanceDeductionAmount), d.discountAmount);
                }
            },
            {
                field: 'daikouFailReason', align: "center", title: '代扣失败原因', templet: function (d) {
                    return isEmpty(d.daikouFailReason);
                }
            },
            {
                field: 'vin', align: "center", title: '车架号', templet: function (d) {
                    return isEmpty(d.vin);
                }
            },
            {
                field: 'brandName', align: "center", title: '品牌/车系', templet: function (d) {
                    return isEmpty(d.brandName) + "/" + isEmpty(d.seriesName);
                }
            },
            {
                field: 'modelName', align: "center", title: '车型', templet: function (d) {
                    return isEmpty(d.modelName);
                }
            },

            {
                field: 'businessNo', align: "center", title: '业务单号', templet: function (d) {
                    return isEmpty(d.businessNo);
                }
            },
            {
                field: 'repaymentMethod', align: "center", title: '支付方式', templet: function (d) {
                    if (d.repaymentMethod == 1) {
                        return '微信支付';
                    } else if (d.repaymentMethod == 2) {
                        return '其他';
                    } else if (d.repaymentMethod == 3) {
                        return '汇聚代扣';
                    } else if (d.repaymentMethod == 4) {
                        return '支付宝代扣';
                    } else if (d.repaymentMethod == 5) {
                        return '支付宝支付';
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'customerType', align: "center", title: '客户/渠道类型', templet: function (d) {
                    if (d.customerType == 1) {
                        return '客户/企业';
                    } else if (d.customerType == 2) {
                        return '客户/个人';
                    } else if (d.customerType == 3) {
                        return '渠道/个人';
                    } else if (d.customerType == 4) {
                        return '渠道/企业';
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'contractNo', align: "center", title: '合同编号', templet: function (d) {
                    return isEmpty(d.contractNo);
                }
            },
            {
                field: 'leaseName', align: "center", title: '出租方', templet: function (d) {
                    return isEmpty(d.leaseName);
                }
            },

            {
                field: 'rentType', align: "center", title: '租赁类型', templet: function (d) {
                    return getBillRentTypeStr(d.rentType);
                }
            },


            {field: 'receivablesNo', title: '应收单编号'},

            {
                field: 'orderStatus', align: "center", title: '单据状态', templet: function (d) {
                    if (d.orderStatus == 0) {
                        return '正常';
                    } else if (d.orderStatus == 1) {
                        return '换车审核中';
                    } else if (d.orderStatus == 2) {
                        return '退车审核中';
                    } else if (d.orderStatus == 3) {
                        return '备用车审核中';
                    } else if (d.orderStatus == 4) {
                        return '已抵扣';
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'paymentMethod', align: "center", title: '付款方式', templet: function (d) {
                    if (d.paymentMethod == 0) {
                        return '其他';
                    } else if (d.paymentMethod == 1) {
                        return '月付';
                    } else if (d.paymentMethod == 2) {
                        return '两月付';
                    } else if (d.paymentMethod == 3) {
                        return '季付';
                    } else if (d.paymentMethod == 6) {
                        return '半年付';
                    } else if (d.paymentMethod == 4) {
                        return '年付';
                    } else if (d.paymentMethod == 5) {
                        return '一次性付款';
                    } else if (d.paymentMethod == 7) {
                        return "日付";
                    } else if (d.paymentMethod == 8) {
                        return "周付";
                    } else {
                        return '--';
                    }
                }
            },

            {
                field: 'billStartTime', align: "center", title: '账单开始时间', templet: function (d) {
                    return isEmpty(d.billStartTime);
                }
            },
            {
                field: 'billEndTime', align: "center", title: '账单结束时间', templet: function (d) {
                    return isEmpty(d.billEndTime);
                }
            },

            {
                field: 'actualDate', align: "center", title: '实收时间', templet: function (d) {
                    return isEmpty(d.actualDate);
                }
            },
            {
                field: 'overdueDays', align: "center", title: '逾期天数', templet: function (d) {
                    return isEmpty(receivableOverdueDays(d.status, d.hzType, d.overdueDate, d.actualDate));
                }
            },
            {
                field: 'remark', align: "center", title: '备注', templet: function (d) {
                    if (d.status == 1) {
                        return isEmpty(d.remarks);
                    } else if (d.status == 2) {
                        return isEmpty(d.remarks);
                    } else if (d.status == 3) {
                        return isEmpty(d.chasingRemark);
                    } else if (d.status == 4) {
                        return isEmpty(d.badRemark);
                    } else if (d.status == 5) {
                        return isEmpty(d.nullifyRemark);
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'modifyReason', align: "center", title: '修改原因', templet: function (d) {
                    return isEmpty(d.modifyReason);
                }
            },
            {
                field: 'recheckStatus', align: "center", title: '复核状态', templet: function (d) {
                    return transformTypeByMap(d.recheckStatus, {0: '未复核', 1: '已复核', 2: '取消复核'});
                }
            },
            {
                field: 'recheckRemark', align: "center", title: '复核备注', templet: function (d) {
                    return isEmpty(d.recheckRemark);
                }
            },
        ]],
        customer: {},
        qudaoShow: false,
        kehuShow: false,
    },
    created: function () {
        var _this = this;
        $.ajaxSettings.async = false;
        // $.getJSON(baseURL + "chl/chlchannel/search/list", function (r) {
        //     _this.channelList = r.channelList;
        // });
        $.ajaxSettings.async = true;
        if (parent.layer.boxParams != null) {
            var param = parent.layer.boxParams.boxParams;
            if (param != null) {
                _this.q.status = param['statusKey'];
                if (_this.q.status != null && _this.q.status != '') {
                    if (_this.q.status == '1') {
                        _this.q.receivableDateType = 7;
                        _this.q.receivablesNo = param['receivablesNo'];
                    } else if (_this.q.status == '2') {
                        _this.q.actualDateStr = param['timeVal'];
                    } else if (_this.q.status == -9) {
                        _this.q.contractNo = param['contractNo'];
                        _this.q.carPlateNo = param['carPlateNo'];
                    } else if (_this.q.status == 4) {
                        _this.q.carPlateNo = param['carPlateNo'];
                    }
                }
            }
        }

        // 查询费用类型名称
        $.ajax({
            type: "POST",
            url: baseURL + "/otherCostType/costType/selectCostNameList?costType=0",
            contentType: "application/json",
            data: null,
            success: function (r) {
                _this.costTypeList = r.list;
                if (_this.costTypeList.length < 1) {
                    return false;
                }
                for (let i = 0; i < _this.costTypeList.length; i++) {
                    _this.costTypeMap[_this.costTypeList[i].id] = _this.costTypeList[i];
                }
            }
        });

        layui.form.on('select(collectionTypeName)', function (data) {
            vm.receivables.collectionTypeName = vm.costTypeMap[data.value].costName;
            vm.receivables.collectionTypeVal = data.value;
        });
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form', "jquery", "cascader", "form"], function () {
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.selectData,
                    success: function (valData, labelData) {
                        /*vm.q.carBrandName = labelData[0];
                        vm.q.carSeriesName = labelData[1];
                        vm.q.carModelName = labelData[2];*/
                        vm.q.carBrandName = labelData[0];
                        vm.q.carSeriesName = labelData[1];
                        if (labelData[2] != null && labelData[2] != '') {
                            vm.q.carModelName = labelData[2];
                        }

                    }
                });
            });
        });
    },

    updated: function () {
        layui.form.render();
    },

    methods: {
        selectCustomer: function () {
            window.localStorage.setItem("customerName", vm.customer.customerName);
            window.localStorage.setItem("customerId", vm.customer.customerId);
            var index = layer.open({
                title: "选择客户",
                type: 2,
                content: tabBaseURL + "modules/common/selectcustomer.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                },
                end: function () {
                    if (vm.customer.id != null && vm.customer.id != undefined) {
                        vm.receivables.customerId = vm.customer.id;
                    }
                    vm.receivables.customerName = vm.customer.customerName;
                    window.localStorage.removeItem("customerId");
                    window.localStorage.removeItem("customerName");

                },
            });
            layer.full(index)

        },
        deptTree: function () {
            var index = layer.open({
                title: "选择出租方",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.q, "leaseId", treeNode.deptId);
            Vue.set(vm.q, "leaseName", treeNode.name);
            layer.closeAll();
        },
        applyWithHold: function (data) {
            $.ajax({
                type: "post",
                url: baseURL + "financial/receivables/withHold",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (res) {
                    alert(res.msg);
                    vm.reload();
                }
            });
        },
        getBusinessType: function (businessType) {
            //debugger
            if (businessType != null && businessType != '') {
                if (businessType == '1') {
                    vm.q.status = 1;
                    vm.statusIndex = 1;
                    vm.statusType = 1;
                    var receivableDateStr= window.localStorage.getItem("timeVal");
                    if(receivableDateStr!='null'){
                        vm.q.receivableDateStr = window.localStorage.getItem("timeVal");
                    }
                    var type = window.localStorage.getItem("dateTimetype");
                    if (type == '1') {
                        vm.q.repairStartTimeType = 1;
                    } else if (type == '2') {
                        vm.q.repairStartTimeType = 3;
                    } else if (type == '3') {
                        vm.q.repairStartTimeType = 5;
                    } else if (type == '4') {
                        vm.q.repairStartTimeType = 7;
                    } else if (type == '5') {
                        vm.q.repairStartTimeType = null;
                    }
                } else if (businessType == '2') {
                    vm.q.status = 2;
                    vm.statusIndex = 2;
                    vm.statusType = 2;
                    vm.q.actualDateStr = window.localStorage.getItem("timeVal");
                    var type = window.localStorage.getItem("dateTimetype");
                    if (type == '1') {
                        vm.q.repairEndTimeType = 1;
                    } else if (type == '2') {
                        vm.q.repairEndTimeType = 3;
                    } else if (type == '3') {
                        vm.q.repairEndTimeType = 5;
                    } else if (type == '4') {
                        vm.q.repairEndTimeType = 7;
                    } else if (type == '5') {
                        vm.q.repairEndTimeType = null;
                    }
                }
                else if (businessType == '-9') {
                    vm.q.status = -9;
                    vm.statusIndex = -9;
                    vm.q.receivableDateStr = window.localStorage.getItem("timeVal");
                    var type = window.localStorage.getItem("dateTimetype");
                    if (type == '1') {
                        vm.q.repairEndTimeType = 1;
                    } else if (type == '2') {
                        vm.q.repairEndTimeType = 3;
                    } else if (type == '3') {
                        vm.q.repairEndTimeType = 5;
                    } else if (type == '4') {
                        vm.q.repairEndTimeType = 7;
                    } else if (type == '5') {
                        vm.q.repairEndTimeType = null;
                    }
                }
                vm.q.entrance = 1;
                vm.reload();
                //vm.searchTotalAmount();
            } else {
                //vm.searchTotalAmount();
                vm.reload();
            }
        },

        changeStatus: function (status) {
            //vm.reset();
            //vm.q.entrance = null;
            if (status == 1) {
                vm.q.status = 1;
                vm.statusIndex = 1;
            } else if (status == 2) {
                vm.q.status = 2;
                vm.statusIndex = 2;
            } else if (status == 3) {
                vm.q.status = 3;
                vm.statusIndex = 3;
            } else if (status == 4) {
                vm.q.status = 4;
                vm.statusIndex = 4;
            } else if (status == 5) {
                vm.q.status = 5;
                vm.statusIndex = 5;
            } else if (status == 6) {
                vm.q.status = 6;
                vm.statusIndex = 6;
            } else if (status == -9) {
                vm.q.status = -9;
                vm.statusIndex = -9;
            } else if (status == 7) {
                vm.q.status = 7;
                vm.statusIndex = 7;
            }
            vm.reload();
        },

        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var receivablesIds = [];
            $.each(list, function (index, item) {
                receivablesIds.push(item.receivablesId);
            });
            return receivablesIds;
        },
        query: function () {
            vm.q.entrance = 1;
            vm.reload();
        },
        reset: function () {
            vm.q.carPlateNo = null,
                vm.q.customerName = null,
                vm.q.contactMobile = null,
                vm.q.businessNo = null,
                vm.q.rentType = null,
                vm.q.receivablesNo = null,
                vm.q.paymentMethod = null,
                // 支付方式
                vm.q.repaymentMethod = null,
                vm.q.recheckStatus = '',
                vm.q.collectionType = null,
                vm.q.customerType = null,
                vm.q.contractNo = null,
                vm.q.carBrandName = null,
                vm.q.carSeriesName = null,
                vm.q.carModelName = null,
                //应收时间类型
                vm.q.receivableDateType = null,
                //应收时间
                vm.q.receivableDateStr = null,
                //实收时间类型
                vm.q.actualDateType = null,
                //实收时间
                vm.q.actualDateStr = null,
                vm.q.stage = null,
                vm.q.channelId = null,
                vm.q.payType = null,
                vm.q.leaseId = null,
                vm.q.leaseName = null
            $("#carBrandSeriesModel").val('');
            $('div[type="receivableDateType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="actualDateType"]>div').removeClass('task-content-box-tab-child-active');
        },
        add: function (type) {
            initializeData(type);
            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        //提前还款
        advanceRepayment: function () {
            var index = layer.open({
                title: "确认收款",
                type: 2,
                content: tabBaseURL + "modules/financial/advanceRepayment.html",
                end: function () {
                    layer.closeAll();
                    // vm.reload();
                }
            });
            layer.full(index);
        },
// 跳转费用类型维护页面
        jumpToFeeTypePage: function () {
            let url = tabBaseURL + 'modules/otherCostType/costType.html';
            let title = '费用类型配置';
            addTab(url, title);
        },
        update: function (receivablesId) {
            $.get(baseURL + "financial/receivables/info/" + receivablesId, function (r) {
                vm.receivables = r.receivables;
            });
            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        manualAliWithhold: function (data) {
            $.get(baseURL + 'alipay/alipaysign/getCustomerAgreementNo/' + data.customerId, function (r) {
                if (r == null || r == '' || r == undefined) {
                    alert("客户未签约！");
                    return;
                }
            });
            vm.receivables.receivablesId = data.receivablesId;
            vm.receivables.uncollectedAmount = data.uncollectedAmount;
            vm.receivables.netReceipts = data.uncollectedAmount;
            var index = layer.open({
                title: "手动代扣",
                type: 1,
                content: $("#editForm3"),
                area: ['700px', '400px'],
                end: function () {
                    vm.showForm3 = false;
                    layer.closeAll();
                }
            });

            vm.showForm3 = true;
        },
        receivabledit: function (data) {
            console.log("data:::", data)
            let repaymentMethod = data.repaymentMethod;
            if (repaymentMethod == 4) {
                vm.showDaiKouEdit = true;
            }
            vm.deliveryFileLst = [];
            vm.deliveryFileLst = [];
            vm.receivables.receivablesId = data.receivablesId;
            vm.receivables.oldReceivableAmount = (data.receivableAmount - data.lateFeeAmount).toFixed(2);
            vm.receivables.receivableAmount = (data.receivableAmount - data.lateFeeAmount).toFixed(2);
            vm.receivables.receivedAmount = data.receivedAmount;
            var index = layer.open({
                title: "修改账单金额",
                type: 1,
                content: $("#editForm2"),
                area: ['700px', '600px'],
                end: function () {
                    vm.showForm2 = false;
                    vm.showDaiKouEdit = false;
                    vm.receivables = {};
                    layer.closeAll();
                }
            });

            vm.showForm2 = true;

        },
        clearWithHold: function (data) {
            console.log("data:::", data)
            layer.confirm('确认取消代扣？取消后无法再次发起代扣，只能线下收款！', function(index){
                var param = {
                    receivablesId:data.receivablesId
                }
                $.ajax({
                    type: "POST",
                    url: baseURL + "financial/receivables/clearWithHold",
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('操作成功', function (index) {
                                layer.closeAll();
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },

        saveOrUpdate2: function (event) {
            let receivableAmount = Number(vm.receivables.receivableAmount);
            if (receivableAmount <= 0) {
                alert("收款金额必须大于0")
                return;
            }
            vm.receivables.attachment=vm.deliveryFileLst
            console.log(vm.receivables)
            vm.receivables.attachment=vm.deliveryFileLst
            $.ajax({
                type: "POST",
                url: baseURL + "financial/receivables/updateReceivable",
                contentType: "application/json",
                data: JSON.stringify(vm.receivables),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.receivables = {};
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });

        },

        saveManualWithhold: function (event) {
            let netReceipts = Number(vm.receivables.netReceipts);
            let uncollectedAmount = Number(vm.receivables.uncollectedAmount);
            if (netReceipts <= 0) {
                alert("代扣金额必须大于0！")
                return;
            }
            if (netReceipts > uncollectedAmount) {
                alert("代扣金额不能大于待收款金额！")
                return;
            }
            $.ajax({
                type: "POST",
                url: baseURL + "financial/receivables/saveManualWithhold",
                contentType: "application/json",
                data: JSON.stringify(vm.receivables),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.receivables = {};
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });

        },

        detail: function (receivablesId, receivablesNo) {
            window.localStorage.setItem("receivablesId", receivablesId);
            window.localStorage.setItem("receivablesNo", receivablesNo);
            var index = layer.open({
                title: "应收单详情",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/receivablesDetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.removeItem("receivablesId");
                    window.localStorage.removeItem("receivablesNo");
                    vm.reload();
                }
            });
            layer.full(index);
        },
        collectionsq: function (receivablesId) {
            window.localStorage.setItem("receivablesId", receivablesId);
            var index = layer.open({
                title: "收款单确认",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/collectionSk.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("receivablesId", null);
                    vm.reload();
                }
            });
            layer.full(index);


        },
        del: function (receivablesIds) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "financial/receivables/delete",
                    contentType: "application/json",
                    data: JSON.stringify(receivablesIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },

        saveOrUpdate: function (event) {
            vm.receivables.status = vm.type;
            vm.receivables.attachment = vm.deliveryFileLst;
            //判断应收，实收金额大于0
            if (vm.receivables.amount != null && vm.receivables.amount != '') {
                if (vm.type != null && vm.type == 1) {
                    if (vm.receivables.amount == '0' || vm.receivables.amount == '0.00') {
                        layer.msg('应收金额必须大于0', {icon: 7});
                        return false;
                    }
                }
                if (vm.type != null && vm.type == 2) {
                    if (vm.receivables.amount == '0' || vm.receivables.amount == '0.00') {
                        layer.msg('实收金额必须大于0', {icon: 7});
                        return false;
                    }
                }

            }
            if (vm.receivables.customerId == null || vm.receivables.customerId == '') {
                layer.msg('付款方不能为空!', {icon: 7});
                return false;
            }
            $.ajax({
                type: "POST",
                url: baseURL + "financial/receivables/save",
                contentType: "application/json",
                data: JSON.stringify(vm.receivables),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.customer = {};
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });

        },
        // 一键收款
        yjsk: function () {
            var ids = [];
            $.each($("input[name=siam_one]:checked"), function (i, value) {
                ids.push($(this).attr("data-id"));
            });
            var param = {
                receivablesIds: [],
                where: {
                    status: vm.q.status,
                    carPlateNo: vm.q.carPlateNo,
                    customerName: vm.q.customerName,
                    businessNo: vm.q.businessNo,
                    rentType: vm.q.rentType,
                    receivablesNo: vm.q.receivablesNo,
                    paymentMethod: vm.q.paymentMethod,
                    collectionType: vm.q.collectionType,
                    customerType: vm.q.customerType,
                    contractNo: vm.q.contractNo,
                    receivableDateStr: vm.q.receivableDateStr,
                    receivableDateType: vm.q.receivableDateType,
                    actualDateType: vm.q.actualDateType,
                    actualDateStr: vm.q.actualDateStr,
                    carBrandName: vm.q.carBrandName,
                    carSeriesName: vm.q.carSeriesName,
                    carModelName: vm.q.carModelName,
                    stage: vm.q.stage,
                    leaseId: vm.q.leaseId,
                    channelId: vm.q.channelId,
                    payType: vm.q.payType,
                    contactMobile: vm.q.contactMobile,
                }
            };
            if (vm.ids.length == 0) {
                // alert("未选择需要收款的金额");
                // return ;
            } else {
                $.each(vm.ids, function (index, item) {
                    param.receivablesIds.push(item);
                });
            }
            //
            var index = layer.open({
                title: "一键收款",
                type: 2,
                area: ['700px', '400px'],
                boxParams: {
                    data: param,
                    callback: function (d) {
                        layer.close(index);
                        vm.reload();
                        vm.searchTotalAmount();
                    }
                },
                content: tabBaseURL + "modules/financial/yjsk.html",
                end: function () {
                    layer.close(index);
                }
            });

            // console.log(receivablesIds);

            // confirm('确定要收款吗？', function () {
            //     $.ajax({
            //         type: "POST",
            //         url: baseURL + "financial/receivables/batchSkReceivables",
            //         contentType: "application/json",
            //         data: JSON.stringify(receivablesIds),
            //         success: function (r) {
            //             if (r.code == 0) {
            //                 alert('操作成功', function (index) {
            //                     vm.reload();
            //                     vm.searchTotalAmount();
            //                 });
            //             } else {
            //                 alert(r.msg);
            //             }
            //         }
            //     });
            // });
        },

        // 操作收款、追帐、坏账和作废功能后顶部统计数据重新查询
        searchTotalAmount: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "financial/receivables/getCollectionInfo",
                data: JSON.parse(JSON.stringify(vm.q)),
                success: function (r) {
                    vm.receivableAmounts = r.receivableAmount;
                    vm.receivedAmounts = r.receivedAmount;
                    vm.chasingAmount = r.chasingAmount;
                    vm.badAmount = r.badAmount;
                    vm.nullifyAmount = r.nullifyAmount;
                    vm.uncollectedAmount = r.uncollectedAmount;
                    vm.remindMoney = r.remindMoney;
                }
            });
        },

        // 待追帐
        dealChasing: function () {
            /*var ids = [];
            $.each($("input[name=siam_one]:checked"), function (i, value) {
                ids.push($(this).attr("data-id"));
            });*/

            if (vm.ids.length == 0) {
                alert("未选择需要追帐的应收单数据");
                return;
            }
            //console.log(vm.ids.length);
            var receivablesIds = [];
            $.each(vm.ids, function (index, item) {
                receivablesIds.push(item);
            });
            window.localStorage.setItem("receivablesIds", receivablesIds);
            window.localStorage.setItem("operType", 1);
            var index = layer.open({
                title: "待追帐确认",
                type: 2,
                area: ['75%', '75%'],
                content: tabBaseURL + 'modules/financial/dealChasing.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("receivablesIds", null);
                    window.localStorage.setItem("operType", null);
                    vm.searchTotalAmount();
                }
            });
        },

        // 追帐备注
        delChasingBz: function (receivablesId) {
            var receivablesIds = [];
            if (receivablesId == null) {
                alert("请选择需要备注的待追帐数据");
                return;
            }
            receivablesIds.push(receivablesId);
            window.localStorage.setItem("receivablesIds", receivablesIds);
            window.localStorage.setItem("operType", 2);
            var index = layer.open({
                title: "追帐备注",
                type: 2,
                area: ['75%', '75%'],
                content: tabBaseURL + 'modules/financial/dealChasing.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("receivablesIds", null);
                    window.localStorage.setItem("operType", null);
                }
            });
        },

        // 一键作废
        yjzf: function () {
            /* 
            var ids = [];
            $.each($("input[name=siam_one]:checked"), function (i, value) {
                ids.push($(this).attr("data-id"));
            });*/

            if (vm.ids.length == 0) {
                alert("未选择需要作废的应收单数据");
                return;
            }

            var receivablesIds = [];
            $.each(vm.ids, function (index, item) {
                receivablesIds.push(item);
            });
            window.localStorage.setItem("receivablesIds", receivablesIds);
            var index = layer.open({
                title: "账单作废确认",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + 'modules/financial/dealNullify.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("receivablesIds", null);
                    vm.searchTotalAmount();
                }
            });
        },

        // 坏账
        dealBadBill: function () {
            /* var ids = [];
             $.each($("input[name=siam_one]:checked"), function (i, value) {
                 ids.push($(this).attr("data-id"));
             });*/
            if (vm.ids.length == 0) {
                alert("未选择需要坏账的应收单数据");
                return;
            }

            var receivablesIds = [];
            $.each(vm.ids, function (index, item) {
                receivablesIds.push(item);
            });
            window.localStorage.setItem("receivablesIds", receivablesIds);
            window.localStorage.setItem("operType", 3);
            var index = layer.open({
                title: "账单坏账确认",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + 'modules/financial/dealBadBill.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("receivablesIds", null);
                    window.localStorage.setItem("operType", null);
                    vm.searchTotalAmount();
                }
            });
        },
        batchImportReceivables: function () {

        },

        batchRecheckReceivables: function () {
            vm.checkReceivable(vm.ids, 1);
        },
        recheckReceivable: function (id) {
            vm.checkReceivable([id], 1);
        },
        cancelcheckReceivable: function (id) {
            vm.checkReceivable([id], 2);
        },
        checkReceivable: function (ids, status) {
            if (ids == null || ids.length < 1 || status == null || $.inArray(status, [1, 2]) < 0) {
                return;
            }
            layer.open({
                id: 1,
                type: 1,
                title: '请输入' + transformTypeByMap(status, {1: '复核', 2: '取消复核'}) + '备注',
                area: ['50%', '50%'],
                content: "<div style='display:flex;justify-content:center;'><textarea id='area' style='width:100%;height:200px;resize: none;'></textarea></div>",
                btn: ['保存', '取消'],
                yes: function (index, layero) {
                    //获取输入框里面的值
                    var closeContent = top.$("#area").val() || $("#area").val();
                    if (closeContent) {
                        console.log(closeContent);
                    }
                    var param = {
                        ids: ids,
                        remark: closeContent,
                        status: status,
                    }
                    confirm('确定要' + transformTypeByMap(status, {1: '复核', 2: '取消复核'}) + '选中的记录？', function () {
                        PageLoading();
                        $.ajax({
                            type: "POST",
                            url: baseURL + "financial/receivablerecheck/checkReceivables",
                            contentType: "application/json",
                            data: JSON.stringify(param),
                            success: function (r) {
                                RemoveLoading();
                                if (r.code == 0) {
                                    alert('操作成功', function (index) {
                                        layer.closeAll();
                                        vm.reload();
                                    });
                                } else {
                                    alert(r.msg);
                                }
                            }
                        });
                    });
                },
                no: function (index, layero) {
                    layer.close(index);
                }
            });
        },

        delBadBz: function (receivablesId) {
            var receivablesIds = [];
            if (receivablesId == null) {
                alert("请选择需要备注的坏账数据");
                return;
            }
            receivablesIds.push(receivablesId);
            window.localStorage.setItem("receivablesIds", receivablesIds);
            window.localStorage.setItem("operType", 4);
            var index = layer.open({
                title: "坏账备注",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + 'modules/financial/dealBadBill.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("receivablesIds", null);
                    window.localStorage.setItem("operType", null);
                    vm.searchTotalAmount();
                }
            });
        },

        exports: function () {
            var url = baseURL + 'financial/receivables/export?a=a';
            if (vm.q.status != null && vm.q.status != "") {
                url += '&status=' + vm.q.status;
                // if(vm.q.status === 6 || vm.q.status === 7){
                //     url += '&status=' + 1;
                // }
            }
            if (vm.q.customerName != null && vm.q.customerName != "") {
                url += '&customerName=' + vm.q.customerName;
            }
            if (vm.q.contactMobile != null && vm.q.contactMobile != "") {
                url += '&contactMobile=' + vm.q.contactMobile;
            }
            if (vm.q.rentType != null && vm.q.rentType != "") {
                url += '&rentType=' + vm.q.rentType;
            }
            if (vm.q.businessNo != null && vm.q.businessNo != "") {
                url += '&businessNo=' + vm.q.businessNo;
            }
            if (vm.q.customerType != null && vm.q.customerType != "") {
                url += '&customerType=' + vm.q.customerType;
            }
            if (vm.q.paymentMethod != null && vm.q.paymentMethod != "") {
                url += '&paymentMethod=' + vm.q.paymentMethod;
            }
            if (vm.q.collectionType != null && vm.q.collectionType != "") {
                url += '&collectionType=' + vm.q.collectionType;
            }
            if (vm.q.carPlateNo != null && vm.q.carPlateNo != "") {
                url += '&carPlateNo=' + vm.q.carPlateNo;
            }
            if (vm.q.statistics != null && vm.q.statistics != "") {
                url += '&statistics=' + vm.q.statistics;
            }
            if (vm.q.orderStatus != null && vm.q.orderStatus != "") {
                url += '&orderStatus=' + vm.q.orderStatus;
            }
            if (vm.q.receivableDateType != null && vm.q.receivableDateType != "") {
                url += '&receivableDateType=' + vm.q.receivableDateType;
            }
            if (vm.q.receivableDateStr != null && vm.q.receivableDateStr != "") {
                url += '&receivableDateStr=' + vm.q.receivableDateStr;
            }
            if (vm.q.actualDateType != null && vm.q.actualDateType != "") {
                url += '&actualDateType=' + vm.q.actualDateType;
            }
            if (vm.q.actualDateStr != null && vm.q.actualDateStr != "") {
                url += '&actualDateStr=' + vm.q.actualDateStr;
            }

            if (vm.q.carBrandName != null && vm.q.carBrandName != "") {
                url += '&carBrandName=' + vm.q.carBrandName;
            }
            if (vm.q.carSeriesName != null && vm.q.carSeriesName != "") {
                url += '&carSeriesName=' + vm.q.carSeriesName;
            }
            if (vm.q.carModelName != null && vm.q.carModelName != "") {
                url += '&carModelName=' + vm.q.carModelName;
            }
            if (vm.q.stage != null && vm.q.stage != '') {
                url += '&stage=' + vm.q.stage;
            }
            if (vm.q.channelId != null && vm.q.channelId != '') {
                url += '&channelId=' + vm.q.channelId;
            }
            if (vm.q.payType != null && vm.q.payType != '') {
                url += '&payType=' + vm.q.payType;
            }
            if (vm.q.leaseId != null && vm.q.leaseId != '') {
                url += '&leaseId=' + vm.q.leaseId;
            }
            window.location.href = url;
        },
        cancel: function () {
            vm.customer = {};
            vm.receivables = {};
            layer.closeAll();
        },
        reload: function (event) {
            vm.searchTotalAmount();
            $('input[name=siam_one]').prop('checked', false);
            layui.form.render('checkbox');
            vm.ids = [];
            vm.count = 0;
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    status: vm.q.status,
                    carPlateNo: vm.q.carPlateNo,
                    customerName: vm.q.customerName,
                    contactMobile: vm.q.contactMobile,
                    businessNo: vm.q.businessNo,
                    rentType: vm.q.rentType,
                    receivablesNo: vm.q.receivablesNo,
                    paymentMethod: vm.q.paymentMethod,
                    repaymentMethod: vm.q.repaymentMethod,
                    recheckStatus: vm.q.recheckStatus,
                    collectionType: vm.q.collectionType,
                    customerType: vm.q.customerType,
                    contractNo: vm.q.contractNo,
                    receivableDateStr: vm.q.receivableDateStr,
                    receivableDateType: vm.q.receivableDateType,
                    actualDateType: vm.q.actualDateType,
                    actualDateStr: vm.q.actualDateStr,
                    carBrandName: vm.q.carBrandName,
                    carSeriesName: vm.q.carSeriesName,
                    carModelName: vm.q.carModelName,
                    stage: vm.q.stage,
                    leaseId: vm.q.leaseId,
                    channelId: vm.q.channelId,
                    payType: vm.q.payType
                    /* receivableDateStr: vm.q.receivableDateStr,
                     actualDateStr: vm.q.actualDateStr,*/
                    // customerName: vm.q.customerName,
                    // rentType: vm.q.rentType,
                    // businessNo: vm.q.businessNo,
                    // customerType: vm.q.customerType,
                    // paymentMethod: vm.q.paymentMethod,
                    // collectionType: vm.q.collectionType,
                    // carPlateNo: vm.q.carPlateNo,
                    // statistics: vm.q.statistics,
                    // orderStatus: vm.q.orderStatus,
                    // receivableDateStr: vm.q.receivableDateStr,
                    // actualDateStr: vm.q.actualDateStr,
                    // repairStartTimeType:vm.q.repairStartTimeType,
                    // repairEndTimeType:vm.q.repairEndTimeType,
                    // customerName:vm.q.customerName,
                    // orderCarNo:vm.q.orderCarNo,
                    // carBrandId :vm.q.carBrandId,
                    // carSeriesId :vm.q.carSeriesId,
                    // carModelId : vm.q.carModelId,
                }
            });
        },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        selectCar: function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/financial/selectCarInfo.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        selectCarOrder: function () {
            var index = layer.open({
                title: "选择车辆订单",
                type: 2,
                area: ['80%', '90%'],
                content: tabBaseURL + "modules/financial/selectCarOrder.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        }
    }
});

/**
 * 获取收款方信息
 */
function getCustomer() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/shouldrefund/getCustomer",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#customer').append(new Option(item.customerName, item.id));
            });
            layui.form.render("select");
        },
        error: function (error) {
            //  console.log(error);
        }
    });
}

/**
 * 获取渠道商信息
 */
function getDistributors() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/shouldrefund/getDistributors",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#customer').append(new Option(item.channelName, item.id));
            });
            layui.form.render("select");
        },
        error: function (error) {
            //  console.log(error);
        }
    });
}

/**
 * 上传附件
 */
function uploadAttachment(upload) {
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadInsuranceFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        multiple: true,
        number: 20,
        /*choose: function (obj) {
            PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                };
                vm.deliveryFileLst.push(fileTmp);
            });
        },*/
        done: function (res) {
            RemoveLoading();
            if (res.code != '0') {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
                deliveryFileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    operationId: sessionStorage.getItem("userId"),
                    operationName: sessionStorage.getItem("username"),
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                vm.deliveryFileLst.push(fileTmp);
                vm.deliveryFileLstId = 'fileLstId_' + uuid(6);
            });
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}

/**
 * 编辑上传附件
 */
function uploadEditAttachment(upload) {
    upload.render({
        elem: '#editDeliveryFile',
        url: baseURL + 'file/uploadInsuranceFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        multiple: true,
        number: 20,
        done: function (res) {
            RemoveLoading();
            if (res.code != '0') {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
                deliveryFileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    operationId: sessionStorage.getItem("userId"),
                    operationName: sessionStorage.getItem("username"),
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                vm.deliveryFileLst.push(fileTmp);
                vm.deliveryFileLstId = 'fileLstId_' + uuid(6);
            });
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}

/**
 * 编辑上传附件
 */
function uploadEditAttachment(upload) {
    upload.render({
        elem: '#editDeliveryFile',
        url: baseURL + 'file/uploadInsuranceFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        multiple: true,
        number: 20,
        done: function (res) {
            RemoveLoading();
            if (res.code != '0') {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
                deliveryFileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    operationId: sessionStorage.getItem("userId"),
                    operationName: sessionStorage.getItem("username"),
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                vm.deliveryFileLst.push(fileTmp);
                vm.deliveryFileLstId = 'fileLstId_' + uuid(6);
            });
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}
/**
 * 初始化
 */
function initializeData(type) {
    vm.type = type;
    if (type == 1) {
        vm.title = "新增应收账款";
        vm.status = "未付款";
        vm.amountLabel = "应收金额";
        vm.dateLabel = "应收时间";
    } else if (type == 2) {
        vm.title = "新增已收账款";
        vm.status = "已付款";
        vm.amountLabel = "实收金额";
        vm.dateLabel = "实收时间";
    }
    vm.receivables = {};
    vm.deliveryFileLst = [];
    $('#customer').html("<option value=''>请选择付款方</option>");
    vm.receivables.customerType = 5;
    vm.kehuShow = true;
    vm.qudaoShow = false;
    // getCustomer();
}

function checkAllStatusChange() {
    var count = receivablesDatas.length;
    receivablesDatas.forEach(function (d) {
        if ($.inArray(d.receivablesId, vm.ids) >= 0) {
            count--;
        }
    });
    $("input[name=siam_all]").prop("checked", count == 0 && receivablesDatas.length != 0);
}

var receivablesDatas;

function ysCheckedChange(data, id, checked) {
    if (checked) {
        /* if(data.uncheckedMoney!=null&&data.uncheckedMoney!=""){
             vm.ysMoney  = (parseFloat(vm.ysMoney)+parseFloat(data.uncheckedMoney)).toFixed(2);
         }*/

        if ($.inArray(id, vm.ids) < 0) {
            vm.ids.push(id);
        }

        vm.count = vm.ids.length;
    } else {
        if ($.inArray(id, vm.ids) >= 0) {
            /* if(data.uncheckedMoney!=null&&data.uncheckedMoney!=""){
                 vm.ysMoney  = (parseFloat(vm.ysMoney)-parseFloat(data.uncheckedMoney)).toFixed(2);
             }*/
            for (var i = 0; i < vm.ids.length; i++) {
                if (vm.ids[i] == id) {
                    vm.ids.splice(i, 1);
                    i = i - 1;
                }
            }
            vm.count = vm.ids.length;
        }
    }
}


function initClick() {
    //应收时间
    $('div[type="receivableDateType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="receivableDateType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "receivableDateStr", '');
        vm.q.receivableDateType = value;
    });
    //实收时间
    $('div[type="actualDateType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="actualDateType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "actualDateStr", '');
        vm.q.actualDateType = value;
    });
}

function initDate(laydate) {
    //查询条件应收时间
    laydate.render({
        elem: '#receivableDateStr',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="receivableDateType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.receivableDateStr = value;
            vm.q.receivableDateType = null;
        }
    });

    //查询条件实收时间
    laydate.render({
        elem: '#actualDateStr',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="actualDateType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.actualDateStr = value;
            vm.q.actualDateType = null;
        }
    });
}


function initVerify(form) {
    console.log("1231231231")
    form.verify({
        validate_receivableAmount: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                vm.verify = false;
                return "请输入修改后的账单金额";
            }
            console.log("----:", vm.verify, "232132===", vm.showDaiKouEdit)
            if (vm.showDaiKouEdit == true) {
                console.log("assad :", vm.receivables);
                if (vm.receivables.oldReceivableAmount <= vm.receivables.receivableAmount
                    || vm.receivables.receivableAmount < vm.receivables.receivedAmount) {
                    return "请按照要求重新输入修改的账单金额！";
                }
                // if(vm.receivables.oldReceivableAmount< vm.receivables.receivableAmount){
                //     return "修改账单金额大于了应收金额，请重新输入";
                // }
                // if(vm.receivables.receivableAmount < vm.receivables.receivedAmount){
                //     return "修改账单金额小于了已收金额，请重新输入";
                // }
            }
        },
    });
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
