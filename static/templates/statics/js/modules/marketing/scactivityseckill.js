$(function () {
    //搜索条件初始化
    vm.init();
    //秒杀活动根据状态判断按钮
    var scactivityseckillTableButton = {
        //未开始
        "1":{
            //详情,编辑，删除，开始
            "buttons":['#showTpl','#editTpl','#delTpl','#startTpl'],
            "color":"orange"
        },
        //进行中
        "2":{
            //详情,暂停，分享，活动数据，提成数据，分佣数据
            "buttons":['#showTpl','#stopTpl','#shareTpl','#activityDataBtn','#commissionDataBtn','#subCommissionDataBtn'],
            "color":"green"
        },
        //暂停中
        "3":{
            //详情,启用，结束，活动数据，提成数据，分佣数据
            "buttons":['#showTpl','#restartTpl','#stopTpl','#activityDataBtn','#commissionDataBtn','#subCommissionDataBtn'],
            "color":"red"
        },
        //已结束
        "4":{
            //详情,复制活动，活动数据，提成数据，分佣数据
            "buttons":['#showTpl','#copyActivityBtn','#activityDataBtn','#commissionDataBtn','#subCommissionDataBtn'],
            "color":"black"
        }
    };
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'marketing/scactivityseckill/list',
        cols: [[
            {
                title: '操作', width: 250, fixed: "left", align: "center", templet: function (d) {
                    var buttonHtml = "";
                    var buttons = scactivityseckillTableButton[d.status]['buttons'];
                    for (var i = 0; i <buttons.length; i++) {
                        if($(buttons[i])[0]){
                            buttonHtml+= ' '+$(buttons[i]).html();
                        }
                    }
                    return buttonHtml;
                }
            },
            {field: 'seckillName', minWidth: 200, title: '活动名称'},
            {
                field: 'statusStr', minWidth: 200, title: '活动状态', templet: function (d) {
                    return "<p style='color: " + scactivityseckillTableButton[d.status]['color'] + "'>" + isEmpty(d.statusStr) + "</p>";
                }
            },
            {field: 'createStore', minWidth: 200, title: '活动门店'},
            {
                field: 'timeStart', minWidth: 200, title: '活动开始时间', templet: function (d) {
                    return isEmpty(d.timeStart);
                }
            },
            {
                field: 'timeEnd', minWidth: 200, title: '活动结束时间', templet: function (d) {
                    return isEmpty(d.timeEnd);
                }
            },
            {
                field: 'nowPrice', minWidth: 200, title: '秒杀价格/元', templet: function (d) {
                    return isEmpty(d.nowPrice);
                }
            },
            {
                field: 'rushBuyNumber', minWidth: 200, title: '已出售数据/单', templet: function (d) {
                    return "0";
                }
            },
            {
                field: 'countNumber', minWidth: 200, title: '实际剩余库存数', templet: function (d) {
                    return d.countNumber-d.rushBuyNumber;
                }
            },
            {
                field: 'deptName', minWidth: 200, title: '活动创建部门', templet: function (d) {
                    return isEmpty(d.deptName);
                }
            },
            {
                field: 'createTime', minWidth: 200, title: '活动创建时间', templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20
    });


    //批量删除
    $(".delBatch").click(function () {
        var ids = vm.selectedRows();
        if (ids == null) {
            return;
        }
        vm.del(ids);
    });

    //状态改变操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.id);
        } else if (layEvent === 'del') {
            var id = [data.id];
            vm.del(id);
        } else if (layEvent === 'show') {
            vm.show(data.id);
        } else if (layEvent === 'start') {
            vm.updateStatus(data.id, 2, '开始');
        } else if (layEvent === 'restart') {
            vm.updateStatus(data.id, 2, '启用');
        } else if (layEvent === 'stop') {
            vm.updateStatus(data.id, 3, '暂停');
        } else if (layEvent === 'end') {
            vm.updateStatus(data.id, 4, '结束');
        }
    });

});

/**
 * 创建富文本框
 * @param editor
 */
function createEditor(editor){
    // 或者 const editor = new E( document.getElementById('div1') )
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '请输入内容';
    editor.config.pasteFilterStyle = true;

    // 配置菜单栏，设置不需要的菜单
    editor.config.excludeMenus = [
        'emoticon',
        'video',
        'link',
        'splitLine',
        'backColor',
    ]
    // 图片上传
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        console.log(resultFiles);
        // 上传图片，返回结果，将图片插入到编辑器中
        //insertImgFn('https://cn.vuejs.org/images/logo.png')
        const formData = new FormData();
        formData.append("files", resultFiles[0]);
        formData.append("path", 'carIntroduce');
        //图片名称
        const fileName = resultFiles.name;
        $.ajax({
            type: "POST",
            url: baseURL + '/file/uploadFile',
            contentType: false,
            processData: false,
            data: formData,
            success: function (r) {
                const activeFile = {
                    url: r.data[0],
                    name: fileName,
                    uid: uuid(6)
                };
                vm.richText.push(activeFile);
                insertImgFn(imageURL+r.data[0])
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });
    }
    editor.create();
}

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

