$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'car/tcarbasic/selectCarListData',
        where:{type:vm.type},
        cols: [[
       //   {title: '操作', width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {type:'radio',fixed: "left"},
            {field:'carNo', minWidth:150, title: '车牌号',fixed: "left",align:"center"},
            {field:'vinNo', minWidth:150, title: '车架号',align:"center"},
            {field:'carBrandModelName', minWidth:150,title: '品牌/车型',align:"center"},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
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
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carNo: null,
            vinNo: null,
            deptId: null,
            deptName: null,
        },
        type: null,
        selected:0,
    //  selectedData:{},
        sysDept:{}
    },
    computed: function () {},
    updated: function () {
        layui.form.render();
    },
    methods: {
        initType: function(value) {
            vm.type = value;
            vm.reload();
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
        cancel:function(){
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        save:function(){
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }
            if(vm.type == 'insurancemanage'){

                $.ajax({
                    type: "POST",
                    async: false,
                    url: baseURL + "maintenance/insurancemanage/getCarInsuranceInfo?carId="+list[0].carId,
                    success: function(r){
                        if(r.insuranceManage != null){
                            var carInsuranceInfo = r.insuranceManage;
                            if(carInsuranceInfo.compulsorySuspension == 1 || commercialSuspension == 1){
                                alert("选车辆正在停保中，请复保后操作！");
                            }
                        }
                    }
                });
            }
             //父页面调用时需创建 carInforData 数据源
             parent.vm.carInforData = Object.assign({}, parent.vm.carInforData,list[0]);
             var index = parent.layer.getFrameIndex(window.name);
             parent.layer.close(index);
        },
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
                    type: vm.type
                }
            });
        }
    }
});

