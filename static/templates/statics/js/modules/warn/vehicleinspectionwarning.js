$(function () {
    var type = window.localStorage.getItem("type3");
    if(type != "" && type != null){
        vm.changeStatus(type);
    } else {
        vm.changeStatus(5);
    }
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
            url: baseURL + 'vehicleInspectionwarning/list',
            cols: [[
                {
                    templet: "#checkbd",
                    title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                    width: 60,
                    align:"center",
                    fixed:'left'
                },
                {title: '操作', width: 150,minWidth:150, templet: '#barTpl', fixed: "left", align: "center"},
                {field: 'carPlateNo', align: "center", fixed:'left' ,fixed: "left", title: '车牌号', templet: function (d) {return isEmpty(d.carPlateNo);}},
                {field: 'vinNo', align: "center", title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                {field: 'inspectionStatus', align: "center", title: '年检状态', templet: function (d) {
                        if(d.inspectionStatus == 0){
                            return "<span style='color: red'>待年检</span>";
                        }else if(d.inspectionStatus == 1){
                            return "已年检";
                        }else{
                            return "<span style='color: red'>未年检</span>";
                        }
                    }},
                {field: 'thisTimeInspectionTime', align: "center", title: '上次年检时间', templet: function (d) {return isEmpty(d.thisTimeInspectionTime);}},
                {field: 'nextInspectionTime', align: "center", title: '年检到期时间', templet: function (d) {return isEmpty(d.nextInspectionTime);}},
                { align: "center", title: '年检天数', templet: function (d) {
                        var day = "";
                        if(d.inspectoinDay == null ){
                            return "未年检";
                        }else if (isNotEmpty(d.nextInspectionTime)) {
                            if(d.inspectoinDay == 0){
                                var hours = new Date().getHours();
                                day = "剩余" + (24 - hours) + "小时";
                            }else if (0 <= (d.inspectoinDay + d.fixed) && (d.inspectoinDay + d.fixed) <= d.fixed) {
                                var res = d.inspectoinDay.toString();
                                day = "剩余" + (res * -1) + "天";
                            } else if (0 < d.inspectoinDay) {
                                day = "超过" + d.inspectoinDay + "天";
                            } else {
                                day = "剩余" + Math.abs(d.inspectoinDay) + "天";
                            }
                        }
                        if (d.inspectionStatus == 0) {
                            if(0 <= (d.inspectoinDay + d.fixed) && (d.inspectoinDay + d.fixed) <= d.fixed){
                                return "<span style='color:green;'>有效/" + day + "</span>";
                            }else if(0 < d.inspectoinDay){
                                return "<span style='color:red;'>失效/" + day + "</span>";
                            } else {
                                return "<span style='color:green;'>有效/" + day + "</span>";
                            }
                        }else{
                            return "已年检";
                        }
                    }},
                {field: 'carStatus', align: "center", title: '车辆状态', templet: function (d) {
                        if (d.carStatus == 1) {
                            return "整备中";
                        } else if (d.carStatus == 2) {
                            return "备发车";
                        } else if (d.carStatus == 3) {
                            return "预定中";
                        } else if (d.carStatus == 4) {
                            return "用车中";
                        }else {
                            return isEmpty(d.carStatus);
                        }
                    }},
                {field:'rentType', minWidth:150, title: '订单类型',align:"center",templet: function (d){
                        return getRentTypeStr(d.rentType);
                    }},
                {field:'carBrandModelName', align: "center", title: '品牌/车系/车型', templet: function (d) {return isEmpty(d.carBrandModelName);}},
                {field: 'carBelongCompany', align: "center", title: '车辆归属', templet: function (d) {return isEmpty(d.carBelongCompany);}},
                {field: 'depotName', align: "center", title: '所在仓库', templet: function (d) {return isEmpty(d.depotName);}},
                {field: 'carOwner', align: "center", title: '车辆所有人', templet: function (d) {return isEmpty(d.carOwner);}},
            ]],
            page: true,
            loading: true,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            },
            parseData: function(res){
                res.data.forEach(function (d) {
                    d.LAY_CHECKED = false;
                    if ($.inArray(d.carId, vm.ids) >= 0) {
                        d.LAY_CHECKED = true;
                    }
                });

                receivablesDatas = res.data;
                checkAllStatusChange();
                return res;
            },
        });
    });
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        init(layui);
        form.render();
    });
    layui.form.on('submit(startOrstopReasonSave)', function () {
        vm.startOrstopReasonSave(vm.supplier);
        return false;
    });
    selectBrandAndModel();
    getDept();
    selectTotal();
    /**
     * 筛选监听
     */
    layui.use('form',function () {
        var form = layui.form;
        //所属公司下拉选
        form.on('select(company)',function (data) {
            vm.q.companyId = data.value;
        })

        //品牌车型下拉选
        form.on('select(brandModel)',function(data){
            vm.q.carBrandModelName = data.value;
        })
        //车辆状态
        form.on('select(carStatusSelect)',function(data){
            vm.q.carStatus = data.value;
        })

        //年检逾期类型
        form.on('select(inspectionOverdueType)',function(data){
            vm.q.inspectionOverdueType = data.value;
        })
        //待年检时间
        form.on('select(waitingInspectionType)',function(data){
            vm.q.waitingInspectionType = data.value;
        })

        form.render();
    })


    /**
     * 表单监听
     */
    layui.use(['form', 'laydate', 'upload'], function () {

        var form = layui.form;
        var laydate = layui.laydate;
        var upload = layui.upload;

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
        //年检附件
        uploadAttachment(upload);
        form.render();
    });

    //保存
    layui.form.on('submit(submitEditData)', function () {
        vm.saveOrUpdate();
        return false;
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'detail') {
            vm.detail(data);
        } else if(layEvent === 'continue'){
            vm.continue(data.inspectionId,data.carId, true);
        } else if(layEvent === 'notice'){
            vm.notice(data);
        }
    });

    layui.form.on('checkbox(siam_all)', function(){
        var checked = $(this)[0].checked;
        if (receivablesDatas != null && receivablesDatas.length > 0){
            receivablesDatas.forEach(function (d) {
                ysCheckedChange(d, d.carId, checked);
            });
        }
        var status = $(this).prop("checked");
        $.each($("input[name=siam_one]"), function (i, value) {
            if (!value.disabled)
                $(this).prop("checked", status);
        });
        layui.form.render();
    });

    layui.form.on('checkbox(siam_one)', function(){
        var checked = $(this)[0].checked;
        var id = $(this).attr("data-id");
        var obj = receivablesDatas.filter(function (d) {
            return d.carId == id;
        })[0];
        ysCheckedChange(obj, id, checked);
        layui.form.render();
    });

});

