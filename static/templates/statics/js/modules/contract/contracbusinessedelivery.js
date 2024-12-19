$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});

var planTableCheckedObj;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        contracbusiness: {},
        delivery: {
            // paymentMethod: 1,
            billType: 1,
            timeRepayment: null,
            orderDesc: null,
            timeDelivery: null,
            deliveryOperationId: sessionStorage.getItem("userId"),
            deliveryOperationName: sessionStorage.getItem("username"),
            deliveryDesc: null,
        },
        planLst: [],
        usrLst: [],
        carLst: [],
        carIds: [],
        verify: false
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async= false;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            _this.contracbusiness = param.data;
            if (_this.contracbusiness.rentType == 6) {
                _this.delivery.timeRepayment = dateFormatYMD(new Date());
            }
            _this.planLst = _this.contracbusiness.planLst;
            _this.delivery.contractId = _this.contracbusiness.id;
        }
        _this.delivery.timeDelivery = dateFormat(new Date());
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if (!vm.carLst || vm.carLst.length < 1) {
                alert('发车信息不能为空');
                return;
            }
            var param = JSON.parse(JSON.stringify(vm.delivery));
            param.planLst = vm.planLst;
            param.carLst = vm.carLst;
            param.carIds = vm.carIds;
            param.countDelivery = vm.carLst.length;
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + 'contract/contracbusiness/delivery',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        addCar: function () {
            if (!planTableCheckedObj) {
                alert('请选择车型方案信息');
                return;
            }
            if (planTableCheckedObj.countUndelivered < 1) {
                alert('该车型方案无可交车数量');
                return;
            }
            var param = {
                brandId: planTableCheckedObj.brandId,
                seriesId: planTableCheckedObj.seriesId,
                modelId: planTableCheckedObj.modelId,
                carIds: vm.carIds,
                callback: function (datas) {
                    if (datas && datas.length > 0) {
                        var countDelivered = (planTableCheckedObj.countDelivered^0);
                        var countUndelivered = (planTableCheckedObj.countUndelivered^0);
                        var countDelivery = 0;
                        datas.forEach(function (item) {
                            countDelivered += 1;
                            countUndelivered -= 1;
                            countDelivery += 1;
                            if (countUndelivered >= 0) {
                                item.planNo = planTableCheckedObj.planNo;
                                item.planId = planTableCheckedObj.id;
                                vm.carLst.push(item);
                                vm.carIds.push(item.carId);
                            } else {
                                countDelivered -= 1;
                                countUndelivered += 1;
                                countDelivery -= 1;
                            }
                        });
                        planTableCheckedObj.countDelivered = countDelivered;
                        planTableCheckedObj.countUndelivered = countUndelivered;
                        var plan = vm.planLst.filter(function (plan) {
                            return plan.id == planTableCheckedObj.id;
                        })[0];
                        plan.countDelivered = countDelivered;
                        plan.countUndelivered = countUndelivered;
                        plan.countDelivery = (plan.countDelivery^0) + countDelivery;
                        vm.reloadPlan();
                        vm.reload();
                    }
                }
            };
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/contract/departurecar.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        carDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var carId = obj.data.carId;
                var planId = obj.data.planId;
                obj.del();
                layer.close(index);
                for(var i = 0; i < vm.carLst.length; i++) {
                    if(vm.carLst[i].carId === carId) {
                        vm.carLst.splice(i,1);
                        i = i-1;
                        break;
                    }
                }
                for(var i = 0; i < vm.carIds.length; i++) {
                    if(vm.carIds[i] === carId) {
                        vm.carIds.splice(i,1);
                        i = i-1;
                        break;
                    }
                }
                var plan = vm.planLst.filter(function (plan) {
                    return plan.id === planId;
                })[0];
                var countDelivered = (plan.countDelivered^0) - 1;
                var countUndelivered = (plan.countUndelivered^0) + 1;
                plan.countDelivered = countDelivered;
                plan.countUndelivered = countUndelivered;
                plan.countDelivery = (plan.countDelivery^0) - 1;
                if (planTableCheckedObj && planTableCheckedObj.id == planId) {
                    planTableCheckedObj.countDelivered = countDelivered;
                    planTableCheckedObj.countUndelivered = countUndelivered;
                }
                vm.reloadPlan();
                vm.reload();
            });
        },
        reloadPlan: function (event) {
            layui.table.reload('plantableid', {
                page: {
                    curr: getCurrPage('plantableid', vm.planLst.length)
                },
                data: vm.planLst
            });
            layui.table.render();
        },
        reload: function (event) {
            layui.table.reload('cartableid', {
                page: {
                    curr: getCurrPage('cartableid', vm.carLst.length)
                },
                data: vm.carLst
            });
            layui.table.render();
        },
        downExl: function () {
            var datas = [{codeMateriel: '车架号',countStorage:'车牌号'}];
            layui.excel.exportExcel({
                sheet1: datas
            }, '发车导入模板.xlsx', 'xlsx');
        },
        onDateItemRead: function (data) {
            var vinNo = data['车架号'];
            var carNo = data['车牌号'];
            if ((vinNo == null || vinNo == '') && (carNo == null || carNo == '')) {
                return false;
            }
            var res;
            $.ajaxSettings.async = false;
            $.get(baseURL + "car/tcarbasic/selectOrderCarLst", {
                vinNo: vinNo,
                carNo: carNo,
                brandId: planTableCheckedObj.brandId,
                seriesId: planTableCheckedObj.seriesId,
                modelId: planTableCheckedObj.modelId,
                precise: true,
                filterCarIds: vm.carIds.join(',')
            }, function (r) {
                res = r;
            });
            $.ajaxSettings.async = true;
            if ((res.count^0) <= 0) {
                return false;
            }
            var obj = res.data[0];
            if ($.inArray(obj.carId, vm.carIds) >= 0) {
                return false;
            }
            var countDelivered = (planTableCheckedObj.countDelivered^0);
            var countUndelivered = (planTableCheckedObj.countUndelivered^0);
            var countDelivery = 1;
            countDelivered += 1;
            countUndelivered -= 1;
            if (countUndelivered >= 0) {
                obj.planNo = planTableCheckedObj.planNo;
                obj.planId = planTableCheckedObj.id;
                vm.carLst.push(obj);
                vm.carIds.push(obj.carId);
            } else {
                countDelivered -= 1;
                countUndelivered += 1;
                countDelivery -= 1;
            }
            planTableCheckedObj.countDelivered = countDelivered;
            planTableCheckedObj.countUndelivered = countUndelivered;
            var plan = vm.planLst.filter(function (plan) {
                return plan.id == planTableCheckedObj.id;
            })[0];
            plan.countDelivered = countDelivered;
            plan.countUndelivered = countUndelivered;
            plan.countDelivery = (plan.countDelivery^0) + countDelivery;
            return countDelivery > 0;
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
    initXlsRead();
}

