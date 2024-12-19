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
        view: function (data) {
            $.get(baseURL + "scactivity/scactivitypeer/info/"+data.id, function(r){
                var param = {
                    data:r.scActivityPeer,
                    listObj:data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/scactivity/scactivitypeerview.html",
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
                    peerTitle: null, // 活动名称
                    timeStart: null, // 活动开始时间
                    timeEnd: null, // 活动结束时间
                    inventedJoinNumber: null, // 虚拟报名人数量
                    detailImage: '', // 活动上方的头图
                    invite: 1, // 邀请设置
                    isReferralBonuses: 1, // 邀请设置
                    peerContent: '', // 活动介绍
                    // 添加同行活动商品
                    activitySeckillList: [],
                    // 活动地址
                    activityUnit: [],
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/scactivity/scactivitypeeredit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "scactivity/scactivitypeer/info/"+id, function(r){
                var param = {
                    data:r.scActivityPeer
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/scactivity/scactivitypeeredit.html",
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
                    url: baseURL + "scactivity/scactivitypeer/delete",
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
        suspendedePeer: function (id, status) {
            confirm('确定要'+(status == 2 ? '启用':status == 3 ? '暂停':status == 4 ? '结束':'操作')+'选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "scactivity/scactivitypeer/suspendedePeer?id="+id+"&status"+status,
                    contentType: "application/json",
                    data: JSON.stringify({
                        id:id,
                        status:status
                    }),
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
        share: function (id) {
            var index = layer.open({
                title: "活动小程序分享码，客户扫码直达活动页面",
                type: 2,
                area: ['50%', '60%'],
                boxParams: {
                    data: id
                },
                content: tabBaseURL + "modules/scactivity/sharescactivitypeer.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        copy: function (id) {
            $.get(baseURL + "scactivity/scactivitypeer/info/"+id, function(r){
                var param = {
                    data:r.scActivityPeer
                };
                if (param.data.id) delete param.data.id;
                if (param.data.status) delete param.data.status;
                if (param.data.tenantId) delete param.data.tenantId;
                if (param.data.createBy) delete param.data.createBy;
                if (param.data.createTime) delete param.data.createTime;
                if (param.data.updateBy) delete param.data.updateBy;
                if (param.data.updateTime) delete param.data.updateTime;
                if (param.data.activitySeckillList){
                    for (var item of param.data.activitySeckillList) {
                        if (item.id) delete item.id;
                        if (item.peerId) delete item.peerId;
                    }
                }
                var index = layer.open({
                    title: "复制活动",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/scactivity/scactivitypeeredit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        datas: function (data) {
            var param = {
                data:data
            };
            var index = layer.open({
                title: "活动数据",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/scactivity/scactivitypeerdatas.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'scactivity/scactivitypeer/export', vm.q);
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
                    form[0].action = baseURL + 'scactivity/scactivitypeer/downxlserr';
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
            {type: 'text', label: '活动名称', placeholder: '请输入活动名称', fieldName: 'peerTitle',},
            {type: 'select', label: '活动状态', placeholder: '请选择活动状态', fieldName: 'status', selectMap: {
                    1:'未开始', 2:'进行中', 3:'暂停中', 4:'已结束',
                }, selectFilter: true
            },
            {type: 'dateori', label: '活动开始时间', placeholder: '请选择活动开始时间', fieldName: 'timeStart',selectFilter: true},
            {type: 'dateori', label: '活动结束时间', placeholder: '请选择活动结束时间', fieldName: 'timeEnd',selectFilter: true},
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
        url: baseURL + 'scactivity/scactivitypeer/imports',
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
        url: baseURL + 'scactivity/scactivitypeer/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:150, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'peerTitle', title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.peerTitle);}},
            {field:'status', title: '活动状态', minWidth:200, templet: function (d) {return transformTypeByMap(d.status, {1:'未开始', 2:'进行中', 3:'暂停中', 4:'已结束'});}},
            {field:'useStores', title: '活动门店', minWidth:200, templet: function (d) {return isEmpty(d.useStores);}},
            {field:'timeStart', title: '活动开始时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.timeStart);}},
            {field:'timeEnd', title: '活动结束时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.timeEnd);}},
            {field:'inventedJoinNumber', title: '虚拟报名人数', minWidth:200, templet: function (d) {return isEmpty(d.inventedJoinNumber);}},
            {field:'invite', title: '邀请设置', minWidth:200, templet: function (d) {return transformTypeByMap(d.invite, {1:'无限制', 2:'仅能邀请新客'});}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return dateFormat(d.createTime);}},
            {field:'createBy', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.createBy);}},
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
        } else if(layEvent === 'start'){
            vm.suspendedePeer(data.id, 2);
        } else if(layEvent === 'stop'){
            vm.suspendedePeer(data.id, 3);
        } else if(layEvent === 'finish'){
            vm.suspendedePeer(data.id, 4);
        } else if(layEvent === 'share'){
            vm.share(data.id);
        } else if(layEvent === 'copy'){
            vm.copy(data.id);
        } else if(layEvent === 'datas'){
            vm.datas(data);
        }
    });
}

function initDate(laydate) {

}
