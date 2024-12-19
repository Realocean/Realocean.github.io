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
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            url: baseURL + 'cartransfer/sparecar/list',
            cols: [[
                {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
                {field: 'code', minWidth: 100, title: '备用车申请编号'},
                {field: 'spareCarStatusStr', minWidth: 100, title: '备用车状态'},
                {field: 'carVinNo', minWidth: 100, title: '备用车车牌号/车架号'},
                {field: 'carBrandModel', minWidth: 100, title: '备用车品牌/车系/车型'},
                {field: 'transferCarVinNo', minWidth: 100, title: '替换车车牌号/车架号',placeholder:'111'},
                {field: 'carOrderNo', minWidth: 100, title: '车辆订单号'},
                {field: 'rentTypeStr', minWidth: 100, title: '租赁类型'},
                {field: 'carOrderStatusStr', minWidth: 100, title: '车辆订单状态'},
                {field: 'applyReason', minWidth: 100, title: '备用车申请原因'},
                {field: 'returnTime', minWidth: 100, title: '预计归还日期'},
                {field: 'hasUseDays', minWidth: 100, title: '已使用天数'},
                {field: 'createTime', minWidth: 100, title: '申请时间'}
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
            }
        });
    });

    layui.use('form', function () {
        var form = layui.form;
        form.on('submit(saveOrUpdate)', function(){
            vm.saveOrUpdate();
            return false;
        });
        form.on('select(spareStatus)', function (data) {
            vm.q.spareStatus = data.value;
        });
        form.on('select(rentType)', function (data) {
            vm.q.rentType = data.value;
        });
        form.on('select(orderCarStatus)', function (data) {
            vm.q.orderCarStatus = data.value;
        });
        initSearch();
        layui.form.render();
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        // if(layEvent === 'edit'){
        //     vm.update(data.id);
        // } else if(layEvent === 'del'){
        //     var id = [data.id];
        //     vm.del(id);
        // }
        if(layEvent === 'detail'){
            vm.detail(data.id);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            code:null,
            deptId:null,
            deptName:null,
            modelId:null,
            modelName:null,
            spareCarVin:null,
            transferCarVin:null,
            spareStatus:null,
            orderCarCode:null,
            rentType:null,
            customerName:null,
            lessorId:null,
            timeApplySpare: null,
            timeApplySparestart: null,
            timeApplySpareend: null,
            returnTime: null,
            returnTimestart: null,
            returnTimeend: null,
            realityReturnTime: null,
            realityReturnTimestart: null,
            realityReturnTimeend: null,
            orderCarStatus:null
        },
        showForm: false,
        carTreeList: [],
        deptList: [],
        spareCar: {}
    },
    created: function () {
        var _this = this;
        $.ajaxSettings.async= false;
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList;
        });
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            _this.carTreeList = r.carTreeVoList;
        });
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detail: function(id){
            $.get(baseURL + "cartransfer/sparecar/info/"+id, function(r){
                var index = layer.open({
                    title: "备用车详情",
                    type: 2,
                    content: tabBaseURL + "modules/order/sparecardetail.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.spareCarApply = r.spareCar;
                        iframe.vm.itemEntityList = r.spareCar.itemEntityList;
                        iframe.vm.receivablesList = r.spareCar.receivablesList;
                        if(r.spareCar.isApply == 1){
                            iframe.vm.payDayShow = true;
                        }else{
                            iframe.vm.payDayShow = false;
                        }
                        if(r.spareCar.spareCarStatus == 2 || r.spareCar.spareCarStatus == 31 || r.spareCar.spareCarStatus == 32 ){
                            iframe.vm.returnCarBtn = true;
                        }else{
                            iframe.vm.returnCarBtn = false;
                        }
                        if(r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3){
                            iframe.vm.returnCarForm = true;
                            iframe.vm.detailsSupTabContentList = [
                                '备用车基础信息',
                                '备用车信息',
                                '合同信息',
                                '其他关联单据信息',
                                '备用车退车信息',
                                '还款明细',
                                '操作记录'
                            ];
                        }else{
                            iframe.vm.returnCarForm = false;
                            iframe.vm.detailsSupTabContentList = [
                                '备用车基础信息',
                                '备用车信息',
                                '合同信息',
                                '其他关联单据信息',
                                '还款明细',
                                '操作记录'
                            ];
                        }
                        iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                        iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                        iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                        iframe.vm.reloadData();
                        iframe.vm.initOperatorLog(id);
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        reset: function(){
            resetNULL(vm.q);
            $('#a').val('');

        },
        query: function () {
            vm.reload();
        },
        add: function(){
            $.get(baseURL + "mark/processnode/activitiEnable",{processKey:'spareCarApprove'}, function (r) {
                if(r){
                    var param = {
                        viewTag: 'apply'
                    };
                    var index = layer.open({
                        title: "备用车申请",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/order/sparecarflow.html",
                        end: function(){
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                }else{
                    var index = layer.open({
                        title: "备用车申请",
                        type: 2,
                        content: tabBaseURL + "modules/order/sparecaradd.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.spareCarApply = Object.assign({},iframe.vm.spareCarApply,{isApply:0});
                        },
                        end: function(){
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                }
            });
        },
        update: function (id) {
            $.get(baseURL + "cartransfer/sparecar/info/"+id, function(r){
                vm.spareCar = r.spareCar;
            });
            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        saveOrUpdate: function (event) {
            var url = vm.spareCar.id == null ? "cartransfer/sparecar/save" : "cartransfer/sparecar/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.spareCar),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        exp: function () {
            window.location.href = urlParamByObj(baseURL + 'cartransfer/sparecar/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }
});

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function initSearch(){
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '备用车车牌号/车架号', placeholder: '请输入', fieldName: 'spareCarVin',},
            {type: 'text', label: '替换车车牌号/车架号', placeholder: '请输入', fieldName: 'transferCarVin'},
            {type: 'selectcascader', label: '备用车品牌/车系/车型', placeholder: '请选择', fieldName: 'modelId', selectList: vm.carTreeList},
            {type: 'text', label: '客户名称', placeholder: '请输入', fieldName: 'customerName', selectFilter: true},
            {type: 'text', label: '备用车申请编号', placeholder: '请输入', fieldName: 'code', selectFilter: true},
            {type: 'text', label: '订单编号', placeholder: '请输入', fieldName: 'orderCarCode', selectFilter: true},
            {type: 'select', label: '出租方', fieldName: 'lessorId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: vm.deptList, selectFilter: true},
            {type: 'select', label: '租赁类型', fieldName: 'rentType', selectMap: {1:'经租', 2:'以租代购', 3:'展示车', 4:'试驾车', 5:'融租', 6:'直购',}, selectFilter: true},
            {type: 'select', label: '订单状态', fieldName: 'orderCarStatus', selectMap: {
                    100:'提单审核中',
                    200:'用车中',
                    300:'换车审核中',
                    400:'已换车',
                    500:'退车审核中',
                    600:'已退车',
                    700:'已过户',
                    800:'已出售',
                    999:'已删除',
                }, selectFilter: true},
            {type: 'select', label: '备用车状态', fieldName: 'spareStatus', selectMap: {
                    1:'申请中',
                    11:'申请已拒绝',
                    12:'申请已撤销',
                    13:'申请已驳回',
                    2:'用车中',
                    3:'退车中',
                    31:'退车已拒绝',
                    32:'退车已撤销',
                    33:'退车已驳回',
                    4:'已退车',
                }, selectFilter: true},
            {type: 'date', label: '备用车申请时间', placeholder: '备用车申请时间', fieldName: 'timeApplySpare', selectFilter: true},
            {type: 'date', label: '预计归还时间', placeholder: '预计归还时间', fieldName: 'returnTime', selectFilter: true},
            {type: 'date', label: '实际归还时间', placeholder: '实际归还时间', fieldName: 'realityReturnTime', selectFilter: true},
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exp();
                    break;
                }
            }
        }
    }).initView();

}
