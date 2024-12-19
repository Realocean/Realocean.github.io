$(function () {
    layui.table.render({
        id: "attachmentList",
        elem: '#attachmentList',
        url: baseURL + 'maintenance/record/attachment',
        where:{id:window.localStorage.getItem("id"),
            tabType:window.localStorage.getItem("tabType")},
        cols: [[
            {title: '操作',width:200,templet: '#operation', fixed: "left", align: "center"},
            {field: 'nameAccessory',minWidth:150, title: '附件名称'},
            {field: 'timeCreate', minWidth:150,title: '提交时间'},
            {field: 'operationName',minWidth:150, title: '提交人',templet:function (d) {
                return isEmpty(d.operationName);
            }},

        ]],
        page: true,
        limits: [5, 10,20,50,100],
        limit: 5,
    });


    layui.table.on('tool(attachmentList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'showDoc'){
            vm.showDoc(data.url,data.nameAccessory);
        }else if(layEvent === 'downDoc'){
            vm.downDoc(data.url,data.nameAccessory);
        }
    });
});

var viewer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{

    },
    computed: function () {
        layui.form.render();
    },
    mounted:function(){
        layui.form.render();
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        showDoc: function (url, fileName) {
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
        downDoc: function (url, fileName) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
    }
});

