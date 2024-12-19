$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable','upload'], function () {
        var upload = layui.upload;
        var form = layui.form;
        uploadAttachment(upload);
        form.on('submit(saveOrUpdate)', function () {
            vm.saveOrUpdate(layui);
            return false;
        });
        form.render();
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "grid",
            elem: '#grid',
            cellMinWidth: 180,
            url: baseURL + 'driver/advance/wages/queryList',
            where: JSON.parse(JSON.stringify(vm.q)),
            cols: vm.cols,
            page: true,
            loading: false,
            limits: [10, 20, 50, 100],
            limit: 10,
            parseData: function(res){
                return res;
            },
            autoColumnWidth: {
                init: true
            },
            done: function (res) {
                
            }
        });
       
        layui.form.render();
    });
    
    //监听选择状态
    layui.form.on('select(deductionStatus)', function (data) {
        if(data.value){
            vm.q.deductionStatus = data.value;
        }
    });
     //新增修改监听选择司机
     layui.form.on('select(driverId)', function (data) {
        if(data.value){
            var seleteData = vm.pageDriverList.filter(item=>item.id===data.value)

            console.log('选择的司机', seleteData)

            vm.receivables.driverId = data.value;
            vm.receivables.driverName = seleteData[0].customerName;
            vm.receivables.contactNumber = seleteData[0].contactMobile;
            vm.receivables.businessLeaderId = seleteData[0].businessLeaderId;
            vm.receivables.businessLeader = seleteData[0].businessLeaderName;
        }
    });
    
    layui.use(['form', 'laydate'], function () {
        var form = layui.form;
        laydate = layui.laydate;
        laydate.render({
            elem: '#createTime',
            format: 'yyyy-MM-dd',
            type: 'date',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                var dataRange = value.split('/');
                vm.q.startCreateTime = dataRange[0]+'00:00:00';
                vm.q.endCreateTime = dataRange[1]+' 23:59:59';
                vm.q.createTime = value
            }
        });
        form.render();
    });

    layui.use(['form', 'laydate'], function () {
        var form = layui.form;
        laydate = layui.laydate;
        laydate.render({
            elem: '#repaymentTime',
            type: 'date',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.receivables.repaymentTime = value;
            }
        });
        form.render();
    });
    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.id);
        } else if (layEvent === 'del') {
            var ids = [data.id];
            vm.del(ids);
        } else if (layEvent === 'detail') {
            vm.detail(data.id);
        }
    });

    /**
     * 批量导入
     */
    layui.upload.render({
        elem: '#batchImportReceivables',
        url: baseURL + '/financial/receivables/batchImportReceivables',
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        done: function (res) {
            if (parseInt(res.code) != 0) {
                layer.msg('文件解析失败:' + res.msg, {icon: 5});
                return false;
            }
            // todo 报错的话生成一个文件
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
        }
    });
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            // 预支编号
            advanceNo: null,
            // 司机名称
            driverName: null,
            // 联系电话
            contactMobile: null,
            // 车牌号
            carNo: null,
            // 创建时间
            createTime: null,
            startCreateTime:null,
            endCreateTime:null,
            // 选择状态
            deductionStatus:null,
            // 业务负责人
            businessLeader:null,
        },
        pageType:'add',
        deductionStatusList:{1:'全部抵扣', 2:'部分抵扣',0:'待薪资抵扣',3:'订单结算中'},
        pageDriverList:[],
        businessLeaderList:[],
        isFilter:false,
        // 弹窗
        showForm: false,
        showDetailForm:false,
        showForm2: false,
        upload:null,
        upload1:null,
        receivables: {
            id:null,
            driverName:null,
            driverId:null,
            contactMobile:null,
            advanceAmount:null,
            carNo:null,
            repaymentTime:null,
            businessLeaderId:null,
            businessLeader:null,
            appendixList:[],
            salaryDeduction:null
        },
        deliveryFileLst:[],
        deliveryFileLstId:null,
        cols:[[
            {title: '操作', width:180, minWidth:180, templet: '#barTpl', align: "center"},
            {
                field: 'advanceNo', align: "center", title: '预支编号', templet: function (d) {
                    return isEmpty(d.advanceNo);
                }
            },
            {
                field: 'driverName', align: "center", title: '司机姓名', templet: function (d) {
                    return isEmpty(d.driverName);
                }
            },
            {
                field: 'businessLeader', align: "center", title: '业务负责人', templet: function (d) {
                    return isEmpty(d.businessLeader);
                }
            },
            // {
            //     field: 'businessLeader', align: "center", title: '所属销售', templet: function (d) {
            //         return isEmpty(d.businessLeader);
            //     }
            // },
            {
                field: 'carNo', align: "center", title: '车牌号',align:"center", templet: function (d) {
                    return isEmpty(d.carNo);
                }
            },
            {
                field: 'contactMobile', align: "center", title: '联系电话', templet: function (d) {
                    return isEmpty(d.contactMobile);
                }
            },
            {
                field: 'deductionStatus', align: "center", title: '状态', templet: function (d) {
                    return transformTypeByMap(d.deductionStatus,vm.deductionStatusList);
                }
            },
            {
                field: 'advanceAmount', align: "center", title: '预支金额(元)', templet: function (d) {
                    return isEmpty(d.advanceAmount);
                }
            },
            {
                field: 'repaymentTime', align: "center", title: '应还时间', templet: function (d) {
                    return isEmpty(d.repaymentTime);
                }
            },
            {
                field: 'salaryDeduction', align: "center", title: '薪资抵扣(元)', templet: function (d) {
                    return isEmpty(d.salaryDeduction);
                }
            },
            {
                field: 'waitDeduction', align: "center", title: '待抵扣(元)', templet: function (d) {
                    return isEmpty(d.waitDeduction);
                }
            },
            {field: 'createTime',align: "center", title: '创建时间', templet: function (d) {
                return isEmpty(d.createTime);
            }},
        ]]
    },
    created: function () {
        $.getJSON(baseURL + "customer/signedDriverList", function (r) {
            if(r.code === 0){
                vm.pageDriverList = r.data
                var obj = {}
                vm.businessLeaderList = r.data.reduce(function(a, b) {
                    obj[b.businessLeaderId] ? '' : obj[b.businessLeaderId] = true && a.push(b);
                    return a;
                }, [])
            }
        });
        this.$nextTick(()=>{
            vm.upload = Upload({
                elid: 'deliveryFileLstId2',
                edit: false,
                fileLst: vm.deliveryFileLst
            });
            // vm.upload.initView();

            vm.upload1 = Upload({
                elid: 'deliveryFileLstId1',
                edit: true,
                fileLst: vm.deliveryFileLst,
                param: { 'path': 'processApprove' },
                fidedesc: '预支工资附件',
                callBack:(tag, url, addFile)=>{
                    console.log('收到回调了', tag, url, addFile)

                    if('success' == tag){
                        if(!vm.deliveryFileLst.find(item=>item.url==url)){
                            vm.deliveryFileLst.push(addFile)
                        }
                    }else if('delect' == tag){
                        vm.deliveryFileLst = vm.deliveryFileLst.filter(item=>{
                            if(item.url !== url.url){
                                return item
                            }
                        })
                    }




                    console.log('回调处理后', vm.deliveryFileLst)
                }
            });
            vm.upload1.initView();
        })
    },
    updated: function () {
        layui.form.render();
    },

    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q = {
                 // 预支编号
                advanceNo: null,
                // 司机名称
                driverName: null,
                // 联系电话
                contactMobile: null,
                // 车牌号
                carNo: null,
                // 创建时间
                createTime: null,
                startCreateTime:null,
                endCreateTime:null,
                // 选择状态
                deductionStatus:null,
                // 业务负责人
                businessLeader:null
            }
            vm.reload();
        },
        add: function () {
            // initializeData(1);
            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    // vm.upload1.clearFile()
                    vm.showForm = false;
                    vm.receivables= {
                        id:null,
                        driverName:null,
                        driverId:null,
                        contactMobile:null,
                        advanceAmount:null,
                        carNo:null,
                        repaymentTime:null,
                        businessLeaderId:null,
                        businessLeader:null,
                        appendixList:[],
                        salaryDeduction:null
                    },
                    vm.deliveryFileLst=[]
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "driver/advance/wages/info?id=" + id, function (r) {
                vm.receivables = r.data;
                vm.receivables.contactNumber = r.data.contactMobile;
                var list = r.data && r.data.appendixList && r.data.appendixList.map(item=>{
                    var extIndex = item.fileUrl.lastIndexOf('.');
                    var ext = item.fileUrl.slice(extIndex);
                    var fileNameNotext = item.fileName;
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                    var fileTmp = {
                        id: deliveryFileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc: '附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileNameNotext,
                        nameExt: ext,
                        typeFile: fileType,
                        url: item.fileUrl
                    };
                    return fileTmp
                })
                vm.deliveryFileLst = list;

                console.log('vm.deliveryFileLst==>', vm.deliveryFileLst)

                console.log('vm.upload1==>', vm.upload1)

                vm.upload1.updateFile(vm.deliveryFileLst)

                // vm.upload1.initView();

            });
            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    vm.receivables={
                        id:null,
                        driverName:null,
                        driverId:null,
                        contactMobile:null,
                        advanceAmount:null,
                        carNo:null,
                        repaymentTime:null,
                        businessLeaderId:null,
                        businessLeader:null,
                        appendixList:[],
                        salaryDeduction:null
                    };
                    vm.deliveryFileLst=[]
                    vm.upload1.updateFile(vm.deliveryFileLst)

                    // vm.upload1.initView();

                    vm.upload1.clearFile()

                    layer.closeAll();

                    console.log('vm.upload1=111111=>', vm.upload1)
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
        saveOrUpdate: function () {
            if(!vm.receivables.driverId){
                layer.msg(`司机名称不能为空`, {icon: 5});
                return false;
            }
            if(vm.receivables.contactNumber == null || vm.receivables.contactNumber == ''){
                layer.msg(`手机号不能为空`, {icon: 5});
                return false;
            }
            if (vm.receivables.advanceAmount == null || vm.receivables.advanceAmount == '') {
                layer.msg(`预支金额不能为空`, {icon: 5});
                return false;
            }
            if (vm.receivables.carNo == null || vm.receivables.carNo == '') {
                layer.msg(`车牌号不能为空`, {icon: 5});
                return false;
            }
            // const carNoPattern = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
            // if (!carNoPattern.test(vm.receivables.carNo)) {
            //     layer.msg(`车牌号格式不正确`, {icon: 5});
            //     return false;
            // }
            if (!vm.receivables.repaymentTime) {
                layer.msg(`应还时间不能为空`, {icon: 5});
                return false;
            }
            if (!vm.receivables.businessLeader) {
                layer.msg(`业务负责人不能为空`, {icon: 5});
                return false;
            }
            var url = vm.receivables.id == null ? "driver/advance/wages/save" : "/driver/advance/wages/update";
            vm.receivables.appendixList = vm.deliveryFileLst.map(item=>{
                return {fileUrl:item.url,fileName:item.nameFile}
            });
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.receivables),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            vm.$data = vm.$options.data()
                            vm.receivables={
                                id:null,
                                driverName:null,
                                driverId:null,
                                contactMobile:null,
                                advanceAmount:null,
                                carNo:null,
                                repaymentTime:null,
                                businessLeaderId:null,
                                businessLeader:null,
                                appendixList:[],
                                salaryDeduction:null
                            };
                            vm.deliveryFileLst=[]
                            layer.closeAll();
                            vm.reset();
                        });
                       
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        detail: function (id) {
            vm.pageType = 'details-layui-row';
            $.get(baseURL + "driver/advance/wages/info?id=" + id, function (r) {
                vm.receivables = r.data;
                vm.receivables.contactNumber = r.data.contactMobile;
                var list = r.data.appendixList.map(item=>{
                    var extIndex = item.fileUrl.lastIndexOf('.');
                    var ext = item.fileUrl.slice(extIndex);
                    var fileNameNotext = item.fileName;
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                    var fileTmp = {
                        id: deliveryFileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc: '附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileNameNotext,
                        nameExt: ext,
                        typeFile: fileType,
                        url:  item.fileUrl
                    };
                    return fileTmp
                })
                vm.deliveryFileLst = list;

                console.log('vm.deliveryFileLst22==>', vm.deliveryFileLst)

                console.log('vm.upload==>', vm.upload)

                vm.upload.updateFile(vm.deliveryFileLst)

                vm.upload.initView();

                // Upload({
                //     elid: 'deliveryFileLstId2',
                //     edit: false,
                //     fileLst: vm.deliveryFileLst
                // }).initView();
            });
            var index = layer.open({
                title: "详情",
                type: 1,
                content: $("#viewForm"),
                end: function () {
                    vm.upload.clearFile()
                    vm.showDetailForm = false;
                    vm.receivables={
                        id:null,
                        driverName:null,
                        driverId:null,
                        contactMobile:null,
                        advanceAmount:null,
                        carNo:null,
                        repaymentTime:null,
                        businessLeaderId:null,
                        businessLeader:null,
                        appendixList:[],
                        salaryDeduction:null
                    };
                    vm.deliveryFileLst=[]
                    layer.closeAll();
                }
            });
            vm.showDetailForm = true;
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "driver/advance/wages/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            var url = baseURL + 'driver/advance/wages/export?';
            if(vm.q.advanceNo) url += 'advanceNo='+ vm.q.advanceNo;
            if (vm.q.driverName) url += 'driverName=' + vm.q.driverName;
            if (vm.q.contactMobile) url += '&contactMobile=' + vm.q.contactMobile;
            if (vm.q.carNo) url += '&carNo=' + vm.q.carNo;
            if (vm.q.startCreateTime) url += '&startCreateTime=' + vm.q.startCreateTime;
            if (vm.q.endCreateTime) url += '&endCreateTime=' + vm.q.endCreateTime;
            if (vm.q.deductionStatus) url += '&deductionStatus=' + vm.q.deductionStatus;
            if (vm.q.businessLeader) url += '&businessLeader=' + vm.q.businessLeader;
            window.location.href = url;
        },
        cancel: function () {
            vm.$data = vm.$options.data()
            vm.receivables={
                id:null,
                driverName:null,
                driverId:null,
                contactMobile:null,
                advanceAmount:null,
                carNo:null,
                repaymentTime:null,
                businessLeaderId:null,
                businessLeader:null,
                appendixList:[],
                salaryDeduction:null
            };
            vm.deliveryFileLst=[]
            layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: {
                    // 预支编号
                    advanceNo: vm.q.advanceNo,
                    // 司机名称
                    driverName: vm.q.driverName,
                    // 联系电话
                    contactMobile: vm.q.contactMobile,
                    // 车牌号
                    carNo: vm.q.carNo,
                    // 创建时间
                    createTime:vm.q.createTime,
                    startCreateTime:vm.q.startCreateTime,
                    endCreateTime:vm.q.endCreateTime,
                    // 状态
                    deductionStatus: vm.q.deductionStatus,    
                    // 业务负责人
                    businessLeader:  vm.q.businessLeader,           
                }
            });
        },
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        delDeliveryFile: function (id) {
            for(var i = 0 ;i<vm.deliveryFileLst.length;i++) {
                if(vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
    }
});

/**
 * 附件下载
 */
function download(fileUrl,fileName){
    var uri = baseURL + 'file/download?uri='+ fileUrl +"&fileName="+fileName;
    window.location.href = uri;
}

/**
 * 上传附件
 */
function uploadAttachment(upload) {
    var deliveryFileIdTmp;
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadInsuranceFile',
        // http://139.9.242.179:31919/xz-admin-api/file/uploadMonofile
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        multiple: true,
        number:20,
        done: function (res) {
            RemoveLoading();
            if (res.code != '0') {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
                deliveryFileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                vm.deliveryFileLst.push(fileTmp);
                vm.deliveryFileLstId = 'fileLstId_' + uuid(6);
            });
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}

/**
 * 初始化
 */
function initializeData(type) {
    if(type===1){
        var month = new Date().getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        vm.receivables.repaymentTime = new Date().getFullYear() + "-" + month;
    }
}