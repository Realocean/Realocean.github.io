/**
 * 处理tenantId，取不到则默认为1
 * @param value
 */
function hanlderTenantId(value){
    if(value==null || value==undefined || value=='' || value=='null'){
        return 1;
    }
    return value;
}
$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid', // 列表元素id
        url: `${baseURL}car/workOrderAccount/list?tenantId=${hanlderTenantId(localStorage.getItem("tenantId"))}`,
        cols: [[
            {title: '操作', templet: '#barTpl', fixed: "left", align: "center"},
            {minWidth: 60, title: '序号', align: "center",templet:(d)=>d.LAY_INDEX},
            {field: 'account', minWidth: 100, title: '账号', align: "center",templet:(d)=>isEmpty(d.account)},
            {field: 'password', minWidth: 100, title: '密码', align: "center",templet:(d)=>isEmpty(d.password)},
            {field: 'platform', minWidth: 100, title: '所属平台', align: "center",templet:(d)=>{
                    var platform = isEmpty(d.platform);
                    if('--'==platform){
                        return platform;
                    }
                    return vm.platformDictMap[platform].label;
            }},
            {field: 'workOrderAccountDeptListStr', minWidth: 200, title: '账号所属公司', align: "center",templet:(d)=>isEmpty(d.workOrderAccountDeptListStr)},
            {field: 'addrName', minWidth: 100, title: '地区', align: "center",templet:(d)=>isEmpty(d.addrName)},
            {field: 'enableFlag', minWidth: 50, title: '状态', align: "center",templet:(d)=>{
                    var enableFlag = isEmpty(d.enableFlag);
                    if('--'==enableFlag){
                        return enableFlag;
                    }
                    return vm.enableFlagDict[enableFlag];
                }},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
    //列表操作按钮事件
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        switch (layEvent){
            case 'edit':
                vm.update(data.id);
                break;
            case 'delete':
                var ids = [data.id];
                vm.del(ids);
                break;
            case 'enable':
                // 启用
                vm.accountObj.id = data.id;
                vm.accountObj.enableFlag = 1;
                vm.enableOrDisable();
                break;
            case 'disable':
                // 禁用
                vm.accountObj.id = data.id;
                vm.accountObj.enableFlag = 0;
                vm.enableOrDisable();
                break;
            case 'affiliates':
                vm.accountObj.id = data.id;
                // 关联公司
                vm.affiliates();
                break;
        }
    });
    //查询条件.状态，相当于layui-select的事件
    layui.form.on('select(q.enableFlag)', function (data) {
        vm.q.enableFlag = data.value;
    });
    //查询条件.所属平台，相当于layui-select的事件
    layui.form.on('select(q.platform)', function (data) {
        vm.q.platform = data.value;
    });
    //新增修改.所属平台，相当于layui-select的事件
    layui.form.on('select(accountObj.platform)', function (data) {
        vm.accountObj.platform = data.value;
        vm.showAddrCode = data.value== 1;
        if(data.value!=1){
            vm.accountObj.addrCode = null;
            vm.accountObj.addrName = null;
        }
    });
    //新增修改.账号所属公司，相当于layui-select的事件
    layui.form.on('select(workOrderAccountDeptList)', function (data) {
        vm.accountObj.workOrderAccountDeptList = [];
        if(!data.value){
            return false;
        }
        vm.accountObj.workOrderAccountDeptList = [{
            deptId:data.value,
            deptName:vm.purchasesupplierMap[data.value]
        }];
    });
    //新增修改.账号所属公司，相当于layui-select的事件
    layui.form.on('select(q.deptId)', function (data) {
        vm.q.deptId = data.value;
    });
    // 初始化12123地区选择
    $.get(baseURL + "car/carsurvieladdr/select", function (r) {
        vm.addrDict = r.data;
        var length = vm.addrDict.length;
        if (length < 1) {
            return false;
        }
        for (var i = 0; i < length; i++) {
            vm.addrDictMap[vm.addrDict[i].addrCode] = vm.addrDict[i].addrName;
        }
    });
    layui.form.on('select(accountObj.addrCode)', function (data) {
        vm.accountObj.addrCode = data.value;
        vm.accountObj.addrName = vm.addrDictMap[data.value];
    });
    // 加载渲染所有layui组件
    layui.form.render();

    // 表单项tips展示
    $(".purchaseSupplier").hover(function (){
        layer.tips('可通过账号所属公司确定可查询的车辆范围', '.purchaseSupplier',{tips:[2, '#663ff'], time:800});
    });
    // 加载供应商列表
    vm.selectSupList();
});

