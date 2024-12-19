$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        initTable(layui.table,layui.soulTable)
        layui.form.render();
    });
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
        var cascader = layui.cascader;
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            vm.selectData = r.carTreeVoList;
            cascader({
                elem: "#a",
                data: vm.selectData,
                success: function (valData,labelData) {
                    vm.spareCarApply.brandId = valData[0];
                    vm.spareCarApply.brandName = labelData[0];
                    vm.spareCarApply.seriesId = valData[1];
                    vm.spareCarApply.seriesName = labelData[1];
                    vm.spareCarApply.modelId = valData[2];
                    vm.spareCarApply.modelName = labelData[2];
                }
            });
        });
    });
    layui.use(['layer','form','laydate','upload'], function () {
        layui.form.on('submit(save)', function () {
            vm.save();
            return false;
        });
        layui.form.on('select(feeItem)', function (data) {
            vm.feeItemId = data.value;
        });
        layui.form.on('select(handleUserNameFilter)', function (data) {
            var usrid = data.value;
            vm.spareCarApply.handleUserId = usrid;
            var obj = vm.usrLst.filter(function (obj) {
                return obj.userId == usrid;
            })[0];
            if (obj != null){
                vm.spareCarApply.handleUserName = obj.username;
            }else {
                vm.spareCarApply.handleUserName = '';
            }
        });
        layui.form.on('radio(isApplyCheck)', function (data) {
            vm.spareCarApply.isApply = data.value;
            if(data.value == '1'){
                vm.feeItemShow = true;
            }else{
                vm.feeItemShow = false;
            }
        });
        layui.form.on('select(feeItemPaymentMethod)',function (data) {
            var serializeId = data.elem.attributes.sid.value;
            vm.orderRelerecord.feeLst.forEach(function (value) {
                if (value.serializeId == serializeId) {
                    value.paymentMethod = data.value;
                }
            });
        });
        layui.form.on('select(contract)', function (data) {
            console.log('选择了', data)
            var code = data.value;
            if (code == null || code === ''){
                vm.resetContract();
            }
            var obj = vm.contractLst.filter(function (obj) {
                return obj.code == code;
            })[0];

            console.log('找到obj', obj)
            if (obj != null){
                vm.spareCarApply = Object.assign({}, vm.spareCarApply, {
                    id:obj.id,
                    spareContractNo:obj.code,
                    startTime:obj.timeStart,
                    endTime:obj.timeFinish,
                    contractRemark:obj.desc,
                });
                console.log('spareCarApply', vm.spareCarApply)
                vm.fileLst1.splice(0,vm.fileLst1.length);
                if (obj.fileLst != null && obj.fileLst.length > 0){
                    obj.fileLst.forEach(function (f) {
                        vm.fileLst1.push(f);
                    })
                }
                vm.fileLstId1 = 'contract_' + uuid(6);
            }
        });
        layui.form.verify({
            carNoVerify:function(value){
                if(value == '' || value == null){
                    return '请根据车牌号选择车辆订单！'
                }
            },
            vinNoVerify:function(value){
                if(value == '' || value == null){
                    return '请根据车架号选择车辆订单！'
                }
            },
            applyReasonVerify:function(value){
                if(value == '' || value == null){
                    return '请输入申请备用车原因！'
                }
            },
            handleTimeVerify:function(value){
                if(value == '' || value == null){
                    return '请输入备用车交车时间！'
                }
            },
            returnTimeVerify:function(value){
                if(value == '' || value == null){
                    return '请输入备用车预计归还时间！'
                }
            },
            brandVerify:function(value){
                if(value == '' || value == null){
                    return '请输入备用车品牌/车系/车型！'
                }
            },
            spareCarNoVerify:function(value){
                if(value == '' || value == null){
                    return '请选择备用车车牌号！'
                }
            },
            spareVinNoVerify:function(value){
                if(value == '' || value == null){
                    return '请选择备用车车架号！'
                }
            },
            handleUserNameVerify:function(value){
                if(value == '' || value == null){
                    return '请选择备用车交车工作人员！'
                }
            }
        });
        layui.laydate.render({
            elem: '#handleTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.handleTime = value;
            }
        });
        layui.laydate.render({
            elem: '#returnTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.returnTime = value;
            }
        });
        layui.laydate.render({
            elem: '#nextDate',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.nextDate = value;
            }
        });
        layui.laydate.render({
            elem: '#startTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.startTime = value;
            }
        });
        layui.laydate.render({
            elem: '#endTime',
            format: 'yyyy-MM-dd',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.spareCarApply.endTime = value;
            }
        });
        layui.laydate.render({
            elem: '#paymentDay',
            trigger: 'click',
            // theme: 'grid',
            type: 'date',
            // height:'322px',
            // isInitValue: false,
            // showBottom: false,
            value: '1989-10-01',
            min: '1989-10-01',
            max: '1989-10-31',
            // position:'fixed',
            done: function (value, date) {
                Vue.set(vm.spareCarApply, "paymentDay", date.date);
                $('input#paymentDayVal').val(date.date);
            },
            ready: function(){//
                $('.laydate-theme-grid>div.layui-laydate-hint').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-header').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-content>table>thead').hide();
                $('.laydate-theme-grid>div>div.layui-laydate-content>table>tbody>tr>td.laydate-disabled').hide();
            }
        });
    });
    Upload('fileLst', true, vm.fileLst, null, sessionStorage.getItem("userId"), sessionStorage.getItem("username"), {'path':'spare'}, '备用车附件').initView();
    contractUpload = Upload('fileLst1', true, vm.fileLst1, null, sessionStorage.getItem("userId"), sessionStorage.getItem("username"), {'path':'contract'}, '合同');
    contractUpload.initView();
    layui.form.render();
});
var contractUpload;
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{
        spareCar: {},
        fileLst: [],
        fileLstId: 'sparecar_0',
        fileLst1: [],
        fileLstId1: 'contract_0',
        spareCarApply:{},
        feeItemLst: [],
        contractLst: [],
        usrLst: [],
        feeItemId: '',
        orderRelerecord: {
            operationId: '',
            fileLst: [],
            feeLst: []
        },
        feeItemShow: false
    },
    created: function(){
        var _this = this;
        $.get(baseURL + "contract/contracordernotemplate/contractLst/"+_this.spareCarApply.rentType, function (r) {
            _this.contractLst = r.contractLst;
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });
        if (_this.spareCarApply.handleUserId == null){
            _this.spareCarApply.handleUserId = sessionStorage.getItem("userId");
            _this.spareCarApply.handleUserName = sessionStorage.getItem("username");
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        inputBindtapHandleMile: function () {
            this.spareCarApply.handleMile = checkNum(this.spareCarApply.handleMile);
        },
        inputBindtapNextMile: function (){
            this.spareCarApply.nextMile = checkNum(this.spareCarApply.nextMile);
        },
        delContractFile: function (id) {
            for(var i = 0 ;i<vm.fileLst1.length;i++) {
                if(vm.fileLst1[i].id === id) {
                    vm.fileLst1.splice(i,1);
                    i= i-1;
                }
            }
        },
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        showDoc: function (fileName, url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        addFeeItem: function(){
            if (vm.feeItemId == null || vm.feeItemId == ''){
                alert('请先选择费用项类型');
                return;
            }
            if(vm.feeItemId == 'monthly_rent'){
                if(vm.spareCarApply.handleTime == null || vm.spareCarApply.handleTime == '' || vm.spareCarApply.returnTime == null || vm.spareCarApply.returnTime == ''){
                    alert('填写月租之前需要先填写交车时间和预计归还时间');
                    return false;
                }
            }
            if (vm.orderRelerecord.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            if (vm.feeItemId == 'monthly_rent' && vm.orderRelerecord.feeLst.filter(function (value) {
                return value.typeFieldName == 'monthly_rent';
            }).length > 0) {
                alert('月租只能添加一条');
                return;
            }
            var feeItem = vm.feeItemLst.filter(function (f) {
                return f.fieldName == vm.feeItemId;
            })[0];
            // var oldFeePlan = vm.selectCar.planList.filter(function (f) {
            //     return f.typeFieldName == vm.feeItemId;
            // })[0];
            // if (oldFeePlan == null )oldFeePlan = {};
            var serializeId = 0;
            if(vm.orderRelerecord.feeLst.length > 0){
                vm.orderRelerecord.feeLst.forEach(function (value) {
                    if (value.serializeId > serializeId) serializeId = value.serializeId;
                })
            }
            var item = {
                serializeId:serializeId+1,
                elid: 'serializeId_'+(serializeId+1),
                typeFieldName:feeItem.fieldName,
                typeFieldDesc:feeItem.name,
                multiple:feeItem.multiple,
                money:'',
                // money:oldFeePlan.money,
                paymentMethod:feeItem.defaultPaymentMethod,
                timePayment1st:''
                // timePayment1st:oldFeePlan.timePayment1st
            };
            vm.orderRelerecord.feeLst.push(item);
            vm.reloadFeeItem();
        },
        transferCar: function(){
            var param = {
                brandId: vm.spareCarApply.brandId,
                seriesId: vm.spareCarApply.seriesId,
                modelId: vm.spareCarApply.modelId,
                isSpareCar: 1
            };
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/common/selectcarcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        selectCar: function(){
            var index = layer.open({
                title: "选择车辆订单",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/order/selectordercar.html",
                end: function(){
                    layer.close(index);
                }
            });
            // layer.full(index);
        },
        initCommonData: function(data){
            vm.spareCarApply = Object.assign({},vm.spareCarApply,{
                carNo:data.carNo,
                vinNo:data.vinNo,
                carId:data.carId
            })
        },
        initData: function(data){
            vm.spareCarApply.orderCarId = data.id;
            vm.spareCar = Object.assign({}, vm.spareCar,{
                carNo:data.carNo,
                vinNo:data.vinNo,
                rentType:data.rentType,
                carId:data.carId,
                brandModelName:data.brandModelName,
                customer:data.customer,
                businessType:data.businessType,
                contractNo:data.contractNo,
                orderCarNo:data.orderCarNo,
                payType:data.payType,
                payDay:data.payDay,
                rentStart:data.rentStart,
                rentEnd:data.rentEnd
            });
            $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + data.rentTypeItem, function (r) {
                vm.feeItemLst = r.datas;
            });
        },
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        delFile1: function (id) {
            for(var i = 0 ;i<vm.fileLst1.length;i++) {
                if(vm.fileLst1[i].id === id) {
                    vm.fileLst1.splice(i,1);
                    i= i-1;
                }
            }
        },
        save: function(){
            vm.spareCarApply.fileLst = vm.fileLst;
            vm.spareCarApply.contractLst = vm.fileLst1;
            vm.spareCarApply.feeLst = vm.orderRelerecord.feeLst;
            if (vm.orderRelerecord.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            if(vm.orderRelerecord.feeLst.filter(function (value) {
                return value.typeFieldName == 'monthly_rent';
            }).length > 0){
                if(vm.spareCarApply.paymentDay == null || vm.spareCarApply.paymentDay == ''){
                    alert('备用车申请有月租,需要填写付款日！');
                    return;
                }
                var paymentMethod = vm.orderRelerecord.feeLst.filter(function(value){
                    if(value.typeFieldName == 'monthly_rent'){
                        return value.paymentMethod;
                    }
                })[0].paymentMethod;
                $.ajaxSettings.async = false;
                var verificationTime;
                $.get(baseURL + 'order/ordercar/verificationTime?startTime='+vm.spareCarApply.handleTime+'&endTime='+vm.spareCarApply.returnTime+'&paymentMethod='+paymentMethod, function (r) {
                    verificationTime = r;
                });
                $.ajaxSettings.async = true;
                if (verificationTime == null || parseInt(verificationTime.code) !== 0){
                    RemoveLoading();
                    alert(verificationTime.msg);
                    return;
                }
            }else{
                var startTime = new Date(Date.parse(vm.spareCarApply.handleTime));
                var endTime = new Date(Date.parse(vm.spareCarApply.returnTime));
                if(startTime>endTime){
                    alert("预计归还时间小于备用车交车时间！")
                    return;
                }
            }
            vm.spareCarApply.spareCarStatus = 2;
            var url =  "cartransfer/sparecar/save";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.spareCarApply),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        cancel: function(){
            parent.layer.closeAll();
        },
        resetContract: function () {
            vm.spareCarApply = Object.assign({}, vm.spareCarApply, {
                id:null,
                spareContractNo:null,
                startTime:null,
                endTime:null,
                contractRemark:null
            });
            contractUpload.clearFile();
        },
        reloadFeeItem: function () {
            layui.table.reload('feeLstid', {
                page: {
                    curr: getCurrPage('feeLstid', vm.orderRelerecord.feeLst.length)
                },
                data: vm.orderRelerecord.feeLst});
        },
        feeItemDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.orderRelerecord.feeLst.length;i++) {
                    if(vm.orderRelerecord.feeLst[i].serializeId === serializeId) {
                        vm.orderRelerecord.feeLst.splice(i,1);
                        i= i-1;
                        break;
                    }
                }
                vm.reloadFeeItem();
            });
        },
        editfeeItemlistener: function (obj) {
            //
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regInt = /^[0-9]*$/;
            var v;
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
                v = '';
            }else {
                if (field === 'money') {//分期金额
                    v = Number(value).toFixed(2);
                }
            }
            vm.orderRelerecord.feeLst.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) value.money = v;
            });
            vm.reloadFeeItem();
        },
    }
});

