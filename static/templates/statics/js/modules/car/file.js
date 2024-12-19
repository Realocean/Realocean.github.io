$(function () {
    layui.table.on('tool(test)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'show') {
            vm.showDoc(data.url, data.nameFile);
        } else if (layEvent === 'down') {
            vm.downDoc(data.url, data.nameFile);
        }
    });
});
var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {

    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        showDoc: function (url, fileName) {
            if (viewer != null) {
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL + url,
                    title: fileName
                }
            ], {
                appendTo: 'body',
                zIndex: 99891018
            });
        },
        downDoc: function (url, fileName) {
            var uri = baseURL + 'file/download?uri=' + url + "&fileName=" + fileName;
            window.location.href = uri;
        },
        initTransferData: function(transferId,type){
            $.ajax({
                type: "POST",
                url: baseURL + "sys/sysaccessory/accessoryList",
                contentType: "application/json",
                data: JSON.stringify({"objId":transferId, "objType":type}),
                success: function(r){
                    layui.use(['table'], function () {
                        layui.table.render({
                            id: "testid",
                            elem: '#test',
                            data: r,
                            cols: [[
                                {field: 'nameAccessory', width: 200, title: '附件名称', align: "center"},
                                {field: 'timeCreate', minWidth: 200, title: '提交时间', align: "center"},
                                {field: 'operationName', minWidth: 200, title: '提交人', align: "center"},
                                {title: '操作', width: 260, templet: '#barTplFile', fixed: "right", align: "center"}
                            ]],
                            page: false,
                            limit: 500,
                            loading: true
                        });
                    });
                }
            });
        }
    }
});

