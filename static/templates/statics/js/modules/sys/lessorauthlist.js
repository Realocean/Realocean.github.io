$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null,
            type: null,
            timeDate: null,
            timeDatestart: null,
            timeDateend: null,
        },
        isClose: true,
        subtips:null,
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        // $('#searchId>div.list-search-title-box').hide();
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
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (id) {
            $.get(baseURL + "sys/lessorauth/info/"+id, function(r){
                var param = {
                    data:r.lessorAuth
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/sys/lessorauthview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{
                    contactsType:1,
                    sealType:1,
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/sys/lessorauthedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "sys/lessorauth/info/"+id, function(r){
                var param = {
                    data:r.lessorAuth
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/sys/lessorauthedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/lessorauth/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
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
        authsign: function (id) {
            confirm('确定要发起自动签章授权？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/lessorauth/authsign",
                    contentType: "application/json",
                    data: JSON.stringify({id:id}),
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
        cancelAuthsign: function (id) {
            confirm('确定要取消自动签章授权？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/lessorauth/cancelAuthsign",
                    contentType: "application/json",
                    data: JSON.stringify({id:id}),
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
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        downloadPdf: function (view) {
            var obj = view[0];
            var url = obj.attributes['pdfurl'].value.trim();
            var fileName = obj.attributes['filename'].value.trim();
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName+".pdf";
            window.location.href = uri;
        },
        bindDept: function (view) {
            var obj = view[0];
            var lessorid = obj.attributes['data-lessorid'].value.trim();
            var deptid = obj.attributes['data-deptid'].value.trim();
            var index = layer.open({
                title: "选择部门",
                type: 2,
                area: ['60%', '70%'],
                boxParams: {
                    callback:function (dept) {
                        $.ajax({
                            type: "POST",
                            url: baseURL + "sys/lessorauth/bindDept",
                            contentType: "application/json",
                            data: JSON.stringify({
                                id:lessorid,
                                deptId:dept.deptId,
                                deptName:dept.name,
                            }),
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
                    lessorid:lessorid,
                    currentDeptId:deptid,
                },
                content: tabBaseURL + "modules/sys/selectdept.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        unbindDept: function (view) {
            var obj = view[0];
            var lessorid = obj.attributes['data-lessorid'].value.trim();
            confirm('确定要解绑该条认证信息的关联部门？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/lessorauth/bindDept",
                    contentType: "application/json",
                    data: JSON.stringify({
                        id:lessorid,
                    }),
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
        signAvailableChange: function (view) {
            var obj = view[0];
            var lessorid = obj.attributes['data-lessorid'].value.trim();
            var signavailable = obj.attributes['data-signavailable'].value.trim();
            confirm('确定要'+(signavailable&&transformTypeByMap(signavailable, {1:'停用',2:'启用'})||'启用')+'该条认证信息？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/lessorauth/signAvailableChange",
                    contentType: "application/json",
                    data: JSON.stringify({
                        id:lessorid,
                        signAvailable:(signavailable&1)+1
                    }),
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
        mouseout:function (){
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        move:function (action) {
            var content;
            switch (action) {
                case 'i-signAvailable':{
                    content = '停用后，该条认证信息及认证状态保留，只是无法作为签章数据使用，启用后可恢复使用。';
                    break;
                }
                case 'i-deptName':{
                    content = '认证信息绑定部门后，该部门订单签章时使用该认证信息；当订单出租方未绑定认证信息时，默认会获取可用的未绑定部门的其中一条认证信息进行签章。';
                    break;
                }
            }
            if(!vm.subtips){
                vm.openMsg('.'+action,content);
            }
        },
        openMsg:function (id,content) {
            vm.subtips = layer.tips(content, id, {tips: 1});
        },
    }
});

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '企业名称', placeholder: '请输入企业名称', fieldName: 'name',},
            {type: 'text', label: '所属部门', placeholder: '请输入所属部门', fieldName: 'deptName',},
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exports();
                    break;
                }
            }
        }
    }).initView();
}


function initUpload(upload) {
    upload.render({
        elem: '#inports',
        url: baseURL + 'sys/lessorauth/imports',
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        before: function (obj) {
            layer.msg('数据导入中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (res) {
            layer.close(layer.msg());
            if (parseInt(res.code) === 0) {
                vm.importSuccess(res);
            } else {
                layer.msg('文件解析失败:' + res.msg, {icon: 5});
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
        }
    });
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    $(document).on('click', '.downloadPdf', function () {
        vm.downloadPdf($(this));
    });

    $(document).on('click', '.bindDept', function () {
        vm.bindDept($(this));
    });

    $(document).on('click', '.unbindDept', function () {
        vm.unbindDept($(this));
    });

    $(document).on('click', '.signAvailable', function () {
        vm.signAvailableChange($(this));
    });

    $(document).on('mousemove', '.i-signAvailable', function () {
        vm.move('i-signAvailable');
    });

    $(document).on('mousemove', '.i-deptName', function () {
        vm.move('i-deptName');
    });

    $(document).on('mouseout', '.i-signAvailable,.i-deptName', function () {
        vm.mouseout();
    });
}

function initTable(table, soulTable) {
    var grid = table.render({
        id: "gridid",
        elem: '#grid',
        // toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'sys/lessorauth/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        drag: false,
        cols: [[
            {title: '操作', unresize: true, width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'name', unresize: true, title: '企业名称', minWidth:200, templet: function (d) {return isEmpty(d.name);}},
            {field:'tenantName', unresize: true, title: '所属租户', minWidth:200, templet: function (d) {return isEmpty(d.tenantName);}},
            {field:'deptName', unresize: true, title: '所属部门', minWidth:200, templet: function (d) {
                    var view = '<span>';
                    if (d.deptId) {
                        view += isEmpty(d.deptName);
                        view += ' / ';
                    }
                    view += '</span>';
                    view += ('<a class="bindDept" target="_blank" style="text-decoration: underline;color: #1e9fff;cursor: pointer;" data-lessorid="'+d.id+'" data-deptid="'+d.deptId+'">');
                    view += d.deptId&&'修改'||'绑定';
                    view += '</a>';
                    if (d.deptId) {
                        view += ' / ';
                        view += ('<a class="unbindDept" target="_blank" style="text-decoration: underline;color: #1e9fff;cursor: pointer;" data-lessorid="'+d.id+'" data-deptid="'+d.deptId+'">');
                        view += '解绑';
                        view += '</a>';
                    }
                    return view;
                }
            },
            {field:'signAvailable', unresize: true, title: '签章可用状态', minWidth:200, templet: function (d) {
                    var view = '<span>';
                    view += transformTypeByMap(d.signAvailable, {1:'可用',2:'不可用'});
                    view += '</span>';
                    view += ' / ';
                    view += ('<a class="signAvailable" target="_blank" style="text-decoration: underline;color: #1e9fff;cursor: pointer;" data-lessorid="'+d.id+'" data-signavailable="'+d.signAvailable+'">');
                    view += d.signAvailable&&transformTypeByMap(d.signAvailable, {1:'停用',2:'启用'})||'启用';
                    view += '</a>';
                    return view;
                }
            },
            {field:'authenticationUrl', unresize: true, title: '认证结果', minWidth:200, templet: function (d) {
                    if (d.authenticationUrl == null || d.authenticationUrl == '') {
                        return '--';
                    } else {
                        return "<a href='" + d.authenticationUrl + "' target='_blank' style='text-decoration: underline;color: #1e9fff;'>查看认证结果</a>"
                    }
                }},
            {field:'authenticationStatus', unresize: true, title: '认证状态', minWidth:200, templet: function (d) {return transformTypeByMap(d.authenticationStatus, { 3: '已提交待审核', 4: '审核通过', 5: '审核不通过' });}},
            {field:'authsignStatus', unresize: true, title: '自动签章', minWidth:200, templet: function (d) {return transformTypeByMap(d.authsignStatus, { 0: '未开启', 1: '已开启', 2: '审核中' });}},
            {field:'authsignUrl', unresize: true, title: '自动签认证结果', minWidth:200, templet: function (d) {
                    if (d.authsignUrl == null || d.authsignUrl == '') {
                        return '--';
                    } else {
                        var view;
                        if(d.authsignUrl.indexOf("https://textapi.fadada.com")>=0){
                            view = "<a href='" + d.authsignUrl + "'      target='_blank' style='text-decoration: underline;color: #1e9fff;'>查看认证结果</a>";
                        }else{
                             view = "<a href='" + importURL+d.authsignUrl + "' target='_blank' style='text-decoration: underline;color: #1e9fff;'>查看认证结果</a>";
                        }
                        if (d.authsignStatus == 1) {
                            view += ("&nbsp;/&nbsp;<a target='_blank' style='text-decoration: underline;color: #1e9fff;cursor: pointer' class='downloadPdf' filename='"+d.authsignContractNo+"' pdfurl='" + d.urlPdf + "'>下载</a>");
                        }
                        return view;
                    }
                }},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);

            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
            $('th[data-field="deptName"]>div>span').append('<i class="layui-icon layui-icon-about i-deptName" style="color: #c9c2c2;"></i>');
            $('th[data-field="signAvailable"]>div>span').append('<i class="layui-icon layui-icon-about i-signAvailable" style="color: #c9c2c2;"></i>');
        }
    });
    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        } else if(layEvent === 'authsign'){
            vm.authsign(data.id);
        } else if(layEvent === 'cancelAuthsign'){
            vm.cancelAuthsign(data.id);
        }
    });
}

function initDate(laydate) {

}
