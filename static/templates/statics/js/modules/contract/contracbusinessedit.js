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

var planTable;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        contracbusiness: {},
        customer: {},
        usrLst: [],
        deptList: [],
        contractFileLst: [],
        planLst: [],
        verify: false
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async= false;
        var param = parent.layer.boxParams.boxParams;
        _this.contracbusiness = param.data;
        _this.contractFileLst = param.data.contractFileLst;
        _this.planLst = param.data.planLst;
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList.filter(function (v) {
                return v.sysDeptType != 5;
            });
        });
        if (_this.contractFileLst == null) {
            _this.contractFileLst = []
        }
        if (_this.planLst == null) {
            _this.planLst = []
        } else {
            _this.planLst.forEach(function (item) {
                item.serializeId = uuid(16);
            });
        }
        if (_this.contracbusiness.rentType == null) {
            _this.contracbusiness.rentType = ''
        }
        if (_this.contracbusiness.lessorId == null) {
            _this.contracbusiness.lessorId = ''
        }
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if (vm.verify)if (!vm.planLst || vm.planLst.length < 1) {
                alert('请至少添加一条车型方案');
                return;
            }
            if (vm.verify)if (!verifyPlan(vm.planLst)) {
                alert('有未完善车型方案');
                return;
            }
            if (vm.verify)if (vm.contracbusiness.rentType != 6) {
                for (var i = 0; i < vm.planLst.length; i++) {
                    var plan = vm.planLst[i];
                    switch (parseInt(plan.paymentMethod^0)) {
                        case 1:{
                            if (plan.tenancy < 1){
                                alert('租期必须大于或等于付款租期');
                                return;
                            }
                            break;
                        }
                        case 2:{
                            if (plan.tenancy < 2){
                                alert('租期必须大于或等于付款租期');
                                return;
                            }
                            break;
                        }
                        case 3:{
                            if (plan.tenancy < 3){
                                alert('租期必须大于或等于付款租期');
                                return;
                            }
                            break;
                        }
                        case 6:{
                            if (plan.tenancy < 6){
                                alert('租期必须大于或等于付款租期');
                                return;
                            }
                            break;
                        }
                        case 4:{
                            if (plan.tenancy < 12){
                                alert('租期必须大于或等于付款租期');
                                return;
                            }
                            break;
                        }
                    }
                }
            }
            //
            vm.contracbusiness.planLst = vm.planLst;
            vm.contracbusiness.contractFileLst = vm.contractFileLst;
            //
            var param = JSON.parse(JSON.stringify(vm.contracbusiness));
            var countTotle = 0;
            for (var i = 0; i < param.planLst.length; i++) {
                var plan = param.planLst[i];
                if (plan.countSigned <= 0) {
                    alert('签约数量不能为0');
                    return;
                }
                plan.rentType = param.rentType;
                plan.countUndelivered = plan.countSigned;
                countTotle += parseInt(plan.countSigned);
            }
            param.countTotle = countTotle;
            param.countUndelivered = countTotle;
            //
            var url = vm.contracbusiness.id == null ? "contract/contracbusiness/save" : "contract/contracbusiness/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
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
        selectCustomer:function (){
            vm.customer = null;
            var index = layer.open({
                title: "选择承租方",
                type: 2,
                content: tabBaseURL + "modules/common/selectcustomer.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                },
                end: function(){
                    var obj = vm.customer;
                    if (obj != null){
                        Vue.set(vm.contracbusiness, "leaseeId", obj.id);
                        Vue.set(vm.contracbusiness, "leaseeName", obj.customerName);
                    }else {
                        Vue.set(vm.contracbusiness, "leaseeId", '');
                        Vue.set(vm.contracbusiness, "leaseeName", '');
                    }
                }
            });
            layer.full(index);
        },
        addPlan:function (){
            var index = layer.open({
                title: "选择车型",
                type: 2,
                area: ['80%', '80%'],
                boxParams: {
                    callback: function (datas) {
                        console.log(datas);
                        if (datas && datas.length > 0) {
                            datas.forEach(function (item) {
                                item.serializeId = uuid(32);
                                vm.planLst.push(item);
                            });
                            vm.reload();
                        }
                    }
                },
                content: tabBaseURL + "modules/contract/selectcarmodel.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        reload: function () {
            layui.table.reload('plantableid', {
                page: {
                    curr: getCurrPage('plantableid', vm.planLst.length)
                },
                data: vm.planLst
            });
            layui.table.render();
        },
        editPlanTablelistener: function (obj) {
            var field = obj.field;
            var value = obj.value;
            var monthlyRentReg = /(monthlyRent)\d/;
            vm.planLst.forEach(function (item) {
                if (item.serializeId === obj.data.serializeId) {
                    var exc = monthlyRentReg.exec(field);
                    if (exc) {
                        item[exc[1]] = value;
                    } else {
                        item[field] = value;
                    }
                }
            });
            vm.reload();
        },
        planDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0; i < vm.planLst.length; i++) {
                    if(vm.planLst[i].serializeId === serializeId) {
                        vm.planLst.splice(i,1);
                        i = i-1;
                        break;
                    }
                }
                vm.reload();
            });
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initUpload(upload) {
    Upload({
        elid: 'contractFileLst',
        edit: true,
        fileLst: vm.contractFileLst,
        param: {'path':'contract-contract'},
        fidedesc: '合同附件'
    }).initView();
}

