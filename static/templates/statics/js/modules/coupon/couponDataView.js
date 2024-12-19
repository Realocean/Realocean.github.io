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
var vm = new Vue({
    el:'#rrapp',
    data:{
        couponInfo: {},
        q: {
            keyword: null,

        },
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.couponInfo = param.data;
    },
    computed:{
        getStatus:{
            get: function () {
                if (this.couponInfo.couponStatus == 1) {
                    return "已上架";
                } else if (this.couponInfo.couponStatus == 2) {
                    return "未上架";
                } else if (this.couponInfo.couponStatus == 3) {
                    return "暂停";
                }else if (this.couponInfo.couponStatus == 4) {
                    return "已下架";
                }
                else {
                    return "--";
                }
            }

        },
        getSendTotal:{
            get: function () {
                if (this.couponInfo.couponSendTotal !=null && this.couponInfo.couponSendTotal!= '') {
                    return this.couponInfo.couponSendTotal;
                } else {
                    return "无限制";
                }
            }
        },

        getRest:{
            get: function () {
                if (this.couponInfo.couponSendTotal !=null && this.couponInfo.couponSendTotal!= '') {
                    return this.couponInfo.couponRestNum;
                } else {
                    return "无限制";
                }
            }
        },

    },
    updated: function(){
        layui.form.render();
    },
    methods: {

        query: function () {
            vm.reload();
        },

        reset: function () {
            vm.q.keyword = null;
        },

        reload: function () {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: {
                    keyword: vm.q.keyword
                }
            });
        }

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
        url: baseURL +'coupon/member/list?couponId='+ vm.couponInfo.couponId,
        cols: [[
            // {
            //     field: 'vxUrl', title: '微信头像', minWidth: 180,templet: function (d) {
            //         var vxUrl= isEmpty(d.vxUrl);
            //         if(vxUrl!=null && vxUrl!= ''){
            //             let str='<div><img src="' + vxUrl + '"></div>';
            //             return str;
            //         }else{
            //             return "--";
            //         }
            //
            //     }
            // },
            // {
            //     field: 'vxName', title: '微信昵称', minWidth: 200, templet: function (d) {
            //        return isEmpty(d.vxName)
            //     }
            // },
            {
                field: 'memberName', title: '客户名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.memberName);
                }
            },
            {
                field: 'memberPhone', title: '手机号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.memberPhone);
                }
            },
            // {
            //     field: 'memberType', title: '客户性质', minWidth: 200, templet: function (d) {
            //        let memberType= d.memberType;
            //        if(memberType==1){
            //            return "老客户";
            //        }else if(memberType==2){
            //            return  "新客户";
            //        }else{
            //            return "--";
            //        }
            //
            //     }
            // },
            {
                field: 'phoneModel', title: '手机型号', minWidth: 200, templet: function (d) {
                   return isEmpty(d.phoneModel);

                }
            },
            {
                field: 'sourceType', title: '领取方式', minWidth: 200, templet: function (d) {
                    var sourceType = d.sourceType;
                    if (sourceType == 1) {
                        return "秒杀活动";
                    } else if (sourceType == 2) {
                        return "同行活动";
                    }else  if(sourceType == 3) {
                        return "抽奖";
                    } else  if(sourceType == 4) {
                        return "系统发放";
                    }  else  if(sourceType == 5){
                        return "客户领取";
                    } else  if(sourceType == 6){
                        return "转赠";
                    } else {
                        return "--"
                    }



                }
            },
            {
                field: 'createName', title: '发放人/分享人', minWidth: 200, templet: function (d) {
                    return isEmpty(d.createName);
                }
            },
            {
                field: 'distributedTime', title: '领取时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.distributedTime);
                }
            },
            {
                field: 'memberCouponStatus', title: '使用状态', minWidth: 200, templet: function (d) {
                    var memberCouponStatus = d.memberCouponStatus;
                    if (memberCouponStatus == 0) {
                        return "待使用";
                    } else if (memberCouponStatus == 1) {
                        return "已使用";
                    } else if (memberCouponStatus == 2) {
                        return "已过期";
                    } else if (memberCouponStatus == 3) {
                        return "已转赠";
                    } else {
                        return "--";
                    }
                }
            },
            {
                field: 'useTime', title: '使用时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.useTime);
                }
            }

        ]],
        page: true,
        loading: true,
        limits: [10, 50, 100, 200],
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
