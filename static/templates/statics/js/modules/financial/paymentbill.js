$(function () {
    //obtainTotalAmount();
    vm.getBusinessType(window.localStorage.getItem("statusKey"));
    obtainCompany();
    obtainBrandSeries();
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        table = layui.table;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            cellMinWidth: 150,
            where: JSON.parse(JSON.stringify(vm.q)),
            url: baseURL + 'financial/paymentbill/list',
            cols: [[
                {type: 'checkbox', fixed: 'left',width:40},
                {title: '操作',  width:100, minWidth:100, templet: '#barTpl', fixed: "left", align: "center"},
                {
                    field: 'carNo', align: "center", title: '车牌号', fixed: "left",templet: function (d) {
                    return isEmpty(d.carNo);
                }
                },
                {
                    field: 'paymentNo', align: "center", title: '应付单号', templet: function (d) {
                    return isEmpty(d.paymentNo);
                }
                },
                {
                    field: 'paymentStatus', align: "center", title: '应付状态', templet: function (d) {
                    if (1 == d.paymentStatus) {
                        return '待付款';
                    } else {
                        return '已付款';
                    }
                }
                },
               
                {
                    field: 'vinNo', align: "center", title: '车架号', templet: function (d) {
                    return isEmpty(d.vinNo);
                }
                },
                {
                    align: "center", title: '品牌/车系', templet: function (d) {
                    return isEmpty(d.brandName) + "/" + isEmpty(d.seriesName);
                }
                },
                {
                    field: 'modelName', align: "center", title: '车型', templet: function (d) {
                    return isEmpty(d.modelName);
                }
                },
                {
                    field: 'carSource', align: "center", title: '车辆来源', templet: function (d) {
                        return getRentTypeStr(d.carSource);
                }
                },
                {
                    field: 'company', align: "center", title: '车辆归属', templet: function (d) {
                    return isEmpty(d.company);
                }
                },
                {
                    field: 'contractNo', align: "center", title: '合同编号', templet: function (d) {
                    return isEmpty(d.contractNo);
                }
                },
                {
                    field: 'supplierName', align: "center", title: '收款方', templet: function (d) {
                    return isEmpty(d.supplierName);
                }
                },
                {
                    field: 'paymentType', align: "center", title: '付款类型', templet: function (d) {
                    if (0 == d.paymentType) {
                        return d.paymentContent||"其他"
                    } else if (1 == d.paymentType) {
                        return "保证金"
                    } else if (2 == d.paymentType) {
                        return "租金"
                    } else if (3 == d.paymentType) {
                        return "首付款"
                    } else if (4 == d.paymentType) {
                        return "退车结算款"
                    } else if (5 == d.paymentType) {
                        return "换车结算款"
                    } else if (6 == d.paymentType) {
                        return "备用车结算款"
                    } else if (7 == d.paymentType) {
                        return "整备费"
                    } else if (8 == d.paymentType) {
                        return "尾款"
                    } else if (9 == d.paymentType) {
                        return "定金"
                    } else if (10 == d.paymentType) {
                        return "其他费用"
                    } else if (11 == d.paymentType) {
                        return "车辆总单价"
                    } else if (12 == d.paymentType) {
                        return "挂靠费"
                    } else if (13 == d.paymentType) {
                        return "应付转下期"
                    } else if (14 == d.paymentType) {
                        return "渠道返利"
                    }  else if (15 == d.paymentType) {
                        if(d.extendType != null && d.extendType != undefined){
                            if(13 == d.extendType){
                                return "超险罚款"
                            }else if(14 == d.extendType){
                                return "超保罚款"
                            }else if(11 == d.extendType || 12 == d.extendType){
                                return d.extendTypeName
                            }else if(2 == d.extendType){
                                return "商业险"
                            }else if(3 == d.extendType){
                                return "交强险"
                            }else if(4 == d.extendType){
                                return "承运险"
                            }else if(20 == d.extendType){
                                return "保养费用"
                            }else if(21 == d.extendType){
                                return "出险费用"
                            }
                        }
                        return "维保相关费用"
                    } else{
                        return "--"
                    }
                }
                },
                {
                    field: 'extendPayee',  align: "center", title: '收款单位', templet: function (d) {
                    return isEmpty(d.extendPayee);
                }
                },
                {
                    field: 'billPeriods',  align: "center", title: '账单期数', templet: function (d) {
                    return isEmpty(d.billPeriods);
                }
                },
                {
                    field: 'copeWithAmount',  align: "center", title: '应付金额', templet: function (d) {
                    return isEmpty(d.copeWithAmount);
                }
                },
                {
                    field: 'prepaidAmount',  align: "center", title: '已付金额', templet: function (d) {
                    return isEmpty(d.prepaidAmount);
                }
                },
                {
                    field: 'pendingPaymentAmount',  align: "center", title: '待付金额', templet: function (d) {
                    return isEmpty(d.pendingPaymentAmount);
                }
                },
                {
                    field: 'copeWithDate',  align: "center", title: '应付日期', templet: function (d) {
                    return isEmpty(d.copeWithDate);
                }
                },
                {
                    field: 'realPayDate',  align: "center", title: '实付日期', templet: function (d) {
                    return isEmpty(d.realPayDate);
                }
                },
                {
                    field: 'days',  align: "center", title: '逾期日期', templet: function (d) {
                        if(d.days > 0 ){
                            return d.days;
                        }else{
                            return '--';
                        }

                }
                },
                {
                    field: 'note', align: "center", title: '备注', templet: function (d) {
                    return isEmpty(d.note);
                }
                },
                {
                    field: 'createTime',  align: "center", title: '创建日期', templet: function (d) {
                    return isEmpty(d.createTime);
                }
                }
            ]],
            page: true,
            loading: false,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });

        //
        // //头工具栏事件
        // table.on('toolbar(grid)', function (obj) {
        //     var checkStatus = table.checkStatus(obj.config.id);
        //     switch (obj.event) {
        //         case 'getCheckData':
        //             var data = checkStatus.data;
        //             if(data.length > 0){
        //                 var index = layer.open({
        //                     title: "付款批量操作",
        //                     area:['300px', '200px'],
        //                     btn: ['当前时间付款', '应付时间付款'],
        //                     content:'<div style="text-align: center;line-height: 75px;">确认已付账单吗</div>',
        //                     yes: function(index, layero){
        //                         paymentBatch(data,1);
        //                     }
        //                     ,btn2: function(index, layero){
        //                         paymentBatch(data,2);
        //                     },
        //                     end: function () {
        //                         layer.close(index);
        //                     }
        //                 });
        //             }else{
        //                 layer.alert("请选择付款账单");
        //             }
        //             break;
        //     }
        //     ;
        // });


    });

    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });


    layui.use(['form', 'layedit', 'laydate', 'upload'], function () {
        var form = layui.form;

        form.on('select(maintenanceType)', function (data) {
            vm.q.maintenanceType = data.value;
        });

        form.on('select(payType)', function (data) {
            vm.q.payType = data.value;
            if (vm.q.payType != 15) {
                vm.q.maintenanceType = '';
            }
        });

        form.on('select(company)', function (data) {
            vm.q.company = data.value;
        });

        form.on('select(brandSeries)', function (data) {
            vm.q.brandSeries = data.value;
        });
        form.on('select(lessor)', function (data) {
            vm.payment.payerId = data.value;
        });

        form.on('select(carSource)',function (data) {
            vm.q.carSource = data.value;
            console.log("搜索车辆来源:{}",vm.q.carSource);
        })

        form.on('select(paymentStatus)',function (data) {
            vm.q.paymentStatus = data.value;
            console.log("搜索付款状态:{}",vm.q.paymentStatus);
        })

        form.on('select(total)',function (data) {
            vm.q.total = data.value;
            console.log("搜索统计:{}",vm.q.total);
        })
        form.render('select');
    });

    layui.use(['form', 'layedit', 'laydate', 'upload'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            upload = layui.upload;

        laydate.render({
            elem: '#copeWithDate',
            format: 'yyyy-MM-dd',
            type: 'datetime',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.copeWithTime = value;
            }
        });
        laydate.render({
            elem: '#realPayDate',
            format: 'yyyy-MM-dd',
            type: 'datetime',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.realPayTime = value;
            }
        });

        uploadAttachment(upload);
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        laydate.render({
            elem: '#paymentTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.payment.paymentTime = value;
            }
        });
        form.render();
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.receivablesId);
        } else if (layEvent === 'del') {
            var receivablesId = [data.receivablesId];
            vm.del(receivablesId);
        } else if (layEvent === 'collectionsk') {
            vm.collectionsq(data);
        } else if (layEvent === 'detail') {
            vm.detail(data);
        }
    });


});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            status:1,
            paymentNo: null,
            company: null,
            supplierName: null,
            carSource: null,
            brandSeries: null,
            paymentStatus: null,
            carNoAndVinNo: null,
            total: null,
            copeWithTime: null,
            realPayTime: null,
            carBrandId:null,
            carSeriesId:null,
            carModelId:null,
            deptId:null,
            dept:null,
            payType:'',
            maintenanceType:'',

        },
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        showForm: false,
        copeWithAmount: 0,
        prepaidAmount: 0,
        companyList:[],
        brandSeriesList:[],
        title:null,
        status:null,
        amountLabel:null,
        dateLabel: null,
        payment:{},
        paymentStatus:null,
        isFilter:false,
        customer:{},
        qudaoShow: false,
        kehuShow:false,
        supplierShow:false,
        deptList:[]
    },
    created: function () {
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.selectData,
                    success: function (valData,labelData) {
                        vm.q.carBrandId = valData[0];
                        vm.q.carSeriesId = valData[1];
                        vm.q.carModelId = valData[2];
                    }
                });
            });
        });

         var _this=this;
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList.filter(function (v) {
                return v.sysDeptType != 5;
            });
        });
    },
    updated: function () {
        layui.form.render();
    },
    methods: {

        reloadGridid(){
            layui.table.reload("gridid");
        },
        selectCustomer:function (){
            window.localStorage.setItem("customerName",vm.customer.customerName);
            window.localStorage.setItem("customerId",vm.customer.customerId);
            var index = layer.open({
                title: "选择客户",
                type: 2,
                content: tabBaseURL + "modules/common/selectcustomer.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                },
                end: function(){
                    vm.payment.customerId=vm.customer.id;
                    vm.payment.customerName=vm.customer.customerName;
                    window.localStorage.removeItem("customerId");
                    window.localStorage.removeItem("customerName");

                }
            });
            layer.full(index)

        },
        getBusinessType:function (businessType){
            if(businessType != null && businessType!=''){
                if (businessType == '1'){
                    vm.q.status = 1;
                    var type = window.localStorage.getItem("dateTimetype");
                    if(type == '1'){
                        vm.q.total = 1;
                    } else if(type == '2'){
                        vm.q.total = 2;
                    } else if(type == '3'){
                        vm.q.total = 3;
                    } else if(type == '4'){
                        vm.q.total = 4;
                    } else if(type == '5'){
                        vm.q.total = null;
                    }
                }else if (businessType == '2'){
                    vm.q.status = 2;
                    var type = window.localStorage.getItem("dateTimetype");
                    if(type == '1'){
                        vm.q.total = 1;
                    } else if(type == '2'){
                        vm.q.total = 2;
                    } else if(type == '3'){
                        vm.q.total = 3;
                    } else if(type == '4'){
                        vm.q.total = 4;
                    } else if(type == '5'){
                        vm.q.total = null;
                    }
                }
                vm.statusType = 1;
                vm.reload();
            } else {
                var carvinno = window.localStorage.getItem("carvinno");
                vm.q.carNoAndVinNo=carvinno
                vm.reload();
            }
            var carvinno = window.localStorage.getItem("carvinno");
            vm.q.carNoAndVinNo=carvinno
            vm.reload();
        },

        obtainTotalAmount:function() {
             
            $.ajax({
                type: "POST",
                url: baseURL + "financial/paymentbill/paymentBillAmountTotal",
                data:JSON.parse(JSON.stringify(vm.q)),
                success: function (res) {
                    vm.copeWithAmount = res.copeWithAmount;
                    vm.prepaidAmount = res.prepaidAmount;
                }
            });
        },

        changeStatus: function (status) {
            if(vm.statusType != null){
                vm.q.total = null;
            }
            vm.q.status = status;
            vm.reload();
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }
            var paymentIds = [];
            $.each(list, function (index, item) {
                paymentIds.push(item.id);
            });
            var index = layer.open({
                title: "付款批量操作",
                area:['500px', '230px'],
                btn: ['当前时间付款', '应付时间付款', '其他时间付款'],
                content:'<div style="text-align: center;line-height: 75px;">确认已付账单吗</div>',
                yes: function(index, layero){
                    paymentBatch(paymentIds,1);
                }
                ,btn2: function(index, layero){
                    paymentBatch(paymentIds,2);
                },
                btn3: function(index, layero){
                    var index_2 = layer.open({
                        title: "其他时间付款",
                        type: 1,
                        content: '<div style="margin: 30px"><input id="payDate" type="text" class="layui-input" placeholder="请选择付款时间" autocomplete="off" readonly/></div>',
                        btn: ['确定'],
                        success: function(layero,num){
                            layui.laydate.render({
                                elem: '#payDate',
                                trigger: 'click',
                                done: function (value) {}
                            });
                        },
                        btn1: function () {
                            // 创建一个链接，模拟点击下载
                            var payDate = $('#payDate').val();
                            if (!payDate) {
                                alert('请选择付款时间');
                                return;
                            }
                            console.log(payDate)
                            paymentBatch(paymentIds,3, payDate);
                            layer.close(index_2);
                        },
                        end: function () {
                            layer.close(index_2);
                        }
                    });
                },
                end: function () {
                    layer.close(index);
                }
            });
        },
        query: function () {
            vm.reload();
            //obtainTotalAmount();
        },
        reset: function () {
            vm.q.paymentNo = null;
            vm.q.company = null;
            vm.q.supplierName = null;
            vm.q.carSource = null;
            vm.q.brandSeries = null;
            vm.q.paymentStatus = null;
            vm.q.carNoAndVinNo = null;
            vm.q.total = null;
            vm.q.copeWithTime = null;
            vm.q.realPayTime = null;
            vm.q.carBrandId = null;
            vm.q.carSeriesId = null;
            vm.q.carModelId = null;
            vm.q.deptId=null;
            vm.q.dept=null;
            vm.q.payType='';
            vm.q.maintenanceType='';
            $("#carBrandSeriesModel").val('');
        },

        add:function (type){
            var index = layer.open({
                title: type == 1?'新增应付账单':'新增已付账单',
                type: 2,
                area: ['100%', '100%'],
                content: tabBaseURL + "modules/financial/addPayBill.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(vm.carSourceOrder??null,type, 2);
                },
                end: function(){
                    layer.close(index);
                }
            });
        },
        update: function (receivablesId) {
            $.get(baseURL + "financial/receivables/info/" + receivablesId, function (r) {
                vm.receivables = r.receivables;
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },

        detail: function (data) {
            window.localStorage.setItem("id", data.id);
            var index = layer.open({
                title: "应付单详情",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/paymentbilldetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("id", null);
                    vm.reload();
                }
            });
            layer.full(index);


        },
        collectionsq: function (data) {
            window.localStorage.setItem("id", data.id);
            var index = layer.open({
                title: "付款单确认",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/paymentoperation.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("id", null);
                    vm.reload();
                }
            });
            layer.full(index);


        },
        del: function (receivablesIds) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "financial/payment/delete",
                    contentType: "application/json",
                    data: JSON.stringify(receivablesIds),
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
        saveOrUpdate: function (event) {
            vm.payment.status = vm.type;
            vm.payment.attachment = vm.deliveryFileLst;
            if (  vm.payment.customerId == null || vm.payment.customerId == '') {
                layer.msg('收款方不能为空!', {icon: 7});
                return false;
            }
            $.ajax({
                type: "POST",
                url: baseURL + "financial/paymentbill/save",
                contentType: "application/json",
                data: JSON.stringify(vm.payment),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });

        },
        exports: function () {
            var url = baseURL + 'financial/paymentbill/export?a=a';
            if (vm.q.status != null && vm.q.status != "") {
                url += '&status=' + vm.q.status;
            }
            if (vm.q.customerName != null && vm.q.customerName != "") {
                url += '&customerName=' + vm.q.customerName;
            }
            if (vm.q.rentType != null && vm.q.rentType != "") {
                url += '&rentType=' + vm.q.rentType;
            }
            if (vm.q.businessNo != null && vm.q.businessNo != "") {
                url += '&businessNo=' + vm.q.businessNo;
            }
            if (vm.q.customerType != null && vm.q.customerType != "") {
                url += '&customerType=' + vm.q.customerType;
            }
            if (vm.q.paymentMethod != null && vm.q.paymentMethod != "") {
                url += '&paymentMethod=' + vm.q.paymentMethod;
            }
            if (vm.q.collectionType != null && vm.q.collectionType != "") {
                url += '&collectionType=' + vm.q.collectionType;
            }
            if (vm.q.carPlateNo != null && vm.q.carPlateNo != "") {
                url += '&carPlateNo=' + vm.q.carPlateNo;
            }
            if (vm.q.statistics != null && vm.q.statistics != "") {
                url += '&statistics=' + vm.q.statistics;
            }
            //            vm.q.copeWithTime = null;
            //             vm.q.realPayTime = null;
            if (vm.q.copeWithTime != null && vm.q.copeWithTime != "") {
                url += '&copeWithTime=' + vm.q.copeWithTime;
            }
            if (vm.q.realPayTime != null && vm.q.realPayTime != "") {
                url += '&realPayTime=' + vm.q.realPayTime;
            }
            if (vm.q.payType != null && vm.q.payType != "") {
                url += '&payType=' + vm.q.payType;
            }
            if (vm.q.maintenanceType != null && vm.q.maintenanceType != "") {
                url += '&maintenanceType=' + vm.q.maintenanceType;
            }
            window.location.href = url;
        },
        cancel: function () {
            layer.closeAll();
        },
        reload: function () {
            vm.obtainTotalAmount();
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    status:vm.q.status,
                    paymentNo:vm.q.paymentNo,
                    company:vm.q.company ,
                    supplierName :vm.q.supplierName ,
                    carSource:vm.q.carSource,
                    brandSeries :vm.q.brandSeries ,
                    paymentStatus :vm.q.paymentStatus ,
                    carNoAndVinNo :vm.q.carNoAndVinNo ,
                    total:vm.q.total,
                    copeWithTime :vm.q.copeWithTime ,
                    realPayTime: vm.q.realPayTime,
                    carBrandId:vm.q.carBrandId ,
                    carSeriesId:vm.q.carSeriesId,
                    carModelId:vm.q.carModelId ,
                    deptId:vm.q.deptId,
                    dept:vm.q.dept,
                    payType:vm.q.payType,
                    maintenanceType:vm.q.maintenanceType,
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        deptTree: function () {
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.q, "deptId", treeNode.deptId);
            Vue.set(vm.q, "dept", treeNode.name);
            layer.closeAll();
        },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        selectCar: function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/financial/selectCarInfo.html",
                end: function () {
                    console.log(vm.payment);
                    layer.close(index);
                }
            });
        },
        /**
         * 导入
         */
        importData:function (){
            var index = layer.open({
                title: "数据导入",
                type: 2,
                boxParams: {type:11},
                content: tabBaseURL + "modules/import/dataimport_common.html",
                success: function (layero, num) {
                },
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
    }
});

