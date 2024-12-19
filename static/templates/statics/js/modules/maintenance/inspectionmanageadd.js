$(function () {
    /***
     * 页面初始化根据车辆id赋值
     */
    if(parent.layui.larryElem != undefined){
        var params = parent.layui.larryElem.boxParams;
        if(params){
            vm.getCarBasicInforByCarNo(params?.carId);
        }
    }

    gridTable1 = layui.table.render({
        id: "compulsoryInsurance",
        elem: '#compulsoryInsurance',
        minWidth: 150,
        data: vm.stageDatalist,
        cols: [[
            {field: 'feeName', title: '账单类型',width:"240", align: "center"},
            {
                field: 'payMoney',width:"220", title: '应付金额/元', align: "center"
            },
            {
                field: 'payTime',width:"200", title: '应付日期', align: "center"
            },
            {
                field: 'isGenerateBill',width:"200", title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
                }
            },
            {
                field: 'remark', width:"200",title: '备注', align: "center"
            },
            {
                title: '操作',width:"470", align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }
            },
        ]],
        page: true,
        loading: false,
        limit: 5,
        limits: [5, 10, 20]
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
        // let a = $.trim($('#contractSwitch11').is(":checked"));
        let a = $.trim($('#' + obj.elem.id).is(":checked"));
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
    });
    initTableEdit();

    // 获取交强险、商业险付款对象
    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
        contentType: "application/json",
        data:null,
        success: function(r){
            vm.inspectionPayIds= r.dict;
        }
    })

    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        var upload = layui.upload;
        form.render();
    });

    // 年检附件上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#addDeliveryFile',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'inspection'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar',
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
                    deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                    var fileTmp = {
                        id: deliveryFileIdTmp,
                        nameDesc: '年检附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.deliveryFileLst.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.deliveryFileLst.forEach(function (value) {
                        if (value.id === deliveryFileIdTmp) value.url = res.data[0];
                    });
                    vm.deliveryFileLstId = 'deliveryFileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delDeliveryFile(deliveryFileIdTmp);
                }
                deliveryFileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(fileIdTmp);
                deliveryFileIdTmp = null;
            }
        });
    });


    layui.use('laydate', function(){
        var laydate = layui.laydate;

        // 本次年检时间
        laydate.render({
            elem: '#thisTimeInspectionTime',
            type: 'date',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.inspectionManage.thisTimeInspectionTime = value
                vm.inspectionManage.inspectionYear = date.year;
                $("#inspectionYear").val(date.year);
            }
        });
        // 下次年检时间
        laydate.render({
            elem: '#nextInspectionTime',
            type: 'date',
            trigger: 'click',
            done: function (value) {
                vm.inspectionManage.nextInspectionTime = value;
            }
        });

    });


    layui.form.on('submit(submitEditData)', function(){
        vm.saveOrUpdate();
        return false;
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        hetong:false,
        inspectionManage:{},
        deliveryFileLst: [],
        carInforData:{},
        deliveryFileLstId: '0',
        carNoAndVinNoDiv:true,
        carNoDiv:true,
        edithidden: true,
        inspectionPayIds:[],
        carNoDisabled:false,
        stageDatalist: [],
    },
    created: function(){
    },
    computed:{
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        feeChange(val){
            debounce((v)=>{
                this.refreshTable()
            }, 500)(val)
        },
        //保养费用期数变化刷新
        refreshTable(){
            let num = Number(this.inspectionManage.inspectNumber);

            if(num && num>=1){
                let allmoney = this.inspectionManage.inspectionAmount;
                let someMoney = allmoney ? Math.floor((allmoney / num) * 100) / 100 : null
                console.log('aaa222', vm.stageDatalist)
                if(vm.stageDatalist.length === num){

                    vm.stageDatalist.forEach((item,i)=>{
                        item.payMoney = someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null
                    })
                    console.log('aaa111', vm.stageDatalist)
                }else {
                    this.stageDatalist.splice(0);
                    // if (allmoney) {
                    for (let i = 0; i < num; i++) {
                        let obj = {
                            index: i + 1,
                            feeName: '年检费用',
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
            }
        },
        // 保养费用期数变化
        changeStage(e) {
            this.refreshTable();
            // console.log(vm.stageDatalist);
            // if(this.inspectionManage.inspectionAmount==0||this.inspectionManage.inspectionAmount==undefined){
            //     return
            // }
            // this.stageDatalist.splice(0);
            // let num
            // console.log(typeof e)
            // if (typeof e === 'string') {
            //     num = Number(e)
            // } else {
            //     num = e.target.value
            // }
            // let allmoney = this.inspectionManage.inspectionAmount
            // let someMoney = ''
            // if (allmoney) {
            //     someMoney = Math.floor((allmoney / num) * 100) / 100
            //     for (let i = 0; i < num; i++) {
            //         let obj = {
            //             index: i + 1,
            //             feeName: '年检费用',
            //             payMoney: i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2),
            //             payTime: '',
            //             isGenerateBill: 0,
            //             type: 0,
            //             remark: "",
            //         }
            //         vm.stageDatalist.push(obj)
            //         layui.table.reload('compulsoryInsurance', {
            //             data: vm.stageDatalist
            //         });
            //
            //         console.log('---------obj-->', obj)
            //     }
            //
            //
            // } else {
            //
            // }
        },
        retractChange:function(data){
            if(data == 1){
                this.hetong = false
            }
        },
        expandChange:function(data){
            console.log(1)
            if(data == 1){
                this.$nextTick(()=>{
                    this.hetong = true
                })

            }
        },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        //选择车牌号
        selectCarNo:function(){
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function(){
                    var carId=vm.carInforData.carId;
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
                    var vinNo=vm.carInforData.vinNo;
                    if(vinNo!=null && vinNo!=''&& vinNo!=undefined){
                        vm.getCarBasicInforByVinNo(vinNo);
                    }
                }
            });
            layer.full(index);

        },
        //保存修改方法
        saveOrUpdate: function (event) {
            var isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
            if (null != vm.inspectionManage.inspectionAmount && vm.inspectionManage.inspectionAmount != undefined && vm.inspectionManage.inspectionAmount != '') {
                if (!isNum.test(vm.inspectionManage.inspectionAmount)) {
                    layer.msg('填写金额错误', {icon: 5});
                    return;
                }
            }
            console.log(vm.stageDatalist)
            if(this.inspectionManage.inspectionAmount==0||this.inspectionManage.inspectionAmount==undefined){
                vm.stageDatalist.splice(0);
            }


            if (vm.stageDatalist && vm.stageDatalist.length > 0) {
                let compulsoryAll = vm.stageDatalist.reduce((pre, item) => {
                    return pre += Number(item.payMoney)
                }, 0).toFixed(2);

                console.log('vm.stageDatalist==>', vm.stageDatalist)
                console.log('保养金额==>', Number(compulsoryAll), Number(vm.inspectionManage.inspectionAmount))
                if (Number(compulsoryAll) != Number(vm.inspectionManage.inspectionAmount)) {
                    alert('年检费用填入的应付金额总额需等于总费用！');
                    return false
                }


                for (const dataliatElement of vm.stageDatalist) {
                    if (dataliatElement.isGenerateBill == 1 && (dataliatElement.payTime == undefined || dataliatElement.payTime == null || dataliatElement.payTime == '')) {
                        alert('请选择应付日期');
                        return false;
                    }
                }
            }

            vm.inspectionManage.deliveryFileLst = vm.deliveryFileLst;
            var url = vm.inspectionManage.id == null ? "maintenance/inspectionmanage/save" : "maintenance/inspectionmanage/update";
            vm.inspectionManage.flag = vm.flag;
            vm.inspectionManage.list=vm.stageDatalist;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.inspectionManage),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            /*parent.layer.closeAll();
                            parent.vm.reload();*/
                            //关闭操作
                            closeCurrent();
                        });
                    } else {
                        alert(r.msg);
                    }
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
            closeCurrent();
        },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo:function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/" + carId,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    console.log(r.baseInfor);
                    vm.vehicleInfo = r.baseInfor;
                    vm.inspectionManage.vehicleOrderNo = r.baseInfor.carOrderNo;
                    vm.inspectionManage.carId = r.baseInfor.carId;
                    addVehicleInfo(vm.vehicleInfo);
                    layui.form.render("select");
                }
            });
        },
        //根据车架号查询基本信息
        getCarBasicInforByVinNo:function (vinNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByVinNo/" + vinNo,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    if (r.baseInfor != null) {
                        console.log(r.baseInfor);
                        vm.vehicleInfo = r.baseInfor;
                        vm.inspectionManage.vehicleOrderNo = r.baseInfor.carOrderNo;
                        vm.inspectionManage.carId = r.baseInfor.carId;
                        addVehicleInfo(vm.vehicleInfo);
                        layui.form.render("select");
                    } else {
                        alert("该车架号暂无车辆信息!");
                        return;
                    }
                }
            });
        },

    }
})