function initData() {
    vm.reload();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_contractName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "合同名称不能为空";
                }
            }
        },
        validate_rentType: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "订单类型不能为空";
                }
            }
        },
        validate_salePersonId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "所属销售不能为空";
                }
            }
        },
        validate_leaseeName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "承租方不能为空";
                }
            }
        },
        validate_lessorId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "出租方不能为空";
                }
            }
        },
        validate_timeStart: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "合同开始时间不能为空";
                }
            }
        },
        validate_timeSigned: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "合同签约时间不能为空";
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

    form.on('select(rentType)', function (data) {
        vm.contracbusiness.rentType = data.value;
        vm.reload();
    });

    form.on('select(salePerson)', function (data) {
        vm.contracbusiness.salePersonId = data.value;
        if(data.value != null && data.value != ''){
            vm.contracbusiness.salePersonName=data.elem[data.elem.selectedIndex].text
        }else{
            vm.contracbusiness.salePersonName='';
        }
    });

    form.on('select(lessor)', function (data) {
        vm.contracbusiness.lessorId = data.value;
        if(data.value != null && data.value != ''){
            vm.contracbusiness.lessorName=data.elem[data.elem.selectedIndex].text
        }else{
            vm.contracbusiness.lessorName='';
        }
    });

    form.on('select(paymentMethod)',function (data) {
        var serializeId = data.elem.attributes.sid.value;
        vm.planLst.forEach(function (value) {
            if (value.serializeId == serializeId) {
                value.paymentMethod = data.value;
            }
        });
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = false;
        vm.contracbusiness.status = 1;
    });

    $("#submit").on('click', function () {
        vm.verify = true;
        vm.contracbusiness.status = 2;
    });
}

