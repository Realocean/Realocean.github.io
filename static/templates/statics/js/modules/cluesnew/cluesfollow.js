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
                            '线索详情',
                            '操作记录',
                    ],
        detailsSupTabContentList: [
                            '基本信息',
                            '跟进详情',
                            '线索跟进',
                    ],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        clues: {},
        listCluesDeal: [],
        cluesDeal: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.clues = param.data;
        _this.cluesDeal.cluesId = param.data.cluesId;
        _this.cluesDeal.cluesType = 6;
        _this.cluesDeal.followType = '';
        _this.cluesDeal.cluesStatus = '';
        _this.cluesDeal.intentionStatus = '';
        _this.cluesDeal.dealProcessorId = sessionStorage.getItem("userId");
        _this.cluesDeal.dealProcessor = sessionStorage.getItem("username");
        _this.cluesDeal.newFollowDeptId = sessionStorage.getItem("userdeptId");
        _this.cluesDeal.newFollowDeptName = sessionStorage.getItem("userdeptName");
        _this.cluesDeal.oldFollowId = param.data.followId;
        _this.cluesDeal.oldFollowName = param.data.followName;
        _this.cluesDeal.oldFollowDeptId = param.data.followDeptId;
        _this.cluesDeal.oldFollowDeptName = param.data.followDeptName;
        _this.cluesDeal.operatorId = sessionStorage.getItem("userId");
        _this.cluesDeal.operatorName = sessionStorage.getItem("username");

        // _this.clues.followId = sessionStorage.getItem("userId");
        // _this.clues.followName = sessionStorage.getItem("username");
        // _this.clues.followDeptId = sessionStorage.getItem("userdeptId");
        // _this.clues.followDeptName = sessionStorage.getItem("userdeptName");
        _this.clues.countFollow = _this.clues.countFollow + 1;

        _this.listCluesDeal = param.data.cluesDealLst;
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
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
        saveOrUpdate: function (event) {
            vm.clues.cluesState = vm.cluesDeal.cluesStatus;
            vm.clues.intentionStatus = vm.cluesDeal.intentionStatus;
            // if (vm.cluesDeal.dealProcessorId == vm.cluesDeal.oldFollowId){
            //     vm.clues.followType = 1;
            // }else vm.clues.followType = 2;
            if (vm.clues.followId == vm.clues.operatorId){
                vm.clues.followType = 1;
            }else vm.clues.followType = 2;
            vm.clues.cluesDeal = vm.cluesDeal;
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + 'cluesnew/clues/cluesfollow',
                contentType: "application/json",
                data: JSON.stringify(vm.clues),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
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
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[0];
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_cluesStatus: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择线索状态";
            }
        },
        validate_intentionStatus: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择意向情况";
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('select(cluesStatus)', function (data) {
        vm.cluesDeal.cluesStatus = data.value;
    });

    form.on('select(intentionStatus)', function (data) {
        vm.cluesDeal.intentionStatus = data.value;
    });

    form.on('select(followType)', function (data) {
        vm.cluesDeal.followType = data.value;
    });
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
            businessNo: vm.clues.id,
            auditType: 44
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
    parent.vm.reload();
    parent.layer.close(index);
}
