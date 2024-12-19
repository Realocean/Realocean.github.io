$(function () {
    vm.detail(window.localStorage.getItem("id"));
    vm.promptShow = obtainPrompt(window.localStorage.getItem("status"),window.localStorage.getItem("nextInspectionTime"),window.localStorage.getItem("remaining"),window.localStorage.getItem("fixed"));
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    //年检记录
    inspectionRecord(window.localStorage.getItem("id"),window.localStorage.getItem("carNo"));
    //年检订单记录
    inspectionOrderRecord(window.localStorage.getItem("carId"));
    //年检操作日志
    inspectionLog(window.localStorage.getItem("carNo"));

    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem: '#thisTimeInspectionTime',
            type:'date',
            done:function(value){
                vm.inspectionManage.thisTimeInspectionTime = value
                // 根据本次年检时间获取年份
                $.get(baseURL + "maintenance/inspectionmanage/year/"+value, function(res){
                    vm.inspectionManage.inspectionYear = res.data;
                    $("#inspectionYear").val(res.data);
                });
            }
        });
        laydate.render({
            elem: '#nextInspectionTime',
            type:'date',
            trigger: 'click',
            done:function(value){
                vm.inspectionManage.nextInspectionTime = value;
            }
        });
    });


    //保存
    layui.form.on('submit(submitEditData)', function(){
        vm.saveOrUpdate();
        return false;
    });

    //操作
    layui.table.on('tool(record)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id,data.tabType);
        }else if(layEvent === 'detail'){
            vm.attachment(data.inspectionId,data.tabType);
        }
    });


});

