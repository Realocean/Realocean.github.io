$(function () {
    initClick();
    // window.localStorage.removeItem("statusKey");
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
            url: baseURL + 'financial/shouldrefund/list',
            where: JSON.parse(JSON.stringify(vm.q)),
            cols: [[
                {title: '操作',  width:80, minWidth:80, templet: '#barTpl', fixed: 'left', align: "center"},
                {field: 'carNo', minWidth: 100,fixed: "left", align:"center",title: '车牌号'},
                {field: 'vinNo', minWidth: 100, title: '车架号'},
                {
                    field: 'brand', minWidth: 100, title: '品牌/车系/车型', templet: function (d) {
                    if ((d.brand == null || d.brand == '') && (d.carModel == null || d.carModel == '')) {
                        return "--";
                    } else {
                        return isEmpty(d.brand) + "/" + isEmpty(d.carModel);
                    }
                }
                },
                {field: 'refundNo', minWidth: 110, title: '退款单号'},
                {
                    field: 'refundStatus', minWidth: 80, title: '退款状态', templet: function (d) {
                    if (d.refundStatus) {
                        return '已退款';
                    } else {
                        return '待退款';
                    }

                }
                },
                {
                    field: 'leaseType', minWidth: 80, title: '租赁类型', templet: function (d) {
                    return isEmpty(getRentTypeStr(d.leaseType));

                }
                },
                {field: 'carOrderNo', minWidth: 110, title: '车辆订单号'},
                {field: 'refundPerson', minWidth: 130, title: '客户/渠道名称'},
                {
                    field: 'refundPersonType', minWidth: 80, title: '应退方类型', templet: function (d) {
                    if (d.refundPersonType == 1) {
                        return '客户/企业';
                    } else if (d.refundPersonType == 2) {
                        return '客户/个人';
                    } else if (d.refundPersonType == 3) {
                        return '渠道/企业';
                    } else if (d.refundPersonType == 4) {
                        return '渠道/个人';
                    } else if (d.refundPersonType == 5) {
                        return '企业';
                    } else if (d.refundPersonType == 6) {
                        return '渠道商';
                    } else {
                        return isEmpty(d.refundPersonType)
                    }
                }
                },
                {
                    field: 'lessorName', minWidth: 100, title: '出租方', templet: function (d) {
                    return isEmpty(d.lessorName);
                }
                },
                {
                    field: 'refundType', minWidth: 80, title: '退款类型', templet: function (d) {
                    if (d.refundType == 0) {
                        return '其他';
                    } else if (d.refundType == 1) {
                        return '换车结算单';
                    } else if (d.refundType == 2) {
                        return '退车结算单';
                    } else if (d.refundType == 3) {
                        return '备用车结算单';
                    } else if (d.refundType == 4) {
                        return '保证金';
                    } else if (d.refundType == 5) {
                        return '租金';
                    } else {
                        return isEmpty(d.refundTypeShow)
                    }
                }
                },
                {
                    field: 'refundAmount', minWidth: 100, title: '应退款金额', templet: function (d) {
                    return isEmpty(d.refundAmount);
                }
                },
                {
                    field: 'settleAmount', minWidth: 100, title: '结算扣款金额', templet: function (d) {
                    return isEmpty(d.settleAmount);
                }
                },
                {
                    field: 'actualRefund', minWidth: 100, title: '实际待退金额', templet: function (d) {
                        return isEmpty(d.actualRefund);
                    }
                },
                {
                    field: 'alreadyRefund', minWidth: 100, title: '已退金额', templet: function (d) {
                        return isEmpty(d.alreadyRefund);
                    }
                },
                {field: 'refundTime', minWidth: 100, title: '应退款日期'},
                {
                    field: 'actualTime', minWidth: 110, title: '实际处理日期', templet: function (d) {
                        return isEmpty(d.actualTime);
                    }
                },
                {
                    field: 'deductSubjects', minWidth: 100, title: '扣款科目/金额', templet: function (d) {
                    return isEmpty(d.deductSubjects);
                }
                },

                {
                    field: 'refundWay', minWidth: 100, title: '退款方式', templet: function (d) {
                    if (d.refundWay == 1) {
                        return "余额";
                    } else if (d.refundWay == 2) {
                        return "银行卡";
                    } else if (d.refundWay == 3) {
                        return "支付宝";
                    } else if (d.refundWay == 4) {
                        return "微信";
                    } else if (d.refundWay == 5) {
                        return "现金";
                    } else if (d.refundWay == 6) {
                        return "其他";
                    } else {
                        return isEmpty(d.refundWay)
                    }

                }
                },

            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });
    });

    /**
     * 监听下拉选、时间组件
     */
    layui.use(['form', 'laydate', 'upload'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        initDate(laydate);
        //售卖方
        form.on('select(lessor)', function (data) {
            vm.q.lessor = data.value;
        })
        //租赁类型
        form.on('select(leaseType)', function (data) {
            vm.q.leaseType = data.value;
        })
        //购买方类型
        form.on('select(lesseeType)', function (data) {
            vm.q.lesseeType = data.value;
        })
        //品牌车型
        form.on('select(brandCarModel)', function (data) {
            vm.q.brandCarModel = data.value;
        })
        //退款状态
        // form.on('select(refundState)',function (data) {
        //     vm.q.refundState = data.value;
        // })
        //退款类型
        form.on('select(refundType)', function (data) {
            vm.q.refundType = data.value
        })
        //扣款科目
        form.on('select(shouldRefundMethod)', function (data) {
            vm.q.shouldRefundMethod = data.value
        })
        //统计入口
        form.on('select(statistical)', function (data) {
            vm.q.statistical = data.value;
        })

        //退款方式
        form.on('select(refundWay)', function (data) {
            vm.shouldRefund.refundWay = data.value
        })
        //获取品牌车型下拉选
        selectBrandAndModel();
        //查询售卖方下拉选
        selectLessor();
        //应退日期
       /* laydate.render({
            elem: '#expect',
            type: 'date',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.expectTime = value;
            }
        });*/
        //实退日期
        /*laydate.render({
            elem: '#actual',
            type: 'date',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.actualTime = value;
            }
        });*/
        //监听退款类型
        form.on('select(refundWayRadio)', function (data) {
            vm.refundSave.refundWay = data.value;

        })
        form.render();
    });

    layui.use(['form', 'laydate', 'upload'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        var upload = layui.upload;

        //退款日期
        laydate.render({
            elem: '#expectRefund',
            type: 'datetime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.shouldRefund.refundTime = value;
            }
        });
        //监听退款收款方
        form.on('select(customer)', function (data) {
            vm.shouldRefund.customerId = data.value;
        })
        //监听单选按钮
        form.on('radio(radioCustomer)', function (data) {
            vm.shouldRefund.customerType = data.value;
            $('#customer').html("<option value=''>请选择收款方</option>");
            if (data.value == 5) {
                //获取收款方下拉选;
                getCustomer();
            } else if (data.value == 6) {
                //获取渠道商下拉选
                getDistributors();
            }
        });
        //附件
        uploadAttachment(upload);
        //退款凭证
        uploadAttachment1(upload);
        form.render();
    })


    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'refund') {
            vm.refund(data.id);
        } else if (layEvent === 'detail') {
            var id = data.id;
            vm.detail(id);
        }
    });

    if (vm.q.refundState == 0) {
        $("#div1").addClass('flex active1A51FF');
        $("#div1").children().children().addClass('details-tab-content-box-absolute-bottom')
        $("#div2").removeClass('active1A51FF');
        $("#div2").children().children().removeClass('details-tab-content-box-absolute-bottom');
        $("#div3").removeClass('active1A51FF');
        $("#div3").children().children().removeClass('details-tab-content-box-absolute-bottom');
    } else if (vm.q.refundState == 1) {
        $("#div2").addClass('flex active1A51FF');
        $("#div2").children().children().addClass('details-tab-content-box-absolute-bottom')
        $("#div1").removeClass('active1A51FF');
        $("#div1").children().children().removeClass('details-tab-content-box-absolute-bottom');
        $("#div3").removeClass('active1A51FF');
        $("#div3").children().children().removeClass('details-tab-content-box-absolute-bottom');
    }else if(vm.q.refundState == 2){
        $("#div3").addClass('flex active1A51FF');
        $("#div3").children().children().addClass('details-tab-content-box-absolute-bottom')
        $("#div1").removeClass('active1A51FF');
        $("#div1").children().children().removeClass('details-tab-content-box-absolute-bottom');
        $("#div2").removeClass('active1A51FF');
        $("#div2").children().children().removeClass('details-tab-content-box-absolute-bottom');
    }
});


