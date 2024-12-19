function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: `${baseURL}/car/illegalBalanceRecord/list?tenantId=`+getQueryString('tenantId'),
        cols: [[
            {field: 'workOrderNo', minWidth: 100, title: '工单号', align: "center",templet:(d)=>isEmpty(d.workOrderNo)},
            {field: 'changeBefore', minWidth: 100, title: '消费前', align: "center",templet:(d)=>isEmpty(d.changeBefore)},
            {field: 'changeAfter', minWidth: 100, title: '消费后', align: "center",templet:(d)=>isEmpty(d.changeAfter)},
            {field: 'consume', minWidth: 100, title: '本次消费', align: "center",templet:(d)=>isEmpty(d.consume)},
            {field: 'createTime', minWidth: 100, title: '消费时间', align: "center",templet:(d)=>isEmpty(d.createTime)}
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
    // 开始时间
    layui.laydate.render({
        elem: '#startDate',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: (value)=>vm.q.startDate = value
    });
    // 结束时间
    layui.laydate.render({
        elem: '#endDate',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: (value)=>vm.q.endDate = value
    });
});
// 创建vue应用
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            startDate:null,
            endDate:null,
            // 完整时间格式
            startDateComplete:null,
            // 完整时间格式
            endDateComplete:null,
        },
        balance: 0,
        consume: 0,
        showForm: false
    },
    created: function (){
        this.updatebalance();
        // 数据太多了，需要出现滚动条
        $(parent.document).find(".layui-layer-content iframe:eq(0)")[0].scrolling='yes'
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 更新余额
        updatebalance:()=>{
            console.log(`更新违章查询余额`)
            $.get(baseURL + "/order/illegalcustombalance/balance?tenantId="+getQueryString('tenantId'), function (r) {
                if(!r || !r.data){
                    return false;
                }
                vm.balance = r.data.hasMoney;
            });
        },
        // 查询按钮事件
        query: function () {
            vm.q.startDateComplete = vm.q.startDate?vm.q.startDate+' 00:00:00':null;
            vm.q.endDateComplete = vm.q.endDate?vm.q.endDate+' 23:59:59':null;
            layui.table.reload('gridid', {
                // 分页参数
                page: {
                    curr: 1
                },
                // 查询条件
                where: {
                    startDate:vm.q.startDateComplete,
                    endDate:vm.q.endDateComplete
                }
            });
            // 更新余额
            vm.updatebalance();
        },
        // 充值按钮事件
        rechargeBtn: function (){
            layer.open({
                title: "新增",
                type: 1,
                area: ['30%', '30%'],
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    vm.consume=0;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
        },
        // 充值
        recharge: function (){
            $.ajax({
                type: "POST",
                url: `${baseURL}/car/illegalBalanceRecord/recharge?consume=${vm.consume}`,
                contentType: "application/json",
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.query();
                        });
                        return false;
                    }
                    alert(r.msg);
                }
            });
        }
    }
});