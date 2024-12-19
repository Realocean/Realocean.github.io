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

var selectChlObj;
var selectUsrObj;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        promotetaskTask: {},
        chlLst:[],
        usrLst:[],
        staffBonusValueTitle:'提成金额/元',
        staffBonusValuePlaceholder:'请输入提成金额/元',
        channelBonusValueTitle :'提成金额/元',
        channelBonusValuePlaceholder:'请输入提成金额/元',
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.promotetaskTask = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "chl/chlchannel/search/list", function (r) {
            if (r.channelList && r.channelList.length > 0) for (var i = 0; i < r.channelList.length; i++) {
                var item = r.channelList[i];
                _this.chlLst.push({
                    name:item.channelName,
                    value:item.channelId
                });
            }
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            if (r.usrLst && r.usrLst.length > 0) for (var i = 0; i < r.usrLst.length; i++) {
                var item = r.usrLst[i];
                _this.usrLst.push({
                    name:item.username,
                    value:item.userId
                });
            }
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        addTaskobj: function () {
            var index = layer.open({
                title: "添加推广任务",
                type: 2,
                area: ['80%', '80%'],
                boxParams: {
                    callback:function (type,data) {
                        switch (type) {
                            case 'sca': {
                                for (var i = 0; i < vm.promotetaskTask.taskObj.taskActivityLst.length; i++) {
                                    var item = vm.promotetaskTask.taskObj.taskActivityLst[i];
                                    if (item.scaType === data.scaType && item.scaId === data.scaId){
                                        alert('该条活动已添加');
                                        return;
                                    }
                                }
                                vm.promotetaskTask.taskObj.taskActivityLst.push(data);
                                layui.table.reload('taskactivitylstid', {data: vm.promotetaskTask.taskObj.taskActivityLst});
                                break;
                            }
                            case 'tcm': {
                                for (var i = 0; i < vm.promotetaskTask.taskObj.taskCarPlanLst.length; i++) {
                                    var item = vm.promotetaskTask.taskObj.taskCarPlanLst[i];
                                    if (item.tcmId === data.tcmId){
                                        alert('该条方案已添加');
                                        return;
                                    }
                                }
                                vm.promotetaskTask.taskObj.taskCarPlanLst.push(data);
                                layui.table.reload('taskcarplanlstid', {data: vm.promotetaskTask.taskObj.taskCarPlanLst});
                                break;
                            }
                        }
                        layer.close(index);
                    }
                },
                content: tabBaseURL + "modules/promotetask/selectortaskobj.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        saveOrUpdate: function (event) {
            if ((vm.promotetaskTask.taskObj.taskCarPlanLst.length + vm.promotetaskTask.taskObj.taskActivityLst.length) < 1){
                alert('请至少添加一条推广任务');
                return;
            }
            var promotetaskPersonnelChl = selectChlObj.getValue().map(x => {return x.value});
            var promotetaskPersonnelUsr = selectUsrObj.getValue().map(x => {return x.value});
            if (
                (vm.promotetaskTask.promotetaskObligatoryTargets.channelType == 2 && (promotetaskPersonnelChl == null || promotetaskPersonnelChl.length < 1))
                && (vm.promotetaskTask.promotetaskObligatoryTargets.staffType == 2 && (promotetaskPersonnelUsr == null || promotetaskPersonnelUsr.length < 1))
            ){
                alert('请至少选择一名推广人员');
                return;
            }
            if (vm.promotetaskTask.promotetaskObligatoryTargets.staffHasbonus == 1){
                if (vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusValue == null || vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusValue == ''){
                    if (vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusType == 1){
                        alert('请输入员工提成金额');
                        return;
                    }else if (vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusType == 2){
                        alert('请输入员工提成比例');
                        return;
                    }
                }
            }
            if (vm.promotetaskTask.promotetaskObligatoryTargets.channelHasbonus == 1){
                if (vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusValue == null || vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusValue == ''){
                    if (vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusType == 1){
                        alert('请输入渠道提成金额');
                        return;
                    }else if (vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusType == 2){
                        alert('请输入渠道提成比例');
                        return;
                    }
                }
            }
            vm.promotetaskTask.staffLst = promotetaskPersonnelUsr;
            vm.promotetaskTask.channelLst = promotetaskPersonnelChl;
            console.log(vm.promotetaskTask);
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + "promotetask/promotetasktask/save",
                contentType: "application/json",
                data: JSON.stringify(vm.promotetaskTask),
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
        skipActivityView: function (data) {
            var param;
            var viewUri;
            $.ajaxSettings.async = false;
            switch (data.scaType) {
                case 1:{
                    $.get(baseURL + "scactivity/scactivityseckill/info/"+data.scaId, function(r){
                        param = {
                            data:r.activitySeckillVo
                        };
                    });
                    viewUri = tabBaseURL + "modules/scactivity/scactivityseckillview.html";
                    break;
                }
                case 3:{
                    $.get(baseURL + "scactivity/scactivitypeer/info/"+data.scaId, function(r){
                        param = {
                            data:r.scActivityPeer,
                            listObj:r.scActivityPeer
                        };
                    });
                    param.listObj.useStores = data.scaShopName;
                    viewUri = tabBaseURL + "modules/scactivity/scactivitypeerview.html";
                    break;
                }
            }
            $.ajaxSettings.async = true;
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: viewUri,
                end: function () {
                    layer.close(index);
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
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {
    selectChlObj = xmSelect.render({
        el: '#selectChannel',
        language: 'zn',
        data: vm.chlLst
    });

    selectUsrObj = xmSelect.render({
        el: '#selectStaff',
        language: 'zn',
        data: vm.usrLst
    });

    $('input[id="staffBonusValue"]').attr({onpaste:"return false",oldValue:vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusValue});
    $('input[id="channelBonusValue"]').attr({onpaste:"return false",oldValue:vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusValue});
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_taskName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "任务名称不能为空";
                }
            }
        },
        validate_taskTime: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "任务时间不能为空";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('radio(staffType)', function (data) {
        vm.promotetaskTask.promotetaskObligatoryTargets.staffType = data.value;
    });

    form.on('radio(channelType)', function (data) {
        vm.promotetaskTask.promotetaskObligatoryTargets.channelType = data.value;
    });

    form.on('radio(staffHasbonus)', function (data) {
        vm.promotetaskTask.promotetaskObligatoryTargets.staffHasbonus = data.value;
        if (data.value == 0){
            vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusType = 1;
            vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusValue = null;
            vm.staffBonusValueTitle = '提成金额/元';
            vm.staffBonusValuePlaceholder = '请输入提成金额/元';
        }
    });

    form.on('radio(channelHasbonus)', function (data) {
        vm.promotetaskTask.promotetaskObligatoryTargets.channelHasbonus = data.value;
        if (data.value == 0){
            vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusType = 1;
            vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusValue = null;
            vm.channelBonusValueTitle = '提成金额/元';
            vm.channelBonusValuePlaceholder = '请输入提成金额/元';
        }
    });

    form.on('select(staffBonusType)', function (data) {
        if (data.value == 1){
            vm.staffBonusValueTitle = '提成金额/元';
            vm.staffBonusValuePlaceholder = '请输入提成金额/元';
        }else if (data.value == 2){
            vm.staffBonusValueTitle = '提成比例(%)';
            vm.staffBonusValuePlaceholder = '请输入提成比例(%)';
        }
        if (vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusType != data.value){
            vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusValue = null;
        }
        vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusType = data.value;
    });

    form.on('select(channelBonusType)', function (data) {
        if (data.value == 1){
            vm.channelBonusValueTitle = '提成金额/元';
            vm.channelBonusValuePlaceholder = '请输入提成金额/元';
        }else if (data.value == 2){
            vm.channelBonusValueTitle = '提成比例(%)';
            vm.channelBonusValuePlaceholder = '请输入提成比例(%)';
        }
        if (vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusType != data.value){
            vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusValue = null;
        }
        vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusType = data.value;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });

    $("#addTaskobj").on('click', function () {
        vm.addTaskobj();
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "taskactivitylstid",
        elem: '#taskActivityLst',
        data: vm.promotetaskTask.taskObj.taskActivityLst,
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',align:"center"},
            {field:'scaType', title: '活动类型', minWidth:200, templet: function (d) {return transformTypeByMap(d.scaType, {1:'秒杀活动',2:'集客活动',3:'同行活动',4:'抽奖活动'});}},
            {field:'scaName', title: '活动名称', minWidth:200, templet: '#skipActivity'},
            {field:'scaShopName', title: '活动门店', minWidth:200, templet: function (d) {return isEmpty(d.scaShopName);}},
            {field:'scaStartTime', title: '活动开始时间', minWidth:200, templet: function (d) {return isEmpty(d.scaStartTime);}},
            {field:'scaEndTime', title: '活动结束时间', minWidth:200, templet: function (d) {return isEmpty(d.scaEndTime);}},
        ]],
        page: true,
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
        data: vm.promotetaskTask.taskObj.taskCarPlanLst,
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',align:"center"},
            {field:'tcmName', title: '方案名称', minWidth:200, templet: function (d) {return isEmpty(d.tcmName);}},
            {field:'tcmBrandName', title: '品牌', minWidth:200, templet: function (d) {return isEmpty(d.tcmBrandName);}},
            {field:'tcmSeriesName', title: '车系', minWidth:200, templet: function (d) {return isEmpty(d.tcmSeriesName);}},
            {field:'tcmModelName', title: '车型', minWidth:200, templet: function (d) {return isEmpty(d.tcmModelName);}},
        ]],
        page: true,
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
    table.on('tool(taskActivityLst)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'del'){
            layer.confirm('确定要删除选中的记录？', function(index){
                for (var i = 0; i < vm.promotetaskTask.taskObj.taskActivityLst.length; i++) {
                    var item = vm.promotetaskTask.taskObj.taskActivityLst[i];
                    if (item.scaType === data.scaType && item.scaId === data.scaId){
                        vm.promotetaskTask.taskObj.taskActivityLst.splice(i, 1);
                        break;
                    }
                }
                layui.table.reload('taskactivitylstid', {data: vm.promotetaskTask.taskObj.taskActivityLst});
                layer.close(index);
            });
        }else if (layEvent === 'skipActivityView'){
            vm.skipActivityView(data);
        }
    });

    table.on('tool(taskCarPlanLst)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'del'){
            layer.confirm('确定要删除选中的记录？', function(index){
                for (var i = 0; i < vm.promotetaskTask.taskObj.taskCarPlanLst.length; i++) {
                    var item = vm.promotetaskTask.taskObj.taskCarPlanLst[i];
                    if (item.tcmId === data.tcmId){
                        vm.promotetaskTask.taskObj.taskCarPlanLst.splice(i, 1);
                        break;
                    }
                }
                layui.table.reload('taskcarplanlstid', {data: vm.promotetaskTask.taskObj.taskCarPlanLst});
                layer.close(index);
            });
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem: '#taskTime',
        type: 'datetime',
        range: '至',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.promotetaskTask.taskTime = value;
            var split = value.split(' 至 ');
            vm.promotetaskTask.taskStartTime = split[0];
            vm.promotetaskTask.taskFinishTime = split[1];
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function inputChange(type, obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    var max = 99999999.99;
    switch (type) {
        case 'staffBonusValue':{
            if (vm.promotetaskTask.promotetaskObligatoryTargets.staffBonusType == 2){
                max = 99.99;
            }
            break;
        }
        case 'channelBonusValue':{
            if (vm.promotetaskTask.promotetaskObligatoryTargets.channelBonusType == 2){
                max = 99.99;
            }
            break;
        }
    }
    console.log("1:" + obj.value);
    if (obj.value > new Number(max)){
        obj.value = $(obj)[0].attributes.oldvalue.value;
    }
    console.log("2:" + obj.value);
    $(obj).attr('oldValue', obj.value);
    console.log("3:" + obj.value);
}