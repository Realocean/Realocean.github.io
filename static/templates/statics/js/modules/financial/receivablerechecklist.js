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
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
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
        view: function (id) {
            $.get(baseURL + "financial/receivablerecheck/info/"+id, function(r){
                var param = {
                    data:r.receivableRecheck
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: baseURL + "modules/financial/receivablerecheckview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: baseURL + "modules/financial/receivablerecheckedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "financial/receivablerecheck/info/"+id, function(r){
                var param = {
                    data:r.receivableRecheck
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: baseURL + "modules/financial/receivablerecheckedit.html",
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
                    url: baseURL + "financial/receivablerecheck/delete",
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
            window.location.href = urlParamByObj(baseURL + 'financial/receivablerecheck/export', vm.q);
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
                    form[0].action = baseURL + 'financial/receivablerecheck/downxlserr';
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
            {type: 'text', label: '关键字', placeholder: '请输入关键字', fieldName: 'keyword',},
            {type: 'select', label: '状态', placeholder: '请选择状态', fieldName: 'type', selectMap: {
                    0:'正常',
                    1:'禁用',
                }, selectFilter: true
            },
            {type: 'date', label: '日期', placeholder: '选择日期范围', fieldName: 'timeDate', selectFilter: true},
            //{type: 'selectcascader', label: '品牌/车系/车型', placeholder: '请选择品牌/车系/车型', fieldName: 'modelId', selectList: vm.carTreeList},
            //{type: 'select', label: '出租方', fieldName: 'lessorId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: vm.deptList, selectFilter: true},
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
        url: baseURL + 'financial/receivablerecheck/imports',
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
        url: baseURL + 'financial/receivablerecheck/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'id', title: '主键id', minWidth:200, templet: function (d) {return isEmpty(d.id);}},
                            {field:'receivableId', title: '应收单id', minWidth:200, templet: function (d) {return isEmpty(d.receivableId);}},
                            {field:'receivableNo', title: '应收单号', minWidth:200, templet: function (d) {return isEmpty(d.receivableNo);}},
                            {field:'remark', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.remark);}},
                            {field:'operationId', title: '提交人id', minWidth:200, templet: function (d) {return isEmpty(d.operationId);}},
                            {field:'operationName', title: '提交人姓名', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
                            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
                            {field:'timeUpdate', title: '更新时间', minWidth:200, templet: function (d) {return isEmpty(d.timeUpdate);}},
                            {field:'delect', title: '删除状态（0未删除，1已删除）', minWidth:200, templet: function (d) {return isEmpty(d.delect);}},
                            {field:'tenantId', title: '租户id', minWidth:200, templet: function (d) {return isEmpty(d.tenantId);}},
            
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
            vm.view(data.id);
        }
    });
}

function initDate(laydate) {

}