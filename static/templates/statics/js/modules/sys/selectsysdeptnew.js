$(function () {
    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.render();
    });

    init(layui);
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        showForm: false,
        sysDept: {},
        param:{
            action:'',//select_sysdept_edit  select_contract_lessor  select_suppliercontract_leasee
            level:3,
            where:{

            },
            paramStr:''
        }
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param != null) {
            _this.param.level = --param.level;
            _this.param.action = param.action;
            _this.param.where = param.where;
            _this.param.paramStr = map2str(param.where);
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selector: function (data) {
            if (vm.param.action == 'select_contract_lessor') {
                vm.reChangeLessor(data);
            }else if (vm.param.action == 'select_sysdept_edit') {
                vm.reChangeDept(data);
            }else if (vm.param.action == 'select_suppliercontract_leasee') {
                vm.reChangeSuppliercontractLeasee(data);
            }

            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        reChangeDept: function(data){
            var type = parent.vm.sysDept.sysDeptType;
            if (type>>2 != data.sysDeptType>>2){
                type = '';
            }
            parent.vm.sysDept = Object.assign({}, parent.vm.sysDept, {
                parentId: data.deptId,
                parentName: data.name,
                sysDeptType: type,
                level: data.companyname,
                parent: data,
            });
        },
        reChangeLessor: function(data){
            parent.vm.tDatas.txt = Object.assign({}, parent.vm.tDatas.txt, {
                txt_text_lessor_id: data.deptId,
                txt_text_lessor_name: data.name,
                txt_text_lessor_companyname: data.name,
                txt_text_lessor_legalPerson: data.legalPerson,
                txt_text_lessor_USCCode: data.uscCode,
                txt_text_lessor_addr: data.contactAddress,
                txt_text_lessor_contact_person: data.contactName,
                txt_text_lessor_contact_tel: data.contactTel,
                txt_text_lessor_contact_email: data.contactEmail
            });
        },
        reChangeSuppliercontractLeasee: function(data){
            parent.vm.tDatas.txt = Object.assign({}, parent.vm.tDatas.txt, {
                txt_text_leasee_id: data.deptId,
                txt_text_leasee_name: data.name,
                txt_text_leasee_companyname: data.name,
                txt_text_leasee_legalPerson: data.legalPerson,
                txt_text_leasee_USCCode: data.uscCode,
                txt_text_leasee_addr: data.contactAddress,
                txt_text_leasee_contact_person: data.contactName,
                txt_text_leasee_contact_tel: data.contactTel,
                txt_text_leasee_contact_email: data.contactEmail
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
}

function initTable(table) {
    table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/dept/listpage' + vm.param.paramStr,
        cols: [[
            {field:'name', minWidth:100, title: '组织机构名称', event: 'collapse',
                templet: function(d) {
                    return '<div style="position: relative;'
                        + 'padding: 0 10px 0 20px;">'
                        + d.name + '<i style="left: 0px;" lay-tips="展开" class="layui-icon layui-colla-icon layui-icon-right"></i></div>'
                }},
            {field:'sysDeptType', minWidth:100, title: '类型', templet: function (d) {
                    if (d.sysDeptType == 1) {
                        return '总公司';
                    } else if (d.sysDeptType == 2) {
                        return '中心';
                    }  else if (d.sysDeptType == 3) {
                        return '分公司';
                    } else if (d.sysDeptType == 4) {
                        return '子公司';
                    } else if (d.sysDeptType == 5) {
                        return '部门';
                    } else if (d.sysDeptType == 6) {
                        return '卫星城';
                    }else {
                        return '--';
                    }
                }},
            {field:'orderNum', minWidth:100, title: '排序', templet: function (d) {
                    if (d.orderNum != null && d.orderNum != '') {
                        return d.orderNum;
                    } else {
                        return '--';
                    }
                }},
            {field:'sysDeptStatus', minWidth:100, title: '状态', templet: function (d) {
                    if (d.sysDeptStatus == 1) {
                        return '启用';
                    } else if (d.sysDeptStatus == 2) {
                        return '停用';
                    } else {
                        return '--';
                    }
                }},
            {field:'userCount', minWidth:100, title: '员工数', templet: function (d) {
                    if (d.userCount != null && d.userCount != '') {
                        return d.userCount;
                    } else {
                        return '--';
                    }
                }},
            {title: '操作', width:180, templet:'#barTpl',fixed:"right",align:"center"},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
    });

    initTableEvent(table);
}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selector(data);
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
                    initObjChildren(trObjChildren, index, data.deptId, data.level < vm.param.level);
                }
            });
        }
    });
}

