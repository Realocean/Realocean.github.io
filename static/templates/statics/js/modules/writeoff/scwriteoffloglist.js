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
        q: {
            detailName: null,
            activityType: null,
            memberName: null,
            storeId: null,
            writeOffUser: null,
        },
        deptList:[]
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList;
            console.log(_this.deptList);
        });
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
            var param = {};
            $.ajaxSettings.async = false;
            $.get(baseURL + "writeoff/scwriteofflog/info/"+id, function(r){
                param.data = r.scWriteOffLog;
                param.goodsList = r.goodsList;
            });
            if( param.data != null && param.data.orderNo != null && param.data.activityType != 5){
                $.get(baseURL + "activityorder/scorderactivity/info/"+param.data.orderNo, function(r){
                    param.scOrderServiceInfo = r.scOrderServiceInfo;
                    param.scOrderActivity = r.scOrderActivity;
                });
            }
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/writeoff/scwriteofflogview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "快速核销",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/writeoff/scwriteofflogedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "writeoff/scwriteofflog/info/"+id, function(r){
                var param = {
                    data:r.scWriteOffLog
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/writeoff/scwriteofflogedit.html",
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
                    url: baseURL + "writeoff/scwriteofflog/delete",
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
            window.location.href = urlParamByObj(baseURL + 'writeoff/scwriteofflog/export', vm.q);
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
                    form[0].action = baseURL + 'writeoff/scwriteofflog/downxlserr';
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
            {type: 'text', label: '活动名称', placeholder: '请输入活动名称', fieldName: 'detailName',selectFilter: true},
            {type: 'select', label: '活动类型', placeholder: '全部', fieldName: 'activityType', selectMap: {
                    1:'秒杀活动',
                    2:'集客活动',
                    3:'同行活动',
                    4:'抽奖活动',
                    5:'优惠券',
                }, selectFilter: true
            },
            {type: 'text', label: '客户名称', placeholder: '请输入客户名称', fieldName: 'memberName',selectFilter: false},
            {type: 'select', label: '所属部门', placeholder: '全部', fieldName: 'storeId',selectFilter: false,selectList:vm.deptList,selectListValueName: 'deptId', selectListTxtName: 'name' },
            {type: 'text', label: '核销人员', placeholder: '请输入核销人员', fieldName: 'writeOffUser',selectFilter: false},
            /*{type: 'date', label: '日期', placeholder: '选择日期范围', fieldName: 'timeDate', selectFilter: true},*/
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
        url: baseURL + 'writeoff/scwriteofflog/imports',
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
        url: baseURL + 'writeoff/scwriteofflog/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'typeName', title: '活动类型', minWidth:200, templet: function (d) {return isEmpty(d.typeName);}},
            {field:'detailName', title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.detailName);}},
            {field:'orderNo', title: '核销码', minWidth:200, templet: function (d) {return isEmpty(d.orderNo);}},
            {field:'memberName', title: '客户名称', minWidth:200, templet: function (d) {return isEmpty(d.memberName);}},
            {field:'memberPhone', title: '联系电话', minWidth:200, templet: function (d) {return isEmpty(d.memberPhone);}},
            {field:'writeLogStatus', title: '核销状态', minWidth:200, templet: function (d) {return '已核销';}},
            {field:'writeOffTime', title: '核销时间', minWidth:200, templet: function (d) {return dateFormatYMDHM(d.writeOffTime);}},
            {field:'writeOffUser', title: '核销人员', minWidth:200, templet: function (d) {return isEmpty(d.writeOffUser);}},
            {field:'storeName', title: '所属部门/门店', minWidth:200, templet: function (d) {return isEmpty(d.storeName);}},
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
            vm.view(data.id);
        }
    });
}

function initDate(laydate) {

}
