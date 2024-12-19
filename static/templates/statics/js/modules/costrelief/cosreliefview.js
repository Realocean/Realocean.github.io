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
        },
        detailsTabContentList: [
            '详情',
            '操作记录',
        ],
       /* detailsSupTabContentList: [
            '基本信息',
            '其他信息',
        ],*/
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        cosrelief: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.cosrelief = param.data;
    },
    computed:{
        cashDeposit:function () {
            if(this.cosrelief.cashDeposit!=null){
                return "￥"+this.cosrelief.cashDeposit;
            } else {
                return "--";
            }
        },
        monthlyRent:function () {
            if(this.cosrelief.monthlyRent!=null){
                return "￥"+this.cosrelief.monthlyRent;
            } else {
                return "--";
            }
        },
        
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap:function(index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        detailsSupTabContentBindtap:function (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
        //交车附件预览
        inCarAccessories:function(objType){
            //objType  8、交车附件
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("objId", vm.cosrelief.orderCarId);
            window.localStorage.setItem("objCode", vm.cosrelief.orderCode);
            var index = layer.open({
                title: "费用减免审核 > 查看 > 交车附件 > 附件预览",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },
        //费用减免附件查询
        reliefAccessory:function (objType) {
            //objType  8、交车附件
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("objId", vm.cosrelief.costReliefId);

            var index = layer.open({
                title: "费用减免审核 > 查看 > 费用减免附件 > 附件预览",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
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
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[0];
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
    //拒绝按钮操作
    $("#refuse").on('click', function(){
        refuse();
    });
    //同意
    $("#agree").on('click', function(){
        agree();
    });
    //返回
    $("#cancel").on('click', function(){
        closePage();
    });
    //返回
    $("#reback").on('click', function(){
        closePage();
    });


}

function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
     // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.cosrelief.costReliefId,
            auditType: 29
        },
        cols: [[
            {field:'operatorName', align:'center', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', align:'center', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', align:'center', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
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
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {

}

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    //parent.vm.reload();
    parent.layer.close(index);
}
