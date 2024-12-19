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
                vm.q.receivableDateStr = value;
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
            status: null,
            operatorName: null,
            customerName: null,
            rentType: null,
            receivableDateStr: null,
            businessNo:null,
            receivablesNo:null,
            carPlateNo:null,
        },
        unsignReason:null,
        editForm:false,
        receivableVo:{},
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
            $.get(baseURL + "/flow/info?receivablesId="+id, function (r) {
                var param = {
                    data: r.data
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/daikou/daiKouFlowView.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        koukuan:function(data){
            vm.receivableVo=data;
            vm.receivableVo.shouldPayAmount=null;
            let index = layer.open({
                title: "扣款",
                type: 1,
                area: ['700px', '500px'],
                btn: ['保存', '返回'],
                content: $("#editForm"),
                end: function () {
                    vm.editForm = false;
                    layer.closeAll();
                },
                btn1: function (index, layero) {
                    let amount=vm.receivableVo.shouldPayAmount;
                    if(amount==null||amount==''){
                        alert("扣款金额不能为空");
                        return;
                    }
                    if(amount<=0){
                        alert("扣款金额必须大于0");
                        return;
                    }
                    if(amount < 5 ){
                        alert("申请扣款金额至少为5元");
                        return;
                    }
                    let re = /^\d+(?=\.{0,1}\d+$|$)/;
                    if(!re.test(amount)){
                        alert("扣款金额只能为数字");
                        return;
                    }
                    // if(amount >  vm.receivableVo.restPayAmount){
                    //     alert("申请扣款金额不能大于剩余总金额");
                    //     return;
                    // }
                    $.ajax({
                        type: "post",
                        url: baseURL +"/flow/deductionMoney",
                        contentType: "application/json",
                        data: JSON.stringify(vm.receivableVo),
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


}
function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(status)', function (data) {
        vm.q.status = data.value;
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
        url: baseURL +'/flow/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            //  {type:'checkbox'},
            {title: '操作',  width:100, minWidth:100, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'carPlateNo', title: '车牌号',fixed: "left", align:"center",minWidth: 200, templet: function (d) {
                    return isEmpty(d.carPlateNo);
                }
            },
            {
                field: 'rentType', title: '业务类型', minWidth: 200, templet: function (d) {
                    return getBillRentTypeStr(d.rentType);
                }
            },
            {
                field: 'signOrderNo', title: '签约订单号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.signOrderNo);
                }
            },
            {
                field: 'businessNo', title: '车辆订单号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.businessNo);
                }
            },
            {
                field: 'receivablesNo', title: '应收单号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.receivablesNo);
                }
            },
          
            {
                field: 'customerName', title: '客户名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.customerName);
                }
            },
            {
                field: 'mobile', title: '联系电话', minWidth: 200, templet: function (d) {
                    return isEmpty(d.mobile);
                }
            },
            {
                field: 'cardNo', title: '身份证', minWidth: 200, templet: function (d) {
                    return isEmpty(d.cardNo);
                }
            },
            {
                field: 'status', title: '扣款状态', minWidth: 200, templet: function (d) {
                    var status = d.status;
                    if (status == 1) {
                        return "待收款";
                    } else if (status == 7) {
                        return "扣款中";
                    } else if (status == 8) {
                        return "扣款失败";
                    }else if (status == 9) {
                        return "部分扣款成功";
                    }else if (status == 2) {
                        return "扣款成功";
                    }
                    else {
                        return "--"
                    }
                }
            },

            {
                field: 'receivableDate', title: '预计扣款时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.receivableDate);
                }
            },
            {
                field: 'updateTime', title: '最后扣款时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.updateTime);
                }
            },
            {
                field: 'payType', title: '扣款方式', minWidth: 200, templet: function (d) {
                    var payType = d.payType;
                    if (payType == 1) {
                        return "手动";
                    } else if (payType == 2) {
                        return "自动";
                    }else{
                        return "--"
                    }

                }
            },
            {
                field: 'shouldPayAmount', title: '签约扣款金额', minWidth: 200, templet: function (d) {
                    return isEmpty(d.shouldPayAmount);
                }
            },
            {
                field: 'netReceipts', title: '实际扣款金额', minWidth: 200, templet: function (d) {
                    return isEmpty(d.netReceipts);
                }
            },
            {
                field: 'restPayAmount', title: '剩余扣款金额', minWidth: 200, templet: function (d) {
                    return isEmpty(d.restPayAmount);
                }
            },
            {
                field: 'operatorName', title: '所属业务员', minWidth: 200, templet: function (d) {
                    return isEmpty(d.operatorName);
                }
            },
            {
                field: 'stageStr', title: '期数', minWidth: 200, templet: function (d) {
                    return isEmpty(d.stageStr);
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
            vm.view(data.receivablesId);
        }else if(layEvent=== 'koukuan'){
            vm.koukuan(data);
        }

    });
}


