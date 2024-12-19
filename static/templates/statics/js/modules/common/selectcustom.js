$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'message/selectCondition',
        cols: [[
            {type:'checkbox'},
            {field:'name', minWidth:150, title: '名称',align:"center"},
            {field:'deptName', minWidth:150, title: '部门名称',align:"center"},
            {field:'type', minWidth:150, title: '渠道商/员工',align:"center"},
        ]],
        page: true,
        loading: true,
        limits: [20,30, 50, 100],
        limit: 10
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

            form.on('select(condition)',function (data) {
                vm.q.condition = data.value;
            })

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
            condition: null,
            name: null,
        },
        selected:0,
    //  selectedData:{},
        sysDept:{}
    },
    computed: function () {},
    updated: function () {
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
        reset: function () {
            vm.q.condition = null;
            vm.q.name = null;
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
             //父页面调用时需创建 inforData 数据源
             parent.vm.inforData = Object.assign({}, parent.vm.inforData,list);
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
                    condition: vm.q.condition,
                    name: vm.q.name,
                }
            });
        }
    }
});

