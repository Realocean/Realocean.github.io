$(function () {

    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table','soulTable'], function () {
        var table = layui.table;
        var soulTable = layui.soulTable;
        var value = window.localStorage.getItem("msgStatus");
        table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'message/list',
            where:{
                msgStatus: value == null ? 1: value
            },
            cols: [[
                {title: '操作', width: 100, templet: '#barTpl', fixed: "left", align: "center"},
                {
                    field: 'msgType',width: 150, align: "center", title: '消息类型', templet: function (d) {
                    if (d.msgType == 1) {
                        return "系统消息";
                    } else if (d.msgType == 2) {
                        return "业务消息";
                    } else if(d.msgType == 3){
                        return "业务消息";
                    } else{
                        return isEmpty(d.msgType);
                    }
                }
                },
                {
                    align: "msgContent",width:600, title: '消息内容',templet: '#titleTpl'},
                {
                    field: 'msgStatus',width: 150, align: "center", title: '消息类型', templet: function (d) {
                    if (d.msgStatus == 1) {
                        return "未读";
                    } else if (d.msgStatus == 2) {
                        return "已读";
                    } else {
                        return isEmpty(d.msgStatus);
                    }

                }
                },
                {
                    field: 'sendTime', width: 200,align: "center", title: '推送时间', templet: function (d) {
                    return isEmpty(d.sendTime);
                }
                },
            ]],
            page: true,
            limits: [10, 20, 50, 100],
            limit: 10,
            // autoColumnWidth: {
            //     init: true
            // },
            done: function (res) {
                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            }
        });

    });

    /**
     * 筛选监听下拉选、时间组件
     */
    layui.use(['form','laydate','upload'],function(){
        var form = layui.form;
        var laydate = layui.laydate;
        //消息类型
        form.on('select(msgType)', function (data) {
            vm.q.msgType = data.value;
        })
        //推送时间
        laydate.render({
            elem: '#createTime',
            type: 'datetime',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.createTime = value;
            }
        });
        form.render();
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'detail') {
            vm.detail(data.id, data.businessType, data.businessId);
        }else if(layEvent === 'jump'){
            vm.jump(data)
        }
    });

    //查询消息列表统计
    getListTotal();

});


var vm = new Vue({

    el: '#rrapp',
    data: {
        q: {
            msgContent: null,
            msgType: null,
            createTime: null,
            msgStatus:null,
        },
        read:null,
        unread:null,
        allRead:null,
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function(){
        $("#field1").addClass("flex active");
    },
    methods: {
        reset: function () {
            vm.q.msgContent = null;
            vm.q.msgType = null;
            vm.q.createTime = null;
        },
        detail: function (id,businessType,businessId) {
            if(businessType !=4) {//之前的消息跳转逻辑
                window.localStorage.setItem("id",id);
                var index = layer.open({
                    title: "系统管理 > 消息列表 > 消息详情",
                    type: 2,
                    content: tabBaseURL+'modules/message/messagedetail.html',
                    end: function(){
                        layer.close(index);
                        window.localStorage.setItem("id",null);
                        vm.reload();
                    }
                });
                layer.full(index);
            }else {//出库消息
                var index = layer.open({
                    title: "出库消息",
                    type: 2,
                    boxParams: {id, businessId},
                    content: tabBaseURL+'modules/stockManager/examorder.html',
                    end: function(){
                        layer.close(index);
                        vm.reload();
                    }
                });
                layer.full(index);
            }
        },
        cancel: function () {
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    msgContent: vm.q.msgContent,
                    msgType: vm.q.msgType,
                    createTime: vm.q.createTime,
                    msgStatus:vm.q.msgStatus,
                }
            });
            getListTotal();
        },
        changeStatus:function(type){
            removeClass();
            vm.q.msgStatus = type;
            vm.reload();

            if (type == 1) {
                $("#field1").addClass("flex active");
            } else if (type == 2) {
                $("#field2").addClass("flex active");
            }else if (type == 0) {
                $("#field3").addClass("flex active");
            }
        },
        jump:function (data) {
            if (data.businessCode && data.businessType){
                $.get(baseURL + "message/obtain/params/"+data.businessCode+"/"+data.businessType, function (data) {
                    if(data.code  == 0){
                        var param = '';
                        var url = '';
                        if($.inArray(data.data.processKey, ['longRentOrderApprove','rentSaleOrderApprove','purchaseOrderApprove','meltsRentOrderApprove','affiliatedOrderApprove']) >= 0){
                            param = {
                                id: data.data.businessId,
                                viewTag: 'edit',
                                approveId: data.data.id,
                                approveType: data.data.approveType
                            };
                            url = "modules/orderflow/orderflowedit.html";
                        }else{
                            param = {
                                id: data.data.businessId,
                                viewTag: 'approve',
                                instanceId: data.data.instanceId,
                                nodeId: data.data.nodeId,
                                approveId: data.data.id,
                                approveType: data.data.approveType
                            };
                            if(data.data.processKey == 'carBackApprove'){
                                url = "modules/order/applycarback.html";
                            }
                            if(data.processKey === 'purchaseBackApprove'){
                                url = "modules/order/applypurchaseback.html"
                            }
                            if(data.data.processKey == 'rentSaleApprove'){
                                url = "modules/order/applyrentback.html";
                            }
                            if(data.data.processKey == 'rentTransferCar'){
                                url = "modules/order/applytransfercar.html";
                            }
                        }
                        var index = layer.open({
                            title: data.nodeName,
                            type: 2,
                            boxParams: param,
                            content: tabBaseURL + url,
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }else{
                        layer.alert(data.msg);
                    }

                });
            }
        }
    }
});

function removeClass(){
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
    $("#field3").removeClass("active");
}

/**
 * 列表统计查询
 */
function getListTotal() {
    $.get(baseURL + "message/list/total", function (r) {
        console.log(r);
        vm.allRead = r.data.allRead;
        vm.read = r.data.read;
        vm.unread = r.data.unread;
    });
}


