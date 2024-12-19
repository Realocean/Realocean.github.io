$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });


    //状态
    layui.form.on('switch(templateStatus)', function(data){
        var index = layer.msg('修改中，请稍候',{icon: 16,time:false});
        var status = 0;
        if(data.elem.checked){
            status = 1;
        }
        vm.updateStatus(data.value, status);

        layer.close(index);
    });

    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);

        layui.form.on('select(selectMsgType)', function (data) {
            vm.q.msgType = data.value;
        });

        layui.form.on('select(selectTemplateStatus)', function (data) {
            vm.q.templateStatus = data.value;
        });

        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            msgType: null,
            templateStatus:null,
            msgContent:null
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
            vm.q.msgType = null;
            vm.q.msgContent = null;
            vm.q.templateStatus = null;
        },

        updateStatus: function (id, status) {
            $.ajax({
                type: "POST",
                url: baseURL + "message/messagetemplate/status",
                data: {id: id, templateStatus: status},
                success: function(r){
                    if(r.code == 0){
                        layer.alert('操作成功', function(index){
                            layer.close(index);
                            vm.reload();
                        });
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },

        view: function (id) {
            $.get(baseURL + "message/messagetemplate/info/"+id, function(r){
                var param = {
                    data:r.messageTemplate
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/message/messagetemplateview.html",
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
                content: tabBaseURL + "modules/message/messagetemplateedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "message/messagetemplate/info/"+id, function(r){
                var param = {
                    data:r.messageTemplate
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/message/messagetemplateedit.html",
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
                    url: baseURL + "message/messagetemplate/delete",
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
            var url = baseURL + 'message/messagetemplate/export?a=a';
            if(vm.q.keyword != null && vm.q.keyword != ''){
                url += ('&keyword='+vm.q.keyword);
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    msgContent: vm.q.msgContent,
                    msgType: vm.q.msgType,
                    templateStatus: vm.q.templateStatus
                }
            });
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
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
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'message/messagetemplate/queryList',
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'msgContent', title: '消息内容', align:'center',minWidth:420, templet: function (d) {return isEmpty(d.msgContent);}},
            {field:'msgType', title: '消息类型',align:'center', minWidth:50, templet: function (d) {
                    if (d.msgType == 1) {
                        return "短信";
                    } else if (d.msgType == 2) {
                        return "站内信";
                    } else {
                        return isEmpty(d.msgType);
                    }
            }},
            {field:'templateValue', title: '模板类型',align:'center', minWidth:150, templet: function (d) {return isEmpty(d.templateValue);}},
            {field:'templateStatus', title: '可用状态',align:'center', minWidth:100, templet: '#statusTpl'},
            {field:'createTime', title: '创建时间',align:'center', minWidth:150, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'updateTime', title: '更新时间',align:'center', minWidth:150, templet: function (d) {return isEmpty(d.updateTime);}},
            
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