var index_id;
// 创建vue应用
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            account: null,
            platform: null,
            enableFlag: null,
            tenantId: hanlderTenantId(localStorage.getItem("tenantId")),
            deptIdList: [],
            deptIdListStr: null,
            deptNameList: [],
            deptNameListStr: null,
            // 关联公司的zTree对象
            deptZtreeObj:null
        },
        // 新增修改数据载体
        accountObj:{
            id:null,
            account: null,
            password: null,
            platform: 1,
            addrCode:null,
            addrName:null,
            enableFlag: 0,
            purchaseSupplierId:null,
            supplierName:null,
            workOrderAccountDeptList:[],
            workOrderAccountDeptListStr: null
        },
        platformDict:[
            {key:1,label:"12123平台"},
            {key:2,label:"深圳违章查询"}
        ],
        // 供应商列表
        purchasesupplierList:[],
        purchasesupplierMap:{},
        platformDictMap:{},
        enableFlagDict:{
            0:"禁用",
            1:"启用"
        },
        // 12123地址前缀
        addrDict:[],
        addrDictMap:{},
        showForm: false,
        showAddrCode: true,
        affiliatesEditForm: false,
        // 供应商列表下拉框对象
        selectSupListObj:null
    },
    created: function (){
        var _this = this;
        for(var index in this.platformDict){
            var platformItem = this.platformDict[index];
            _this.platformDictMap[platformItem.key] = platformItem;
        }

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 查询按钮事件
        query: function () {
            layui.table.reload('gridid', {
                // 分页参数
                page: {
                    curr: 1
                },
                // 查询条件
                where: vm.q
            });
        },
        reset: function () {
            resetNULL(vm.q);
            vm.q.tenantId = hanlderTenantId(localStorage.getItem("tenantId"));
        },
        // 更新供应商列表
        selectSupList: function (){
            // 供应商列表
            $.get(baseURL + "purchase/purchasesupplier/selectSupList?enalbe=1", function (r) {
                vm.purchasesupplierList = r.data;
                if (!vm.purchasesupplierList || vm.purchasesupplierList.length<1){
                    return false;
                }
                for (let i = 0; i < vm.purchasesupplierList.length; i++) {
                    vm.purchasesupplierMap[vm.purchasesupplierList[i].purchaseSupplierId] = vm.purchasesupplierList[i].supplierName;
                }
            });
        },
        // 新增
        add: function () {
            // 供应商初始化
            // vm.selectSupList();
            // 默认交管12123，默认禁用
            vm.accountObj = {
                platform: 1,
                enableFlag: 0,
            };
            // index_id = layer.open({
            //     title: "新增账号",
            //     type: 1,
            //     area: ['60%', '80%'],
            //     content: $("#editForm"),
            //     end: function () {
            //         vm.showForm = false;
            //         layer.close(index_id);
            //     }
            // });
            // vm.showForm = true;
            var param = {
                data:vm.accountObj
            };
            var index = layer.open({
                title: "新增账号信息",
                type: 2,
                boxParams: param,
                area: ['75%', '85%'],
                content: tabBaseURL + "modules/car/accountedit.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        // 修改表单
        update: function (id) {
            $.get(baseURL + "car/workOrderAccount/info/" + id, function (r) {
                vm.accountObj = r.data;
                if(vm.accountObj.workOrderAccountDeptList && vm.accountObj.workOrderAccountDeptList.length>0){
                    vm.accountObj.purchaseSupplierId = vm.accountObj.workOrderAccountDeptList[0].deptId;
                    vm.accountObj.supplierName = vm.accountObj.workOrderAccountDeptList[0].deptName;
                }
                vm.showAddrCode = vm.accountObj.platform == 1;
                var param = {
                    data:vm.accountObj
                };
                var index = layer.open({
                    title: "修改账号信息",
                    type: 2,
                    boxParams: param,
                    area: ['75%', '85%'],
                    content: tabBaseURL + "modules/car/accountedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
            });
            // 供应商初始化
            // vm.selectSupList();
            // index_id = layer.open({
            //     title: "修改账号",
            //     type: 1,
            //     area: ['60%', '80%'],
            //     content: $("#editForm"),
            //     end: function () {
            //         vm.showForm = false;
            //         layer.close(index_id);
            //     }
            // });
            // vm.showForm = true;
        },
        saveOrUpdate: function (id) {
            var url = vm.accountObj.id == null ? "car/workOrderAccount/save" : "car/workOrderAccount/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.accountObj),
                success: function (r) {
                    if(r.code != 0){
                        alert(r.msg);
                    } else
                    alert('操作成功', function () {
                        layer.close(index_id);
                    });
                }
            });
        },
        enableOrDisable: function (){
            $.ajax({
                type: "POST",
                url: baseURL + 'car/workOrderAccount/status',
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.accountObj),
                success: function (r) {
                    if(r.code != 0){
                        alert(r.msg);
                    } else
                    alert('操作成功', function (index) {
                        vm.query();
                    });
                }
            });
        },
        affiliates: function (){
            $.get(baseURL + "car/workOrderAccount/info/" + vm.accountObj.id, function (r) {
                vm.accountObj = r.data;
            });
            // 供应商初始化
            vm.selectSupList();
            var index = layer.open({
                title: "关联部门",
                type: 1,
                area: ['50%', '60%'],
                content: $("#affiliatesEditForm"),
                end: function () {
                    vm.affiliatesEditForm = false;
                    layer.closeAll();
                }
            });
            vm.affiliatesEditForm = true;
        },
        // 删除按钮事件
        del: function (ids) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/workOrderAccount/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.query();
                            });
                        } else
                        alert(r.msg);
                    }
                });
            });
        },
        // 部门树多选
        deptTree: function (multiple) {
            // 是否多选 1是0否
            multiple = multiple|0;
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: `${tabBaseURL}modules/common/selectdeptcommon.html?multiple=${multiple}`,
                end: function () {
                    layer.close(index);
                }
            });
        },
        // 部门树多选
        zTreeOnCheck: function (event, treeId, treeNode){
            var checkedNodes = vm.q.deptZtreeObj.getCheckedNodes(true)
            vm.q.deptIdList=[];
            vm.q.deptNameList=[];
            vm.q.deptNameListStr = vm.q.deptNameList.join(',');
            vm.q.deptIdListStr = vm.q.deptIdList.join(',');
            if(!checkedNodes||checkedNodes.length==0){
                return false;
            }
            vm.accountObj.workOrderAccountDeptList = [];
            for (let i = 0; i < checkedNodes.length; i++) {
                vm.q.deptIdList.push(checkedNodes[i].deptId);
                vm.q.deptNameList.push(checkedNodes[i].name);
                vm.accountObj.workOrderAccountDeptList.push({
                    "deptId": checkedNodes[i].deptId,
                    "deptName":checkedNodes[i].name
                });
            }
            vm.q.deptNameListStr = vm.q.deptNameList.join(',');
            vm.q.deptIdListStr = vm.q.deptIdList.join(',');

            $("#workOrderAccountDeptListStr").val(vm.q.deptNameListStr);
            $("#affiliates").val(vm.q.deptNameListStr);
            vm.accountObj.workOrderAccountDeptListStr = vm.q.deptNameListStr;
            return false;
        },
    }
});