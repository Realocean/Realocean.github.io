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
        btnActive:0,
        electricTypeList:{1:'行政区域', 2:'关键字'},
        btnList:[
            {
                name:'设备信息',
                id:0,
            },
            {
                name:'电子围栏',
                id:1,
            }
        ],
        deviceInformation: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.deviceInformation = param.data;
    },
    computed:{
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        onSelectBtn(item){
            vm.btnActive = item.id
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
}

function initEventListener(layui) {
    initClick();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'vehiclemonitor/electronicFence/list',
        where: JSON.parse(JSON.stringify(vm.deviceInformation.carPlateNo)),
        cols: [[
            {
                field: 'electricType', title: '围栏类型', fixed: "left",align:"center",minWidth: 200, templet: function (d) {
                    return transformTypeByMap(d.electricType,vm.electricTypeList);
                }
            },
            {
                field: 'fenceContent', title: '围栏内容', align:"center",minWidth: 200, templet: function (d) {
                    return isEmpty(d.fenceContent);
                }
            },
            {
                field: 'alarmSettings',align:"center", title: '告警设置', minWidth: 200, templet: function (d) {
                    return isEmpty(d.alarmSettings);
                }
            },
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
