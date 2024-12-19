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
            autoSort: false,
            where: { carNo: vm.q.carNo },
            url: baseURL + 'maintenance/insurancemanage/list',
            cols: [[
                { title: '操作', width: 200, minWidth: 200, algin: 'center', templet: '#barTpl', fixed: "left", align: "center", rowspan: 2 },
                {
                    field: 'carNo', minWidth: 100, fixed: "left", align: "center", title: '车牌号', rowspan: 2, align: 'center', templet: function (d) {
                        if (d.carNo != null && d.carNo != "") {
                            return "<span style='color: blue' onclick = hrefCarView(\'" + d.carId + "\')>" + d.carNo + "</span>";
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'compulsoryCompanyId', minWidth: 100, align: 'center', title: '交强险', align: "center", colspan: 6 },
                { field: 'commercialCompanyId', minWidth: 100, align: 'center', title: '商业险', align: "center", colspan: 7 },
                { field: 'carrierCompanyId', minWidth: 100, align: 'center', title: '承运险', align: "center", colspan: 6 },
                { field: 'insuranceStatusStr', minWidth: 100, title: '维保状态', rowspan: 2, align: 'center' },
                {
                    field: 'flowApproveStatus', minWidth: 100, title: '审核状态', align: 'center', rowspan: 2, templet: function (d) {
                        if (d.flowApproveStatus != null && d.flowApproveStatus != "") {
                            return d.flowApproveStatus;
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'carStatusStr', minWidth: 100, align: 'center', title: '车辆状态', rowspan: 2 },
                {
                    field: 'rentType',
                    minWidth: 100,
                    align: 'center',
                    title: '订单类型',
                    rowspan: 2,
                    templet: function (d) {
                        return getRentTypeStr(d.rentType);

                    }
                },
                {
                    field: 'vinNo', minWidth: 180, title: '车架号', align: 'center', rowspan: 2, templet: function (d) {
                        if (d.vinNo != null && d.vinNo != "") {
                            return d.vinNo;
                        } else {
                            return "--";
                        }
                    }
                },

                {
                    field: 'carBrandModelName', minWidth: 150, align: 'center', rowspan: 2, title: '品牌/车系/车型', templet: function (d) {
                        if (d.carBrandModelName != null && d.carBrandModelName != "") {
                            return d.carBrandModelName;
                        } else {
                            if (d.carBrandName != null && d.carModelName != null) {
                                return d.carBrandName + "/" + d.carModelName;
                            } else if (d.carBrandName != null) {
                                return d.carBrandName;
                            } else {
                                return "--";
                            }
                        }
                    }
                },

                // {field:'vehicleUseStr', minWidth:100,align:'center', title: '车辆用途',rowspan:2},
                {
                    field: 'carBelongCompanyName', align: 'center', minWidth: 240, title: '车辆归属', rowspan: 2, templet: function (d) {
                        if (d.carBelongCompanyName != null && d.carBelongCompanyName != "") {
                            return d.carBelongCompanyName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'carDepotName', minWidth: 100, align: 'center', title: '所在仓库', rowspan: 2, templet: function (d) {
                        if (d.carDepotName != null && d.carDepotName != "") {
                            return d.carDepotName;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'carOwner', minWidth: 200, align: 'center', title: '车辆所有人', rowspan: 2, templet: function (d) {
                        if (d.carOwner != null && d.carOwner != "") {
                            return d.carOwner;
                        } else {
                            return "--";
                        }
                    }
                }

                // {field:'customerName',align:'center', minWidth:100, title: '客户名称',rowspan:2, templet:function (d) {
                //         if(d.customerName!=null && d.customerName!=""){
                //             if(d.customerTel != null && d.customerTel !=""){
                //                 return  d.customerName+"/"+d.customerTel;
                //             } else {
                //                 return d.customerName;
                //             }
                //         }else {
                //             return "--";
                //         }
                //     }},
                /*{field:'confirmedStr', minWidth:100, align:'center',title: '保单状态',rowspan:2},*/

            ],
                [
                    //交强险
                    {
                        field: 'jqPolicyPrescription', sort: true, minWidth: 130, title: '保单时效', align: 'center', templet: function (d) {
                            if (d.compulsorySuspension == 1) {
                                return "<span style='color: orange'>" + '停保' + "</span>";
                            } else {
                                if (d.jqPolicyPrescription != null) {
                                    if (d.jqPolicyPrescription == '0' || d.jqPolicyPrescription == '2' ) {
                                        return "<span style='color: red'>" + d.jqPrescription + "</span>";
                                    } else if (d.jqPolicyPrescription == '1') {
                                        return "<span style='color: green'>" + d.jqPrescription + "</span>";
                                    }
                                } else {
                                    return "--";
                                }
                            }
                        }
                    },
                    {
                        field: 'compulsoryStartTime', minWidth: 100, title: '开始时间', align: 'center', templet: function (d) {
                            if (d.compulsoryStartTime != null) {
                                var date = new Date(d.compulsoryStartTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }


                        }
                    },
                    {
                        field: 'compulsoryEndTime', minWidth: 100, title: '结束时间', align: 'center', templet: function (d) {
                            if (d.compulsoryEndTime != null) {
                                var date = new Date(d.compulsoryEndTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }
                        }
                    },
                    { field: 'compulsoryAmount', minWidth: 100, title: '费用/元', align: 'center' },
                    {
                        field: 'compulsoryCompany', minWidth: 180, title: '保险公司', align: 'center', templet: function (d) {
                            if (d.compulsoryCompany != null && d.compulsoryCompany != "") {
                                return d.compulsoryCompany;
                            } else {
                                return "--";
                            }
                        }
                    },
                    { field: 'compulsoryNo', minWidth: 180, title: '保单号', align: 'center' },
                    //商业险
                    {
                        field: 'syPolicyPrescription', sort: true, minWidth: 130, title: '保单时效', align: 'center', templet: function (d) {
                            if (d.commercialSuspension == 1) {
                                return "<span style='color: orange'>" + '停保' + "</span>";
                            } else {
                                if (d.syPolicyPrescription != null) {
                                    if (d.syPolicyPrescription == '0' || d.syPolicyPrescription == '2') {
                                        return "<span style='color: red'>" + d.syPrescription + "</span>";
                                    } else if (d.syPolicyPrescription == '1') {
                                        return "<span style='color: green'>" + d.syPrescription + "</span>";
                                    }
                                } else {
                                    return "--";
                                }
                            }
                        }
                    },
                    {
                        field: 'commercialStartTime', minWidth: 100, align: 'center', title: '开始时间', templet: function (d) {
                            if (d.commercialStartTime != null) {
                                var date = new Date(d.commercialStartTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }
                        }
                    },
                    {
                        field: 'commercialEndTime', minWidth: 100, align: 'center', title: '结束时间', templet: function (d) {
                            if (d.commercialEndTime != null) {
                                var date = new Date(d.commercialEndTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }
                        }
                    },
                    {
                        field: 'insuranceTypeName', minWidth: 200, title: '险种', align: 'center', templet: function (d) {
                            if (d.insuranceTypeName != null && d.insuranceTypeName != "") {
                                return d.insuranceTypeName;
                            } else {
                                return "--";
                            }
                        }
                    },
                    { field: 'commercialAmount', minWidth: 100, title: '费用/元', align: 'center' },
                    {
                        field: 'compulsoryCompany', minWidth: 180, title: '保险公司', align: 'center', templet: function (d) {
                            if (d.commercialCompany != null && d.commercialCompany != "") {
                                return d.commercialCompany;
                            } else {
                                return "--";
                            }
                        }
                    },
                    { field: 'commercialNo', minWidth: 180, title: '保单号', align: 'center' },
                    //交强险
                    {
                        field: 'cyPolicyPrescription', sort: true, minWidth: 130, title: '保单时效', align: 'center', templet: function (d) {
                            if (d.carrierSuspension == 1) {
                                return "<span style='color: orange'>" + '停保' + "</span>";
                            } else {
                                if (d.cyPolicyPrescription != null) {
                                    if (d.cyPolicyPrescription == '0' || d.cyPolicyPrescription == '2' ) {
                                        return "<span style='color: red'>" + d.cyPrescription + "</span>";
                                    } else if (d.cyPolicyPrescription == '1') {
                                        return "<span style='color: green'>" + d.cyPrescription + "</span>";
                                    }
                                } else {
                                    return "--";
                                }
                            }
                        }
                    },
                    {
                        field: 'carrierStartTime', minWidth: 100, title: '开始时间', align: 'center', templet: function (d) {
                            if (d.carrierStartTime != null) {
                                var date = new Date(d.carrierStartTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }
                        }
                    },
                    {
                        field: 'carrierEndTime', minWidth: 100, title: '结束时间', align: 'center', templet: function (d) {
                            if (d.carrierEndTime != null) {
                                var date = new Date(d.carrierEndTime).format("yyyy-MM-dd");
                                return date;
                            } else {
                                return "--";
                            }
                        }
                    },
                    { field: 'carrierAmount', minWidth: 100, title: '费用/元', align: 'center' },
                    {
                        field: 'carrierCompany', minWidth: 180, title: '保险公司', align: 'center', templet: function (d) {
                            if (d.carrierCompany != null && d.carrierCompany != "") {
                                return d.carrierCompany;
                            } else {
                                return "--";
                            }
                        }
                    },
                    { field: 'carrierNo', minWidth: 180, title: '保单号', align: 'center' },
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
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            }
        });

        layui.table.on('sort(grid)', function (obj) {
            for (var key in vm.q) {
                if (key.endsWith('Sort')) {
                    vm.q[key] = null;
                }
            }
            vm.q[obj.field + 'Sort'] = obj.type;
            vm.reload(obj);

            console.log('服务端排序。order by ' + obj.field + ' ' + obj.type);
            // tableStyleAmendment();
        });
    });


    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        //应收日期
        var compulsoryStartTime = laydate.render({
            elem: '#receivableTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.fineForm.receivableTime = value;

            }
        });
        //应付日期
        var compulsoryStartTime = laydate.render({
            elem: '#copeWithTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.fineForm.copeWithTime = value;
            }
        });
        init(layui);
        form.render();
    });

    //所属部门
    layui.form.on('select(deptIdSelect)', function (data) {
        vm.q.deptId = data.value;
    });
    //品牌车型
    layui.form.on('select(carModelSelect)', function (data) {
        vm.q.carBrandModelName = data.value;
    });
    //车辆状态
    layui.form.on('select(carStatusSelect)', function (data) {
        vm.q.carStatus = data.value;
    });
    //车辆用途
    layui.form.on('select(vehicleUseSelect)', function (data) {
        vm.q.vehicleUse = data.value;
    });
    //保单状态
    layui.form.on('select(confirmedSelect)', function (data) {
        vm.q.confirmed = data.value;
    });
    // 付款对象
    layui.form.on('select(payObjectNameSelect)', function (data) {
        vm.q.payObjectName = data.value;
    });
    // 保险公司
    layui.form.on('select(compulsoryCaompanySelect)', function (data) {
        vm.q.compulsoryCaompanyName = data.value;
    });
    // 商业险险种
    layui.form.on('select(insuranceTypeSelect)', function (data) {
        vm.q.insuranceTypeName = data.value;
    });

    layui.form.on('select(jqPolicyPrescriptionSelect)', function (data) {
        vm.q.jqPolicyPrescription = data.value;
    });
    layui.form.on('select(syPolicyPrescriptionSelect)', function (data) {
        vm.q.syPolicyPrescription = data.value;
    });

    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //交强险开始结束时间
        /* laydate.render({
             elem: '#compulsoryEndTimeSearch',
             range:'/',
             trigger: 'click',
             done: function (value, date, endDate) {
                 vm.q.compulsoryEndTimeSearch = value;
             }
         });

         //商业险开始结束结束时间
         laydate.render({
             elem: '#commercialEndTimeSearch',
             range:'/',
             trigger: 'click',
             done: function (value, date, endDate) {
                 vm.q.commercialEndTimeSearch = value;
             }
         });*/
    });

    // 车辆保险导入
    layui.use(["element", "laypage", "layer", "upload"], function () {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#imp',
            url: baseURL + 'maintenance/insurancemanage/import',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            done: function (r) {
                if (r.resultFlag == 3 || r.resultFlag == 1) {
                    alert(r.msg);
                    layer.confirm(r.msg, {
                        btn: ['下载导入错误数据', '取消'] //可以无限个按钮
                    }, function (index, layero) {
                        window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo=' + r.numberNo;
                    }, function (index) {
                        layer.close(index);
                    });
                } else {
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function (index, layero) {
                        window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo=' + r.numberNo;
                    }, function (index) {
                        layer.close(index);
                    });
                }
                vm.reload();
            }
        });
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.commercialApplyNo, data.jqxId, data.syxId);
        } else if (layEvent === 'del') {
            var insuranceManageId = [data.insuranceManageId];
            vm.del(insuranceManageId);
        } else if (layEvent === 'view') {
            vm.view(data.insuranceManageId, data.syxId, data.policyApplyNo, data.carNo, data.carId,data.commercialApplyNo);
        } else if (layEvent === 'renewal') {
            //续保
            vm.renewal(data.jqxId,data.syxId, data.commercialApplyNo, data.syPolicyPrescription, data.syxConfigDay, data.carId);
            // vm.update(data.commercialApplyNo, data.insuranceManageId, data.syxId);
        } else if (layEvent === 'suspension') {
            //停保
            vm.suspension(data.insuranceManageId, data.syxId, data.commercialApplyNo, data.syPolicyPrescription, data.syxConfigDay);
        } else if (layEvent === 'reinsurance') {
            //复保
            vm.reinsurance(data.insuranceManageId, data.syxId, data.commercialEndTime, data.compulsoryEndTime, data.syxConfigDay);
        } else if (layEvent === 'delete') {
            vm.delete(data.insuranceManageId);
        } else if (layEvent === 'fine') {
            vm.fineChange(data.carId,data.insuranceManageId)
        }

    });

    layui.upload.render({
        elem: '#callbackupload',
        url: baseURL + 'maintenance/insurancemanage/distinguish?path=baodan',
        field: 'multipartFile',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.zip',
        exts: 'zip', //
        before: function (obj) {
            layer.msg('数据识别中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (res) {
            if (res.errorMsg && res.errorMsg.length > 0) {
                let content = ''
                res.errorMsg.map((item, index) => {
                    if (index + 1 !== res.errorMsg.length) {
                        content += (index + 1) + '、' + item + ';' + "\r\n"
                    } else {
                        content += (index + 1) + '、' + item + ';'
                    }
                })
                downloadTxt('识别保单错误日志', content);
            }
            layer.close(layer.msg());
            if (parseInt(res.code) != 0) {
                layer.msg('文件解析失败:' + res.msg, { icon: 5 });
                return false;
            }
            layer.msg('文件识别完成', { icon: 6 });
            vm.query();
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', { icon: 5 });
        }
    });
    layui.form.on('switch(switchTest1)', function () {
        let a = $.trim($('#contractSwitch1').is(":checked"));
        console.log(a, 1111111111)
        if (a == 'true') {
            Vue.set(vm.fineForm, "isGenerateReceivableBill", 1);
        } else {
            Vue.set(vm.fineForm, "isGenerateReceivableBill", 0);
        }

    });
    layui.form.on('switch(switchTest2)', function () {
        let a = $.trim($('#contractSwitch2').is(":checked"));
        console.log(a, 222222222)
        if (a == 'true') {
            Vue.set(vm.fineForm, "isGeneratePayableBill", 1);
        } else {
            Vue.set(vm.fineForm, "isGeneratePayableBill", 0);
        }

    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carNo: null,
            deptId: null,
            deptName: null,
            carBrandModelName: null,
            customerName: null,
            policyApplyNo: null,
            departureNo: null,
            carStatus: null,
            vehicleUse: null,
            cityName: null,
            confirmed: null,
            compulsoryEndTimeSearch: null,
            commercialEndTimeSearch: null,
            carDepotId: null,
            carDepotName: null,
            carBrandId: null,
            carSeriesId: null,
            carModelId: null,
            payObjectName: null,
            jqPolicyPrescription: null,
            syPolicyPrescription: null,
            jqPolicyPrescriptionSort: null,
            syPolicyPrescriptionSort: null,
            compulsoryCaompanyName: null,
            insuranceTypeName: null,
            carOwner: null
        },
        showForm: false,
        insuranceManage: {},
        allCarModels: [],
        payObject: [],
        compulsoryCaompany: [],
        insuranceTypeList: [],
        selectData: [],
        //仓库数据源
        warehouseData: {},
        isFilter: false,
        showInsurance1: false,
        fineForm: {
            copeWithMoney: '',
            copeWithTime: '',
            receivableMoney: "",
            receivableTime: "",
            userInfo: '',
            supplierInfo: "",
            isGenerateReceivableBill: 0,
            isGeneratePayableBill: 0,
        }, // 超险罚款
        fineStaues: null,
    },
    updated: function () {
        layui.form.render();
    },

    created: function () {
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form', "jquery", "cascader", "form"], function () {
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#a",
                    data: vm.selectData,
                    success: function (valData, labelData) {
                        vm.q.carBrandId = valData[0];
                        vm.q.carSeriesId = valData[1];
                        vm.q.carModelId = valData[2];
                    }
                });
            });
        });
        var _this = this;
        /*$.getJSON(baseURL + "maintenance/insurancemanage/listBrandAndModel", function (r) {
            console.log(r.listData)
            _this.allCarModels = r.listData;
        });*/
        // 获取付款对象
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/" + "insurancePaymentTarget",
            contentType: "application/json",
            data: null,
            success: function (r) {
                _this.payObject = r.dict;
            }
        });
        //初始化加载保险公司
        $.ajax({
            type: "POST",
            url: baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList",
            contentType: "application/json",
            data: null,
            success: function (r) {
                //交强险
                _this.compulsoryCaompany = r.compulsoryInsuranceList;
            }
        });
        //获取险种类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/" + "insuranceType",
            contentType: "application/json",
            data: null,
            success: function (r) {
                //险种集合
                _this.insuranceTypeList = r.dict;
            }
        });
        if (parent.layer.boxParams != null) {
            var param = parent.layer.boxParams.boxParams;
            if (param != null) {
                _this.q.carNo = param.vinNo;
            }
        }
    },

    methods: {
        // 提交超险罚款
        fineCommit() {
            let fineParams = {}
            fineParams.maintenanceId = vm.fineForm.maintenanceId;
            fineParams.maintenanceType =  vm.fineForm.maintenanceType;
            fineParams.carId = vm.fineForm.carId;
            // this.fineForm.supplierInfo = 1
            // this.fineForm.userInfo = 1
            if (this.fineForm.userInfo && this.fineForm.supplierInfo) {
                if (this.fineForm.userInfo && this.fineForm.supplierInfo
                    && this.fineForm.copeWithMoney && this.fineForm.receivableMoney
                    && this.fineForm.copeWithTime && this.fineForm.receivableTime) {
                    fineParams.customerId = this.fineForm.customerId
                    fineParams.customerName = this.fineForm.customerName
                    fineParams.customerPhone = this.fineForm.customerPhone
                    fineParams.supplierId = this.fineForm.supplierId
                    fineParams.supplierName = this.fineForm.supplierName
                    fineParams.supplierPhone = this.fineForm.supplierPhone

                    fineParams.payableAmount = this.fineForm.copeWithMoney
                    fineParams.receivableAmount = this.fineForm.receivableMoney
                    fineParams.payableTime = this.fineForm.copeWithTime
                    fineParams.receivableTime = this.fineForm.receivableTime
                    fineParams.isGenerateReceivableBill = this.fineForm.isGenerateReceivableBill
                    fineParams.isGeneratePayableBill = this.fineForm.isGeneratePayableBill
                } else {
                    layer.alert('请填写所有信息', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                }

            } else {
                if (this.fineForm.userInfo) {
                    console.log('this.fineForm========》', this.fineForm)

                    if (this.fineForm.userInfo && this.fineForm.receivableTime && this.fineForm.receivableMoney) {

                        fineParams.customerId = this.fineForm.customerId
                        fineParams.customerName = this.fineForm.customerName
                        fineParams.customerPhone = this.fineForm.customerPhone

                        fineParams.receivableAmount = this.fineForm.receivableMoney
                        fineParams.receivableTime = this.fineForm.receivableTime
                        fineParams.isGenerateReceivableBill = this.fineForm.isGenerateReceivableBill

                    } else {
                        layer.alert('请填写所有客户信息', {
                            icon: 5,
                            title: "提示"
                        });
                        return false;
                    }
                } else if (this.fineForm.supplierInfo) {
                    if (this.fineForm.supplierInfo && this.fineForm.copeWithTime && this.fineForm.copeWithMoney) {
                        fineParams.supplierId = this.fineForm.supplierId
                        fineParams.supplierName = this.fineForm.supplierName
                        fineParams.supplierPhone = this.fineForm.supplierPhone

                        fineParams.payableAmount = this.fineForm.copeWithMoney
                        fineParams.payableTime = this.fineForm.copeWithTime
                        fineParams.isGeneratePayableBill = this.fineForm.isGeneratePayableBill
                    } else {
                        layer.alert('请填写所有供应商信息', {
                            icon: 5,
                            title: "提示"
                        });
                        return false;
                    }
                } else {
                    layer.alert('请填写所有信息', {
                        icon: 5,
                        title: "提示"

                    });
                    return false;
                }
            }
            var url = "maintenance/insurancemanage/saveFine";
            console.log(fineParams, 66666666666);
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(fineParams),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            vm.cancellationCommit()
                            // layer.close(vm.fineStaues);
                        });
                    }else{
                        alert(r.msg);
                        vm.cancellationCommit()
                        // layer.close(vm.fineStaues);
                    }
                    vm.reload()
                }
            });

        },
        // 取消超险罚款
        cancellationCommit() {
            this.fineForm.userInfo = ''
            this.fineForm.supplierInfo = ''
            this.fineForm.copeWithMoney = ''
            this.fineForm.receivableMoney = ''
            this.fineForm.copeWithTime = ''
            this.fineForm.receivableTime = ''
            this.fineForm.isGenerateReceivableBill = 0
            this.fineForm.isGeneratePayableBill = 0
            layer.close(vm.fineStaues);
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
        chooseWarehouse: function () {
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function () {
                    vm.q = Object.assign({}, vm.q, {
                        carDepotId: vm.warehouseData.warehouseId,
                        carDepotName: vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.q, "deptId", treeNode.deptId);
            Vue.set(vm.q, "deptName", treeNode.name);
            layer.closeAll();
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var insuranceManageIds = [];
            $.each(list, function (index, item) {
                insuranceManageIds.push(item.insuranceManageId);
            });
            return insuranceManageIds;
        },
        //查询
        query: function () {
            vm.reload();
        },
        //重置
        reset: function () {
            resetNULL(vm.q);

            $("#a").val('');
            $('div[type="commercialEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="compulsoryEndTimeType"]>div').removeClass('task-content-box-tab-child-active');

        },
        //查看方法
        view: function (jqxId, syxId, policyApplyNo, carNo, carId,commercialApplyNo) {
            var index = layer.open({
                title: "维保管理 > 保险管理 > 查看保险单",
                type: 2,
                boxParams: { jqxId: jqxId, syxId: syxId, policyApplyNo: policyApplyNo, carNo: carNo, carId: carId,commercialApplyNo:commercialApplyNo },
                content: tabBaseURL + 'modules/maintenance/insurancemanagedetail.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },

        //续保方法
        renewal: function (jqxId, syxId, policyApplyNo, type, syxConfigDay, carId) {
            // window.localStorage.setItem("jqxId", jqxId);
            // window.localStorage.setItem("syxId", syxId);
            // window.localStorage.setItem("policyApplyNo", policyApplyNo);
            // window.localStorage.setItem("type", type);
            // window.localStorage.setItem("syxConfigDay", syxConfigDay);
            // var index = layer.open({
            //     title: "维保管理 > 保险管理 > 续保",
            //     type: 2,
            //     content: tabBaseURL + 'modules/maintenance/insurancemanagerenewal.html',
            //     end: function () {
            //         layer.close(index);
            //         window.localStorage.setItem("jqxId", null);
            //         window.localStorage.setItem("syxId", null);
            //         window.localStorage.setItem("policyApplyNo", null);
            //         window.localStorage.setItem("type", null);
            //         window.localStorage.setItem("syxConfigDay", null);
            //         // vm.reload();
            //     }
            // });
            // layer.full(index);

            let param ={
                carId:carId
            };
            let url=tabBaseURL+'modules/maintenance/insurancemanageadd.html';
            let title='车辆续保';
            addTab(url,title,param);
        },
        //停保方法
        suspension: function (jqxId, syxId, policyApplyNo, type, syxConfigDay) {
            window.localStorage.setItem("jqxId", jqxId);
            window.localStorage.setItem("syxId", syxId);
            window.localStorage.setItem("policyApplyNo", policyApplyNo);
            window.localStorage.setItem("type", type);
            window.localStorage.setItem("syxConfigDay", syxConfigDay);
            var index = layer.open({
                title: "维保管理 > 保险管理 > 停保",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/insurancemanagesuspension.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("jqxId", null);
                    window.localStorage.setItem("syxId", null);
                    window.localStorage.setItem("policyApplyNo", null);
                    window.localStorage.setItem("type", null);
                    window.localStorage.setItem("syxConfigDay", null);
                    // vm.reload();
                }
            });
            layer.full(index);
        },
        //复保方法
        reinsurance: function (jqxId, syxId, commercialEndTime, compulsoryEndTime, syxConfigDay) {
            window.localStorage.setItem("jqxId", jqxId);
            window.localStorage.setItem("syxId", syxId);
            window.localStorage.setItem("compulsoryEndTime", compulsoryEndTime);
            window.localStorage.setItem("commercialEndTime", commercialEndTime);
            var index = layer.open({
                title: "维保管理 > 保险管理 > 复保",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/insurancemanagereinsurance.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("jqxId", null);
                    window.localStorage.setItem("syxId", null);
                    window.localStorage.setItem("compulsoryEndTime", null);
                    window.localStorage.setItem("commercialEndTime", null);
                    // vm.reload();
                }
            });
            layer.full(index);
        },
        //新增
        add: function () {
            var index = layer.open({
                title: "新增保险单",
                type: 2,
                content: tabBaseURL + "modules/maintenance/insurancemanageadd.html",
                end: function () {
                    layer.closeAll();
                    // vm.reload();
                }
            });
            layer.full(index);
        },

        distinguish: function () {
            let _this = this;
            var param = {
                callback: function () {
                    let elebutton = document.getElementById("callbackupload");
                    elebutton.click()

                    layer.close(index)
                }
            };
            // window.data = {a:111,b:111,c:111,d:111,e:111};
            var index = layer.open({
                type: 2,
                title: '保单识别导入',
                area: ['900px', '550px'],
                boxParams: param,
                content: tabBaseURL + 'modules/maintenance/importinsurancedialog.html',
                end: function () {
                    // layer.close(index);
                    // _this.reload()
                },
            });
        },

        //修改
        update: function (policyApplyNo, jqxId, syxId) {
            window.localStorage.setItem("jqxId", jqxId);
            window.localStorage.setItem("syxId", syxId);
            window.localStorage.setItem("policyApplyNo", policyApplyNo);
            var index = layer.open({
                title: "维保管理 > 保险管理 > 编辑保险单",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/insurancemanageedit.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("jqxId", null);
                    window.localStorage.setItem("syxId", null);
                    window.localStorage.setItem("policyApplyNo", null);
                    // vm.reload();
                }
            });
            layer.full(index);
        },
        //删除
        del: function (insuranceManageIds) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "insurancemanage/insurancemanage/delete",
                    contentType: "application/json",
                    data: JSON.stringify(insuranceManageIds),
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
        //导出
        exports: function () {
            var url = urlParamByObj(baseURL + 'maintenance/insurancemanage/export', vm.q);
            window.location.href = url;
        },
        //重新加载
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        // 高级筛选
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },

        delete: function (insuranceManageId) {
            confirm('确定要删除此保单吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/insurancemanage/delete?insuranceManageId=" + insuranceManageId,
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
        // 超险罚款
        fineChange: function (carId,insuranceManageId) {
            $.ajax({
                type: "GET",
                url: baseURL + "maintenance/insurancemanage/excessRiskInfo?carId="+carId,
                contentType: "application/json",
                success: function (r) {
                    if (r.code == 0) {
                        vm.fineForm.userInfo = null;
                        vm.fineForm.supplierInfo = null;
                        vm.fineForm.receivableMoney = null;
                        vm.fineForm.copeWithMoney = null;
                        vm.fineForm.receivableTime = null;
                        vm.fineForm.copeWithTime = null;
                        vm.fineForm.accountsReceivable = null;
                        vm.fineForm.payable = null;

                        vm.fineForm.maintenanceId = insuranceManageId;
                        vm.fineForm.maintenanceType = 1;
                        vm.fineForm.carId = carId;

                        vm.fineForm.customerId = r.data.customerId;
                        vm.fineForm.customerName = r.data.customerName;
                        vm.fineForm.customerPhone = r.data.customerPhone;
                        vm.fineForm.userInfo = r.data.customerName;
                        if(r.data.customerPhone != null && r.data.customerPhone != ''){
                            vm.fineForm.userInfo += ' / '+r.data.customerPhone;
                        }
                        vm.fineForm.supplierId = r.data.supplierId;
                        vm.fineForm.supplierName = r.data.supplierName;
                        vm.fineForm.supplierPhone = r.data.supplierPhone;
                        vm.fineForm.supplierInfo = r.data.supplierName;
                        if(r.data.supplierPhone != null && r.data.supplierPhone != ''){
                            vm.fineForm.supplierInfo += ' / '+r.data.supplierPhone;
                        }

                        var index = layer.open({
                            title: "超险罚款",
                            type: 1,
                            content: $("#showInsurance1"),
                            end: function () {
                                vm.showInsurance1 = false;
                            }
                        });
                        layer.full(index);
                        vm.fineStaues = index
                        console.log(index, 7777777)
                    } else {
                        alert(r.msg);
                    }
                }
            });

        }
    }
});
//合并开始
function merge(res) {
    var data = res.data;
    var mergeIndex = 0;//定位需要添加合并属性的行数
    var mark = 1; //这里涉及到简单的运算，mark是计算每次需要合并的格子数
    var _number = 1;//保持序号列数字递增
    var columsName = ['compulsoryNo', 'jqPolicyPrescription', 'compulsoryStartTime', 'compulsoryEndTime', 'compulsoryAmount', 'commercialNo', 'syPolicyPrescription', 'insuranceTypeName', 'commercialStartTime', 'commercialEndTime', 'commercialAmount'];//需要合并的列名称
    var columsIndex = [26, 39, 28, 25, 21, 17, 44, 36, 19, 15, 11];//需要合并的列索引值
    var mergeCondition = 'id';//需要合并的 首要条件  在这个前提下进行内容相同的合并
    var tdArrL = $('.layui-table-fixed-l > .layui-table-body').find("tr");//序号列左定位产生的table tr
    var tdArrR = $('.layui-table-fixed-r > .layui-table-body').find("tr");//操作列定右位产生的table tr
    for (var k = 0; k < columsName.length; k++) { //这里循环所有要合并的列
        var trArr = $(".layui-table-main>.layui-table").find("tr");//所有行
        for (var i = 1; i < res.data.length; i++) { //这里循环表格当前的数据
            if (data[i][mergeCondition] === data[i - 1][mergeCondition]) {
                var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]);//获取当前行的当前列
                var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]);//获取相同列的第一列

                if (data[i][columsName[k]] === data[i - 1][columsName[k]]) { //后一行的值与前一行的值做比较，相同就需要合并
                    mark += 1;
                    tdPreArr.each(function () {//相同列的第一列增加rowspan属性
                        $(this).attr("rowspan", mark);
                    });
                    tdCurArr.each(function () {//当前行隐藏
                        $(this).css("display", "none");
                    });
                } else {
                    mergeIndex = i;
                    mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
                }
            } else {
                mergeIndex = i;
                mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
            }
        }
        mergeIndex = 0;
        mark = 1;
    }
}

function init(layui) {
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) { }

function initClick() {
    $('div[type="commercialEndTimeType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="commercialEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        vm.q.commercialEndTimeType = value;
    });

    $('div[type="compulsoryEndTimeType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="compulsoryEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        vm.q.compulsoryEndTimeType = value;
    });
}

function initDate(laydate) {
    // 交强险查询时间
    laydate.render({
        elem: '#compulsoryEndTimeSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="compulsoryEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.compulsoryEndTimeSearch = value;
        }
    });
    // 商业险查询时间
    laydate.render({
        elem: '#commercialEndTimeSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="commercialEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.commercialEndTimeSearch = value;
        }
    });
}

function initData() { }
/*
* fileName: txt文件名称
* content：文件内容(string)
*/
function downloadTxt(fileName, content) {
    let a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + content
    a.download = fileName
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function hrefCarView(carId) {
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

