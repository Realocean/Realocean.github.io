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
var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {
        detailsTabContentList: [
            '合同详情',
            '操作记录',
        ],
        detailsSupTabContentList: [
            '合同信息',
            '车辆订单信息',
            '补充合同记录',
            '操作记录',
        ],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        contracorderNotemplate: {},
        docUrl: '',
        statusStr: null,
        contractContentUrl:''
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.contracorderNotemplate = param.contracorderNotemplate;
        _this.statusStr = param.statusStr;
        _this.contractContentUrl  = param.contracorderNotemplate.urlHtm || param.contractContentUrl ;
        $.ajaxSettings.async = false;
        /*$.get(baseURL + "contract/contraccontent/bodyByContract/"+_this.contracorderNotemplate.id, function(r){
            _this.contracorderNotemplate.body = r;
        });*/
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = "contract/contracordernotemplate/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.contracorderNotemplate),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        detailsTabContentBindtap(index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[index];
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
        skipOrderView (data) {
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
        unbind (data) {
            var param = {
                orderId: data.orderId,
                orderCarId: data.orderCarId,
                orderType: data.orderType,
                contractId: vm.contracorderNotemplate.id
            };
            var index = layer.open({
                title: "解绑合同关系",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/contract/unbindcontract.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        reload: function (event) {
            layui.table.reload('orderCarLstid', {
                page: {
                    curr: 1
                },
                where: {
                    contractId: vm.contracorderNotemplate.id
                }
            });
        },
        reloadSupplementLst: function (event) {
            layui.table.reload('supplementLstid', {
                page: {
                    curr: 1
                },
                where: {
                    contractId: vm.contracorderNotemplate.id
                }
            });
        },
        uploadSupplement: function () {
            var param = {
                data:{
                    contractId: vm.contracorderNotemplate.id,
                    operationId: sessionStorage.getItem("userId"),
                    operationName: sessionStorage.getItem("username")
                }
            };
            var index = layer.open({
                title: "上传补充合同",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/contract/contracsupplementedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        viewDoc: function (data) {
            if (this.viewer != null){
                this.viewer.close();
                this.viewer = null;
            }
            this.viewer = new PhotoViewer([
                {
                    src: fileURL+data.url,
                    title: data.nameFile
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        downDoc: function (data) {
            var uri = baseURL + 'file/download?uri='+data.url+"&fileName="+data.nameFile;
            window.location.href = uri;
        },
        printDoc: function (data) {
            if (data.typeFile == 1) {
                printJS({printable: fileURL+data.url, type: 'image', base64: false});
            }else {
                printJS({printable: data.base64, type: 'pdf', base64: true});
            }
        },
        downloadDoc: function () {
            var uri = baseURL + 'file/download?uri='+encodeURI(vm.contracorderNotemplate.urlPdf)+"&fileName="+vm.contracorderNotemplate.code+".pdf";
            window.location.href = uri;
        },
        printDoc1: function () {
            // if (vm.contracorderNotemplate.body) {
            //     PrintHtml(vm.contracorderNotemplate.body);
            //     // printJS({printable: 'docIframe', type: 'html', scanStyles: false})
            // } else {
            //     printJS({printable: vm.contracorderNotemplate.base64, type: 'pdf', base64: true});
            // }
            if (vm.contracorderNotemplate && vm.contracorderNotemplate.base64 && vm.contracorderNotemplate.base64 != '') {
                printJS({printable: vm.contracorderNotemplate.base64, type: 'pdf', base64: true});
            } else {
                var urlPath = vm.contractContentUrl || vm.contracorderNotemplate.urlHtm;

                var htmlUrl = location.origin+'/image-server/' + urlPath;

                htmlUrl = htmlUrl.replace(/\\/g, '/');
                console.log("打印地址：",htmlUrl);
                // 查找最后一个“/”，并截取之前的内容
                var htmlUrlPrefix = htmlUrl.substring(0,htmlUrl.lastIndexOf("/"));
                var htmlContent = $("#docIframe1")[0].contentWindow.document.body.outerHTML;

                htmlContent = htmlContent.replaceAll("./",htmlUrlPrefix+"/");
                PrintHtml(htmlContent);
            }
        },
        closePage: function () {
            closePage();
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initUpload(upload) {
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsSupTabContentList[0];
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.contracorderNotemplate.id,
            auditType: 2
        },
        cols: [[
            {field: 'operatorName',align:"center", title: '操作人', minWidth: 200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field: 'memo',align:"center", title: '操作内容', minWidth: 200, templet: function (d) {return isEmpty(d.memo);}},
            {field: 'timeCreate',align:"center", title: '操作时间', minWidth: 200, templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
        }
    });

    table.render({
        id: "orderCarLstid",
        elem: '#orderCarLst',
        url: baseURL + 'contract/contracordernotemplate/contractOrderLst',
        where: {
            contractId: vm.contracorderNotemplate.id
        },
        cols: [[
            {title: '操作', width:150, templet:'#barTpl',align:"center"},
            {field:'carNo', title: '车牌号',align:"center", minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
            {title: '订单号',align:"center", minWidth:200, templet:'#skipOrder'},
            {field:'modelNames',align:"center", title: '品牌/车系/车型', minWidth:200, templet: function (d) {return isEmpty(d.modelNames);}},
            {field:'vinNo',align:"center", title: '车架号', minWidth:200, templet: function (d) {return isEmpty(d.vinNo);}},
            {field:'statusStr',align:"center", title: '订单状态', minWidth:200, templet: function (d) {return isEmpty(d.statusStr);}},
            {field:'lessorName',align:"center", title: '出租方', minWidth:200, templet: function (d) {return isEmpty(d.lessorName);}},
            {field:'customerName',align:"center", title: '客户名称', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'timeStartRent',align:"center", title: '租赁开始时间', minWidth:200,  templet: function (d) {return isEmpty(d.timeStartRent);}},
            {field:'timeFinishRent',align:"center", title: '租赁结束时间', minWidth:200,  templet: function (d) {return isEmpty(d.timeFinishRent);}},
            {field:'timeDelivery',align:"center", title: '交车时间', minWidth:200,  templet: function (d) {return isEmpty(d.timeDelivery);}},
            {field:'timeReturn',align:"center", title: '退车时间', minWidth:200,  templet: function (d) {return isEmpty(d.timeReturn);}},
            {field:'timeAlteration',align:"center", title: '换车时间', minWidth:200,  templet: function (d) {return isEmpty(d.timeAlteration);}},
            {field:'timeCreate',align:"center", title: '创建时间', minWidth:200,  templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
        }
    });

    table.render({
        id: "supplementLstid",
        elem: '#supplementLst',
        url: baseURL + 'contract/contracsupplement/queryList',
        where: {
            contractId: vm.contracorderNotemplate.id
        },
        cols: [[
            {title: '操作', width:150,align:'center', templet:'#barSupplementLstTpl'},
            {field:'nameFile',align:'center', title: '文件名称', minWidth:200, templet: function (d) {return isEmpty(d.nameFile);}},
            {field:'desc',align:'center', title: '文件备注', minWidth:200, templet: function (d) {return isEmpty(d.desc);}},
            {field:'operationName',align:'center', title: '提交人', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
            {field:'timeCreate',align:'center', title: '提交时间', minWidth:200,  templet: function (d) {return dateFormat(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(supplementLst)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'viewDoc'){
            vm.viewDoc(data);
        } else if(layEvent === 'downDoc'){
            vm.downDoc(data);
        } else if(layEvent === 'printDoc'){
            vm.printDoc(data);
        }
    });

    table.on('tool(orderCarLst)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'skipOrderView'){
            vm.skipOrderView(data);
        } else if(layEvent === 'unbind'){
            vm.unbind(data);
        }
    });
}

function initDate(laydate) {
    var timeStart = laydate.render({
        elem: '#timeStart',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contracorderNotemplate.timeStart = value;
            timeFinish.config.min = date;
            timeFinish.config.min.month = date.month -1;
        }
    });

    var timeFinish = laydate.render({
        elem: '#timeFinish',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contracorderNotemplate.timeFinish = value;
            timeStart.config.max = date;
            timeStart.config.max.month = date.month -1;
        }
    });

    laydate.render({
        elem: '#timeSigned',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contracorderNotemplate.timeSigned = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
