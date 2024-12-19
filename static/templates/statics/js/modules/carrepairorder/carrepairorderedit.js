$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form', 'layedit', 'laydate', 'upload', 'soulTable'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.verify({
            carNoVerify: function (value) {
                if ((vm.carRepairOrder.carNo == "" || vm.carRepairOrder.carNo == null) && (vm.carRepairOrder.vinNo == "" || vm.carRepairOrder.vinNo == null)) {
                    return '请通过车牌号选择或者通过车架号选择车辆信息！';
                }
            },
            vinNoVerify: function (value) {
                if ((vm.carRepairOrder.carNo == "" || vm.carRepairOrder.carNo == null) && (vm.carRepairOrder.vinNo == "" || vm.carRepairOrder.vinNo == null)) {
                    return '请通过车牌号选择或者通过车架号选择车辆信息！';
                }
            },
            /*  repairStartDateVerify: function (value) {
                if (value == "" || value == null) {
                    return '维修开始时间不能为空';
                }
            },
            faultDescVerify: function (value) {
                if (value == "" || value == null) {
                    return '故障描述不能为空';
                }

            },*/
            repairShopQuotationVerify: function (value) {
                var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
                if (value != "" && value != null) {
                    if (!reg.test(value)) {
                        return '金额输入有误请重新输入';
                    }
                }
            },
            /*repairContentVerify: function (value) {
                if (value == "" || value == null) {
                    return '维修内容不能为空';
                }
            },*/
            userPayVerify: function (value) {
                var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
                /*if (value == "" || value == null) {
                    return '维修价格用户支付金额不能为空';
                }*/
                if (value != "" && value != null) {
                    if (!reg.test(value)) {
                        return '金额输入有误请重新输入';
                    }
                }
            },
            platformPayVerify: function (value) {
                var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
                if (value != "" && value != null) {
                    if (!reg.test(value)) {
                        return '金额输入有误请重新输入';
                    }
                }
            },
            insurancePayVerify: function (value) {
                var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
                if (value != "" && value != null) {
                    if (!reg.test(value)) {
                        return '金额输入有误请重新输入';
                    }
                }
            },
            /* isSpareCarVerify: function (value) {
                 if (value == "" || value == null) {
                     return '是否提供备用车不能为空';
                 }
             },
             spareCarNoVerify: function (value) {
                 if (value == "" || value == null) {
                     return '备用车车牌号不能为空';
                 }
             }*/

        });


        BpmChart({ instanceId: vm.instanceId }).initView();


        $("#recall").on('click', function () {
            vm.recall();
        });
        form.render();
    });
    //是否提供备用车
    layui.form.on('select(isSpareCar)', function (data) {
        vm.carRepairOrder.isSpareCar = data.value;
        //如果备用车选择否则清空备用车车牌号
        if (data.value == "2") {
            vm.carRepairOrder.spareCarNo = "";
        }

    });

    layui.form.on('select(costSettlement)', function (data) {
        vm.carRepairOrder.costSettlement = data.value;
    });

    //维修开始时间
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //维修开始时间
        laydate.render({
            elem: '#repairStartDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carRepairOrder.repairStartDate = value;
            }
        });

        //维修结束时间
        laydate.render({
            elem: '#repairEndDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carRepairOrder.repairEndDate = value;
            }
        });
    });

    //维修厂报价
    $("#repairShopQuotation").blur(function () {
        var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if ((vm.carRepairOrder.repairShopQuotation != undefined) && (vm.carRepairOrder.repairShopQuotation != "") && (!reg.test(vm.carRepairOrder.repairShopQuotation))) {
            alert("金额输入有误请重新输入");
            vm.carRepairOrder.repairShopQuotation = "";
        }

    });

    //金额输入后进行计算
    $("#userPayId").blur(function () {
        var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (reg.test(vm.carRepairOrder.userPay)) {
            amountAccumulation();
        } else if ((vm.carRepairOrder.userPay != undefined) && (vm.carRepairOrder.userPay != "") && (!reg.test(vm.carRepairOrder.userPay))) {
            alert("金额输入有误请重新输入");
            vm.carRepairOrder.userPay = "";
        } else if (vm.carRepairOrder.userPay == "") {
            amountAccumulation();
        }

    });
    $("#platformPayId").blur(function () {
        var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (reg.test(vm.carRepairOrder.platformPay)) {
            amountAccumulation();
        } else if ((vm.carRepairOrder.platformPay != undefined) && (vm.carRepairOrder.platformPay != "") && (!reg.test(vm.carRepairOrder.platformPay))) {
            alert("金额输入有误请重新输入");
            vm.carRepairOrder.platformPay = "";
        } else if (vm.carRepairOrder.platformPay == "") {
            amountAccumulation();
        }
    });

    $("#insurancePayId").blur(function () {
        var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (reg.test(vm.carRepairOrder.insurancePay)) {
            amountAccumulation();
        } else if ((vm.carRepairOrder.insurancePay != undefined) && (vm.carRepairOrder.insurancePay != "") && (!reg.test(vm.carRepairOrder.insurancePay))) {
            alert("金额输入有误请重新输入");
            vm.carRepairOrder.insurancePay = "";
        } else if (vm.carRepairOrder.insurancePay == "") {
            amountAccumulation();
        }
    });

    //保存按钮监听
    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });
    // 维修相关费用信息表单
    gridTable2 = layui.table.render({
        id: "compulsoryInsurance2",
        elem: '#compulsoryInsurance2',
        minWidth: 150,
        data: vm.dataliat2,
        cols: [[
            { field: 'feeName', title: '费用类型', align: "center" },
            {
                field: 'receivableAmount', title: '应收金额(元)', align: "center", templet: function (d) { return isEmpty(d.receivableAmount); }, edit: 'text', event: 'receivableAmount'
            },

            {
                field: 'receivableObjName', title: '付款对象', align: "center", templet: function (d) {
                    let txt = vm.payeeList
                    let op = '<option value="">请选择</option>'
                    txt.map((res) => {
                        op = op+`<option :value="${res.customerName}">${res.customerName}</option>`
                    })
                    let tml = `<select lay-filter="insuranceTtype2" name="insuranceTtype2" id="${d.index}" sid="${d.feeName}">${op}</select>`
                    return tml;
                },
            },
            {
                field: 'isGenerateReceivableBill', title: '生成应收账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateReceivableBill ? 'checked' : ""} onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
                }
            },
            {
                field: 'payableAmount', title: '应付金额(元)', align: "center", templet: function (d) { return isEmpty(d.payableAmount); }, edit: 'text', event: 'payableAmount'
            },
            {
                field: 'paymentObjName', title: '收款对象', align: "center", templet: function (d) { return isEmpty(d.paymentObjName); }, edit: 'text', event: 'paymentObjName'
            },
            {
                field: 'isGeneratePayableBill', title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch12${d.index}' ${d.isGeneratePayableBill ? 'checked' : ""} onlyName=${d.index} name='switchTest12' lay-skin='switch' lay-filter='switchTest12' title='是|否'>`
                }
            },

            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>删除</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
            $('td[data-field="receivableObjName"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;

                console.log('serializeId==>', serializeId)

                var data = vm.dataliat2.filter(function (value) {
                    console.log('value==>', value)

                    return value.feeName == serializeId;
                })[0];
                var value = '';
                if (data != null) {
                    value = data.receivableObjName;
                }
                $(this).val(value);
            });
            layui.form.render('select');

        }

    });
    // 收款对象
    layui.form.on('select(insuranceTtype2)', function (data) {
        console.log(data, 11)


        vm.dataliat2.map((res) => {
            if (res.feeName == data.elem.attributes.sid.value) {
                res.receivableObjName = data.value
            }
            vm.payeeList.map((item) => {
                if (item.customerName == data.value) {
                    res.receivableObjNo = item.customerId
                }else {
                    res.receivableObjNo = null
                }
            })
            layui.table.reload('compulsoryInsurance2', {
                data: vm.dataliat2
            });
        })
    });
    // 生成应收账单
    layui.form.on('switch(switchTest11)', function (obj) {
        // let a = obj.elem.checked
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
        let data1 = obj.elem.attributes.onlyname.value
        console.log("现成保教结合：：：", data1);
        console.log(obj, 111111)
        console.log(a, 111111)
        if (a == 'true') {
            let list = vm.dataliat2
            console.log(list, 2222222)
            list.map((res, index) => {
                if (res.index == data1) {
                    list[index].isGenerateReceivableBill = 1
                }
            })
        } else {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data1) {
                    list[index].isGenerateReceivableBill = 0
                }
            })
        }
        console.log(vm.dataliat2)
    });
    // 生成应付账单
    layui.form.on('switch(switchTest12)', function (obj) {
        // let a = obj.elem.checked
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
        let data2 = obj.elem.attributes.onlyname.value
        console.log(obj, 111111)
        if (a == 'true') {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGeneratePayableBill = 1
                }
            })
        } else {
            let list = vm.dataliat2
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGeneratePayableBill = 0
                }
            })
        }
    });
    layui.table.on('edit(test2)', function (obj) {
        console.log('修改相关费用里面值了', obj);
        console.log('初始的vm.dataliat2', vm.dataliat2)
        var field = obj.field;
        var value = obj.value;
        var regNumber = /^[0-9]+\.?[0-9]*$/;
        var v = '';
        if (field === 'payableAmount' || field === 'receivableAmount') {
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
            } else {
                //项目金额
                v = Number(value).toFixed(2);
            }
        } else {
            v = value
        }
        for (let i = 0; i < vm.dataliat2.length; i++) {
            var thisObj = vm.dataliat2[i];
            if (thisObj.index == obj.data.index) {
                vm.dataliat2[i].receivableAmount = obj.data.receivableAmount;
                vm.dataliat2[i].payableAmount = obj.data.payableAmount;
                vm.dataliat2[i].paymentObjName = obj.data.paymentObjName;
            }
        }

        console.log('处理完的vm.dataliat2', vm.dataliat2)
    });
    layui.table.on('tool(test2)', function (obj) {//test为table标签中lay-filter的值
        var data = obj.data;
        if (obj.event === 'del') {
            console.log(data)
            vm.dataliat2.forEach(function (value, index) {
                if (value.feeName === data.feeName) {
                    console.log(22222)
                    vm.dataliat2.splice(index, 1)
                }
            });
            reloadPlan2()

        } else if (obj.event === 'receivableAmount' || obj.event === 'payableAmount') {
            tableEditOninputNumInteger(data);
        }
    });
    // 费用类型
    layui.form.on('select(insuranceTtype3)', function (data) {
        vm.carRepairOrder.expenseType = data.value;
    });
});

