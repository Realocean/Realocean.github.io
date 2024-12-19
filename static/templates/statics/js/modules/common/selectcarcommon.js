$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'car/tcarbasic/selectOrderCarLst',
            where: {
                brandId: vm.q.brandId,
                seriesId: vm.q.seriesId,
                modelId: vm.q.modelId,
                isSpareCar: vm.q.isSpareCar
            },
            cols: [[
                {title: '操作', width:100, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carNo', title: '车牌号',fixed: "left", align:"center",templet: function (d) {return isEmpty(d.carNo);}},
                {field:'modelSeriesName', title: '车辆品牌/车系/车型', templet: function (d) {return isEmpty(d.modelSeriesName);}},
                {field:'vinNo', title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                {field:'carStatus', title: '车辆状态', templet: function (d) {return isEmpty(d.carStatus);}},
                {field:'insurance', title: '保险'},
                {field:'insuranceItems', title: '商业险险种', templet: function (d) {return isEmpty(d.insuranceItems);}},
                {field:'annualSurvey', title: '年检'},
                {field:'mileage', title: '当前里程/km', templet: function (d) {return isEmpty(d.mileage);}},
                {field:'electricQuantity', title: '车辆所属仓库', templet: function (d) {return isEmpty(d.depotName);}},
                {field:'accessoryItemsName', title: '随车物品' ,templet: function (d) {return isEmpty(d.accessoryItemsName)}},
                {field:'deptName', title: '所属公司', templet: function (d) {return isEmpty(d.deptName);}},

            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100, 200],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function(res, curr, count){
                layui.soulTable.render(this);
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            }
        });
    });


    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.render();
    });

    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
            if (obj.event === 'selectCarInfor') {
                vm.selectCarInfor(data);
            }
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selectCarInfor'){
            vm.selectCarInfor(data);
        }
    });
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carNo: null,
            vinNo: null,
            deptId: null,
            deptName: null,
            brandId: '',
            seriesId: '',
            modelId: '',
            isSpareCar:''
        },
        selected:0,
    //  selectedData:{},
        sysDept:{}
    },
    computed: function () {},
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.q.brandId = param.brandId;
        _this.q.seriesId = param.seriesId;
        _this.q.modelId = param.modelId;
        _this.q.isSpareCar = param.isSpareCar;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        selectCarInfor:function(data){
            parent.vm.initCommonData(data);
            parent.layer.closeAll();
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }
            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item);
            });
            return ids;
        },
        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.q,"deptId",treeNode.deptId);
            Vue.set(vm.q,"deptName",treeNode.name);
            layer.closeAll();
        },
        reset: function () {
            vm.q.carNo = null;
            vm.q.vinNo = null;
            vm.q.deptId = null;
            vm.q.deptName = null;
        },
        query: function () {
            vm.reload();
        },
        // cancel:function(){
        //     var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        //     parent.layer.close(index); //再执行关闭
        // },
        // save:function(){
        //     var list = layui.table.checkStatus('gridid').data;
        //     if(list.length == 0){
        //         alert("请选择一条记录");
        //         return ;
        //     }
        //      //父页面调用时需创建 carInforData 数据源
        //      parent.vm.carInforData = Object.assign({}, parent.vm.carInforData,list[0]);
        //      var index = parent.layer.getFrameIndex(window.name);
        //      parent.layer.close(index);
        // },
        /*selectCarInfor:function(data){
           // vm.selected=1;
            vm.selectedData=data;
        },*/
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo: vm.q.carNo,
                    vinNo: vm.q.vinNo,
                    deptId: vm.q.deptId,
                    isSpareCar: vm.q.isSpareCar,
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    modelId: vm.q.modelId
                }
            });
        }
    }
});

