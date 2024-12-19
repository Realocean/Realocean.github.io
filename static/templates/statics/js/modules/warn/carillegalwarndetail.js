$(function () {
    var carId = window.localStorage.getItem("carId");
    layui.table.render({
        id: "msg1List",
        elem: '#msg1List',
        url: baseURL + 'maintenance/insurancemanage/queryMsgData',
        where: {'businessId': carId,'businessType':3},
        cols: [[
            {field:'createTime', title: '消息发送时间', minWidth:125,align:'center'},
            {field:'currentStatus', title: '消息状态', minWidth:100,align:'center',templet:function (d) {
                    if(d.currentStatus!=null && d.currentStatus!=""){
                        if(d.currentStatus == '0'){
                            return "未读";
                        } else if(d.currentStatus == '1'){
                            return "已读";
                        } else {
                            return "--";
                        }
                    }else {
                        return "--";
                    }
                }},
            {field:'msgContent', title: '发送内容', minWidth:680,align:'center'},
            {field:'createUserName', title: '发送者', minWidth:150,align:'center'},
            {field:'receiverName', title: '接收人', minWidth:150,align:'center'},
            {field:'msgType', title: '消息类型', minWidth:80,align:'center',templet:function (d) {
                    if(d.msgType!=null && d.msgType!=""){
                        if(d.msgType == '1'){
                            return "短信通知";
                        } else if(d.msgType == '2'){
                            return "站内信";
                        } else {
                            return "--";
                        }
                    }else {
                        return "--";
                    }
                }},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
/*        detailsTabContentList: ['违章详情'],
        detailsTabContentListActiveIndex: 0,
        detailsTabContentListActiveValue:'违章信息',*/
        detailsTabContentList: ['违章详情'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '违章信息',
            '消息提醒记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '违章信息',
        carIllegal:{}
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '消息记录信息';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '违章信息';
            }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;

        },
    }
});

