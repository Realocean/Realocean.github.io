$(function () {
    var type = window.localStorage.getItem("type1");
    if(type != "" && type != null){
        vm.changeStatus(type);
    } else {
        vm.changeStatus(0);
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
            url: baseURL + 'vehiclerentwarn/list',
            cols: [[
                {
                    templet: "#checkbd",
                    title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                    width: 40,
                    align:"center",
                    rowspan:2,
                    fixed:'left'
                },
                {title: '操作', width: 80,minWidth:80, templet: '#barTpl', fixed: "left", align: "center",rowspan:2},
                {field: 'carNo', align: "center", title: '车牌号', fixed: "left",templet: function (d) {return isEmpty(d.carNo);}},
                {field: 'uncollectedAmount', align: "center", title: '欠款总金额', templet: function (d) {return isEmpty(d.uncollectedAmount);}},
                {field: 'arrearsType', align: "center", title: '欠款类型', templet: function (d) {return isEmpty(d.arrearsType);}},
                {field: 'receivableAmount', align: "center", title: '应付总金额', templet: function (d) {return isEmpty(d.receivableAmount);}},
                {field: 'receivedAmount', align: "center", title: '已收款总金额', templet: function (d) {return isEmpty(d.receivedAmount);}},
                {
                    field: 'receivableDate', align: "center", title: '应收日期', templet: function (d) {
                        return isEmpty(d.receivableDateDesc || d.receivableDate);
                        // return isEmpty(d.receivableDate);
                    }
                },
                {field: 'overdueDate', align: "center", title: '逾期期限', templet: function (d) {return isEmpty(d.overdueDate );}},
                {field: 'overdueDay', align: "center", title: '逾期天数', templet: function (d) {
                    if(d.overdueDay >= 0 ){
                        return d.overdueDay;
                    }else{
                        return isEmpty(null);
                    }
                }},
                {field: 'customerName', align: "center", title: '客户名称', templet: function (d) {return isEmpty(d.customerName);}},
                {field: 'concatMobile', align: "center", title: '联系电话', templet: function (d) {return isEmpty(d.concatMobile);}},
                {field: 'lessorName', align: "center", title: '售卖方', templet: function (d) {return isEmpty(d.lessorName);}},
                {field: 'carOrderNo', align: "center", title: '车辆订单号', templet: function (d) {return isEmpty(d.carOrderNo);}},
                {field: 'contractNo', align: "center", title: '合同编号', templet: function (d) {return isEmpty(d.contractNo);}},
                {align: "leaseType", title: '车辆用途', templet: function (d) {
                    //1、经租 2、以租代购 3、展示车 4、试驾车 5、融租 6、直购
                        return getRentTypeStr(d.rentType);
                }},
                {field: 'monthRent', align: "center", title: '租金/元', templet: function (d) {return isEmpty(d.monthRent);}},
                {field: 'paymentMethod', align: "center", title: '租金付款方式', templet: function (d) {return getPaymentMethodStr(d.paymentMethod);}},
                {field: 'paymentDay', align: "center", title: '交租日期', templet: function (d) {return isEmpty(d.paymentDay);}},
                {field: 'leaseStartTime', align: "center", title: '租赁开始时间', templet: function (d) {return isEmpty(d.leaseStartTime);}},
                {field: 'leaseEndTime', align: "center", title: '租赁结束时间', templet: function (d) {return isEmpty(d.leaseEndTime);}},
                {field: 'businessTypeShow', align: "center", title: '车辆状态', templet: function (d) {return isEmpty(d.businessTypeShow);}},
                {field: 'vinNo', align: "center", title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                {field: 'brandSeriesModelName', align: "center", title: '品牌/车系/车型', templet: function (d) {return isEmpty(d.brandSeriesModelName);}},
                {field: 'deptName', align: "center", title: '车辆归属', templet: function (d) {return isEmpty(d.deptName);}},
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
            },
            parseData: function(res){
                 
                res.data.forEach(function (d) {
                    d.LAY_CHECKED = false;
                    if ($.inArray(d.carOrderNo, vm.ids) >= 0) {
                        d.LAY_CHECKED = true;
                    }
                });

                receivablesDatas = res.data;
                checkAllStatusChange();
                return res;
            },
        });
    });

    /**
     * 筛选监听
     */
    layui.use(['form','laydate', 'laydate'], function () {
        var form = layui.form;
        var laydate= layui.laydate;
        init(layui);
        form.render();
    })

    //租赁类型
    layui.form.on('select(leaseType)', function (data) {
            vm.q.leaseType = data.value;
    });
    //收款类型
    layui.form.on('select(collectionType)', function (data) {
        vm.q.collectionType = data.value;
    });


    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'detail') {
            vm.detail(data.carId,data.carOrderNo,data.leaseType);
        }else if(layEvent === 'notice'){
            vm.notice(data);
        }
    });

    layui.form.on('checkbox(siam_all)', function(){
        var checked = $(this)[0].checked;
        if (receivablesDatas != null && receivablesDatas.length > 0){
            receivablesDatas.forEach(function (d) {
                ysCheckedChange(d, d.carOrderNo, checked);
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
            return d.carOrderNo == id;
        })[0];
        ysCheckedChange(obj, id, checked);
        layui.form.render();
    });

});