//数据树
var data_ztree;
var data_setting = {
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
    },
    check:{
        chkStyle:"checkbox",
        enable:true,
        nocheckInherit:true,
        autoCheckTrigger: true,
        chkboxType:{ "Y" : "", "N" : "" }
    }
};
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            seckillName: undefined,
            status: undefined,
            timeStartRange: undefined,
            timeStartStart: undefined,
            timeStartEnd: undefined,
            timeEndRange: undefined,
            timeEndStart: undefined,
            timeEndEnd: undefined,
            deptId: undefined,
            deptName: undefined
        },
        showForm: false,
        editForm: false,
        isFilter:false,
        scActivitySeckill: {
            gsList:[{
                "id":"20",
                "activitySeckillId":"1528978227694383106",
                "goodsServerName": "货物名称",
                "goodsServerPrice": 36,
                "goodsServerNumber": 10,
                "goodsServerDescribe": "货物描述",
                "goodsType": 1,
                "tenantId": 1
            }]
        },
        //富文本使用参数
        richText:[]
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        //初始化方法
        init:function (){
            //初始化部门树
            this.getDept();
            //初始化layer组件
            layui.use(['form', 'layedit', 'laydate'], function () {
                var form = layui.form;
                layer = layui.layer;
                layedit = layui.layedit;
                laydate = layui.laydate;
                form.render();
            });
            //初始化时间选择部件
            this.initDateInput();
            //初始化富文本编辑
            // this.initWangEditor();

            this.initFormDynamicTable();
        },
        initDateInput:function (){
            //开始时间范围
            laydate.render({
                elem : '#timeStartRange',
                type : 'date',
                range: '/',
                trigger: 'click',
                done: function (value, date, endDate) {
                    vm.q.timeStartRange=value;
                }
            });
            //结束时间范围
            laydate.render({
                elem : '#timeEndRange',
                type : 'date',
                range: '/',
                trigger: 'click',
                done: function (value, date, endDate) {
                    vm.q.timeEndRange=value;
                }
            });
            //表单-活动开始时间
            laydate.render({
                elem: '#timeStart',
                trigger: 'click',
                done: function (value) {
                    vm.scActivitySeckill.timeStart = value;
                }
            });
            //表单-活动结束时间
            laydate.render({
                elem: '#timeEnd',
                trigger: 'click',
                done: function (value) {
                    vm.scActivitySeckill.timeEnd = value;
                }
            });
        },
        //富文本编辑器初始化
        initWangEditor:function (){
            // 富文本编辑
            const E = window.wangEditor;
            const editor = new E('#Editor');
            // 或者 const editor = new E( document.getElementById('div1') )
            // 设置编辑区域高度为 500px
            editor.config.height = 500;
            editor.config.zIndex = 1;
            editor.config.placeholder = '请输入内容';
            editor.config.pasteFilterStyle = true;
            // 配置粘贴文本的内容处理
            editor.config.pasteTextHandle = function (pasteStr) {
                // 对粘贴的文本进行处理，然后返回处理后的结果
                return pasteStr;
            }
            // 配置菜单栏，设置不需要的菜单
            editor.config.excludeMenus = [
                'emoticon',
                'video',
                'link',
                'splitLine',
                'backColor',
            ]
            // 图片上传
            editor.config.customUploadImg = function (resultFiles, insertImgFn) {
                // 上传图片，返回结果，将图片插入到编辑器中
                const formData = new FormData();
                formData.append("files", resultFiles[0]);
                formData.append("path", 'carIntroduce');
                //图片名称
                const fileName = resultFiles.name;
                $.ajax({
                    type: "POST",
                    url: baseURL + '/file/uploadFile',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (r) {
                         
                        const activeFile = {
                            url: r.data[0],
                            name: fileName,
                            uid: uuid(6)
                        };
                        vm.richText.push(activeFile);
                        insertImgFn(imageURL+r.data[0])
                    },
                    error: function () {
                        layer.msg('上传失败', {icon: 5});
                    }
                });
            }
        },
        //初始化表单-动态表格
        initFormDynamicTable:function(){

            goodsTable = layui.table.render({
                id: "goodsTable",
                elem: '#goodsTable',
                data: vm.scActivitySeckill.gsList,
                width: "100%",
                cols: [[
                    {field: 'goodsType',title: '类型'},
                    {field: 'goodsServerName', title: '名称'},
                    {field: 'goodsServerPrice', title: '价值'},
                    {field: 'goodsServerNumber', title: '数量'},
                    {field: 'goodsServerDescribe', title: '说明'},
                    {title: '操作', templet: '#goodsTableItemScript', fixed: "right", align: "center"}
                ]]
            });
            /*//初始化表格删除按钮事件
            table.on('tool(goodsTable)', function (obj) {
                if (obj.event === 'delete') {
                    vm.goodsItemDelete(obj);
                    return false;
                }
            });*/
        },
        goodsItemReload: function () {
            layui.table.reload('id', {
                page: {
                    curr: getCurrPage('id', vm.scActivitySeckill.gsList.length)
                },
                data: vm.scActivitySeckill.gsList});
        },
        goodsItemDelete: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.scActivitySeckill.gsList.length;i++) {
                    if(vm.scActivitySeckill.gsList[i].serializeId === serializeId) {
                        vm.scActivitySeckill.gsList.splice(i,1);
                        i= i-1;
                        break;
                    }
                }
                vm.goodsItemReload();
            });
        },
        editfeeItemlistener: function (obj) {
            //
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regInt = /^[0-9]*$/;
            var v;
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
                v = '';
            }else {
                if (field === 'money') {//分期金额
                    v = Number(value).toFixed(2);
                }
            }
            vm.scActivitySeckill.gsList.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) value.money = v;
            });
            vm.reloadGoodsItem();
        },
        //商品动态表格新增
        addRow:function (){

        },
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r);
                if(vm.q.deptId != null && vm.q.deptId != undefined){
                    var node = ztree.getNodeByParam("deptId", vm.q.deptId);
                    if(node != null){
                        ztree.selectNode(node);
                        vm.q.deptName = node.name;
                    }
                }
            })
        },
        getDataTree: function(userId) {
            //加载菜单树
            $.get(baseURL + "sys/dept/list", function(r){
                data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, r);
                //展开所有节点
                data_ztree.expandAll(true);
                if(userId != null){
                    vm.getUserPermissions(userId);
                }
            });
        },
        getUserPermissions : function(userId){
            var deptIds = vm.user.deptIdList;
            if(deptIds != undefined &&  deptIds != null && deptIds.length >0){
                for(var i=0; i<deptIds.length; i++) {
                    var node = data_ztree.getNodeByParam("deptId", deptIds[i]);
                    data_ztree.checkNode(node, true, false);
                }
            }
        },
        deptTree: function(){
            var index = layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: $("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级部门
                    vm.q.deptId = node[0].deptId;
                    vm.q.deptName = node[0].name;
                    layer.close(index);
                },
                end: function(){
                    $("#deptLayer").hide();
                }
            });
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var ids = [];
            $.each(list, function (index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.scActivitySeckill = {};

            var index = layer.open({
                title: "新增",
                skin: "edit-form-btn",
                type: 1,
                btn: ['取消',"保存"],
                btnAlign:"c",
                content: $("#editForm"),
                btn1: function () {
                    vm.editForm = false;
                    layer.closeAll();
                },
                btn2: function () {
                    vm.saveOrUpdate();
                }
            });
            vm.editForm = true;
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "marketing/scactivityseckill/info/" + id, function (r) {
                vm.scActivitySeckill = r.scActivitySeckill;
            });

            var index = layer.open({
                title: "修改",
                skin: "edit-form-btn",
                type: 1,
                btn: ['取消',"保存"],
                btnAlign:"c",
                content: $("#editForm"),
                btn1: function () {
                    vm.editForm = false;
                    layer.closeAll();
                },
                btn2: function () {
                    vm.saveOrUpdate();
                }
            });

            vm.editForm = true;
            layer.full(index);
        },
        show: function (id) {
            $.get(baseURL + "marketing/scactivityseckill/info/" + id, function (r) {
                vm.scActivitySeckill = r.scActivitySeckill;
            });

            var index = layer.open({
                title: "查看",
                type: 1,
                content: $("#showForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "marketing/scactivityseckill/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        updateStatus: function (id,status,statusName) {
            confirm('确定要'+ statusName + '选中的记录？', function () {
                var params = "status=" + status+"&id=" + id;
                $.ajax({
                    type: "PUT",
                    url: baseURL + "marketing/scactivityseckill/updateStatus?" + params,
                    success: function (r) {
                        if (r.code != 0) {
                            alert(r.msg);
                            return false;
                        }
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    }
                });
            });
        },
        cancel: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.vm.reload();
            parent.layer.close(index);
        },
        saveOrUpdate: function (event) {
            var url = vm.scActivitySeckill.id == null ? "marketing/scactivityseckill/save" : "marketing/scactivityseckill/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.scActivitySeckill),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        exports: function () {
            var url = baseURL + 'marketing/scactivityseckill/export';
            if (vm.q.keyword != null) {
                url += '?keyword=' + vm.q.keyword;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: vm.q
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }
    }
});

//初始化富文本编辑
// vm.initWangEditor();
const basicServicesE = window.wangEditor;
const editor = new basicServicesE('#Editor');
createEditor(editor);