/**
 * 统计
 */
function selectTotal(){
    $.ajax({
        type: "GET",
        url: baseURL + "vehicleInspectionwarning/total",
        contentType: "application/json",
        success: function(res){
            vm.total = res.total;
        },
    });
}

/**
 * 查询所属部门
 */
function getDept(){
    $.ajax({
        type: "GET",
        url: baseURL + "maintenance/inspectionmanage/getDept",
        contentType: "application/json",
        success: function(res){
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#company').append(new Option(item.name, item.deptId));
            });
            layui.form.render("select");
        }
    });
}

/**
 * 查询品牌/车型
 */
function selectBrandAndModel (){
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectBrandAndModel",
        contentType: "application/json",
        success: function(res){
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#brandModel').append(new Option(item.brandAndModel, item.brandAndModel));
            });
            layui.form.render("select");
        }
    });
}

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carPlateNo: null,
            deptId: null,
            deptName: null,
            carStatus: null,
            carOrderNo: null,
            customerName: null,
            carBrandModelName:null,
            sqlType:null,
            cityName:null,
            depotId:null,
            depotName:null,
            carBrandId :null,
            carSeriesId :null,
            carModelId :null,
            nextInspectionTimeStr :null,
            nextInspectionTimeType :null,
            carOwner :null,
            inspectionOverdueType :null,
            waitingInspectionType :null,
        },
        total:{},
        warehouseData:{},
        carNoDiv: false,
        vehicleInfo: null,
        carNoAndVinNoDiv: true,
        inspectionManage: {
            carOrderDto:{}
        },
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        flag: false,
        showForm:false,
        isFilter:false,
        dateConfig1:30,
        dateConfig2:15,
        dateConfig3:90,
        ids:[],

    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
        var _this = this;
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=年检提醒&tabOrder=2",
            async: false,
            success: function(r){
                if (r.config != null){
                    _this.dateConfig1 = r.config.tabValue;
                }
            }
        });
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=年检提醒&tabOrder=3",
            async: false,
            success: function(r){
                if (r.config != null){
                    _this.dateConfig2 = r.config.tabValue;
                }
            }
        });
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=年检提醒&tabOrder=4",
            async: false,
            success: function(r){
                if (r.config != null){
                    _this.dateConfig3 = r.config.tabValue;
                }
            }
        });




        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.allCarModels,
                    success: function (valData,labelData) {
                        vm.q.carBrandId = valData[0];
                        vm.q.carSeriesId = valData[1];
                        vm.q.carModelId = valData[2];
                    }
                });
            });
        });
    },
    methods: {
        chooseWarehouse:function(){
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function(){
                    vm.q = Object.assign({}, vm.q,{
                        depotId:vm.warehouseData.warehouseId,
                        depotName:vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },
        reset: function () {
            vm.q.carPlateNo = null;
            vm.q.deptId = null;
            vm.q.deptName = null;
            vm.q.carStatus = null;
            vm.q.carOrderNo = null;
            vm.q.customerName = null;
            vm.q.carBrandModelName = null;
            vm.q.cityName = null;
            vm.q.depotId = null;
            vm.q.depotName = null;
            vm.q.carBrandId = null;
            vm.q.carSeriesId =null;
            vm.q.carModelId = null;
            vm.q.nextInspectionTimeType = null;
            vm.q.nextInspectionTimeStr = null;
            vm.q.carOwner = null;
            vm.q.inspectionOverdueType = null;
            vm.q.waitingInspectionType = null;
            $("#carBrandSeriesModel").val("");
            $('div[type="nextInspectionTimeType"]>div').removeClass('task-content-box-tab-child-active');

        },
        detail:function (data) {
            window.localStorage.setItem("carId",data.carId);
            var index = layer.open({
                type: 2,
                content: tabBaseURL+'modules/warn/vehicleinspectionwarningDetail.html',
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
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
            Vue.set(vm.q,"deptId",treeNode.deptId);
            Vue.set(vm.q,"deptName",treeNode.name);
            layer.closeAll();
        },
        //续检方法
        continue:function(inspectionId, carId, flag){
            vm.carNoAndVinNoDiv = false;
            vm.carNoDiv = true;
            $.ajaxSettings.async = false;
            if (inspectionId) {
                $.get(baseURL + "maintenance/inspectionmanage/info/" + inspectionId, function (r) {
                    vm.inspectionManage = r.data;
                    vm.deliveryFileLst = vm.inspectionManage.attachment;
                });
            } else {
                vm.inspectionManage = {};
            }
            vm.inspectionManage.maintenanceId = inspectionId;
            vm.inspectionManage.carId = carId;
            $.ajax({
                type: "POST",
                url: baseURL + "vehicleInspectionwarning/vehicleInspectionWarningInfo",
                contentType: "application/json",
                data: JSON.stringify(vm.inspectionManage),
                success: function(r){
                    if(r.code === 0){
                        vm.inspectionManage = r.inspectionManage;
                        if (vm.inspectionManage.carOrderDto == null){
                            vm.inspectionManage.carOrderDto = {};
                        }

                        vm.deliveryFileLst = vm.inspectionManage.attachment;
                    }else{
                        alert(r.msg);
                    }
                }
            });
            $.ajaxSettings.async = true;
            vm.flag = flag;
            // var index = layer.open({
            //     title: "修改",
            //     type: 1,
            //     content: $("#editForm"),
            //     end: function () {
            //         vm.showForm = false;
            //         layer.closeAll();
            //     }
            // });
            // vm.showForm = true;
            // layer.full(index);

            let param ={
                carId:carId
            };
            let url=tabBaseURL+'modules/maintenance/inspectionmanageadd.html';
            let title='新建年检';
            addTab(url,title,param);
        },

        // 消息通知
        notice:function(data){
            window.localStorage.setItem("carId",data.carId);
            window.localStorage.setItem("type","6");// 年检消息通知操作
            var index = layer.open({
                title: "年检预警通知",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL+'modules/maintenance/messageNotice.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("carId",null);
                }
            });
        },

        // 批量消息通知
        batchNotice:function (){
            if(vm.ids.length == 0){
                alert("未选择需要通知的年检预警数据！");
                return ;
            }

            var carIds = [];
            $.each(vm.ids, function(index, item) {
                carIds.push(item);
            });

            console.log(carIds);
            window.localStorage.setItem("carIds", carIds);
            window.localStorage.setItem("type", "6");
            var index = layer.open({
                title: "年检预警通知",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL+'modules/maintenance/messageBatchNotice.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("carIds",null);
                    window.localStorage.setItem("type", null);
                }
            });
        },

        // 删除附件
        delDeliveryFile: function (id) {
            for(var i = 0 ;i<vm.deliveryFileLst.length;i++) {
                if(vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        // 保存续检数据
        saveOrUpdate: function (event) {
            vm.inspectionManage.deliveryFileLst = vm.deliveryFileLst;
            var url = vm.inspectionManage.id == null ? "maintenance/inspectionmanage/save" : "maintenance/inspectionmanage/update";
            vm.inspectionManage.flag = vm.flag;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.inspectionManage),
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

        //选择车牌号
        // selectCarNo: function () {
        //     var index = layer.open({
        //         title: "选择车辆",
        //         type: 2,
        //         content: tabBaseURL + "modules/common/selectcar.html",
        //         end: function () {
        //             var carId = vm.carInforData.carId;
        //             if (carId != null && carId != '' && carId != undefined) {
        //                 vm.getCarBasicInforByCarNo(carId);
        //             }
        //         }
        //     });
        //     layer.full(index);
        //
        // },
        //选择车架号
        // selectVinNo: function () {
        //     var index = layer.open({
        //         title: "选择车辆",
        //         type: 2,
        //         content: tabBaseURL + "modules/common/selectcar.html",
        //         end: function () {
        //             var vinNo = vm.carInforData.vinNo;
        //             if (vinNo != null && vinNo != '' && vinNo != undefined) {
        //                 vm.getCarBasicInforByVinNo(vinNo);
        //             }
        //         }
        //     });
        //     layer.full(index);
        //
        // },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo:function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/"+carId,
                contentType: "application/json",
                data: {},
                success: function(r){
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
                url: baseURL + "car/tcarbasic/getCarBasicInforByVinNo/"+vinNo,
                contentType: "application/json",
                data: {},
                success: function(r){
                    if(r.baseInfor!=null){
                        console.log(r.baseInfor);
                        vm.vehicleInfo = r.baseInfor;
                        vm.inspectionManage.vehicleOrderNo = r.baseInfor.carOrderNo;
                        vm.inspectionManage.carId = r.baseInfor.carId;
                        addVehicleInfo(vm.vehicleInfo);
                        layui.form.render("select");
                    }else {
                        alert("该车架号暂无车辆信息!");
                        return;
                    }
                }
            });
        },

        cancel: function () {
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        changeStatus:function (type) {
            removeClass();
            cleanQuery();
            if(type == 1){
                $("#field1").addClass("flex active");
                vm.q.sqlType = 1;
            }else if(type == 2){
                $("#field2").addClass("flex active");
                vm.q.sqlType = 2;
            }else if(type == 3){
                $("#field3").addClass("flex active");
                vm.q.sqlType = 3;
            }else if(type == 4){
                $("#field4").addClass("flex active");
                vm.q.sqlType = 4;
            }else if(type == 5){
                $("#field5").addClass("flex active");
                vm.q.sqlType = 5;
            }
            vm.reload();
        },
        exports:function(){



            var url = baseURL + 'vehicleInspectionwarning/export?a=a';
            if(vm.q.carPlateNo != null){
                url += '&carPlateNo='+vm.q.carPlateNo;
            }
            if(vm.q.deptId != null){
                url += '&deptId='+vm.q.deptId;
            }
            if(vm.q.carStatus != null){
                url += '&carStatus='+vm.q.carStatus;
            }

            if(vm.q.carOrderNo != null){
                url += '&carOrderNo='+vm.q.carOrderNo;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.carBrandModelName != null){
                url += '&carBrandModelName='+vm.q.carBrandModelName;
            }
            if(vm.q.sqlType != null){
                url += '&sqlType='+vm.q.sqlType;
            }
            if(vm.q.cityName != null){
                url += '&cityName='+vm.q.cityName;
            }
            if(vm.q.depotId != null){
                url += '&depotId='+vm.q.depotId;
            }
            if(vm.q.carBrandId != null){
                url += '&carBrandId='+vm.q.carBrandId;
            }
            if(vm.q.carSeriesId != null){
                url += '&carSeriesId='+vm.q.carSeriesId;
            }
            if(vm.q.carModelId != null){
                url += '&carModelId='+vm.q.carModelId;
            }
            if(vm.q.nextInspectionTimeStr != null){
                url += '&nextInspectionTimeStr='+vm.q.nextInspectionTimeStr;
            }
            if(vm.q.nextInspectionTimeType != null){
                url += '&nextInspectionTimeType='+vm.q.nextInspectionTimeType;
            }
            if(vm.q.carOwner != null){
                url += '&carOwner='+vm.q.carOwner;
            }
            if(vm.q.inspectionOverdueType != null){
                url += '&inspectionOverdueType='+vm.q.inspectionOverdueType;
            }
            if(vm.q.waitingInspectionType != null){
                url += '&waitingInspectionType='+vm.q.waitingInspectionType;
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
                    deptId: vm.q.deptId,
                    carStatus: vm.q.carStatus,
                    carOrderNo: vm.q.carOrderNo,
                    customerName: vm.q.customerName,
                    sqlType:vm.q.sqlType,
                    cityName:vm.q.cityName,
                    depotId:vm.q.depotId,
                    carBrandId :vm.q.carBrandId,
                    carSeriesId :vm.q.carSeriesId,
                    carModelId :vm.q.carModelId,
                    nextInspectionTimeStr:vm.q.nextInspectionTimeStr,
                    nextInspectionTimeType:vm.q.nextInspectionTimeType,
                    carOwner:vm.q.carOwner,
                    inspectionOverdueType:vm.q.inspectionOverdueType,
                    waitingInspectionType:vm.q.waitingInspectionType,
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }
    }
});

function removeClass(){
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
    $("#field3").removeClass("active");
    $("#field4").removeClass("active");
    $("#field5").removeClass("active");
}

function cleanQuery() {
    /*vm.q.carPlateNo = null;
    vm.q.companyId = null;
    vm.q.carStatus= null;
    vm.q.carOrderNo= null;
    vm.q.customerName= null;
    vm.q.carBrandModelName=null;
    vm.q.cityName=null;
    vm.q.depotId=null;
    vm.q.depotName=null;*/
    vm.q.carPlateNo = null;
    vm.q.deptId = null;
    vm.q.deptName = null;
    vm.q.carStatus = null;
    vm.q.carOrderNo = null;
    vm.q.customerName = null;
    vm.q.carBrandModelName = null;
    vm.q.cityName = null;
    vm.q.depotId = null;
    vm.q.depotName = null;
    vm.q.carBrandId = null;
    vm.q.carSeriesId =null;
    vm.q.carModelId = null;
    vm.q.nextInspectionTimeType = null;
    $("#carBrandSeriesModel").val("");
    $('div[type="nextInspectionTimeType"]>div').removeClass('task-content-box-tab-child-active');
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
    vm.inspectionManage.carPurpose = item.rentType;
    vm.inspectionManage.carId= item.carId;
}


/**
 * 上传附件
 */
function uploadAttachment(upload){
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path':'inspection'},
        field:'files',
        auto:true,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar', //
        multiple: true,
        number:20,
        choose: function(obj){
            PageLoading();
            obj.preview(function(index, file, result){
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1:0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp={
                    id: deliveryFileIdTmp,
                    nameDesc:'年检附件',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };
                vm.deliveryFileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
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
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}


function init(layui) {
    initDate(layui.laydate);
    initEventListener(layui);
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}
function initDate(laydate) {
    //维修开始时间，自定义时间
    laydate.render({
        elem : '#nextInspectionTimeDate',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="nextInspectionTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.nextInspectionTimeStr=value;
            vm.q.nextInspectionTimeType=null;
        }
    });

}

function initClick() {
    $('div[type="nextInspectionTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="nextInspectionTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "nextInspectionTimeStr", '');
        vm.q.nextInspectionTimeType=value;
    });

}

function checkAllStatusChange() {
    var count =  receivablesDatas.length;
    receivablesDatas.forEach(function (d) {
        if ($.inArray(d.carId, vm.ids) >= 0){
            count--;
        }
    });
    $("input[name=siam_all]").prop("checked", count==0 && receivablesDatas.length != 0);
}

var receivablesDatas;
function ysCheckedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.ids.push(id);
        }

        vm.count = vm.ids.length;
    } else {
        if ($.inArray(id, vm.ids) >= 0) {
            for (var i = 0; i < vm.ids.length; i++) {
                if (vm.ids[i] == id) {
                    vm.ids.splice(i, 1);
                    i = i - 1;
                }
            }
            vm.count = vm.ids.length;
        }
    }
}

