$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'contract/contracpurchase/carList',
        cols: [[
                        {field:'carNo', minWidth:200,fixed: "left", align:"center",title: '车牌号'},
                        {field:'vinNo', minWidth:200, title: '车架号'},
                        {field:'purchaseSupplierName', minWidth:200, title: '所属供应商'},
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
        carData:{},
},
created: function(){
    var _this = this;
    _this.carData = parent.layer.boxParams.boxParams;
},
updated: function(){
    layui.form.render();
},
methods: {
    query: function () {
        vm.reload();
    },
    reset: function () {
        vm.q.name = '';
    },
    selector: function (data) {
        parent.vm.contracpurchase = Object.assign({}, parent.vm.contracpurchase, {
            carId: data.carId,
            carNo: data.carNo,
            vinNo: data.vinNo,
            purchaseSupplierId: data.purchaseSupplierId,
            purchaseSupplierName: data.purchaseSupplierName,
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
                carNo: vm.q.name
            }
        });
    }
}
});
