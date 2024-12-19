$(function () {
    var objId= window.localStorage.getItem("objId");
    var objCode= window.localStorage.getItem("objCode");
    var objType= window.localStorage.getItem("objType");
    $.ajax({
        type: "POST",
        url: baseURL + "financial/collection/searchSysAccessoryList/"+objId+"/"+objType+"/"+objCode,
        contentType: "application/json",
        data: {},
        success: function(r){
            vm.initTable();
            layui.table.reload('gridid', {
                data: r.sysAccessoryList
            });
        }
    });


    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        cols: [[
            {field:'nameAccessory', title: '附件名称', minWidth:200},
            {field:'timeCreate', title: '提交时间', minWidth:200},
            {field:'operationName', title: '提交人', minWidth:200},
            {title: '操作', width:150, templet:'#barTpl',fixed:"right",align:"center"},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 30, 50],
        limit: 10
    });




    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
    })

    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'downloadDoc'){
            vm.downloadDoc(data);
        } else if(layEvent === 'viewPicture'){
            vm.viewPicture(data);
        }
    });
});
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{ },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        initTable:function(){
            gridTable = layui.table.render({
                id: "gridid",
                elem: '#grid',
                cols: [[
                    {field:'nameAccessory', title: '附件名称', minWidth:200},
                    {field:'timeCreate', title: '提交时间', minWidth:200},
                    {field:'operationName', title: '提交人', minWidth:200},
                    {title: '操作', width:150, templet:'#barTpl',fixed:"right",align:"center"},
                ]],
                page: true,
                loading: true,
                limits: [10, 20, 30, 50],
                limit: 10
            });
        },
        // 附件下载
        downloadDoc:function(data){
            var uri = baseURL + 'file/download?uri=' + data.url + "&fileName=" + data.nameFile;
            window.location.href = uri;
        },
        // 图片预览
        viewPicture:function(data){
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+data.url,
                    title: data.nameAccessory
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        cancelFun:function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    }
});



