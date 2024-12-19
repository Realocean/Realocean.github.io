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
            carPlateNo: null,
            actualDateStr: null
        },
        isClose: true,
        carIllegalCount:[],
        carIllegalIndex: 0,
        illegalChargeType:null
    },
    created: function(){
        var _this = this;
        $.getJSON(baseURL + "sys/config/getparam/ILLEGAL_CHARGE_TYPE", function (r) {
            _this.illegalChargeType = r.config.paramValue;
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        changeStatus: function(item,index){
            vm.carIllegalIndex = index;
            if(item.name == '充值记录'){
                var index = layer.open({
                    title: "查看充值记录",
                    type: 2,
                    content: tabBaseURL + "modules/car/illegalchargeloglist.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }
        },
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
            vm.q.carPlateNo = null;
            vm.q.actualDateStr = null;
        },
        view: function (id) {
            $.get(baseURL + "order/illegalconsumlog/info/"+id, function(r){
                var param = {
                    data:r.illegalConsumLog
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/car/illegalconsumlogview.html",
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
                content: tabBaseURL + "modules/order/illegalconsumlogedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "order/illegalconsumlog/info/"+id, function(r){
                var param = {
                    data:r.illegalConsumLog
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/illegalconsumlogedit.html",
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
                    url: baseURL + "order/illegalconsumlog/delete",
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
            var url = baseURL + 'order/illegalconsumlog/export?a=a';
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
                    carPlateNo: vm.q.carPlateNo,
                    actualDateStr: vm.q.actualDateStr
                }
            });
        }
    }
});

function init(layui) {
    //初始化头部统计
    initHeadCount();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initHeadCount(){
    $.ajax({
        type: "POST",
        url: baseURL + "order/illegalconsumlog/getHeadCount",
        success: function (r) {
            vm.carIllegalCount = r.headCount;
        }
    });
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
        url: baseURL + 'order/illegalconsumlog/queryList',
        cols: [[
            {field:'carPlateNo', title: '车牌',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.carPlateNo);}},
            {field:'feedbackDate', title: '反馈时间',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.feedbackDate);}},
            {field:'feedbackResult', title: '查询结果',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.feedbackResult);}},
            {field:'queryBatch', title: '批次',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.queryBatch);}},
            {field:'startTime', title: '发起时间',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.startTime);}},
            {field:'operatorName', title: '操作人',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}}
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
    laydate.render({
        elem: '#actualDate',
        format: 'yyyy-MM-dd',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.actualDateStr = value;
        }
    });
}
