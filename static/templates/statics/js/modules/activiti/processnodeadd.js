$(function () {
    layui.use(['layer','form'], function(){
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
        $.ajax({
            type: "post",
            async: false,
            url: baseURL + 'mark/processnode/initNodeData',
            data:{},
            success: function (r) {
                RemoveLoading();
                vm.orgUserData = r.orgUserData;
                vm.orgRoleData = r.orgRoleData;
                layui.use(['tree'], function () {
                    var tree = layui.tree;
                    tree.render({
                        elem: '#leftTreeUser',
                        id:'leftTreeUserId',
                        data: JSON.parse(JSON.stringify(r.orgUserData)),
                        showCheckbox: true,
                        oncheck: function (param) {
                            if (param.checked) {
                                vm.getChechedTree(param.data);
                            } else {
                                vm.getRemoveTree(param.data);
                            }
                        }
                    });

                    tree.render({
                        elem: '#approveLeftTreeUser',
                        id:'approveLeftTreeUserId',
                        data: JSON.parse(JSON.stringify(r.orgUserData)),
                        showCheckbox: true,
                        oncheck: function (param) {
                            if (param.checked) {
                                vm.getChechedTree(param.data);
                            } else {
                                vm.getRemoveTree(param.data);
                            }
                        }
                    });

                    tree.render({
                        elem: '#approveLeftTreeRole',
                        id:'approveLeftTreeRoleId',
                        data: JSON.parse(JSON.stringify(r.orgRoleData)),
                        showCheckbox: true,
                        oncheck: function (param) {
                            if (param.checked) {
                                vm.getChechedTree(param.data);
                            } else {
                                vm.getRemoveTree(param.data);
                            }
                        }
                    });

                    tree.render({
                        elem: '#copyLeftTreeUser',
                        id:'copyLeftTreeUserId',
                        data: JSON.parse(JSON.stringify(r.orgUserData)),
                        showCheckbox: true,
                        oncheck: function (param) {
                            if (param.checked) {
                                vm.getChechedTree(param.data);
                            } else {
                                vm.getRemoveTree(param.data);
                            }
                        }
                    });

                    tree.render({
                        elem: '#copyLeftTreeRole',
                        id:'copyLeftTreeRoleId',
                        data: JSON.parse(JSON.stringify(r.orgRoleData)),
                        showCheckbox: true,
                        oncheck: function (param) {
                            if (param.checked) {
                                vm.getChechedTree(param.data);
                            } else {
                                vm.getRemoveTree(param.data);
                            }
                        }
                    });

                });

            }
        });

        form.verify({
            applyNameVerify: function(value) {
                if (value == "" || value == null) {
                    return '申请人名称不能为空';
                }
            },
            nodeNameVerify: function (value) {
                if (value == "" || value == null) {
                    return '审批名称不能为空';
                }
            },
            recallIdVerify: function (value) {
                if (value == "" || value == null) {
                    return '驳回节点不能为空';
                }
            },
            copyNodeVerify: function (value) {
                if (value == "" || value == null) {
                    return '抄送名称不能为空';
                }
            }
        });

        form.on('submit(save)', function () {
            vm.save();
            return false;
        });
        form.on('radio(applyCarBack)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'applyCarBack'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(transferCar)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'transferCar'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(moveHouse)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'moveHouse'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            });
        });

        form.on('radio(billLading)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'billLading'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(carTransfer)',function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'carTransfer'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            });
        });

        form.on('radio(customField)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'customField'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(vehicleBusiness)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'vehicleBusiness'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(payCarBusiness)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'payCarBusiness'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(contractBusiness)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'contractBusiness'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(spareCarReturn)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'spareCarReturn'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(selectOrder)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'selectOrder'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(basicInfo)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'basicInfo'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(spareCar)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'spareCar'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(contract)', function (data) {
            vm.fieldData.forEach(v=>{
                if(v.moduleInfo == 'contract'){
                    v.moduleConfig = data.value;
                    vm.updateField(v,data.value);
                }
            })
        });

        form.on('radio(carStatusSelect)', function (data) {
            vm.other.carStatus = data.value;
        });

        form.on('radio(orderStatusSelect)', function (data) {
            vm.other.orderStatus = data.value;
        });

        form.on('radio(createBillSelect)', function (data) {
            vm.other.createBill = data.value;
        });

        form.on('radio(carTypeSelect)', function (data) {
            vm.other.carType = data.value;
        });

        form.on('radio(finacialTypeSelect)', function (data) {
            vm.other.finacialType = data.value;
        });

        form.on('radio(carTypeRentSelect)', function (data) {
            vm.other.carTypeRent = data.value;
        });

        form.on('radio(finacialTypeRentSelect)', function (data) {
            vm.other.finacialTypeRent = data.value;
        });

        form.on('radio(createContractSelect)', function (data) {
            vm.other.createContract = data.value;
        });

        form.on('radio(transferCarTypeSelect)', function (data) {
            vm.other.transferCarType = data.value;
        });

        form.on('radio(transferFinacialTypeSelect)', function (data) {
            vm.other.transferFinacialType = data.value;
        });

        form.on('radio(transferSelectCarSelect)', function (data) {
            vm.other.transferSelectCar = data.value;
        });

        form.on('switch(switchTest)', function(data){
            if(this.checked){
                vm.node.nodeStatus = 1;
            }else{
                vm.node.nodeStatus = 0;
            }
        });

        form.on('switch(switchNodeStatus)', function(data){
            var msg = "启用成功";
            if(data.elem.checked){
                vm.node.nodeStatus = 1;
            }else{
                vm.node.nodeStatus = 0;
                msg = "禁用成功";
            }
            vm.processNode = {
                id:data.value,
                nodeStatus:vm.node.nodeStatus
            }
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processnode/enableStatus",
                contentType: "application/json",
                data: JSON.stringify(vm.processNode),
                success: function(r){
                    if(r.code === 0){
                        vm.initData(vm.processKey);
                        alert(msg);
                    }else{
                        alert(r.msg);
                    }
                }
            });

        });

        form.on('radio(applyUserFilter)', function (data) {
            //radio切换，清除rightTree内容
            vm.rightTree = [];
            if(data.value == 1){
                vm.userTree = 1;
            }else{
                vm.userTree = 4;
            }
            vm.node.applyUser = data.value;
        });

        form.on('radio(approveUserFilter)', function (data) {
            //radio切换，清除rightTree内容
            vm.rightTree = [];
            if(data.value == 1){
                vm.userTree = 1;
            }else if(data.value ==2){
                vm.userTree = 2;
            }else{
                vm.userTree = 3;
            }
            vm.node.approveUser = data.value;
        });

        form.on('radio(copyUserFilter)', function (data) {
            //radio切换，清除rightTree内容
            vm.rightTree = [];
            if(data.value == 1){
                vm.userTree = 1;
            }else{
                vm.userTree = 2;
            }
            vm.node.copyUser = data.value;
        });

        form.on('select(recallNodeIdFilter)', function (data) {
            vm.node.recallNodeId = data.value;
            vm.node.recallNodeName = data.elem[data.elem.selectedIndex].text;
        });
        form.render();//在最后添加这句代码
    });
});
var vm = new Vue({
    el:'#rrapp',
    data:{
        nodeIndex: 0,
        processType: null,
        applyNodeInfo: {nodeName:null,nodeApplyName:null},
        allLookStatus: true,
        addApprovalContentShowList: [false, false, false],
        addApprovalContentDataList: [],
        allTableData: [
            {
                "allLookStatus": true,
                "allEditStatus": false,
                "orderLookStatus": true,
                "orderEditStatus": true,
                "orderHideStatus": true,
                "name": "字段名称",
                "lookName": "仅可见",
                "lookImg": "",
                "editName": "可编辑",
                "editImg": "",
                "hideName": "隐藏",
                "hideImg": ""
            },
            {
                "allLookStatus": true,
                "allEditStatus": false,
                "orderLookStatus": true,
                "orderEditStatus": true,
                "orderHideStatus": true,
                "name": "字段名称",
                "lookName": "仅可见",
                "lookImg": "",
                "editName": "可编辑",
                "editImg": "已选择",
                "hideName": "隐藏",
                "hideImg": ""
            },
            {
                "allLookStatus": true,
                "allEditStatus": false,
                "orderLookStatus": true,
                "orderEditStatus": true,
                "orderHideStatus": true,
                "name": "字段名称",
                "lookName": "仅可见",
                "lookImg": "",
                "editName": "可编辑",
                "editImg": "",
                "hideName": "隐藏",
                "hideImg": ""
            }
        ],
        approvalNode: {
            title: '新增长租订单',
            person: '车管,业务'
        },
        addApprovalContentShow: false,
        approvalFrom: false,
        userTree: 1,
        rightTree: [],
        rightTreeId: [],
        authorityHeader: [
            '字段权限',
            '其他设置'
        ],
        other:null,
        authorityHeaderActiveIndex: 0,
        settingOtherListActiveIndex: 0,
        settingOtherList: [
            '财务应收单',
            '保险列表',
            '财务结算单',
            '财务应退单'
        ],
        nodeDataList: [],
        fieldData: [],
        fieldDataInit: [],
        otherData: [],
        otherHtml:'',
        node:{applyUser:4,approveUser:1,copyUser:1,nodeName:null,nodeStatus:1},
        userIds: [],
        userNames: [],
        roleIds: [],
        roleNames: [],
        processKey: null,
        nodeList: [],
        copyNodeShow: true,
        orgUserData:[],
        orgRoleData:[],
        processNode:{},
        isDetail:false
    },
    updated: function(){
        layui.form.render();
    },
    mounted:function(){

    },
    methods: {
        initApproveTree:function(){
            layui.tree.render({
                elem: '#approveLeftTreeUser',
                id:'approveLeftTreeUserId',
                data: vm.orgUserData,
                showCheckbox: true,
                oncheck: function (param) {
                    if (param.checked) {
                        vm.getChechedTree(param.data);
                    } else {
                        vm.getRemoveTree(param.data);
                    }
                }
            });

            layui.tree.render({
                elem: '#approveLeftTreeRole',
                id:'approveLeftTreeRoleId',
                data: vm.orgRoleData,
                showCheckbox: true,
                oncheck: function (param) {
                    if (param.checked) {
                        vm.getChechedTree(param.data);
                    } else {
                        vm.getRemoveTree(param.data);
                    }
                }
            });

            if(vm.node.nodeType==2 && vm.node.nodeFlag==1){
                vm.rightTree = [];
                if(vm.node.nodeApproveId !=null && vm.node.nodeApproveId !=''){
                    layui.tree.setChecked('approveLeftTreeUserId',vm.node.nodeApproveId.split(','));
                }
            }

            if(vm.node.nodeType==2 && vm.node.nodeFlag==2){
                vm.rightTree = [];
                if(vm.node.nodeRoleId !=null && vm.node.nodeRoleId !=''){
                    layui.tree.setChecked('approveLeftTreeRoleId',vm.node.nodeRoleId.split(','));
                }
            }
        },
        initCopyTree:function(){
            layui.tree.render({
                elem: '#copyLeftTreeUser',
                id:'copyLeftTreeUserId',
                data: vm.orgUserData,
                showCheckbox: true,
                oncheck: function (param) {
                    if (param.checked) {
                        vm.getChechedTree(param.data);
                    } else {
                        vm.getRemoveTree(param.data);
                    }
                }
            });

            layui.tree.render({
                elem: '#copyLeftTreeRole',
                id:'copyLeftTreeRoleId',
                data: vm.orgRoleData,
                showCheckbox: true,
                oncheck: function (param) {
                    if (param.checked) {
                        vm.getChechedTree(param.data);
                    } else {
                        vm.getRemoveTree(param.data);
                    }
                }
            });

            if(vm.node.nodeType==3 && vm.node.nodeFlag==1){
                vm.rightTree = [];
                if(vm.node.nodeApproveId !=null && vm.node.nodeApproveId !='') {
                    layui.tree.setChecked('copyLeftTreeUserId', vm.node.nodeApproveId.split(','));
                }
            }

            if(vm.node.nodeType==3 && vm.node.nodeFlag==2){
                vm.rightTree = [];
                if(vm.node.nodeRoleId !=null && vm.node.nodeRoleId !='') {
                    layui.tree.setChecked('copyLeftTreeRoleId', vm.node.nodeRoleId.split(','));
                }
            }
        },
        updateField(v,value){
            if(value == 1){
                v.fields.forEach(n=>{
                    n.visible = true;
                    n.edit = false;
                    n.hide = false;
                })
            }
            if(value == 2){
                v.fields.forEach(n=>{
                    n.visible = false;
                    n.edit = true;
                    n.hide = false;
                })
            }
            if(value== 3){
                v.fields.forEach(n=>{
                    n.visible = false;
                    n.edit = false;
                    n.hide = true;
                })
            }
        },
        nodeDel(id){
            var ids = new Array();
            ids.push(id);
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "mark/processnode/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.initData(vm.processKey);
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        save(){
            var url = vm.node.id == null ? "mark/processnode/save" : "mark/processnode/update";
            vm.node.processKey = vm.processKey;
            this.userIds = [];
            this.userNames = [];
            this.roleIds = [];
            this.roleNames = [];
            /*根据nodeType环节类型,判断nodeFlag审批人类型*/
            if(this.node.nodeType == 1){
                this.node.nodeFlag = 3;
            }else if(this.node.nodeType == 2){
                this.node.nodeFlag = this.node.approveUser;
            }else{
                this.node.nodeFlag = this.node.copyUser;
            }
            /*根据nodeFlag类型，判断成员或者角色*/
            if(this.node.nodeFlag == 1){
                //指定成员
                this.rightTree.forEach(v=>{
                    this.userIds.push(v.id);
                    this.userNames.push(v.title);
                });
                if(this.userIds.length == 0 || this.userNames.length == 0){
                    alert('未设置审批人员');
                    return false;
                }
            }else if(this.node.nodeFlag == 2){
                //角色
                this.rightTree.forEach(v=>{
                    this.roleIds.push(v.id);
                    this.roleNames.push(v.title);
                });
                if(this.roleIds.length == 0 || this.roleNames.length == 0){
                    alert('未设置审批角色');
                    return false;
                }
            }else if(this.node.nodeFlag == 3){
                //申请人（不处理）
            }else{
                //工作区可填 （不处理）
            }
            this.node.nodeApproveId = this.userIds.join(',');
            this.node.nodeApproveName = this.userNames.join(',');
            this.node.nodeRoleId = this.roleIds.join(',');
            this.node.nodeRoleName = this.roleNames.join(',');
            this.node.processType = this.processType;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify({
                    processNodeForm:vm.node,
                    moduleDtos:vm.fieldData,
                    otherStatusDto:vm.other
                }),
                success: function(r){
                    if(r.code === 0){
                        alert('保存成功！',function(index){
                            vm.approvalFrom = false;
                            layer.closeAll();
                            vm.initData(vm.processKey);
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        cancel(){
            vm.approvalFrom = false;
            layer.closeAll();
        },
        initFieldData(processKey){
            $.ajax({
                type: "get",
                url: baseURL + 'mark/processnode/initFieldData',
                data:{"processKey":processKey},
                success: function (r) {
                    vm.fieldData = r.fieldData;
                    vm.otherData = r.otherData;
                    vm.fieldDataInit = r.fieldData;
                    if(vm.otherData!=null && vm.otherData!=undefined){
                        vm.otherData.forEach(v=>{
                            if(v.fieldInfo == 'carStatus'){
                                //触发车辆状态 -1不修改 1.预订中 2.用车中
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=-1 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=1  lay-skin="primary" title="预定中"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=2  lay-skin="primary" title="用车中"/></div>';
                            }
                            if(v.fieldInfo == 'orderStatus'){
                                //触发订单状态 0不修改 1待交车 2用车中
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=-1 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=1  lay-skin="primary" title="待交车"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=2 lay-skin="primary" title="用车中"/></div>';
                            }
                            if(v.fieldInfo == 'createBill'){
                                //是否生成订单 1是 2否
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="createBillSelect" name="createBill" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="createBillSelect" name="createBill" value=2  lay-skin="primary" title="否" /></div>';
                            }
                            if(v.fieldInfo == 'carType'){
                                //是否触发车辆状态为备发车
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="carTypeSelect" name="carType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="carTypeSelect" name="carType" value=2  lay-skin="primary" title="否" /></div>';
                            }
                            if(v.fieldInfo == 'finacialType'){
                                //是否触发财务生成结算单
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="finacialTypeSelect" name="finacialType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="finacialTypeSelect" name="finacialType" value=2  lay-skin="primary" title="否" /></div>';
                            }
                            if(v.fieldInfo == 'carTypeRent'){
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="carTypeRentSelect" name="carTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="carTypeRentSelect" name="carTypeRent" value=2  lay-skin="primary" title="否" /></div>';
                            }
                            if(v.fieldInfo == 'finacialTypeRent'){
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=2  lay-skin="primary" title="否" /></div>';
                            }
                            if(v.fieldInfo == 'createContract'){
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="createContractSelect" name="createContract" value=-1  lay-skin="primary" title="不修改" /><input type="radio" lay-filter="createContractSelect" name="createContract" value=1  lay-skin="primary" title="生成" /></div>';
                            }
                            if(v.fieldInfo == 'transferCarType'){
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="transferCarTypeSelect" name="transferCarType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferCarTypeSelect" name="transferCarType" value=2  lay-skin="primary" title="否" /></div>';
                            }
                            if(v.fieldInfo == 'transferFinacialType'){
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=2  lay-skin="primary" title="否" /></div>';
                            }
                            if(v.fieldInfo == 'transferSelectCar'){
                                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="transferSelectCarSelect" name="transferSelectCar" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferSelectCarSelect" name="transferSelectCar" value=2  lay-skin="primary" title="否" /></div>';
                            }
                        });
                    }
                }
            });
        },
        addApprovalContentList(index) {
            if(this.addApprovalContentShowList[index]){
                Vue.set(this.addApprovalContentShowList, index, false);
            }else{
                this.addApprovalContentShow = false;
                this.addApprovalContentShowList = [false,false,false];
                Vue.set(this.addApprovalContentShowList, index, true);
            }
            vm.initData(vm.processKey);
        },
        initData(processKey){
            //初始化流程节点数据
            $.ajax({
                type: "POST",
                url: baseURL + 'mark/processinfo/nodeList/'+processKey,
                contentType: "application/json",
                success: function (r) {
                    vm.nodeDataList = r.data;
                    if(vm.nodeDataList!=null && vm.nodeDataList.length>0){
                        //申请环节数据
                        vm.applyNodeInfo = vm.nodeDataList[0];
                        //审批环节数据
                        if(vm.nodeDataList.length>1){
                            vm.addApprovalContentDataList = vm.nodeDataList.slice(1,vm.nodeDataList.length);
                        }else{
                            vm.addApprovalContentDataList = [];
                        }
                        vm.nodeDataList.forEach(v=>{
                            //节点中已有抄送节点的话
                            if(v.nodeType === 3){
                                vm.copyNodeShow = false;
                            }
                        })
                    }else{
                        alert('流程无环节节点数据，请联系管理员进行设置！');
                    }
                }
            });
        },
        editChildBindtap1 (index,indexChild) {
            this.fieldData[index].fields[indexChild].edit = this.fieldData[index].fields[indexChild].edit ? false:true;
            if(this.fieldData[index].fields[indexChild].edit){
                this.fieldData[index].fields[indexChild].visible = false;
                this.fieldData[index].fields[indexChild].hide = false;
            }
        },
        editChildBindtap2 (index,indexChild) {
            this.fieldData[index].fields[indexChild].visible = this.fieldData[index].fields[indexChild].visible ? false:true;
            if(this.fieldData[index].fields[indexChild].visible){
                this.fieldData[index].fields[indexChild].edit = false;
                this.fieldData[index].fields[indexChild].hide = false;
            }
        },
        editChildBindtap3 (index,indexChild) {
            if(this.fieldData[index].fields[indexChild].required){
                if(!this.fieldData[index].fields[indexChild].hide){
                    alert("该字段为必填项，不可设置隐藏！");
                    return false;
                }
            }
            this.fieldData[index].fields[indexChild].hide = this.fieldData[index].fields[indexChild].hide ? false:true;
            if(this.fieldData[index].fields[indexChild].hide){
                this.fieldData[index].fields[indexChild].edit = false;
                this.fieldData[index].fields[indexChild].visible = false;
            }
        },
        editChildBindtap4 (index,indexChild) {
            if(this.fieldData[index].fields[indexChild].hide){
                if(!this.fieldData[index].fields[indexChild].required){
                    alert("该字段已隐藏，不可配置必填项！");
                    return false;
                }
            }
            this.fieldData[index].fields[indexChild].required = this.fieldData[index].fields[indexChild].required ? false:true;
        },
        editChildBindtap5 (index,indexChild) {
            this.fieldData[index].fields[indexChild].applyWatch = this.fieldData[index].fields[indexChild].applyWatch ? false:true;
        },
        /**
         * tree
         */
        getChechedTree (param) {
            // if(param.field !=2){
            //     alert("请选择用户！");
            //     return;
            // }
            if (param.children && param.children.length > 0 ) {
                for (let i = 0; i < param.children.length; i ++) {
                    if (param.children[i].children && param.children[i].children.length) {
                        this.getChechedTree(param.children[i]);
                    } else {
                        this.rightTree.push(param.children[i]);
                    }
                }
            } else {
                this.rightTree.push(param);
            }
        },
        getRemoveTree (param) {
            if (param.children && param.children.length > 0 ) {
                for (let j = 0; j < param.children.length; j ++) {
                    if (param.children[j].children && param.children[j].children.length) {
                        this.getRemoveTree(param.children[j]);
                    } else {
                        this.rightTree.some((item, i) => {
                            if (this.isObjEqual(item, param.children[j])) {
                                this.rightTree.splice(i, 1);
                                return true;
                            }
                        });
                    }
                }
            } else {
                this.rightTree.some((item, i) => {
                    if (this.isObjEqual(JSON.parse(JSON.stringify(item)), JSON.parse(JSON.stringify(param)))) {
                        this.rightTree.splice(i, 1);
                        return true;
                    }
                });
            }
        },

        isObjEqual(param1, param2){
            var props1 = Object.getOwnPropertyNames(param1);
            var props2 = Object.getOwnPropertyNames(param2);
            if (props1.length != props2.length) {
                return false;
            }
            for (var i = 0,max = props1.length; i < max; i++) {
                var propName = props1[i];
                if (param1[propName] !== param2[propName]) {
                    return false;
                }
            }
            return true;
        },
        removeBindtap (param) { {
            this.getRemoveTree(param);
        }},
        // authorityHeaderBindtap (param) {
        //     vm.authorityHeaderActiveIndex = param;
        // },
        otherBindtap (param) {
            this.settingOtherListActiveIndex = param;
        },
        /**
         * 審批流
         * @param {*} param
         */
        addApprovalContentBindtap () {
            if(this.addApprovalContentShow){
                this.addApprovalContentShow = false;
            }else{
                this.addApprovalContentShow = true;
                this.addApprovalContentShowList = [false,false,false];
            }
            vm.initData(vm.processKey);
        },
        initOtherSetting(){
            if(vm.processKey == 'longRentOrderApprove'||vm.processKey == 'rentSaleOrderApprove'||vm.processKey == 'purchaseOrderApprove'||vm.processKey == 'meltsRentOrderApprove'||vm.processKey == 'orderApprove'||vm.processKey == 'orderRentSaleApprove'||vm.processKey == 'affiliatedOrderApprove'){
                vm.other = {carStatus:-1,orderStatus:-1,createBill:-1,createContract:-1};
            }
            if(vm.processKey == 'carBackApprove'){
                vm.other = {carType:-1,finacialType:-1};
            }
            if(vm.processKey == 'purchaseBackApprove'){
                vm.other = {carType:-1,finacialType:-1};
            }
            if(vm.processKey == 'rentSaleApprove'){
                vm.other = {carTypeRent:-1,finacialTypeRent:-1};
            }
            if(vm.processKey == 'rentTransferCar' || vm.processKey == 'rentSaleTransferCar'){
                vm.other = {transferCarType:-1,transferFinacialType:-1,transferSelectCar:-1};
            }
            if(vm.processKey == 'spareCarApprove'){
                vm.other = {carStatus:-1};
            }
            if(vm.processKey == 'spareCarReturnApprove'){
                vm.other = {carType:-1};
            }
        },

        /**
         * 審批節點插入
         * @param {*} param
         */
        applyContentBindtap(id){
            vm.authorityHeaderActiveIndex = 0 ;
            vm.initOtherSetting();
            vm.nodeIndex = 0;
            if(id!=null&&id!=''){
                //初始化节点数据
                vm.node.id = id;
                $.ajax({
                    type: "POST",
                    url: baseURL + 'mark/processnode/info/'+id,
                    contentType: "application/json",
                    success: function (r) {
                        vm.node = Object.assign({},vm.node, r.processNode);
                        if(r.processNode.moduleDtoList != null){
                            vm.fieldData = r.processNode.moduleDtoList.slice(0,r.processNode.moduleDtoList.length);
                        }

                        if(r.processNode.other!=null){
                            vm.other = Object.assign({},vm.other,r.processNode.other);
                        }
                        Vue.set(vm.node,'applyUser',vm.node.nodeFlag);
                        vm.rightTree = [];
                        vm.userTree = vm.node.nodeFlag;
                        // vm.initNodeData();
                        vm.addApprovalContentShow = false;

                        var index = layer.open({
                            title: "发起人节点设置",
                            type: 1,
                            content: $("#approvalFrom"),
                            end: function () {
                                vm.approvalFrom = false;
                                layer.closeAll();
                            }
                        });
                        vm.approvalFrom = true;
                        layer.full(index);

                    }
                });
            }
        },
        initNodeRecallList(id,preId){
            var type = 0;
            var newId = 0;
            if(id!=null&&id!=''){
                //审批编辑，查询id之前的节点
                type = 1;
                newId = id;
            }
            if(preId!=null&&preId!=''){
                //审批新增，查询包含preId之前的节点
                type = 2;
                newId = preId;
            }
            $.ajax({
                type: "get",
                url: baseURL + 'mark/processnode/initNodeRecallList',
                data:{id:newId,type:type,processKey:vm.processKey},
                success: function (r) {
                    vm.nodeList = r.data;
                }
            });
        },
        addApprovalNodesBindtap (id,preId) {
            vm.initNodeRecallList(id,preId);
            vm.authorityHeaderActiveIndex = 0 ;
            vm.addApprovalContentShow = false;
            vm.nodeIndex = 1;
            vm.rightTree = [];
            vm.initOtherSetting();
            /*id 为编辑页面所用，preId 为新增页面所用*/
            if(id!=null&&id!=''){
                //初始化节点数据
                vm.node.id = id;
                $.ajax({
                    type: "POST",
                    url: baseURL + 'mark/processnode/info/' + id,
                    contentType: "application/json",
                    success: function (r) {
                        vm.node = Object.assign({},vm.node, r.processNode);
                        vm.initApproveTree();
                        if(r.processNode.moduleDtoList != null){
                            vm.fieldData =  r.processNode.moduleDtoList.slice(0,r.processNode.moduleDtoList.length);
                        }
                        vm.other = Object.assign({},vm.other,r.processNode.other);
                        Vue.set(vm.node,'approveUser',vm.node.nodeFlag);
                        vm.userTree = vm.node.nodeFlag;
                        var index = layer.open({
                            title: "审批节点设置",
                            type: 1,
                            content: $("#approvalFrom"),
                            end: function () {
                                vm.approvalFrom = false;
                                layer.closeAll();
                            }
                        });
                        vm.approvalFrom = true;
                        layer.full(index);
                    }
                });
            }else{
                vm.node = {
                    approveUser : 1,
                    nodeType : 2,
                    nodeStatus: 1,
                    preId: preId
                }
                if(vm.fieldDataInit != null){
                    vm.fieldData =  vm.fieldDataInit.slice(0,vm.fieldDataInit.length);
                }
                vm.userTree = 1;
                var index = layer.open({
                    title: "审批节点设置",
                    type: 1,
                    content: $("#approvalFrom"),
                    end: function () {
                        vm.approvalFrom = false;
                        layer.closeAll();
                    }
                });
                vm.approvalFrom = true;
                layer.full(index);
            }
        },

        addTranslationsNodesBindtap (id,preId) {
            vm.authorityHeaderActiveIndex = 0 ;
            vm.rightTree = [];
            vm.addApprovalContentShow = false;
            vm.nodeIndex = 2;
            vm.initOtherSetting();
            /*id 为编辑页面所用，preId 为新增页面所用*/
            if(id!=null&&id!=''){
                //初始化节点数据
                vm.node.id = id;
                $.ajax({
                    type: "POST",
                    url: baseURL + 'mark/processnode/info/' + id,
                    contentType: "application/json",
                    success: function (r) {
                        vm.node = Object.assign({},vm.node, r.processNode);
                        vm.initCopyTree();
                        if(r.processNode.moduleDtoList != null){
                            vm.fieldData = r.processNode.moduleDtoList.slice(0,r.processNode.moduleDtoList.length);
                        }
                        vm.other = Object.assign({},vm.other,r.processNode.other);
                        Vue.set(vm.node,'copyUser',vm.node.nodeFlag);
                        vm.userTree = vm.node.nodeFlag;
                        var index = layer.open({
                            title: "抄送节点设置",
                            type: 1,
                            content: $("#approvalFrom"),
                            end: function() {
                                vm.approvalFrom = false;
                                layer.closeAll();
                            }
                        });
                        vm.approvalFrom = true;
                        layer.full(index);
                    }
                });
            }else{
                vm.node = {
                    copyUser : 1,
                    nodeType : 3,
                    nodeStatus: 1,
                    preId: preId
                }
                if(vm.fieldDataInit != null){
                    vm.fieldData = vm.fieldDataInit.slice(0,vm.fieldDataInit.length);
                }
                vm.userTree = 1;

                var index = layer.open({
                    title: "抄送节点设置",
                    type: 1,
                    content: $("#approvalFrom"),
                    end: function() {
                        vm.approvalFrom = false;
                        layer.closeAll();
                    }
                });
                vm.approvalFrom = true;
                layer.full(index);
            }
        }
    }
});

function authorityHeaderBindtap (param){
    vm.authorityHeaderActiveIndex = param;
    if(param == 1){
        vm.otherHtml = '';
        if(vm.other!=null){
            var carStatusStr = '';
            var orderStatusStr = '';
            var createBillStr = '';
            var carTypeStr = '';
            var finacialTypeStr = '';
            var carTypeRentStr = '';
            var finacialTypeRentStr = '';
            var transferCarTypeStr = '';
            var transferFinacialTypeStr = '';
            var transferSelectCarStr = '';
            var createContractStr = '';
            vm.otherData.forEach(v=>{
               if(v.fieldInfo == 'carStatus'){
                   carStatusStr = v.fieldName;
               }
               if(v.fieldInfo == 'orderStatus'){
                   orderStatusStr = v.fieldName;
               }
               if(v.fieldInfo == 'createBill'){
                   createBillStr = v.fieldName;
               }
                if(v.fieldInfo == 'carType'){
                    carTypeStr = v.fieldName;
                }
                if(v.fieldInfo == 'finacialType'){
                    finacialTypeStr = v.fieldName;
                }
                if(v.fieldInfo == 'carTypeRent'){
                    carTypeRentStr = v.fieldName;
                }
                if(v.fieldInfo == 'finacialTypeRent'){
                    finacialTypeRentStr = v.fieldName;
                }
                if(v.fieldInfo == 'createContract'){
                    createContractStr = v.fieldName;
                }
                if(v.fieldInfo == 'transferCarType'){
                    transferCarTypeStr = v.fieldName;
                }
                if(v.fieldInfo == 'transferFinacialType'){
                    transferFinacialTypeStr = v.fieldName;
                }
                if(v.fieldInfo == 'transferSelectCar'){
                    transferSelectCarStr = v.fieldName;
                }
            });
            if(vm.other.carStatus==-1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carStatusStr+'：</span><input type="radio" lay-filter="carStatusSelect" name="carStatus"  checked value=-1 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=1  lay-skin="primary" title="预定中"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=2  lay-skin="primary" title="用车中"/></div>';
            }
            if(vm.other.carStatus==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carStatusStr+'：</span><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=-1 lay-skin="primary" title="不修改"/><input type="radio" checked lay-filter="carStatusSelect" name="carStatus" value=1  lay-skin="primary" title="预定中"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=2  lay-skin="primary" title="用车中"/></div>';
            }
            if(vm.other.carStatus==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carStatusStr+'：</span><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=-1 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=1  lay-skin="primary" title="预定中"/><input type="radio" checked lay-filter="carStatusSelect" name="carStatus" value=2  lay-skin="primary" title="用车中"/></div>';
            }
            if(vm.other.orderStatus == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+orderStatusStr+'：</span><input type="radio"  checked lay-filter="orderStatusSelect" name="orderStatus" value=-1 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=1  lay-skin="primary" title="待交车"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=2 lay-skin="primary" title="用车中"/></div>';
            }
            if(vm.other.orderStatus==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+orderStatusStr+'：</span><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=-1 lay-skin="primary" title="不修改"/><input type="radio" checked lay-filter="orderStatusSelect" name="orderStatus" value=1  lay-skin="primary" title="待交车"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=2 lay-skin="primary" title="用车中"/></div>';
            }
            if(vm.other.orderStatus==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+orderStatusStr+'：</span><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=-1 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=1  lay-skin="primary" title="待交车"/><input type="radio" checked lay-filter="orderStatusSelect" name="orderStatus" value=2 lay-skin="primary" title="用车中"/></div>';
            }
            if(vm.other.createBill == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+createBillStr+'：</span><input type="radio" lay-filter="createBillSelect" name="createBill" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="createBillSelect" name="createBill" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.createBill==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+createBillStr+'：</span><input type="radio" checked lay-filter="createBillSelect" name="createBill" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="createBillSelect" name="createBill" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.createBill==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+createBillStr+'：</span><input type="radio" lay-filter="createBillSelect" name="createBill" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="createBillSelect" name="createBill" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.carType == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carTypeStr+'：</span><input type="radio" lay-filter="carTypeSelect" name="carType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="carTypeSelect" name="carType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.carType==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carTypeStr+'：</span><input type="radio" checked lay-filter="carTypeSelect" name="carType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="carTypeSelect" name="carType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.carType==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carTypeStr+'：</span><input type="radio" lay-filter="carTypeSelect" name="carType" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="carTypeSelect" name="carType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.finacialType == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+finacialTypeStr+'：</span><input type="radio" lay-filter="finacialTypeSelect" name="finacialType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="finacialTypeSelect" name="finacialType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.finacialType==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+finacialTypeStr+'：</span><input type="radio" checked lay-filter="finacialTypeSelect" name="finacialType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="finacialTypeSelect" name="finacialType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.finacialType==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+finacialTypeStr+'：</span><input type="radio" lay-filter="finacialTypeSelect" name="finacialType" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="finacialTypeSelect" name="finacialType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.carTypeRent == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carTypeRentStr+'：</span><input type="radio" lay-filter="carTypeRentSelect" name="carTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="carTypeRentSelect" name="carTypeRent" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.carTypeRent==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carTypeRentStr+'：</span><input type="radio" checked lay-filter="carTypeRentSelect" name="carTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="carTypeRentSelect" name="carTypeRent" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.carTypeRent==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+carTypeRentStr+'：</span><input type="radio" lay-filter="carTypeRentSelect" name="carTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="carTypeRentSelect" name="carTypeRent" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.finacialTypeRent == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+finacialTypeRentStr+'：</span><input type="radio" lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.finacialTypeRent==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+finacialTypeRentStr+'：</span><input type="radio" checked lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.finacialTypeRent==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+finacialTypeRentStr+'：</span><input type="radio" lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="finacialTypeRentSelect" name="finacialTypeRent" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.createContract == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+createContractStr+'：</span><input type="radio" lay-filter="createContractSelect" name="createContract" value=-1  lay-skin="primary" title="不修改" checked/><input type="radio" lay-filter="createContractSelect" name="createContract" value=1  lay-skin="primary" title="生成" /></div>';
            }
            if(vm.other.createContract==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+createContractStr+'：</span><input type="radio" checked lay-filter="createContractSelect" name="createContract" value=1  lay-skin="primary" title="不修改" /><input type="radio" lay-filter="createContractSelect" name="createContract" value=1  lay-skin="primary" title="生成" checked/></div>';
            }
            if(vm.other.transferCarType == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferCarTypeStr+'：</span><input type="radio" lay-filter="transferCarTypeSelect" name="transferCarType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferCarTypeSelect" name="transferCarType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferCarType==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferCarTypeStr+'：</span><input type="radio" checked lay-filter="transferCarTypeSelect" name="transferCarType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferCarTypeSelect" name="transferCarType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferCarType==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferCarTypeStr+'：</span><input type="radio" lay-filter="transferCarTypeSelect" name="transferCarType" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="transferCarTypeSelect" name="transferCarType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferFinacialType == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferFinacialTypeStr+'：</span><input type="radio" lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferFinacialType==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferFinacialTypeStr+'：</span><input type="radio" checked lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferFinacialType==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferFinacialTypeStr+'：</span><input type="radio" lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="transferFinacialTypeSelect" name="transferFinacialType" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferSelectCar == -1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferSelectCarStr+'：</span><input type="radio" lay-filter="transferSelectCarSelect" name="transferSelectCar" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferSelectCarSelect" name="transferSelectCar" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferSelectCar==1){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferSelectCarStr+'：</span><input type="radio" checked lay-filter="transferSelectCarSelect" name="transferSelectCar" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="transferSelectCarSelect" name="transferSelectCar" value=2  lay-skin="primary" title="否" /></div>';
            }
            if(vm.other.transferSelectCar==2){
                vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+transferSelectCarStr+'：</span><input type="radio" lay-filter="transferSelectCarSelect" name="transferSelectCar" value=1  lay-skin="primary" title="是" /><input type="radio" checked lay-filter="transferSelectCarSelect" name="transferSelectCar" value=2  lay-skin="primary" title="否" /></div>';
            }
        }
        // else{
        //     vm.otherData.forEach(v=>{
        //         if(v.fieldInfo == 'carStatus'){
        //             //触发车辆状态 0不修改 1.预订中 2.用车中
        //             vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=0 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=1  lay-skin="primary" title="预定中"/><input type="radio" lay-filter="carStatusSelect" name="carStatus" value=2  lay-skin="primary" title="用车中"/></div>';
        //         }
        //         if(v.fieldInfo == 'orderStatus'){
        //             //触发订单状态 0不修改 1待交车 2用车中
        //             vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=0 lay-skin="primary" title="不修改"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=1  lay-skin="primary" title="待交车"/><input type="radio" lay-filter="orderStatusSelect" name="orderStatus" value=2 lay-skin="primary" title="用车中"/></div>';
        //         }
        //         if(v.fieldInfo == 'createBill'){
        //             //是否生成订单 1是 2否
        //             vm.otherHtml = vm.otherHtml + '<div class="radio-box"><span>'+v.fieldName+'：</span><input type="radio" lay-filter="createBillSelect" name="createBill" value=1  lay-skin="primary" title="是" /><input type="radio" lay-filter="createBillSelect" name="createBill" value=2  lay-skin="primary" title="否" /></div>';
        //         }
        //     });
        // }
        $('#othersetting').html(vm.otherHtml);
    }
}
