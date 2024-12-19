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
            tenantName: null,
            tenantConcat: null,
            tenantType: null,
        },
        showForm: false,
        tenantFlag: false,
        balanceRecord: {
            // 充值金额
            consume: 100,
            // 租户id
            tenantId: null
        }
    },
    created: function () {
        this.tenantFlag = sessionStorage.getItem("tenantFlag")^0;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (deviceId) {
            $.get(baseURL + "merchant/tenant/info?tenantId=" + deviceId, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/merchant/tenantview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function () {
            var param = {
                data: {
                    createUserId:sessionStorage.getItem("userId"),
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/merchant/tenantedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (deviceId) {
            $.get(baseURL + "merchant/tenant/info?tenantId=" + deviceId, function (r) {
                var param = {
                    data: r.data,
                    code: 0
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/merchant/tenantedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });


        },
        updateStatus:function (deviceId,tenantFlag){
            if(tenantFlag==1){
                confirm('确定要禁用此商户吗？', function () {
                    $.ajax({
                        type: "POST",
                        url: baseURL + "merchant/tenant/updateStatus",
                        data: {
                            tenantId: deviceId,
                            tenantFlag:tenantFlag
                        },
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

            }else{
                confirm('确定要恢复此商户吗？', function () {
                    $.ajax({
                        type: "POST",
                        url: baseURL + "merchant/tenant/updateStatus",
                        data: {
                            tenantId: deviceId,
                            tenantFlag:tenantFlag
                        },
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


            }


        },
        updateFlag:function (deviceId,tenantFlag){
            if(tenantFlag==1){
                confirm('确定要开启车辆监控吗？', function () {
                    $.ajax({
                        type: "POST",
                        url: baseURL + "merchant/tenant/updateVehicleMonitorFlag",
                        data: {
                            tenantId: deviceId,
                            vehicleMonitorFlag:tenantFlag
                        },
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

            }else{
                confirm('确定要禁用车辆监控吗？', function () {
                    $.ajax({
                        type: "POST",
                        url: baseURL + "merchant/tenant/updateVehicleMonitorFlag",
                        data: {
                            tenantId: deviceId,
                            vehicleMonitorFlag:tenantFlag
                        },
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


            }


        },
        del: function (deviceId) {
            confirm('确定要删除此商户吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "merchant/tenant/delTenant?tenantId=" + deviceId,
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
        },
        // 充值按钮事件
        rechargeBtn: function (){
            vm.balanceRecord.consume=0;
            layer.open({
                title: "充值",
                type: 1,
                area: ['30%', '30%'],
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
        },
        // 充值
        recharge: function (){
            $.ajax({
                type: "POST",
                url: `${baseURL}/car/illegalBalanceRecord/recharge?consume=${vm.balanceRecord.consume}&tenantId=${vm.balanceRecord.tenantId}`,
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
        },
        // 违章余额明细列表
        illegalBalanceRecordList: function (tenantId){
            layer.open({
                title: "违章余额明细列表",
                type: 2,
                area: ['100%', '100%'],
                content: [tabBaseURL+'modules/car/illegal/balanceRecordList.html?tenantId='+tenantId,'no'],
                end: function () {
                    layer.closeAll();
                }
            });
        },
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
    form.on('select(tenantType)', function (data) {
        vm.q.tenantType = data.value;
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
        url: baseURL +'merchant/tenant/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            //  {type:'checkbox'},
            {title: '操作', width:370, minWidth:370, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'tenantName', title: '商户名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.tenantName);
                }
            },
            {
                field: 'tenantCode', title: '商户号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.tenantCode);
                }
            },
            {
                field: 'tenantConcat', title: '联系人', minWidth: 200, templet: function (d) {
                    return isEmpty(d.tenantConcat);
                }
            },
            {
                field: 'tenantPhone', title: '联系电话', minWidth: 200, templet: function (d) {
                    return isEmpty(d.tenantPhone);
                }
            },
            {
                field: 'tenantFlag', title: '商户状态', minWidth: 200, templet: function (d) {
                    var tenantFlag = d.tenantFlag;
                    if (tenantFlag == 0) {
                        return "正常";
                    } else if (tenantFlag == 1) {
                        return "禁用";
                    } else {
                        return "--"
                    }

                }
            },
            {
                field: 'tenantType', title: '商户类型', minWidth: 200, templet: function (d) {
                    var tenantType = d.tenantType;
                    if (tenantType == 0) {
                        return "平台";
                    } else if (tenantType == 1) {
                        return "租户";
                    } else {
                        return "--"
                    }

                }
            },
            {
                field: 'vehicleMonitorFlag', title: '监控状态', minWidth: 200, templet: function (d) {
                    var tenantFlag = d.vehicleMonitorFlag;
                    if (tenantFlag == 2) {
                        return "禁用";
                    } else if (tenantFlag == 1) {
                        return "正常";
                    } else {
                        return "--"
                    }

                }
            },
            {
                field: 'createTime', title: '创建时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'updateTime', title: '修改时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.updateTime);
                }
            },

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
        vm.balanceRecord.tenantId = data.tenantId;
        if (layEvent === 'edit') {
            vm.update(data.tenantId);
        } else if (layEvent === 'del') {
            vm.del(data.tenantId);
        } else if (layEvent === 'view') {
            vm.view(data.tenantId);
        }else if (layEvent === 'update1') {
            vm.updateStatus(data.tenantId,1);
        }else if (layEvent === 'update2') {
            vm.updateStatus(data.tenantId,0);
        }else if (layEvent === 'updateFlag1') {
            vm.updateFlag(data.tenantId,1);
        }else if (layEvent === 'updateFlag2') {
            vm.updateFlag(data.tenantId,2);
        }else if (layEvent === 'rechargeBtn') {
            // 充值
            vm.rechargeBtn(data.tenantId);
        }else if (layEvent === 'illegalBalanceRecordList') {
            // 余额明细
            vm.illegalBalanceRecordList(data.tenantId);
        }
    });
}


