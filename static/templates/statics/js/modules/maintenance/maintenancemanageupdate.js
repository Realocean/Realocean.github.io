$(function () {
    vm.detail(window.localStorage.getItem("maintenanceId"));
    var maintenanceNumber = window.localStorage.getItem("maintenanceNumber");
    vm.reloadSourceTable(maintenanceNumber);

    gridTable = layui.table.render({
        id: "insuranceTypeGrid",
        elem: '#insuranceTypeGrid',
        minWidth: 150,
        cols: [[
            {title:'操作',templet:'#barTpl',fixed:"left",align:"center"},
            {field:'maintenanceItemName',title: '保养项目'},
            {field:'maintenanceItemFee', title: '保养金额/元'}
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
           /* commercialNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '服务站名称不能为空';
                }
            },*/
            currentMileVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(value==''){
                    return '';
                } else {
                    if(!reg.test(value)){
                        return '当前公里数输入格式有误，请确认!';
                    }
                }
            },
            nextMileVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(value==''){
                    return '';
                } else {
                    if(!reg.test(value)){
                        return '下次保养公里数输入格式有误，请确认!';
                    }
                }
            },

        });

        form.on('select(selectMaintenanceTypeNo)', function (data) {
            vm.maintenanceManage.maintenanceType = data.value;
        });

        form.render();
    });

    // 车辆保养附件上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#clbyImages',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'clby_images'},
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
                    fileIdTmp = vm.byFileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        nameDesc: '保养附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.byFileList.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.byFileList.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delbyFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delbyFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });

    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //下次保养时间
        laydate.render({
            elem: '#nextDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.maintenanceManage.nextMaintenanceTime=value;
            }
        });

        //保养时间
        laydate.render({
            elem: '#maintenanceDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.maintenanceManage.maintenanceTime=value;
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
        //保养项目集合
        maintenanceTypeList:[],
        //保养数据源
        maintenanceManage:{},
        //保养项目列表数据源
        maintenanceProjectList:[],
        byFileList: [],
        carInforData:{},
        fileLstId: '0',

    },
    created: function(){
        //获取保养类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"maintenanceType",
            contentType: "application/json",
            data:null,
            success: function(r){
                vm.maintenanceTypeList= r.dict;
            }
        });

        var maintenanceNumber = window.localStorage.getItem("maintenanceNumber");
        $.ajax({
            type: "POST",
            url: baseURL + "maintenance/maintenancemanage/getMaintenanceRecordList",
            dataType:"JSON",
            data:{"maintenanceNumber":maintenanceNumber},
            success: function(r){
                //保养项目
                vm.maintenanceProjectList= r.recordEntityList;
            }
        });
    },
    computed:{

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        delbyFile: function (id) {
            for(var i = 0 ;i<vm.byFileList.length;i++) {
                if(vm.byFileList[i].id === id) {
                    vm.byFileList.splice(i,1);
                    i= i-1;
                }
            }
        },

        //保存修改方法
        saveOrUpdate: function (event) {
            var stime = new Date(vm.maintenanceManage.maintenanceTime);
            var etime = new Date(vm.maintenanceManage.nextMaintenanceTime);
            if(stime != null && etime != null){
                if(stime.getTime() > etime.getTime()){
                    alert("本次保养时间不能大于下次保养时间");
                    return false;

                }
            }
            var currentmile = vm.maintenanceManage.currentMile;
            var nextmile = vm.maintenanceManage.nextMile;
            if(currentmile != null && nextmile != null){
                if(eval(currentmile) > eval(nextmile)){
                    alert("本次保养公里数不能大于下次保养公里数");
                    return false;
                }

            }
            //保养项目记录
            vm.maintenanceManage.maintenanceProjectList = vm.maintenanceProjectList;
            // 图片
            vm.maintenanceManage.byFileList = vm.byFileList;
            var url = "maintenance/maintenancemanage/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.maintenanceManage),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                            parent.layer.close(index); //再执行关闭
                            parent.vm.reloadBySourceTable(vm.maintenanceManage.carPlateNo);
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        //通过保养编号获取保养项目名称
        getInsuranceTypeName:function(insuranceTypeNo){
            $.ajax({
                async:false,
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode",
                dataType:"JSON",
                data: {"code":insuranceTypeNo,"type":"maintenanceType"},
                success: function(r){
                    if(r.sysDictEntity!=null){
                        var maintenanceItemName= r.sysDictEntity.value;
                        window.localStorage.setItem("maintenanceItemName",maintenanceItemName);
                    }
                }
            });
        },
        //保险项目添加
        addTo:function(){
            var vinNo = $("#vinNo").val();
            var carNo = $("#carPlateNo").val();
            var carId = $("#carId").val();
            if((carNo==null || carNo=="") && (vinNo==null || vinNo=="")){
                alert("请先选择车牌号或者车架号");
                return;
            }

            var insuranceTypeNo = vm.maintenanceManage.maintenanceType;
            if(insuranceTypeNo == null ||insuranceTypeNo == ""){
                alert("请先选择保养类型");
                return;
            }else {
                //通过保养编号查询保养名称
                vm.getInsuranceTypeName(insuranceTypeNo);
                window.localStorage.setItem("vinNo",vinNo);
                window.localStorage.setItem("carNo",carNo);
                window.localStorage.setItem("carId",carId);
                window.localStorage.setItem("insuranceTypeNo",insuranceTypeNo);

                var index = layer.open({
                    title: "保养项目编辑",
                    type: 2,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/maintenance/maintenanceType.html",
                    end: function(){
                        layer.close(index);
                    }
                });
            }
        },
        //保养项目修改方法
        insuranceTypeUpdate:function(data){
            window.localStorage.setItem("commercialInsurance",data);
            var index = layer.open({
                title: "保养项目编辑",
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
        //保养项目删除方法
        insuranceTypeDel:function(data){
            confirm('确定要删除选中的记录？', function(){
                var randomData=data.randomData;
                var parentData=vm.maintenanceProjectList;
                for (var i = parentData.length - 1; i >= 0; i--) {
                    if (parentData[i].randomData==randomData) {
                        parentData.splice(i, 1);
                    }
                }
                alert('删除成功', function(index){
                    vm.reloadCommercialInsurance();
                });
            });
        },
        //加载表格数据--子页面调用
        reloadCommercialInsurance: function () {
            var list= vm.maintenanceProjectList;
            if(list.length>0){
                var array=new Array()
                for (var i = 0; i <list.length ; i++) {
                    array.push(parseFloat(list[i].maintenanceItemFee));
                }
                var maintenanceFee = sum(array);
                vm.maintenanceManage = Object.assign({}, vm.maintenanceManage, {maintenanceFee:maintenanceFee });
            } else{
                var maintenanceFee = 0;
                vm.maintenanceManage = Object.assign({}, vm.maintenanceManage, {maintenanceFee:maintenanceFee });
            }
            //重新加载表格
            layui.table.reload('insuranceTypeGrid', {
                data: vm.maintenanceProjectList
            });
        },
        //表格数据重新加载方法
        reloadSourceTable: function(maintenanceNumber){
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/maintenancemanage/getMaintenanceRecordList",
                dataType:"JSON",
                data:{"maintenanceNumber":maintenanceNumber},
                success: function(r){
                    vm.maintenanceProjectList = r.recordEntityList;
                    for(var i=0;i< vm.maintenanceProjectList.length;i++){
                        var randomData = Math.random().toString(36).slice(2);
                        vm.maintenanceProjectList[i].randomData = randomData;
                    }
                    console.log(vm.maintenanceProjectList)
                    layui.table.reload('insuranceTypeGrid', {
                        data: vm.maintenanceProjectList
                    });
                }
            });
        },
        cancel: function(){
            parent.layer.closeAll();
        },

        detail: function (maintenanceId) {
            var type = "maintenanceEdit";//保养编辑标识
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/maintenancemanage/info/"+maintenanceId+"/"+type,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.maintenanceManage = r.maintenanceManage;
                        vm.byFileList = vm.maintenanceManage.byFileList;
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
