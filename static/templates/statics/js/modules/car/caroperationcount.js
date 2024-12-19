$(function () {
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
        var cascader = layui.cascader;
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            vm.selectData = r.carTreeVoList;
            cascader({
                elem: "#a",
                data: vm.selectData,
                success: function (valData,labelData) {
                    vm.q.modelId = valData[2];
                    vm.q.modelName = labelData[2];
                }
            });
        });
    });

    $.ajax({
        type: "POST",
        url: baseURL + "car/tcarbasic/countAll",
        contentType: "application/json",
        data:JSON.stringify(vm.q),
        success: function (r) {
            layui.config({
                base: '../../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            });
            layui.use(['form', 'element', 'table', 'soulTable'], function () {
                soulTable = layui.soulTable
                gridTable = layui.table.render({
                    id: "gridid",
                    elem: '#grid',
                    url: baseURL + 'car/tcarbasic/operationCount',
                    totalRow: true,
                    cols: [[
                        {field: 'deptName', minWidth: 100, title: '归属公司/部门',align: "center",templet: function (d) {return isEmpty(d.deptName);}, totalRowText: '合计'},
                        {field: 'brandSeriesModelName', minWidth: 100, title: '品牌/车系/车型',align: "center",templet: function (d) {return isEmpty(d.brandSeriesModelName);}},
                        {field: 'carCount', minWidth: 100, title: '车辆总数',align: "center", totalRowText: r.data.carCount, totalRow: true},
                        {field: 'longRentCar', minWidth: 100, title: '经租用车中',align: "center", totalRowText: r.data.longRentCar, totalRow: true},
                        {field: 'rentalCar', minWidth: 100, title: '以租代购用车中',align: "center", totalRowText: r.data.rentalCar, totalRow: true},
                        {field: 'showCar', minWidth: 100, title: '展示车用车中',align: "center", totalRowText: r.data.showCar, totalRow: true},
                        {field: 'driverCar', minWidth: 100, title: '试驾车用车中',align: "center", totalRowText: r.data.driverCar, totalRow: true},
                        {field: 'meltsRent', minWidth: 100, title: '融租用车中',align: "center", totalRowText: r.data.meltsRent, totalRow: true},
                        {field: 'longRentBooking', minWidth: 100, title: '经租预订中',align: "center", totalRowText: r.data.longRentBooking, totalRow: true},
                        {field: 'rentalBooking', minWidth: 100, title: '以租代购预订中',align: "center", totalRowText: r.data.rentalBooking, totalRow: true},
                        {field: 'showBooking', minWidth: 100, title: '展示车预订中',align: "center", totalRowText: r.data.showBooking, totalRow: true},
                        {field: 'driverBooking', minWidth: 100, title: '试驾车预订中',align: "center", totalRowText: r.data.driverBooking, totalRow: true},
                        {field: 'meltsRentBooking', minWidth: 100, title: '融租预订中',align: "center", totalRowText: r.data.meltsRentBooking, totalRow: true},
                        {field: 'purchaseBooking', minWidth: 100, title: '直购预订中',align: "center", totalRowText: r.data.purchaseBooking, totalRow: true},
                        {field: 'forStart', minWidth: 100, title: '备发车',align: "center", totalRowText: r.data.forStart, totalRow: true},
                        {field: 'shipIn', minWidth: 100, title: '整备中',align: "center", totalRowText: r.data.shipIn, totalRow: true},
                        {field: 'haveSell', minWidth: 100, title: '已出售',align: "center", totalRowText: r.data.haveSell, totalRow: true},
                        {field: 'hasDisposal', minWidth: 100, title: '已处置',align: "center", totalRowText: r.data.hasDisposal, totalRow: true},
                        {field: 'hasTransfer', minWidth: 100, title: '已过户',align: "center", totalRowText: r.data.hasTransfer, totalRow: true},
                        {field: 'repairIn', minWidth: 100, title: '维修中',align: "center", totalRowText: r.data.repairIn, totalRow: true},
                        {field: 'disputeCar', minWidth: 100, title: '纠纷车辆数',align: "center", totalRowText: r.data.disputeCar, totalRow: true},
                        {field: 'spareCar', minWidth: 100, title: '备用车用车数',align: "center", totalRowText: r.data.spareCar, totalRow: true}
                    ]],
                    page: true,
                    loading: false,
                    limits: [10, 20, 50, 100],
                    limit: 10,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });
            });
        }
    });


    //初始化数据
    layui.use(['form'], function () {
        var form = layui.form;
        form.render();
    });
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            deptId: null,
            deptName: null,
            modelId: null
        },
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
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
        query: function(){
            vm.reload();
        },
        reset: function(){
            vm.q.deptId = null;
            vm.q.deptName = null;
            vm.q.modelId = null;
            $('#a').val('');
        },
        exp: function(){
            var url = baseURL + 'car/tcarbasic/expOperationData?deptId=' + vm.q.deptId+'&modelId='+vm.q.modelId;
            window.location.href = url;
        },
        reload: function(){
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    modelId: vm.q.modelId,
                    deptId: vm.q.deptId,
                    deptName: vm.q.deptName
                }
            });
        }
    }
});

