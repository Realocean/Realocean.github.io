function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
// 交管平台车辆类型
var hpCodeEnum = {
    "10": "领馆摩托车",
    "11": "境外摩托车",
    "12": "外籍摩托车",
    "13": "低速车",
    "14": "拖拉机",
    "15": "挂车",
    "16": "教练汽车",
    "17": "教练摩托车",
    "18": "试验汽车",
    "19": "试验摩托车",
    "20": "临时入境汽车",
    "21": "临时入境摩托车",
    "22": "临时行驶车",
    "23": "警用汽车",
    "24": "警用摩托",
    "25": "原农机号牌",
    "26": "香港入出境车",
    "27": "澳门入出境车",
    "51": "大型新能源汽车",
    "52": "小型新能源汽车",
    "02": "小型汽车",
    "03": "使馆汽车",
    "04": "领馆汽车",
    "05": "境外汽车",
    "06": "外籍汽车",
    "07": "普通摩托车",
    "08": "轻便摩托车",
    "09": "使馆摩托车"
}
$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: `${baseURL}/car/illegalWorkOrder/workOrderCarPage?workOrderNo=${getQueryString('workOrderNo')}&tenantId=${localStorage.getItem("tenantId")}`,
        cols: [[
            {field: 'carNo', minWidth: 100, title: '车牌号', fixed: "left",align: "center",templet:(d)=>isEmpty(d.carNo)},
            {field: 'vinNo', minWidth: 100, title: '车架号', align: "center",templet:(d)=>isEmpty(d.vinNo)},
            {field: 'hpCode', minWidth: 100, title: '车辆类型', align: "center",templet:(d)=> {
                    var hpCode = isEmpty(d.hpCode);
                    if('--'==hpCode){
                        return hpCode;
                    }
                    return hpCodeEnum[hpCode];
                }},
            {field: 'deptName', minWidth: 100, title: '车辆所属公司', align: "center",templet:(d)=>isEmpty(d.deptName)},
            {field: 'queryAccount', minWidth: 100, title: '查询账号', align: "center",templet:(d)=>isEmpty(d.queryAccount)},
            {field: 'platformStr', minWidth: 100, title: '查询平台', align: "center",templet:(d)=>isEmpty(d.platformStr)},
            {field: 'queryStatus', minWidth: 100, title: '查询状态', align: "center",templet:(d)=> {
                    var queryStatus = isEmpty(d.queryStatus);
                    if (queryStatus == '--') {
                        return queryStatus;
                    }
                    return vm.queryStatusDictMap[queryStatus].label;
                }}
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
    layui.form.render();
});
// 创建vue应用
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            workOrderNo: null,
            startCommitTime: null,
            endCommitTime: null,
            startProcessingTime: null,
            endProcessingTime: null,
            commitMan: null,
            queryStatus: null,
        },
        workOrderNo: 0,
        commitMan: null,
        commitTime: null,
        processingTime: null,
        processingStatus: null,
        processingStatusStr: null,
        processingStatusDict:[
            {key:1,label:"未处理"},
            {key:2,label:"已处理"}
        ],
        processingStatusDictMap:{},
        queryStatusDict:[
            {key:1,label:"未查询"},
            {key:2,label:"已查询"},
            {key:3,label:"查询失败"}
        ],
        queryStatusDictMap:{},
    },
    created: function (){
        // 构建map数据方便变更单位
        for(var index in this.processingStatusDict){
            var processingStatusItem = this.processingStatusDict[index];
            this.processingStatusDictMap[processingStatusItem.key] = processingStatusItem;
        }
        for(var index in this.queryStatusDict){
            var queryStatusItem = this.queryStatusDict[index];
            this.queryStatusDictMap[queryStatusItem.key] = queryStatusItem;
        }
        $.get(`${baseURL}/car/illegalWorkOrder/info/${getQueryString('workOrderNo')}`, function (r) {
            if(!r || !r.data){
                return false;
            }
            vm.processingStatus = r.data.processingStatus;
            vm.processingStatusStr = vm.processingStatusDictMap[vm.processingStatus].label;
            vm.processingTime = r.data.processingTime;
            // 初始化公共属性
            vm.workOrderNo = r.data.workOrderNo;
            vm.commitMan = r.data.commitMan;
            vm.commitTime = r.data.commitTime;
        });
        // 数据太多了，需要出现滚动条
        $(parent.document).find(".layui-layer-content iframe:eq(0)")[0].scrolling='yes'
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 查询按钮事件
        query: function () {
            var startCommitTimeComplete = vm.q.startCommitTime?vm.q.startCommitTime+' 00:00:00':null;
            var endCommitTimeComplete = vm.q.endCommitTime?vm.q.endCommitTime+' 23:59:59':null;
            var startProcessingTimeComplete = vm.q.startProcessingTime?vm.q.startProcessingTime+' 00:00:00':null;
            var endProcessingTimeComplete = vm.q.endProcessingTime?vm.q.endProcessingTime+' 23:59:59':null;
            layui.table.reload('gridid', {
                // 分页参数
                page: {
                    curr: 1
                },
                // 查询条件
                where: {
                    workOrderNo: vm.q.workOrderNo,
                    startCommitTime:  startCommitTimeComplete,
                    endCommitTime:  endCommitTimeComplete,
                    startProcessingTime:  startProcessingTimeComplete,
                    endProcessingTime:  endProcessingTimeComplete,
                    commitMan: vm.q.commitMan,
                    queryStatus: vm.q.queryStatus
                }
            });
        }
    }
});