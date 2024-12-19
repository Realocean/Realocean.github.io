$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'contract/contractemplate/selectorTemplateList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',fixed:"right",align:"center"},
            {field:'nameTpl', title: '模版名称', minWidth:200, templet: function (d) {return isEmpty(d.nameTpl);}},
            {field:'countUse', title: '使用次数', minWidth:200, templet: function (d) {return isEmpty(d.countUse);}},
            {field:'desc', title: '模版备注', minWidth:200, templet: function (d) {return isEmpty(d.desc);}},
            {field:'operationName', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return dateFormat(d.timeCreate);}}
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
        parseData: function(res){
            if (defaultTemplate) {
                res.data.unshift(defaultTemplate);
            }
            res.data.forEach(function (d) {
                d.editable = editTemplate;
            });
            return res;
        },
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector') {
            vm.selector(data);
        } else if (layEvent === 'view') {
            vm.view(data);
        } else if (layEvent === 'edit') {
            vm.edit(data);
        }
    });
});

var action;
var callback;
var editTemplate = false;
var defaultTemplate;
var editedTemplate = {};

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            nameTpl: null,
            rentType: null,
            status: 1
        }
},
created: function(){
    var _this = this;
    var param = parent.layer.boxParams.boxParams;
    _this.q.rentType = param.rentType;
    action = param.action;
    callback = param.callback;
    editTemplate = param.editTemplate^false;
    if (param.defaultTemplate) {
        defaultTemplate = param.defaultTemplate;
    }
},
updated: function(){
    layui.form.render();
},
methods: {
    query: function () {
        vm.reload();
    },
    reset: function () {
        vm.q.nameTpl = null;
    },
    edit: function (data) {
        $.get(baseURL + "contract/contraccontent/bodyByTemplate/"+data.id, function(r){
            data.body = r;
            var index = layer.open({
                title: "编辑模板",
                type: 2,
                area: ['95%', '95%'],
                boxParams: {
                    templateBody:editedTemplate[data.id]||data.body,
                    callback: function (body) {
                        editedTemplate[data.id] = body;
                        layer.close(index);
                    }
                },
                content: tabBaseURL + "modules/contract/edittemplatebody.html",
                end: function () {
                    layer.close(index);
                }
            });
        });

    },
    view: function (_data) {
        $.get(baseURL + "contract/contraccontent/bodyByTemplate/"+_data.id, function(r){
            _data.body = r;
            var index = layer.open({
                id: 'contractemplateview',
                title: "查看",
                type: 1,
                content: editedTemplate[_data.id]||_data.body,
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        });

    },
    selector: function (data) {
        $.ajaxSettings.async = false;
        $.get(baseURL + "contract/contraccontent/bodyByTemplate/"+data.id, function(r){
            data.body = r;
        });
        $.ajaxSettings.async = true;
        if (('regenerateDocSelector' == action || 'callback' == action) && null != callback){
            callback(data.id, data.nameTpl, editedTemplate[data.id]||data.body);
        } else {
            parent.vm.order.contract = Object.assign({}, parent.vm.order.contract, {
                templateId: data.id,
                templateName: data.nameTpl,
                templateBody: editedTemplate[data.id]||data.body,
            });
            parent.vm.contractModelId = 'contractModelId_' + uuid(6);
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
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
