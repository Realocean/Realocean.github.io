$(function () {
    var carSourceType = window.localStorage.getItem("carSourceType");
    if(carSourceType == 2){
        $("#jzmodel").css('display','none');
    } else {
        $("#jzmodel").css('display','block');
    }
    if(carSourceType == 3){
        $("#ghmodel").css('display','block');
    } else {
        $("#ghmodel").css('display','none');
    }

    if(carSourceType == 2){
        $("#totalPrice").show();
    } else {
        $("#totalPrice").hide();
    }

    vm.detail(window.localStorage.getItem("id"));

    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);

        layui.form.on('select(paymentMethod)', function (data) {
            vm.carSourceOrder.refundType = data.value;
        });

        layui.form.on('select(feeItem)', function (data) {
            vm.feeItemId = data.value;
        });

        var laydate = layui.laydate;
        var rentStartDate =laydate.render({
            elem: '#rentStartDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carSourceOrder.rentStartDate = value;
                var month = date.month -1;
                rentEndDate.config.min = date;
                rentEndDate.config.min.month = month;
            }
        });
        var rentEndDate = laydate.render({
            elem: '#rentEndDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carSourceOrder.rentEndDate = value;
                var month = date.month -1;
                rentStartDate.config.max = date;
                rentStartDate.config.max.month = month;
            }
        });

        //提车时间
        laydate.render({
            elem: '#purchaseDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carSourceOrder.purchaseDate=value;
            }
        });

        // 预计过户时间
        laydate.render({
            elem: '#transferDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.carSourceOrder.transferDate=value;
            }
        });

        layui.form.render();
    });

    // 附件上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#orderSourceFile',
            url: baseURL + 'file/uploadInsuranceFile',
            data: {'path': 'orderSourceFile'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            done: function (res) {
                if (res.code != '0') {
                    layer.msg('上传失败', {icon: 5});
                    vm.delFile(fileIdTmp);
                    fileIdTmp = null;
                    return false;
                }
                res.data.forEach(function (value) {
                    var extIndex = value.resultFilePath.lastIndexOf('.');
                    var ext = value.resultFilePath.slice(extIndex);
                    var fileNameNotext = value.fileName;
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.fileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc: '车辆来源订单附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileNameNotext,
                        nameExt: ext,
                        typeFile: fileType,
                        url: value.resultFilePath
                    };
                    vm.fileList.push(fileTmp);
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                });
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        carSourceOrder: {

        },
        fileList: [],
        fileLstId: '0',
        feeItemLst: [],
        feeItemId: '',
        orderRelerecord: {
            feeLst: []
        },
        verify: false
    },
    created: function(){
       var _this = this;
        /*var param = parent.layer.boxParams.boxParams;
        _this.carSourceOrder = param.data;*/
        //var value = vm.carSourceOrder.carSourceType;


    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "pay/carsourceorder/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        if(r.carSourceOrder.orderRelerecord != null){
                            if(r.carSourceOrder.orderRelerecord.feeLst != null){
                                vm.orderRelerecord.feeLst = r.carSourceOrder.orderRelerecord.feeLst;
                                vm.reloadFeeItem();
                            }
                        }
                        vm.carSourceOrder = r.carSourceOrder;

                        // 附件
                        vm.fileList = r.carSourceOrder.fileList;

                        var type;
                        if(vm.carSourceOrder.carSourceType === '1' || vm.carSourceOrder.carSourceType === 1){
                            type = "7";
                        } else if(vm.carSourceOrder.carSourceType === '2' || vm.carSourceOrder.carSourceType === 2){
                            type = "6";
                        } else {
                            type = "8";
                        }
                        // 直购=6 经租=7 以租代购=8
                        // 获取费用项
                        if(type == "6" || type == "7"){
                            $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + type, function (r) {
                                vm.feeItemLst = r.datas;
                            });
                        } else {
                            $.get(baseURL + "order/orderfeeitemdict/selectYzdgFeeItem/", function (r) {
                                vm.feeItemLst = r.datas;
                            });
                        }

                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        delFile: function (id) {
            for(var i = 0 ;i<vm.fileList.length;i++) {
                if(vm.fileList[i].id === id) {
                    vm.fileList.splice(i,1);
                    i= i-1;
                }
            }
        },

        addFeeItem: function () {
            if (vm.feeItemId == null || vm.feeItemId == ''){
                alert('请先选择费用项类型');
                return;
            }
            if (vm.orderRelerecord.feeLst.filter(function (value) {
                 return (value.money == null || String(value.money).length < 1)
                     ||(value.paymentMethod == null || !(/[1-5]{1}/).test(value.paymentMethod))
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
                paymentMethod:5,
                timePayment1st:''
            };
            vm.orderRelerecord.feeLst.push(item);
            vm.reloadFeeItem();
        },

        reloadFeeItem: function () {
            layui.table.reload('feeLstid', {
                page: {
                    curr: getCurrPage('feeLstid', vm.orderRelerecord.feeLst.length)
                },
                data: vm.orderRelerecord.feeLst});
        },

        editfeeItemlistener: function (obj) {
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

        // 获取合同数据
        selectContract:function (event){
            var index = layer.open({
                title: "选择车辆来源合同",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectcontract.html",
                end: function(){
                    layer.close(index);
                }
            });
        },

        confirmContract: function(data){
            vm.carSourceOrder.contractNo = data.data.code;
            vm.carSourceOrder.contractId = data.data.id;
            vm.carSourceOrder = Object.assign({}, vm.carSourceOrder,{
                contractNo:data.data.code,
                contractId:data.data.id,
            });

            layer.closeAll();
            //vm.initModel();
        },

        initModel:function (){

            layui.use(['form'], function(){
                var value = $("#sourceType option:selected").val();
                $('#sourceType').find("option[value="+value+"]").attr("selected",true);
                layui.form.render('select') //再次渲染
            });
        },

        selectCarNo:function(){
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function(){
                    var carId = vm.carInforData.carId;
                    if(carId!=null && carId!='' && carId!=undefined){
                        vm.getCarBasicInforByCarNo(carId);
                    }
                }
            });
            layer.full(index);

        },
        //选择车架号
        selectVinNo:function(){
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function(){
                    var vinNo = vm.carInforData.vinNo;
                    if(vinNo!=null && vinNo!=''&& vinNo!=undefined){
                        vm.getCarBasicInforByVinNo(vinNo);
                    }
                }
            });
            layer.full(index);
        },

        // 选择供应商
        selectSupplier:function (){
            var index = layer.open({
                title: "选择供应商",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectsupplier.html",
                end: function(){
                    layer.close(index);
                }
            });
        },

        confirmSup: function(data){
            vm.carSourceOrder.supplierId = data.data.purchaseSupplierId;
            vm.carSourceOrder.supplierName = data.data.supplierName;
            vm.carSourceOrder = Object.assign({}, vm.carSourceOrder,{
                supplierId:data.data.purchaseSupplierId,
                supplierName:data.data.supplierName,
            });
            layer.closeAll();
        },

        //根据车牌号查询基本信息
        getCarBasicInforByCarNo:function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/"+carId,
                contentType: "application/json",
                data: {},
                success: function(r){
                    vm.carSourceOrder.carId = carId;
                    vm.carSourceOrder.carNo = r.baseInfor.carNo;
                    vm.carSourceOrder.vinNo = r.baseInfor.vinNo;
                    vm.carSourceOrder = Object.assign({}, vm.carSourceOrder,{
                        carNo:r.baseInfor.carNo,
                        vinNo:r.baseInfor.vinNo,
                        carId:carId,
                    });
                }
            });
        },

        //根据车架号查询基本信息
        getCarBasicInforByVinNo:function (vinNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByVinNo/"+vinNo,
                contentType: "application/json",
                data: {},
                success: function(r){
                    vm.carSourceOrder.carId = r.baseInfor.carId;
                    vm.carSourceOrder.carNo = r.baseInfor.carNo;
                    vm.carSourceOrder.vinNo = r.baseInfor.vinNo;
                    vm.carSourceOrder = Object.assign({}, vm.carSourceOrder,{
                        carNo:r.baseInfor.carNo,
                        vinNo:r.baseInfor.vinNo,
                        carId:r.baseInfor.carId,
                    });
                }
            });
        },

        saveOrUpdate: function (event) {
            var carSourceType = vm.carSourceOrder.carSourceType;
            if(carSourceType == null || carSourceType == ''){
                alert("车辆来源类型不能为空");
                return;
            }

            if (vm.orderRelerecord.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-5]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }

            if(vm.carSourceOrder.purchaseDate == null || vm.carSourceOrder.purchaseDate == ''){
                alert("提车日期不能为空");
                return;
            }
            if(vm.carSourceOrder.carSourceType == 2){
                if(vm.carSourceOrder.totalPrice == null || vm.carSourceOrder.totalPrice == ''){
                    alert("直购总单价不能为空");
                    return;
                }
            }
            if(carSourceType == 1 || carSourceType == 3){
                if(vm.carSourceOrder.carNo == null || vm.carSourceOrder.carNo == ''){
                    alert("请选择车牌号");
                    return;
                }
                if(vm.carSourceOrder.vinNo == null || vm.carSourceOrder.vinNo == ''){
                    alert("请选择车架号");
                    return;
                }
                /*if(vm.carSourceOrder.supplierName == null || vm.carSourceOrder.supplierName == ''){
                    alert("请选择供应商");
                    return;
                }*/
                if(vm.carSourceOrder.rentStartDate == null || vm.carSourceOrder.rentStartDate == ''){
                    alert("租期开始时间不能为空");
                    return;
                }
                if(vm.carSourceOrder.rentEndDate == null || vm.carSourceOrder.rentEndDate == ''){
                    alert("租期结束时间不能为空");
                    return;
                }

                var s = new Date(vm.carSourceOrder.rentStartDate);
                var n = new Date(vm.carSourceOrder.rentEndDate);
                if(n.getTime() < s.getTime()){
                    alert("租期开始时间不能大于租期结束时间！");
                    return false;
                }

                if(vm.carSourceOrder.rentMonthPrice == null || vm.carSourceOrder.rentMonthPrice == ''){
                    alert("月租金/台/元不能为空");
                    return;
                }
                // 校验输入金额格式，只能为正整数或者保留两位的正整数
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(!reg.test(vm.carSourceOrder.rentMonthPrice)){
                    alert("月租金输入格式不正确（格式：大于0的正整数或者带两位小数的正整数）");
                    return;
                }

                if(vm.carSourceOrder.refundType == null || vm.carSourceOrder.refundType == ''){
                    alert("请选择月租金还款方式");
                    return;
                }
                if(vm.carSourceOrder.payDate == null || vm.carSourceOrder.payDate == ''){
                    alert("付款日期不能为空");
                    return;
                }

                if(vm.carSourceOrder.amountPaid != undefined){
                    if(vm.carSourceOrder.amountPaid!=""){
                        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                        if(!reg.test(vm.carSourceOrder.amountPaid)){
                            alert("已支付金额/台/元输入格式不正确(格式：大于0的正整数或者带两位小数的正整数)");
                            return;
                        }
                    }

                }
            } else{
                if(vm.carSourceOrder.carNo == null || vm.carSourceOrder.carNo == ''){
                    alert("请选择车牌号");
                    return;
                }
                if(vm.carSourceOrder.vinNo == null || vm.carSourceOrder.vinNo == ''){
                    alert("请选择车架号");
                    return;
                }
                if(vm.carSourceOrder.amountPaid != undefined){
                    if(vm.carSourceOrder.amountPaid!=""){
                        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                        if(!reg.test(vm.carSourceOrder.amountPaid)){
                            alert("已支付金额/台/元输入格式不正确(格式：大于0的正整数或者带两位小数的正整数)");
                            return;
                        }
                    }

                }
            }
            vm.saveData();
        },

        saveData:function (event){
            vm.carSourceOrder.fileList = vm.fileList;
            vm.carSourceOrder.orderRelerecord = vm.orderRelerecord;
            var url = vm.carSourceOrder.id == null ? "pay/carsourceorder/save" : "pay/carsourceorder/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carSourceOrder),
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
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {


}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {

}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}

