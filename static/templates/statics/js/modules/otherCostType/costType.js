$(function () {

    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
    });
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form', 'layedit', "layer", 'laydate', 'element', 'table', 'soulTable'], function () {
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'otherCostType/costType/list',
            cols: [[
                {title: '操作', templet: '#barTpl', width:200, fixed: "left", align: "center"},
                {field: 'costName',  title: '费用名称', align: "center"},
                {
                    field: 'costTypeName',  title: '费用归类', align: 'center'
                },

            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: false
            },
            done: function (res, curr, count) {
                layui.soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            }
        });

        layui.form.verify({
            costName: function(value){
                if (value == "" || value == null){
                    return "费用名称不能为空！";

                }
            },
            costTypes: function(value){
                if (value == "" || value == null){
                    return "费用归类不能为空！";

                }
            },

        });


        layui.form.on('submit(saveOrUpdate)', function () {
            vm.saveOrUpdate();
            return false;
        });

        layui.form.on('checkbox(itemCheck)', function(data){
            console.log(vm.costType.costType)
            if(vm.costType.costTypeList==null||vm.costType.costTypeList==''||vm.costType.costTypeList=='null'){
                vm.costType.costTypeList = [];
                vm.costType.costTypeName = [];
            }
            if (data.elem.checked) {
                vm.costType.costTypeList.push(data.value);
                vm.costType.costTypeName.push(data.elem.title);
            }else {
                vm.costType.costTypeList=vm.costType.costTypeList.filter(function (v) {return v!=data.value});
                vm.costType.costTypeName=vm.costType.costTypeName.filter(function (v) {return v!=data.elem.title});
            }

        });


        //批量删除
        $(".delBatch").click(function () {
            var ids = vm.selectedRows();
            if (ids == null) {
                return;
            }
            vm.del(ids);
        });

        //日志列表
        $(".logList").click(function () {
            var index = layer.open({
                title: "日志列表",
                type: 2,
                content: "schedule_log.html",
                end: function () {
                    layer.closeAll();
                }
            });

            layer.full(index);
        });

        //操作
        layui.table.on('tool(grid)', function (obj) {
            var layEvent = obj.event,
                data = obj.data;
            console.log(data)
            if (layEvent === 'edit') {
                vm.update(data.id);
            } else if (layEvent === 'start') {
                vm.start(data);
            } else if (layEvent === 'stop') {
                vm.stop(data);
            } else if (layEvent === 'del') {
                var id = data.id;
                vm.del(id);
            }
        });

        layui.form.on('radio(platform)', function(data){
            vm.costType.costType = data.value;
        });
        layui.form.render();
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            costName: null
        },
        showForm: false,
        costType: {
            id:null,
            costName:null,
            costType:null,
            startOrStop:null,
            costTypeList:[]
        },
        costTypeDict:[
            {key:0,label:"其他收入"},
            {key:1,label:"其他支出"}
        ],
    },
    created :function (){
        var _this = this;
        var parent = $('#accessoryGroup');
        _this.costTypeDict.forEach(function (d) {
            parent.append('<input type="checkbox" lay-filter="itemCheck" v-model="costType.costTypeList" name="accessoryItems" value="'+d.key+'" lay-skin="primary" title="'+d.label+'" '+'>');
        });
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
  /*      selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var ids = [];
            $.each(list, function (index, item) {
                ids.push(item.jobId);
            });
            return ids;
        },*/
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.costType = {};
            var index = layer.open({
                title: "新增费用类型",
                type: 1,
                area: ['50%', '90%'],
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
        },
        update: function (id) {
            $.get(baseURL + "otherCostType/costType/info/" + id, function (r) {
                vm.costType = r.data;
                vm.costType.costTypeList = r.data.costType.split(",");
            });

            var index = layer.open({
                title: "修改费用类型",
                type: 1,
                area: ['50%', '90%'],
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
        },
        saveOrUpdate: function (event) {
            vm.costType.costType=vm.costType.costTypeList.toString()
            vm.costType.costTypeName=vm.costType.costTypeName.toString()
            var url = vm.costType.id == null ? "otherCostType/costType/save" : "otherCostType/costType/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.costType),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        cancel: function (event) {
            vm.showForm = false;
            layer.closeAll();
        },
        reset: function () {
            vm.q = {
                costName: null,
            }
            vm.reload();
        },


        del: function (id) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "DELETE",
                    url: baseURL + "otherCostType/costType/deleteById/"+id,
                    contentType: "application/json",
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        //启用
        start: function (data) {
            confirm('确定要启用选中的记录？', function () {
                data.startOrStop=0;
                $.ajax({
                    type: "POST",
                    url: baseURL + "otherCostType/costType/startOrStop",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        //禁用
        stop: function (data) {
            confirm('确定要禁用选中的记录？', function () {
                data.startOrStop=1;
                $.ajax({
                    type: "POST",
                    url: baseURL + "otherCostType/costType/startOrStop",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    costName: vm.q.costName
                }
            });
        }
    }
});