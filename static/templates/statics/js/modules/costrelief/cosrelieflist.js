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
            //发车单号
            orderCode: null,
            //减免单号
            costReliefCode: null,
            //合同编号
            contractCode: null,
            //减免方名称
            reliefPartyName: null,
            //减免方类型
            reliefPartyType: null,
            //售卖方
            lessorId: null,
            //品牌车型
        //   carBrandModelName: null,
            //租赁类型
            rentType: null,
            //车架号，车牌号
            carNo: null,
            //申请日期
            applyTime: null,
            brandId: null,
            seriesId: null,
            modelId: null,
        },
        //品牌车型
        allCarModels:[],
        //售卖方
        deptList: [],
        isClose: true,
        isFilter:false
    },
    created: function(){
        var _this = this;

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
        //售卖方
        $.get(baseURL + "sys/dept/listAll", function(r){
            _this.deptList = r.deptList;
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

            var costReliefIds = [];
            $.each(list, function(index, item) {
                costReliefIds.push(item.costReliefId);
            });
            return costReliefIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
                //发车单号
                vm.q.orderCode= null,
                //减免单号
                vm.q.costReliefCode= null,
                //合同编号
                vm.q.contractCode= null,
                //减免方名称
                vm.q.reliefPartyName= null,
                //减免方类型
                vm.q.reliefPartyType= null,
                //售卖方
                vm.q.lessorId= null,
                //品牌车型
        //       vm.q.carBrandModelName= null,
                //租赁类型
                vm.q.rentType=null,
                //车架号，车牌号
                vm.q.carNo= null,
                //申请日期
                vm.q.applyTime=null,
                vm.q.brandId=null,
                vm.q.seriesId=null,
                vm.q.modelId=null,
                $("#carBrandSeriesModel").val("");

        },
        view: function (costReliefId) {
            $.get(baseURL + "costrelief/cosrelief/info/"+costReliefId, function(r){
                var param = {
                    data:r.cosreliefEntityList
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/costrelief/cosreliefview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        dispose:function(costReliefId){
            $.get(baseURL + "costrelief/cosrelief/info/"+costReliefId, function(r){
                var param = {
                    data:r.cosreliefEntityList
                };
                var index = layer.open({
                    title: "处理",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/costrelief/cosreliefedit.html",
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
                content: tabBaseURL + "modules/costrelief/cosreliefedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (costReliefId) {
            $.get(baseURL + "costrelief/cosrelief/info/"+costReliefId, function(r){
                var param = {
                    data:r.cosrelief
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/costrelief/cosreliefedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (costReliefIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "costrelief/cosrelief/delete",
                    contentType: "application/json",
                    data: JSON.stringify(costReliefIds),
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
            var url = baseURL + 'costrelief/cosrelief/export?a=a';
            if(vm.q.orderCode != null && vm.q.orderCode != ''){
                url += ('&orderCode='+vm.q.orderCode);
            }
            if(vm.q.costReliefCode != null && vm.q.costReliefCode != ''){
                url += ('&costReliefCode='+vm.q.costReliefCode);
            }
            if(vm.q.contractCode != null && vm.q.contractCode != ''){
                url += ('&contractCode='+vm.q.contractCode);
            }
            if(vm.q.reliefPartyName != null && vm.q.reliefPartyName != ''){
                url += ('&reliefPartyName='+vm.q.reliefPartyName);
            }
            if(vm.q.reliefPartyType != null && vm.q.reliefPartyType != ''){
                url += ('&reliefPartyType='+vm.q.reliefPartyType);
            }
            if(vm.q.lessorId != null && vm.q.lessorId != ''){
                url += ('&lessorId='+vm.q.lessorId);
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
            if(vm.q.rentType != null && vm.q.rentType != ''){
                url += ('&rentType='+vm.q.rentType);
            }
            if(vm.q.carNo != null && vm.q.carNo != ''){
                url += ('&carNo='+vm.q.carNo);
            }
            if(vm.q.applyTime != null && vm.q.applyTime != ''){
                url += ('&applyTime='+vm.q.applyTime);
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    //发车单号
                    orderCode:vm.q.orderCode,
                    //减免单号
                    costReliefCode:vm.q.costReliefCode,
                    //合同编号
                    contractCode:vm.q.contractCode,
                     //减免方名称
                    reliefPartyName:vm.q.reliefPartyName,
                      //减免方类型
                    reliefPartyType:vm.q.reliefPartyType,
                     //售卖方
                    lessorId:vm.q.lessorId,
                     //品牌车型
                //    carBrandModelName:vm.q.carBrandModelName,
                   //租赁类型
                    rentType:vm.q.rentType,
                      //车架号，车牌号
                    carNo:vm.q.carNo,
                      //申请日期
                    applyTime:vm.q.applyTime,
                    brandId:vm.q.brandId,
                    seriesId:vm.q.seriesId,
                    modelId:vm.q.modelId,

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
    //减免方类型
    form.on('select(reliefPartyType)', function (data) {
        vm.q.reliefPartyType = data.value;
    });
    //售卖方
    form.on('select(lessor)', function (data) {
        vm.q.lessorId = data.value;
    });
    //品牌车型
    form.on('select(carModelSelect)', function (data) {
        vm.q.carBrandModelName = data.value;
    });
    //租赁类型
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });



}

function initClick() {
    $(".delBatch").click(function(){
        var costReliefIds = vm.selectedRows();
        if(costReliefIds == null){
            return;
        }
        vm.del(costReliefIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'costrelief/cosrelief/list',
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carNo', title: '车牌号',fixed: "left",align:"center", minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
            {field:'vinNo', title: '车架号', minWidth:200, templet: function (d) {return isEmpty(d.vinNo);}},
            {field:'brandSeriesName', title: '品牌/车系/车型', minWidth:200, templet: function (d) {return isEmpty(d.brandSeriesName);}},
            {field:'contractCode', title: '合同编号', minWidth:200, templet: function (d) {
                   if(d.contractCode!=null && d.contractCode!=''){
                       return "<span style='color:#419BEA;cursor: pointer;' onclick=goToContractDetail(\'"+d.contractId+"\',\'"+d.contractCode+"\',\'"+d.statusStr+"\')>"+d.contractCode+"</span>";
                   }else{
                       return "--";
                   }
            }},
            {field:'orderCode', title: '车辆订单号', minWidth:200, templet: function (d) {
                    if(d.orderCode!=null && d.orderCode!=''){
                        return "<span style='color:#419BEA;cursor: pointer;'onclick=goToOrderDetail(\'"+d.orderCarId+"\')>"+d.orderCode+"</span>";
                    }else{
                        return "--";
                    }
            }},
            {field:'costReliefCode', title: '减免单号', minWidth:200, templet: function (d) {return isEmpty(d.costReliefCode);}},
            {field:'processingState', title: '处理状态', minWidth:200, templet: function (d) {
                if(d.processingState!=null && d.processingState==1){
                    return "<span style='color: red;'>"+'待处理'+"</span>";
                }else if(d.processingState!=null && d.processingState==2){
                    return "已减免";
                }else if(d.processingState!=null && d.processingState==3){
                    return "减免未通过";
                }else {
                    return "--";
                }
            }},
            {field:'customerName', title: '减免方名称', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'customerType', title: '减免方类型', minWidth:200, templet: function (d) {return isEmpty(d.customerType);}},
            {field:'lessorName', title: '售卖方', minWidth:200, templet: function (d) {return isEmpty(d.lessorName);}},
            {field:'rentType', title: '租赁类型', minWidth:200, templet: function (d) {return isEmpty(d.rentType);}},
            {field:'creditAmount', title: '申请减免金额/元', minWidth:200, templet: function (d) {return isEmpty(d.creditAmount);}},
            {field:'applyTime', title: '申请时间', minWidth:200, templet: function (d) {return isEmpty(d.applyTime);}},

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
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);
}

function  goToContractDetail(contractId,contractCode,statusStr) {
    if (contractCode.match(/^(.*?)QYHT(\d+?)$/)) {
        $.get(baseURL + "contract/contracbusiness/info/"+contractId, function(r){
            var param = {
                data:r.contracbusiness
            };
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/contract/contracbusinessview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        });
    } else {
        $.get(baseURL + "contract/contracordernotemplate/info/"+contractId, function(r){
            var param = {
                contracorderNotemplate:r.contracorderNotemplate,
                statusStr: statusStr
            };
            var index = layer.open({
                title: "合同详情",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/contract/contracordernotemplateview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        });
    }
}
/**
 * 跳转至订单详情
 */
function goToOrderDetail(orderCarId) {
    $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
        var param = {
            data: r.order
        };
        var index = layer.open({
            title: "订单详情",
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

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.costReliefId);
        } else if(layEvent === 'del'){
            var costReliefId = [data.costReliefId];
            vm.del(costReliefId);
        } else if(layEvent === 'view'){
            vm.view(data.costReliefId);
        }else if(layEvent === 'dispose'){
            //处理
             vm.dispose(data.costReliefId);
        }
    });
}

function initDate(laydate) {
    //申请时间
    laydate.render({
        elem: '#applyTime',
        type:'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.applyTime = value;
        }
    });


}
