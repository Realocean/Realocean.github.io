$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    vm.detail(window.localStorage.getItem("carRepairOrderId"));
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        vm.maintenanceFeedback.costSettlement=2;
        form.verify({
            repairEndDateVerify: function (value) {
                if (vm.maintenanceFeedback.repairEndDate == "" || vm.maintenanceFeedback.repairEndDate == null) {
                    return '维修结束时间不能为空';
                }
            },
            /* costSettlementVerify: function (value) {
                 if (value == "" || value == null) {
                     return '是否已计算不能为空';
                 }
             }*/

        });
        form.render();
    });

    //维修结束时间
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //维修开始时间
        laydate.render({
            elem: '#repairEndDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.maintenanceFeedback.repairEndDate=value;
            }
        });
    });

    //是否已结算
    layui.form.on('select(costSettlement)', function (data) {
        vm.maintenanceFeedback.costSettlement = data.value;
    });

    layui.form.on('submit(feedbackSave)', function(){
        vm.feedbackSave();
        return false;
    });


    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#operationLog',
     // toolbar: true,
     // defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': window.localStorage.getItem("applyNo"), "auditType": 10},
        cols: [[
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
        limits: [10, 20, 100, 200],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function () {
            soulTable.render(this);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        carRepairOrder:{},
        detailForm:true,
        detailsTabContentList: ['维修详情','操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '维修详情',
        //反馈信息数据源
        maintenanceFeedback:{},

    },
    computed:{

    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap:function (param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '维修详情';
            }else if(param === 1){
                this.detailsSupTabContentListActiveValue = '操作记录';
            }
        },

        detailsSupTabContentBindtap:function(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },
        // 取消
        cancel:function(){
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        // 查看详情
        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "carrepairorder/carrepairorder/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.carRepairOrder = r.carRepairOrder;
                        vm.fileLst = r.carRepairOrder.fileLst;
                        if(vm.fileLst.length == 0){
                            $("#RepairModel").hide();
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        feedbackSave:function () {
            vm.maintenanceFeedback.id=vm.carRepairOrder.id;
            $.ajax({
                type: "POST",
                url: baseURL + "carrepairorder/carrepairorder/feedbackSave",
                contentType: "application/json",
                data: JSON.stringify(vm.maintenanceFeedback),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        // 附件查看
        viewAccessory:function(){
            window.localStorage.setItem("objType", 9);
            window.localStorage.setItem("objId", vm.carRepairOrder.id);
            window.localStorage.setItem("objCode", vm.carRepairOrder.applyNo);
            var index = layer.open({
                title: "维保管理 > 维修列表 > 查看维修单 > 附件查看",
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

        /*        preview:function(){
                    window.localStorage.setItem("collectionsNo", vm.carRepairOrder.id);
                    var index = layer.open({
                        title: "维保管理 > 维修列表 >查看维修单>图片预览",
                        type: 2,
                        area: ['850px', '530px'],
                        fixed: false, //不固定
                        maxmin: true,
                        content: tabBaseURL + 'modules/financial/pictureDetail.html',
                        end: function () {
                            layer.close(index);
                            window.localStorage.setItem("collectionsNo", null);
                        }
                    });
                    layer.full(index);
                },
                download:function(){
                    //获取收款单主键
                    window.localStorage.setItem("collectionId", vm.carRepairOrder.id);
                    var index = layer.open({
                        title: "维保管理 > 维修列表 >查看维修单>文档下载",
                        type: 2,
                        area: ['1070px', '360px'],
                        fixed: false, //不固定
                        maxmin: true,
                        content: tabBaseURL + 'modules/financial/collectiondocdownload.html',
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                },*/

    }
});
