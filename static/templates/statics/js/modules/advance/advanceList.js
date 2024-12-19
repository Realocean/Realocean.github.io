$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            advanceNo: null,
            driverName: null,
            mobile: null,
            carPlateNo: null,
            advanceStatus: null,
            startTime: null
        },
        isFilter:false,


    },
    created: function () {


    },
    mounted: function (){


    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.advanceNo=null;
            vm.q.driverName=null;
            vm.q.mobile=null;
            vm.q.carPlateNo=null;
            vm.q.advanceStatus=null;
            vm.q.startTime=null;
        },
        view: function (couponId) {
            $.get(baseURL + "driveradvance/info?id="+couponId, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/advance/advanceview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function () {
            var param = {
                data: {}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/advance/advanceedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (couponId) {
            $.get(baseURL + "driveradvance/info?id="+couponId, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/advance/advanceedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });


        },
        exports:function (){
            let url = baseURL + '/driveradvance/export?';
            if (vm.q.advanceNo != null && vm.q.advanceNo !="") {
                url += '&advanceNo=' + vm.q.advanceNo;
            }
            if (vm.q.driverName != null && vm.q.driverName !="") {
                url += '&driverName=' + vm.q.driverName;
            }
            if (vm.q.businessNo != null && vm.q.businessNo !="") {
                url += '&businessNo=' + vm.q.businessNo;
            }
            if (vm.q.mobile != null && vm.q.mobile !="") {
                url += '&mobile=' + vm.q.mobile;
            }
            if (vm.q.advanceStatus != null && vm.q.advanceStatus !="") {
                url += '&advanceStatus=' + vm.q.advanceStatus;
            }
            if (vm.q.carPlateNo != null && vm.q.carPlateNo !="") {
                url += '&carPlateNo=' + vm.q.carPlateNo;
            }
            if (vm.q.startTime != null && vm.q.startTime !="") {
                url += '&startTime=' + vm.q.startTime;
            }
            window.location.href=url;
        },

        del: function (couponId) {
            confirm('确定要删除司机预支工资吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/driveradvance/delete/?id=" + couponId,
                    data: {},
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function (event) {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }

});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
    initDate(layui.laydate);
}


function initData() {
    //初始化查询数据字典-设备生产商

}
function initDate(laydate) {
    laydate.render({
        elem: '#q_startTime' //指定元素
        ,zIndex: 99999999,
        trigger: 'click',
        range: true,
        done: function(value, date, endDate){
            vm.q.startTime = value;
        }
    });

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(advanceStatus)', function (data) {
        vm.q.advanceStatus = data.value;
    });


}

function initClick() {
    $(".delBatch").click(function () {
        var deviceIds = vm.selectedRows();
        if (deviceIds == null) {
            return;
        }
        vm.del(deviceIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL +'/driveradvance/list',
        // where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            //  {type:'checkbox'},
            {title: '操作', width:100, minWidth:100, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'advanceNo', title: '预支编号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.advanceNo);
                }
            },
            {
                field: 'driverName', title: '司机名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.driverName);
                }
            },
            {
                field: 'mobile', title: '电话', minWidth: 200, templet: function (d) {
                    return isEmpty(d.mobile);
                }
            },
            {
                field: 'advanceStatus', title: '状态', minWidth: 200, templet: function (d) {
                    var advanceStatus = d.advanceStatus;
                    if (advanceStatus == 0) {
                        return "待薪资抵扣";
                    } else if (advanceStatus == 1) {
                        return "薪资部分抵扣";
                    } else if (advanceStatus == 2) {
                        return "薪资已全部抵扣";
                    }else {
                        return "--"
                    }
                }
            },
            {  field: 'advanceAmount', title: '预支金额', minWidth: 200 },
            {  field: 'deductionAmount', title: '薪资抵扣', minWidth: 200 },
            {  field: 'restAmount', title: '剩余预支', minWidth: 200 },
            {
                field: 'createTime', title: '创建时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.createTime);
                }
            }
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);

}


function initTableEvent(table) {
    table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.id);
        } else if (layEvent === 'view') {
            vm.view(data.id);
        }else if (layEvent === 'del') {
            vm.del(data.id);
        }

    });
}


