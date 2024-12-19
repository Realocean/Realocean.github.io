$(function () {
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
        url: baseURL + 'supplier/supplier/list',
        cols: [[
            {
                field: 'supplierName',align:"center", title: '供应商名称', templet: function (d) {
                if (d.supplierName != null && d.supplierName != '') {
                    return d.supplierName;
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'type',align:"center",  title: '供应商类型', templet: function (d) {
                if (d.type == 1) {
                    return '内部';
                } else if (d.type == 2) {
                    return '外部';
                } else {
                    return '--';
                }
            }
            },
            {field: 'person',align:"center",  title: '3243负责人'},
            {field: 'phone',align:"center", title: '联系电话'},
            {
                field: 'address',align:"center",  title: '地址', templet: function (d) {
                if (d.address != null && d.address != '') {
                    return d.address;
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'nature',align:"center", title: '企业性质', templet: function (d) {
                if (d.nature == 1) {
                    return '合资';
                } else if (d.nature == 2) {
                    return '独资';
                } else if (d.nature == 3) {
                    return '国有';
                } else if (d.nature == 4) {
                    return '私营';
                } else if (d.nature == 5) {
                    return '全民所有制';
                } else if (d.nature == 6) {
                    return '集体所有制';
                } else if (d.nature == 7) {
                    return '股份制';
                } else if (d.nature == 8) {
                    return '有限责任';
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'establishmentTime',align:"center", title: '成立时间', templet: function (d) {
                if (d.establishmentTime != null && d.establishmentTime != '') {
                    return d.establishmentTime;
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'registeredCapital',align:"center",  title: '注册资金', templet: function (d) {
                if (d.registeredCapital != null && d.registeredCapital != '') {
                    return numFormat(d.registeredCapital);
                } else {
                    return '--';
                }
            }
            },

            {
                field: 'auditStatus',align:"center", title: '审核状态', templet: function (d) {
                if (d.auditStatus == 1) {
                    return '审核中';
                } else if (d.auditStatus == 0) {
                    return '草稿';
                } else if (d.auditStatus == 2) {
                    return '已审核';
                } else if (d.auditStatus == 3) {
                    return '审核不通过';
                } else if (d.auditStatus == 4) {
                    return '退回修改';
                }
                else {
                    return '--';
                }
            }
            },
            {
                field: 'isUse',align:"center",  title: '启用状态', templet: function (d) {
                if (d.isUse == 0) {
                    return '启用';
                } else if (d.isUse == 1) {
                    return '停用';
                } else {
                    return '--';
                }
            }
            },
            {title: '操作', width: 280, templet: '#barTpl', fixed: "right", align: "center"}
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

    // 模拟
    layui.use(['form', 'element', 'table','soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
        id: "gridid",
        elem: '.grid',
        url: baseURL + 'supplier/supplier/list',
        cols: [[
            {
                field: 'supplierName',align:"center", title: '供应商名称', templet: function (d) {
                if (d.supplierName != null && d.supplierName != '') {
                    return d.supplierName;
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'type',align:"center",  title: '供应商类型', templet: function (d) {
                if (d.type == 1) {
                    return '内部';
                } else if (d.type == 2) {
                    return '外部';
                } else {
                    return '--';
                }
            }
            },
            {field: 'person',align:"center",  title: '3243负责人'},
            {field: 'phone',align:"center", title: '联系电话'},
            {
                field: 'address',align:"center",  title: '地址', templet: function (d) {
                if (d.address != null && d.address != '') {
                    return d.address;
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'nature',align:"center", title: '企业性质', templet: function (d) {
                if (d.nature == 1) {
                    return '合资';
                } else if (d.nature == 2) {
                    return '独资';
                } else if (d.nature == 3) {
                    return '国有';
                } else if (d.nature == 4) {
                    return '私营';
                } else if (d.nature == 5) {
                    return '全民所有制';
                } else if (d.nature == 6) {
                    return '集体所有制';
                } else if (d.nature == 7) {
                    return '股份制';
                } else if (d.nature == 8) {
                    return '有限责任';
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'establishmentTime',align:"center", title: '成立时间', templet: function (d) {
                if (d.establishmentTime != null && d.establishmentTime != '') {
                    return d.establishmentTime;
                } else {
                    return '--';
                }
            }
            },
            {
                field: 'registeredCapital',align:"center",  title: '注册资金', templet: function (d) {
                if (d.registeredCapital != null && d.registeredCapital != '') {
                    return numFormat(d.registeredCapital);
                } else {
                    return '--';
                }
            }
            },

            {
                field: 'auditStatus',align:"center", title: '审核状态', templet: function (d) {
                if (d.auditStatus == 1) {
                    return '审核中';
                } else if (d.auditStatus == 0) {
                    return '草稿';
                } else if (d.auditStatus == 2) {
                    return '已审核';
                } else if (d.auditStatus == 3) {
                    return '审核不通过';
                } else if (d.auditStatus == 4) {
                    return '退回修改';
                }
                else {
                    return '--';
                }
            }
            },
            {
                field: 'isUse',align:"center",  title: '启用状态', templet: function (d) {
                if (d.isUse == 0) {
                    return '启用';
                } else if (d.isUse == 1) {
                    return '停用';
                } else {
                    return '--';
                }
            }
            },
            {title: '操作', width: 280, templet: '#barTpl', fixed: "right", align: "center"}
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

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.verify({
            startOrstopReason: function (value) {
                if (value == "" || value == null) {
                    return '启用/停用原因不能为空';
                }
            }
        });
        form.render();
    });

    layui.form.on('submit(startOrstopReasonSave)', function () {
        vm.startOrstopReasonSave(vm.supplier);
        return false;
    });

    layui.table.render({
        elem: '#docTable'
        , id: "docTableid"
        , cols: [[
            {field: 'nameDesc', title: '资料类型', edit: 'text', width: 300,},
            {field: 'timeCreate', title: '上传时间', width: 300,},
            {field: 'operationName', title: '上传人', width: 300,},
            {field: 'nameFile', title: '文件名', width: 300,},
            {title: '操作', width: 180, templet: '#docTableBarTpl', align: "center"}
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 30, 50],
        limit: 10
    });

    layui.table.render({
        elem: '#contactTable'
        , id: "contactTableid"
        , cols: [[
            {field: 'name', title: '联系人姓名', edit: 'text', width: 250},
            {field: 'tel', title: '联系手机', edit: 'text', width: 250},
            {field: 'officeTel', title: '办公电话', edit: 'text', width: 250},
            {field: 'address', title: '地址', edit: 'text', width: 250},
            {field: 'relation', title: '与客户企业关系', edit: 'text', width: 250},
            {title: '操作', width: 120, templet: '#contactTableBarTpl', align: "center"}
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 30, 50],
        limit: 10
    });

    layui.table.on('tool(docTable)', function (obj) {

        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'show') {
            vm.showDoc(data.url, data.nameFile);
        } else if (layEvent === 'down') {
            vm.downDoc(data.url, data.nameFile);
        } else if (layEvent === 'del') {
            layer.confirm('确认删除该附件？', function (index) {
                var url = data.url;
                obj.del();
                layer.close(index);
                for (var i = 0; i < vm.docLst.length; i++) {
                    if (vm.docLst[i].url == url) {
                        vm.docLst.splice(i, 1);
                        i = i - 1;
                    }
                }
                vm.reloadDocTable();
            });
        }
    });

    layui.table.on('tool(contactTable)', function (obj) {
        var layEvent = obj.event;
        if (layEvent === 'del') {
            layer.confirm('确认删除该联系人？', function (index) {
                var id = obj.data.id;
                obj.del();
                layer.close(index);
                for (var i = 0; i < vm.contactLst.length; i++) {
                    if (vm.contactLst[i].id == id) {
                        vm.contactLst.splice(i, 1);
                        i = i - 1;
                    }
                }
                vm.reloadContactTable();
            });
        }
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.supplierId);
        } else if (layEvent === 'show') {
            vm.show(data);
        } else if (layEvent === 'start') {
            vm.start(data.supplierId);
        } else if (layEvent === 'stop') {
            vm.stop(data.supplierId);
        } else if (layEvent === 'apply') {
            vm.apply(data);
        } else if (layEvent === 'applyAgain') {
            vm.applyAgain(data);
        }else if (layEvent === 'carList') {
            vm.carList(data.supplierNo);
        }
    });

    layui.form.on('select(isUse)', function (data) {
        vm.q.isUse = data.value;
    });
    layui.form.on('select(types)', function (data) {
        vm.q.type = data.value;
    });
    layui.form.on('select(auditStatus)', function (data) {
        vm.q.auditStatus = data.value;
    });
    layui.form.on('select(type)', function (data) {
        vm.supplier.type = data.value;
    });
    layui.form.on('select(settlement)', function (data) {
        vm.supplier.settlement = data.value;
    });
    layui.form.on('select(nature)', function (data) {
        vm.supplier.nature = data.value;
    });


    layui.table.on('edit(contactTable)', function (obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data;
        var field = obj.field;
        var value = obj.value;
        var reg = /^[0-9]+\-?[0-9]*$/;
        // || field == 'officeTel'
        if (field == 'tel' && !reg.test(value)) {
            alert("请输入正确的电话号码");
        } else {
            vm.contactLst.forEach(function (d) {
                if (d.id == data.id) {
                    if (field == 'name') {
                        d.name = value;
                    } else if (field == 'tel') {
                        d.tel = value;
                    } else if (field == 'officeTel') {
                        d.officeTel = value;
                    } else if (field == 'address') {
                        d.address = value;
                    } else if (field == 'relation') {
                        d.relation = value;
                    }
                }
            })
        }
        vm.reloadContactTable();
    });

    layui.table.on('edit(docTable)', function (obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data;
        var field = obj.field;
        var value = obj.value;
            vm.docLst.forEach(function (d) {
                if (d.id == data.id) {
                    if (field == 'nameDesc') {
                        d.nameDesc = value;
                    }
                }
            })
        vm.reloadDocTable();
    });


    layui.upload.render({
        elem: '#addDoc',
        url: baseURL + 'supplier/supplier/uploadFile',
        data: {'path': 'supplier'},
        field: 'files',
        auto: true,
        accept: 'file', //普通文件
        exts: 'pdf|jpg|png|jpeg|doc|docx|xls|xlsx|zip|rar', //
        multiple: true,
        number:20,
        choose: function (obj) {
            showloading(true);
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                if (vm.docLst.length > 0) {
                    var reg = /\((.*)\)/;
                    var tmps = vm.docLst.filter(function (value) {
                        var tmpName = value.nameFile;
                        var res = reg.exec(tmpName);
                        return tmpName.replace(res == null || res.length == 0 ? "" : res[0], "") === fileName
                    });
                    if (tmps != null && tmps.length > 0) {
                        var max = 0;
                        tmps.forEach(function (value) {
                            reg.exec(value.nameFile);
                            var i = RegExp.$1;
                            if (i != null && i != '') {
                                if (i > max) max = i;
                            }
                        });
                        max++;
                        var fileCount;
                        for (var i = 0; i <= max; i++) {
                            var existLst = tmps.filter(function (value) {
                                var existFileName;
                                if (i == 0) {
                                    existFileName = fileName;
                                } else {
                                    existFileName = fileName.slice(0, extIndex) + "(" + i + ")" + fileName.slice(extIndex);
                                }
                                return existFileName === value.nameFile;
                            });
                            if (existLst == null || existLst.length == 0) {
                                if (i == 0) {
                                    fileCount = "";
                                } else fileCount = i;
                                break;
                            }
                        }
                        if (fileCount != null && fileCount != "") {
                            fileName = fileName.slice(0, extIndex) + "(" + fileCount + ")" + fileName.slice(extIndex);
                        }
                    }
                }
                var date = new Date();
                fileNameTmp = fileName;
                var fileTmp = {
                    operationId: sessionStorage.userId,
                    operationName: sessionStorage.username,
                    nameDesc: '',
                    nameAccessory: fileName,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                    timeCreate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                    timeUpdate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                };
                vm.docLst.push(fileTmp);
            });
        },

        done: function (res) {
            showloading(false);
            if (res.code == '0') {
                vm.docLst.forEach(function (value) {
                    if (value.nameFile === fileNameTmp) value.url = res.data[0];
                })
            } else {
                layer.msg('上传失败', {icon: 5});
                for (var i = 0; i < vm.docLst.length; i++) {
                    if (vm.docLst[i].nameFile === fileNameTmp) {
                        vm.docLst.splice(i, 1);
                        i = i - 1;
                    }
                }
            }
            vm.reloadDocTable();
        },
        error: function () {
            showloading(false);
            layer.msg('上传失败', {icon: 5});
            for (var i = 0; i < vm.docLst.length; i++) {
                if (vm.docLst[i].nameFile === fileNameTmp) {
                    vm.docLst.splice(i, 1);
                    i = i - 1;
                }
            }
            vm.reloadDocTable();
        }
    });

    $("#addContact").on('click', function () {
        var tmpLst = vm.contactLst.filter(function (value) {
            return (value.name == null || value.name === '')
                || (value.tel == null || value.tel === '')
                || (value.officeTel == null || value.officeTel === '')
                || (value.address == null || value.address === '')
                || (value.relation == null || value.relation === '');
        });
        if (tmpLst.length > 0) {
            alert('有未完善联系人，请先完善后再添加');
            return;
        }
        var id = 0;
        if (vm.contactLst.length > 0) {
            vm.contactLst.forEach(function (value) {
                if (value.id > id) id = value.id;
            })
        }
        var contact = {
            id: id + 1,
            name: '',
            tel: '',
            officeTel: '',
            address: '',
            relation: '',
        };
        vm.contactLst.push(contact);
        vm.reloadContactTable();
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        laydate.render({
            elem: '#establishmentTimeId',
            format: 'yyyy-MM-dd',
            type: 'date',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.supplier.establishmentTime = value;
            }
        });
        form.render();
    });
});


var fileNameTmp;
var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {

        allLookStatus: true,
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
        approvalFrom: true,
        leftTree: [
            {
                title: '一级1',
                // id: 1,
                // field: 'name1',
                // checked: true,
                // spread: true,
                children: [
                    {
                        title: '三级1-1-3',
                        // id: 23,
                        // field: '',
                        children: [
                            {
                                title: '三级1',
                                // id: 23,
                                // field: '',
                            },
                            {
                                title: '三级2',
                                // id: 23,
                                // field: '',
                            }
                        ]
                    }
                ]
            },
            {
                title: '一级2'
            }
        ],
        rightTree: [],
        authorityHeader: [
            '字段权限',
            '其他设置'
        ],
        authorityHeaderActiveIndex: 0,
        settingOtherListActiveIndex: 0,
        settingOtherList: [
            '财务应收单',
            '保险列表',
            '财务结算单',
            '财务应退单'
        ],


        q: {
            supplierName: null,
            type: null,
            auditStatus: null,
            isUse: null,
        },
        editForm: false,
        showForm: false,
        startOrstopForm: false, //启用停用表单
        docLst: [],
        contactLst: [],
        approveLog:{},
        supplier: {},
        supplierRecord: {}, //启用停用操作记录查看数据源
        detailsInfor: {}, //查看详情启用停用详情数据源
        detailsTabContentList: ['车辆详情', '车辆数据', '车辆操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '车辆基础信息',
            '违章信息',
            '保险信息',
            '年检信息',
            '保养信息',
            '出险信息',
            '维保信息',
            '车辆订单记录',
            '车辆档案'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '车辆基础信息',
    },
    computed: {
        natureStr: {
            get: function () {
                if (this.supplier.nature == 1) {
                    return "合资";
                } else if (this.supplier.nature == 2) {
                    return "独资";
                } else if (this.supplier.nature == 3) {
                    return "国有";
                } else if (this.supplier.nature == 4) {
                    return "私营";
                } else if (this.supplier.nature == 5) {
                    return "全民所有制";
                } else if (this.supplier.nature == 6) {
                    return "集体所有制";
                } else if (this.supplier.nature == 7) {
                    return "股份制";
                } else if (this.supplier.nature == 8) {
                    return "有限责任";
                } else {
                    return "--";
                }
            }
        },
        typeStr: {
            get: function () {
                if (this.supplier.type == 1) {
                    return "内部";
                } else if (this.supplier.type == 2) {
                    return "外部";
                } else {
                    return "--";
                }
            }
        },
        settlementStr: {
            get: function () {
                if (this.supplier.settlement == 1) {
                    return "后付";
                } else if (this.supplier.settlement == 2) {
                    return "预付";
                } else {
                    return "--";
                }
            }
        },
        auditStatusStr: {
            get: function () {
                if (this.supplier.auditStatus == 0) {
                    return "草稿";
                } else if (this.supplier.auditStatus == 1) {
                    return "审核中";
                } else if (this.supplier.auditStatus == 2) {
                    return "已审核";
                } else if (this.supplier.auditStatus == 3) {
                    return "审核不通过";
                } else if (this.supplier.auditStatus == 4) {
                    return "退回修改";
                } else {
                    return "--";
                }
            }
        },
        isUseStr: {
            get: function () {
                if (this.supplier.isUse == 0) {
                    return "启用";
                } else if (this.supplier.isUse == 1) {
                    return "停用";
                }
            }
        },
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        editChildBindtap (index, param) {
            console.log('param+111');
            if (this.allLookStatus) {
                this.allTableData[index].allEditStatus = !param;
            }
        },
        /**
         * tree
         */

        getChechedTree (param) {

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
            console.log(this.rightTree);
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
                    console.log(JSON.parse(JSON.stringify(item)), JSON.parse(JSON.stringify(param)));
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

        authorityHeaderBindtap (param) {
            this.authorityHeaderActiveIndex = param;
        },

        otherBindtap (param) {
            this.settingOtherListActiveIndex = param;
        },

        /**
         * 審批流
         * @param {*} param 
         */

        addApprovalContentBindtap () {
            console.log(1);
            this.addApprovalContentShow = true;
            
        },

        /**
         * 審批節點插入
         * @param {*} param 
         */

        addApprovalNodesBindtap () {
            this.addApprovalContentShow = false;
            var index = layer.open({
                title: "审批节点设置",
                type: 1,
                content: $("#approvalFrom"),
                btn: ['保存', '取消'],
                area: ['1350px', '590px'],
                btnAlign: 'c',
                end: function () {
                    vm.approvalFrom = false;
                    layer.closeAll();
                },
                btn1: function (index, layero) {
                    if (!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                        $(".layui-layer-btn0").addClass("layui-btn-disabled");
                    }
                },
                btn2: function (index, layero) {
                    vm.approvalFrom = false;
                    layer.closeAll();
                    }
            });
            vm.approvalFrom = true;
        },

        addTranslationsNodesBindtap () {
            this.addApprovalContentShow = false;
            var index = layer.open({
                title: "抄送节点设置",
                type: 1,
                content: $("#approvalFrom"),
                btn: ['保存', '取消'],
                btnAlign: 'c',
                area: ['1350px', '590px'],
                end: function () {
                    vm.approvalFrom = false;
                    layer.closeAll();
                },
                btn1: function (index, layero) {
                    if (!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                        $(".layui-layer-btn0").addClass("layui-btn-disabled");
                    }
                },
                btn2: function (index, layero) {
                    vm.approvalFrom = false;
                    layer.closeAll();
                    }
            });
            vm.approvalFrom = true;
        },

        // newMethods

        detailsTabContentBindtap (param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 2) {
                this.detailsSupTabContentListActiveValue = '车辆档案记录';
            } else if (param === 0) {
                his.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '车辆基础信息';
            }
        },

        detailsSupTabContentBindtap (param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },
        // newMethods   ENd
        carList:function(supplierNo){
            window.localStorage.setItem("supplierNo",supplierNo);
            var index = layer.open({
                title: "车辆列表",
                type: 2,
                content: tabBaseURL+'modules/carbasic/suppliercarbasic.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("supplierNo",null);
                }
            });
            layer.full(index);
        },
        apply: function (data) {
            showloading(true);
            //发起申请
            $.ajax({
                type: "POST",
                url: baseURL + "activity/startBpm",
                data: {"processKey": 'supplier', "businessId": data.supplierId},
                success: function (r) {
                    if (r.code === 0) {
                        alert('您的申请已提交！', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                },
                complete: function(){
                    showloading(false);
                }
            });
        },
        applyAgain: function (data) {
            showloading(true);
            //再次发起申请
            $.ajax({
                type: "POST",
                url: baseURL + "activity/bpmStartAgain",
                data: {"instanceId": data.instanceId},
                success: function (r) {
                    if (r.code === 0) {
                        alert('您的申请已再次提交！', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                },
                complete: function(){
                    showloading(false);
                }
            });
        },
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
            var uri = baseURL + 'supplier/supplier/download?uri=' + url + "&fileName=" + fileName;
            window.location.href = uri;
        },
        reloadDocTable: function () {
            layui.table.reload('docTableid', {
                data: vm.docLst
            });
        },
        reloadContactTable: function () {
            layui.table.reload('contactTableid', {
                data: vm.contactLst
            });
        },
        reset: function () {
            vm.q.supplierName = null;
            vm.q.type = null;
            vm.q.auditStatus = null;
            vm.q.isUse = null;
        },
        cancel: function () {
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.supplier = {};
            vm.docLst = [];
            vm.contactLst = [];
            vm.supplier.createUserId = sessionStorage.userId;
            vm.supplier.createUserName = sessionStorage.username;
            vm.supplier.updateUserId = sessionStorage.userId;
            vm.supplier.updateUserName = sessionStorage.username;
            vm.reloadDocTable();
            vm.reloadContactTable();
            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                btn: ['保存', '取消'],
                btnAlign: 'c',
                end: function () {
                    vm.editForm = false;
                    layer.closeAll();
                },
                btn1: function (index, layero) {
                    if (!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                        $(".layui-layer-btn0").addClass("layui-btn-disabled");
                        vm.saveOrUpdate();
                    }
                },
                btn2: function (index, layero) {
                    vm.editForm = false;
                    layer.closeAll();
                }
            });
            vm.editForm = true;
            layer.full(index);
        },
        update: function (supplierId) {
            vm.supplier = {};
            vm.docLst = [];
            vm.contactLst = [];
            $.get(baseURL + "supplier/supplier/info/" + supplierId, function (r) {
                vm.supplier = r.supplier;
                vm.contactLst = r.supplier.contactLst;
                vm.docLst = r.supplier.docLst;
                vm.supplier.updateUserId = sessionStorage.userId;
                vm.supplier.updateUserName = sessionStorage.username;
                vm.reloadDocTable();
                vm.reloadContactTable();
            });
            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                btn: ['保存', '取消'],
                btnAlign: 'c',
                end: function () {
                    vm.editForm = false;
                    layer.closeAll();
                },
                btn1: function (index, layero) {
                    if (!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                        $(".layui-layer-btn0").addClass("layui-btn-disabled");
                        vm.saveOrUpdate();
                    }
                },
                btn2: function (index, layero) {
                    vm.editForm = false;
                    layer.closeAll();
                }
            });
            vm.editForm = true;
            layer.full(index);
        },
        show: function (data) {
            vm.supplier = {};
            vm.docLst = [];
            vm.contactLst = [];
            vm.approveData(data);
            $.get(baseURL + "supplier/supplier/info/" + data.supplierId, function (r) {
                vm.supplier = r.supplier;
                vm.contactLst = r.supplier.contactLst;
                vm.docLst = r.supplier.docLst;
                vm.detailsInfor = r.supplier;
                vm.reloadDocTable();
                //停用原因显示影藏-是否启用：0：是 1：否
                var isUse = r.supplier.isUse;
                if (isUse == 1) {
                    $("#reason").show();
                } else {
                    $("#reason").hide();
                }
            });
            //通过供应商编号查询启用停用操作记录
            $.ajax({
                type: "POST",
                url: baseURL + "startorstoprecord/startorstoprecord/queryInforBySupplierNo/" + data.supplierNo,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    if (r.code == 0) {
                        var listLength = r.startorstopOperationRecordList;
                        vm.supplierRecord = r.startorstopOperationRecordList;
                        if (listLength == 0) {
                            $("#checkRecord").hide();
                        } else {
                            $("#checkRecord").show();
                        }
                    } else {
                        alert(r.msg);
                    }
                }
            });

            var auditStatus = data.auditStatus;
            var btn = [];
            // if (auditStatus == 0) {
            //     btn.push("提交");
            // }
            btn.push("关闭");
            var index = layer.open({
                title: "查看",
                type: 1,
                content: $("#showForm"),
                btn: btn,
                btnAlign: 'c',
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                },

            });
            vm.showForm = true;
            layer.full(index);
        },
        approveData: function(data){
            //审批记录数据装载
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processapprove/approveLog",
                data: {"instanceId":data.instanceId},
                success: function(r){
                    vm.approveLog = r.approveLog;
                    var approveHtml = '<ul class="layui-timeline">';
                    for(var i=0;i<vm.approveLog.length;i++){
                        approveHtml = approveHtml + '<li class="layui-timeline-item"><i class="layui-icon layui-timeline-axis">&#xe63f;</i><div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">'+vm.approveLog[i].approveName+'于'+vm.approveLog[i].approveTime+'</h3><p>'+vm.approveLog[i].nodeName+'&nbsp;&nbsp;&nbsp;&nbsp;'+vm.approveLog[i].approveContent+'</p></div></li>';
                    }
                    approveHtml = approveHtml + '</ul>';
                    $('#approveLog').html(approveHtml);
                }
            });
        },
        audit: function () {
            if (vm.supplier.auditStatusTmp == null || vm.supplier.auditStatusTmp == '' || vm.supplier.auditStatusTmp == 0) {
                alert('请选择审核结果');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            confirm('确定要提交审核？', function () {
                var param = {
                    id: vm.supplier.id,
                    auditStatus: vm.supplier.auditStatusTmp,
                    desc: vm.supplier.auditDesc,
                };
                $.ajax({
                    type: "POST",
                    url: baseURL + "company/supplier/audit",
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('操作成功', function (index) {
                                layer.closeAll();
                                vm.reload();
                            });
                        } else {
                            alert(r.msg, function (index) {
                                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                            });
                        }
                    }
                });
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "supplier/supplier/delete",
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
        saveOrUpdate: function (event) {
            if (vm.supplier.supplierName == null || vm.supplier.supplierName == '') {
                alert('供应商名称不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.address == null || vm.supplier.address == '') {
                alert('地址不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.corporateRepresentative == null || vm.supplier.corporateRepresentative == '') {
                alert('法人代表不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.creditCode == null || vm.supplier.creditCode == '') {
                alert('统一社会信用编码不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (!/^[a-zA-Z0-9]{18}$/g.test(vm.supplier.creditCode)) {
                alert('统一社会信用编码格式有误');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }

            if (vm.supplier.nature == null || vm.supplier.nature == '') {
                alert('请选择企业性质');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.establishmentTime == null || vm.supplier.establishmentTime == '') {
                alert('请选择成立时间');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.registeredCapital == null || vm.supplier.registeredCapital == '') {
                alert('注册资本不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.registration == null || vm.supplier.registration == '') {
                alert('登记机关不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.person == null || vm.supplier.person == '') {
                alert('负责人不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.supplier.phone == null || vm.supplier.phone == '') {
                alert('联系手机不能为空');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (!/(^\d{11}$)|(^\d{13}$)/g.test(vm.supplier.phone)) {
                alert('联系手机号码格式有误');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }

            if (vm.supplier.type == null || vm.supplier.type == '') {
                alert('请选择供应商类型');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }

            if (vm.supplier.contactEmail == null || vm.supplier.contactEmail == '') {
                alert('请输入联系邮箱');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (!/\w+@\w+\.\w+/g.test(vm.supplier.contactEmail)) {
                alert('联系邮箱格式有误');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
           /* if (vm.supplier.settlement == null || vm.supplier.settlement == '') {
                alert('请选择结算模式');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }*/
            /*if (vm.supplier.kingdeeCode == null || vm.supplier.kingdeeCode == '') {
                alert('请选择金蝶编码');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }*/
            var url = vm.supplier.supplierId == null ? "supplier/supplier/save" : "supplier/supplier/update";
            if(vm.docLst.length == 0){
                alert('请上传附件！');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.docLst.length > 0) {
                vm.supplier.docLst = vm.docLst;
            }
            if(vm.contactLst.length == 0){
                alert('请添加紧急联系人！');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.contactLst.length > 0) {
                var tmpLst = vm.contactLst.filter(function (value) {
                    return (value.name == null || value.name === '')
                        || (value.tel == null || value.tel === '')
                        || (value.officeTel == null || value.officeTel === '')
                        || (value.address == null || value.address === '')
                        || (value.relation == null || value.relation === '');
                });
                if (tmpLst.length > 0) {
                    alert('有未完善联系人');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return;
                }
                vm.supplier.contactLst = vm.contactLst;
            }
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.supplier),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg, function (index) {
                            $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                        });
                    }
                }
            });
        },
        exports: function () {
            var url = baseURL + 'supplier/supplier/export?a=a';
            if (vm.q.supplierName != null) {
                url += '&supplierName=' + vm.q.supplierName;
            }
            if (vm.q.type != null) {
                url += '&type=' + vm.q.type;
            }
            if (vm.q.contactTel != null) {
                url += '&contactTel=' + vm.q.contactTel;
            }
            if (vm.q.auditStatus != null) {
                url += '&auditStatus=' + vm.q.auditStatus;
            }
            if (vm.q.isUse != null) {
                url += '&isUse=' + vm.q.isUse;
            }
            window.location.href = url;
        },
        start: function (supplierId) {
            var DISABLED = 'layui-btn-disabled';
            $('.site-demo-active').removeClass(DISABLED);
            $('.site-demo-active').removeAttr('disabled');
            vm.supplier.startOrstopReason = null;
            //是否启用：0：是 1：否
            vm.supplier.isUse = 0;
            vm.supplier.supplierId = supplierId;
            var index = layer.open({
                title: "启用",
                type: 1,
                content: $("#startOrstopForm"),
                area: ['700px', '290px'],
                end: function () {
                    vm.startOrstopForm = false;
                    layer.closeAll();
                }
            });
            vm.startOrstopForm = true;
        },
        stop: function (supplierId) {
            var DISABLED = 'layui-btn-disabled';
            $('.site-demo-active').removeClass(DISABLED);
            $('.site-demo-active').removeAttr('disabled');
            vm.supplier.startOrstopReason = null;
            //是否启用：0：是 1：否
            vm.supplier.isUse = 1;
            vm.supplier.supplierId = supplierId;
            var index = layer.open({
                title: "停用",
                type: 1,
                content: $("#startOrstopForm"),
                area: ['700px', '290px'],
                end: function () {
                    vm.startOrstopForm = false;
                    layer.closeAll();
                }
            });
            vm.startOrstopForm = true;
        },
        startOrstopReasonSave: function (supplier) {
            //设置按钮属性防止点击按钮重复提交
            var DISABLED = 'layui-btn-disabled';
            $('.site-demo-active').addClass(DISABLED);
            $('.site-demo-active').attr('disabled', 'disabled');
            vm.supplier.supplierId = supplier.supplierId;
            vm.supplier.isUse = supplier.isUse;
            $.ajax({
                type: "POST",
                url: baseURL + "supplier/supplier/startOrStopUpdate",
                contentType: "application/json",
                data: JSON.stringify(vm.supplier),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        var DISABLED = 'layui-btn-disabled';
                        $('.site-demo-active').removeClass(DISABLED);
                        $('.site-demo-active').removeAttr('disabled');
                        alert(r.msg);
                    }
                }
            });
        },
        //启用停用操作记录查看
        checkRecord: function () {
            var detailsInfor = vm.detailsInfor; //详情内容
            layer.open({
                type: 2,
                title: '供应商启停用记录',
                area: ['960px', '560px'],
                /*  fixed: false, //不固定
                    maxmin: true,*/
                content: tabBaseURL + 'modules/startorstoprecord/startorstoprecord.html',
                success: function (layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendDetailsInfor(detailsInfor);
                }
            });
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    supplierName: vm.q.supplierName,
                    type: vm.q.type,
                    auditStatus: vm.q.auditStatus,
                    isUse: vm.q.isUse,
                }
            });
        }
    }
});

$(function () {
    layui.use(['tree'], function () {
        var tree = layui.tree;
        tree.render({
            elem: '#leftTree',
            data: JSON.parse(JSON.stringify(vm.leftTree)),
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
})

