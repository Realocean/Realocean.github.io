$(function () {
    vm.getDept();
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table','soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'work/notice/list',
        cols: [[
            //{type:'checkbox'},
            {title: '操作', width:180, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'noticeNo', minWidth:100, title: '公告编号',align:"center"},
            {field:'noticeTitle', minWidth:100, title: '公告标题',align:"center"},
            {field:'publishName', minWidth:100, title: '发布人',align:"center"},
            {field:'publishTime', minWidth:100, title: '发布时间',align:"center"},
            {field:'orgName', minWidth:100, title: '机构名称',align:"center"},
            {field:'publishStatus',align:"center", minWidth:100, title: '发布状态',templet:function (d) {
                    if(d.publishStatus==0){
                        return "待发布";
                    }else if(d.publishStatus==1){
                        return "已发布";
                    }else if(d.publishStatus==2){
                        return "已撤销";
                    }else {
                        return "--";
                    }
                }},
            {field:'createTime',align:"center", minWidth:100, title: '创建时间'},
            
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function (){
            soulTable.render(this);
        }
    });
    });

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

    layui.form.on('submit(saveOrUpdateAndPublish)', function(){
        vm.saveOrUpdateAndPublish();
        return false;
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        form.render();



    }),

    //批量删除
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });


    layui.form.on('select(publishStatusSelect)', function (data) {
        vm.q.publishStatus = data.value;
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'pubs'){
            vm.pubData(data.id , 1);//发布
        } else if(layEvent === 'cancel'){
            vm.pubData(data.id , 2);//撤销
        } else if(layEvent === 'view'){
            vm.info(data.id);
        }
    });

});

var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};
var ztree;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            orgName: null,
            noticeTitle:null,
            publishStatus:null
        },
        editForm: false,
        detailForm: false,
        tCompanyNotice: {}
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/select", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r.deptList);
                var node = ztree.getNodeByParam("deptId", vm.tCompanyNotice.orgId);
                if(node != null){
                    ztree.selectNode(node);
                    vm.tCompanyNotice.orgName = node.name;
                }
            })
        },
        cancel: function(){
            layer.closeAll();
        },
        //重置方法
        reset:function(){
            vm.q.orgName = null,
            vm.q.publishStatus = null,
            vm.q.noticeTitle = null
        },
        query: function () {
            vm.reload();
        },

        info: function(id){
            $.get(baseURL + "work/notice/info/"+id, function(r){
                vm.tCompanyNotice = r.tCompanyNoticeEntity;
            });

            var index = layer.open({
                title: "公告信息",
                type: 1,
                content: $("#detailForm"),
                end: function(){
                    vm.detailForm = false;
                    layer.closeAll();
                }
            });
            vm.detailForm = true;
            layer.full(index);
        },

        add: function(){
            vm.tCompanyNotice = {orgId:null,orgName:null};
            vm.getDept();
            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.editForm = false;
                    layer.closeAll();
                }
            });
            vm.editForm = true;
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "work/notice/info/"+id, function(r){
                vm.tCompanyNotice = r.tCompanyNoticeEntity;
                vm.getDept();
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.editForm = false;
                    layer.closeAll();
                }
            });

            vm.editForm = true;
            layer.full(index);
        },

        pubData: function (id, type) {

            vm.tCompanyNotice.id = id;
            vm.tCompanyNotice.publishStatus = type;
            var url = "work/notice/updateNoticeStatus";
                $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tCompanyNotice),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        saveOrUpdate: function (event) {
            vm.tCompanyNotice.operType = 0;
            vm.q.orgName = null;
            var url = vm.tCompanyNotice.id == null ? "work/notice/save" : "work/notice/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tCompanyNotice),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        // 保存并发布
        saveOrUpdateAndPublish: function (event) {
            vm.tCompanyNotice.operType = 1;
            vm.q.orgName = null;
            var url = vm.tCompanyNotice.id == null ? "work/notice/save" : "work/notice/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tCompanyNotice),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择机构",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    vm.tCompanyNotice.orgId = node[0].deptId;
                    vm.tCompanyNotice.orgName = node[0].name;
                    //  查询框赋值
                    vm.q.orgName = node[0].name;
                    layer.close(index);
                },
                end: function(){
                    $("#deptLayer").hide();
                }
            });
        },

        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    orgName: vm.q.orgName,
                    noticeTitle:vm.q.noticeTitle,
                    publishStatus:vm.q.publishStatus
                }
            });
        }
    }
});