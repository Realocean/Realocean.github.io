$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        laydate = layui.laydate;
        laydate.render({
            elem: '#q_startTime' //指定元素
            , zIndex: 99999999,
            type: 'date',
            trigger: 'click',
            range: true,
            done: function (value, date, endDate) {
                vm.q.signEndTimeStr = value;
            }
        });
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            signOrderNo: null,
            operationName: null,
            signStatus: null,
            customerName: null,
            rentType: null,
            signEndTimeStr: null,
            orderCarNo: null,
        },
        unsignReason:null,
        editForm:false,
        isFilter:false,
    },
    created: function () {
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
            resetNULL(vm.q);
        },
        view: function (id) {
            $.get(baseURL + "/daikou/order/info?id="+id, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/daikou/orderDaiKouView.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        unbind:function(id){
            var index = layer.open({
                title: "解绑订单",
                type: 1,
                area: ['700px', '500px'],
                btn: ['保存', '返回'],
                content: $("#editForm"),
                end: function () {
                    vm.editForm = false;
                    vm.unsignReason=null;
                    layer.closeAll();
                },
                btn1: function (index, layero) {
                    if(vm.unsignReason==null||vm.unsignReason==''){
                        alert("解绑原因不能为空");
                        return;
                    }
                    $.ajax({
                        type: "post",
                        url: baseURL + "/daikou/order/unsignOrder?id="+id+"&unsignReason="+vm.unsignReason,
                        success: function (r) {
                            if (r.code === 0) {
                                alert('操作成功', function (index) {
                                    layer.closeAll();
                                    vm.editForm=false;
                                    vm.reload();
                                });
                            } else {
                                alert(r.msg);
                            }
                        }

                    });


                },
                btn2:function (index, layero) {
                    vm.editForm = false;
                    vm.unsignReason=null;
                    layer.closeAll();
                }
            });

             vm.editForm=true;
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
}


function initData() {
    //初始化查询数据字典-设备生产商

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(signStatus)', function (data) {
        vm.q.signStatus = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });

}

function initClick(){

}

function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL +'/daikou/order/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            //  {type:'checkbox'},
            {title: '操作',  width:100, minWidth:100, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'customerName', title: '客户名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.customerName);
                }
            },
            {
                field: 'rentType', title: '业务类型', minWidth: 200, templet: function (d) {
                    return getRentTypeStr(d.rentType);
                }
            },
            {
                field: 'signStatus', title: '签约状态', minWidth: 200, templet: function (d) {
                    var signStatus = d.signStatus;
                    if (signStatus == 0) {
                        return "签约成功";
                    } else if (signStatus == 1) {
                        return "已解约";
                    } else {
                        return "--"
                    }
                }
            },
            {
                field: 'signOrderNo', title: '签约订单号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.signOrderNo);
                }
            },
            {
                field: 'orderCarNo', title: '车辆订单号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.orderCarNo);
                }
            },
            {
                field: 'cardNo', title: '身份证', minWidth: 200, templet: function (d) {
                    return isEmpty(d.cardNo);
                }
            },
            {
                field: 'signAmount', title: '签约金额/元', minWidth: 200, templet: function (d) {
                   let s=  d.signAmount;
                    if (s != null && String(s).length > 0 && s!='null') {
                        return '￥'+s+'/元';
                    } else {
                        return '--';
                    }

                }
            },
            {
                field: 'signBeginTime', title: '签约申请时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.signBeginTime);

                }
            },
            {
                field: 'signEndTime', title: '签约完成时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.signEndTime);
                }
            },
            {
                field: 'unsignTime', title: '解约完成时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.unsignTime);
                }
            },
            {
                field: 'bindCardNum', title: '绑定银行卡数量', minWidth: 200, templet: function (d) {
                    return isEmpty(d.bindCardNum);
                }
            },
            {
                field: 'operationName', title: '所属业务员', minWidth: 200, templet: function (d) {
                    return isEmpty(d.operationName);
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
        if (layEvent === 'view') {
            vm.view(data.id);
        }else if(layEvent=== 'unbind'){
            vm.unbind(data.id);
        }

    });
}


