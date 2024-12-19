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
                            '承租方认证',
                            '操作记录',
                    ],
        detailsSupTabContentList: [
                            '基本信息',
                            '签章信息',
                            '操作记录',
                    ],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        leaseeAuth: {},
        fileLst:[],
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.leaseeAuth = param.data;
        if (_this.leaseeAuth.sealType == 0){
            fileLst.push(_this.leaseeAuth.localSeal);
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[index];
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initUpload(upload) {
    localSealF = Upload({
        elid: 'localSealF',
        edit: false,
        fileLst: vm.fileLst,
        param: {'path':'seal-local'},
        fidedesc: '签章附件',
        maxLength: 1,

    });
    localSealF.initView();
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[0];
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
}

function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.leaseeAuth.id,
            auditType: 73
        },
        cols: [[
            {field:'operatorName',align:'center', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo',align:'center', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate',align:'center', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
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
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}
