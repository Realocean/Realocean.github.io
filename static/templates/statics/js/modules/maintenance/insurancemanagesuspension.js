$(function () {
    vm.detail(window.localStorage.getItem("jqxId"),window.localStorage.getItem("syxId"));
    var policyApplyNo = window.localStorage.getItem("policyApplyNo");
    var type = window.localStorage.getItem("type");
    var syxConfigDay = window.localStorage.getItem("syxConfigDay");
    vm.reloadSourceTable(policyApplyNo);
    vm.getInsuranceAmountStatus();
    vm.getPayObjectData();
    layui.use('form', function(){
        var form = layui.form;
        form.render(); //更新全部
    });

    if(type == "0" || syxConfigDay == "1"){
        layui.table.render({
            id: "insuranceTypeGrid",
            elem: '#insuranceTypeGrid',
            minWidth: 150,
            cols: [[
                {title:'操作',templet:'#barTpl',fixed:"left",align:"center"},
                {field:'commercialInsuranceName', title: '商业险种'},
                {field:'amountInsured',title: '保额/万元'},
                {field:'insuranceExpenses', title: '保险费/元'}
            ]],
            page: false,
            loading: false,
            limit: 500,
            done: function(res, curr, count){
                $('div[lay-id="insuranceTypeGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            }
        });
    }

    layui.table.render({
        id: "newinsuranceTypeGrid",
        elem: '#newinsuranceTypeGrid',
        minWidth: 150,
        cols: [[
            {title:'操作',templet:'#barTpl',fixed:"left",align:"center"},
            {field:'commercialInsuranceName', title: '商业险种'},
            {field:'amountInsured',title: '保额/万元'},
            {field:'insuranceExpenses', title: '保险费/元'}
        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function(res, curr, count){
            $('div[lay-id="insuranceTypeGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
        }
    });

    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        var upload = layui.upload;

        form.verify({
            compulsoryAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(value==''){
                    return '';
                } else {
                    if(!reg.test(value)){
                        return '交强险金额输入格式不正确，请确认!';
                    }
                }
            },

        });

        //交强险保险公司
        form.on('select(compulsoryCompanyId)', function (data) {
            vm.insuranceManage.compulsoryCompanyId = data.value;
        });
        //商业保险公司
        form.on('select(commercialCompanyId)', function (data) {
            vm.insuranceManage.commercialCompanyId = data.value;
        });
        //商业险种
        form.on('select(selectInsuranceTypeNo)', function (data) {
            vm.insuranceManage.insuranceTypeNo = data.value;
        });

        // 交强险付款对象
        form.on('select(compulsoryInsurancePayId)', function (data) {

            vm.insuranceManage.compulsoryInsurancePayId = data.value;
            // 获取名称
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code="+data.value,
                contentType: "application/json",
                data:null,
                success: function(r){
                    if(r.sysDictEntity!=null){
                        vm.insuranceManage.compulsoryInsurancePayName = r.sysDictEntity.value;
                    }else{
                        vm.insuranceManage.compulsoryInsurancePayName = '';
                    }
                }
            });
        });
        // 商业险付款对象
        form.on('select(commercialInsurancePayId)', function (data) {
            vm.insuranceManage.commercialInsurancePayId = data.value;
            // 获取名称
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code="+data.value,
                contentType: "application/json",
                data:null,
                success: function(r){
                    if(r.sysDictEntity!=null){
                        vm.insuranceManage.commercialInsurancePayName = r.sysDictEntity.value;
                    }else{
                        vm.insuranceManage.commercialInsurancePayName = '';
                    }
                }
            });
        });

        form.render();
    });

    // 交强险照片上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#jqxImages',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'jqx_images'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            choose: function (obj) {

                obj.preview(function (index, file, result) {
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var fileNameNotext = fileName.slice(0, extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.jqxFileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        nameDesc: '交强险照片',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.jqxFileList.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.jqxFileList.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delJqxFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delJqxFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });

    //商业险照片上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#syxImages',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'syx_images'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,zip,.rar',
            exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var fileNameNotext = fileName.slice(0, extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.syxxFileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        nameDesc: '商业险照片',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.syxxFileList.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.syxxFileList.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delSyxFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delSyxFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });

    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //交强险开始结束时间
        var compulsoryStopStartTime =laydate.render({
            elem: '#compulsoryStopStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryStopDuration = null;
                vm.insuranceManage.compulsoryAutoResumeTime = null;
                vm.insuranceManage.compulsoryStopStTime = null;
                if(vm.insuranceManage.compulsoryStTime>value || vm.insuranceManage.compulsoryEnTime<value){
                    alert('请选择保险时间范围内时间！');
                    $("#compulsoryStopStartTime").val(null);
                    vm.insuranceManage.compulsoryStopStartTime = null;
                    vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', null);
                    return;
                }
                var currCompulsoryStopEnTime =  vm.insuranceManage.compulsoryStopEnTime;
                if(currCompulsoryStopEnTime != null && currCompulsoryStopEnTime != '' && currCompulsoryStopEnTime != undefined ){
                    if(currCompulsoryStopEnTime < value){
                        alert('停保开始时间应该小于结束时间！');
                        $("#compulsoryStopStartTime").val(null);
                        vm.insuranceManage.compulsoryStopStartTime = null;
                        vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', null);
                        return;
                    }else{
                        var endDate = Date.parse(currCompulsoryStopEnTime);
                        var startDate = Date.parse(value);
                        var days = (endDate - startDate)/(24*60*60*1000);
                        vm.insuranceManage.compulsoryStopDuration = days+1;
                        var newEndDate = endDate+24*60*60*1000;
                        var autoDate = new Date(newEndDate).format("yyyy-MM-dd");
                        vm.insuranceManage.compulsoryAutoResumeTime = autoDate;
                        var insuranceEnDate = Date.parse(vm.insuranceManage.compulsoryEnTime);
                        var newResumeDate = insuranceEnDate+24*60*60*1000*(days+1);
                        var resumeDate = new Date(newResumeDate).format("yyyy-MM-dd");
                        vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', resumeDate);
                    }
                }
                vm.insuranceManage.compulsoryStopStTime = value;
                vm.insuranceManage.compulsoryStopStartTime = vm.insuranceManage.compulsoryStopStTime;
                var month = date.month -1;
                compulsoryStopEndTime.config.min = date;
                compulsoryStopEndTime.config.min.month = month;
            }
        });
        //交强险结束时间
        var compulsoryStopEndTime = laydate.render({
            elem: '#compulsoryStopEndTime',
            trigger: 'click',
            //range:true,
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryStopDuration = null;
                vm.insuranceManage.compulsoryAutoResumeTime = null;
                vm.insuranceManage.compulsoryStopEnTime = null;
                var currCompulsoryStopStTime =  vm.insuranceManage.compulsoryStopStTime;
                if(currCompulsoryStopStTime != null && currCompulsoryStopStTime != '' && currCompulsoryStopStTime != undefined ){
                    if(currCompulsoryStopStTime > value){
                        alert('停保结束时间应该大于开始时间！');
                        $("#compulsoryStopEndTime").val(null);
                        vm.insuranceManage.compulsoryStopEndTime = null;
                        vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', null);
                        return;
                    }
                }else{
                    alert('请先选择停保开始时间！');
                    $("#compulsoryStopEndTime").val(null);
                    vm.insuranceManage.compulsoryStopEndTime = null;
                    vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', null);
                    return;
                }
                if(vm.insuranceManage.compulsoryStTime>value || vm.insuranceManage.compulsoryEnTime<value || vm.insuranceManage.compulsoryStopStTime>value ){
                    alert('请选择保险时间范围内日期！');
                    $("#compulsoryStopEndTime").val(null)
                    vm.insuranceManage.compulsoryStopEndTime = null;
                    vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', null);
                    return;
                }
                var startDate = Date.parse(currCompulsoryStopStTime);
                var endDate = Date.parse(value);
                var days = (endDate - startDate)/(24*60*60*1000);
                vm.insuranceManage.compulsoryStopDuration = days+1;
                console.log("相差天数：：：",days+1)
                console.log("结束时间：",endDate)
                var newEndDate = endDate+24*60*60*1000;
                var autoDate = new Date(newEndDate).format("yyyy-MM-dd");
                vm.insuranceManage.compulsoryAutoResumeTime = autoDate;
                var insuranceEnDate = Date.parse(vm.insuranceManage.compulsoryEnTime);
                var newResumeDate = insuranceEnDate+24*60*60*1000*(days+1);
                var resumeDate = new Date(newResumeDate).format("yyyy-MM-dd");
                vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', resumeDate);
                vm.insuranceManage.compulsoryStopEnTime = value;
                vm.insuranceManage.compulsoryStopEndTime = vm.insuranceManage.compulsoryStopEnTime;

                var month = date.month -1;
                compulsoryStopStartTime.config.max = date;
                compulsoryStopStartTime.config.max.month = month;
            }
        });
        //商业险开始时间
        var commercialStopStartTime = laydate.render({
            elem: '#commercialStopStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialStopDuration = null;
                vm.insuranceManage.commercialAutoResumeTime = null;
                vm.insuranceManage.commercialStopStTime = null;
                if(vm.insuranceManage.commercialStTime>value || vm.insuranceManage.commercialEnTime<value){
                    alert('请选择保险时间范围内日期！');
                    $("#commercialStopStartTime").val(null);
                    vm.insuranceManage.commercialStopStartTime = null;
                    vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', null);
                    return;
                }
                var currCommercialStopEnTime =  vm.insuranceManage.commercialStopEnTime;
                if(currCommercialStopEnTime != null && currCommercialStopEnTime != '' && currCommercialStopEnTime != undefined ){
                    if(currCommercialStopEnTime > value){
                        alert('停保开始时间应该大于结束时间！');
                        $("#commercialStopStartTime").val(null);
                        vm.insuranceManage.commercialStopStartTime = null;
                        vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', null);
                        return;
                    }else {
                        var endDate = Date.parse(currCommercialStopEnTime);
                        var startDate = Date.parse(value);
                        var days = (endDate - startDate)/(24*60*60*1000);
                        vm.insuranceManage.commercialStopDuration = days+1;
                        var newEndDate = endDate+24*60*60*1000;
                        var autoDate = new Date(newEndDate).format("yyyy-MM-dd");
                        vm.insuranceManage.commercialAutoResumeTime = autoDate;
                        var insuranceEnDate = Date.parse(vm.insuranceManage.commercialEnTime);
                        var newResumeDate = insuranceEnDate+24*60*60*1000*(days+1);
                        var resumeDate = new Date(newResumeDate).format("yyyy-MM-dd");
                        vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', resumeDate);
                    }
                }
                vm.insuranceManage.commercialStopStTime = value;
                vm.insuranceManage.commercialStopStartTime = vm.insuranceManage.commercialStopStTime;
                var month = date.month -1;
                commercialStopEndTime.config.min = date;
                commercialStopEndTime.config.min.month = month;
            }
        });

        //商业险结束时间
        var commercialStopEndTime = laydate.render({
            elem: '#commercialStopEndTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialStopDuration = null;
                vm.insuranceManage.commercialAutoResumeTime = null;
                vm.insuranceManage.commercialStopEnTime = null;
                var currCommercialStopStTime =  vm.insuranceManage.commercialStopStTime;
                if(currCommercialStopStTime != null && currCommercialStopStTime != '' && currCommercialStopStTime != undefined ){
                    if(currCommercialStopStTime > value){
                        alert('停保结束时间应该大于开始时间！');
                        $("#commercialStopEndTime").val(null);
                        vm.insuranceManage.commercialStopEndTime = null;
                        vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', null);
                        return;
                    }
                }else{
                    alert('请先选择停保开始时间！');
                    $("#commercialStopEndTime").val(null);
                    vm.insuranceManage.commercialStopEndTime = null;
                    vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', null);
                    return;
                }
                if(vm.insuranceManage.commercialStTime>value  || vm.insuranceManage.commercialEnTime<value || vm.insuranceManage.commercialStopStTime>value ){
                    alert('请选择保险时间范围内日期！');
                    $("#commercialStopEndTime").val(null);
                    vm.insuranceManage.commercialStopEndTime = null;
                    vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', null);
                    return;
                }
                var startDate = Date.parse(currCommercialStopStTime);
                var endDate = Date.parse(value);
                var days = (endDate - startDate)/(24*60*60*1000);
                vm.insuranceManage.commercialStopDuration = days+1;
                var newEndDate = endDate+24*60*60*1000;
                var autoDate = new Date(newEndDate).format("yyyy-MM-dd");
                vm.insuranceManage.commercialAutoResumeTime = autoDate;
                var insuranceEnDate = Date.parse(vm.insuranceManage.commercialEnTime);
                var newResumeDate = insuranceEnDate+24*60*60*1000*(days+1);
                var resumeDate = new Date(newResumeDate).format("yyyy-MM-dd");
                vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', resumeDate);
                vm.insuranceManage.commercialStopEnTime = value;
                vm.insuranceManage.commercialStopEndTime = vm.insuranceManage.commercialStopEnTime;
                var month = date.month -1;
                commercialStopStartTime.config.max = date;
                commercialStopStartTime.config.max.month = month;

            }
        });
    });


    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
    layui.table.on('tool(insuranceTypeGrid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.insuranceTypeUpdate(data);
        } else if (layEvent === 'del') {
            vm.insuranceTypeDel(data);
        }
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        //交强险保险公司下拉列表数据源
        compulsoryInsuranceList:[],
        //商业险保险公司下拉列表数据源
        commercialInsuranceList:[],
        // 交强险付款对象数据源
        compulsoryInsurancePay:[],
        // 商业险付款对象数据源
        commercialInsurancePay:[],
        //险种集合
        insuranceTypeList:[],
        //保险单数据源
        insuranceManage:{
        },
        //商业险种列表数据源
        commercialInsuranceTableList:[],
        jqxFileList: [],
        syxxFileList: [],
        fileLstId: '0',
        insuranceTypeGridMS:false,
        jqDivShow:false,
        syDivShow:false

    },
    created: function(){
        //初始化加载保险公司下拉列表
        $.ajax({
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
        });
        //获取险种类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insuranceType",
            contentType: "application/json",
            data:null,
            success: function(r){
                //险种集合
                vm.insuranceTypeList= r.dict;
            }
        });

        // 初始化加载商业险种数据
        var policyApplyNo = window.localStorage.getItem("policyApplyNo");
        $.ajax({
            type: "POST",
            url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceList",
            dataType:"JSON",
            data:{"policyApplyNo":policyApplyNo},
            success: function(r){
                //商业险
                vm.commercialInsuranceTableList= r.commercialInsuranceTableList;
            }
        });

    },
    computed:{
        brandNameAndModelName:{
            get:function() {
                if(this.insuranceManage.brandName!=null  && this.insuranceManage.modelName !=null){
                    return this.insuranceManage.brandName+"/"+this.insuranceManage.modelName;
                }else if(this.insuranceManage.brandName!=null  && this.insuranceManage.modelName ==null){
                    return this.insuranceManage.brandName
                }else if(this.insuranceManage.brandName==null   && this.insuranceManage.modelName !=null){
                    return this.insuranceManage.modelName
                }else {
                    return "--";
                }
            }

        }
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        delJqxFile: function (id) {
            for(var i = 0 ;i<vm.jqxFileList.length;i++) {
                if(vm.jqxFileList[i].id === id) {
                    vm.jqxFileList.splice(i,1);
                    i= i-1;
                }
            }
        },
        delSyxFile: function (id) {
            for(var i = 0 ;i<vm.syxxFileList.length;i++) {
                if(vm.syxxFileList[i].id === id) {
                    vm.syxxFileList.splice(i,1);
                    i= i-1;
                }
            }
        },

        getPayObjectData(){
            // 获取交强险、商业险付款对象
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
                contentType: "application/json",
                data:null,
                success: function(r){

                    vm.compulsoryInsurancePay= r.dict;
                    vm.commercialInsurancePay= r.dict;
                }
            });
        },

        //保存修改方法
        saveOrUpdate: function (event) {
            if(vm.insuranceManage.compulsoryStopStartTime == null &&
                vm.insuranceManage.compulsoryStopEndTime == null &&
                vm.insuranceManage.commercialStopStartTime == null &&
                vm.insuranceManage.commercialStopEndTime == null) {
                alert('请选择停保时间！');
                return false;
            }

            if(vm.insuranceManage.compulsoryStopStartTime != null && vm.insuranceManage.compulsoryStopStartTime != ''){
                if(vm.insuranceManage.compulsoryStopEndTime == null || vm.insuranceManage.compulsoryStopEndTime == ''){
                    alert('请填写交强险停保结束时间！');
                    return false;
                }
            }
            if(vm.insuranceManage.compulsoryStopEndTime != null && vm.insuranceManage.compulsoryStopEndTime != ''){
                if(vm.insuranceManage.compulsoryStopStartTime == null || vm.insuranceManage.compulsoryStopStartTime == ''){
                    alert('请填写交强险停保开始时间！');
                    return false;
                }
            }

            if(vm.insuranceManage.commercialStopStartTime != null && vm.insuranceManage.commercialStopStartTime != ''){
                if(vm.insuranceManage.commercialStopEndTime == null || vm.insuranceManage.commercialStopEndTime == ''){
                    alert('请填写商业险停保结束时间！');
                    return false;
                }
            }
            if(vm.insuranceManage.commercialStopEndTime != null && vm.insuranceManage.commercialStopEndTime != ''){
                if(vm.insuranceManage.commercialStopStartTime == null || vm.insuranceManage.commercialStopStartTime == ''){
                    alert('请填写商业险停保开始时间！');
                    return false;
                }
            }

            //商业险种记录
            vm.insuranceManage.jqxFileList = vm.jqxFileList;
            vm.insuranceManage.syxxFileList = vm.syxxFileList;
            var url = "maintenance/insurancemanage/suspension";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.insuranceManage),
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
        //通过险种编号获取险种名称
        getInsuranceTypeName:function(insuranceTypeNo){
            $.ajax({
                async:false,
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode",
                dataType:"JSON",
                data: {"code":insuranceTypeNo,"type":"insuranceType"},
                success: function(r){
                    if(r.sysDictEntity!=null){
                        var commercialInsuranceName= r.sysDictEntity.value;
                        window.localStorage.setItem("commercialInsuranceName",commercialInsuranceName);
                    }
                }
            });
        },
        //商业险种添加
        addTo:function(){
            var vinNo = vm.insuranceManage.vinNo;
            var carNo = vm.insuranceManage.carNo;
            var carId = $("#carId").val();
            if((carNo==null || carNo=="") && (vinNo==null || vinNo=="")){
                alert("请先选择车牌号或者车架号");
                return;
            }

            var insuranceTypeNo=vm.insuranceManage.insuranceTypeNo;
            if(insuranceTypeNo==null ||insuranceTypeNo==""){
                alert("请先选择商业险种类型");
                return;
            }else {
                //通过险种编号查询险种名称
                vm.getInsuranceTypeName(insuranceTypeNo);
                window.localStorage.setItem("vinNo",vinNo);
                window.localStorage.setItem("carNo",carNo);
                window.localStorage.setItem("carId",carId);
                window.localStorage.setItem("insuranceTypeNo",insuranceTypeNo);

                var index = layer.open({
                    title: "商业险种编辑",
                    type: 2,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/maintenance/insurancetypeadd.html",
                    end: function(){
                        layer.close(index);
                    }
                });
            }
        },
        //商业险种修改方法
        insuranceTypeUpdate:function(data){
            window.localStorage.setItem("commercialInsurance",data);
            var index = layer.open({
                title: "商业险种编辑",
                type: 2,
                area: ['80%', '60%'],
                content: tabBaseURL + "modules/maintenance/insurancetypeadd.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(data);
                },
                end: function(){
                    layer.close(index);
                }
            });

        },
        //商业险种删除方法
        insuranceTypeDel:function(data){
            confirm('确定要删除选中的记录？', function(){
                var randomData=data.randomData;
                var parentData=vm.commercialInsuranceTableList;
                for (var i = parentData.length - 1; i >= 0; i--) {
                    if (parentData[i].randomData==randomData) {
                        parentData.splice(i, 1);
                    }
                }
                alert('删除成功', function(index){
                    vm.reloadCommercialInsurance(parentData);
                });
            });
        },
        //加载表格数据--子页面调用
        reloadCommercialInsurance: function (list) {

            // $("#insuranceTypeGrid").css('display','none');
            list = eval(list);
            if(list.length>0){
                var array=new Array()
                for (var i = 0; i <list.length ; i++) {
                    array.push(parseFloat(list[i].insuranceExpenses));
                }
                var commercialAmount = sum(array);
                vm.insuranceManage = Object.assign({}, vm.insuranceManage, {commercialTotalAmount:commercialAmount });
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/insurancemanage/getInsuranceAmountStatus/",
                    contentType: "application/json",
                    data: null,
                    success: function(r){
                        if(r.code === 0){
                            vm.insuranceManage.insuranceAmountValue = r.config.paramValue;
                            if(vm.insuranceManage.insuranceAmountValue == '2'){
                                vm.insuranceManage = Object.assign({}, vm.insuranceManage, {commercialAmount:commercialAmount });
                            }
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            } else {
                var commercialAmount = 0;
                vm.insuranceManage.commercialTotalAmount = commercialAmount;
                vm.insuranceManage.commercialAmount = commercialAmount;
            }

            if(list==null||list.length==0){
                layui.table.reload('insuranceTypeGrid', {
                    data: vm.commercialInsuranceTableList
                });
            }else{
                vm.commercialInsuranceTableList = list;
                layui.table.reload('insuranceTypeGrid', {
                    data: vm.commercialInsuranceTableList
                });
            }
            vm.insuranceTypeGridMS = true;
        },
        //表格数据重新加载方法
        reloadSourceTable: function(policyApplyNo){
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceList",
                dataType:"JSON",
                data:{"policyApplyNo":policyApplyNo},
                success: function(r){
                    //商业险种
                    vm.commercialInsuranceTableList = r.commercialInsuranceTableList;
                    for(var i=0;i< vm.commercialInsuranceTableList.length;i++){
                        var randomData = Math.random().toString(36).slice(2);
                        vm.commercialInsuranceTableList[i].randomData = randomData;
                    }
                    layui.table.reload('insuranceTypeGrid', {
                        data: vm.commercialInsuranceTableList
                    });
                    vm.insuranceTypeGridMS = true;
                }
            });
        },

        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.tCarBasic,"deptId",treeNode.deptId);
            Vue.set(vm.tCarBasic,"deptName",treeNode.name);
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        cancel: function(){
            parent.layer.closeAll();
        },

        detail: function (jqxId,syxId) {
            var type = "insuranceXb";// 续保标识
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/info",
                data: {
                    jqxId:isEmptyReturnNull(jqxId),
                    syxId:isEmptyReturnNull(syxId),
                    type:type
                },
                success: function(r){
                    if(r.code === 0){
                        vm.insuranceManage = r.insuranceManage;
                        var currDate = new Date();
                        if(vm.insuranceManage.commercialEndTime != null){
                            var commercialEndTime = Date.parse(vm.insuranceManage.commercialEndTime);
                            if(r.insuranceManage.commercialSuspension == 0 && commercialEndTime>currDate){
                                vm.syDivShow = true;
                            }
                        }
                        if(vm.insuranceManage.compulsoryEndTime != null){
                            var compulsoryEndTime = Date.parse(vm.insuranceManage.compulsoryEndTime);
                            if(r.insuranceManage.compulsorySuspension == 0 && compulsoryEndTime>currDate ){
                                vm.jqDivShow = true;
                            }
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        // 获取商业险费用是否支持手动输入系统参数
        getInsuranceAmountStatus: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getInsuranceAmountStatus/",
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.insuranceManage.insuranceAmountValue = r.config.paramValue;
                        if(vm.insuranceManage.insuranceAmountValue == '1'){
                            $("#commercialAmount").removeAttr("readonly");
                        } else{
                            $("#commercialAmount").attr("readonly","readonly");
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

    }
})

//求和计算
function sum(arr) {
    var s = 0;
    for (var i=arr.length-1; i>=0; i--) {
        if(isValueNaN(arr[i])){
            arr[i] = 0;
        }
        s += arr[i];
    }
    return s.toFixed(2);
}

function isValueNaN(value) {
    return typeof value === 'number' && isNaN(value);
}
