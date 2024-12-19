$(function () {
    var type = window.localStorage.getItem("type4");
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
            url: baseURL + 'maintenancewarn/list',
            cols: [[
                {
                    templet: "#checkbd",
                    title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                    width: 60,
                    align:"center",
                    fixed:'left'
                },
                {title: '操作', width: 120,maxWidth:120, templet: '#barTpl', fixed: "left", align: "center"},
                {field: 'carNo', align: "center", fixed:'left',title: '车牌号',fixed: "left", templet: function (d) {return isEmpty(d.carNo);}},
                {field: 'maintenanceStatus', align: "center", title: '保养状态', templet: function (d) {
                    if(d.maintenanceStatus == 0){
                        return "<span style='color: red'>待保养</span>";
                    }else if(d.maintenanceStatus == 1){
                        return "已保养";
                    }else{
                        return "<span style='color: red'>未保养</span>";
                    }
                }},
                {field: 'currentMile', align: "center", title: '当前公里数', templet: function (d) {return isEmpty(d.currentMile);}},
                {field: 'nextMile', align: "center", title: '下次保养公里数', templet: function (d) {return isEmpty(d.nextMile);}},
                {field: 'nextDate', align: "center", title: '下次保养时间', templet: function (d) {return isEmpty(d.nextDate);}},
                {align: "center", title: '提醒', templet: function (d) {
                    if(d.remindMile != null ){
                        if(d.remindDate < 0 ){
                            if((d.remindDate * -1) <= d.fixedDay ){
                                return "<span style='color: red'>"+d.remindMile+"</span>"+
                                    "<span style='color: green'>,剩余"+(d.remindDate * -1)+"天</span>";
                            }else{
                                return "<span style='color: red'>"+d.remindMile+"</span>";
                            }
                        }else if(d.remindDate > 0){
                            return "<span style='color: red'>"+d.remindMile+",已逾期"+d.remindDate+"天</span>";
                        } else if(d.remindDate == 0){
                            // 计算小时
                            //console.log(d.nextDate +" 23:59:59");
                            var time = new Date().format("hh");
                            console.log(time);
                            var hour = 24-Number(time);
                            return "<span style='color: green'>剩余"+ Math.round(hour)+"小时</span>";
                        }
                    }else{
                        if(d.remindDate < 0 && (d.remindDate * -1) <= d.fixedDay){
                            return "<span style='color: green'>剩余"+(d.remindDate * -1)+"天</span>";
                        }else if(d.remindDate > 0){
                            return "<span style='color: red'>已逾期"+d.remindDate+"天</span>";
                        } else if(d.remindDate == 0){
                            console.log(d.nextDate +" 23:59:59");
                            var time = new Date().format("yyyy-MM-dd hh:mm:ss");
                            console.log(new Date());
                            var hour = getHour(time,d.nextDate +" 23:59:59");
                            return "<span style='color: green'>剩余"+Math.round(hour)+"小时</span>";
                        }
                    }
                    return isEmpty(null);
                }},
                {field: 'carStatus', align: "center", title: '车辆状态', templet: function (d) {
                    if(d.carStatus == 1){
                        return "整备中";
                    }else if(d.carStatus == 2){
                        return "备发车";
                    }else if(d.carStatus == 3){
                        return "预定中";
                    }else if(d.carStatus == 4){
                        return "用车中";
                    }else if(d.carStatus == 5){
                        return "已过户";
                    }else{
                        return isEmpty(d.carStatus);
                    }
                }},
                {field:'rentType', minWidth:150, title: '订单类型',align:"center",templet: function (d){
                    return getRentTypeStr(d.rentType);
                }},
                {field: 'vinNo', align: "center", title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                { align: "center", title: '品牌/车型',templet:function (d) {return isEmpty(d.brandName) + "/" + isEmpty(d.modelName);}},
                {field: 'company', align: "center", title: '所属公司', templet: function (d) {return isEmpty(d.company);}},
                {field: 'belongCity', align: "center", title: '所在仓库', templet: function (d) {return isEmpty(d.belongCity);}},
                { align: "carOwner", title: '车辆所有人',templet:function (d) {return isEmpty(d.carOwner);}},
            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
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

    layui.form.on('submit(startOrstopReasonSave)', function () {
        vm.startOrstopReasonSave(vm.supplier);
        return false;
    });
    selectBrandAndModel();
    selectTotal();
    /**
     * 筛选监听
     */
    layui.use('form',function () {
        var form = layui.form;
        //所属公司下拉选
        form.on('select(company)',function (data) {
            vm.q.company = data.value;
        })
        form.on('select(carStatus)',function (data) {
            vm.q.carStatus = data.value;
        })
        //品牌车型下拉选
        form.on('select(brandModel)',function(data){
            vm.q.brandModel = data.value;
        })

        form.render();
    })

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'detail') {
            vm.detail(data.id,data.carId);
        } else if(layEvent === 'renewal'){
            vm.renewal(data);//续保
        } else if(layEvent === 'notice'){
            vm.notice(data);// 保养预警通知
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
        url: baseURL + "maintenancewarn/total",
        contentType: "application/json",
        success: function(res){
            vm.total = res.data;
        },
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
            carNo: null,
            company: null,
            carStatus: null,
            customerName: null,
            carOrderNo:null,
          //brandModel:null,
            sqlType:null,
            carBrandId:null,
            carSeriesId:null,
            carModelId:null,
            depotId:null,
            depotName:null,
            carOwner:null,

        },
        total:{},
        warehouseData:{},
        isFilter:false,
        dateConfig1:30,
        dateConfig2:60,
        dateConfig3:90,
        ids:[]
    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
        var _this = this;
        // $.ajax({
        //     type: "GET",
        //     url: baseURL + "sys/config/getparam/remind_maintain_mileage",
        //     async: false,
        //     success: function(r){
        //         if (r.config != null){
        //             _this.dateConfig = r.config['paramValue']^0;
        //         }
        //     }
        // });
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=保养提醒&tabOrder=2",
            async: false,
            success: function(r){
                if (r.config != null){
                    _this.dateConfig1 = r.config.tabValue;
                }
            }
        });
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=保养提醒&tabOrder=3",
            async: false,
            success: function(r){
                if (r.config != null){
                    _this.dateConfig2 = r.config.tabValue;
                }
            }
        });
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=保养提醒&tabOrder=4",
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
            vm.q.carNo = null;
            vm.q.company = null;
            vm.q.carStatus = null;
            vm.q.customerName = null;
            vm.q.carOrderNo = null;
       //   vm.q.brandModel = null;
            vm.q.carBrandId = null;
            vm.q.carSeriesId = null;
            vm.q.carModelId = null;
            vm.q.depotId = null;
            vm.q.depotName = null;
            vm.q.carOwner = null;
            $("#carBrandSeriesModel").val("");
        },
        detail:function (id,carId) {
            window.localStorage.setItem("id", id);
            window.localStorage.setItem("carId",carId);
            var index = layer.open({
                type: 2,
                content: tabBaseURL+'modules/warn/maintenancewarnDetail.html',
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        //续保方法
        renewal:function(data){
            window.localStorage.setItem("maintenanceId",data.id);
            window.localStorage.setItem("maintenanceNumber",data.maintenanceNumber);
            window.localStorage.setItem("carId",data.carId);
            // var index = layer.open({
            //     title: "风控预警 > 车辆保养预警 > 续保",
            //     type: 2,
            //     content: tabBaseURL+'modules/warn/carmaintenancewarnrenewal.html',
            //     end: function(){
            //         layer.close(index);
            //         window.localStorage.setItem("maintenanceId",null);
            //         window.localStorage.setItem("maintenanceNumber",null);
            //         window.localStorage.setItem("carId",null);
            //         // vm.reload();
            //     }
            // });
            // layer.full(index);
            let param ={
                carId:data.carId
            };
            let url=tabBaseURL+'modules/maintenance/maintenancemanageadd.html';
            let title='新建保养单';
            addTab(url,title,param);
        },

        // 消息通知
        notice:function(data){
            window.localStorage.setItem("carId",data.carId);
            window.localStorage.setItem("type","2");// 保养消息通知操作
            var index = layer.open({
                title: "保养预警通知",
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
                alert("未选择需要通知的保养预警数据！");
                return ;
            }

            var carIds = [];
            $.each(vm.ids, function(index, item) {
                carIds.push(item);
            });

            console.log(carIds);
            window.localStorage.setItem("carIds", carIds);
            window.localStorage.setItem("type", "2");
            var index = layer.open({
                title: "保养预警通知",
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
          }else if(type ==5){
              $("#field5").addClass("flex active");
              vm.q.sqlType =5;
          }
          vm.reload();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo: vm.q.carNo,
                    company: vm.q.company,
                    carStatus: vm.q.carStatus,
                    customerName: vm.q.customerName,
                    carOrderNo:vm.q.carOrderNo,
                    sqlType:vm.q.sqlType,
               //   brandModel:vm.q.brandModel,
                    carBrandId:vm.q.carBrandId ,
                    carSeriesId:vm.q.carSeriesId,
                    carModelId:vm.q.carModelId ,
                    depotId:vm.q.depotId ,
                    carOwner:vm.q.carOwner
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
            Vue.set(vm.q,"deptId",treeNode.deptId);
            Vue.set(vm.q,"company",treeNode.name);
            layer.closeAll();
        },
        exports:function(){
            var url = baseURL + 'maintenancewarn/export?a=a';
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
            }
            if(vm.q.company != null){
                url += '&company='+vm.q.company;
            }
            if(vm.q.carStatus != null){
                url += '&carStatus='+vm.q.carStatus;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.carOrderNo != null){
                url += '&carOrderNo='+vm.q.carOrderNo;
            }
            if(vm.q.depotId != null){
                url += '&depotId='+vm.q.depotId;
            }
            if(vm.q.carOwner != null){
                url += '&carOwner='+vm.q.carOwner;
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
            // sqlType:vm.q.sqlType,
            if(vm.q.sqlType != null){
                url += '&sqlType='+vm.q.sqlType;
            }
            window.location.href = url;
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
        vm.q.carNo = null;
        vm.q.company = null;
        vm.q.carStatus= null;
        vm.q.customerName= null;
        vm.q.carOrderNo=null;
  //    vm.q.brandModel=null;
        vm.q.carBrandId = null;
        vm.q.carSeriesId = null;
        vm.q.carModelId = null;
        $("#carBrandSeriesModel").val("");
}

function getHour(s1,s2) {
    s1 = new Date(s1.replace(/-/g, '/'));
    s2 = new Date(s2.replace(/-/g, '/'));
    var ms = Math.abs(s1.getTime() - s2.getTime());
    return ms / 1000 / 60 / 60;
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

