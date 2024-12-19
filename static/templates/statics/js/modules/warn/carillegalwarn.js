$(function () {
    //初始化头部统计
    vm.initHeadCount();
    //初始化table
    vm.initTable();
    //初始化页面event
    vm.initEvent();

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;
        init(layui);
        form.render();
    });

    layui.form.on('checkbox(siam_all)', function(){
        var checked = $(this)[0].checked;
        if (receivablesDatas != null && receivablesDatas.length > 0){
            receivablesDatas.forEach(function (d) {
                ysCheckedChange(d, d.illegalId, checked);
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
            return d.illegalId == id;
        })[0];
        ysCheckedChange(obj, id, checked);
        layui.form.render();
    });
    layui.form.on('select(vehicleStatusSelect)', function (data) {
        vm.q.vehicleStatus = data.value;
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q:{
            carPlateNo:null,
            deptId:null,
            deptName:null,
            customer:null,
            carStatus:null,
            type:1,
            brandId:null,
            seriesId:null,
            modelId:null,
            carOwner:null,
            orderNo:null,
            depotName:null,
            depotId:null,
            illegalDetail:null,
            illegalTimeStr:null,
            illegalTimeType:null,
            queryTimeType:null,
            queryTimeStr:null,
            vehicleStatus:null

        },
        carIllegalCount:[],
        carIllegalIndex: 0,
        warehouseData:{},
        isFilter:false,
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
        initEvent:function(){
            layui.use('form', function(){
                var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                form.on('select(carStatusSelect)', function (data) {
                    vm.q.carStatus = data.value;
                });
                form.render();//在最后添加这句代码
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
            Vue.set(vm.q,"deptName",treeNode.name);
            layer.closeAll();
        },
        initHeadCount: function(){
            $.ajax({
                type: "POST",
                url: baseURL + "car/carillegal/getHeadCount",
                success: function (r) {
                    vm.carIllegalCount = r.headCount;
                }
            });
        },
        initTable: function(){
            layui.config({
                base: '../../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            });
            layui.use(['form', 'element', 'table', 'soulTable'], function () {
                soulTable = layui.soulTable
                gridTable = layui.table.render({
                    id: "gridid",
                    elem: '#grid',
                    url: baseURL + 'car/carillegal/warnList',
                    where:{
                        type:vm.q.type
                    },
                    cols: [[
                        {title: '操作', width: 120, templet: '#barTpl', fixed:"left",align:"center"},
                        {
                            templet: "#checkbd",
                            title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                            width: 60,
                            fixed: "left",
                            align:"center"
                        },
                        {field: 'carPlateNo', minWidth: 100, title: '车牌号',fixed: "left",align: "center",templet: function (d) {return isEmpty(d.carPlateNo);}},
                        {field: 'vinNo', minWidth: 100, title: '车架号',align: "center",templet: function (d) {return isEmpty(d.vinNo);}},
                        {field: 'carBrandModel', minWidth: 100, title: '品牌/车系/车型',align: "center",templet: function (d) {return isEmpty(d.carBrandModel);}},
                        {field: 'deptName', minWidth: 100, title: '车辆归属',align: "center",templet: function (d) {return isEmpty(d.deptName);}},
                        {field: 'carStatusStr', minWidth: 100, title: '车辆状态',align: "center",templet: function (d) {return isEmpty(d.carStatusStr);}},
                        {field: 'carOwner', minWidth: 100, title: '车辆所有人',align: "center",templet: function (d) {return isEmpty(d.carOwner);}},
                        {field: 'depotName', minWidth: 100, title: '所属仓库',align: "center",templet: function (d) {return isEmpty(d.depotName);}},
                        {field: 'orderNo', minWidth: 150, title: '车辆订单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field: 'customerName', minWidth: 100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customerName);}},
                        {field: 'contact', minWidth: 100, title: '联系电话',align: "center",templet: function (d) {return isEmpty(d.contact);}},
                        {field: 'illegalDate', minWidth: 100, title: '违章时间',align: "center",templet: function (d) {return isEmpty(d.illegalDate);}},
                        {field: 'illegalContent', minWidth: 100, title: '违章内容',align: "center",templet: function (d) {return isEmpty(d.illegalContent);}},
                        {field: 'illegalAddr', minWidth: 100, title: '违章地点',align: "center",templet: function (d) {return isEmpty(d.illegalAddr);}},
                        {field: 'illegalPoints', minWidth: 100, title: '违章扣分',align: "center",templet: function (d) {return isEmpty(d.illegalPoints);}},
                        {field: 'illegalFee', minWidth: 100, title: '违章罚款/元',align: "center",templet: function (d) {return isEmpty(d.illegalFee);}},
                        {field: 'selectStatusStr', minWidth: 100, title: '查询状态'  ,templet:function(d){
                                return '<span style="color:red">'+d.selectStatusStr+'</span>'
                            }
                        },
                        {field: 'unHandleDays', minWidth: 100, title: '未处理天数' ,templet:function(d){
                                if(d.unHandleDays!=null && d.unHandleDays!=''){
                                    return '<span style="color:red">'+d.unHandleDays+"天"+'</span>'
                                }else {
                                    return  "--";
                                }
                            }
                        }
                    ]],
                    page: true,
                    loading: true,
                    limits: [10, 20,50, 100],
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
                            if ($.inArray(d.illegalId, vm.ids) >= 0) {
                                d.LAY_CHECKED = true;
                            }
                        });

                        receivablesDatas = res.data;
                        checkAllStatusChange();
                        return res;
                    },
                });
            });

            layui.table.on('tool(grid)', function (obj) {
                var layEvent = obj.event,
                    data = obj.data;
                if (layEvent === 'detail') {
                    vm.detail(data);
                }else if(layEvent === 'notice'){
                    vm.notice(data);
                }
            });
        },
        // 消息通知
        notice:function(data){
            window.localStorage.setItem("carId",data.carId);
            window.localStorage.setItem("type","3");// 车辆违章消息通知操作
            var index = layer.open({
                title: "车辆违章预警通知",
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
                alert("未选择需要通知的车辆违章预警数据！");
                return ;
            }

            var illegalIds = [];
            $.each(vm.ids, function(index, item) {
                illegalIds.push(item);
            });

            console.log(illegalIds);
            window.localStorage.setItem("carIds", illegalIds);
            window.localStorage.setItem("type", "3");
            var index = layer.open({
                title: "车辆违章预警通知",
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

        detail: function(data){
            window.localStorage.setItem("carId",data.carId);
            var index = layer.open({
                title: "违章信息详情",
                type: 2,
                content: tabBaseURL + "modules/warn/carillegalwarndetail.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.carIllegal = data;
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        changeStatus: function(item,index){
            vm.carIllegalIndex = index;
            if(item.tabOrder == '1'){
                vm.q.type = 1;
            }else if(item.tabOrder == '2'){
                vm.q.type = 2;
            }else if(item.tabOrder == '3'){
                vm.q.type = 3;
            }
            vm.reload();
        },
        query:function(){
            vm.reload();
        },
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
        reset:function(){
            vm.q.carPlateNo = null;
            vm.q.deptId = null;
            vm.q.deptName = null;
            vm.q.customerName = null;
            vm.q.carStatus = null;
            vm.q.brandId  = null;
            vm.q.seriesId  = null;
            vm.q.modelId  = null;
            vm.q.carOwner  = null;
            vm.q.orderNo  = null;
            vm.q.depotName=null,
            vm.q.depotId=null,
            vm.q.illegalDetail=null,
            vm.q.illegalTimeStr=null,
            vm.q.illegalTimeType=null,
            vm.q.queryTimeType=null,
            vm.q.queryTimeStr=null,
            vm.q.vehicleStatus=null;

            $("#carBrandSeriesModel").val("");
            $('div[type="illegalTime"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="queryTimeType"]>div').removeClass('task-content-box-tab-child-active');
        },
        exp:function(){
            var url = baseURL + 'car/carillegal/exportWarn?a=a';
            if(vm.q.carPlateNo  != null){
                url += '&carPlateNo='+vm.q.carPlateNo;
            }
            if(vm.q.type   != null){
                url += '&type='+vm.q.type ;
            }
            if(vm.q.deptId != null){
                url += '&deptId='+vm.q.deptId;
            }
            if(vm.q.customerName  != null){
                url += '&customerName ='+vm.q.customerName ;
            }
            if(vm.q.carStatus != null){
                url += '&carStatus='+vm.q.carStatus;
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
            if(vm.q.carOwner != null){
                url += '& carOwner='+vm.q.carOwner;
            }
            if(vm.q.orderNo != null){
                url += '&orderNo='+vm.q.orderNo;
            }
            if(vm.q.depotId != null){
                url += '&depotId='+vm.q.depotId;
            }
            if(vm.q.illegalDetail != null){
                url += '&illegalDetail='+vm.q.illegalDetail;
            }
            if(vm.q.illegalTimeStr != null){
                url += '&illegalTimeStr='+vm.q.illegalTimeStr;
            }
            if(vm.q.illegalTimeType != null){
                url += '&illegalTimeType='+vm.q.illegalTimeType;
            }
            if(vm.q.queryTimeType != null){
                url += '&queryTimeType='+vm.q.queryTimeType;
            }
            if(vm.q.queryTimeStr != null){
                url += '&queryTimeStr='+vm.q.queryTimeStr;
            }
            if(vm.q.vehicleStatus != null){
                url += '&vehicleStatus='+vm.q.vehicleStatus;
            }
            window.location.href = url;

        },
        reload:function(){
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carPlateNo : vm.q.carPlateNo,
                    type : vm.q.type,
                    deptId : vm.q.deptId,
                    customerName : vm.q.customerName,
                    carStatus : vm.q.carStatus,
                    brandId:vm.q.brandId ,
                    seriesId:vm.q.seriesId ,
                    modelId:vm.q.modelId,
                    carOwner:vm.q.carOwner ,
                    orderNo:vm.q.orderNo,
                    depotId:vm.q.depotId,
                    illegalDetail:vm.q.illegalDetail,
                    illegalTimeStr:vm.q.illegalTimeStr,
                    illegalTimeType:vm.q.illegalTimeType,
                    queryTimeType:vm.q.queryTimeType,
                    queryTimeStr:vm.q.queryTimeStr,
                    vehicleStatus:vm.q.vehicleStatus

                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }
    }
});


function init(layui) {
    initDate(layui.laydate);
    initClick();
}

function initDate(laydate) {
    laydate.render({
        elem : '#illegalTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="illegalTime"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.illegalTimeStr=value;
            vm.q.illegalTimeType=null;
        }
    });
    laydate.render({
        elem : '#queryTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="queryTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.queryTimeStr=value;
            vm.q.queryTimeType=null;
        }
    });


}

function initClick() {
    $('div[type="illegalTime"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="illegalTime"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "illegalTimeStr", '');
        //维修开始时间类型
        vm.q.illegalTimeType=value;
    });

    $('div[type="queryTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="queryTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "queryTimeStr", '');
        vm.q.queryTimeType=value;
    });
}

function checkAllStatusChange() {
    var count =  receivablesDatas.length;
    receivablesDatas.forEach(function (d) {
        if ($.inArray(d.illegalId, vm.ids) >= 0){
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


