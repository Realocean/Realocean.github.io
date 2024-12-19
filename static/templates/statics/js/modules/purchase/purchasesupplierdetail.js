$(function () {
    vm.detail(window.localStorage.getItem("purchaseSupplierId"));
    var objId = window.localStorage.getItem("id");

    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#yslogid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': objId, 'auditType':1},
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
        limit: 10
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        detailForm:true,
        purchaseSupplier:{},
        detailsTabContentList: ['供应商详情',  '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '供应商详情',
        fileMaps:[],
        fileLstId: '0'
    },
    computed:{

    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '供应商详情';
            }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },

        showDoc: function (fileName, url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
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
                url: baseURL + "purchase/purchasesupplier/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){

                        vm.purchaseSupplier = r.purchaseSupplier;
                        if(vm.purchaseSupplier.fileMaps != null){
                            vm.fileMaps = vm.purchaseSupplier.fileMaps;
                            if(vm.fileMaps.length == 0){
                                $("#gysModel").hide();
                            }
                        } else{
                            $("#gysModel").hide();
                        }

                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        // 附件查看
        viewAccessory:function(){
            window.localStorage.setItem("objType", 2);
            window.localStorage.setItem("objId",vm.purchaseSupplier.id);
            window.localStorage.setItem("objCode",vm.purchaseSupplier.purchaseSupplierId);
            var index = layer.open({
                title: "供应商 >查看供应商详情 > 附件查看",
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

    }
});