function initTableEdit(){
    initTableInputEdit('compulsoryInsurance', 'payMoney', '请输入应付金额', 'num', vm.stageDatalist, 999999.99, 10, 'callbackStageDatalist');
    initTableInputEdit('compulsoryInsurance', 'remark', '请输入备注', 'txt', vm.stageDatalist, '', 50, 'callbackStageDatalist');
    initTableDateEdit('compulsoryInsurance', 'payTime', 'date', vm.stageDatalist);
}
/**
 * 自动识别车辆信息
 * @param item
 */
function addVehicleInfo(item) {
    vm.$set(vm.inspectionManage, 'carNo', item.carNo);
    vm.$set(vm.inspectionManage, 'vinNo', item.vinNo);
    //设置车辆品牌/车型
    vm.$set(vm.inspectionManage, 'brandAndCarModel', item.brandName + "/" + item.modelName);
    vm.$set(vm.inspectionManage, 'customerId', item.customerId);
    //客户名称
    vm.$set(vm.inspectionManage, 'customerName', item.customerName);
    //车辆状态
    vm.$set(vm.inspectionManage, 'vehicleStatusShow', item.carStatusStr);
    vm.inspectionManage.vehicleStatus = item.carStatus;
    //车辆订单号
    vm.$set(vm.inspectionManage, 'vehicleOrderNo', item.carOrderNo);
    //车辆所属公司
    //  vm.$set(vm.inspectionManage, 'company', item.belongCompanyName);
    vm.$set(vm.inspectionManage, 'company', item.deptName);
    //租赁开始时间
    vm.$set(vm.inspectionManage, 'rentStartTime', item.timeStartRent);
    //租赁结束时间
    vm.$set(vm.inspectionManage, 'rentEndTime', item.timeFinishRent);
    //车辆所在城市
    vm.$set(vm.inspectionManage, 'city', item.cityName);
    //仓库id
    vm.$set(vm.inspectionManage, 'depotId', item.carDepotId);
    //仓库名称
    vm.$set(vm.inspectionManage, 'depotName', item.carDepotName);
    //车辆用途
    vm.$set(vm.inspectionManage, 'carPurposeShow', item.rentTypeStr);
    //车辆所有人
    vm.$set(vm.inspectionManage, 'carOwner', item.carOwner);
    vm.inspectionManage.carPurpose = item.rentType;
    vm.inspectionManage.carId = item.carId;
}
function callbackStageDatalist(event, _val) {
    var class_name = 'edit-' + event;
    var edit = $('.' + class_name);
    var _index = edit.parent().parent().attr('data-index');
    var table = edit.parent().parent().parent().parent().parent().parent().parent();
    var limit = table.find('span[class="layui-laypage-limits"]').find('option:selected').val();
    var page = table.find('em[class="layui-laypage-em"]').next().html();
    var index = (Number(page) - 1) * Number(limit) + Number(_index);
    if(!index){
        index = _index
    }
    if (vm.stageDatalist.length > index) {
        vm.stageDatalist[index][event] = _val;
    }
}