function inputSelect(){
        var code = $("#contractValue").val();
        var id = $('datalist>option[value="'+code+'"]').attr("text");
        if (id == null || id === ''){
            vm.resetContract();
            Vue.set(vm.spareCarApply, 'spareContractNo', code);
        }
        var obj = vm.contractLst.filter(function (obj) {
            return obj.id == id;
        })[0];
        if (obj != null){
            vm.spareCarApply = Object.assign({}, vm.spareCarApply, {
                id:id,
                spareContractNo:obj.code,
                startTime:obj.timeStart,
                endTime:obj.timeFinish,
                contractRemark:obj.desc,
            });
            vm.spareCarApply = Object.assign({},vm.spareCarApply,{
                contractId:id
            });
            contractUpload.updateFile(obj.fileLst);
        }
}
function initTable(table, soulTable) {
    table.render({
        id: 'feeLstid',
        elem: '#feeLst',
        data: vm.orderRelerecord.feeLst,
        cols: [[
            {field:'typeFieldDesc', title: '类型'},
            {field:'money', title: '金额/元', edit: 'text'},
            {field:'paymentMethod', title: '付款方式', templet: '#selectPaymentMethod'},
            {field:'paymentMethod', title: '总期数', templet: function (d) {
                    var txt = '--';
                    if (d.typeFieldName === 'monthly_rent' && vm.spareCarApply.handleTime != null && vm.spareCarApply.handleTime != '' && vm.spareCarApply.returnTime != null && vm.spareCarApply.returnTime != ''){
                        txt = calculateDateDifferMonths(vm.spareCarApply.handleTime, vm.spareCarApply.returnTime);
                    }
                    return txt;
                }},
            {field:'timePayment1st', title: '第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
                    var txt = d.timePayment1st;
                    if ((/\d+/).test(txt)){
                        txt = isEmpty(dateFormatYMD(txt));
                    }else if (d.typeFieldName === 'monthly_rent'){
                        txt = '--';
                    }else txt = '请选择第一次付款日期';
                    return txt;
                }},
            {title: '操作', width: 120, templet: '#feeItemBarTpl', fixed: "right", align: "center"}
        ]],
        page: true,
        limits: [5, 8, 15],
        limit: 5,
        done: function (res, curr, count) {
            $('td[data-field="paymentMethod"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;
                var value = vm.orderRelerecord.feeLst.filter(function (value) {
                    return value.serializeId == serializeId;
                })[0].paymentMethod;
                $(this).val(value);
            });
            layui.form.render('select');
            $('td[data-field="timePayment1st"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {
    table.on('edit(feeLst)', function(obj){
        vm.editfeeItemlistener(obj);
    });
}

function initTableEvent(table) {
    table.on('tool(feeLst)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'delect') {
            vm.feeItemDelectObj(obj);
        }else if (layEvent === 'selectTimePayment1st') {
            if (data.typeFieldName == 'monthly_rent'){
                return;
            }
            var txt = '';
            if ((/\d+/).test(data.timePayment1st)){
                txt = isEmpty(dateFormatYMD(data.timePayment1st));
            }else {
                var now = new Date();
                txt = now.format('yyyy-MM-dd');
            }
            this.firstChild.textContent = txt;
            layui.laydate.render({
                elem: this.firstChild,
                trigger: 'click',
                closeStop: this,
                isInitValue: false,
                value: txt,
                show: true,
                done: function (value, date) {
                    data.timePayment1st = new Date(value).getTime();
                    vm.orderRelerecord.feeLst.forEach(function (value) {
                        if (value.serializeId === data.serializeId) value.timePayment1st = data.timePayment1st;
                    });
                    vm.reloadFeeItem();
                }
            });
        }
    });
}
function calculateDateDifferMonths(start, end) {
    var start_datas = start.split('-');
    var end_datas = end.split('-');
    var start_year = parseInt(start_datas[0]);
    var start_month = parseInt(start_datas[1]);
    var start_day = parseInt(start_datas[2]);
    var end_year = parseInt(end_datas[0]);
    var end_month = parseInt(end_datas[1]);
    var end_day = parseInt(end_datas[2]);
    return differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
}
function differMonths(start_year, start_month, start_day, end_year, end_month, end_day) {
    if (start_year === end_year){//同一年
        if (start_month === end_month){//同月
            if (start_day < end_day){//开始日小于结束日
                if (start_day > 1 || !isMonthLastday(end_year, end_month, end_day)){//不足一个月
                    return 0;
                } else {
                    if (vm.tenancyCalcType === 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            } else {//开始日大于结束日
                return 0;
            }
        } else {//不同月
            if (start_month < end_month){//开始月小于结束月
                if ((start_month + 1) < end_month) {//开始月后延一月小于结束月
                    start_month++;
                    // if (start_day > getMonthLastday(start_year, start_month)) {
                    //     start_day = getMonthLastday(start_year, start_month);
                    // }
                    return 1 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
                } else {
                    if (start_day === end_day) {
                        return 1;
                    } else if (start_day < end_day) {
                        if (vm.tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
                            return 2;
                        } else return 1;
                    } else {//开始月后延一月等于结束月并且开始日大于结束日
                        if (isMonthLastday(end_year, end_month, end_day)) {//结束日是当月最后一天
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            } else {//开始月大于结束月
                return 0;
            }
        }
    } else if (start_year < end_year) {//跨年-开始年小于结束年
        if ((start_year + 1) < end_year) {//开始年与结束年相差大于一年
            start_year++;
            return 12 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
        } else if ((start_year + 1) === end_year) {//开始年与结束年相差一年
            var diff = 13 - start_month;
            if (end_month === 2){//开始时间与结束时间相差一个月
                start_year++;
                start_month = 1;
                if (start_day > end_day) diff--;
                return diff + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
            }else if (end_month > 1){//开始时间与结束时间相差超过一个月
                start_year++;
                start_month = 1;
                return diff + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
            } else {
                if (diff > 1) {//开始时间与结束时间相差超过一个月
                    start_month++;
                    return 1 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
                } else {//开始时间与结束时间相差一个月或不足一个月
                    if (start_day === end_day){
                        return 1;
                    } else if (start_day < end_day) {
                        if (vm.tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
                            return 2;
                        } else return 1;
                    } else {//开始月后延一月等于结束月并且开始日大于结束日
                        if (isMonthLastday(end_year, end_month, end_day)) {//结束日是当月最后一天
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        }
    } else {
        return 0;
    }
}

function isMonthLastday(year, month, day) {
    return day === getMonthLastday(year, month);
}

function getMonthLastday(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:{
            return 31;
        }
        case 4:
        case 6:
        case 9:
        case 11:{
            return 30;
        }
        case 2:{
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return 29;
            } else {
                return 28;
            }
        }
    }
}
