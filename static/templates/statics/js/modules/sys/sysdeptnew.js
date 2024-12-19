$(function () {
    layui.use(['form', 'layedit', 'laydate', 'base64'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.render();
    });

    init(layui);
    //导入 用layui upload插件
    layui.use([ "element", "laypage", "layer", "upload"], function() {
        var element = layui.element;
        var laypage = layui.laypage;
        var layer = layui.layer;
        var upload = layui.upload;//主要是这个
        layui.upload.render({
            elem: "#uploadExcel",//导入id
            url:baseURL+'sys/dept/uploadExcel',
            size: '3072000',
            accept: "file",
            exts: 'xls|xlsx|xlsm|xlt|xltx|xltm',
            before: function(obj){
                layer.msg('数据导入中...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                })
            },
            done : function(res, index, upload) {
                layer.close(layer.msg());
                if(res.code==500){
                    layer.msg(res.msg,{
                        icon:1
                    },1000);
                    vm.reload();
                }else{
                    layer.msg(res.msg,{
                        icon:1
                    },1000);
                    vm.reload();
                }
            }
        });
    });

    layui.form.on('checkbox(warehouseFilter)', function(data){
        if(data.elem.checked){
            vm.sysDept.relationWarehouseList.push(data.value);
        }else{
            vm.sysDept.relationWarehouseList=vm.sysDept.relationWarehouseList.filter(t => t != data.value);
        }
        var set = new Set(vm.sysDept.relationWarehouseList);
        vm.sysDept.relationWarehouseList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        createRelationWarehouseList();
    });

    layui.form.on('radio(createWarehouseFlagFilter)', function(data){
        vm.sysDept.createWarehouseFlag = data.value;
        vm.sysDept.showCreateWarehouseNameFlag=data.value;
    });


});
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        showForm: false,
        mapForm:false,
        showCompany1: false,
        sysDept: {
            relationWarehouseList:[],
            createWarehouseFlag:"1",
            createWarehouseName:null,
            showCreateWarehouseNameFlag:1,
            showAssociatedWarehouse:false
        },
        warehouseList:[],
        addrList:[],

    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async= false;
        $.get(baseURL + 'car/carsurvieladdr/queryList', function (r) {
            _this.addrList = r.data;
        });
        $.ajaxSettings.async= true;
    },
    computed:{
        showCompany:{
            get:function() {
                return this.sysDept.sysDeptType != null && this.sysDept.sysDeptType != '' && this.sysDept.sysDeptType<5 && this.sysDept.sysDeptType != 2;
            }
        },
        disabledOption1:{
            get:function() {
                return this.sysDept.parent != null && this.sysDept.parent.sysDeptType != null && this.sysDept.parent.sysDeptType != '';
            }
        },
        disabledOption2:{
            get:function() {
                return this.sysDept.parent != null && this.sysDept.parent.sysDeptType != null && this.sysDept.parent.sysDeptType != ''&&this.sysDept.parent.sysDeptType>1;
            }
        },
        disabledOption3:{
            get:function() {
                return this.sysDept.parent != null && this.sysDept.parent.sysDeptType != null && this.sysDept.parent.sysDeptType != ''&&this.sysDept.parent.sysDeptType>2;
            }
        },
        disabledOption4:{
            get:function() {
                return this.sysDept.parent != null && this.sysDept.parent.sysDeptType != null && this.sysDept.parent.sysDeptType != ''&&this.sysDept.parent.sysDeptType>3;
            }
        },
        disabledOption5:{
            get:function() {
                return this.sysDept.parent != null && this.sysDept.parent.sysDeptType != null && this.sysDept.parent.sysDeptType != ''&&this.sysDept.parent.sysDeptType>4;
            }
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        downDoc: function (fileName, url) {

                var uri = baseURL + 'file/download?uri='+encodeURI(url)+"&fileName="+encodeURI(fileName);
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
        del:function(data){
          //删除操作
            confirm('确定要删除该部门？删除成功之后，将无法恢复', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/dept/del",
                    data: {deptId:data.deptId},
                    async: false,
                    success: function(r){
                        if(r.code == 0){
                            alert('删除成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        top:function(data){
            //置顶操作
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dept/top",
                data: {deptId:data.deptId,parentId:data.parentId},
                async: false,
                success: function(r){
                    if(r.code == 0){
                        alert('操作成功', function(index){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        generateWxQrcode:function(data){
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dept/generateWxQrcode",
                data: {deptId:data.deptId},
                async: false,
                success: function(r){
                    if(r.code == 0){
                        alert('操作成功', function(index){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        mouseout:function (){
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        move:function (value) {
            var id="#"+value;
            var content = "";
            if(value == '1'){
            content = "说明：以开始时间日期为基础<br>自然月为一个周期<br>租金/月供:<br>首月: 2020/10/14~ 2020/10/31<br>第二月: 2020/11/1~2020/11/30<br>第三月: 2020/12/1~2020/12/31<br>.........<br>根据周期完成;不足月，计算方式:月租金除以30天再乘以对应的天数;"
            } else if(value == '2'){
                content = "说明：以开始时间日期为基础,交车日期在15日(具体时间可以配置)之前包含15日，"+
                                                     "支付本月剩余天数:反之在15日(具体时间可以配置)之后不包含15日，需要支付本月剩余天数加下一个月租金;<br>"+
                                                     "租金/月供:<br>"+
                                                     "首月: 2020/10/16~2020/11/30<br/>"+
                                                     "第二月: 2020/12/1~2020/12/31<br>"+
                                                     "第三月: 2020/1/1~2021/1/31<br>"+
                                                     ".........";
            } else if(value == '3'){
                content = "说明：以开始时间日期为基础<br/>固定30天为一个周期；<br/>租金/月供:<br/>首月: 2020/10/1~ 2020/10/31<br/>第二月: 2020/11/1~ 2020/11/30<br/>第三月: 2020/12/1~2020/12/30<br/>.........<br/>根据间隔30日完成;不足30日，计算方式:月租金除以30天再乘以对应的天数;";
            } else if(value == '4'){
                content = "说明:以开始时间日期为基础<br/>租金/月供:<br/>首月: 2020/10/1~ 2020/11/1<br/>第二月: 2020/11/2~ 2020/12/2<br/>第三月: 2020/12/3~2021/1/3<br/>.........<br/>根据周期完成;不足月，计算方式:月租金除以30天再乘以对应的天数;";
            } else if(value == '5') {
                content = "说明：关于车辆归属公司/部门/门店（大部分是指车辆的资产）<br/>车辆所在仓库/城市（大部分是指车辆运营情况，可以相互调拨）；";
            }
            if(!vm.subtips){
                vm.openMsg(id,content,value);
            }
        },
        openMsg:function (id,content,value) {
            vm.subtips = layer.tips(content, id, {tips: 1});
        },
        down: function(){
            window.location.href = baseURL + "supplier/supplier/download?fileName=部门导入模板.xls";
        },
        changeDeptNameInput:function(event){
            vm.sysDept.createWarehouseName=vm.sysDept.name;
        },
        selectParentWarning: function(){//选择父级机构
            if (vm.sysDept.level < 3){
                confirm('修改上级部门后，该部门下机构会跟随该部门转移，确认修改', function(){
                    layer.closeAll('dialog');
                    vm.selectParent();
                });
            } else {
                vm.selectParent();
            }
        },
        selectParent: function(){//选择父级机构
            var param = {
                action:'select_sysdept_edit',
                level:2,
                where:{
                    editDeptId: vm.sysDept.deptId,
                }
            };
            var index = layer.open({
                title: "选择上级机构",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/sys/selectsysdeptnew.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        add: function(data){
            getWarehouseList();

            vm.sysDept = {
                createWarehouseFlag:"1",
                createWarehouseName:null,
                relationWarehouseList:[],
                showCreateWarehouseNameFlag:1,
                showAssociatedWarehouse:true,
                billType:4
            };
            vm.sysDept.sysDeptStatus = 1;
            vm.sysDept.sysDeptOrder = 1;
            vm.sysDept.addType = 3;
            vm.sysDept.level = 1;
            vm.showAssociatedWarehouse=true;
            if (data != null && data.deptId != null){
                vm.sysDept.parentId = data.deptId;
                vm.sysDept.parentName = data.name;
                vm.sysDept.addType = 2;
                vm.sysDept.level = data.level + 1;
                vm.sysDept.parent = data;
            }
            var index = layer.open({
                title: "新增",
                type: 1,
                area: ['100%', '100%'],
                content: $("#editForm"),
                btn:['保存','取消'] ,
                btnAlign: 'c',
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                },
                btn1:function (index, layero) {
                    if(!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                        $(".layui-layer-btn0").addClass("layui-btn-disabled");
                        vm.saveOrUpdate();
                    }
                },
                btn2:function (index, layero) {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        update: function (data) {
            vm.sysDept = {
                createWarehouseFlag:"1",
                createWarehouseName:null,
                relationWarehouseList:[],
                showCreateWarehouseNameFlag:2,
                showAssociatedWarehouse:false
            };
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dept/info/"+data.deptId,
                contentType: "application/json",
                data: null,
                async: false,
                success: function(r){
                    vm.sysDept = r.dept;
                    vm.sysDept.addType = 1;
                    vm.sysDept.showAssociatedWarehouse=false;
                    if(r.dept.longitude != null && r.dept.latitude != null){
                        vm.sysDept.lonlat = r.dept.longitude+","+r.dept.latitude;
                    }
                    console.log("vm.sysDept:{}",vm.sysDept);
                }
            });
            /*$.get(baseURL + "sys/dept/info/"+data.deptId, function(r){
                vm.sysDept = {
                    createWarehouseFlag:"1",
                    createWarehouseName:null,
                    relationWarehouseList:[],
                    showCreateWarehouseNameFlag:2
                };
                vm.sysDept = r.dept;
                vm.sysDept.addType = 1;
            });*/

            getWarehouseList();
            createRelationWarehouseList();
            var index = layer.open({
                title: "修改",
                type: 1,
                area: ['80%', '80%'],
                content: $("#editForm"),
                btn:['保存','取消'] ,
                btnAlign: 'c',
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                },
                btn1:function (index, layero) {
                    if(!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                        $(".layui-layer-btn0").addClass("layui-btn-disabled");
                        vm.saveOrUpdate();
                    }
                },
                btn2:function (index, layero) {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        usingChange: function (data) {
            confirm('确定要'+(data.sysDeptStatus==1?'停用':'启用')+'该部门？', function(){
                data.sysDeptStatus = (data.sysDeptStatus & 1) + 1;
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/dept/usingChange",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        // 获取百度地图坐标数据
        getBaiduData:function (){
            if(vm.sysDept.longitude != null){
                window.localStorage.setItem("longitude",vm.sysDept.longitude);
            } else {
                window.localStorage.setItem("longitude","");
            }
            if(vm.sysDept.latitude != null){
                window.localStorage.setItem("latitude",vm.sysDept.latitude);
            } else {
                window.localStorage.setItem("latitude","");
            }
            if(vm.sysDept.contactAddress != null){
                window.localStorage.setItem("contactAddress",vm.sysDept.contactAddress);
            } else {
                window.localStorage.setItem("contactAddress","");
            }

            var index = layer.open({
                title: "获取经纬度",
                type: 2,
                content: tabBaseURL + "modules/common/selectmap.html",
                end: function(){
                    // 获取选择的标点坐标和地址数据
                    var longitude = vm.sysDept.longitude;
                    var latitude = vm.sysDept.latitude;
                    var lnglat;
                    if(vm.sysDept.longitude != "" && vm.sysDept.latitude !=""){
                        lnglat = longitude+","+latitude;
                    } else {
                        lnglat = "";
                    }
                    var contactAddress = vm.sysDept.contactAddress;
                    vm.sysDept = Object.assign({}, vm.sysDept,{
                        longitude:vm.sysDept.longitude,
                        latitude:vm.sysDept.latitude,
                        contactAddress:vm.sysDept.contactAddress,
                        lonlat:lnglat,
                    });
                }
            });
            layer.full(index);
        },

        saveOrUpdate: function (event) {//
            if (vm.sysDept.name == null || vm.sysDept.name == ''){
                alert('组织机构名称不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.sysDept.sysDeptType == null || vm.sysDept.sysDeptType == ''){
                alert('请选择部门类型');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }

            if (vm.sysDept.createWarehouseFlag == "1" && vm.sysDept.deptId == null) {
                if (vm.sysDept.createWarehouseFlag == null){
                    alert('创建仓库关联名称不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }
            }

            if (vm.sysDept.sysDeptType != null && vm.sysDept.sysDeptType == 1 || vm.sysDept.sysDeptType == 3 || vm.sysDept.sysDeptType == 4){
                /*if (vm.sysDept.companyName == null || vm.sysDept.companyName == ''){
                    alert('公司全称不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }
                if (vm.sysDept.legalPerson == null || vm.sysDept.legalPerson == ''){
                    alert('法定代表人不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }
                if (vm.sysDept.uscCode == null || vm.sysDept.uscCode == ''){
                    alert('统一社会信用代码不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }*/
                if(vm.sysDept.uscCode != null && vm.sysDept.uscCode != ''){
                    if (!/^[a-zA-Z0-9]{18}$/g.test(vm.sysDept.uscCode)) {
                        alert('统一社会信用代码格式有误');
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        return;
                    }
                }
               /* if (vm.sysDept.contactAddress == null || vm.sysDept.contactAddress == ''){
                    alert('联系地址不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }
                if (vm.sysDept.contactName == null || vm.sysDept.contactName == ''){
                    alert('联系人不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }
                if (vm.sysDept.contactEmail == null || vm.sysDept.contactEmail == ''){
                    alert('联系邮箱不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }*/
                if (vm.sysDept.contactEmail != null && vm.sysDept.contactEmail != '') {
                    if (!/\w+@\w+\.\w+/g.test(vm.sysDept.contactEmail)) {
                        alert('联系邮箱格式有误');
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        return;
                    }
                }
                /*if (vm.sysDept.contactTel == null || vm.sysDept.contactTel == ''){
                    alert('联系电话不能为空');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }*/
                if (vm.sysDept.contactTel != null && vm.sysDept.contactTel != ''){
                    if (!/(^\d{11}$)|(^\d{13}$)/g.test(vm.sysDept.contactTel)) {
                        alert('联系电话格式有误');
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        return;
                    }
                }
            }
            if(vm.sysDept.survielPw !=null){
                vm.sysDept.survielPwEnc = layui.base64.encode(vm.sysDept.survielPw);
            }
            var url = vm.sysDept.deptId == null ? "sys/dept/save" : "sys/dept/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.sysDept),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg, function(index){
                            $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        });
                    }
                }
            });
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                }
            });
        }
    }
});

function init(layui) {
    initTable(layui.table);
    initEventListener(layui);
    // initData();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(sysDeptType)',function (data) {
        vm.sysDept = Object.assign({}, vm.sysDept, {
            sysDeptType: data.value,
        });
    });

    form.on('radio(sysDeptStatus)',function (data) {
        vm.sysDept.sysDeptStatus = data.value;
    });

    form.on('radio(sysDeptOrder)',function (data) {
        vm.sysDept.billType = data.value;
    });

    form.on('select(survielAd)',function (data) {
        vm.sysDept.survielAd = data.value;
    });
}

function initClick() {
    $("#selectParent").on('click', function(){
        vm.selectParentWarning();
    });
}

function initTable(table) {
//    layui.config({
//        base: '../../statics/common/'
//    }).extend({
//        soulTable: 'layui/soultable/ext/soulTable.slim'
//    });
   // layui.use(['form', 'element', 'table','soulTable'], function () {
       // soulTable = layui.soulTable;
        table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/dept/listpage',
        cols: [[
        {title: '操作', width:450, minWidth:450, templet:'#barTpl',align:"center",unresize:true},
            {field:'name',align:"center", minWidth:450, title: '组织机构名称', unresize:true,event: 'collapse',
                templet: function(d) {
                    return '<div style="position: relative;'
                        + 'padding: 0 10px 0 20px;">'
                        + d.name + '<i style="left: 0px;" lay-tips="展开" class="layui-icon layui-colla-icon layui-icon-right"></i></div>'
                }},
            {field:'sysDeptType',align:"center", minWidth:250, unresize:true,title: '类型', templet: function (d) {
                    if (d.sysDeptType == 1) {
                        return '总公司';
                    } else if (d.sysDeptType == 2) {
                        return '中心';
                    } else if (d.sysDeptType == 3) {
                        return '分公司';
                    } else if (d.sysDeptType == 4) {
                        return '子公司';
                    } else if (d.sysDeptType == 5) {
                        return '部门';
                    }else if (d.sysDeptType == 6) {
                        return '卫星城';
                    } else {
                        return '--';
                    }
                }},
            {field:'sysDeptStatus',align:"center", minWidth:250, title: '状态',unresize:true, templet: function (d) {
                    if (d.sysDeptStatus == 1) {
                        return '启用';
                    } else if (d.sysDeptStatus == 2) {
                        return '停用';
                    } else {
                        return '--';
                    }
                }},
            {field:'userCount',align:"center", minWidth:250, title: '员工人数',unresize:true, templet: function (d) {
                    if (d.userCount != null && d.userCount != '') {
                        return d.userCount;
                    } else {
                        return '--';
                    }
                }},

        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        }
//        done: function (){
//            soulTable.render(this);
//        }
    });
   // });

    initTableEvent(table);
}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'add'){
            vm.add(data);
        }else if(layEvent === 'edit'){
            vm.update(data);
        }else if(layEvent === 'top'){
            vm.top(data);
        }else if(layEvent === 'del'){
            vm.del(data);
        }else if(layEvent === 'generateWxQrcode'){
            vm.generateWxQrcode(data);
        }else if(layEvent === 'usingChange'){
            vm.usingChange(data);
        }else if (obj.event === 'collapse') {
            var trObj = layui.$(this).parent('tr'); //当前行
            var accordion = true;//开启手风琴，那么在进行折叠操作时，始终只会展现当前展开的表格。
            var content = '<table></table>';//内容
            //表格行折叠方法
            collapseTable({
                elem: trObj,
                accordion: accordion,
                content: content,
                success: function (trObjChildren, index) {
                    initObjChildren(trObjChildren, index, data.deptId, true);
                }
            });
        }
    });
}

function initObjChildren(trObjChildren, index, dataId, isCollapse) {
    var id = dataId+index;
    var eventCollapse = 'collapse'+dataId+index;
    var eventAdd = 'add'+dataId+index;
    var eventEdit = 'edit'+dataId+index;
    var eventUsing = 'using'+dataId+index;
    var eventTop = "top"+dataId+index;
    var eventDel = "del"+dataId+index;
    var eventGenerateWxQrcode = "generateWxQrcode"+dataId+index;
    trObjChildren.find('table').attr("id", id);
    trObjChildren.find('table').attr("lay-filter", id);
    var colLst = [{title: '操作', width:450, minWidth:450, unresize:true,templet:function (d) {
            var html = '';
            if (isCollapse){
                html += '<a class="layui-grid-btn-xs" lay-event="'+eventAdd+'">新增下级</a>&nbsp;&nbsp;&nbsp;';
            }
            html += '<a class="layui-grid-btn-xs" lay-event="'+eventTop+'">置顶</a>&nbsp;&nbsp;&nbsp;';
            html += '<a class="layui-grid-btn-xs" lay-event="'+eventDel+'">删除</a>&nbsp;&nbsp;&nbsp;';
            html += '<a class="layui-grid-btn-xs" lay-event="'+eventEdit+'">编辑</a>&nbsp;&nbsp;&nbsp;';
            html += '<a class="layui-grid-btn-xs" lay-event="'+eventGenerateWxQrcode+'">生成二维码</a>&nbsp;&nbsp;&nbsp;';
            if (d.sysDeptStatus == 1){
                html += '<a class="layui-grid-btn-xs" lay-event="'+eventUsing+'">停用</a>';
            }else {
                html += '<a class="layui-grid-btn-xs" lay-event="'+eventUsing+'">启用</a>';
            }
            return html;
        },align:"center"}];
    if (isCollapse){
        colLst.push({field:'name', minWidth:450, title: '组织机构名称', unresize:true,event: eventCollapse, templet: function(d) {
                return '<div style="position: relative;'
                    + 'padding: 0 10px 0 20px;">'
                    + d.name + '<i style="left: 0px;" lay-tips="展开" class="layui-icon layui-colla-icon layui-icon-right"></i></div>'
            }});
    }else {
        colLst.push({field:'name', minWidth:450, unresize:true,title: '组织机构名称'});
    }
    colLst.push(
        {field:'sysDeptType', minWidth:250, title: '类型',unresize:true, templet: function (d) {
                if (d.sysDeptType == 1) {
                    return '总公司';
                } else if (d.sysDeptType == 2) {
                    return '中心';
                } else if (d.sysDeptType == 3) {
                    return '分公司';
                } else if (d.sysDeptType == 4) {
                    return '子公司';
                } else if (d.sysDeptType == 5) {
                    return '部门';
                }else if (d.sysDeptType == 6) {
                    return '卫星城';
                } else {
                    return '--';
                }
            }},
        {field:'sysDeptStatus', minWidth:250, title: '状态', unresize:true,templet: function (d) {
                if (d.sysDeptStatus == 1) {
                    return '启用';
                } else if (d.sysDeptStatus == 2) {
                    return '停用';
                } else {
                    return '--';
                }
            }},
        {field:'userCount', minWidth:230, title: '员工人数', unresize:true,templet: function (d) {
                if (d.userCount != null && d.userCount != '') {
                    return d.userCount;
                } else {
                    return '--';
                }
            }},
        );
    layui.table.render({
        elem: "#" + id,
        url: baseURL + 'sys/dept/listpage?parentId='+dataId,
        cellMinWidth: 80,
        page: false,
        limits: [500],
        limit: 500,
        cols: [colLst],
    });
    layui.table.on('tool('+id+')', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if (obj.event === eventCollapse) {
            var trObj = layui.$(this).parent('tr'); //当前行
            var accordion = true;
            var content = '<table></table>';
            //表格行折叠方法
            collapseTable({
                elem: trObj,
                accordion: accordion,
                content: content,
                success: function (trObjChildren, index) {
                    initObjChildren(trObjChildren, index, data.deptId, true);
                }
            });
        }else if (obj.event === eventAdd){
            vm.add(data);
        }else if (obj.event === eventEdit){
            vm.update(data);
        }else if (obj.event === eventTop){
            vm.top(data);
        }else if (obj.event === eventUsing){
            vm.usingChange(data);
        }else if (obj.event === eventDel){
            vm.del(data);
        }else if (obj.event === eventGenerateWxQrcode){
            vm.generateWxQrcode(data);
        }
    });
}

function collapseTable(options) {
    var trObj = options.elem;
    if (!trObj) return;
    var accordion = options.accordion,
        success = options.success,
        content = options.content || '';
    var tableView = trObj.parents('.layui-table-view');
    var id = tableView.attr('lay-id');
    var index = trObj.data('index');
    var leftTr = tableView.find('.layui-table-fixed.layui-table-fixed-l tr[data-index="' + index + '"]');
    var rightTr = tableView.find('.layui-table-fixed.layui-table-fixed-r tr[data-index="' + index + '"]');
    var colspan = trObj.find('td').length;
    var trObjChildren = trObj.next();
    var indexChildren = id + '-' + index + '-children';
    var leftTrChildren = tableView.find('.layui-table-fixed.layui-table-fixed-l tr[data-index="' + indexChildren + '"]');
    var rightTrChildren = tableView.find('.layui-table-fixed.layui-table-fixed-r tr[data-index="' + indexChildren + '"]');
    var lw = leftTr.width() + 15;
    var rw = rightTr.width() + 15;
    //不存在
    if (trObjChildren.data('index') != indexChildren) {
        var tr = '<tr data-index="' + indexChildren + '"><td colspan="' + colspan + '"><div style="height: auto; class="layui-table-cell">' + content + '</div></td></tr>';
        trObjChildren = trObj.after(tr).next().hide();
        var fixTr = '<tr data-index="' + indexChildren + '"></tr>';
        leftTrChildren = leftTr.after(fixTr).next().hide();
        rightTrChildren = rightTr.after(fixTr).next().hide();
    }
    trObj.find('td[lay-event^="collapse"] i.layui-colla-icon').toggleClass("layui-icon-right layui-icon-down");
    trObjChildren.toggle();
    if (accordion) {
        trObj.siblings().find('td[lay-event^="collapse"] i.layui-colla-icon').removeClass("layui-icon-down").addClass("layui-icon-right");
        trObjChildren.siblings('[data-index$="-children"]').hide();
        rightTrChildren.siblings('[data-index$="-children"]').hide();
        leftTrChildren.siblings('[data-index$="-children"]').hide();
    }
    success(trObjChildren, indexChildren);
    heightChildren = trObjChildren.height();
    rightTrChildren.height(heightChildren + 115).toggle();
    leftTrChildren.height(heightChildren + 115).toggle();
}

function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value.warehouseId === arr[i]){
            return true;
        }
    }
    return false;
}

function getWarehouseList(){
    var url ="warehouse/warehouse/getWarehouseEntityList";
    $.ajax({
        type: "GET",
        url: baseURL + url,
        contentType: "application/json",
        async:false,
        data: null,
        success: function(r){
            if(r.code === 0){
                vm.warehouseList=r.warehouseList;
            }else{
                alert(r.msg);
            }
        }
    });
}


/**
 *  根据仓库列表和关系列表选中仓库
 * @param warehouseList
 * @param relationWarehouseList
 */
function createRelationWarehouseList(){
    if(vm.warehouseList == undefined || vm.warehouseList == null ||  vm.warehouseList.length == 0
        || vm.sysDept.relationWarehouseList == undefined || vm.sysDept.relationWarehouseList == null ||  vm.sysDept.relationWarehouseList.length == 0){
        return ;
    }
    for (var i = 0; i < vm.warehouseList.length; i++) {
        if(isInArray(vm.sysDept.relationWarehouseList,vm.warehouseList[i])){
            vm.warehouseList[i].checked=true;
        }else{
            vm.warehouseList[i].checked=false;
        }
        Vue.set(vm.warehouseList,i,vm.warehouseList[i]);
    }
}


