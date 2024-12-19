$(function () {
    /***
     * 页面初始化根据车辆id赋值
     */
    if (parent.layui.larryElem != undefined) {
        var params = parent.layui.larryElem.boxParams;
        if(typeof params!="undefined"){
            vm.getCarBasicInforByCarNo(params.carId);
        }

    }

    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form', 'layedit', 'laydate', 'upload', 'soulTable'], function () {
        init(layui);
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.on('submit(saveOrUpdate)', function () {
            vm.saveOrUpdate();
            return false;
        });
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
                var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
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
                var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
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
                var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
                if (value != "" && value != null) {
                    if (!reg.test(value)) {
                        return '金额输入有误请重新输入';
                    }
                }
            },
            insurancePayVerify: function (value) {
                var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
                if (value != "" && value != null) {
                    if (!reg.test(value)) {
                        return '金额输入有误请重新输入';
                    }
                }
            },
            // repairEndDateVerify: function (value) {
            //     if (value == "" || value == null) {
            //         return '维修结束时间不能为空';
            //     }
            // },
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

        Upload({
            elid: 'addFile',
            edit: true,
            fileLst: vm.fileLst,
            param: { 'path': 'carrepairorder' },
            fidedesc: '维修附件'
        }).initView();
        form.render();
    });
    //是否提供备用车
    layui.form.on('select(isSpareCar)', function (data) {
        vm.carRepairOrder.isSpareCar = data.value;
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
                    let op = ''
                    txt.map((res) => {
                        op = `<option>${res.customerName}</option>` + op
                    })
                    let tml = `<select lay-filter="insuranceTtype2" name="insuranceTtype2" id="${d.index}" sid="${d.feeName}">${op}</select>`
                    return tml;
                },
            },
            {
                field: 'isGenerateReceivableBill', title: '生成应收账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateReceivableBill ? 'checked' : ""}  onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
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
                    return `<input type='checkbox' id='contractSwitch12${d.index}' ${d.isGeneratePayableBill ? 'checked' : ""}  onlyName=${d.index} name='switchTest12' lay-skin='switch' lay-filter='switchTest12' title='是|否'>`
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
                var data = vm.dataliat2.filter(function (value) {
                    return value.feeName == serializeId;
                })[0];
                var value = '';
                console.log(vm.dataliat2)
                console.log(data, 444444444)
                console.log(serializeId, 444444444)
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
                }
            })
            layui.table.reload('compulsoryInsurance2', {
                data: vm.dataliat2
            });
        })
    });
    // 生成应收账单
    layui.form.on('switch(switchTest11)', function (obj) {
        // let a = $.trim($('#contractSwitch11').is(":checked"));
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
        let data1 = obj.elem.attributes.onlyname.value
        console.log("现成保教结合：：：", data1);
        console.log(obj, 111111)
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
        // let a = $.trim($('#contractSwitch12').is(":checked"));
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
        console.log(vm.dataliat2)
    });

    layui.table.on('edit(test2)', function (obj) {
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
        obj.data[field] = v;
        console.log('修改相关费用里面值了', obj);
        for (let i = 0; i < vm.dataliat2.length; i++) {
            var thisObj = vm.dataliat2[i];
            if (thisObj.index == obj.data.index) {
                if (field === 'payableAmount') {
                    vm.dataliat2[i].payableAmount = v;
                }
                if (field === 'receivableAmount') {
                    vm.dataliat2[i].receivableAmount = v;
                }
                vm.dataliat2[i].paymentObjName = obj.data.paymentObjName;
            }
        }
        reloadPlan2()
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

    // //维修厂报价
    // $("#repairShopQuotation").blur(function(){
    //     var reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
    //     if((vm.carRepairOrder.repairShopQuotation!=undefined) && (vm.carRepairOrder.repairShopQuotation !="") && (!reg.test(vm.carRepairOrder.repairShopQuotation))){
    //         alert("金额输入有误请重新输入");
    //         vm.carRepairOrder.repairShopQuotation="";
    //     }
    // });
    //
    // //金额输入后进行计算
    // $("#userPayId").blur(function(){
    //     var reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
    //     if(reg.test(vm.carRepairOrder.userPay)){
    //         amountAccumulation();
    //     }else if((vm.carRepairOrder.userPay!=undefined) && (vm.carRepairOrder.userPay !="") && (!reg.test(vm.carRepairOrder.userPay))){
    //         alert("金额输入有误请重新输入");
    //         vm.carRepairOrder.userPay="";
    //     }else if(vm.carRepairOrder.userPay==""){
    //         amountAccumulation();
    //     }
    //
    // });
    // $("#platformPayId").blur(function(){
    //     var reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
    //     if(reg.test(vm.carRepairOrder.platformPay)){
    //         amountAccumulation();
    //     }else if((vm.carRepairOrder.platformPay!=undefined) && (vm.carRepairOrder.platformPay !="") && (!reg.test(vm.carRepairOrder.platformPay))){
    //         alert("金额输入有误请重新输入");
    //         vm.carRepairOrder.platformPay="";
    //     }else if(vm.carRepairOrder.platformPay==""){
    //         amountAccumulation();
    //     }
    // });
    //
    // $("#insurancePayId").blur(function(){
    //     var reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
    //     if(reg.test(vm.carRepairOrder.insurancePay)){
    //         amountAccumulation();
    //     }else if((vm.carRepairOrder.insurancePay!=undefined) && (vm.carRepairOrder.insurancePay!="") && (!reg.test(vm.carRepairOrder.insurancePay))){
    //         alert("金额输入有误请重新输入");
    //         vm.carRepairOrder.insurancePay="";
    //     }else if(vm.carRepairOrder.insurancePay==""){
    //         amountAccumulation();
    //     }
    // });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        hetong: false,
        //车辆信息数据源
        carInforData: {},
        //维修单保存信息数据源
        carRepairOrder: {
            serviceName: sessionStorage.getItem("officialPartner"),
        },
        tableTotal: 0,
        threeItemTotal: 0,
        maintenanceItemList: [],
        fileLst: [],
        fileLstId: '0',
        bpmChartDtoList: [],
        openFlow: false,
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
        'carRepairOrder.repairShopQuotation': function () {
            var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
            if ((vm.carRepairOrder.repairShopQuotation != undefined) && (vm.carRepairOrder.repairShopQuotation != "") && (!reg.test(parseFloat(vm.carRepairOrder.repairShopQuotation)))) {
                alert("金额输入有误请重新输入");
                vm.carRepairOrder.repairShopQuotation = "";
                amountAccumulation();
            }
        },
        'carRepairOrder.userPay': function () {
            var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;

            if (reg.test(parseFloat(vm.carRepairOrder.userPay))) {
                amountAccumulation();
            } else if ((vm.carRepairOrder.userPay != undefined) && (vm.carRepairOrder.userPay != "") && (!reg.test(vm.carRepairOrder.userPay))) {
                alert("金额输入有误请重新输入");
                vm.carRepairOrder.userPay = "";
                amountAccumulation();
            } else if (vm.carRepairOrder.userPay == "") {
                amountAccumulation();
            }
        },
        'carRepairOrder.platformPay': function () {
            var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;

            if (reg.test(parseFloat(vm.carRepairOrder.platformPay))) {
                amountAccumulation();
            } else if ((vm.carRepairOrder.platformPay != undefined) && (vm.carRepairOrder.platformPay != "") && (!reg.test(vm.carRepairOrder.platformPay))) {
                alert("金额输入有误请重新输入");
                vm.carRepairOrder.platformPay = "";
                amountAccumulation();
            } else if (vm.carRepairOrder.platformPay == "") {
                amountAccumulation();
            }
        },
        'carRepairOrder.insurancePay': function () {
            var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;

            if (reg.test(parseFloat(vm.carRepairOrder.insurancePay))) {
                amountAccumulation();
            } else if ((vm.carRepairOrder.insurancePay != undefined) && (vm.carRepairOrder.insurancePay != "") && (!reg.test(vm.carRepairOrder.insurancePay))) {
                alert("金额输入有误请重新输入");
                vm.carRepairOrder.insurancePay = "";
                amountAccumulation();
            } else if (vm.carRepairOrder.insurancePay == "") {
                amountAccumulation();
            }
        }
    },
    created: function () {
        var _this = this;
        $.ajaxSettings.async = false;
        var param = parent.layer.boxParams.boxParams;
        if (param && param.id) {
            $.ajax({
                type: "POST",
                url: baseURL + "carrepairorder/carrepairorder/info/" + param.id,
                contentType: "application/json",
                async: false,
                data: {},
                success: function (r) {
                    _this.carRepairOrder = r.carRepairOrder;
                    _this.fileLst = r.carRepairOrder.fileLst;
                    let tableList
                    if (r.carRepairOrder.maintenanceItemList) {
                        _this.maintenanceItemList = r.carRepairOrder.maintenanceItemList || [];
                        tableList = _this.maintenanceItemList.map(item => item.itemMoney)
                    } else {
                        _this.maintenanceItemList = [];
                        tableList = []
                    }
                    let tableTotal = tableList.reduce(function (total, value) {
                        return Number(total) + Number(value);
                    }, 0);
                    _this.tableTotal = tableTotal;
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
                    delete _this.carRepairOrder.id;
                    delete _this.carRepairOrder.applyNo;
                    delete _this.carRepairOrder.repairStatus;
                    delete _this.carRepairOrder.operator;
                    delete _this.carRepairOrder.timeCreate;
                    delete _this.carRepairOrder.timeUpdate;
                    delete _this.carRepairOrder.instanceId;
                    delete _this.carRepairOrder.flowApproveStatus;
                    if (_this.fileLst) {
                        _this.fileLst.forEach(function (item) {
                            delete item.sysAccessoryId;
                            delete item.objId;
                            delete item.objType;
                        })
                    }
                }
            });
        }
        $.get(baseURL + "activity/bpmInitChart", { processKey: "carRepairApprove" }, function (r) {
            if (r.code == 0) {
                _this.bpmChartDtoList = r.bpmInitChart;
                _this.openFlow = r.openFlow;
            }
        });
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 新增出险相关费用信息
        addExpense: function () {
            if (vm.carRepairOrder.carId == null || vm.carRepairOrder.carId == '' || vm.carRepairOrder.carId == undefined) {
                layer.alert('请先选择车辆', {
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
                        index: this.num++,

                    }
                    this.dataliat2.push(obj)
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
                        index: this.num++,
                    }
                    this.dataliat2.push(obj)
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
        retractChange: function (data) {
            if (data == 1) {
                this.hetong = false
            }
        },
        expandChange: function (data) {
            console.log(1)
            if (data == 1) {
                this.$nextTick(() => {
                    this.hetong = true
                })

            }
        },
        addMaintenanceItem: function () {
            // console.log(vm.maintenanceItemList,'--------------')
            if (vm.maintenanceItemList.filter(function (value) {
                return (value.itemName == null || value.itemName == '');
            }).length > 0) {
                alert('请填写维修项目名称');
                return;
            }

            if (vm.maintenanceItemList.filter(function (value) {
                return (value.itemMoney == null || String(value.itemMoney).length < 1);
            }).length > 0) {
                alert('请填写金额');
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
                        if (value.itemName == null || value.itemName == '') {
                            alert('请先填写维修项目名称！');
                            return;
                        }
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
                if (showTotalPay === undefined || showTotalPay === null || showTotalPay === 0) {
                    endMoney = tableTotal;
                } else {
                    let otherTotal = vm.threeItemTotal;
                    endMoney = tableTotal + otherTotal
                    // let lenga = numProcessing(vm.threeItemTotal)
                    // let lengb = numProcessing(tableTotal)
                    // // let totalPayMoney =vm.tableTotal +r.amountAccumulation;
                    // let totalPayMoney =null
                    // if(lenga>lengb){
                    //     totalPayMoney =  multipleNum(lenga,vm.tableTotal,r.amountAccumulation)
                    // }else{
                    //     totalPayMoney =   multipleNum(lengb,vm.tableTotal,r.amountAccumulation)
                    // }
                    // let otherTotal = vm.threeItemTotal;
                    // endMoney = tableTotal+ showTotalPay
                }
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
                    vm.carRepairOrder = Object.assign({}, vm.carRepairOrder, { totalPay: showTotalPay });
                }
                vm.reloadMaintenanceItem();
            });
        },



        //选择车牌号
        selectCarNo: function () {
            var index = layer.open({
                title: "选择车牌号",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initType('carrepairorder');
                },
                end: function () {
                    var carId = vm.carInforData.carId;
                    if (carId != null && carId != '' && carId != undefined) {
                        vm.getCarBasicInforByCarNo(carId);
                    }
                }
            });
            // layer.full(index);

        },
        //选择车架号
        selectVinNo: function () {
            var index = layer.open({
                title: "选择车架号",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initType('carrepairorder');
                },
                end: function () {
                    var vinNo = vm.carInforData.vinNo;
                    if (vinNo != null && vinNo != '' && vinNo != undefined) {
                        vm.getCarBasicInforByVinNo(vinNo);
                    }
                }
            });
            // layer.full(index);

        },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo: function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/" + carId,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.carRepairOrder = r.baseInfor;
                    vm.carRepairOrder.serviceName = sessionStorage.getItem("officialPartner");
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
                    if (r.baseInfor != null) {
                        vm.carRepairOrder = r.baseInfor;
                        vm.carRepairOrder.serviceName = sessionStorage.getItem("officialPartner");
                        vm.carRepairOrder.totalPay = vm.tableTotal;
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
                    } else {
                        alert("该车架号暂无车辆信息!");
                        return;
                    }
                }
            });
        },
        //取消
        cancel: function () {
            // parent.layer.closeAll();
            //页面关闭
            closeCurrent();
        },
        //保存修改方法
        saveOrUpdate: function (event) {
            vm.carRepairOrder.carPlateNo = vm.carRepairOrder.carNo;
            vm.carRepairOrder.orderNo = vm.carRepairOrder.carOrderNo;
            vm.carRepairOrder.carPurpose = vm.carRepairOrder.rentType;
            vm.carRepairOrder.factoryId = vm.carRepairOrder.depotId;
            vm.carRepairOrder.factoryName = vm.carRepairOrder.deptName;
            vm.carRepairOrder.fileLst = vm.fileLst;
            vm.carRepairOrder.customer = vm.carRepairOrder.customerName;
            vm.carRepairOrder.depotId = vm.carRepairOrder.carDepotId;
            vm.carRepairOrder.depotName = vm.carRepairOrder.carDepotName;
            vm.carRepairOrder.maintenanceItemList = vm.maintenanceItemList;
            vm.carRepairOrder.maintenanceItemsTotal = vm.tableTotal;
            vm.carRepairOrder.relatedCostsList = vm.dataliat2;
            console.log("list的值：", vm.maintenanceItemList);
            console.log("相关费用 ：", vm.dataliat2);
            if (vm.maintenanceItemList.filter(function (value) {
                return (value.itemName == null || value.itemName == '');
            }).length > 0) {
                alert('请完善维修项目信息！');
                return;
            }
            var url = "carrepairorder/carrepairorder/save";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carRepairOrder),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            /*parent.layer.closeAll();
                            parent.vm.reload();*/
                            //页面关闭
                            closeCurrent();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
    }
})


