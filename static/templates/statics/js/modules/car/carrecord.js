$(function () {
    layui.use(['form','upload'], function () {
        var upload = layui.upload;
        var form = layui.form;
        uploadAttachment(upload);
        form.on('submit(save)', function () {
            vm.saveOrUpdate();
            return false;
        });
        form.render();
    });
});
var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        deliveryFileLst: [],
        carRecord:{},
        deliveryFileLstId: 'deliveryFileLstId_0'
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if(param&&param.data&&param.data.deliveryFileLst){
            _this.deliveryFileLst = param.data.deliveryFileLst;
        }
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
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
        cancel: function(){
            parent.layer.closeAll();
        },
        saveOrUpdate: function(){
            var url = vm.carRecord.id == null ? "car/carrecord/save" : "car/carrecord/update";
            vm.carRecord.attachment = vm.deliveryFileLst;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carRecord),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            parent.layer.closeAll();
                            parent.vm.reloadRecordTable();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        imageDetail(url){
            if(url!=null &&  url!=''){
                previewImage(url);
            }

        }
    }
});
/**
 * 上传附件
 */
function uploadAttachment(upload){
    Upload({
        elid: 'addDeliveryFile',
        edit: true,
        fileLst: vm.deliveryFileLst,
        param: {'path':'record'},
        fidedesc: '车辆档案'
    }).initView();
}


