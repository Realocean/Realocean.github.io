$(function () {
    layui.use(['layer', 'form'], function(){
        layui.form.render();
    });
    vm.getByCarCollectInfo();
});
var viewer;

var vm = new Vue({
    el:'#rrapp',
    data:{
        collectInfo: {},
        collectFileList:[]
    },
    updated: function(){
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
        getByCarCollectInfo:function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/carcollect/info/"+localStorage.getItem("carCollectId"),
                    async:false,
                    success: function (r) {
                        if (r.code === 0) {
                            vm.collectInfo= r.carCollectInfo;
                            vm.collectFileList = r.carCollectInfo.collectFileList;
                        } else {
                            alert(r.msg)
                        }
                    }
                });
        }
    }
});
