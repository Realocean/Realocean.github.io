$(function () {
    vm.detail(window.localStorage.getItem("maintenanceId"));
    var maintenanceNumber = window.localStorage.getItem("maintenanceNumber");
    vm.reloadSourceTable(maintenanceNumber);
    vm.reloadStageSourceTable(maintenanceNumber);

    gridTable = layui.table.render({
        id: "insuranceTypeGrid",
        elem: '#insuranceTypeGrid',
        minWidth: 150,
        cols: [[
            {title:'操作',templet:'#barTpl',fixed:"left",align:"center"},
            {field:'maintenanceItemName', title: '保养项目'},
            {field:'maintenanceItemFee', title: '保养金额/元'}
        ]],
        page: false,limit: 500,
        loading: false,
        done: function(res, curr, count){
            $('div[lay-id="insuranceTypeGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
        }
    });

    // 保养费用表单
    gridTable1 = layui.table.render({
        id: "compulsoryInsurance",
        elem: '#compulsoryInsurance',
        minWidth: 150,
        data: vm.stageDatalist,
        cols: [[
            { field: 'feeName', title: '账单类型', align: "center" },
            {
                field: 'payMoney', title: '应付金额/元', align: "center"
            },
            {
                field: 'payTime', title: '应付日期', align: "center"
            },
/*            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
                }
            },*/
            {
                field: 'isGenerateBill', title: '生成应付账单', align: "center", templet: function (d) {
                    // sid="${d.id}" 去掉了
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
                }
            },
            {
                field: 'remark', title: '备注', align: "center"
            },
            {
                title: '操作', align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        // limits: [5,10,20],
        success: function (res) {

        }
    });

    layui.table.on('tool(test1)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'del') {
            vm.stageDatalist.forEach(function (value) {
                if (value.index === data.index) {
                    value.isGenerateBill = 0
                    value.payTime = ''
                    value.remark = ''
                }
            });
            layui.table.reload('compulsoryInsurance', {
                data: vm.stageDatalist
            });
            initTableEdit();
        }
    });

    layui.form.on('switch(switchTest11)', function (obj) {
        let a = $.trim($('#'+obj.elem.id).is(":checked"));
        let data2 = obj.elem.attributes.onlyname.value
        if (a == 'true') {
            let list = vm.stageDatalist
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 1
                }
            })
        } else {
            let list = vm.stageDatalist
            list.map((res, index) => {
                if (res.index == data2) {
                    list[index].isGenerateBill = 0
                }
            })
        }

        console.log('vm.stageDatalist==变化完>', vm.stageDatalist)
    });


    initTableEdit();

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

        // form.on('select(selectMaintenanceTypeNo)', function (data) {
        //     vm.maintenanceManage.maintenanceType = data.value;
        // });
        form.on('select(inspectionPayId)', function (data) {
            vm.maintenanceManage.inspectionPayId = data.value;
        })

        form.render();
    });

    // 车辆保养附件上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#clbyImages',
            url: baseURL + 'file/uploadInsuranceFile',
            data: {'path': 'clby_images'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            done: function (res) {
                if (res.code != '0') {
                    layer.msg('上传失败', {icon: 5});
                    vm.delbyFile(fileIdTmp);
                    fileIdTmp = null;
                    return false;
                }
                res.data.forEach(function (value) {
                    var extIndex = value.resultFilePath.lastIndexOf('.');
                    var ext = value.resultFilePath.slice(extIndex);
                    var fileNameNotext = value.fileName;
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.byFileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc: '保养附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileNameNotext,
                        nameExt: ext,
                        typeFile: fileType,
                        url: value.resultFilePath
                    };
                    vm.byFileList.push(fileTmp);
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                });
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
        stageDatalist:[],
        carInforData:{},
        fileLstId: '0',
        inspectionPayIds:[]

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
        let _this = this;
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
            contentType: "application/json",
            data:null,
            success: function(r){
                _this.inspectionPayIds= r.dict;
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
        refreshTable(){
            let num = Number(this.maintenanceManage.maintenanceAmount);

            if(num && num>=1){
                let allmoney = this.maintenanceManage.maintenanceFee;
                let someMoney = allmoney ? Math.floor((allmoney / num) * 100) / 100 : null
                console.log('aaa222', vm.stageDatalist)
                if(vm.stageDatalist.length === num){

                    vm.stageDatalist.forEach((item,i)=>{
                        item.payMoney = someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null
                    })
                    console.log('aaa111', vm.stageDatalist)
                }else {
                    this.stageDatalist = []
                    // if (allmoney) {
                    for (let i = 0; i < num; i++) {
                        let obj = {
                            index: i + 1,
                            feeName: '保养费用',
                            payMoney: someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null,
                            payTime: '',
                            isGenerateBill: 0,
                            type: 0,
                            remark: "",
                        }
                        vm.stageDatalist.push(obj)
                        // layui.table.reload('compulsoryInsurance', {
                        //     data: vm.stageDatalist
                        // });
                    }
                    // }

                }
                layui.table.reload('compulsoryInsurance', {
                    data: vm.stageDatalist
                });
                initTableEdit();
            }else{
                this.stageDatalist = []
                layui.table.reload('compulsoryInsurance', {
                    data: vm.stageDatalist
                });
                initTableEdit();
            }
        },
        // 保养费用期数变化
        changeStage(e) {
            this.refreshTable();
            console.log(typeof e)
            // this.stageDatalist.splice(0);
            // let num
            // if (typeof e === 'string') {
            //     num = Number(e)
            // } else if (typeof e === 'number') {
            //     num = Number(e)
            // } else {
            //     num = e.target.value
            // }
            // let allmoney = this.maintenanceManage.maintenanceFee
            // let someMoney = ''
            // if (allmoney) {
            //     someMoney = Math.floor((allmoney / num)*100)/100
            //     for (let i = 0; i < num; i++) {
            //         let obj = {
            //             index: i + 1,
            //             feeName: '保养费用',
            //             payMoney: i<num-1 ? someMoney : Number(allmoney - i*someMoney).toFixed(2),
            //             payTime: '',
            //             isGenerateBill: 0,
            //             type: 0,
            //             remark: "",
            //         }
            //         vm.stageDatalist.push(obj)
            //         layui.table.reload('compulsoryInsurance', {
            //             data: vm.stageDatalist
            //         });
            //     }
            //
            //
            // } else {
            //
            // }
        },

        //保存修改方法
        saveOrUpdate: function (event) {
            console.log(vm.stageDatalist)
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

            // if (vm.maintenanceManage.maintenanceFee != undefined && vm.maintenanceManage.maintenanceFee != 0) {
            //     if (vm.maintenanceManage.maintenanceAmount == undefined || vm.maintenanceManage.maintenanceAmount == 0) {
            //         alert("请填写分期数");
            //         return false;
            //     }
            // }

            if(vm.stageDatalist && vm.stageDatalist.length>0){
                let compulsoryAll = vm.stageDatalist.reduce((pre, item)=>{
                    return pre+=Number(item.payMoney)
                }, 0).toFixed(2);
                console.log('保养金额==>', Number(compulsoryAll), Number(vm.maintenanceManage.maintenanceFee))

                if(Number(compulsoryAll) != Number(vm.maintenanceManage.maintenanceFee)){
                    alert('保养费用填入的应付金额总额需等于总费用！');
                    return false
                }
                for (const dataliatElement of vm.stageDatalist) {
                    if(dataliatElement.isGenerateBill==1 && (dataliatElement.payTime==undefined||dataliatElement.payTime==null||dataliatElement.payTime=='')){
                        alert('请选择应付日期');
                        return false;
                    }
                }
            }
            //保养项目记录
            vm.maintenanceManage.maintenanceProjectList = vm.maintenanceProjectList;
            vm.maintenanceManage.list = vm.stageDatalist;
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
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        //通过保养编号获取保养项目名称
        // getInsuranceTypeName:function(insuranceTypeNo){
        //     $.ajax({
        //         async:false,
        //         type: "POST",
        //         url: baseURL + "sys/dict/getSysDictInforByTypeAndCode",
        //         dataType:"JSON",
        //         data: {"code":insuranceTypeNo,"type":"maintenanceType"},
        //         success: function(r){
        //             if(r.sysDictEntity!=null){
        //                 var maintenanceItemName= r.sysDictEntity.value;
        //                 window.localStorage.setItem("maintenanceItemName",maintenanceItemName);
        //             }
        //         }
        //     });
        // },
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
                alert("请先输入保养项目名称");
                return;
            }else {
                //通过保养编号查询保养名称
                window.localStorage.setItem("vinNo",vinNo);
                window.localStorage.setItem("carNo",carNo);
                window.localStorage.setItem("carId",carId);
                window.localStorage.setItem("insuranceTypeNo",insuranceTypeNo);
                window.localStorage.setItem("maintenanceItemName",insuranceTypeNo);

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
                content: tabBaseURL + "modules/maintenance/maintenanceType.html",
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
            this.refreshTable();
            // if (vm.maintenanceManage.maintenanceFee === 0) {
            //     vm.stageDatalist.splice(0)
            //     layui.table.reload('compulsoryInsurance', {
            //         data: vm.stageDatalist
            //     });
            // }
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
                    layui.table.reload('insuranceTypeGrid', {
                        data: vm.maintenanceProjectList
                    });
                }
            });
        },

        //保养分期表格数据重新加载方法
        reloadStageSourceTable: function(maintenanceNumber){
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/maintenancemanage/getMaintenanceStageList",
                dataType:"JSON",
                data:{"maintenanceNumber":maintenanceNumber},
                success: function(r){
                    vm.stageDatalist.splice(0);
                    r.stageDatalist.map((item, index)=>{
                        item.index = index+1
                        vm.stageDatalist.push(item)
                        return item
                    });
                    layui.table.reload('compulsoryInsurance', {
                        data: vm.stageDatalist
                    });
                    initTableEdit();
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

function initTableEdit(){
    initTableInputEdit('compulsoryInsurance','payMoney','请输入应付金额','num',vm.stageDatalist,999999.99, 10, 'callbackStageDatalist');
    initTableInputEdit('compulsoryInsurance','remark','请输入备注','txt',vm.stageDatalist,'', 50, 'callbackStageDatalist');
    initTableDateEdit('compulsoryInsurance','payTime','date',vm.stageDatalist);
}

//求和计算
function sum(arr) {

    var s = 0;
    var m;
    for (var i=arr.length-1; i>=0; i--) {
        if(isValueNaN(arr[i])){
            arr[i] = 0;
        }
        /*var num = hasDot(arr[i]);
        try {
            s += num.toString().split(".")[1].length;
        } catch (e) {
            s += 0;
        }
        m = Math.pow(10,Math.max(sq1, sq2));*/
        s += arr[i];
    }
    return s.toFixed(2);
}

function hasDot(num){
    if(!isNaN(num)){
        return ( (num + '').indexOf('.') != -1 ) ? num: num.toFixed(2);
    }
}

function addNum (num1, num2) {
    var sq1,sq2,m;
    try {
        sq1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
        sq2 = 0;
    }
    m = Math.pow(10,Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
}

function isValueNaN(value) {
    return typeof value === 'number' && isNaN(value);
}

function callbackStageDatalist(event, _val) {
    var class_name = 'edit-'+event;
    var edit = $('.'+class_name);
    var _index = edit.parent().parent().attr('data-index');
    var table = edit.parent().parent().parent().parent().parent().parent().parent();
    var limit = table.find('span[class="layui-laypage-limits"]').find('option:selected').val();
    var page = table.find('em[class="layui-laypage-em"]').next().html();
    var index = (Number(page)-1)*Number(limit)+Number(_index);
    if(!index){
        index = _index
    }
    if (vm.stageDatalist.length > index) {
        vm.stageDatalist[index][event] = _val;
    }
}