var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carVinNo: null,
            carBrandName: null,
            carSeriesName: null,
            carModelName: null,
            lessorName: null,
            carOrderNo: null,
            leaseType: null,
            shouldRefundNo: null,
            refundType: null,
            lesseeType: null,
            lessor: null,
            contractNo: null,
            shouldRefundMethod: null,
            deductions: null,
            repairStarDateStr: null,
            repairEndDateStr: null,
            repairStartTimeType: null,
            repairEndTimeType: null,
            lesseeName: null,
            refundPerson:null,
            refundState: 0,
            statistical: null,
            refundStatus:0,
        },
        vehicleInfo: null,
        formName: null,
        refundState: null,
        showForm: false,
        refundForm: false,
        shouldRefund: {},
        refundFormData: {},
        refundSave: {},
        detailVO: {},
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        amountLabel: null,
        dateLabel: null,
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        refundAmount: 0,
        shouldRefundAmount: 0,
        reminderThresholdAmount: 0,
        isFilter: false,
        statusType:null,
    },
    created: function () {
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
                        vm.q.carBrandName = labelData[0];
                        vm.q.carSeriesName = labelData[1];
                        vm.q.carModelName = labelData[2];
                    }
                });
            });
        });
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param != null) {
            _this.q.refundState = param['statusKey'];
            if (_this.q.refundState != null && _this.q.refundState != '') {
                if (_this.q.refundState == '0') {
                    _this.q.repairStarDateStr = param['timeVal'];
                } else if (_this.q.refundState == '1') {
                    _this.q.repairEndDateStr = param['timeVal'];
                }else if (_this.q.refundState == '2') {

                }
            }
        }
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        getBusinessType:function (businessType){
            if(businessType != null && businessType!=''){
                if (businessType == '0'){
                    vm.q.refundStatus = 0;
                    vm.q.repairStarDateStr = window.localStorage.getItem("timeVal");
                    /*var type = window.localStorage.getItem("dateTimetype");
                    if(type == '1'){
                        vm.q.repairStartTimeType = 1;
                    } else if(type == '2'){
                        vm.q.repairStartTimeType = 3;
                    } else if(type == '3'){
                        vm.q.repairStartTimeType = 5;
                    } else if(type == '4'){
                        vm.q.repairStartTimeType = 7;
                    } else if(type == '5'){
                        vm.q.repairStartTimeType = null;
                    }*/
                }else if (businessType == '1'){
                    vm.q.refundStatus = 1;
                    vm.q.repairEndDateStr = window.localStorage.getItem("timeVal");
                   /* var type = window.localStorage.getItem("dateTimetype");
                    if(type == '1'){
                        vm.q.repairEndTimeType = 1;
                    } else if(type == '2'){
                        vm.q.repairEndTimeType = 3;
                    } else if(type == '3'){
                        vm.q.repairEndTimeType = 5;
                    } else if(type == '4'){
                        vm.q.repairEndTimeType = 7;
                    } else if(type == '5'){
                        vm.q.repairEndTimeType = null;
                    }*/
                }
                vm.statusType = 1;
                vm.reload();
            } else {
                vm.reload();
            }
        },


        div1: function () {
            if(vm.statusType != null){
                vm.q.repairStartTimeType = null;
                vm.q.repairEndTimeType = null;
                vm.q.receivableDateStr = null;
                vm.q.repairEndDateStr = null;
            }
            $("#div1").addClass('flex active1A51FF');
            $("#div1").children().children().addClass('details-tab-content-box-absolute-bottom')
            $("#div2").removeClass('active1A51FF');
            $("#div2").children().children().removeClass('details-tab-content-box-absolute-bottom');
            $("#div3").removeClass('active1A51FF');
            $("#div3").children().children().removeClass('details-tab-content-box-absolute-bottom');
            vm.q.refundState = 0;
            vm.q.refundStatus = 0;
            vm.reload();
            vm.reset();
        },
        div2: function () {
            if(vm.statusType != null){
                vm.q.repairStartTimeType = null;
                vm.q.repairEndTimeType = null;
                vm.q.repairStarDateStr = null;
                vm.q.repairEndDateStr = null;
            }
            $("#div2").addClass('flex active1A51FF');
            $("#div2").children().children().addClass('details-tab-content-box-absolute-bottom')
            $("#div1").removeClass('active1A51FF');
            $("#div1").children().children().removeClass('details-tab-content-box-absolute-bottom');
            $("#div3").removeClass('active1A51FF');
            $("#div3").children().children().removeClass('details-tab-content-box-absolute-bottom');
            vm.q.refundState = 1;
            vm.q.refundStatus = 1;
            vm.reset();
            vm.reload();
        },
        div3: function () {
            if(vm.statusType != null){
                vm.q.repairStartTimeType = null;
                vm.q.repairEndTimeType = null;
                vm.q.repairStarDateStr = null;
                vm.q.repairEndDateStr = null;
            }
            $("#div3").addClass('flex active1A51FF');
            $("#div3").children().children().addClass('details-tab-content-box-absolute-bottom')
            $("#div2").removeClass('active1A51FF');
            $("#div2").children().children().removeClass('details-tab-content-box-absolute-bottom');
            $("#div1").removeClass('active1A51FF');
            $("#div1").children().children().removeClass('details-tab-content-box-absolute-bottom');
            vm.q.refundState = 2;
            vm.q.refundStatus = 0;
            vm.reset();
            vm.reload();
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
        query: function () {
            vm.reload();
        },
        closeEditPage: function () {
            layui.closeAll();
        },
        reset: function () {
            vm.q.carVinNo = null;
            vm.q.carBrandName = null;
            vm.q.carSeriesName = null;
            vm.q.carModelName = null;
            vm.q.lessorName = null;
            vm.q.carOrderNo = null;
            vm.q.leaseType = null;
            vm.q.shouldRefundNo = null;
            vm.q.refundType = null;
            vm.q.lesseeType = null;
            vm.q.lessor = null;
            vm.q.contractNo = null;
            vm.q.shouldRefundMethod = null;
            vm.q.deductions = null;
            vm.q.repairStarDateStr = null;
            vm.q.repairEndDateStr = null;
            vm.q.repairStartTimeType = null;
            vm.q.repairEndTimeType = null;
            vm.q.lesseeName = null;
            vm.q.refundPerson = null;
            $("#carBrandSeriesModel").val('');
            $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
        },

        /**
         * 查询列表应退款金额/已退款金额
         */
        queryAmountTotal:function() {
            $.ajax({
                type: "POST",
                url: baseURL + "financial/shouldrefund/queryAmountTotal",
                data:JSON.parse(JSON.stringify(vm.q)),
                success: function (res) {
                    console.log(res);
                    vm.refundAmount = res.refundAmount;
                    vm.shouldRefundAmount = res.alreadyRefund;
                    vm.reminderThresholdAmount = res.reminderThresholdAmount;
                },
            });
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
        detail: function (id) {
            window.localStorage.setItem("refundId", id);
            var index = layer.open({
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/shouldRefundDetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("refundId", null);
                    // vm.reload();
                }
            });
            layer.full(index);
        },
        refund: function (id) {
            $.get(baseURL + "financial/shouldrefund/refund/" + id, function (res) {
                vm.refundFormData = res.data;
                var settleAmount = 0;
                if (vm.refundFormData.feeItemEntities) {
                    for (var i = 0; i < vm.refundFormData.feeItemEntities.length; i++) {
                        var item = vm.refundFormData.feeItemEntities[i];
                        if (item.feeProperty == 1){
                            settleAmount = sub(settleAmount, item.feeItemAmount);
                        } else if (item.feeProperty == 2){
                            settleAmount = add(settleAmount, item.feeItemAmount);
                        } else {}
                    }
                }
                vm.refundFormData.actualRefund = Math.abs(settleAmount);
                console.log("显示退款详情:{}", vm.refundFormData);
            });
            var index = layer.open({
                title: "退款",
                type: 1,
                content: $("#refundForm"),
                end: function () {
                    vm.refundForm = false;
                    layer.closeAll();
                }
            });
            vm.refundForm = true;
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "financial/shouldrefund/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
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
        cancel: function () {
            layer.closeAll();
        },
        save: function (event) {
            vm.shouldRefund.attachment = vm.deliveryFileLst;
            console.log("保存的数据:", vm.shouldRefund);

            if (vm.shouldRefund.refundTypeShow == null || vm.shouldRefund.refundTypeShow == '') {
                layer.msg('退款类型不能为空!', {icon: 7});
                return false;
            }

            if (vm.shouldRefund.customerId == null || vm.shouldRefund.customerId == '') {
                layer.msg('退款收款方不能为空!', {icon: 7});
                return false;
            }

            if (vm.shouldRefund.refundTime == null || vm.shouldRefund.refundTime == '') {
                layer.msg('退款日期不能为空!', {icon: 7});
                return false;
            }

            if (vm.shouldRefund.refundAmount == null || vm.shouldRefund.refundAmount == '') {
                layer.msg('退款金额不能为空!', {icon: 7});
                return false;
            }
            if (vm.shouldRefund.refundAmount != null && vm.shouldRefund.refundAmount != '') {
                if(vm.shouldRefund.refundAmount=='0' || vm.shouldRefund.refundAmount=='0.00'){
                    layer.msg('退款金额不能小于0', {icon: 7});
                    return false;
                }
            }
            //退款方式
            if (vm.shouldRefund.refundWay == null || vm.shouldRefund.refundWay == '') {
                layer.msg('退款方式不能为空!', {icon: 7});
                return false;
            }

            $.ajax({
                type: "POST",
                url: baseURL + "financial/shouldrefund/save",
                contentType: "application/json",
                data: JSON.stringify(vm.shouldRefund),
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
        },
        saveRefund: function (refundId) {
            console.log("退款数据:{}", vm.refundSave)
            vm.refundSave.refundId = refundId;
            vm.refundSave.attachment = vm.deliveryFileLst;
            $.ajax({
                type: "POST",
                url: baseURL + "financial/shouldrefund/saveRefund",
                contentType: "application/json",
                data: JSON.stringify(vm.refundSave),
                success: function (res) {
                    if (res.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(res.msg);
                    }
                }
            });
        },
        exports: function () {
            var url = baseURL + 'financial/shouldrefund/export?a=a';
            if (vm.q.refundState != null && vm.q.refundState !="") {
                url += '&refundState=' + vm.q.refundState;
            }
            if (vm.q.carVinNo != null && vm.q.carVinNo !="") {
                url += '&carVinNo=' + vm.q.carVinNo;
            }
            if (vm.q.carBrandName != null && vm.q.carBrandName !="") {
                url += '&carBrandName=' + vm.q.carBrandName;
            }
            if (vm.q.carSeriesName != null && vm.q.carSeriesName !="") {
                url += '&carSeriesName=' + vm.q.carSeriesName;
            }
            if (vm.q.carModelName != null && vm.q.carModelName !="") {
                url += '&carModelName=' + vm.q.carModelName;
            }
            if (vm.q.carOrderNo != null && vm.q.carOrderNo !="") {
                url += '&carOrderNo=' + vm.q.carOrderNo;
            }
            if (vm.q.leaseType != null && vm.q.leaseType !="") {
                url += '&leaseType=' + vm.q.leaseType;
            }
            if (vm.q.shouldRefundNo != null && vm.q.shouldRefundNo !="") {
                url += '&shouldRefundNo=' + vm.q.shouldRefundNo;
            }
            if (vm.q.refundType!= null && vm.q.refundType !="") {
                url += '&refundType=' + vm.q.refundType;
            }
            if (vm.q.lesseeType != null && vm.q.lesseeType !="") {
                url += '&lesseeType=' + vm.q.lesseeType;
            }
            if (vm.q.lessor != null && vm.q.lessor !="") {
                url += '&lessor=' + vm.q.lessor;
            }
            if (vm.q.shouldRefundMethod != null && vm.q.shouldRefundMethod !="") {
                url += '&shouldRefundMethod=' + vm.q.shouldRefundMethod;
            }
            if (vm.q.deductions != null && vm.q.deductions !="") {
                url += '&deductions=' + vm.q.deductions;
            }
            if (vm.q.repairStartTimeType != null && vm.q.repairStartTimeType !="") {
                url += '&repairStartTimeType=' + vm.q.repairStartTimeType;
            }
            if (vm.q.repairEndTimeType != null && vm.q.repairEndTimeType !="") {
                url += '&repairEndTimeType=' + vm.q.repairEndTimeType;
            }
            if (vm.q.refundPerson!= null && vm.q.refundPerson !="") {
                url += '&refundPerson=' + vm.q.refundPerson;
            }
            if(vm.q.repairStarDateStr != null && vm.q.repairStarDateStr != ""){
                url += '&repairStarDateStr=' + vm.q.repairStarDateStr;
            }
            if(vm.q.repairEndDateStr != null && vm.q.repairEndDateStr != ""){
                url += '&repairEndDateStr=' + vm.q.repairEndDateStr;
            }
            window.location.href = url;
        },
        reload: function (event) {
            vm.queryAmountTotal();
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    refundStatus:vm.q.refundStatus,
                    refundState:vm.q.refundState,
                    carVinNo:vm.q.carVinNo,
                    carBrandName:vm.q.carBrandName,
                    carSeriesName:vm.q.carSeriesName,
                    carModelName:vm.q.carModelName,
                    lessorName:vm.q.lessorName,
                    carOrderNo:vm.q.carOrderNo,
                    leaseType:vm.q.leaseType,
                    shouldRefundNo:vm.q.shouldRefundNo,
                    refundType:vm.q.refundType,
                    lesseeType:vm.q.lesseeType,
                    lessor:vm.q.lessor,
                    contractNo:vm.q.contractNo,
                    shouldRefundMethod:vm.q.shouldRefundMethod,
                    deductions:vm.q.deductions,
                    repairStarDateStr:vm.q.repairStarDateStr,
                    repairEndDateStr:vm.q.repairEndDateStr,
                    repairStartTimeType:vm.q.repairStartTimeType,
                    repairEndTimeType:vm.q.repairEndTimeType,
                    lesseeName:vm.q.lesseeName,
                    refundPerson:vm.q.refundPerson,
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
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/financial/selectCarInfo.html",
                end: function () {
                    layer.close(index);
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
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        }
    }
});


/**
 * 上传附件
 */
function uploadAttachment(upload) {
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        choose: function (obj) {
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
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.deliveryFileLst.forEach(function (value) {
                    if (value.id === deliveryFileIdTmp) value.url = res.data[0];
                });
                vm.deliveryFileLstId = 'deliveryFileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
            }
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
 * 上传附件
 */
function uploadAttachment1(upload) {
    upload.render({
        elem: '#addDeliveryFile1',
        url: baseURL + 'file/uploadFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        choose: function (obj) {
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
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.deliveryFileLst.forEach(function (value) {
                    if (value.id === deliveryFileIdTmp) value.url = res.data[0];
                });
                vm.deliveryFileLstId = 'deliveryFileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
            }
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
 * 查询售卖方
 */
function selectLessor() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectLessor",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#lessor').append(new Option(item.companyName, item.deptId));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/**
 * 查询品牌/车型
 */
function selectBrandAndModel() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectBrandAndModel",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#brand').append(new Option(item.brandAndModel, item.brandId));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}

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
            console.log(error);
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
            console.log(error);
        }
    });
}


/**
 * 初始化
 */
function initializeData(type) {
    vm.shouldRefund = {};
    if (type == 0) {
        vm.formName = '新增应退账款';
        vm.refundState = '待退款';
        vm.shouldRefund.refundStatus = 0;
        vm.amountLabel = "应退金额";
        vm.dateLabel = "应退时间";
    } else if (type == 1) {
        vm.formName = '新增已退账款';
        vm.refundState = '已退款';
        vm.shouldRefund.refundStatus = 1;
        vm.amountLabel = "已退金额";
        vm.dateLabel = "已退时间";
    }
    vm.deliveryFileLst = [];
    $('#customer').html("<option value=''>请选择付款方</option>");
    vm.shouldRefund.customerType = 5;
    getCustomer();
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
        type : 'date',
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
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.repairEndDateStr = value;
            vm.q.repairEndTimeType = null;

        }
    });
}