/**
 * 获取收款方信息
 */
function getCustomer() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/shouldrefund/getCustomer",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#customer').append(new Option(item.customerName, item.id));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/**
 * 获取渠道商信息
 */
function getDistributors() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/shouldrefund/getDistributors",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#customer').append(new Option(item.channelName, item.id));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}



/**
 * 获取供应商信息
 */
function getGysDistributors() {

    $.ajax({
        type: "GET",
        url: baseURL + "purchase/purchasesupplier/selectSupList?enalbe=1",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#supplier').append(new Option(item.supplierName, item.purchaseSupplierId));
            });
            layui.form.render("select");
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/**
 * 上传附件
 */
function uploadAttachment(upload) {
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadInsuranceFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar', //
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
    vm.type = type;
    if (type == 1) {
        vm.title = "新增应付账款";
        vm.status = "未付款";
        vm.amountLabel = "应付金额";
        vm.dateLabel = "应付日期";
    } else if (type == 2) {
        vm.title = "新增已付账款";
        vm.status = "已付款";
        vm.amountLabel = "已付金额";
        vm.dateLabel = "已付日期";
    }
    vm.payment = {};
    vm.deliveryFileLst = [];
    $('#customer').html("<option value=''>请选择付款方</option>");
    vm.payment.customerType = 5;
    vm.kehuShow=true;
    vm.qudaoShow=false;
    vm.supplierShow=false;
   // getCustomer();
}


function obtainCompany() {
    $.ajax({
        type: "GET",
        url: baseURL + 'customer/getCompanyList',
        success: function (data) {
            vm.companyList = data.data;
        }
    });
}

function obtainBrandSeries() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectBrandAndModel",
        contentType: "application/json",
        success: function(res){
            vm.brandSeriesList = res.data;
        }
    })
}

function paymentBatch(ids,type,paydate){
    ids.push(type);
    var url = 'financial/paymentbill/paymentBatch';
    if (type == 3) {
        url += ('/'+paydate)
    }
    $.ajax({
        type: "POST",
        url: baseURL + url,
        contentType: "application/json",
        data:JSON.stringify(ids),
        success: function(){
            alert('操作成功', function () {
                vm.reload();
            });
        }
    });
}
