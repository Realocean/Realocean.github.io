$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            height: '500px',
            url: baseURL + 'scheme/scheme/getSchemeList',
            cols: [[
                {type:'radio'},
            //  {title: '操作', minWidth: 125, templet: '#barTpl', fixed: "left", align: "center"},
                {field: 'schemeName', minWidth: 100, title: '方案名称'},
                {field: 'brandSeriesModelName', minWidth: 100, title: '品牌/车系/车型',templet: function (d){ return isEmpty(d.brandSeriesModelName); }},
                {field: 'schemeTypeShow', minWidth: 100, title: '方案类型',templet: function (d){ return isEmpty(d.schemeTypeShow);}},
                {field: 'isEnableShow', minWidth: 50, title: '方案状态',templet: function (d){return isEmpty(d.isEnableShow);}},
                {field: 'createTime', minWidth: 50, title: '创建时间',templet: function (d){return isEmpty(d.createTime);}},
            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100, 200],
            limit: 10,
            done: function () {
                soulTable.render(this);
            }
        });
    })
    //初始化数据
    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.render();
    });

    /**
     * 方案类型
     */
    layui.form.on('select(schemeType)', function (data) {
        vm.q.schemeType = data.value;
    });



});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            schemeName:null,
            brandId:null,
            seriesId :null,
            modelId :null,
            schemeType :null,
        },
    },
    updated: function () {
        layui.form.render();
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
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });
    },
    computed: {},
    methods: {
        cancel: function () {
             var index = parent.layer.getFrameIndex(window.name);
             parent.layer.close(index);
        },
        query: function () {
            vm.reload();
        },
        save:function(){
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }
            parent.vm.activity = Object.assign({}, parent.vm.activity, {
                productJump:list[0].schemeId,
                brandSeriesModelSchemename:list[0].schemeName,
                //brandSeriesModelSchemename:list[0].brandName+"/"+list[0].seriesName+"/"+list[0].modelName+"/"+list[0].schemeName,
                //  brandName:list[0].brandName,
                //  seriesName:list[0].seriesName,
                //  modelName:list[0].modelName,
            });
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        reset: function () {
            //方案名称
            vm.q.schemeName =null;
            //品牌车系车型
            vm.q.brandId =null;
            vm.q.seriesId=null;
            vm.q.modelId =null;
            vm.q.schemeType =null;
            $("#carBrandSeriesModel").val("");
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    schemeName: vm.q.schemeName,
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    modelId: vm.q.modelId,
                    schemeType: vm.q.schemeType,
                }
            });
        },

    }
});
