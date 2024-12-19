$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form','table','element', 'soulTable'], function(){
        soulTable=layui.soulTable;

        layui.form.render();
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'customer/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {type:'radio'},
            {field:'customerName', minWidth:150, title: '客户名称',align:"center"},
            {field:'customerType', minWidth:150, title: '客户类型',align:"center",templet: function (d) {
                  let customerType=  d.customerType;
                    if (customerType==1) {
                        return '企业';
                    } else if(customerType==2) {
                        return '个人';
                    }else{
                        return "--";
                    }

                }},
            {field:'contactMobile', minWidth:150,title: '联系电话',align:"center"},
            {field:'contactAddr', minWidth:230, title: '联系地址',align:"center"},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        done: function (res, curr, count) {
            soulTable.render(this);
            $('.layui-table').css("width", "100%");
            $("th[data-field='bar']").css("border-right", 'none');
              table_data = res.data;
               let customerId= window.localStorage.getItem("customerId");
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].id ==customerId) {
                        res.data[i].checked = true;
                        var index = res.data[i]['LAY_TABLE_INDEX'];
                        //如果你的页面还有第二个表格，就是.list2
                        $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                        $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').next().addClass(
                            'layui-form-checked');
                    }
            }
        }
    });
    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        layui.form.on('select(customerType)', function (data) {
            vm.q.customerType = data.value;
        });

            form.render();
    });
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            customerName: null,
            customerType: null,
            statusType: 0,
            queryState:1,
        }
    },
    created: function(){
        var _this = this;
        if (parent.layer.boxParams && parent.layer.boxParams.boxParams){
            var param = parent.layer.boxParams.boxParams;
            if (param.query) for (var key in param.query) {
                _this.q[key] = param.query[key];
            }
        }
    },
    computed: function () {},
    updated: function () {
        layui.form.render();
    },
    methods: {
        // initType: function(value) {
        //     vm.type = value;
        //     vm.reload();
        // },
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
        reset: function () {
            vm.q.customerName = null;
            vm.q.customerType = null;
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
             //父页面调用时需创建 carInforData 数据源
             parent.vm.customer = Object.assign({}, parent.vm.customer,list[0]);
             var index = parent.layer.getFrameIndex(window.name);
             parent.layer.close(index);
        },
        add:function (){
            var index = layer.open({
                title: "新增客户",
                type: 2,
                content: tabBaseURL + "modules/order/selectcustomernew.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
    }
});