function initObjChildren(trObjChildren, index, dataId, isCollapse) {
    var id = dataId+index;
    var eventCollapse = 'collapse'+dataId+index;
    var eventSelector = 'selector'+dataId+index;
    trObjChildren.find('table').attr("id", id);
    trObjChildren.find('table').attr("lay-filter", id);
    var colLst = [];
    if (isCollapse){
        colLst.push({field:'name', minWidth:100, title: '组织机构名称', event: eventCollapse, templet: function(d) {
                return '<div style="position: relative;'
                    + 'padding: 0 10px 0 20px;">'
                    + d.name + '<i style="left: 0px;" lay-tips="展开" class="layui-icon layui-colla-icon layui-icon-right"></i></div>'
            }});
    }else {
        colLst.push({field:'name', minWidth:100, title: '组织机构名称'});
    }
    colLst.push(
        {field:'sysDeptType', minWidth:100, title: '类型', templet: function (d) {
                if (d.sysDeptType == 1) {
                    return '总公司';
                } else if (d.sysDeptType == 2) {
                    return '分公司';
                } else if (d.sysDeptType == 3) {
                    return '子公司';
                } else if (d.sysDeptType == 4) {
                    return '部门';
                } else if (d.sysDeptType == 5) {
                    return '卫星城';
                } else {
                    return '--';
                }
            }},
        {field:'orderNum', minWidth:100, title: '排序', templet: function (d) {
                if (d.orderNum != null && d.orderNum != '') {
                    return d.orderNum;
                } else {
                    return '--';
                }
            }},
        {field:'sysDeptStatus', minWidth:100, title: '状态', templet: function (d) {
                if (d.sysDeptStatus == 1) {
                    return '启用';
                } else if (d.sysDeptStatus == 2) {
                    return '停用';
                } else {
                    return '--';
                }
            }},
        {field:'userCount', minWidth:100, title: '员工数', templet: function (d) {
                if (d.userCount != null && d.userCount != '') {
                    return d.userCount;
                } else {
                    return '--';
                }
            }},
        {title: '操作', width:180, templet:function (d) {
                var html = '';
                if (d.deptId != vm.param.where.editDeptId) {
                    html += '<a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="' + eventSelector + '">选择</a>';
                }
                return html;
            },fixed:"right",align:"center"});
    layui.table.render({
        elem: "#" + id,
        url: baseURL + 'sys/dept/listpage'+ (vm.param.paramStr.length > 0 ? (vm.param.paramStr + '&'):('?')) + 'parentId='+dataId,
        cellMinWidth: 80,
        page: false,limit: 500,
        cols: [colLst]
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
                    initObjChildren(trObjChildren, index, data.deptId, data.level < vm.param.level);
                }
            });
        }else if (obj.event === eventSelector){
            vm.selector(data);
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
        var tr = '<tr data-index="' + indexChildren + '"><td colspan="' + colspan + '"><div style="height: auto;padding-left:' + lw + 'px;padding-right:' + rw + 'px" class="layui-table-cell">' + content + '</div></td></tr>';
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

function map2str(map) {
    var str = '';
    if (map != null){
        $.each(map, function (key, value) {
            str += '&';
            str += key;
            str += '=';
            str += value;
        });
    }
    return str.length > 0 ? ('?' + str.substring(1)) : str;
}
