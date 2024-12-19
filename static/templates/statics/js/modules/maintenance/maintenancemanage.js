$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            autoSort: false,
            //  toolbar: true,
            //  defaultToolbar: ['filter'],
            where: { carPlateNo: vm.q.carPlateNo },
            url: baseURL + 'maintenance/maintenancemanage/list',
            cols: [[
                { title: '操作', minWidth: 200, templet: '#barTpl', fixed: "left", align: "center" },
                {
                    field: 'carPlateNo', minWidth: 100, fixed: "left", align: "center", title: '车牌号', align: "center", templet: function (d) {
                        if(d.carPlateNo != null && d.carPlateNo != ''){
                            return "<span style='color: blue' onclick = hrefCarView(\'" + d.carId + "\')>" + d.carPlateNo + "</span>";
                        }else {
                            return '--';
                        }
                    }
                },
                { field: 'maintenanceStatusStr', minWidth: 100, title: '保养时效', align: "center" },
                /* {field:'orderNo', minWidth:200, title: '车辆订单号',align:"center", templet:function (d) {
                         if(d.orderNo!=null && d.orderNo!=""){
                             return  "<span style='color: blue'>"+d.orderNo+"</span>";
                         }else {
                             return "--";
                         }
                     }},*/


                {
                    field: 'maintenanceDate', minWidth: 100, title: '本次保养时间', align: "center", templet: function (d) {
                        if (d.maintenanceDate != null) {
                            var date = new Date(d.maintenanceDate).format("yyyy-MM-dd");
                            return date;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'nextDate', minWidth: 150, title: '下次保养时间', align: "center", templet: function (d) {
                        if (d.nextDate != null) {
                            var date = new Date(d.nextDate).format("yyyy-MM-dd");
                            return date;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'dayWarning', sort: true, minWidth: 180, title: '时间提醒', align: "center", templet: function (d) {
                        // if(d.dayWarning!=null && d.dayWarning!=""){
                        //     if(d.isDataRenewal == 0){
                        //         return  "<span style='color: green'>"+d.dayWarning+"</span>";
                        //     } else {
                        //         return  "<span style='color: red'>"+d.dayWarning+"</span>";
                        //     }
                        // }else {
                        //     return "--";
                        // }
                        return d.dayWarning;
                    }
                },
                {
                    field: 'currentMile', minWidth: 100, title: '当前公里数', align: "center", templet: function (d) {
                        if (d.currentMile != null && d.currentMile != "") {
                            return d.currentMile;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'nextMile', minWidth: 150, title: '下次保养公里数', align: "center", templet: function (d) {
                        if (d.nextMile != null && d.nextMile != "") {
                            return d.nextMile;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'kilometreWarning', minWidth: 140, title: '公里数提醒', align: "center", templet: function (d) {

                        return "<span style='color: red'>" + d.kilometreWarning + "</span>";

                    }
                },

                {
                    field: 'serviceSite', minWidth: 180, title: '服务站', align: "center", templet: function (d) {
                        if (d.serviceSite != null && d.serviceSite != "") {
                            return d.serviceSite;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'maintenanceFee', minWidth: 100, title: '保养合计费用/元', align: "center", templet: function (d) {
                        if (d.maintenanceFee != null && d.maintenanceFee != "") {
                            return d.maintenanceFee;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: ' maintenanceItems', minWidth: 100, title: '保养项目/保养金额（元）', templet: function (d) {
                        if (d.maintenanceItems != null && d.maintenanceItems != '') {
                            return d.maintenanceItems;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'customer', minWidth: 100, title: '客户名称', align: "center", templet: function (d) {
                        if (d.customer != null && d.customer != "") {
                            return d.customer;
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'carStatusStr', minWidth: 100, title: '车辆状态', align: "center" },
                {
                    field: 'rentType', minWidth: 150, title: '订单类型', align: "center", templet: function (d) {
                        return getRentTypeStr(d.rentType);


                    }
                },
                { field: 'vinNo', minWidth: 100, title: '车架号', align: "center" },
                {
                    field: 'carBrandModelName', minWidth: 180, title: '品牌/车系/车型', align: "center", templet: function (d) {
                        if (d.carBrandModelName != null && d.carBrandModelName != "") {
                            return d.carBrandModelName;
                        } else {
                            if (d.brandName != null && d.modelName != null) {
                                return d.brandName + "/" + d.modelName;
                            } else if (d.brandName != null) {
                                return d.brandName;
                            } else {
                                return "--";
                            }
                        }
                    }
                },
                {
                    field: 'belongFactory', minWidth: 100, title: '车辆归属', align: "center", templet: function (d) {
                        if (d.belongFactory != null && d.belongFactory != "") {
                            return d.belongFactory;
                        } else {
                            return "--";
                        }
                    }
                },
                // {
                //     field: 'carDepotName', minWidth: 120, title: '所在仓库', align: "center", templet: function (d) {
                //         if (d.carDepotName != null && d.carDepotName != "") {
                //             return d.carDepotName;
                //         } else {
                //             return "--";
                //         }
                //     }
                // },
                // {
                //     field: 'carOwner', minWidth: 100, title: '车辆所有人', align: "center", templet: function (d) {
                //         if (d.carOwner != null && d.carOwner != "") {
                //             return d.carOwner;
                //         } else {
                //             return "--";
                //         }
                //     }
                // },
                /*{field:'vehicleUseStr', minWidth:100, title: '车辆用途',align:"center"},*/

            ]],
            page: true,
            loading: true,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res, curr, count) {
                soulTable.render(this);
            }
        });
        layui.table.on('sort(grid)', function (obj) {
            for (var key in vm.q) {
                if (key.endsWith('Sort')) {
                    vm.q[key] = null;
                }
            }
            vm.q[obj.field + 'Sort'] = obj.type;
            vm.reload(obj);

            console.log('服务端排序。order by ' + obj.field + ' ' + obj.type);
            // tableStyleAmendment();
        });
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        //应收日期
        var compulsoryStartTime = laydate.render({
            elem: '#receivableTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.fineForm.receivableTime = value;

            }
        });
        //应付日期
        var compulsoryStartTime = laydate.render({
            elem: '#copeWithTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.fineForm.copeWithTime = value;
            }
        });
        init(layui);
        form.render();
    });

    layui.form.on('submit(saveOrUpdate)', function () {
        vm.saveOrUpdate();
        return false;
    });


    //批量删除
    $(".delBatch").click(function () {
        var maintenanceIds = vm.selectedRows();
        if (maintenanceIds == null) {
            return;
        }
        vm.del(maintenanceIds);
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        init(layui);
        form.render();
    });


    //品牌车型
    layui.form.on('select(carModelSelect)', function (data) {
        vm.q.carBrandModelName = data.value;
    });
    //车辆状态
    layui.form.on('select(carStatusSelect)', function (data) {
        vm.q.carStatus = data.value;
    });
    //车辆用途
    layui.form.on('select(vehicleUseSelect)', function (data) {
        vm.q.carApplication = data.value;
    });
    // 保单时效
    layui.form.on('select(maintenanceStatusSelect)', function (data) {
        vm.q.maintenanceStatus = data.value;
    });
    //数据范围
    layui.form.on('select(allDataScopeFlagSelect)', function (data) {
        vm.q.allDataScopeFlag = data.value;
    });
    /*    layui.use('laydate', function(){
            var laydate = layui.laydate;
            laydate.render({
                elem: '#searchMaintenanceDate',
                trigger: 'click',
                range:'/',
                done: function (value, date, endDate) {
                    vm.q.searchMaintenanceDate = value;
                }
            });
    
            laydate.render({
                elem: '#searchNextMaintenanceDate',
                trigger: 'click',
                range:'/',
                done: function (value, date, endDate) {
                    vm.q.searchNextMaintenanceDate = value;
                }
            });
    
        });*/

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.maintenanceId, data.maintenanceNumber);
        } else if (layEvent === 'del') {
            var maintenanceId = [data.maintenanceId];
            vm.del(maintenanceId);
        } else if (layEvent === 'view') {
            vm.view(data.maintenanceId, data.maintenanceNumber, data.carPlateNo, data.carId, data.kilometreWarning);
        } else if (layEvent === 'renewal') {
            //续保
            vm.renewal(data.maintenanceId, data.maintenanceNumber, data.carId);
        } else if (layEvent === 'fine') {
            vm.fineChange(data.carId,data.maintenanceId)
        }
    });

    layui.form.on('switch(switchTest1)', function () {
        let a = $.trim($('#contractSwitch1').is(":checked"));
        console.log(a, 1111111111)
        if (a == 'true') {
            Vue.set(vm.fineForm, "isGenerateReceivableBill", 1);
        } else {
            Vue.set(vm.fineForm, "isGenerateReceivableBill", 0);
        }

    });
    layui.form.on('switch(switchTest2)', function () {
        let a = $.trim($('#contractSwitch2').is(":checked"));
        console.log(a, 222222222)
        if (a == 'true') {
            Vue.set(vm.fineForm, "isGeneratePayableBill", 1);
        } else {
            Vue.set(vm.fineForm, "isGeneratePayableBill", 0);
        }

    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carPlateNo: null,
            serviceSite: null,
            searchMaintenanceDate: null,
            belongCity: null,
            carApplication: null,
            carStatus: null,
            orderNo: null,
            maintenanceNumber: null,
            customer: null,
            carBrandModelName: null,
            brandId: null,
            modelId: null,
            seriesId: null,
            belongFactory: null,
            carDepotId: null,
            carDepotName: null,
            brandName: null,
            maintenanceStatus: null,
            searchNextMaintenanceDate: null,
            currentMaintenanceType: null,
            nextMaintenanceType: null,
            carOwner: null,
            // 数据范围 1全部，2最新
            allDataScopeFlag: 2
        },
        showForm: false,
        maintenanceManage: {},
        allCarModels: [],
        selectData: [],
        //仓库数据源
        warehouseData: {},
        isFilter: false,
        showInsurance1: false,
        fineForm: {
            copeWithMoney: '',
            copeWithTime: '',
            receivableMoney: "",
            receivableTime: "",
            userInfo: '',
            supplierInfo: "",
            isGenerateReceivableBill: 0,
            isGeneratePayableBill: 0,
        }, // 超保罚款
    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
        /*var _this = this;
        $.getJSON(baseURL + "maintenance/insurancemanage/listBrandAndModel", function (r) {
            console.log(r.listData)
            _this.allCarModels = r.listData;
        });*/
        var _this = this;
        _this.q.carPlateNo = parent.layer.boxParams.boxParams;
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form', "jquery", "cascader", "form"], function () {
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {

                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#a",
                    data: vm.selectData,
                    success: function (valData, labelData) {
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });
    },

    methods: {
        // 提交超保罚款
        fineCommit() {
            let fineParams = {}
            fineParams.maintenanceId = vm.fineForm.maintenanceId;
            fineParams.maintenanceType =  vm.fineForm.maintenanceType;
            fineParams.carId = vm.fineForm.carId;
            // this.fineForm.supplierInfo = 1
            // this.fineForm.userInfo = 1
            if (this.fineForm.userInfo && this.fineForm.supplierInfo) {
                if (this.fineForm.userInfo && this.fineForm.supplierInfo && this.fineForm.copeWithMoney && this.fineForm.receivableMoney && this.fineForm.copeWithTime && this.fineForm.receivableTime) {
                    fineParams.customerId = this.fineForm.customerId
                    fineParams.customerName = this.fineForm.customerName
                    fineParams.customerPhone = this.fineForm.customerPhone
                    fineParams.supplierId = this.fineForm.supplierId
                    fineParams.supplierName = this.fineForm.supplierName
                    fineParams.supplierPhone = this.fineForm.supplierPhone

                    fineParams.payableAmount = this.fineForm.copeWithMoney
                    fineParams.receivableAmount = this.fineForm.receivableMoney
                    fineParams.payableTime = this.fineForm.copeWithTime
                    fineParams.receivableTime = this.fineForm.receivableTime
                    fineParams.isGenerateReceivableBill = this.fineForm.isGenerateReceivableBill
                    fineParams.isGeneratePayableBill = this.fineForm.isGeneratePayableBill
                } else {
                    layer.alert('请填写所有信息', {
                        icon: 5,
                        title: "提示"
                    });
                    return false;
                }

            } else {
                if (this.fineForm.userInfo) {
                    if (this.fineForm.userInfo && this.fineForm.receivableTime && this.fineForm.receivableMoney) {

                        fineParams.customerId = this.fineForm.customerId
                        fineParams.customerName = this.fineForm.customerName
                        fineParams.customerPhone = this.fineForm.customerPhone

                        fineParams.receivableAmount = this.fineForm.receivableMoney
                        fineParams.receivableTime = this.fineForm.receivableTime
                        fineParams.isGenerateReceivableBill = this.fineForm.isGenerateReceivableBill

                    } else {
                        layer.alert('请填写所有客户信息', {
                            icon: 5,
                            title: "提示"
                        });
                        return false;
                    }
                } else if (this.fineForm.supplierInfo) {
                    if (this.fineForm.supplierInfo && this.fineForm.copeWithTime && this.fineForm.copeWithMoney) {
                        fineParams.supplierId = this.fineForm.supplierId
                        fineParams.supplierName = this.fineForm.supplierName
                        fineParams.supplierPhone = this.fineForm.supplierPhone

                        fineParams.payableAmount = this.fineForm.copeWithMoney
                        fineParams.payableTime = this.fineForm.copeWithTime
                        fineParams.isGeneratePayableBill = this.fineForm.isGeneratePayableBill
                    } else {
                        layer.alert('请填写所有供应商信息', {
                            icon: 5,
                            title: "提示"
                        });
                        return false;
                    }
                } else {
                    layer.alert('请填写所有信息', {
                        icon: 5,
                        title: "提示"

                    });
                    return false;
                }
            }
            var url = "maintenance/insurancemanage/saveFine";
            console.log(fineParams, '超保罚款信息保存');
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(fineParams),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            vm.cancellationCommit()
                            // layer.close(vm.fineStaues);
                        });
                    }else{
                        alert(r.msg);
                        vm.cancellationCommit()
                        // layer.close(vm.fineStaues);
                    }
                    vm.reload()
                }
            });
        },
        // 取消超保罚款
        cancellationCommit() {
            this.fineForm.userInfo = ''
            this.fineForm.supplierInfo = ''
            this.fineForm.copeWithMoney = ''
            this.fineForm.receivableMoney = ''
            this.fineForm.copeWithTime = ''
            this.fineForm.receivableTime = ''
            this.fineForm.isGenerateReceivableBill = 0
            this.fineForm.isGeneratePayableBill = 0
            layer.close(vm.fineStaues);
        },
        // 超保罚款
        fineChange: function (carId,maintenanceId) {
            $.ajax({
                type: "GET",
                url: baseURL + "maintenance/maintenancemanage/overprotectionInfo?carId="+carId,
                contentType: "application/json",
                success: function (r) {
                    if (r.code == 0) {
                        vm.fineForm.maintenanceId = maintenanceId;
                        vm.fineForm.maintenanceType = 2;
                        vm.fineForm.carId = carId;

                        vm.fineForm.customerId = r.data.customerId;
                        vm.fineForm.customerName = r.data.customerName;
                        vm.fineForm.customerPhone = r.data.customerPhone;
                        vm.fineForm.userInfo = r.data.customerName;
                        if(r.data.customerPhone != null && r.data.customerPhone != ''){
                            vm.fineForm.userInfo += ' / '+r.data.customerPhone;
                        }
                        vm.fineForm.supplierId = r.data.supplierId;
                        vm.fineForm.supplierName = r.data.supplierName;
                        vm.fineForm.supplierPhone = r.data.supplierPhone;
                        vm.fineForm.supplierInfo = r.data.supplierName;
                        if(r.data.supplierPhone != null && r.data.supplierPhone != ''){
                            vm.fineForm.supplierInfo += ' / '+r.data.supplierPhone;
                        }

                        var index = layer.open({
                            title: "超保罚款",
                            type: 1,
                            content: $("#showInsurance1"),
                            end: function () {
                                vm.showInsurance1 = false;
                            }
                        });
                        layer.full(index);
                        vm.fineStaues = index
                        console.log(index, 7777777)
                    } else {
                        alert(r.msg);
                    }
                }
            });


        },
        initParam: function (carNo) {
            vm.q.carPlateNo = carNo;
            // setTimeout(function () {
            //     vm.reload();
            // },100)

        },
        chooseWarehouse: function () {
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function () {
                    vm.q = Object.assign({}, vm.q, {
                        carDepotId: vm.warehouseData.warehouseId,
                        carDepotName: vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
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
            Vue.set(vm.q, "belongFactoryId", treeNode.deptId);
            Vue.set(vm.q, "belongFactory", treeNode.name);
            layer.closeAll();
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var maintenanceIds = [];
            $.each(list, function (index, item) {
                maintenanceIds.push(item.maintenanceId);
            });
            return maintenanceIds;
        },
        //重置
        reset: function () {
            vm.q.carPlateNo = null;
            vm.q.serviceSite = null;
            vm.q.searchMaintenanceDate = null;
            vm.q.searchNextMaintenanceDate = null;
            vm.q.belongCity = null;
            vm.q.carApplication = null;
            vm.q.carStatus = null;
            vm.q.orderNo = null;
            vm.q.maintenanceNumber = null;
            vm.q.customer = null;
            vm.q.carBrandModelName = null;
            vm.q.belongFactory = null;
            vm.q.carDepotId = null;
            vm.q.carDepotName = null;
            vm.q.brandId = null;
            vm.q.modelId = null;
            vm.q.seriesId = null;
            vm.q.brandName = null;
            vm.selectData = null;
            vm.q.maintenanceStatus = null;
            vm.q.currentMaintenanceType = null;
            vm.q.nextMaintenanceType = null;
            vm.q.carOwner = null;

            $("#a").val('');

            $('div[type="currentMaintenanceDate"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="nextMaintenanceDate"]>div').removeClass('task-content-box-tab-child-active');
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            var index = layer.open({
                title: "维保管理 > 保养管理 > 新增车辆保养",
                type: 2,
                content: tabBaseURL + "modules/maintenance/maintenancemanageadd.html",
                end: function () {
                    layer.closeAll();
                    // vm.reload();
                }
            });
            layer.full(index);
        },
        //续保
        renewal: function (maintenanceId, maintenanceNumber, carId) {
            // window.localStorage.setItem("maintenanceId", maintenanceId);
            // window.localStorage.setItem("maintenanceNumber", maintenanceNumber);
            // var index = layer.open({
            //     title: "维保管理 > 保养管理 > 续保",
            //     type: 2,
            //     content: tabBaseURL + 'modules/maintenance/maintenancemanagerenewal.html',
            //     end: function () {
            //         layer.close(index);
            //         window.localStorage.setItem("maintenanceId", null);
            //         window.localStorage.setItem("maintenanceNumber", null);
            //         // vm.reload();
            //     }
            // });
            // layer.full(index);

            let param ={
                carId:carId
            };
            let url=tabBaseURL+'modules/maintenance/maintenancemanageadd.html';
            let title='车辆保养';
            addTab(url,title,param);
        },

        //查看方法
        view: function (maintenanceId, maintenanceNumber, carNo, carId, kilometreWarning) {
            window.localStorage.setItem("maintenanceId", maintenanceId);
            window.localStorage.setItem("maintenanceNumber", maintenanceNumber);
            window.localStorage.setItem("carNo", carNo);
            window.localStorage.setItem("carId", carId);
            window.localStorage.setItem("kilometreWarning", kilometreWarning);
            var index = layer.open({
                title: "维保管理 > 保养管理 > 查看保养单",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/maintenancemanagedetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("maintenanceId", null);
                    window.localStorage.setItem("maintenanceNumber", null);
                    window.localStorage.setItem("carNo", null);
                    window.localStorage.setItem("carId", null);
                    // vm.reload();
                }
            });
            layer.full(index);
        },

        update: function (maintenanceId, maintenanceNumber) {
            window.localStorage.setItem("maintenanceId", maintenanceId);
            window.localStorage.setItem("maintenanceNumber", maintenanceNumber);
            var index = layer.open({
                title: "维保管理 > 保养管理 > 编辑保养单",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/maintenancemanageedit.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("maintenanceId", null);
                    window.localStorage.setItem("maintenanceNumber", null);
                    // vm.reload();
                }
            });
            layer.full(index);
        },


        del: function (maintenanceIds) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "financial/maintenancemanage/delete",
                    contentType: "application/json",
                    data: JSON.stringify(maintenanceIds),
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
            var url = vm.maintenanceManage.maintenanceId == null ? "financial/maintenancemanage/save" : "financial/maintenancemanage/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.maintenanceManage),
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
            var url = baseURL + 'maintenance/maintenancemanage/export?a=a';

            if (vm.q.carPlateNo != null && vm.q.carPlateNo != "") {
                url += '&carPlateNo=' + vm.q.carPlateNo;
            }

            if (vm.q.serviceSite != null && vm.q.serviceSite != "") {
                url += '&serviceSite=' + vm.q.serviceSite;
            }
            if (vm.q.searchMaintenanceDate != null && vm.q.searchMaintenanceDate != "") {
                url += '&searchMaintenanceDate=' + vm.q.searchMaintenanceDate;
            }
            if (vm.q.searchNextMaintenanceDate != null && vm.q.searchNextMaintenanceDate != "") {
                url += '&searchNextMaintenanceDate=' + vm.q.searchNextMaintenanceDate;
            }
            if (vm.q.belongCity != null && vm.q.belongCity != "") {
                url += '&belongCity=' + vm.q.belongCity;
            }
            if (vm.q.carApplication != null && vm.q.carApplication != "") {
                url += '&carApplication=' + vm.q.carApplication;
            }
            if (vm.q.orderNo != null && vm.q.orderNo != "") {
                url += '&orderNo=' + vm.q.orderNo;
            }
            if (vm.q.carStatus != null && vm.q.carStatus != "") {
                url += '&carStatus=' + vm.q.carStatus;
            }
            if (vm.q.maintenanceNumber != null && vm.q.maintenanceNumber != "") {
                url += '&maintenanceNumber=' + vm.q.maintenanceNumber;
            }
            if (vm.q.customer != null && vm.q.customer != "") {
                url += '&customer=' + vm.q.customer;
            }
            if (vm.q.brandId != null && vm.q.brandId != "") {
                url += '&brandId=' + vm.q.brandId;
            }
            if (vm.q.modelId != null && vm.q.modelId != "") {
                url += '&modelId=' + vm.q.modelId;
            }
            if (vm.q.seriesId != null && vm.q.seriesId != "") {
                url += '&seriesId=' + vm.q.seriesId;
            }
            if (vm.q.belongFactory != null && vm.q.belongFactory != "") {
                url += '&belongFactory=' + vm.q.belongFactory;
            }
            if (vm.q.carDepotId != null) {
                url += '&carDepotId=' + vm.q.carDepotId;
            }
            if (vm.q.maintenanceStatus != null && vm.q.maintenanceStatus != "") {
                url += '&maintenanceStatus=' + vm.q.maintenanceStatus;
            }
            if (vm.q.currentMaintenanceType != null && vm.q.currentMaintenanceType != "") {
                url += '&currentMaintenanceType=' + vm.q.currentMaintenanceType;
            }
            if (vm.q.nextMaintenanceType != null && vm.q.nextMaintenanceType != "") {
                url += '&nextMaintenanceType=' + vm.q.nextMaintenanceType;
            }
            if (vm.q.carOwner != null && vm.q.carOwner != "") {
                url += '&carOwner=' + vm.q.carOwner;
            }
            if (vm.q.dayWarningSort != null && vm.q.dayWarningSort != "") {
                url += '&dayWarningSort=' + vm.q.dayWarningSort;
            }
            if (vm.q.allDataScopeFlag != null && vm.q.allDataScopeFlag != "") {
                url += '&allDataScopeFlag=' + vm.q.allDataScopeFlag;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carPlateNo: vm.q.carPlateNo,
                    serviceSite: vm.q.serviceSite,
                    searchMaintenanceDate: vm.q.searchMaintenanceDate,
                    searchNextMaintenanceDate: vm.q.searchNextMaintenanceDate,
                    belongCity: vm.q.belongCity,
                    carApplication: vm.q.carApplication,
                    carStatus: vm.q.carStatus,
                    orderNo: vm.q.orderNo,
                    maintenanceNumber: vm.q.maintenanceNumber,
                    customer: vm.q.customer,
                    carBrandModelName: vm.q.carBrandModelName,
                    belongFactory: vm.q.belongFactory,
                    carDepotId: vm.q.carDepotId,
                    carDepotName: vm.q.carDepotName,
                    brandId: vm.q.brandId,
                    modelId: vm.q.modelId,
                    seriesId: vm.q.seriesId,
                    maintenanceStatus: vm.q.maintenanceStatus,
                    currentMaintenanceType: vm.q.currentMaintenanceType,
                    nextMaintenanceType: vm.q.nextMaintenanceType,
                    carOwner: vm.q.carOwner,
                    dayWarningSort: vm.q.dayWarningSort,
                    allDataScopeFlag: vm.q.allDataScopeFlag,
                }
            });
        },
        // 高级筛选
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        }

    }
});

function init(layui) {
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $('div[type="currentMaintenanceDate"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="currentMaintenanceDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        //Vue.set(vm.q, "repairStarDateStr", '');
        vm.q.currentMaintenanceType = value;
        //getRepairStartDate(value, null);
    });

    $('div[type="nextMaintenanceDate"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="nextMaintenanceDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        //Vue.set(vm.q, "repairEndDateStr", '');
        vm.q.nextMaintenanceType = value;
        //getRepairEndDate(value);
    });
}

function initDate(laydate) {
    laydate.render({
        elem: '#searchMaintenanceDate',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="currentMaintenanceDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.searchMaintenanceDate = value;
        }
    });

    laydate.render({
        elem: '#searchNextMaintenanceDate',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="nextMaintenanceDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.searchNextMaintenanceDate = value;
        }
    });
}

function initData() {

}

function hrefCarView(carId) {
    var index = layer.open({
        title: "车辆详情",
        type: 2,
        content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
        success: function (layero, num) {
            var iframe = window['layui-layer-iframe' + num];
            iframe.vm.initEditData(carId);
        },
        end: function () {
            vm.showForm = false;
            layer.closeAll();
        }
    });
    vm.showForm = true;
    layer.full(index);
}