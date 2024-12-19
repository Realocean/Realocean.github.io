$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            storeName:null,
            contactTel: null,
            affiliatedCompany: null,
            legalPerson: null,
            contactName: null,
            uscCode: null,
            contactAddress: null,
        },
        isFilter:false,
    },
    created: function () {
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        generateQrcode:function(data){
            if(data.alipayIsEnable != 1){
                layer.msg('门店已禁用，请联系管理员处理!', {icon: 5});
                return;
            }
            $.ajax({
                type: "GET",
                url: baseURL + "sys/dept/generateStoreQrcode?deptId="+data.deptId,
                // data: {deptId:data.deptId},
                // xhrFields: {
                //     responseType: 'blob' // 设置响应类型为二进制流
                // },
                // async: false,
                success: function(result){
                    console.log(result)
                    var imgElement = document.createElement('img');
                    // var imageUrl = URL.createObjectURL();

                    var testImageUrl = 'data:image/png+xml;base64,' + result.data
                    console.log("luj :::",testImageUrl)
                    // 创建一个弹框，显示图片
                    layer.open({
                        title: data.storeName,
                        type: 1,
                        area: ['380px', '520px'],
                        content: '<img src='+testImageUrl+'>',
                        btn: ['下载'],
                        btn1: function () {
                            // 创建一个链接，模拟点击下载
                            var link = document.createElement('a');
                            link.href = testImageUrl;
                            link.download = 'image.png';
                            link.click();
                        }
                    });
                },
                error: function (error) {
                    layer.msg('Failed to get image');
                }

            });
        },
        update: function (id) {
            $.get(baseURL + "sys/dept/info/"+id, function(r){
                var param = {
                    data:r.dept
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/store/storeEdit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (id) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/dept/storeDelete",
                    data: "deptId=" + id,
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        add: function(){
            var param = {
                data:{
                }
            };
            var index = layer.open({
                title: "新增门店信息",
                type: 2,
                boxParams:param,
                content: tabBaseURL + "modules/store/storeEdit.html",
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        reload: function (event) {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }

});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
}


function initData() {
    //初始化查询数据字典-设备生产商

}

function initEventListener(layui) {
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(signStatus)', function (data) {
        vm.q.signStatus = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
    form.on('switch(wxIsEnableStatus)', function(obj){
        var id = $(this).attr('mid');
        var status= 0;
        obj.elem.checked?status=1:status=0;
        var params = {deptId : id, appletType : 2,wxIsEnable:status};
        console.log("azszckbxzckbjsadk:",params)
        $.ajax ({
            type: 'POST',
            url: baseURL + "sys/dept/controlStoreIsEnable",
            contentType: "application/json",
            data: JSON.stringify(params),
            loadFlag: true,
            success : function(data){
                // layer.msg("启用成功");
                vm.reload();
            },
            unSuccess: function (data) {
                layer.msg("修改失败");
            }
        })
    });
    form.on('switch(alipayIsEnableStatus)', function(obj){
        var id = $(this).attr('mid');
        var status=0;
        obj.elem.checked?status=1:status=0;
        var params = {deptId : id, appletType : 1,alipayIsEnable:status};
        console.log("alialiali:",params)
        $.ajax ({
            type: 'POST',
            url: baseURL + "sys/dept/controlStoreIsEnable",
            contentType: "application/json",
            data: JSON.stringify(params),
            loadFlag: true,
            success : function(data){
                // layer.msg("启用成功");
                vm.reload();
            },
            unSuccess: function (data) {
                layer.msg("修改失败");
            }
        })
    });
}


function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL + 'sys/dept/storeListPage',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:170, minWidth:170, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'storeName', title: '门店名称', minWidth:200, templet: function (d) {return isEmpty(d.storeName);}},
            {field:'wxJSCodeEnable', title: '微信小程序', minWidth:150, templet: function (d) {
                    var strCheck = d.wxIsEnable == 1 ? "checked" : "";
                    return '<input type="checkbox" name="wxIsEnableStatus" lay-filter="wxIsEnableStatus" lay-skin="switch" lay-text="启用|禁用" ' +strCheck+ ' mid='+d.deptId+'>';
            }},
            {field:'aliPayJSCodeEnable', title: '支付宝小程序', minWidth:150, templet: function (d) {
                    var strCheck = d.alipayIsEnable == 1 ? "checked" : "";
                    return '<input type="checkbox" name="alipayIsEnableStatus" lay-filter="alipayIsEnableStatus" lay-skin="switch" lay-text="启用|禁用" ' +strCheck+ ' mid='+d.deptId+'>';
            }},
            {field:'affiliatedCompany', title: '所属公司', minWidth:200, templet: function (d) {return isEmpty(d.affiliatedCompany);}},
            {field:'legalPerson', title: '法定代表人', minWidth:100, templet: function (d) {return isEmpty(d.legalPerson);}},
            {field:'uscCode', title: '统一社会信用代码', minWidth:180, templet: function (d) {return isEmpty(d.uscCode);}},
            {field:'contactName', title: '联系人', minWidth:100, templet: function (d) {return isEmpty(d.contactName);}},
            {field:'contactTel', title: '联系电话', minWidth:100, templet: function (d) {return isEmpty(d.contactTel);}},
            {field:'contactEmail', title: '联系邮箱', minWidth:100, templet: function (d) {return isEmpty(d.contactEmail);}},
            // {field:'longitude', title: '经纬度', minWidth:100, templet: function (d) {return isEmpty(d.longitude) == '--'? '--':isEmpty(d.longitude)+','+isEmpty(d.latitude) ;}},
            {field:'contactAddress', title: '联系地址', minWidth:200, templet: function (d) {return isEmpty(d.contactAddress);}}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
        }
    });

    initTableEvent(table);
}


function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.deptId);
        }else if(layEvent === 'del'){
            vm.del(data.deptId);
        } else if(layEvent === 'generateQrcode'){
            vm.generateQrcode(data);
        }
    });


}

