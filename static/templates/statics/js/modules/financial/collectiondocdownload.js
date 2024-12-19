$(function () {
    var objId= window.localStorage.getItem("objId");
    var objType= window.localStorage.getItem("objType");
    var typeFile= window.localStorage.getItem("typeFile");
    $.ajax({
        type: "POST",
        url: baseURL + "financial/collection/getSysAccessoryList/"+objId+"/"+typeFile+"/"+objType,
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
        page: false,limit: 500,
        loading: true,
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
        if(layEvent === 'download'){
            vm.download(data);
        }
    });
});

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
                page: false,
                loading: true,
                limit: 500,
            });
        },
        download:function(data){
            var uri = baseURL + 'file/download?uri=' + data.url + "&fileName=" + data.nameFile;
            window.location.href = uri;
        }
    }
});



