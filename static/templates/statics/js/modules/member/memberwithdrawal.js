$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'member/memberwithdrawal/list',
        cols: [[
            {title: '操作', width:90, minWidth:90, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'withdrawalNo', minWidth:200, title: '会员提现单号',templet:function(d){
                    if(d.withdrawalNo==null || d.withdrawalNo == '' || d.withdrawalNo == undefined){
                        return "---";
                    }else{
                        return d.withdrawalNo;
                    }
                }},
            {field:'memberName', minWidth:200, title: '会员姓名',templet:function(d){
                    if(d.memberName==null || d.memberName == '' || d.memberName == undefined){
                        return "---";
                    }else{
                        return d.memberName;
                    }
                }},
            {field:'memberPhone', minWidth:200, title: '会员手机号',templet:function(d){
                    if(d.memberPhone==null || d.memberPhone == '' || d.memberPhone == undefined){
                        return "---";
                    }else{
                        return d.memberPhone;
                    }
                }},
            {field:'withdrawalAmount', minWidth:150, title: '提现金额',templet:function(d){
                    if(d.withdrawalAmount==null || d.withdrawalAmount == '' || d.withdrawalAmount == undefined){
                        return "---";
                    }else{
                        return d.withdrawalAmount;
                    }
                }},
            {field:'applyTime', minWidth:200, title: '申请时间',templet:function(data){
                    if(data.applyTime == null || data.applyTime == ''){
                        return "---";
                    }
                    return layui.util.toDateString(data.applyTime,'yyyy-MM-dd HH:mm:ss');
                }},
            {field:'intoAccount', minWidth:200, title: '转入账号',templet:function(d){
                    if(d.intoAccount==null || d.intoAccount == '' || d.intoAccount == undefined){
                        return "---";
                    }else{
                        return d.intoAccount;
                    }
                }},
            {field:'withdrawalStatus', minWidth:200, title: '提现状态',templet:function(d){
                    if(d.withdrawalStatus == 2){
                        return "已提现";
                    }else{
                        return "未提现";
                    }
                }}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function () {
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });
    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            laydate.render({
                elem: '#applyTime',
                format: 'yyyy-MM-dd',
                type: 'date',
                range: '/',
                trigger: 'click',
                done: function (value, date, endDate) {
                    vm.q.applyTime = value;
                }
            });
            form.render();
    });


    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'detail'){
            vm.detail(data.withdrawalId,data.memberNo,data.withdrawalNo);
        }
    });

});



var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            memberPhone: null,
            memberName: null,
            applyTime: null,
        },

    },
    computed:{ },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectorMember:function(){
            layer.open({
                type: 2,
                title: '会员选择',
                area: ['800px', '500px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/member/memberSelect.html',
            });
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
        	vm.q.memberPhone=null;
        	vm.q.memberName=null;
        	vm.q.applyTime=null;
        },
        add:function(){
            var index = layer.open({
                title: "新增",
                type: 2,
                content: tabBaseURL + "modules/member/memberwithdrawaladd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        detail:function(withdrawalId,memberNo,withdrawalNo){
            console.log(withdrawalId);
            console.log(memberNo);
            window.localStorage.setItem("withdrawalId",withdrawalId);
            window.localStorage.setItem("memberNo",memberNo);
            window.localStorage.setItem("withdrawalNo",withdrawalNo);

            var index = layer.open({
                title: "提现详情查看",
                type: 2,
                content: tabBaseURL+'modules/member/memberwithdrawaldetail.html',
                end: function(){
                    layer.close(index);
                }
            });
            layer.full(index);

        },
        exports: function () {
            var url = baseURL + 'member/memberwithdrawal/export';
            if(vm.q.keyword != null){
                url += '?keyword='+vm.q.keyword;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    memberPhone: vm.q.memberPhone,
                    memberName: vm.q.memberName,
                    applyTime:vm.q.applyTime,
                }
            });
        }
    }
});
