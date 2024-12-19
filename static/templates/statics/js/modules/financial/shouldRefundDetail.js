$(function(){
    //操作
    layui.table.on('tool(log)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'show'){
            vm.credentials(data.credentials);
        }
    });


    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#operationRecord',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': window.localStorage.getItem("refundId"), "auditType": 9},
        cols: [[
            // {type:'checkbox'},
            // {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'operatorName', align: "center", title: '操作人', templet: function (d) {
                return isEmpty(d.operatorName);
            }
            },
            {
                field: 'memo', align: "center", title: '操作内容', templet: function (d) {
                return isEmpty(d.memo);
            }
            },
            {
                field: 'operatorTime', align: "center", title: '操作时间', templet: function (d) {
                return isEmpty(d.operatorTime);
            }
            }


        ]],
        page: true,
        // loading: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });

})
var viewer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        list:{},
        status:null,
        settleName:null,
        refundStatus:false,
        detailName:null,
        refundStatusName:null,
        detailsTabContentList: ['详情', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '详情',
    },
    computed:{
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function(){
        this.initPage();
    },
    methods: {
        // newMethods

        detailsTabContentBindtap:function(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '详情';
            }
        },
        // newMethods   ENd
        initPage: function() {
            var id = window.localStorage.getItem("refundId");
            $.get(baseURL + "financial/shouldrefund/info/"+id, function(res){
                vm.list = res.data;
                var settleAmount = 0;
                if (vm.list.feeItemEntities) {
                    for (var i = 0; i < vm.list.feeItemEntities.length; i++) {
                        var item = vm.list.feeItemEntities[i];
                        if (item.feeProperty == 1){
                            settleAmount = sub(settleAmount, item.feeItemAmount);
                        } else if (item.feeProperty == 2){
                            settleAmount = add(settleAmount, item.feeItemAmount);
                        } else {}
                    }
                }
                vm.list.settleMoney = Math.abs(settleAmount);
                if(vm.list.refundStatus){
                    vm.detailName = '已退账款详情';
                    vm.refundStatusName = '已退款';
                    vm.refundStatus = true;
                    layui.table.render({
                        id: "log",
                        elem: '#log',
                        url: baseURL + 'financial/shouldrefund/refundInfo',
                        where:{
                            id:id
                        },
                        cols:[[
                            {field:'refundNo', align:'center', minWidth:100, title: '退款单号'},
                            {field:'refundType', align:'center', minWidth:150, title: '退款类型',templet:function (d) {
                                if(d.refundType == 1){
                                    return '换车结算单';
                                }else if(d.refundType == 2){
                                    return '退车结算单';
                                }else if(d.refundType == 3){
                                    return '备用车结算单';
                                }else if(d.refundType == 4){
                                    return '保证金';
                                }else if(d.refundType == 5){
                                    return '租金';
                                }else if(d.refundType == 6){
                                    return '其他';
                                }
                            }},
                            {field:'refundAmount', align:'center', minWidth:100, title: '应退款金额'},
                            {field:'settleAmount', align:'center', minWidth:100, title: '结算扣款金额'},
                            {field:'deductSubjects', align:'center', minWidth:100, title: '扣款科目/金额'},
                            {field:'actualRefund', align:'center', minWidth:100, title: '实际待退金额'},
                            {field:'alreadyRefund', align:'center', minWidth:100, title: '已退金额'},
                            {field:'refundWay', align:'center', minWidth:100, title: '退款方式',templet:function (d) {
                                if(d.refundWay == 1){
                                    return '余额';
                                }else if(d.refundWay == 2){
                                    return '银行卡';
                                }else if(d.refundWay == 3){
                                    return '支付宝';
                                }else if(d.refundWay == 4){
                                    return '微信';
                                }else if(d.refundWay == 5){
                                    return '现金';
                                }else if(d.refundWay == 6){
                                    return '其他';
                                }
                            }},
                            {field:'note', align:'center', minWidth:100, title: '备注',templet:function (d) {
                                return isEmpty(d.note);
                            }},
                            {title: '退款凭证', align:'center', width:80, toolbar:'#barTpl',align:"center"},
                            {field:'actualTime', align:'center', minWidth:150, title: '实际退款处理时间'},
                            {field:'userName', align:'center', minWidth:80, title: '操作人'}
                        ]]
                    })
                }else{
                    vm.detailName = '应退账款详情';
                    vm.refundStatusName = '待退款';
                }
            });
        },
        credentials:function(url){
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: '退款凭证'
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        }
    }
});
