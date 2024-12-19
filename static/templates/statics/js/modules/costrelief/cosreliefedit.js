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
        detailsTabContentList: [
            '详情',
            '操作记录',
        ],
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
    updated: function(){
        layui.form.render();
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
    methods: {
        closePage:function(){
            closePage();
        },
        refuse:function(){
            refuse();
        },
        agree:function(){
            agree();
        },
        cancel:function(){
            closePage();
        },
        reback:function(){
            closePage();
        },
        detailsTabContentBindtap:function (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        detailsSupTabContentBindtap:function(param, val) {
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
    // initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

// function initClick() {
//     $("#closePage").on('click', function(){
//         closePage();
//     });
//     //拒绝按钮操作
//     $("#refuse").on('click', function(){
//         refuse();
//     });
//     //同意
//     $("#agree").on('click', function(){
//         agree();
//     });
//     //返回
//     $("#cancel").on('click', function(){
//         closePage();
//     });
//     //返回
//     $("#reback").on('click', function(){
//         closePage();
//     });
//
//
// }

function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.cosrelief.costReliefId,
            auditType: 29
        },
        cols: [[
            {field:'operatorName', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
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
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
  //parent.vm.reload();
    parent.layer.close(index);
}

//拒绝操作
function  refuse() {
    window.localStorage.setItem("costReliefId", vm.cosrelief.costReliefId);
    window.localStorage.setItem("processingState", 3);
    var index = layer.open({
        title: "拒绝",
        type: 2,
        area: ['40%', '40%'],
        content: tabBaseURL + "modules/costrelief/cosreliefdispose.html",
        end: function () {
            layer.close(index);
            window.localStorage.setItem("costReliefId", null);
            window.localStorage.setItem("processingState", null);
        }

    });
    //layer.full(index);
}
//同意操作操作
function agree() {
     
    window.localStorage.setItem("costReliefId", vm.cosrelief.costReliefId);
    window.localStorage.setItem("processingState", 2);
    window.localStorage.setItem("creditAmount", vm.cosrelief.creditAmount);
    window.localStorage.setItem("customerId", vm.cosrelief.customerId);
    var index = layer.open({
        title: "同意减免",
        type: 2,
        area: ['40%', '40%'],
        content: tabBaseURL + "modules/costrelief/cosreliefdispose.html",
        end: function () {
            layer.close(index);
            window.localStorage.setItem("costReliefId", null);
            window.localStorage.setItem("processingState", null);
            window.localStorage.setItem("creditAmount",null);
            window.localStorage.setItem("customerId", null);
        }

    });
}