function initXlsRead() {
    new XlsRead({
        elid: 'importDoc',
        callback: function (action, arg1) {
            switch (action) {
                case 'onBeforeUpload':{
                    if (!planTableCheckedObj) {
                        alert('请选择车型方案信息');
                        return false;
                    }
                    if (planTableCheckedObj.countUndelivered < 1) {
                        alert('该车型方案无可交车数量');
                        return false;
                    }
                    return true;
                }
                case 'onDateReady':{
                    // console.log(arg1);
                    break;
                }
                case 'onDateItemRead':{
                    // console.log(arg1);
                    return vm.onDateItemRead(arg1);
                }
                case 'onDateFinish':{
                    // console.log(arg1);
                    vm.reloadPlan();
                    vm.reload();
                    break;
                }
            }
        },
    }).initView();
}

function initUpload(upload) {
    Upload({
        elid: 'contractFileLst',
        edit: false,
        fileLst: vm.contracbusiness.contractFileLst,
        param: {'path':'contract-contract'},
        fidedesc: '合同附件'
    }).initView();
}

function initData() {
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_timeRepayment: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择还款时间";
                }
            }
        },
        validate_timeDelivery: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择交车时间";
                }
            }
        },
        validate_deliveryOperationId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择交车工作人员";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('radio(billType)', function (data) {
        vm.delivery.billType = data.value;
    });

    form.on('select(deliveryOperation)', function (data) {
        vm.delivery.deliveryOperationId = data.value;
        if(data.value != null && data.value != ''){
            vm.delivery.deliveryOperationName=data.elem[data.elem.selectedIndex].text
        }else{
            vm.delivery.deliveryOperationName='';
        }
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#submit").on('click', function () {
        vm.verify = true;
    });

    $("#addCar").on('click', function () {
        vm.addCar();
    });

    $("#downExl").on('click', function () {
        vm.downExl();
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "plantableid",
        elem: '#planTable',
        cellMinWidth: 170,
        url: baseURL + 'contract/contracbusinessplan/queryList',
        where: {
            contractId: vm.contracbusiness.id,
            hasUndelivered: true,
        },
        // data: vm.planLst||[],
        cols: [[
            {title: '选择', type:'radio'},
            {field:'planNo', width: 212, title: '编号', templet: function (d) {return isEmpty(d.planNo);}},
            {field:'brandName', title: '品牌', templet: function (d) {return isEmpty(d.brandName);}},
            {field:'seriesName', title: '车系', templet: function (d) {return isEmpty(d.seriesName);}},
            {field:'modelName', title: '车型', templet: function (d) {return isEmpty(d.modelName);}},
            {field:'countSigned', title: '签约数量', templet: function (d) {return isEmpty(d.countSigned);}},
            {field:'countDelivered', title: '已交车数量', templet: function (d) {return isEmpty(d.countDelivered);}},
            {field:'countUndelivered', title: '待交车数量', templet: function (d) {return isEmpty(d.countUndelivered);}},
            {field:'downPayment', title: '首付款（含税，元/辆）', templet: function (d) {return isEmpty(d.downPayment);}},
            {field:'cashDeposit', title: '保证金（含税，元/辆）', templet: function (d) {return isEmpty(d.cashDeposit);}},
            {field:'servicingFee', title: '整备费（含税，元/辆）', templet: function (d) {return isEmpty(d.servicingFee);}},
            {field:'totalPrice', title: '车辆总单价（含税，元/辆）', templet: function (d) {return isEmpty(d.totalPrice);}},
            {field:'monthlyRent1', title: '月租金（含税，元/辆）', templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'monthlyRent2', title: '挂靠费（含税，元/辆）', templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'coverCharge', title: '服务费（含税，元/辆）', templet: function (d) {return isEmpty(d.coverCharge);}},
            {field:'balancePayment', title: '尾款（含税，元/辆）', templet: function (d) {return isEmpty(d.balancePayment);}},
            {field:'tenancy', title: '租期', templet: function (d) {return isEmpty(d.tenancy);}},
            {field:'paymentMethod', title: '付款方式', templet: function (d) {return getPaymentMethodStr(d.paymentMethod);}},
        ]],
        page: true,
        loading: true,
        limits: [5, 10, 20, 50],
        limit: 5,
        autoColumnWidth: {
            init: false
        },
        parseData: function(res){
            if (vm.planLst)res.data.forEach(function (d) {
                vm.planLst.forEach(function (i) {
                    if (d.id == i.id) {
                        d.countDelivered = i.countDelivered;
                        d.countUndelivered = i.countUndelivered;
                    }
                })
                if (planTableCheckedObj != null) {
                    if (d.id === planTableCheckedObj.id) {
                        d.LAY_CHECKED = true;
                    }
                }
            });

            return res;
        },
        done: function(res, curr, count){
            soulTable.render(this);
            onRentChangedTableView(vm.contracbusiness.rentType);
        }
    });

    table.render({
        id: "cartableid",
        elem: '#carTable',
        cellMinWidth: 170,
        data: vm.carLst||[],
        cols: [[
            {title: '操作', templet:'#barTpl'},
            {field:'planNo', width: 212, title: '所属方案', templet: function (d) {return isEmpty(d.planNo);}},
            {field:'carNo',title: '车牌', templet: function (d) {return isEmpty(d.carNo);}},
            {field:'modelSeriesName', title: '品牌/车系/车型', templet: function (d) {return isEmpty(d.modelSeriesName);}},
            {field:'vinNo', title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
            {field:'carStatus', title: '车辆状态', templet: function (d) {return isEmpty(d.carStatus);}},
            {field:'insurance', title: '保险', templet: function (d) {return isEmpty(d.insurance);}},
            {field:'depotName', title: '车辆所属仓库', templet: function (d) {return isEmpty(d.depotName);}},
            {field:'deptName', title: '所属公司', templet: function (d) {return isEmpty(d.deptName);}},
        ]],
        page: true,
        loading: true,
        limits: [5, 10, 20, 50],
        limit: 5,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {
}

function initTableEvent(table) {
    table.on('radio(planTable)', function(obj){
        if (obj.checked) {
            planTableCheckedObj = obj.data;
        } else {
            planTableCheckedObj = null;
        }
    });
    table.on('tool(carTable)', function (obj) {
        var layEvent = obj.event;
        if (layEvent === 'del') {
            vm.carDelectObj(obj);
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem: '#timeRepayment',
        trigger: 'click',
        type: 'date',
        done: function (value) {
            vm.delivery.timeRepayment = value;
        }
    });

    laydate.render({
        elem: '#timeDelivery',
        trigger: 'click',
        type: 'datetime',
        done: function (value) {
            vm.delivery.timeDelivery = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}

function onRentChangedTableView(rentType) {
    var ragex;
    switch (rentType^0) {
        case 3://展示车
        case 4://试驾车
        case 1:{//经租
            ragex = /(downPayment|balancePayment|servicingFee|totalPrice|monthlyRent2)/;
            break;
        }
        case 2:{//以租代购
            ragex = /(downPayment|cashDeposit|totalPrice|monthlyRent2)/;
            break;
        }
        case 5:{//融租
            ragex = /(cashDeposit|servicingFee|totalPrice|monthlyRent2|coverCharge)/;
            break;
        }
        case 6:{//直购
            ragex = /(downPayment|balancePayment|cashDeposit|servicingFee|monthlyRent1|monthlyRent2|coverCharge|tenancy|paymentMethod)/;
            break;
        }
        case 7:{//挂靠
            ragex = /(downPayment|balancePayment|cashDeposit|servicingFee|totalPrice|monthlyRent1|coverCharge)/;
            break;
        }
        default:ragex = /(downPayment|balancePayment|cashDeposit|servicingFee|totalPrice|monthlyRent1|monthlyRent2|coverCharge|tenancy|paymentMethod)/;
    }
    $('th').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
    $('td').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
}