function init(layui) {
    initTable(layui.table, layui.soulTable);
}


function initTable(table, soulTable) {

    table.render({
        id: 'maintenanceListId',
        elem: '#maintenanceItemTableList',
        data: vm.maintenanceItemList,
        cols: [[
            { field: 'serializeId', title: '序号' },
            { field: 'itemName', title: '维修项目名称', edit: 'text', event: 'itemName' },
            { field: 'itemMoney', title: '金额/元', edit: 'text', event: 'itemMoney' },
            // {field:'itemFile', title: '维修项目附件', templet: function(d){
            //         var operation = '';
            //         operation =  "<a class='table-btn uploadTableInfo' value='"+d.itemFile+","+d.itemFile+"' lay-event='scfj'>上传附件</a>";
            //         return operation
            //     }
            // },
            { title: '操作', width: 120, templet: '#maintenanceItemBarTpl', fixed: "right", align: "center" }
        ]],
        page: true,
        limits: [5, 10, 15],
        limit: 5,
        done: function (res, curr, count) {

        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEvent(table) {
    table.on('tool(maintenanceItemTableList)', function (obj) {
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
        // else if (layEvent === 'scfj') {
        //     alert("sadsa");
        // }
    });
}

function initTableEditListner(table) {
    table.on('edit(maintenanceItemTableList)', function (obj) {
        console.log("objdata:", obj)
        vm.editmaintenanceItemlistener(obj);
    });
}


function initUpload(upload) {
    var operationId = sessionStorage.getItem("userId");
    var operationName = sessionStorage.getItem("username");
    upload.render({
        elem: '#addFile',
        url: baseURL + 'file/uploadFile',
        data: { 'path': 'contract' },
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg', //
        multiple: true,
        number: 20,
        choose: function (obj) {
            PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: fileIdTmp,
                    operationId: operationId,
                    operationName: operationName,
                    nameDesc: '维修附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                };
                vm.fileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.fileLst.forEach(function (value) {
                    if (value.id === fileIdTmp) value.url = res.data[0];
                });
                vm.fileLstId = 'fileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', { icon: 5 });
                vm.delFile(fileIdTmp);
            }
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', { icon: 5 });
            vm.delFile(fileIdTmp);
            fileIdTmp = null;
        }
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
            // let lenga = numProcessing(tableTotal)
            // let lengb = numProcessing(r.amountAccumulation)
            let totalPayMoney = tableTotal + r.amountAccumulation;
            // let totalPayMoney =null
            // if(lenga>lengb){
            //     totalPayMoney =  multipleNum(lenga,vm.tableTotal,r.amountAccumulation)
            // }else{
            //     totalPayMoney =   multipleNum(lengb,vm.tableTotal,r.amountAccumulation)
            // }
            vm.carRepairOrder = Object.assign({}, vm.carRepairOrder, { totalPay: totalPayMoney });

        }
    });

}

function numProcessing(data) {
    if (String(data).indexOf(".") > -1) {
        let res = data.toString().split('.')
        let leng = res[1].toString().split('').length
        return leng
    } else {
        return 0
    }

}

function multipleNum(info, item1, item2) {
    let num = 1
    for (let i = 0; i < info; i++) {
        num = num * 10
    }
    let num1 = item1 * num
    let num2 = item2 * num
    return (num1 + num2) / num

}
function reloadPlan2() {
    if ($('div[lay-id="compulsoryInsurance2"]').length > 0) {
        console.log(vm.dataliat2, 455454545454)
        layui.table.reload('compulsoryInsurance2', { data: vm.dataliat2 });
    }
}