var colWidth = 170;
function initTable(table, soulTable) {
    planTable = table.render({
        id: "plantableid",
        elem: '#planTable',
        data: vm.planLst||[],
        cols: [[
            {field:'brandName', width: colWidth, title: '品牌', templet: function (d) {return isEmpty(d.brandName);}},
            {field:'seriesName', width: colWidth, title: '车系', templet: function (d) {return isEmpty(d.seriesName);}},
            {field:'modelName', width: colWidth, title: '车型', templet: function (d) {return isEmpty(d.modelName);}},
            {field:'countSigned', width: colWidth, title: '签约数量', templet: function (d) {return isEmpty(d.countSigned,'请输入签约数量');}, edit: 'text', event: 'countSigned'},
            {field:'downPayment', width: colWidth, title: '首付款（含税，元/辆）', templet: function (d) {return isEmpty(d.downPayment,'请输入首付款');}, edit: 'text', event: 'downPayment'},
            {field:'cashDeposit', width: colWidth, title: '保证金（含税，元/辆）', templet: function (d) {return isEmpty(d.cashDeposit,'请输入保证金');}, edit: 'text', event: 'cashDeposit'},
            {field:'servicingFee', width: colWidth, title: '整备费（含税，元/辆）', templet: function (d) {return isEmpty(d.servicingFee,'请输入整备费');}, edit: 'text', event: 'servicingFee'},
            {field:'totalPrice', width: colWidth, title: '车辆总单价（含税，元/辆）', templet: function (d) {return isEmpty(d.totalPrice,'请输入总单价');}, edit: 'text', event: 'totalPrice'},
            {field:'monthlyRent1', width: colWidth, title: '月租金（含税，元/辆）', templet: function (d) {return isEmpty(d.monthlyRent,'请输入月租金');}, edit: 'text', event: 'monthlyRent1'},
            {field:'monthlyRent2', width: colWidth, title: '挂靠费（含税，元/辆）', templet: function (d) {return isEmpty(d.monthlyRent,'请输入挂靠费');}, edit: 'text', event: 'monthlyRent2'},
            {field:'coverCharge', width: colWidth, title: '服务费（含税，元/辆）', templet: function (d) {return isEmpty(d.coverCharge,'请输入服务费');}, edit: 'text', event: 'coverCharge'},
            {field:'balancePayment', width: colWidth, title: '尾款（含税，元/辆）', templet: function (d) {return isEmpty(d.balancePayment,'请输入尾款');}, edit: 'text', event: 'balancePayment'},
            {field:'tenancy', width: colWidth, title: '租期', templet: function (d) {return isEmpty(d.tenancy,'请输入租期');}, edit: 'text', event: 'tenancy'},
            {field:'paymentMethod', width: colWidth, title: '付款方式', templet: '#selectPaymentMethod'},
            {title: '操作', width: colWidth, templet:'#barTpl'},
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
            onRentChangedTableView(vm.contracbusiness.rentType);
            $('div[lay-id="plantableid"]').width(getColWidth(vm.contracbusiness.rentType));
            tdHintColor('countSigned','downPayment','cashDeposit','servicingFee','totalPrice','monthlyRent1','monthlyRent2','coverCharge','balancePayment','tenancy');
            thHintColor('countSigned','downPayment','cashDeposit','servicingFee','totalPrice','monthlyRent1','monthlyRent2','tenancy','paymentMethod');
            $('td[data-field="paymentMethod"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;
                var data = vm.planLst.filter(function (value) {
                    return value.serializeId == serializeId;
                })[0];
                var value = '';
                if (data != null){
                    value = data.paymentMethod;
                }
                $(this).val(value);
            });
            layui.form.render('select');
            $('div[lay-id="plantableid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });
    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {
    table.on('edit(planTable)', function(obj){
        vm.editPlanTablelistener(obj);
    });
}

function initTableEvent(table) {
    table.on('tool(planTable)', function (obj) {
        var layEvent = obj.event;
        if (layEvent === 'del') {
            vm.planDelectObj(obj);
        } else if (layEvent === 'countSigned' || layEvent === 'tenancy') {
            tableEditMaxlength(layEvent, 5);
            tableEditOninputNumInteger(layEvent);
        }else {
            tableEditMaxlength(layEvent, 10);
            tableEditOninputNum(layEvent);
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem: '#timeStart',
        trigger: 'click',
        type: 'date',
        done: function (value) {
            vm.contracbusiness.timeStart = value;
        }
    });

    laydate.render({
        elem: '#timeSigned',
        trigger: 'click',
        type: 'date',
        done: function (value) {
            vm.contracbusiness.timeSigned = value;
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

function getColWidth(rentType) {
    var width = 0;
    var _colWidth = colWidth+24.5;
    switch (rentType^0) {
        case 3://展示车
        case 4://试驾车
        case 1:{//经租
            width += (_colWidth*10);
            break;
        }
        case 2:{//以租代购
            width += (_colWidth*11);
            break;
        }
        case 5:{//融租
            width += (_colWidth*10);
            break;
        }
        case 6:{//直购
            width += (_colWidth*6);
            break;
        }
        case 7:{//挂靠
            width += (_colWidth*8);
            break;
        }
        default:width += (_colWidth*5);
    }
    return width;
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

function tdHintColor(...tdfield) {
    tdfield.forEach(function (field) {
        var txtDiv = $('td[data-field="'+field+'"]>div');
        $.each(txtDiv, function (item) {
            var div = $(this);
            var txt = div.html();
            if (txt.match(/请输入(.*?)/)) {
                div.css('color','darkgray');
                new MutationObserver(function(mutations, observer){
                    console.log(mutations);
                    if (mutations[0].addedNodes.length > 0) {
                        var input = $(mutations[0].addedNodes[0]);
                        input.val('');
                    }
                }).observe(div.parent()[0], {
                    'childList': true
                });
            }
        });
    })
}

function thHintColor(...tdfield) {
    tdfield.forEach(function (field) {
        var txtDiv = $('th[data-field="'+field+'"]>div');
        var txtView = txtDiv.find('span');
        if (txtView.length === 1) {
            txtView.before('<span style="color:red">*</span>');
        }
    })
}

function verifyPlan() {
    for (var i = 0; i < vm.planLst.length; i++) {
        var item = vm.planLst[i];
        if (item.countSigned == null || item.countSigned === '') {
            return false;
        }
        var rentType = vm.contracbusiness.rentType^0;
        switch (rentType) {
            case 3://展示车
            case 4://试驾车
            case 1:{//经租
                if (item.cashDeposit == null || item.cashDeposit === '') {
                    return false;
                }
                break;
            }
            case 2:{//以租代购
                if (item.servicingFee == null || item.servicingFee === '') {
                    return false;
                }
                break;
            }
            case 5:{//融租
                if (item.downPayment == null || item.downPayment === '') {
                    return false;
                }
                break;
            }
            case 6:{//直购
                if (item.totalPrice == null || item.totalPrice === '') {
                    return false;
                }
                break;
            }
        }
        if (rentType != 6) {
            if (item.monthlyRent == null || item.monthlyRent === '') {
                return false;
            }
            if (item.tenancy == null || item.tenancy === '') {
                return false;
            }
            if (item.paymentMethod == null || item.paymentMethod === '') {
                return false;
            }
        }
    }
    return true;
}