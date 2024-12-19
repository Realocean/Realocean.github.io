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
            couponName: null,
            couponStatus: null,
            businessNo: null,
            serviceItemsNo: null,
            applicableUnitNo: null,
            deptId: null
        },
        serviceItems:[],
        applicableUnits:[],

    },
    created: function () {


    },
    mounted: function (){
        $.get(baseURL + "/coupon/carModelData", function (r) {
            vm.serviceItems=r.data;
        });
        $.get(baseURL + "/coupon/deptData", function (r) {
            vm.applicableUnits=r.data;
        });


    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.couponName=null;
            vm.q.couponStatus=null;
            vm.q.businessNo=null;
            vm.q.serviceItemsNo=null;
            vm.q.applicableUnitNo=null;
            vm.q.deptId=null;
        },
        view: function (couponId) {
            $.get(baseURL + "/coupon/"+couponId, function (r) {
                var param = {
                    data1: r.data1,
                    data2: r.data2
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/coupon/couponview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function () {
            var param = {
                data1: {},
                data2: {}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/coupon/couponedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (couponId) {
            $.get(baseURL + "coupon/"+couponId, function (r) {
                var param = {
                    data1: r.data1,
                    data2: r.data2

                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/coupon/couponedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });


        },
        exports:function (){
            let url = baseURL + '/coupon/exportData?';
            if (vm.q.couponName != null && vm.q.couponName !="") {
                url += '&couponName=' + vm.q.couponName;
            }
            if (vm.q.couponStatus != null && vm.q.couponStatus !="") {
                url += '&couponStatus=' + vm.q.couponStatus;
            }
            if (vm.q.businessNo != null && vm.q.businessNo !="") {
                url += '&businessNo=' + vm.q.businessNo;
            }
            if (vm.q.serviceItemsNo != null && vm.q.serviceItemsNo !="") {
                url += '&serviceItemsNo=' + vm.q.serviceItemsNo;
            }
            if (vm.q.applicableUnitNo != null && vm.q.applicableUnitNo !="") {
                url += '&applicableUnitNo=' + vm.q.applicableUnitNo;
            }
            if (vm.q.deptId != null && vm.q.deptId !="") {
                url += '&deptId=' + vm.q.deptId;
            }
            window.location.href=url;


        },
        shangJia:function (couponId){
                confirm('确定要上架优惠券吗？', function () {
                    $.ajax({
                        type: "POST",
                        url: baseURL + "coupon/suspendedeCoupon?couponId="+couponId+"&couponStatus=1",
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
        xiaJia:function (couponId){
                confirm('确定要下架优惠券吗？', function () {
                    $.ajax({
                        type: "POST",
                        url: baseURL + "coupon/suspendedeCoupon?couponId="+couponId+"&couponStatus=4",
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
        zanTing:function (couponId){
            confirm('确定要暂停优惠券吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "coupon/suspendedeCoupon?couponId="+couponId+"&couponStatus=3",
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

        qiYong:function (couponId){
            confirm('确定要启用优惠券吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "coupon/suspendedeCoupon?couponId="+couponId+"&couponStatus=1",
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

        sendCustomer:function (data) {
            window.localStorage.setItem("data",data);
            var index = layer.open({
                title: "选择客户",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/coupon/selectCoupon.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("data", null);
                    vm.reload();
                }
            })
        },

        couponData:function (data){
            $.get(baseURL + "/coupon/business/getDataInfo?couponId="+data, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/coupon/couponDataView.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });


        },

        del: function (couponId) {
            confirm('确定要删除优惠券吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/coupon/" + couponId,
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
}


function initData() {
    //初始化查询数据字典-设备生产商

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(businessNo)', function (data) {
        vm.q.businessNo = data.value;
    });
    form.on('select(couponStatus)', function (data) {
        vm.q.couponStatus = data.value;
    });

    form.on('select(serviceItemsNo)', function (data) {
        vm.q.serviceItemsNo = data.value;
    });

    form.on('select(applicableUnitNo)', function (data) {
        vm.q.applicableUnitNo = data.value;
    });

    form.on('select(deptId)', function (data) {
        vm.q.deptId = data.value;
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
        url: baseURL +'/coupon/list',
        // where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            //  {type:'checkbox'},
            {title: '操作', width:280, minWidth:280, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'couponName', title: '优惠券名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.couponName);
                }
            },
            {
                field: 'businessNo', title: '优惠券类型', minWidth: 200, templet: function (d) {
                    var businessNo = d.businessNo;
                    if (businessNo == 1) {
                        return "经租";
                    } else if (businessNo == 2) {
                        return "以租代购";
                    } else if (businessNo == 3) {
                        return "金融分期";
                    }else if (businessNo == 4) {
                        return "直购";
                    }else if (businessNo == 5) {
                        return "短租";
                    } else {
                        return "--"
                    }




                }
            },
            {
                field: 'couponStatus', title: '状态', minWidth: 200, templet: function (d) {
                    var couponStatus = d.couponStatus;
                    if (couponStatus == 1) {
                        return "已上架";
                    } else if (couponStatus == 2) {
                        return "未上架";
                    } else if (couponStatus == 3) {
                        return "暂停";
                    }else if (couponStatus == 4) {
                        return "已下架";
                    } else {
                        return "--"
                    }
                }
            },
            {
                field: 'serviceItems', title: '适用品牌/车型/车系', minWidth: 200, templet: function (d) {
                     let useArea= d.useArea;
                     if(useArea==1){
                         return "通用";
                     }else{
                         return isEmpty(d.serviceItems);

                     }

                }
            },
            {
                field: 'money', title: '优惠券面值/元', minWidth: 200 },

            {
                field: 'preferentialInfo', title: '使用条件', minWidth: 200 },

            {
                field: 'applicableUnit', title: '适用门店', minWidth: 200, templet: function (d) {

                    let applicableUnitType= d.applicableUnitType;
                    if(applicableUnitType==1){
                        return "全部";
                    }else{
                        return isEmpty(d.applicableUnit);

                    }
                }
            },
            {
                field: 'sendTimeStart', title: '发放开始时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.sendTimeStart);
                }
            },
            {
                field: 'sendTimeEnd', title: '发放结束时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.sendTimeEnd);
                }
            },
            {
                field: 'sendTotal', title: '发放总数/张', minWidth: 200, templet: function (d) {
                   let sendTotal= d.sendTotal;
                    if (sendTotal != null && String(sendTotal).length > 0 && sendTotal!='null') {
                        return sendTotal;
                    } else {
                        return '无限制';
                    }
                }
            },
            {
                field: 'issued', title: '已领取总数/张', minWidth: 200, templet: function (d) {
                    return isEmpty(d.issued);
                }
            },
            {
                field: 'restNum', title: '剩余总数/张', minWidth: 200, templet: function (d) {
                    return isEmpty(d.restNum);
                }
            },
            {
                field: 'deptName', title: '创建部门', minWidth: 200, templet: function (d) {
                    return isEmpty(d.deptName);
                }
            },
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
            vm.update(data.couponId);
        } else if (layEvent === 'view') {
            vm.view(data.couponId);
        }else if (layEvent === 'del') {
            vm.del(data.couponId);
        }else if (layEvent === 'shangJia') {
            vm.shangJia(data.couponId);
        }else if (layEvent === 'xiaJia') {
            vm.xiaJia(data.couponId);
        }else if (layEvent === 'zanTing') {
            vm.zanTing(data.couponId);
        }else if (layEvent === 'qiYong') {
            vm.qiYong(data.couponId);
        }else if (layEvent === 'sendCustomer') {
            vm.sendCustomer(data.couponId);
        }else if (layEvent === 'couponData') {
            vm.couponData(data.couponId);
        }

    });
}


