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
        },//
        detailsTabContentList: ['任务信息', '操作记录',],
        detailsSupTabContentList: ['基本信息', '推广指标', '推广提成', '完成情况', '员工推广明细', '渠道推广明细',],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        promotetaskTask: {},
        promotetaskObligatoryTargets: {},
        finishStatus: {},
        taskStauts: '',
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.promotetaskTask = param.promotetaskTask;
        _this.promotetaskObligatoryTargets = param.promotetaskObligatoryTargets;
        _this.finishStatus = param.finishStatus;
        _this.taskStauts = param.taskStauts;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
                vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[index];
            }else {
                vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
            }

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
    initData();
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[0];
    setTimeout(function(){
        $('#obligatoryTargets').height(Math.max($('#obligatoryTargetsStaff').height(), $('#obligatoryTargetsChannel').height()));
        $('#obligatoryBonus').height(Math.max($('#obligatoryBonusStaff').height(), $('#obligatoryBonusChannel').height()));
        $('#finishStatus').height(Math.max($('#finishStatusStaff').height(), $('#finishStatusChannel').height()));
    }, 10);
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
            businessNo: vm.promotetaskTask.id,
            auditType: 51
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

    table.render({
        id: "taskactivitylstid",
        elem: '#taskActivityLst',
        url: baseURL + 'promotetask/promotetasktaskobj/queryList',
        where: {
            businessNo: vm.promotetaskTask.id,
            objtype: '1,3',
        },
        cols: [[
            {field:'scaType', title: '活动类型', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return transformTypeByMap(obj.scaType, {1:'秒杀活动',2:'集客活动',3:'同行活动',4:'抽奖活动'});
                }
            },
            {field:'scaName', title: '活动名称', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return isEmpty(obj.scaName);
                }
            },
            {field:'scaShopName', title: '活动门店', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return isEmpty(obj.scaShopName);
                }
            },
            {field:'scaStartTime', title: '活动开始时间', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return dateFormat(obj.scaStartTime);
                }
            },
            {field:'scaEndTime', title: '活动结束时间', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return dateFormat(obj.scaEndTime);
                }
            },
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

    table.render({
        id: "taskcarplanlstid",
        elem: '#taskCarPlanLst',
        url: baseURL + 'promotetask/promotetasktaskobj/queryList',
        where: {
            businessNo: vm.promotetaskTask.id,
            objtype: '8',
        },
        cols: [[
            {field:'tcmName', title: '方案名称', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return isEmpty(obj.tcmName);
                }
            },
            {field:'tcmBrandName', title: '品牌', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return isEmpty(obj.tcmBrandName);
                }
            },
            {field:'tcmSeriesName', title: '车系', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return isEmpty(obj.tcmSeriesName);
                }
            },
            {field:'tcmModelName', title: '车型', minWidth:200, templet: function (d) {
                    var obj = JSON.parse(d.sourceSnapshot).list;
                    return isEmpty(obj.tcmModelName);
                }
            },
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

    var staffDetailCols = [
        {field:'personnelName', title: '员工姓名', minWidth:200, templet: function (d) {return isEmpty(d.personnelName);}},
        {field:'deptName', title: '所属部门', minWidth:200, templet: function (d) {return isEmpty(d.deptName);}},
        {field:'status', title: '任务状态', minWidth:200, templet: function (d) {return transformTypeByMap(vm.taskStauts, {1:'未开始', 2:'进行中', 3:'已结束'});}}
    ];
    if (vm.promotetaskObligatoryTargets.staffEnroll != null && vm.promotetaskObligatoryTargets.staffEnroll !== ''){
        staffDetailCols.push({field:'enroll', title: '线索留资', minWidth:200, templet: function (d) {return isEmpty(d.enroll);}});
    }
    if (vm.promotetaskObligatoryTargets.staffShare != null && vm.promotetaskObligatoryTargets.staffShare !== ''){
        staffDetailCols.push({field:'share', title: '分享次数', minWidth:200, templet: function (d) {return isEmpty(d.share);}});
    }
    if (vm.promotetaskObligatoryTargets.staffBrowse != null && vm.promotetaskObligatoryTargets.staffBrowse !== ''){
        staffDetailCols.push({field:'browse', title: '访客数', minWidth:200, templet: function (d) {return isEmpty(d.browse);}});
    }
    if (vm.promotetaskObligatoryTargets.staffVisit != null && vm.promotetaskObligatoryTargets.staffVisit !== ''){
        staffDetailCols.push({field:'visit', title: '访问次数', minWidth:200, templet: function (d) {return isEmpty(d.visit);}});
    }
    if (vm.promotetaskObligatoryTargets.staffTurnover != null && vm.promotetaskObligatoryTargets.staffTurnover !== ''){
        staffDetailCols.push({field:'turnover', title: '成交单数', minWidth:200, templet: function (d) {return isEmpty(d.turnover);}});
    }
    staffDetailCols.push({type:'numbers', title: '排名'});
    table.render({
        id: "staffdetailid",
        elem: '#staffDetail',
        // defaultToolbar: ['filter'],
        url: baseURL + 'promotetask/promotetaskpersonnel/staffDetailLst',
        where: {
            businessNo: vm.promotetaskTask.id
        },
        cols: [staffDetailCols],
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

    var channelDetailCols = [
        {field:'personnelName', title: '员工姓名', minWidth:200, templet: function (d) {return isEmpty(d.personnelName);}},
        {field:'deptName', title: '所属部门', minWidth:200, templet: function (d) {return isEmpty(d.deptName);}},
        {field:'status', title: '任务状态', minWidth:200, templet: function (d) {return transformTypeByMap(vm.taskStauts, {1:'未开始', 2:'进行中', 3:'已结束'});}}
    ];
    if (vm.promotetaskObligatoryTargets.channelEnroll != null && vm.promotetaskObligatoryTargets.channelEnroll !== ''){
        channelDetailCols.push({field:'enroll', title: '线索留资', minWidth:200, templet: function (d) {return isEmpty(d.enroll);}});
    }
    if (vm.promotetaskObligatoryTargets.channelShare != null && vm.promotetaskObligatoryTargets.channelShare !== ''){
        channelDetailCols.push({field:'share', title: '分享次数', minWidth:200, templet: function (d) {return isEmpty(d.share);}});
    }
    if (vm.promotetaskObligatoryTargets.channelBrowse != null && vm.promotetaskObligatoryTargets.channelBrowse !== ''){
        channelDetailCols.push({field:'browse', title: '访客数', minWidth:200, templet: function (d) {return isEmpty(d.browse);}});
    }
    if (vm.promotetaskObligatoryTargets.channelVisit != null && vm.promotetaskObligatoryTargets.channelVisit !== ''){
        channelDetailCols.push({field:'visit', title: '访问次数', minWidth:200, templet: function (d) {return isEmpty(d.visit);}});
    }
    if (vm.promotetaskObligatoryTargets.channelTurnover != null && vm.promotetaskObligatoryTargets.channelTurnover !== ''){
        channelDetailCols.push({field:'turnover', title: '成交单数', minWidth:200, templet: function (d) {return isEmpty(d.turnover);}});
    }
    channelDetailCols.push({type:'numbers', title: '排名'});
    table.render({
        id: "channeldetailid",
        elem: '#channelDetail',
        // defaultToolbar: ['filter'],
        url: baseURL + 'promotetask/promotetaskpersonnel/channelDetailLst',
        where: {
            businessNo: vm.promotetaskTask.id
        },
        cols: [channelDetailCols],
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
