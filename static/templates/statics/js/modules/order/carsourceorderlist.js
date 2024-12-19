$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);

        // layui下拉选择监听
        layui.form.on('select(carSourceTypeSelect)', function (data) {
            vm.q.carSourceType = data.value;
        });

        layui.form.on('select(carStatusSelect)', function (data) {
            vm.q.carStatus = data.value;
        });

        layui.form.on('select(rentType)', function (data) {
            vm.q.rentType = data.value;
        });

        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carNo: null,
            warehousingDept:null,
            supplierName:null,
            contractNo:null,
            carSourceType:null,
            carStatus:null,
            rentType:null,
            orderNo:null,
            customerName:null,
            rentStartDateSearch:null,
            rentEndDateSearch:null,
            rentStartTimeSearch:null,
            rentEndTimeSearch:null,
            rentStartDateType:null,
            rentEndDateType:null,
            rentStartTimeType:null,
            rentEndTimeType:null,
            brandId:null,
            seriesId:null,
            modelId:null
        },
        carOrder:{},
        carSourceOrder: {},
        selectData:[],
        isClose: true,
        isFilter:false
    },
    created: function(){
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#a",
                    data: vm.selectData,
                    success: function (valData,labelData) {
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.carNo = null;
            vm.q.warehousingDept = null;
            vm.q.supplierName= null;
            vm.q.contractNo= null;
            vm.q.carSourceType= null;
            vm.q.carStatus= null;
            vm.q.rentType= null;
            vm.q.orderNo= null;
            vm.q.customerName = null;
            vm.q.rentStartDateSearch= null;
            vm.q.rentEndDateSearch= null;
            vm.q.rentStartTimeSearch= null;
            vm.q.rentEndTimeSearch= null;
            vm.q.brandId=null;
            vm.q.seriesId=null;
            vm.q.modelId=null;
            vm.selectData =null;
            vm.q.rentStartDateType=null;
            vm.q.rentEndDateType=null;
            vm.q.rentStartTimeType=null;
            vm.q.rentEndTimeType=null;

            $("#a").val('');
            $('div[type="rentStartDateType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="rentEndDateType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="rentStartTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="rentEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
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
            Vue.set(vm.q,"warehousingDept",treeNode.name);
            layer.closeAll();
        },

        view: function (id,carSourceType) {
            window.localStorage.setItem("id",id);
            var index = layer.open({
                title: "查看",
                type: 2,
                content: tabBaseURL + "modules/order/carsourceorderview.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.detail(id,carSourceType);
                },
                end: function () {
                    window.localStorage.setItem("id",null);
                    layer.close(index);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/carsourceorderadd.html",
                end: function () {
                    layer.close(index);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        update: function (id,carSourceType) {
            window.localStorage.setItem("id",id);
            window.localStorage.setItem("carSourceType",carSourceType);
            var index = layer.open({
                title: "修改",
                type: 2,
                content: tabBaseURL + "modules/order/carsourceorderedit.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    window.localStorage.setItem("carSourceType",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        // 退车结算
        settlement: function (id,carId) {
            window.localStorage.setItem("id",id);
            window.localStorage.setItem("carId",carId);
            var index = layer.open({
                title: "退车结算",
                type: 2,
                content: tabBaseURL + "modules/financial/sourceorderrefundcar.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    window.localStorage.setItem("carId",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        // 过户结算
        transfer: function(id,carId,transferDate){
            window.localStorage.setItem("id",id);
            window.localStorage.setItem("carId",carId);
            if(transferDate == null){
                window.localStorage.setItem("transferDate","--");
            } else {
                window.localStorage.setItem("transferDate",transferDate);
            }
            var index = layer.open({
                title: "过户结算",
                type: 2,
                content: tabBaseURL + "modules/financial/sourceordertransfercar.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    window.localStorage.setItem("carId",null);
                    window.localStorage.setItem("transferDate",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "pay/carsourceorder/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            var url = baseURL + 'pay/carsourceorder/export?a=a';
            if(vm.q.carNo != null && vm.q.carNo != ''){
                url += ('&carNo='+vm.q.carNo);
            }
            if(vm.q.warehousingDept != null && vm.q.warehousingDept != ''){
                url += ('&warehousingDept='+vm.q.warehousingDept);
            }
            if(vm.q.supplierName != null && vm.q.supplierName != ''){
                url += ('&supplierName='+vm.q.supplierName);
            }
            if(vm.q.contractNo != null && vm.q.contractNo != ''){
                url += ('&contractNo='+vm.q.contractNo);
            }
            if(vm.q.carSourceType != null && vm.q.carSourceType != ''){
                url += ('&carSourceType='+vm.q.carSourceType);
            }
            if(vm.q.carStatus != null && vm.q.carStatus != ''){
                url += ('&carStatus='+vm.q.carStatus);
            }
            if(vm.q.rentType != null && vm.q.rentType != ''){
                url += ('&rentType='+vm.q.rentType);
            }
            if(vm.q.orderNo != null && vm.q.orderNo != ''){
                url += ('&orderNo='+vm.q.orderNo);
            }
            if(vm.q.customerName != null && vm.q.customerName != ''){
                url += ('&customerName='+vm.q.customerName);
            }
            if(vm.q.rentStartDateSearch != null && vm.q.rentStartDateSearch != ''){
                url += ('&rentStartDateSearch='+vm.q.rentStartDateSearch);
            }
            if(vm.q.rentEndDateSearch != null && vm.q.rentEndDateSearch != ''){
                url += ('&rentEndDateSearch='+vm.q.rentEndDateSearch);
            }
            if(vm.q.rentStartTimeSearch != null && vm.q.rentStartTimeSearch != ''){
                url += ('&rentStartTimeSearch='+vm.q.rentStartTimeSearch);
            }
            if(vm.q.rentEndTimeSearch != null && vm.q.rentEndTimeSearch != ''){
                url += ('&rentEndTimeSearch='+vm.q.rentEndTimeSearch);
            }
            if(vm.q.rentStartDateType != null ){
                url += '&rentStartDateType='+vm.q.rentStartDateType;
            }
            if(vm.q.rentEndDateType != null ){
                url += '&rentEndDateType='+vm.q.rentEndDateType;
            }
            if(vm.q.rentStartTimeType != null ){
                url += '&rentStartTimeType='+vm.q.rentStartTimeType;
            }
            if(vm.q.rentEndTimeType != null ){
                url += '&rentEndTimeType='+vm.q.rentEndTimeType;
            }
            if(vm.q.brandId != null && vm.q.brandId != ''){
                url += ('&brandId='+vm.q.brandId);
            }
            if(vm.q.seriesId != null && vm.q.seriesId != ''){
                url += ('&seriesId='+vm.q.seriesId);
            }
            if(vm.q.modelId != null && vm.q.modelId != ''){
                url += ('&modelId='+vm.q.modelId);
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo:vm.q.carNo,
                    warehousingDept:vm.q.warehousingDept,
                    supplierName:vm.q.supplierName,
                    contractNo:vm.q.contractNo,
                    carSourceType:vm.q.carSourceType,
                    carStatus:vm.q.carStatus,
                    rentType:vm.q.rentType,
                    orderNo:vm.q.orderNo,
                    customerName:vm.q.customerName,
                    rentStartDateSearch:vm.q.rentStartDateSearch,
                    rentEndDateSearch:vm.q.rentEndDateSearch,
                    rentStartTimeSearch:vm.q.rentStartTimeSearch,
                    rentEndTimeSearch:vm.q.rentEndTimeSearch,
                    rentStartDateType:vm.q.rentStartDateType,
                    rentEndDateType:vm.q.rentEndDateType,
                    rentStartTimeType:vm.q.rentStartTimeType,
                    rentEndTimeType:vm.q.rentEndTimeType,
                    brandId:vm.q.brandId,
                    seriesId:vm.q.seriesId,
                    modelId:vm.q.modelId
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    $('div[type="rentStartDateType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="rentStartDateType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "rentStartDateSearch", '');
        vm.q.rentStartDateType = value;
    });

    $('div[type="rentEndDateType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="rentEndDateType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "rentEndDateSearch", '');
        vm.q.rentEndDateType = value;
    });

    $('div[type="rentStartTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="rentStartTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "rentStartTimeSearch", '');
        vm.q.rentStartTimeType = value;
    });

    $('div[type="rentEndTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="rentEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "rentEndTimeSearch", '');
        vm.q.rentEndTimeType = value;
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'pay/carsourceorder/queryList',
        cols: [[
            {title: '操作', width:100,minWidth:100, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carNo',align:"center", fixed: "left",title: '车牌号', minWidth:120, templet: function (d) {
                return "<span style='color: blue' onclick = hrefCarView(\'"+d.carId+"\')>"+isEmpty(d.carNo)+"</span>";
            }},
            {field:'contractNo',align:"center", title: '车辆来源合同号', minWidth:200, templet: function (d) {
                return "<span style='color: blue' onclick = hrefContractView(\'"+d.contractId+"\')>"+isEmpty(d.contractNo)+"</span>";
            }},
            {field:'contractStatus',align:"center", title: '合同状态', minWidth:100, templet: function (d) {return isEmpty(d.contractStatus);}},
            {field:'carSourceTypeStr', align:"center",title: '车辆来源类型', minWidth:120, templet: function (d) {return isEmpty(d.carSourceTypeStr);}},
            {field:'carSourceStatusStr', align:"center",title: '车辆来源状态', minWidth:120, templet: function (d) {return isEmpty(d.carSourceStatusStr);}},
            {field:'totalPrice', align:"center",title: '直购总单价', minWidth:120, templet: function (d) {return isEmpty(d.totalPrice);}},
            {field:'supplierName', align:"center",title: '供应商', minWidth:200, templet: function (d) {return isEmpty(d.supplierName);}},
            {field:'vinNo',align:"center", title: '车架号', minWidth:200, templet: function (d) {
                return isEmpty(d.vinNo);
            }},
            {field:'carBrandModelSeriesName',align:"center", title: '品牌/车系/车型', minWidth:200, templet: function (d) {return isEmpty(d.carBrandModelSeriesName);}},
            {field:'carStatus',align:"center", title: '车辆状态', minWidth:100, templet: function (d) {return isEmpty(d.carStatus);}},
            {field:'rentStartDate', align:"center",title: '来源租赁开始时间', minWidth:150, templet: function (d) {return isEmpty(d.rentStartDate);}},
            {field:'rentEndDate', align:"center",title: '来源租赁结束时间', minWidth:150, templet: function (d) {return isEmpty(d.rentEndDate);}},
            {field:'warehousingDept',align:"center", title: '车辆归属', minWidth:200, templet: function (d) {return isEmpty(d.warehousingDept);}},
            {field:'warehousingDate', align:"center",title: '入库时间', minWidth:150, templet: function (d) {return isEmpty(d.warehousingDate);}},
            {field:'rentTypeStr', align:"center",title: '租赁类型', minWidth:100, templet: function (d) {return isEmpty(d.rentTypeStr);}},
            {field:'orderNo', align:"center",title: '订单编号', minWidth:150, templet: function (d) {
                return "<span style='color: blue' onclick = hrefCarOrderView(\'"+d.orderCarId+"\',\'"+d.statusStr+"\')>"+isEmpty(d.orderNo)+"</span>";
            }},
            {field:'customerName', align:"center",title: '客户名称', minWidth:150, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'rentStartTime', align:"center",title: '租赁开始时间', minWidth:120, templet: function (d) {return isEmpty(d.rentStartTime);}},
            {field:'rentEndTime', align:"center",title: '租赁结束时间', minWidth:120, templet: function (d) {return isEmpty(d.rentEndTime);}},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id,data.carSourceType);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id,data.carSourceType);
        } else if(layEvent === 'settlement'){
            vm.settlement(data.id,data.carId);
        } else if(layEvent === 'transfer'){
            vm.transfer(data.id,data.carId,data.transferDate);
        }else if (layEvent === 'mmvMore') {
            var mmvDropDonw = $(obj.tr[1]).find('.mmv-dropdonw');
            var wrap = mmvDropDonw.find('.mmv-dropdonw-wrap');
            var top = mmvDropDonw.offset().top;
            var left = mmvDropDonw.offset().left;
            var scroll = $(window).scrollTop();
            if ($(window).height()<top - scroll + 20+ wrap.height()){
                wrap.css('bottom', 0);
            }else{
                wrap.css('top', top - scroll + 30 + 'px');
            }
            wrap.css('left', left + 30 + 'px');
            wrap.show();
            setTimeout(()=> {
                $(window).one('click', function() {
                    wrap.hide();
                });
                $(window).one('scroll', function() {
                    wrap.hide();
                });
            },300);
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem : '#rentStartDateSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="rentStartDateType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.rentStartDateSearch=value;
            vm.q.rentStartDateType=null;
        }
    });
    laydate.render({
        elem : '#rentEndDateSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="rentEndDateType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.rentEndDateSearch=value;
            vm.q.rentEndDateType=null;
        }
    });
    laydate.render({
        elem : '#rentStartTimeSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="rentStartTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.rentStartTimeSearch=value;
            vm.q.rentStartTimeType=null;
        }
    });
    laydate.render({
        elem : '#rentEndTimeSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="rentEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.rentEndTimeSearch=value;
            vm.q.rentEndTimeType=null;
        }
    });
}

//查看车辆详情
function hrefCarView (carId) {
    var index = layer.open({
        title: "车辆详情",
        type: 2,
        content: tabBaseURL + "modules/car/tcarbasicdetail.html",
        success: function(layero,num){
            var iframe = window['layui-layer-iframe'+num];
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
//查看合同详情
function hrefContractView(id){
    if (!isEmptyReturnNull(id)) return;
    $.get(baseURL + "order/contraccarsource/info/"+id, function(r){
        var param = {
            data:r.contraccarSource
        };
        var index = layer.open({
            title: "查看",
            type: 2,
            boxParams: param,
            content: tabBaseURL + "modules/contract/contraccarsourceview.html",
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
    });
}
// 查了订单详情
function hrefCarOrderView(orderCarId,statusStr){
    $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
        if(r.code != 0){
            alert("获取订单数据异常！");
            return;
        }
        if(statusStr == null){
            statusStr = "未知状态";
        }
        r.order.orderCar.orderCarStatusStr = statusStr;
        var param = {
            data: r.order
        };
        var index = layer.open({
            title: "查看",
            type: 2,
            boxParams: param,
            content: tabBaseURL + "modules/order/orderview.html",
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
    });

}
