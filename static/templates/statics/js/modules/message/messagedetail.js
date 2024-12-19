$(function () {
    vm.detail(window.localStorage.getItem("id"));

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        detailForm:true,
        messageVo:{},
    },
    computed:{

    },
    created: function(){
    },
    updated: function(){
        layui.form.render();
    },
    methods: {

        // 取消
        cancel:function(){
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },

        // 查看详情
        detail: function (id) {
            $.ajax({
                type: "GET",
                url: baseURL + "message/detail/" +id,
                contentType: "application/json",
                success: function(r){
                    if(r.code === 0){
                        vm.messageVo = r.data;
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        downDoc:function (url, fileName) {
            var uri = baseURL + 'file/download?uri=' + url + "&fileName=" + fileName;
            console.log("下载路径:{}",uri);
            window.location.href = uri;
        },
        jump:function () {
            if (vm.messageVo.businessCode && vm.messageVo.businessType) {
                $.get(baseURL + "message/obtain/params/" + vm.messageVo.businessCode + "/" + vm.messageVo.businessType, function (data) {
                    if (data.code == 0) {
                        var param = '';
                        var url = '';
                        if ($.inArray(data.data.processKey, ['longRentOrderApprove', 'rentSaleOrderApprove', 'purchaseOrderApprove', 'meltsRentOrderApprove','affiliatedOrderApprove']) >= 0) {
                            param = {
                                id: data.data.businessId,
                                viewTag: 'edit',
                                approveId: data.data.id,
                                approveType: data.data.approveType
                            };
                            url = "modules/orderflow/orderflowedit.html";
                        } else {
                            param = {
                                id: data.data.businessId,
                                viewTag: 'approve',
                                instanceId: data.data.instanceId,
                                nodeId: data.data.nodeId,
                                approveId: data.data.id,
                                approveType: data.data.approveType
                            };
                            if (data.data.processKey == 'carBackApprove') {
                                url = "modules/order/applycarback.html";
                            }
                            if (data.data.processKey === 'purchaseBackApprove') {
                                url = "modules/order/applypurchaseback.html"
                            }
                            if (data.data.processKey == 'rentSaleApprove') {
                                url = "modules/order/applyrentback.html";
                            }
                            if (data.data.processKey == 'rentTransferCar') {
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
                    } else {
                        layer.alert(data.msg);
                    }

                });
            }
        }

    }
});
