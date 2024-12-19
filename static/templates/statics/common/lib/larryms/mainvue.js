$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        height: 280,
        url: 'work/notice/noticeList',
        cols: [[
            //{type:'checkbox'},
            {field:'noticeNo', minWidth:100, title: '公告编号'},
            {field:'noticeTitle', minWidth:100, title: '公告标题'},
            {field:'publishName', minWidth:80, title: '发布人'},
            {field:'publishTime', minWidth:100, title: '发布时间'},
            {field:'orgName', minWidth:100, title: '机构名称'},
            {field:'publishStatus', minWidth:100, title: '发布状态',templet:function (d) {
                    if(d.publishStatus==0){
                        return "待发布";
                    }else if(d.publishStatus==1){
                        return "已发布";
                    }else if(d.publishStatus==2){
                        return "已撤销";
                    }else {
                        return "--";
                    }
                }},
        ]],
        page: false,limit: 500,
        loading: true,
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        homePageVo:{},
        type:null
    },
    created:function(){
        var _this = this;
        $.getJSON("sys/home/list", function (r) {
            _this.homePageVo = r.homePageVo;
        });
    },
    methods: {
        detailContent:function(title,content,type){
            vm.type = type;
            var index = layer.open({
                title: title,
                type: 2,
                content: content,
                end: function () {
                    layer.closeAll();
                },
                success: function(layero, index){
                    // var iframe = window['layui-layer-iframe'+index];
                    // iframe.child(type);
                }
            });
            layer.full(index);
        },
        waitApprove:function(){
            //待审批
            vm.detailContent('待审批记录','modules/activiti/processapprove.html',1);
        },
        hasApprove:function(){
            //已审批
            vm.detailContent('已审批记录','modules/activiti/processapprove.html',2);
        },
        contractToDate:function(){
            //合同到期
            vm.detailContent('合同到期','modules/contract/tcontractprincipal.html',1);
        },
        waitReturnCar:function(){
            //待还车
            vm.detailContent('待还车','modules/order/companyordercar.html',1);
        },
        hasToDate:function(){
            //已超期
            vm.detailContent('已超期','modules/order/companyordercar.html',2);
        },
        exceptionReturnCar:function(){
            //异常还车
            vm.detailContent('异常还车','modules/order/companyordercar.html',3);
        },
        waitRentCar:function(){
            //待租车辆
            vm.detailContent('待租车辆','modules/carbasic/tcarbasic.html',1);
        },
        hasRentCar:function(){
            //已租车辆
            vm.detailContent('已租车辆','modules/carbasic/tcarbasic.html',2);
        },
        noRentCar:function(){
            //停运车辆
            vm.detailContent('停运车辆','modules/carbasic/tcarbasic.html',4);
        },
        offLineCar:function(){
            //下线车辆
            vm.detailContent('下线车辆','modules/carbasic/tcarbasic.html',3);
        },
        remakeCar:function(){
            //整备车辆
            vm.detailContent('整备车辆','modules/carbasic/tcarbasic.html',0);
        },
        outControlCar:function(){
            //失控车辆
            vm.detailContent('失控车辆','modules/carbasic/tcarbasic.html',7);
        },
        insideCar:function(){
            //内部车辆
            vm.detailContent('内部车辆','modules/carbasic/tcarbasic.html',5);
        },
        outCar:function(){
            //外部车辆
            vm.detailContent('外部车辆','modules/carbasic/tcarbasic.html',6);
        },
        supCar:function(){
            //待补录供应商的车辆
            vm.detailContent('待补录供应商的车辆','modules/carbasic/tcarbasic.html',8);
        },
        weekHandleCar:function(){
            //本周交车
            vm.detailContent('本周交车','modules/order/companyordercar.html',4);
        },
        weekReturnCar:function(){
            //本周还车
            vm.detailContent('本周还车','modules/order/companyordercar.html',5);
        },
        weekToRent:function(){
            //本周续租
            vm.detailContent('本周续租','modules/order/companyordercar.html',6);
        },
        weekChangeCar:function(){
            //本周换车
            vm.detailContent('本周换车','modules/order/companyordercar.html',7);
        },
        useWaitCar:function(){
            //备用车再用
            vm.detailContent('备用车再用','modules/order/companyordercar.html',8);
        },
        noCheckReceivable:function(){
            //待勾稽应收单
            vm.detailContent('待勾稽应收单','modules/financial/receivables.html',2);
        },
        noCheckCharge:function(){
            //待勾稽收款流水
            vm.detailContent('待勾稽收款流水','modules/financial/collectransaction.html',2);
        },
        inUserDriver:function(){
            //可用司机人数
            vm.detailContent('可用司机人数','modules/carbasic/tcardriver.html',1);
        },
        inServiceDriver:function(){
            //服务中司机人数
            vm.detailContent('服务中司机人数','modules/carbasic/tcardriver.html',3);
        },
        notice:function(){
                    vm.detailContent('公告管理','modules/sys/notice.html',1);
                }
    }
});