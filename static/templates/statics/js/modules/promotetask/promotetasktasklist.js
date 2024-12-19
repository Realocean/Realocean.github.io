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
            keyword: null,
            type: null,
            timeDate: null,
            timeDatestart: null,
            timeDateend: null,
        },
        isClose: true,
        taskTypeList: [],
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/dict/getMiniInfoByType/"+"taskType", function (r) {
            _this.taskTypeList = r.dict;
        })
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
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
            resetNULL(vm.q);
        },
        view: function (data) {
            $.get(baseURL + "promotetask/promotetasktask/info/"+data.id, function(r){
                var param = {
                    promotetaskTask:r.promotetaskTask,
                    promotetaskObligatoryTargets:r.promotetaskObligatoryTargets,
                    finishStatus:r.finishStatus,
                    taskStauts:data.taskStauts,
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/promotetask/promotetasktaskview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{
                    taskObj:{
                        taskCarPlanLst:[],
                        taskActivityLst:[]
                    },
                    promotetaskObligatoryTargets:{
                        staffEnroll:null,
                        staffShare:null,
                        staffBrowse:null,
                        staffVisit:null,
                        staffTurnover:null,
                        staffType:1,
                        staffHasbonus:0,
                        staffBonusType:1,
                        staffBonusValue:null,
                        channelEnroll:null,
                        channelShare:null,
                        channelBrowse:null,
                        channelVisit:null,
                        channelTurnover:null,
                        channelType:1,
                        channelHasbonus:0,
                        channelBonusType:1,
                        channelBonusValue:null
                    },
                    staffLst:[],
                    channelLst:[]
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/promotetask/promotetasktaskedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "promotetask/promotetasktask/info/"+id, function(r){
                var param = {
                    data:r.promotetaskTask
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/promotetask/promotetasktaskedit.html",
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
                    url: baseURL + "promotetask/promotetasktask/delete",
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
            window.location.href = urlParamByObj(baseURL + 'promotetask/promotetasktask/export', vm.q);
        },
        importSuccess: function (map) {
            var btn = [];
            var isdownxls = map.allCount != null && Number(map.allCount || 1) !== Number(map.successCount || 0);
            if (isdownxls) {
                btn.push('下载失败数据');
            }
            btn.push('关闭');
            var index = layer.confirm(map.message, {
                btn: btn
            }, function () {
                if (isdownxls) {
                    var form = $('form#downLoadXls');
                    form.find('input[name="datas"]').val(JSON.stringify(map.errDatas));
                    form[0].action = baseURL + 'promotetask/promotetasktask/downxlserr';
                    form.submit();
                }
                layer.close(index);
                vm.reload();
            }, function () {
                layer.close(index);
                vm.reload();
            });
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

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '推广内容名称', placeholder: '请输入推广内容名称', fieldName: 'content',},
            {type: 'text', label: '任务名称', placeholder: '请输入任务名称', fieldName: 'taskName',},
            {type: 'select', label: '任务状态', placeholder: '请选择任务状态', fieldName: 'taskStatus', selectMap: {
                    1:'未开始',
                    2:'进行中',
                    3:'已结束',
                }, selectFilter: true
            },
            {type: 'select', label: '推广类型', fieldName: 'taskType', selectListValueName: 'dictCode', selectListTxtName: 'dictValue', selectList: vm.taskTypeList, selectFilter: true},
            {type: 'date', label: '创建时间', placeholder: '选择日期范围', fieldName: 'timeCreate', selectFilter: true},
            {type: 'date', label: '任务开始时间', placeholder: '选择日期范围', fieldName: 'taskStartTime', selectFilter: true},
            {type: 'date', label: '任务结束时间', placeholder: '选择日期范围', fieldName: 'taskFinishTime', selectFilter: true},
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
                    vm.exports();
                    break;
                }
            }
        }
    }).initView();
}


function initUpload(upload) {
    upload.render({
        elem: '#inports',
        url: baseURL + 'promotetask/promotetasktask/imports',
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        before: function (obj) {
            layer.msg('数据导入中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (res) {
            layer.close(layer.msg());
            if (parseInt(res.code) === 0) {
                vm.importSuccess(res);
            } else {
                layer.msg('文件解析失败:' + res.msg, {icon: 5});
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
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
        toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'promotetask/promotetasktask/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',align:"center"},
            {field:'taskName', title: '任务名称', minWidth:200, templet: function (d) {return isEmpty(d.taskName);}},
            {field:'taskobjType', title: '推广类型', minWidth:200, templet: function (d) {
                    /*var typeList = [];
                    for (var i = 0; i < vm.taskTypeList.length; i++) {
                        var item = vm.taskTypeList[i];
                        var taskobjType = d.taskobjType^0;
                        if (((item.dictCode^0) & taskobjType) === 1){
                            typeList.push(item.dictValue);
                        }
                    }
                    if (typeList.length === 0){
                        return '--';
                    }else return jointStr('/', typeList);*/
                    return isEmpty(d.taskobjTypeStr);
                }
            },
            {field:'content', title: '推广内容名称', minWidth:200, templet: function (d) {return isEmpty(d.content);}},
            {field:'taskStauts', title: '任务状态', minWidth:200, templet: function (d) {return transformTypeByMap(d.taskStauts, {1:'未开始', 2:'进行中', 3:'已结束'});}},
            {field:'sourceFrom', title: '任务来源', minWidth:200, templet: function (d) {return isEmpty(d.sourceFrom);}},
            {field:'staffTxt', title: '推广员工', minWidth:200, templet: function (d) {return isEmpty(d.staffTxt);}},
            {field:'channelTxt', title: '推广渠道', minWidth:200, templet: function (d) {return isEmpty(d.channelTxt);}},
            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return dateFormat(d.timeCreate);}},
            {field:'taskStartTime', title: '任务开始时间', minWidth:200, templet: function (d) {return dateFormat(d.taskStartTime);}},
            {field:'taskFinishTime', title: '任务结束时间', minWidth:200, templet: function (d) {return dateFormat(d.taskFinishTime);}}
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
            vm.view(data);
        }
    });
}

function initDate(laydate) {

}
