$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{
        orderDaiKouEntity: {},
        financialVos:[]
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.orderDaiKouEntity = param.data;
        _this.financialVos = param.data.financialVos;
    },
    computed:{
        getSignType: {
            get: function () {
                return getBillRentTypeStr(this.flowEntity.rentType);
            }
        },
        getSignStatus: {
            get: function () {
                if (this.orderDaiKouEntity.signStatus == 0) {
                    return "签约成功";
                } else if (this.orderDaiKouEntity.signStatus == 1) {
                    return "已解约";
                } else {
                    return "--";
                }
            }

        }

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        showDoc: function (url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: '客户资料'
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },

    }
});

function init(layui) {
    initEventListener(layui);
    initTable(layui.table, layui.soulTable);

}

function initEventListener(layui) {
    initClick();
}

function initTable(table, soulTable){
    table.render({
        id: "grid",
        elem: '#grid',
        data:vm.financialVos,
        cols: [[
            {
                field: 'period', title: '期数', minWidth: 200, templet: function (d) {
                    return isEmpty(d.period);
                }
            },
            {
                field: 'planDeductionTime', title: '预计扣款时间', minWidth: 200, templet: function (d) {
                   return isEmpty(d.planDeductionTime)
                }
            },
            {
                field: 'applyDeductionAmount', title: '申请扣款金额', minWidth: 200, templet: function (d) {
                    return isEmpty(d.applyDeductionAmount);
                }
            },
            {
                field: 'actualDeductionAmount', title: '实际扣款金额', minWidth: 200, templet: function (d) {
                    return isEmpty(d.actualDeductionAmount);
                }
            },
            {
                field: 'restDeductionAmount', title: '剩余扣款金额', minWidth: 200, templet: function (d) {
                    return isEmpty(d.restDeductionAmount);

                }
            },
            {
                field: 'deductionWay', title: '扣款方式', minWidth: 200, templet: function (d) {
                    var deductionWay = d.deductionWay;
                    if (deductionWay == 1) {
                        return "手动";
                    } else if (deductionWay == 2) {
                        return "自动";
                    } else {
                        return "--"
                    }

                }
            },
            {
                field: 'status', title: '状态', minWidth: 200, templet: function (d) {
                    var status = d.status;
                    if (status == 1) {
                        return "待扣款";
                    } else if (status == 2) {
                        return "扣款成功";
                    }else  if(status == 7){
                        return "扣款中";
                    }else if(status == 8){
                        return "代扣失败";
                    }else if(status == 9){
                        return "部分扣款成功";
                    } else {
                        return "--"
                    }



                }
            },
            {
                field: 'deductionRemark', title: '扣款说明', minWidth: 200, templet: function (d) {
                    return isEmpty(d.deductionRemark);
                }
            },
            {
                field: 'actualDeductionTime', title: '实际最新扣款时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.actualDeductionTime);
                }
            }

        ]],
        page: false,limit: 500,
        loading: true,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            // soulTable.render(this);
            // $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            // $(".layui-table-main tr").each(function (index, val) {
            //     $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
            //     $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            // });
        }
    });



}


function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