var approveUplod;
var vm = new Vue({
    el: '#rrapp',
    data: {
        //车辆信息数据源（选车子页面传过来）
        carInforData: {},
        //维修单保存信息数据源
        carRepairOrder: {},
        tableTotal: 0,
        threeItemTotal: 0,
        maintenanceItemList: [],
        fileLst: [],
        fileLstId: '0',
        fileLst2: [],
        fileLstId2: '0',
        boxShow: false,
        boxInputShow: false,
        boxTitle: '',
        boxMark: '',
        boxHolder: '',
        boxTxt: '',
        viewTag: 'edit',
        viewTag1: 'edit',
        recallNodeName: null,
        processApproveForm: {},
        bpmChartDtoList: [],
        instanceId: null,
        isApply: false,
        nodeType: null,
        instanceStatus: null,
        dataliat2: [],
        expenseArr: [
            {
                value: '保险上浮费',
                lable: '1',
            },
            {
                value: '维修费',
                lable: '2',
            },
            {
                value: '折旧费',
                lable: '3',
            },
            {
                value: '其他费用',
                lable: '4',
            },
        ],
        payeeList: [
            {
                value: '张山',
                lable: '1',
            },
            {
                value: '李四',
                lable: '2',
            },
            {
                value: '王五',
                lable: '3',
            },
        ],
        num: 1,
    },
    watch: {
        payeeList: {
            handler(newValue, oldValue) {
                this.payeeList = newValue
            },
            deep: true
        },
        num: {
            handler(newValue, oldValue) {
                this.num = newValue
            },
            immediate: true
        },
    },
    mounted: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        if (param) {
            _this.instanceId = param.instanceId;
            _this.recallNodeName = param.recallName;
            _this.viewTag = param.viewTag + '';
            _this.viewTag1 = param.viewTag + '';
            _this.instanceStatus = param.instanceStatus;
            _this.isApply = param.isApply;
            _this.processApproveForm = param;
            //初始化加载保险公司下拉列表
            // if(_this.viewTag != 'edit'){
            //     $.get(baseURL + "activity/bpmChart",{processKey:param.processKey,instanceId:param.instanceId}, function (r) {
            //         if (r.code == 0){
            //             _this.bpmChartDtoList = r.bpmChart;
            //         }
            //     });
            // }
            $.get(baseURL + "activity/getNodeType", { instanceId: param.instanceId }, function (r) {
                _this.nodeType = r.nodeType;
            });
        }
        var id = window.localStorage.getItem("id");
        if (id != null && id != '' && id != undefined) {
            $.get(baseURL + "carrepairorder/carrepairorder/info/" + id, function (r) {
                _this.carRepairOrder = JSON.parse(JSON.stringify(r.carRepairOrder));
                _this.fileLst = r.carRepairOrder.fileLst;
                let tableList
                if (r.carRepairOrder.maintenanceItemList) {
                    _this.maintenanceItemList = r.carRepairOrder.maintenanceItemList || [];
                    tableList = _this.maintenanceItemList.map(item => item.itemMoney)
                } else {
                    _this.maintenanceItemList = [];
                    tableList = []
                }

                r.carRepairOrder.relatedCostsList.map((res, index) => {
                    res.index = index
                })
                _this.dataliat2 = r.carRepairOrder.relatedCostsList;
                _this.num = r.carRepairOrder.relatedCostsList.length

                let tableTotal = tableList.reduce(function (total, value) {
                    return Number(total) + Number(value);
                }, 0);
                _this.tableTotal = tableTotal;

                // let totalAmount = r.carRepairOrder.totalPay
                // if(totalAmount == null){
                //     if(r.carRepairOrder.userPay){
                //         totalAmount = add(totalAmount,r.carRepairOrder.userPay);
                //     }
                //     if(r.carRepairOrder.platformPay){
                //         totalAmount = add(totalAmount,r.carRepairOrder.platformPay);
                //     }
                //     if(r.carRepairOrder.insurancePay){
                //         totalAmount = add(totalAmount,r.carRepairOrder.insurancePay);
                //     }
                // }
                // _this.carRepairOrder.totalPay = totalAmount;
                let totalAmount = 0;
                if (r.carRepairOrder.maintenanceItemList != null && r.carRepairOrder.maintenanceItemList != undefined) {
                    totalAmount = r.carRepairOrder.maintenanceItemList.map(item => Number(item.itemMoney || 0)).reduce(function (prev, cur) {
                        return prev + cur;
                    }, 0) + Number(r.carRepairOrder.userPay || 0) + Number(r.carRepairOrder.platformPay || 0) + Number(r.carRepairOrder.insurancePay || 0);
                } else {
                    totalAmount = totalAmount + Number(r.carRepairOrder.userPay || 0) + Number(r.carRepairOrder.platformPay || 0) + Number(r.carRepairOrder.insurancePay || 0);
                }
                _this.carRepairOrder.totalPay = Number(totalAmount).toFixed(2);
                _this.threeItemTotal = totalAmount - tableTotal
                _this.carRepairOrder = Object.assign({}, _this.carRepairOrder, {
                    carNo: r.carRepairOrder.carPlateNo,
                    rentTypeStr: r.carRepairOrder.carPurpose,
                    departureNo: r.carRepairOrder.orderNo,
                    belongCompanyName: r.carRepairOrder.deptName,
                    sumOdograph: r.carRepairOrder.mileage,
                    cityName: r.carRepairOrder.cityName,
                    customerName: r.carRepairOrder.customer,
                    depotName: r.carRepairOrder.depotName,
                    depotId: r.carRepairOrder.depotId
                });

                $.ajax({
                    type: "GET",
                    url: baseURL + "carrepairorder/carrepairorder/customerList?carId=" + r.carRepairOrder.carId,
                    contentType: "application/json",
                    success: function (r) {
                        if (r.code == 0) {
                            _this.payeeList = r.data;
                        } else {
                            alert(r.msg);
                        }
                    }
                });

                _this.initTable();
            });
        }

        _this.viewTag = 'edit';
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 新增维修相关费用信息
        addExpense: function () {
            if (vm.carRepairOrder.carId == null || vm.carRepairOrder.carId == '' || vm.carRepairOrder.carId == undefined) {
                layer.alert('请先选择车辆', {
                    icon: 5,
                    title: "提示"
                });
                return false;
            }
            if (vm.carRepairOrder.expenseType == null || vm.carRepairOrder.expenseType == '' || vm.carRepairOrder.expenseType == undefined) {
                layer.alert('请先选择费用类型', {
                    icon: 5,
                    title: "提示"
                });
                return false;
            }
            if (this.dataliat2.length > 0) {
                if (this.dataliat2.some(animal => animal.feeName === vm.carRepairOrder.expenseType)) {
                    layer.alert('不能添加相同的费用类型', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                } else {
                    console.log(this.carRepairOrder.expenseType)
                    let obj = {
                        feeName: vm.carRepairOrder.expenseType,
                        payableAmount: null,
                        paymentObjName: '',
                        isGeneratePayableBill: 0,
                        receivableAmount: null,
                        receivableObjNo: '',
                        receivableObjName: '',
                        isGenerateReceivableBill: 0,
                        // index: vm.num + 1,
                        index: vm.num++,

                    }
                    vm.dataliat2.push(obj)
                    vm.num1 = vm.dataliat2.length
                    layui.table.reload('compulsoryInsurance2', {
                        data: vm.dataliat2
                    });
                }
            } else {
                if (vm.carRepairOrder.expenseType) {
                    let obj = {
                        feeName: vm.carRepairOrder.expenseType,
                        payableAmount: null,
                        paymentObjName: '',
                        isGeneratePayableBill: 0,
                        receivableAmount: null,
                        receivableObjNo: '',
                        receivableObjName: '',
                        isGenerateReceivableBill: 0,
                        // index: vm.num + 1,
                        index: vm.num++,
                    }

                    vm.dataliat2.push(obj)
                    vm.num1 = vm.dataliat2.length
                    layui.table.reload('compulsoryInsurance2', {
                        data: vm.dataliat2
                    });
                } else {
                    layer.alert('请先选择费用类型', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                }
            }
        },
        initTable() {

            let _this = this;

            Upload({
                elid: 'addFile',
                edit: true,
                fileLst: _this.fileLst,
                param: { 'path': 'carrepairorder' },
                fidedesc: '维修附件'
            }).initView();

            approveUplod = Upload({
                elid: 'addFile2',
                edit: true,
                fileLst: _this.fileLst2,
                param: { 'path': 'processApprove' },
                fidedesc: '审批附件'
            });
            approveUplod.initView();

            layui.table.render({
                id: 'maintenanceListId',
                elem: '#maintenanceItemTableList',
                data: _this.maintenanceItemList || [],
                cols: [[
                    { field: 'serializeId', title: '序号' },
                    { field: 'itemName', title: '维修项目名称', edit: 'text', event: 'itemName' },
                    { field: 'itemMoney', title: '金额/元', edit: 'text', event: 'itemMoney' },
                    { title: '操作', templet: '#maintenanceItemBarTpl', align: "center" }
                ]],
                page: true,
                limits: [5, 10, 15],
                limit: 5,
                done: function (res, curr, count) {

                }
            });
            initTableEvent();
            initTableEditListner();
        },
        addMaintenanceItem: function () {
            console.log(vm.maintenanceItemList, '--------------')
            if (vm.maintenanceItemList.filter(function (value) {
                return (value.itemMoney == null || String(value.itemMoney).length < 1)
                    || (value.itemName == null || value.itemName == '');
            }).length > 0) {
                alert('有未完善信息，请先完善后再添加');
                return;
            }

            var serializeId = 0;
            if (vm.maintenanceItemList.length > 0) {
                vm.maintenanceItemList.forEach(function (value) {
                    if (value.serializeId > serializeId) serializeId = value.serializeId;
                })
            }
            var item = {
                serializeId: serializeId + 1,
                elid: 'serializeId_' + (serializeId + 1),
                itemName: null,
                itemMoney: null
            };
            vm.maintenanceItemList.push(item);
            vm.reloadMaintenanceItem();
        },
        reloadMaintenanceItem: function () {
            layui.table.reload('maintenanceListId', {
                page: {
                    curr: getCurrPage('maintenanceListId', vm.maintenanceItemList.length)
                },
                data: vm.maintenanceItemList
            });
        },
        editmaintenanceItemlistener: function (obj) {
            console.log("121212222222222")
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regInt = /^[0-9]*$/;
            var v;
            if (field === 'itemMoney') {
                if (!regNumber.test(value)) {
                    alert("请输入正确的金额");
                    v = '';
                } else {
                    //项目金额
                    v = Number(value).toFixed(2);
                }
            } else {
                v = value
            }
            vm.maintenanceItemList.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) {
                    if (field === 'itemMoney') {
                        value.itemMoney = v;
                    } else if (field === 'itemName') {
                        value.itemName = v;
                    }
                }
            });
            if (field === 'itemMoney') {
                let tableList = vm.maintenanceItemList.map(item => item.itemMoney)
                let tableTotal = tableList.reduce(function (total, value) {
                    return Number(total) + Number(value);
                }, 0);
                vm.tableTotal = tableTotal;
                let endMoney;
                let showTotalPay = vm.carRepairOrder.totalPay;
                if (showTotalPay === undefined || showTotalPay === null) {
                    endMoney = tableTotal;
                } else {
                    let otherTotal = vm.threeItemTotal;
                    endMoney = tableTotal + otherTotal
                }
                endMoney = Number(endMoney).toFixed(2)
                vm.carRepairOrder = Object.assign({}, vm.carRepairOrder, { totalPay: endMoney });

            }
            vm.reloadMaintenanceItem();
        },
        maintenanceItemDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function (index) {
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for (var i = 0; i < vm.maintenanceItemList.length; i++) {
                    if (vm.maintenanceItemList[i].serializeId === serializeId) {
                        vm.maintenanceItemList.splice(i, 1);
                        i = i - 1;
                        break;
                    }
                }

                if (vm.maintenanceItemList.length > 0) {
                    for (var i = 0; i < vm.maintenanceItemList.length; i++) {
                        vm.maintenanceItemList[i].serializeId = i + 1;
                    }
                }

                if (obj.data.itemMoney != undefined && obj.data.itemMoney != null) {
                    let showTotalPay = vm.carRepairOrder.totalPay;
                    let thisItemMoney = obj.data.itemMoney;
                    showTotalPay = showTotalPay - thisItemMoney;
                    showTotalPay = Number(showTotalPay).toFixed(2)
                    vm.carRepairOrder = Object.assign({}, vm.carRepairOrder, { totalPay: showTotalPay });
                }
                vm.reloadMaintenanceItem();
            });
        },

        requestAction: function (action, type) {
            PageLoading();
            vm.carRepairOrder.relatedCostsList = vm.dataliat2;
            vm.carRepairOrder.maintenanceItemList = vm.maintenanceItemList;
            vm.carRepairOrder.maintenanceItemsTotal = vm.tableTotal;
            vm.carRepairOrder.carPlateNo = vm.carRepairOrder.carNo;
            vm.carRepairOrder.orderNo = vm.carRepairOrder.departureNo;
            vm.carRepairOrder.carPurpose = vm.carRepairOrder.rentType;
            vm.carRepairOrder.factoryId = vm.carRepairOrder.deptId;
            vm.carRepairOrder.factoryName = vm.carRepairOrder.deptName;
            vm.carRepairOrder.customer = vm.carRepairOrder.customerName;
            vm.carRepairOrder.viewTag = vm.viewTag;
            vm.carRepairOrder.instanceId = vm.processApproveForm.instanceId;
            vm.processApproveForm.processOperationType = type;
            vm.processApproveForm.businessId = window.localStorage.getItem("id");
            vm.processApproveForm.approveContent = vm.boxTxt;
            vm.processApproveForm.approveFileList = vm.fileLst2;
            vm.carRepairVoData = {
                processApproveForm: vm.processApproveForm,
                carRepairOrder: vm.carRepairOrder
            }
            var closeBox = false;
            $.ajax({
                type: "POST",
                url: baseURL + "carrepairorder/carrepairorder/" + action,
                contentType: "application/json",
                async: false,
                data: JSON.stringify(vm.carRepairVoData),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closeBox = true;
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.vm.reload();
                            parent.layer.close(index);
                        });
                    } else {
                        closeBox = false;
                        alert(r.msg);
                    }
                }
            });
            return closeBox;
        },
        showBox: function (submit) {
            vm.boxTxt = '';
            approveUplod.updateFile();
            var index = layer.open({
                title: vm.boxTitle,
                type: 1,
                area: ['90%', '95%'],
                btn: ['取消', '确定'],
                content: $("#boxShow"),
                btnAlign: 'c',
                end: function () {
                    vm.boxShow = false;
                    layer.close(index);
                },
                btn1: function (index, layero) {
                    vm.boxShow = false;
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    return submit();
                }
            });
            vm.boxShow = true;
        },
        approve: function () {
            vm.boxTitle = '审核通过';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                return vm.requestAction('handle', 4);
            });
        },
        reject: function () {
            vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == '') {
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('handle', 3);
            });
        },
        reeditSubmit: function () {
            vm.viewTag = 'reedit';
            vm.saveOrUpdate();
        },
        getFileData: function (data) {
            let param = {
                data: data
            }
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/common/approvefileview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        sendEditInfor: function (id) {
            //清空数据源
            vm.carRepairOrder = {};
            $.ajax({
                type: "POST",
                url: baseURL + "carrepairorder/carrepairorder/info/" + id,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    $.ajax({
                        type: "GET",
                        url: baseURL + "carrepairorder/carrepairorder/customerList?carId=" + r.carRepairOrder.carId,
                        contentType: "application/json",
                        success: function (r) {
                            if (r.code == 0) {

                                vm.payeeList = r.data;
                                reloadPlan2()
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                    vm.carRepairOrder = r.carRepairOrder;
                    vm.fileLst = r.carRepairOrder.fileLst;
                    let tableList
                    if (r.carRepairOrder.maintenanceItemList) {
                        vm.maintenanceItemList = r.carRepairOrder.maintenanceItemList || [];
                        tableList = vm.maintenanceItemList.map(item => item.itemMoney)
                    } else {
                        vm.maintenanceItemList = [];
                        tableList = []
                    }
                    r.carRepairOrder.relatedCostsList.map((res, index) => {
                        res.index = index
                    })
                    vm.dataliat2 = r.carRepairOrder.relatedCostsList;
                    vm.num = r.carRepairOrder.relatedCostsList.length
                    layui.table.reload('compulsoryInsurance2', {
                        data: vm.dataliat2
                    })
                    let tableTotal = tableList.reduce(function (total, value) {
                        return Number(total) + Number(value);
                    }, 0);
                    vm.tableTotal = tableTotal;

                    // let totalAmount = vm.carRepairOrder.totalPay
                    // if(totalAmount == null){
                    //     if(vm.carRepairOrder.userPay){
                    //         totalAmount = add(totalAmount,vm.carRepairOrder.userPay);
                    //     }
                    //     if(vm.carRepairOrder.platformPay){
                    //         totalAmount = add(totalAmount,vm.carRepairOrder.platformPay);
                    //     }
                    //     if(vm.carRepairOrder.insurancePay){
                    //         totalAmount = add(totalAmount,vm.carRepairOrder.insurancePay);
                    //     }
                    // }
                    // vm.carRepairOrder.totalPay = totalAmount;
                    let totalAmount = 0;
                    if (r.carRepairOrder.maintenanceItemList != null && r.carRepairOrder.maintenanceItemList != undefined) {
                        totalAmount = r.carRepairOrder.maintenanceItemList.map(item => Number(item.itemMoney || 0)).reduce(function (prev, cur) {
                            return prev + cur;
                        }, 0) + Number(r.carRepairOrder.userPay || 0) + Number(r.carRepairOrder.platformPay || 0) + Number(r.carRepairOrder.insurancePay || 0);
                    } else {
                        totalAmount = totalAmount + Number(r.carRepairOrder.userPay || 0) + Number(r.carRepairOrder.platformPay || 0) + Number(r.carRepairOrder.insurancePay || 0);
                    }
                    vm.carRepairOrder.totalPay = Number(totalAmount).toFixed(2);
                    vm.threeItemTotal = totalAmount - tableTotal
                    vm.carRepairOrder = Object.assign({}, vm.carRepairOrder, {
                        //车牌号
                        carNo: r.carRepairOrder.carPlateNo,
                        //车辆用途
                        rentTypeStr: r.carRepairOrder.carPurpose,
                        //车辆订单号
                        departureNo: r.carRepairOrder.orderNo,
                        //车辆所属公司
                        belongCompanyName: r.carRepairOrder.deptName,
                        //车辆当前里程数
                        sumOdograph: r.carRepairOrder.mileage,
                        //车辆所在城市
                        cityName: r.carRepairOrder.cityName,
                        //客户名称
                        customerName: r.carRepairOrder.customer,
                        //所属仓库
                        depotName: r.carRepairOrder.depotName,

                        depotId: r.carRepairOrder.depotId
                    });
                    vm.initTable()

                }
            });
        },
        //选择车牌号
        selectCarNo: function () {
            var index = layer.open({
                title: "选择车牌号",
                type: 2,
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function () {
                    var carId = vm.carInforData.carId;
                    if (carId != null && carId != '' && carId != undefined) {
                        vm.getCarBasicInforByCarNo(carId);
                    }


                }
            });
            layer.full(index);

        },
        //选择车架号
        selectVinNo: function () {
            var index = layer.open({
                title: "选择车架号",
                type: 2,
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function () {
                    var vinNo = vm.carInforData.vinNo;
                    if (vinNo != null && vinNo != '' && vinNo != undefined) {
                        vm.getCarBasicInforByVinNo(vinNo);
                    }

                }
            });
            layer.full(index);

        },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo: function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/" + carId,
                contentType: "application/json",
                data: {},
                success: function (r) {

                    //车牌号
                    vm.carRepairOrder.carNo = r.baseInfor.carNo;
                    vm.carRepairOrder.vinNo = r.baseInfor.vinNo;
                    vm.carRepairOrder.carBrandModelName = r.baseInfor.carBrandModelName;
                    vm.carRepairOrder.customerName = r.baseInfor.customerName;
                    vm.carRepairOrder.carStatus = r.baseInfor.carStatus;
                    vm.carRepairOrder.carStatusStr = r.baseInfor.carStatusStr;
                    // vm.carRepairOrder.departureNo=r.baseInfor.departureNo;
                    vm.carRepairOrder.departureNo = r.baseInfor.carOrderNo;
                    vm.carRepairOrder.belongCompanyName = r.baseInfor.belongCompanyName;
                    vm.carRepairOrder.timeStartRent = r.baseInfor.timeStartRent;
                    vm.carRepairOrder.timeFinishRent = r.baseInfor.timeFinishRent;
                    vm.carRepairOrder.sumOdograph = r.baseInfor.sumOdograph;
                    vm.carRepairOrder.rentTypeStr = r.baseInfor.rentTypeStr;
                    vm.carRepairOrder.cityName = r.baseInfor.cityName;
                    vm.carRepairOrder.depotName = r.baseInfor.carDepotName;
                    vm.carRepairOrder.depotId = r.baseInfor.carDepotId;
                    vm.carRepairOrder.carId = r.baseInfor.carId;
                    vm.carRepairOrder.totalPay = vm.tableTotal;
                    // 查询车辆对应客户列表
                    $.ajax({
                        type: "GET",
                        url: baseURL + "carrepairorder/carrepairorder/customerList?carId=" + carId,
                        contentType: "application/json",
                        success: function (r) {
                            if (r.code == 0) {
                                vm.payeeList = r.data;
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                }
            });
        },
        //根据车架号查询基本信息
        getCarBasicInforByVinNo: function (vinNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByVinNo/" + vinNo,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.carRepairOrder.carNo = r.baseInfor.carNo;
                    vm.carRepairOrder.vinNo = r.baseInfor.vinNo;
                    vm.carRepairOrder.carBrandModelName = r.baseInfor.carBrandModelName;
                    vm.carRepairOrder.customerName = r.baseInfor.customerName;
                    vm.carRepairOrder.carStatus = r.baseInfor.carStatus;
                    vm.carRepairOrder.carStatusStr = r.baseInfor.carStatusStr;
                    // vm.carRepairOrder.departureNo=r.baseInfor.departureNo;
                    vm.carRepairOrder.departureNo = r.baseInfor.carOrderNo;
                    vm.carRepairOrder.belongCompanyName = r.baseInfor.belongCompanyName;
                    vm.carRepairOrder.timeStartRent = r.baseInfor.timeStartRent;
                    vm.carRepairOrder.timeFinishRent = r.baseInfor.timeFinishRent;
                    vm.carRepairOrder.sumOdograph = r.baseInfor.sumOdograph;
                    vm.carRepairOrder.rentTypeStr = r.baseInfor.rentTypeStr;
                    vm.carRepairOrder.cityName = r.baseInfor.cityName;
                    vm.carRepairOrder.depotName = r.baseInfor.carDepotName;
                    vm.carRepairOrder.depotId = r.baseInfor.carDepotId;
                    vm.carRepairOrder.carId = r.baseInfor.carId;
                    // 查询车辆对应客户列表
                    $.ajax({
                        type: "GET",
                        url: baseURL + "carrepairorder/carrepairorder/customerList?carId=" + vm.carRepairOrder.carId,
                        contentType: "application/json",
                        success: function (r) {
                            if (r.code == 0) {
                                vm.payeeList = r.data;
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                }
            });
        },
        //取消
        cancel: function () {
            parent.layer.closeAll();
        },
        //保存修改方法
        saveOrUpdate: function (event) {

            vm.carRepairOrder.fileLst = vm.fileLst;
            vm.carRepairOrder.carPlateNo = vm.carRepairOrder.carNo;
            vm.carRepairOrder.orderNo = vm.carRepairOrder.departureNo;
            vm.carRepairOrder.carPurpose = vm.carRepairOrder.rentType;
            vm.carRepairOrder.factoryId = vm.carRepairOrder.deptId;
            vm.carRepairOrder.factoryName = vm.carRepairOrder.deptName;
            vm.carRepairOrder.customer = vm.carRepairOrder.customerName;
            vm.carRepairOrder.viewTag = vm.viewTag;
            vm.carRepairOrder.instanceId = vm.processApproveForm.instanceId;
            vm.carRepairOrder.maintenanceItemList = vm.maintenanceItemList;
            vm.carRepairOrder.maintenanceItemsTotal = vm.tableTotal;
            if (vm.maintenanceItemList.filter(function (value) {
                return (value.itemName == null || value.itemName == '');
            }).length > 0) {
                alert('请完善维修项目信息！');
                return;
            }


            // if (vm.carRepairOrder.relatedCostsList.filter(function (value) {
            //     return (value.receivableObjName == null || value.receivableObjName == '' || value.receivableObjNo == null || value.receivableObjNo == '');
            // }).length > 0) {
            //     alert('请选择收款对象！');
            //     return;
            // }



            var url = "carrepairorder/carrepairorder/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carRepairOrder),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        //撤回
        recall: function (event) {
            vm.boxTitle = '审核撤回';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == '') {
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('recall', 3);
            });
        },
    },

})

// function init(layui) {
//     initTable(layui.table, layui.soulTable);
// }



function initTableEvent() {
    layui.table.on('tool(maintenanceItemTableList)', function (obj) {
        var layEvent = obj.event;
        console.log("监听的事件:", layEvent)
        var data = obj.data;
        if (layEvent === 'delect') {
            vm.maintenanceItemDelectObj(obj);
        } else if (layEvent === 'itemMoney') {
            tableEditMaxlength('itemMoney', 10);
            tableEditOninputNum('itemMoney');
        } else if (layEvent === 'itemName') {
            tableEditMaxlength('itemName', 50);
        }
    });
}

function initTableEditListner() {
    layui.table.on('edit(maintenanceItemTableList)', function (obj) {
        console.log("objdata:", obj)
        vm.editmaintenanceItemlistener(obj);
    });
}



function amountAccumulation() {
    $.ajax({
        type: "POST",
        url: baseURL + 'carrepairorder/carrepairorder/amountAccumulation',
        contentType: "application/json",
        data: JSON.stringify(vm.carRepairOrder),
        success: function (r) {
            vm.threeItemTotal = r.amountAccumulation;
            let tableList = vm.maintenanceItemList.map(item => item.itemMoney)
            let tableTotal = tableList.reduce(function (total, value) {
                return Number(total) + Number(value);
            }, 0);
            vm.tableTotal = tableTotal;
            let totalPayMoney = tableTotal + r.amountAccumulation;
            vm.carRepairOrder = Object.assign({}, vm.carRepairOrder, { totalPay: totalPayMoney });
        }
    });
}


function isRecall() {
    return vm && (vm.instanceStatus == 1 || vm.instanceStatus == 6) && vm.isApply && vm.viewTag1 === 'applyDetail';
}
function reloadPlan2() {
    if ($('div[lay-id="compulsoryInsurance2"]').length > 0) {
        console.log(vm.dataliat2, 455454545454)
        layui.table.reload('compulsoryInsurance2', { data: vm.dataliat2 });
    }
}