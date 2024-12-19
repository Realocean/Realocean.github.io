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
            schemeName: null,
            brandId: null,
            seriesId: null,
            modelId: null,
            schemeType: null,
            sort: null,
        },
        isClose: true,
        allCarModels:[],
        isFilter:false
    },
    created: function () {
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.allCarModels,
                    success: function (valData,labelData) {
                        if(valData.length>2){
                            vm.q.brandId = valData[0];
                            vm.q.seriesId = valData[1];
                            vm.q.modelId = valData[2];
                        }else {
                            vm.q.brandId = valData[0];
                            vm.q.seriesId = valData[1];
                            vm.q.modelId =null;
                        }

                    }
                });
            });
        });
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

            var schemeIds = [];
            $.each(list, function(index, item) {
                schemeIds.push(item.schemeId);
            });
            return schemeIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
                vm.q.schemeName=null,
                vm.q.brandId=null,
                vm.q.seriesId=null,
                vm.q.modelId=null,
                vm.q.schemeType=null,
                vm.q.sort=null,
                $("#carBrandSeriesModel").val("");
        },
        view: function (data) {

            var schemeType = data.schemeType;
            var schemeId = data.schemeId;
            //直购方案信息
            var scheme=null;
            //分期购车/租赁方案信息
            var schemeEntityDTO=null;
            $.ajax({
                type: "POST",
                async:false,
                url: baseURL + "scheme/scheme/info/"+schemeId+"/"+schemeType,
                contentType: "application/json",
                data: {},
                success: function(r){
                    scheme=r.scheme;
                    schemeEntityDTO=r.schemeEntityDTO;
                }
            });
            //直购查看
            if(schemeType==1){
                var index = layer.open({
                    title: "直购方案查看",
                    type: 2,
                    boxParams: scheme,
                    content: tabBaseURL + "modules/scheme/schemeviewzg.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }
            //分期购车方案
            if(schemeType==2){
                var index = layer.open({
                    title: "分期购车方案查看",
                    type: 2,
                    boxParams: schemeId,
                    content: tabBaseURL + "modules/scheme/schemeviewfqgc.html",
                    success: function (layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(schemeEntityDTO);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }
            //租赁方案
            if(schemeType==3){
                var index = layer.open({
                    title: "租赁方案查看",
                    type: 2,
                    boxParams: schemeId,
                    content: tabBaseURL + "modules/scheme/schemeviewzl.html",
                    success: function (layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(schemeEntityDTO);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }
            //金融分期方案
            if(schemeType==4){
                var index = layer.open({
                    title: "金融分期方案查看",
                    type: 2,
                    boxParams: schemeId,
                    content: tabBaseURL + "modules/scheme/schemeviewjrfq.html",
                    success: function (layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(schemeEntityDTO);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }

        },
        add: function(){
            var param = {
                callback: function(schemeType){
                    if(schemeType==1){
                        var index = layer.open({
                            title: "新增直购方案",
                            type: 2,
                            boxParams: schemeType,
                            content: tabBaseURL + "modules/scheme/schemeeditzg.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(schemeType==2){
                        var index = layer.open({
                            title: "新增分期购车方案",
                            type: 2,
                            boxParams: schemeType,
                            content: tabBaseURL + "modules/scheme/schemeeditfqgc.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(schemeType==3){
                        var index = layer.open({
                            title: "新增租赁方案",
                            type: 2,
                            boxParams: schemeType,
                            content: tabBaseURL + "modules/scheme/schemeeditzl.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }

                    if(schemeType==4){
                        var index = layer.open({
                            title: "新增金融分期方案",
                            type: 2,
                            boxParams: schemeType,
                            content: tabBaseURL + "modules/scheme/schemeeditjrfq.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                }
            };
            var index = layer.open({
                type: 2,
                title: '选择方案类型',
                area: ['800px', '400px'],
                boxParams: param,
                content: tabBaseURL + 'modules/scheme/schemtypeselect.html',
                end: function () {
                   layer.close(index);
                }
            });
        },
        update: function (data) {
            //获取方案类型，通过类型来跳转对应页面
            var schemeType= data.schemeType;
            //方案id
            var schemeId= data.schemeId;
            var scheme=null;
            //分期购车/租赁方案信息
            var schemeEntityDTO=null;
            $.ajax({
                type: "POST",
                async:false,
                url: baseURL + "scheme/scheme/info/"+schemeId+"/"+schemeType,
                contentType: "application/json",
                data: {},
                success: function(r){
                    scheme=r.scheme;
                    schemeEntityDTO=r.schemeEntityDTO;
                }
            });
            //直购方案
            if(schemeType==1){
                var index = layer.open({
                    title: "直购方案修改",
                    type: 2,
                    boxParams: schemeType,
                    content: tabBaseURL + "modules/scheme/schemeeditzg.html",
                    success: function (layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(scheme);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }
            //分期购车
            if(schemeType==2){
                var index = layer.open({
                    title: "分期购车方案修改",
                    type: 2,
                    boxParams: schemeType,
                    content: tabBaseURL + "modules/scheme/schemeeditfqgc.html",
                    success: function (layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(schemeEntityDTO);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);

            }
            //租赁方案
            if(schemeType==3){
                var index = layer.open({
                    title: "租赁方案修改",
                    type: 2,
                    boxParams: schemeType,
                    content: tabBaseURL + "modules/scheme/schemeeditzl.html",
                    success: function (layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(schemeEntityDTO);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }
            //金融分期方案
            if(schemeType==4){
                var index = layer.open({
                    title: "金融分期方案修改",
                    type: 2,
                    boxParams: schemeType,
                    content: tabBaseURL + "modules/scheme/schemeeditjrfq.html",
                    success: function (layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(schemeEntityDTO);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            }
        },
        //启用
        start:function (data){
            confirm('确认要启用该方案吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "scheme/scheme/start/"+data.schemeId+"/"+data.schemeType,
                    contentType: "application/json",
                    data: {},
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
        //停用
        stop:function (data){
            confirm('确认要禁用该方案吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "scheme/scheme/stop/"+data.schemeId+"/"+data.schemeType,
                    contentType: "application/json",
                    data: {},
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
        generateQrcode:function(data){
            $.ajax({
                type: "POST",
                url: baseURL + "scheme/scheme/generateSchemeQrcode",
                data: {schemeId:data.schemeId},
                async: false,
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
        },
        del: function (data) {
            confirm('确定要将该方案删除吗，删除之后将无法恢复？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "scheme/scheme/delete/"+data.schemeId+"/"+data.schemeType,
                    contentType: "application/json",
                    data: {},
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
            window.location.href = urlParamByObj(baseURL + 'scheme/scheme/export', vm.q);
        },
        reload: function (event) {
            console.log(JSON.stringify(vm.q));
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    schemeName:  vm.q.schemeName,
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    modelId: vm.q.modelId,
                    schemeType: vm.q.schemeType,
                    sort: vm.q.sort
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
}





function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    //方案类型
    form.on('select(schemeType)', function (data) {
        vm.q.schemeType = data.value;
    });
    //推荐位置
    form.on('select(sort)', function (data) {
        vm.q.sort = data.value;
    });

}

function initClick() {
    $(".delBatch").click(function(){
        var schemeIds = vm.selectedRows();
        if(schemeIds == null){
            return;
        }
        vm.del(schemeIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'scheme/scheme/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:160, minWidth:160, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'schemeName', title: '方案名称', minWidth:200, templet: function (d) {return isEmpty(d.schemeName);}},
            {field:'brandName', title: '品牌', minWidth:200, templet: function (d) {return isEmpty(d.brandName);}},
            {field:'seriesName', title: '车系', minWidth:200, templet: function (d) {return isEmpty(d.seriesName);}},
            {field:'modelName', title: '车型', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
            {field:'schemeType', title: '方案类型', minWidth:200, templet: function (d) {
                    if(d.schemeType==1){
                        return "直购";
                    }else if(d.schemeType==2){
                        return "分期购车";
                    }else if(d.schemeType==3){
                        return "租赁";
                    }else if(d.schemeType==4){
                        return "金融分期";
                    }else{
                        return isEmpty(d.schemeType);
                    }
                }},
            {field:'subSchemeCount', title: '内置子方案', minWidth:200, templet: function (d) {return isEmpty(d.subSchemeCount);}},
            {field:'isEnable', title: '方案状态', minWidth:200, templet: function (d) {
                    if(d.isEnable==1){
                        return "启用";
                    }else if(d.isEnable==2){
                        return "停用";
                    }else {
                        return isEmpty(d.isEnable);
                    }
                }},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'creater', title: '创建者', minWidth:200, templet: function (d) {return isEmpty(d.creater);}}
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
            vm.update(data);
        } else if(layEvent === 'del'){
            vm.del(data);
        } else if(layEvent === 'view'){
            vm.view(data);
        }else if(layEvent === 'start'){
            vm.start(data);
        }else if(layEvent === 'stop'){
            vm.stop(data);
        }else if(layEvent === 'generateQrcode'){
            vm.generateQrcode(data);
        }
    });
}

function initDate(laydate) {

}
