$(function () {
    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#operationRecord',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': window.localStorage.getItem("id"), "auditType": 8},
        cols: [[
            // {type:'checkbox'},
            // {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'operatorName', align: "center", title: '操作人', templet: function (d) {
                return isEmpty(d.operatorName);
            }
            },
            {
                field: 'memo', align: "center", title: '操作内容', templet: function (d) {
                return isEmpty(d.memo);
            }
            },
            {
                field: 'operatorTime', align: "center", title: '操作时间', templet: function (d) {
                return isEmpty(d.operatorTime);
            }
            }
        ]],
        page: true,
        // loading: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });
})
var viewer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        operationLog:false,
        list:{},
        status:null,
        settleName:null,
        detailsTabContentList: ['详情', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '详情',
        settleOrderStatus:null,
        deliveryFileLst:null,
        returnTypeDiv:true,

    },
    computed:{
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function(){
        this.initPage();
    },
    methods: {
        // newMethods

        detailsTabContentBindtap:function(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '详情';
            }
        },
        // newMethods   ENd
        initPage: function() {
            var id = window.localStorage.getItem("id");
            $.get(baseURL + "financial/settleorder/info/"+id, function(res){
                if(res.data.settleType == 1 || res.data.settleType == 3){
                    vm.returnTypeDiv = false;
                }
                vm.list = res.data;
                vm.deliveryFileLst = vm.list.attachment;
                console.log("结算单详情：{}",vm.list);
                if(vm.list.settleOrderStatus){
                    vm.operationLog = true;
                    vm.status = '已处理';
                    layui.table.render({
                        id: "log",
                        elem: '#log',
                        url: baseURL + 'financial/settleorder/log',
                        where:{
                          id:id
                        },
                        cols:[[
                            {field:'userName', minWidth:100, title: '操作人'},
                            {field:'company', minWidth:150, title: '所属公司'},
                            {field:'content', minWidth:300, title: '操作内容'},
                            {field:'createTime', minWidth:100, title: '操作时间'},
                        ]],

                        done:function(res){
                        }
                    })
                }else{
                    vm.status = '待处理';
                    vm.operationLog = false;
                }
                if(vm.list.settleMoneyType == 0){
                    vm.settleName = '实际应缴结算金额：';
                }else{
                    vm.settleName = '实际应退结算金额：';
                }
            });
        },

        // 附件查看
        viewAccessory:function(objType){
            if(vm.list.settleType == 1){
                window.localStorage.setItem("objType", 13);
            }else if(vm.list.settleType == 2){
                window.localStorage.setItem("objType", 14);
            }
            window.localStorage.setItem("objId", vm.list.alterationId);
            var index = layer.open({
                title: "财务管理 > 结算单审核表 > 查看结算单 > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },

        preview:function(){
            window.localStorage.setItem("objId", vm.list.alterationId);
            if(vm.list.settleType == 1){
                window.localStorage.setItem("objType", 13);
            }else if(vm.list.settleType == 2){
                window.localStorage.setItem("objType", 14);
            }
            var index = layer.open({
                title: "图片预览",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/carrepairorder/carrepairorderpictureDetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                }
            });
            layer.full(index);
        },
        download:function(){
            window.localStorage.setItem("objId", vm.list.alterationId);
            if(vm.list.settleType == 1){
                window.localStorage.setItem("objType", 13);
            }else if(vm.list.settleType == 2){
                window.localStorage.setItem("objType", 14);
            }
            window.localStorage.setItem("typeFile", 0);
            var index = layer.open({
                title: "文档下载",
                type: 2,
                area: ['1070px', '360px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/collectiondocdownload.html',
                end: function () {
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("typeFile", null);
                    layer.close(index);
                }
            });
            layer.full(index);
        },
    }
});
