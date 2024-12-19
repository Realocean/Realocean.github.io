$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

     layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridId",
            elem: '#grid',
            url: baseURL + 'sys/sysaccessory/getSysAccessoryList',
            where: {'objId': window.localStorage.getItem("objId"), "objType":window.localStorage.getItem("objType")},
            cols: [[
                {field:'nameFile', title: '名称', minWidth:200, align: "center",templet: function (d) {
                    return isEmpty(d.nameFile);
                }},
                {field:'timeCreate', title: '提交时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeCreate);}},
                {field:'operationName', title: '提交人', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.operationName);}},
                {title: '操作', width:200, templet:'#barTpl',fixed:"right",align:"center"}
            ]],
            page: false,
            loading: false,
            limits: [500],
            limit: 500,
            autoColumnWidth: {
                init: false
            },
            done: function(res, curr, count){
                soulTable.render(this);
            }
        });
        layui.form.render();
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var data = obj.data;
        var layEvent = obj.event;
        if(layEvent === 'showDoc'){
       //   vm.showDoc(data.url, data.nameFile)
            vm.showDoc(data.objId, data.objType)
        } else if(layEvent === 'downDoc'){
            vm.downDoc(data.url, data.nameFile)
        }
    });
});
var viewer = null
var vm = new Vue({
    el: '#rrapp',
    data: {
        sysAccessoryList:[],
    },
    methods: {
        cancel: function () {
            layer.closeAll();
        },
        showDoc: function (objId, objType) {
           /* if (viewer != null){
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
            });*/
            window.localStorage.setItem("collectionsNo", objId);
            window.localStorage.setItem("objType", objType);
            var index = layer.open({
                title: "年检详情 >附件详情>图片预览",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/carrepairorder/carrepairorderpictureDetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("collectionsNo", null);
                }
            });
            layer.full(index);
        },
        downDoc: function (url, fileName) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },

    }
});
