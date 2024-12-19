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
            $.get(baseURL + "order/ordercarplan/info/"+id, function(r){
                var param = {
                    data:r.orderCarPlan
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/ordercarplanview.html",
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
                content: tabBaseURL + "modules/order/ordercarplanedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "order/ordercarplan/info/"+id, function(r){
                var param = {
                    data:r.orderCarPlan
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/ordercarplanedit.html",
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
                    url: baseURL + "order/ordercarplan/delete",
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
            var url = baseURL + 'order/ordercarplan/export?a=a';
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
     // defaultToolbar: ['filter'],
        url: baseURL + 'order/ordercarplan/list',
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'id', title: '', minWidth:200, templet: function (d) {return isEmpty(d.id);}},
                            {field:'code', title: '方案编号', minWidth:200, templet: function (d) {return isEmpty(d.code);}},
                            {field:'orderCarId', title: '车辆订单id', minWidth:200, templet: function (d) {return isEmpty(d.orderCarId);}},
                            {field:'orderCarCode', title: '车辆订单编号', minWidth:200, templet: function (d) {return isEmpty(d.orderCarCode);}},
                            {field:'brandId', title: '品牌id', minWidth:200, templet: function (d) {return isEmpty(d.brandId);}},
                            {field:'brandName', title: '所属品牌名称', minWidth:200, templet: function (d) {return isEmpty(d.brandName);}},
                            {field:'seriesId', title: '车系id', minWidth:200, templet: function (d) {return isEmpty(d.seriesId);}},
                            {field:'seriesName', title: '所属车系名称', minWidth:200, templet: function (d) {return isEmpty(d.seriesName);}},
                            {field:'modelId', title: '型号id', minWidth:200, templet: function (d) {return isEmpty(d.modelId);}},
                            {field:'modelName', title: '所属车型名称', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
                            {field:'downPayment', title: '首付款', minWidth:200, templet: function (d) {return isEmpty(d.downPayment);}},
                            {field:'balancePayment', title: '尾款', minWidth:200, templet: function (d) {return isEmpty(d.balancePayment);}},
                            {field:'cashDeposit', title: '保证金', minWidth:200, templet: function (d) {return isEmpty(d.cashDeposit);}},
                            {field:'monthlyRent', title: '租金', minWidth:200, templet: function (d) {return isEmpty(d.monthlyRent);}},
                            {field:'repaymentMethods', title: '租金还款方式（0金融公司，1平台）', minWidth:200, templet: function (d) {return isEmpty(d.repaymentMethods);}},
                            {field:'financeCompanyName', title: '金融公司名称', minWidth:200, templet: function (d) {return isEmpty(d.financeCompanyName);}},
                            {field:'chlRebate', title: '渠道返利', minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}},
                            {field:'hasFreeDays', title: '免费用车天数（0无，1有）', minWidth:200, templet: function (d) {return isEmpty(d.hasFreeDays);}},
                            {field:'freeDays', title: '免费天数', minWidth:200, templet: function (d) {return isEmpty(d.freeDays);}},
                            {field:'desc', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.desc);}},
                            {field:'status', title: '状态', minWidth:200, templet: function (d) {return isEmpty(d.status);}},
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
