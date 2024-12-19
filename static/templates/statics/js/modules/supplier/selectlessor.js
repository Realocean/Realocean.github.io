$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'supplier/supplier/list?auditStatus=2&isUse=0',
        cols: [[
                        {field:'supplierName', minWidth:200, title: '售卖方名称'},
                        {title: '操作', width:200, templet:'#barTpl',fixed:"right",align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selector(data);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            name: ''
        },
},
updated: function(){
    layui.form.render();
},
methods: {
    query: function () {
        // vm.reload();
    },
    reset: function () {
        vm.q.name = '';
    },
    selector: function (data) {
        parent.vm.tDatas.txt = Object.assign({}, parent.vm.tDatas.txt, {

            txt_text_lessor_id: data.supplierNo,
            txt_text_lessor_name: data.supplierName,
            txt_text_lessor_companyname: data.supplierName,
            txt_text_lessor_legalPerson: data.corporateRepresentative,
            txt_text_lessor_USCCode: data.creditCode,
            txt_text_lessor_addr: data.address,
            txt_text_lessor_contact_person: data.person,
            txt_text_lessor_contact_tel: data.phone,
            txt_text_lessor_contact_email: data.contactEmail
        });
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    },
    reload: function (event) {
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: {
                supplierName: vm.q.name
            }
        });
    }
}
});