var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carNo: null,
            leaseId: null,
            brandId:null,
            seriesId:null,
            modelId:null,
            customerName: null,
            leaseType: null,
            carOrderNo: null,
            carOwner:null,
            contractNo:null,
            collectionType:null,
            //租赁开始时间
            timeStartRentType:null,
            timeStartRentStr:null,
            //租赁结束时间
            timeFinishRentType:null,
            timeFinishRentStr:null,
            sqlType: null,
        },
        total: {},
        allCarModels:[],
        isFilter:false,
        dateConfig1: 30,
        dateConfig2: 60,
        ids:[]

    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
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
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });
    },
    methods: {
        reset: function () {
            vm.q.carNo = null;
            //出租方id
            vm.q.leaseId = null;
            //出租方名称
            vm.q.leaseName = null;
            //车辆品牌id
            vm.q.brandId = null;
            //车辆车系id
            vm.q.seriesId = null;
            //车辆车型id
            vm.q.modelId = null;
            //客户名称
            vm.q.customerName = null;
            //租赁类型
            vm.q.leaseType = null;
            //订单编号
            vm.q.carOrderNo = null;
            vm.q.carOwner = null;
            vm.q.contractNo = null;
            vm.q.collectionType = null;
            //租赁开始时间
            vm.q.timeStartRentType = null;
            vm.q.timeStartRentStr = null;
            //租赁结束时间
            vm.q.timeFinishRentType = null;
            vm.q.timeFinishRentStr = null;

            $("#carBrandSeriesModel").val("");
            $('div[type="timeStartRentType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="timeFinishRentType"]>div').removeClass('task-content-box-tab-child-active');

        },
        detail: function (carId,carOrderNo,leaseType) {
            window.localStorage.setItem("carId", carId);
            window.localStorage.setItem("carOrderNo", carOrderNo);
            window.localStorage.setItem("leaseType", leaseType);
            var index = layer.open({
                type: 2,
                content: tabBaseURL + 'modules/warn/vehiclerentwarnDetail.html',
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        cancel: function () {
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        changeStatus: function (type) {
            removeClass();
            cleanQuery();
            if(type == 0){
                $("#all").addClass("flex active");
                vm.q.sqlType = null;
            }else if (type == 1) {
                $("#field1").addClass("flex active");
                vm.q.sqlType = 1;
            } else if (type == 2) {
                $("#field2").addClass("flex active");
                vm.q.sqlType = 2;
            }
            vm.reload();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    //车牌号/车架号
                    carNo: vm.q.carNo,
                    //出租方id
                    leaseId: vm.q.leaseId,
                    //车辆品牌id
                    brandId: vm.q.brandId,
                    //车辆车系id
                    seriesId: vm.q.seriesId,
                    //车辆车型id
                    modelId: vm.q.modelId,
                    //客户名称
                    customerName: vm.q.customerName,
                    //租赁类型
                    leaseType: vm.q.leaseType,
                    //订单编号
                    carOrderNo: vm.q.carOrderNo,
                    //车辆所有人
                    carOwner: vm.q.carOwner,
                    //合同编号
                    contractNo: vm.q.contractNo,
                    //收款类型
                    collectionType: vm.q.collectionType,
                    //租赁开始时间
                    timeStartRentType: vm.q.timeStartRentType,
                    timeStartRentStr: vm.q.timeStartRentStr,
                    //租赁结束时间
                    timeFinishRentType: vm.q.timeFinishRentType,
                    timeFinishRentStr: vm.q.timeFinishRentStr,
                    sqlType: vm.q.sqlType,

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
            Vue.set(vm.q,"leaseId",treeNode.deptId);
            Vue.set(vm.q,"leaseName",treeNode.name);
            layer.closeAll();
        },

        // 消息通知
        notice:function(data){
            window.localStorage.setItem("carId",data.carId);
            window.localStorage.setItem("type","4");// 车辆租金预警消息通知操作
            var index = layer.open({
                title: "车辆租金预警通知",
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
                alert("未选择需要通知的车辆租金预警数据！");
                return ;
            }

            var carIds = [];
            $.each(vm.ids, function(index, item) {
                if(item != null){
                    carIds.push(item);
                }
            });

            console.log(carIds);
            window.localStorage.setItem("carIds", carIds);
            window.localStorage.setItem("type", "4");
            var index = layer.open({
                title: "租金预警通知",
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
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        exports:function () {
            var url = baseURL + 'vehiclerentwarn/export?a=a';
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
            }
            if(vm.q. leaseId != null){
                url += '& leaseId='+vm.q. leaseId;
            }
            if(vm.q.brandId != null){
                url += '&brandId='+vm.q.brandId;
            }
            if(vm.q.seriesId != null){
                url += '&seriesId='+vm.q.seriesId;
            }
            if(vm.q.modelId != null){
                url += '&modelId='+vm.q.modelId;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.carOrderNo != null){
                url += '&carOrderNo='+vm.q.carOrderNo;
            }
            if(vm.q.carOwner != null){
                url += '&carOwner='+vm.q.carOwner;
            }
            if(vm.q.contractNo != null){
                url += '&contractNo='+vm.q.contractNo;
            }
            if(vm.q.collectionType != null){
                url += '&collectionType='+vm.q.collectionType;
            }
            if(vm.q.timeStartRentType != null){
                url += '&timeStartRentType='+vm.q.timeStartRentType;
            }
            if(vm.q.timeStartRentStr != null){
                url += '&timeStartRentStr='+vm.q.timeStartRentStr;
            }
            if(vm.q.timeStartRentStr != null){
                url += '&timeStartRentStr='+vm.q.timeStartRentStr;
            }
            if(vm.q.timeFinishRentStr != null){
                url += '&timeFinishRentStr='+vm.q.timeFinishRentStr;
            }
            window.location.href = url;
        }

    }
});

function removeClass() {
    $("#all").removeClass("active");
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
}

function cleanQuery() {
    vm.q.carNo = null;
    //出租方id
    vm.q.leaseId = null;
    //出租方名称
    vm.q.leaseName = null;
    //车辆品牌id
    vm.q.brandId = null;
    //车辆车系id
    vm.q.seriesId = null;
    //车辆车型id
    vm.q.modelId = null;
    //客户名称
    vm.q.customerName = null;
    //租赁类型
    vm.q.leaseType = null;
    //订单编号
    vm.q.carOrderNo = null;
    vm.q.carOwner = null;
    vm.q.collectionType = null;
    //租赁开始时间
    vm.q.timeStartRentType = null;
    vm.q.timeStartRentStr = null;
    //租赁结束时间
    vm.q.timeFinishRentType = null;
    vm.q.timeFinishRentStr = null;

}


/**
 * 统计
 */
function selectTotal(){
    $.ajax({
        type: "GET",
        url: baseURL + "vehiclerentwarn/total",
        contentType: "application/json",
        success: function(res){
            vm.total = res.data;
        },
    });
}
function getInfo(){
    $.ajax({
        type: "GET",
        url: baseURL + "sys/config/getTabParam?moduleName=账单提醒&tabOrder=2",
        async: false,
        success: function(r){
            if (r.config != null){
                vm.dateConfig1 = r.config.tabValue;
            }
        }
    });
    $.ajax({
        type: "GET",
        url: baseURL + "sys/config/getTabParam?moduleName=账单提醒&tabOrder=3",
        async: false,
        success: function(r){
            if (r.config != null){
                vm.dateConfig2 = r.config.tabValue;
            }
        }
    });
}


function init(layui) {
    initData();
    initDate(layui.laydate);
    initClick();

}

function  initData() {
    getInfo();
    selectTotal();
}

function initClick() {
    $('div[type="timeStartRentType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="timeStartRentType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "timeStartRentStr", '');
        vm.q.timeStartRentType=value;
    });
    $('div[type="timeFinishRentType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="timeFinishRentType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "timeFinishRentStr", '');
        vm.q.timeFinishRentType=value;
    });

}

function initDate(laydate) {
    //租赁开始时间
    laydate.render({
        elem : '#timeStartRentStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeStartRentType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeStartRentStr=value;
            vm.q.timeStartRentType=null;
        }
    });
    //租赁结束时间
    laydate.render({
        elem : '#timeFinishRentStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeFinishRentType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeFinishRentStr=value;
            vm.q.timeFinishRentType=null;
        }
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
