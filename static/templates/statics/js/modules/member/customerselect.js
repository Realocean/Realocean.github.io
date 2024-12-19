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
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            url: baseURL + 'customer/list',
            cols: [[
                {title: '操作', width: 150, unresize: "true", templet: '#barTpl', fixed: "left", align: "center",},
                {field: 'customerName', minWidth: 100, unresize: "true", title: '客户名称',templet:function (d) {
                        return isEmpty(d.customerName)
                    }},
                {field: 'customerType', minWidth: 80, unresize: "true", title: '客户类型',templet:function (d) {
                        if(d.customerType == 1){
                            return "企业";
                        }else if(d.customerType == 2){
                            return "个人";
                        }else{
                            return isEmpty(d.customerType);
                        }
                    }},
                {field: 'contactPerson', minWidth: 100, unresize: "true", title: '联系人',templet:function (d) {
                        return isEmpty(d.contactPerson);
                    }},
                {field: 'contactMobile', minWidth: 100, unresize: "true", title: '联系电话',templet:function (d) {
                        return isEmpty(d.contactMobile);
                    }},
                {field: 'state', minWidth: 130, title: '状态',templet:function (d) {
                        if(d.state == 1 ){
                            return "<span style='color:green;'>正常</span>";
                        }else if(d.state == 2){
                            return "<span style='color:red;'>黑名单</span>";
                        }
                    }},
                {field: 'balance',align:"center", title: '账户余额/元'},
                {field: 'cashWithdrawal', minWidth: 130, title: '累计提现金额/元',templet:function (d) {
                        return isEmpty(d.cashWithdrawal);
                    }},
                {field: 'collectionType', minWidth: 130, title: '欠款类型',templet:function(d){
                        return isEmpty(d.collectionType);
                    }},
                {field: 'uncollectedAmount', minWidth: 130, title: '欠款金额(元)'},
                {field: 'contactName', minWidth: 80, unresize: "true", title: '业务负责人',templet:function (d) {
                        return isEmpty(d.contactName);
                    }},
                {field: 'companyName', minWidth: 80, unresize: "true", title: '所属公司',templet:function (d) {
                        return isEmpty(d.companyName);
                    }},
                {field: 'createTime', minWidth: 150, unresize: "true", title: '注册时间'},
            ]],
            page: true,
            loading: true,
            limits: [20, 50, 100, 200],
            limit: 20,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });
    })

    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            vm.getCompanyList();
            form.render();
    });

    layui.form.on('select(customerType)', function (data) {
        vm.q.customerType = data.value;
    });

    layui.form.on('select(company)', function (data) {
        vm.q.company = data.value;
    });

    layui.form.on('select(oweMoneyType)', function (data) {
        vm.q.oweMoneyType = data.value;
    });
     layui.form.on('select(customerState)', function (data) {
        vm.q.customerState = data.value;
    });

    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'choose'){
            vm.choose(data);
        }
    });

});


var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            customerName: null,
            contactPerson: null,
            customerType: null,
            company: null,
            oweMoneyType: null,
            customerState: null,
        },
       companyList:[]
    },
    computed: function () {},
    updated: function () {
        layui.form.render();
    },
    methods: {
        getCompanyList:function(){
            $.ajax({
                type: "GET",
                url: baseURL + 'customer/getCompanyList',
                contentType: "application/json",
                success: function(data){
                    vm.companyList=data.data;
                }
            });
        },
        reset: function () {
            vm.q.customerName = null;
            vm.q.contactPerson = null;
            vm.q.customerType = null;
            vm.q.company = null;
            vm.q.oweMoneyType=null;
            vm.q.customerState=null;
        },
        query: function () {
            vm.reload();
        },
        choose:function(data){
            parent.vm.memberWithdrawal = Object.assign({}, parent.vm.memberWithdrawal, {
                memberName:data.customerName,
                memberPhone:data.contactMobile,
                memberBalance:data.balance,
                cashedAmount:data.uncollectedAmount,
                memberNo:data.id,
            });
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        cancel:function(){
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    customerName: vm.q.customerName,
                    contact: vm.q.contactPerson,
                    customerType: vm.q.customerType,
                    state:vm.q.customerState,
                    company: vm.q.company,
                    oweMoneyType:vm.q.oweMoneyType
                }
            });
        }
    }
});