var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {
        detailsTabContentList: ['详情', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '年检详情',
            '订单记录',
            '年检记录',
            '操作记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '年检详情',
        inspectionManage: {
            carOrderDto:null
        },
        totalNumber:null,
        totalAmount:null,
        showForm:false,
        inspectionRecord:{},
        deliveryFileLst:{},
        inspectionStatus:null,
        promptShow:null,
        orderTotal:0,
        inspectionPayIds:[]
    },

    created:function (){
        let _this = this;
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
            contentType: "application/json",
            data:null,
            success: function(r){
                _this.inspectionPayIds= r.dict;
            }
        });

    },
    computed:{
        getInspectionPayRecord:function (){
            for(let i=0;i<this.inspectionPayIds.length;i++){
                let payId = vm.inspectionManage.inspectionPayId;
                if(this.inspectionPayIds[i].code==payId){
                    return this.inspectionPayIds[i].value;
                }

            }

            // if (vm.inspectionManage.inspectionPayId == 1) {
            //     return "客户";
            // } else if (vm.inspectionManage.inspectionPayId == 2) {
            //     return "出租方";
            // } else if (vm.inspectionManage.inspectionPayId == 3) {
            //     return "供应商";
            // }else{
            //     return "--";
            // }

        },
    },

    methods: {
        // newMethods
        jumpToOrder: function(data){
            if (data.orderType == 1) {
                $.get(baseURL + "order/order/info/" + data.orderCarId, function (r) {
                    r.order.orderCar.orderCarStatusStr = data.statusStr;
                    var param = {
                        data: r.order
                    };
                    var index = layer.open({
                        title: "查看",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/order/orderview.html",
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }else if (data.orderType == 2) {
                $.get(baseURL + "cartransfer/sparecar/info/"+data.orderId, function(r){
                    var index = layer.open({
                        title: "备用车详情",
                        type: 2,
                        content: tabBaseURL + "modules/order/sparecardetail.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.spareCarApply = r.spareCar;
                            iframe.vm.receivablesList = r.spareCar.receivablesList;
                            if(r.spareCar.isApply == 1){
                                iframe.vm.payDayShow = true;
                            }else{
                                iframe.vm.payDayShow = false;
                            }
                            if(r.spareCar.spareCarStatus == 2){
                                iframe.vm.returnCarBtn = true;
                            }else{
                                iframe.vm.returnCarBtn = false;
                            }
                            if(r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3){
                                iframe.vm.returnCarForm = true;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息',
                                    '备用车退车信息'
                                ];
                            }else{
                                iframe.vm.returnCarForm = false;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息'
                                ];
                            }
                            iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                            iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                            iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                            iframe.vm.reloadData();
                            iframe.vm.initOperatorLog(id);
                        },
                        end: function(){
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }
        },
        detailsTabContentBindtap:function(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '年检详情';
            }
        },

        detailsSupTabContentBindtap:function(param, val) {

            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;

        },
        // newMethods   ENd
        update: function(id,tabType){
            $.get(baseURL + "maintenance/record/info/"+id+"/"+tabType, function(r){
                vm.inspectionRecord = r.data;
            });
            var index = layer.open({
                title: "年检记录修改",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
        saveOrUpdate: function (event) {
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/record/update",
                contentType: "application/json",
                data: JSON.stringify(vm.inspectionRecord),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        attachment: function (id,tabType) {
            window.localStorage.setItem("objType", 7);
            window.localStorage.setItem("objId", id);
            var index = layer.open({
                title: "维保管理 > 年检管理 > 查看年检详情 > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                }
            });
            layer.full(index);


            /*            window.localStorage.setItem("id",id);
                        window.localStorage.setItem("tabType",tabType);
                        var index = layer.open({
                            title: '附件信息查看',
                            type:2,
                            area: ['80%', '80%'],
                            content: tabBaseURL + 'modules/maintenance/inspectionmanageattachment.html',
                            end: function(){
                                layer.close(index);
                            }
                        });*/
        },
        cancel: function () {
            layer.closeAll();
        },
        detail: function (id) {
            $.get(baseURL + "maintenance/inspectionmanage/info/"+id, function(r){
                vm.inspectionManage = r.data    ;
                vm.deliveryFileLst = r.data.attachment;

                if(vm.deliveryFileLst!=null && vm.deliveryFileLst.length>0){
                    $("#njFileModelShow").hide();
                    $("#njFileModel").show();
                    Upload({
                        elid: 'njFileModel',
                        edit: false,
                        fileLst: vm.deliveryFileLst
                    }).initView();
                }else {
                    $("#njFileModel").hide();
                    $("#njFileModelShow").show();
                }

                if(0 == window.localStorage.getItem("status")){
                    vm.inspectionStatus = "待年检";
                }else {
                    vm.inspectionStatus = "已年检";
                }
            });

        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                }
            });
        },

        // 附件查看
        viewAccessory:function(){
            window.localStorage.setItem("objType", 7);
            window.localStorage.setItem("objId", vm.inspectionManage.id);
            window.localStorage.setItem("objCode", vm.inspectionManage.inspectionNumber);
            var index = layer.open({
                title: "维保管理 > 年检管理 > 查看年检详情 > 附件查看",
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
                    window.localStorage.setItem("objId", vm.inspectionManage.id);
                    window.localStorage.setItem("objType", 7);
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
                    window.localStorage.setItem("objId", vm.inspectionManage.id);
                    window.localStorage.setItem("objType", 7);
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
                },*/
    }
});


function inspectionRecord(id,carNo) {
    //年检记录
    layui.use(['form','element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "gridid",
            elem: '#record',
            url: baseURL + 'maintenance/record/list',
            where:{
                id:id,
                carNo:carNo
            },
            cols: [[
                {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
                {field: 'inspectionNo', minWidth: 100, title: '年检申请单'},
                {field: 'inspectionStatus', minWidth: 100, title: '状态',templet:function (d) {
                    if(d.inspectionStatus == 1){
                        return "已年检";
                    }else if(d.inspectionStatus == 0){
                        return "<span style='color:red;'>待年检</span>";
                    }
                }},
                {field: 'customerName', minWidth: 100, title: '客户名称',templet:function (d) {
                    return isEmpty(d.customerName);
                }},
                {field: 'vehicleOrderNo', minWidth: 100, title: '车辆订单号',templet:function (d) {
                    return isEmpty(d.vehicleOrderNo);
                }},
                {field: 'carPurposeShow', minWidth: 100, title: '车辆用途',templet:function (d) {
                    return isEmpty(d.carPurposeShow);
                }},
                {field: 'thisTimeInspectionTime', minWidth: 100, title: '本次年检时间'},
                {field: 'nextInspectionTime', minWidth: 100, title: '下次年检时间'},
                {field: 'inspectionYear', minWidth: 100, title: '年审年份'},
                {field: 'inspectionAmount', minWidth: 100, title: '年检费用'},
                {field: 'inspectionAgent', minWidth: 100, title: '年审代理人'},
                {field: 'desc', minWidth: 100, title: '备注',templet:function (d) {
                    return isEmpty(d.desc);
                }},
            /*  {minWidth: 100, title: '年检附件',align: "center",templet:'#attachmentBarTpl'},*/
                {field:'sysAccessoryList',minWidth: 100, title: '年检附件',align: "center",templet:function (d){
                    if(d.sysAccessoryList!=null && d.sysAccessoryList.length>0){
                        return "<a class=\"layui-grid-btn-xs\" lay-event=\"detail\">查看</a>";
                    }else{
                        return "--";
                    }
                }},
                {field: 'userName', minWidth: 100, title: '记录人'},
                {field: 'createTime', minWidth: 100, title: '记录时间'},
            ]],
            page: true,
            limits: [10, 20, 100, 200],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res) {
                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');

                vm.totalNumber = res.data.length;
                var count = 0;
                $.each(res.data, function (index, item) {
                    count += item.inspectionAmount;
                })
                vm.totalAmount = count;

            },
        });

    });
}
function inspectionOrderRecord(carId) {
    layui.use(['form','element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        layui.table.render({
            id: "orderRecord",
            elem: '#orderRecord',
            // toolbar: true,
            // defaultToolbar: ['filter'],
            url: baseURL + 'maintenance/order/list',
            where:{
                type:3,
                carId:carId
            },
            cols: [[
                {field: 'code',title: '订单编号',templet: function (d) {
                    if(d.code == null  || d.code == '' ){
                        return '--'
                    }
                    return "<span style='color:#419BEA;cursor: pointer' onclick = jump(\'"+d.id+"\',\'"+d.code+"\')>"+isEmpty(d.code)+"</span>";
                }},
                {field: 'rentType', title: '订单类型',templet:function (d) {
                        return getRentTypeStr(d.rentType);

                }},
                {field: 'customerName',  title: '客户名称',templet:function (d) {
                    return isEmpty(d.customerName);
                }},
                {field: 'timeStartRent',  title: '租赁开始时间',templet:function (d) {
                    return isEmpty(d.timeStartRent);
                }},
                {field: 'timeFinishRent',  title: '租赁结束时间',templet:function (d) {
                    return isEmpty(d.timeFinishRent);
                }},
                {field: 'timeDelivery',  title: '交车时间',templet:function (d) {
                    return isEmpty(d.timeDelivery);
                }},
                {field: 'timeReturn',  title: '还车时间',templet:function (d) {
                    return isEmpty(d.timeReturn);
                }},
                {title: '年检使用时间段',templet:function (d) {
                    var str = '';
                    for(var i = 0 ; i <d.inspectionList.length ;i++){
                        var serial = i+1;
                        var code = d.inspectionList[i].no;
                        if(d.inspectionList[i].type == 2){
                            if(code != null && code != ''){
                                str += "<span style='color: green'>"+serial+"、年检单:<span>"+code+"</span>；开始时间:"+d.inspectionList[i].startTime+"至"+d.inspectionList[i].endTime+"("+d.inspectionList[i].desc+")</span><br>";
                            }else{
                                str += '<span style="color: green">'+serial+'、年检单:--；开始时间:'+d.inspectionList[i].startTime+'至'+d.inspectionList[i].endTime+'('+d.inspectionList[i].desc+')</span><br>'
                            }
                        }else if(d.inspectionList[i].type == 3){
                            if(code != null && code != ''){
                                str += "<span style='color: red'>"+serial+"、年检单:<span>"+code+"</span>；开始时间:"+d.inspectionList[i].startTime+"至"+d.inspectionList[i].endTime+"("+d.inspectionList[i].desc+")</span><br>";
                            }else{
                                str += '<span style="color: red">'+serial+'、年检单:--；开始时间:'+d.inspectionList[i].startTime+'至'+d.inspectionList[i].endTime+'('+d.inspectionList[i].desc+')</span><br>'
                            }
                        }else{
                            if(code != null && code != ''){
                                str += "<span>"+serial+"、年检单:<span >"+code+"</span>；开始时间:"+d.inspectionList[i].startTime+"至"+d.inspectionList[i].endTime+"("+d.inspectionList[i].desc+")</span><br>";
                            }else{
                                str += '<span>'+serial+'、年检单:--；开始时间:'+d.inspectionList[i].startTime+'至'+d.inspectionList[i].endTime+'('+d.inspectionList[i].desc+')</span><br>'
                            }
                        }
                    }
                    return str;
                }},
            ]],
            page: true,
            limits: [10, 20, 100, 200],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res) {
                soulTable.render(this);
                //$('div[lay-id="orderRecord"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                vm.orderTotal = res.count;
            },
        });

    });
}
function inspectionLog(id) {
    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#operationRecord',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': id, "auditType": 6},
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
}
function jump(code) {
    $.get(baseURL + "maintenance/inspectionmanage/jump/"+code, function(res){
        // window.localStorage.setItem("status", res.data.status);
        // window.localStorage.setItem("fixed", res.data.fixed);
        // window.localStorage.setItem("remaining", res.data.remaining);
        //详情
        vm.detail(res.data.inspectionId);
        //年检记录
        inspectionRecord(res.data.inspectionId,res.data.carNo);
        //年检订单记录
        inspectionOrderRecord(res.data.carId);
        //年检操作日志
        inspectionLog(res.data.inspectionId);
        vm.promptShow = obtainPrompt(res.data.inspectionStatus,res.data.nextInspectionTime,res.data.remaining,res.data.fixed);
        vm.detailsSupTabContentListActiveIndex= 0;
        vm.detailsTabContentListActiveIndex = 0;
        vm.detailsSupTabContentListActiveValue = "年检详情";

    });
}
function obtainPrompt(status,nextInspectionTime,remaining,fixed) {
            var day = "";
            if(nextInspectionTime === null || nextInspectionTime === 'null' || nextInspectionTime === '' || nextInspectionTime === undefined){
                return '未年检';
            }
            var isExpire = false;
            if(remaining == 0){
                var hours = new Date().getHours();
                day = "剩余" + (24 - hours) + "小时";
            }else if (0 <= (remaining + fixed) && (remaining + fixed) <= fixed) {
                var res = remaining.toString();
                if(res * -1 < 0){
                    isExpire = true;
                    day = "超过" + (0-res * -1) + "天";
                }else{
                    day = "剩余" + (res * -1) + "天";
                }
            } else if (0 < remaining) {
                isExpire = true;
                day = "超过" + remaining + "天";
            } else {
                day = "剩余" + Math.abs(remaining) + "天";
            }

        if (status == 0) {
            if(isExpire == true){
                return "失效/" + day ;
            }else {
                if(0 <= (remaining + fixed) && (remaining + fixed) <= fixed){
                    return "有效/" + day ;
                }else if(0 < remaining){
                    return "失效/" + day ;
                } else {
                    return "有效" + day ;
                }
            }
        }else{
            return "已年检";
        }



    // var day = "";
    // if(remaining == null ){
    //     return "未年检";
    // }else if (isNotEmpty(nextInspectionTime)) {
    //     if(remaining == 0){
    //         var hours = new Date().getHours();
    //         day = "剩余" + (24 - hours) + "小时";
    //     }else if (0 <= (remaining + fixed) && (remaining + fixed) <= fixed) {
    //         var res = remaining.toString();
    //         day = "剩余" + (res * -1) + "天";
    //     } else if (0 < remaining) {
    //         day = "超过" + remaining + "天";
    //     }
    // }
    // if (status == 0) {
    //     if(0 <= (remaining + fixed) && (remaining + fixed) <= fixed){
    //         return "有效/" + day;
    //     }else if(0 < remaining){
    //         return "失效/" + day;
    //     }
    // }else{
    //     return "已年检";
    // }
}
function jump(orderCarId,code){
    $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
        if(r.code != 0){
            alert("获取订单数据异常！");
        }
        // 获取订单状态
        var statusStr = "";
        $.get(baseURL + "insurancemanage/getCarOrderStatusStr/" + code, function (r) {
            if(r.order.statusStr != null){
                statusStr = r.order.statusStr;
            }
        });
        r.order.orderCar.orderCarStatusStr = statusStr;
        var param = {
            data: r.order
        };
        var index = layer.open({
            title: "查看",
            type: 2,
            boxParams: param,
            content: tabBaseURL + "modules/order/orderview.html",
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
    });

}