function initTable(table, soulTable) {
    table.render({
        id: 'feeLstid',
        elem: '#feeLst',
        data: vm.orderRelerecord.feeLst,
        cols: [[
            {field:'typeFieldDesc', title: '类型'},
            {field:'money', title: '金额/元', edit: 'text', event: 'money'},
            {field:'paymentMethod', title: '付款方式', templet: function (d) {
                    if(d.paymentMethod == 5){
                        return '一次性付清';
                    } else {
                        return '--';
                    }

                }},
            {field:'timePayment1st', title: '选择付款日期', event: 'selectTimePayment1st', templet: function (d) {
                    var txt = d.timePayment1st;
                    if ((/\d+/).test(txt)){
                        txt = isEmpty(dateFormatYMD(txt));
                    }else if (d.typeFieldName === 'monthly_rent'){
                        txt = '--';
                    }else txt = '请选择付款日期';
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
                btns: ['now', 'confirm'],
                show: true,
                done: function (value, date) {
                    data.timePayment1st = new Date(value).getTime();
                    vm.orderRelerecord.feeLst.forEach(function (value) {
                        if (value.serializeId === data.serializeId) value.timePayment1st = data.timePayment1st;
                    });
                    vm.reloadFeeItem();
                }
            });
        }else if (layEvent === 'money') {
            tableEditMaxlength('money', 10);
            tableEditOninputNum('money');
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem: '#paymentDay',
        trigger: 'click',
        theme: 'grid',
        type: 'date',
        isInitValue: false,
        showBottom: false,
        value: '1989-10-01',
        min: '1989-10-01',
        max: '1989-10-31',
        done: function (value, date) {
            Vue.set(vm.carSourceOrder, "payDate", date.date);
            $('input#paymentDayVal').val(date.date);
        },
        ready: function(){//
            $('.laydate-theme-grid>div.layui-laydate-hint').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-header').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>thead').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>tbody>tr>td.laydate-disabled').hide();
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

/*自定义处理数字*/
function zhzs(value) {
    value = value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
    if (value != '')
        value = parseFloat(value).toFixed(2);
    else
        value = parseFloat(0).toFixed(2);
    return value;
}
