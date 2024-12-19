$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        }
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
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
            vm.q.keyword = null;
        },
        view: function (id) {
            $.get(baseURL + "order/ordercar/info/"+id, function(r){
                var param = {
                    data:r.orderCar
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/ordercarview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/ordercaredit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "order/ordercar/info/"+id, function(r){
                var param = {
                    data:r.orderCar
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/ordercaredit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "order/ordercar/delete",
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
            var url = baseURL + 'order/ordercar/export?a=a';
            if(vm.q.keyword != null && vm.q.keyword != ''){
                url += ('&keyword='+vm.q.keyword);
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    keyword: vm.q.keyword
                }
            });
        }
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
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'order/ordercar/list',
        cols: [[
            {type:'checkbox',fixed:"left"},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carNo', fixed: "left",title: '车牌号',align:"center", minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
                            {field:'id', title: '', minWidth:200, templet: function (d) {return isEmpty(d.id);}},
                            {field:'code', title: '车辆订单编号', minWidth:200, templet: function (d) {return isEmpty(d.code);}},
                            {field:'orderId', title: '订单id', minWidth:200, templet: function (d) {return isEmpty(d.orderId);}},
                            {field:'carId', title: '车辆id', minWidth:200, templet: function (d) {return isEmpty(d.carId);}},
                           
                            {field:'vinNo', title: '车架号', minWidth:200, templet: function (d) {return isEmpty(d.vinNo);}},
                            {field:'brandId', title: '品牌id', minWidth:200, templet: function (d) {return isEmpty(d.brandId);}},
                            {field:'brandName', title: '所属品牌名称', minWidth:200, templet: function (d) {return isEmpty(d.brandName);}},
                            {field:'seriesId', title: '车系id', minWidth:200, templet: function (d) {return isEmpty(d.seriesId);}},
                            {field:'seriesName', title: '所属车系名称', minWidth:200, templet: function (d) {return isEmpty(d.seriesName);}},
                            {field:'modelId', title: '型号id', minWidth:200, templet: function (d) {return isEmpty(d.modelId);}},
                            {field:'modelName', title: '所属车型名称', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
                            {field:'deptId', title: '所属部门id', minWidth:200, templet: function (d) {return isEmpty(d.deptId);}},
                            {field:'deptName', title: '所属部门名称', minWidth:200, templet: function (d) {return isEmpty(d.deptName);}},
                            {field:'depotId', title: '所属仓库id', minWidth:200, templet: function (d) {return isEmpty(d.depotId);}},
                            {field:'depotName', title: '所属仓库名称', minWidth:200, templet: function (d) {return isEmpty(d.depotName);}},
                            {field:'cityId', title: '所属城市id', minWidth:200, templet: function (d) {return isEmpty(d.cityId);}},
                            {field:'cityName', title: '所属城市名称', minWidth:200, templet: function (d) {return isEmpty(d.cityName);}},
                            {field:'mileage', title: '里程数', minWidth:200, templet: function (d) {return isEmpty(d.mileage);}},
                            {field:'electricQuantity', title: '电量', minWidth:200, templet: function (d) {return isEmpty(d.electricQuantity);}},
                            {field:'accessoryItems', title: '随车物品', minWidth:200, templet: function (d) {return isEmpty(d.accessoryItems);}},
                            {field:'carDesc', title: '车辆备注', minWidth:200, templet: function (d) {return isEmpty(d.carDesc);}},
                            {field:'rentType', title: '租赁类型：1、长租 2、以租代购 3、展示车 4、试驾车', minWidth:200, templet: function (d) {return isEmpty(d.rentType);}},
                            {field:'paymentMethod', title: '付款方式：1、月付 2、两月付 3、季付 4、年付 5、一次性结清', minWidth:200, templet: function (d) {return isEmpty(d.paymentMethod);}},
                            {field:'insuranceItems', title: '车辆已购保险', minWidth:200, templet: function (d) {return isEmpty(d.insuranceItems);}},
                            {field:'paymentDay', title: '付款日', minWidth:200, templet: function (d) {return isEmpty(d.paymentDay);}},
                            {field:'channelId', title: '渠道商id', minWidth:200, templet: function (d) {return isEmpty(d.channelId);}},
                            {field:'channelName', title: '渠道商名称', minWidth:200, templet: function (d) {return isEmpty(d.channelName);}},
                            {field:'timeStartRent', title: '租赁开始时间', minWidth:200, templet: function (d) {return isEmpty(d.timeStartRent);}},
                            {field:'timeFinishRent', title: '租赁结束时间', minWidth:200, templet: function (d) {return isEmpty(d.timeFinishRent);}},
                            {field:'tenancy', title: '租期', minWidth:200, templet: function (d) {return isEmpty(d.tenancy);}},
                            {field:'orderDesc', title: '车辆订单备注', minWidth:200, templet: function (d) {return isEmpty(d.orderDesc);}},
                            {field:'deliveryOperationId', title: '交车工作人员id', minWidth:200, templet: function (d) {return isEmpty(d.deliveryOperationId);}},
                            {field:'deliveryOperationName', title: '交车工作人员姓名', minWidth:200, templet: function (d) {return isEmpty(d.deliveryOperationName);}},
                            {field:'deliveryMileage', title: '交车里程数', minWidth:200, templet: function (d) {return isEmpty(d.deliveryMileage);}},
                            {field:'mileageNextMaintenance', title: '下次保养里程数', minWidth:200, templet: function (d) {return isEmpty(d.mileageNextMaintenance);}},
                            {field:'mileageNextDate', title: '下次保养里程数', minWidth:200, templet: function (d) {return isEmpty(d.mileageNextDate);}},
                            {field:'deliveryDesc', title: '交车备注', minWidth:200, templet: function (d) {return isEmpty(d.deliveryDesc);}},
                            {field:'timeDelivery', title: '交车时间', minWidth:200, templet: function (d) {return isEmpty(d.timeDelivery);}},
                            {field:'timeReturn', title: '还车时间', minWidth:200, templet: function (d) {return isEmpty(d.timeReturn);}},
                            {field:'swappedOrderCarId', title: '被交换的订单id', minWidth:200, templet: function (d) {return isEmpty(d.swappedOrderCarId);}},
                            {field:'swopOrderCarId', title: '交换的订单id', minWidth:200, templet: function (d) {return isEmpty(d.swopOrderCarId);}},
                            {field:'status', title: '状态：0、待交车 1、用车中 2、换车中 3、换车中-待交车 4、已换车-待交车 5、已换车 6、退车中 7、已退车', minWidth:200, templet: function (d) {return isEmpty(d.status);}},
                            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
                            {field:'timeUpdate', title: '更新时间', minWidth:200, templet: function (d) {return isEmpty(d.timeUpdate);}},
                            {field:'delect', title: '删除状态（0未删除，1已删除）', minWidth:200, templet: function (d) {return isEmpty(d.delect);}},
            
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
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
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        }
    });
}

function initDate(laydate) {

}
