$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
      initTable(layui.table);
      layui.form.render();
  });

});
var vm = new Vue({
  el: '#rrapp',
  data: {
      step:0,
      q: {
          carNo: null,
      },
      bingding:{
        installationPosition:null,
      },
      carGpsInfor:{},
      verify: false
  },
  computed: function () {},
  updated: function () {
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
              ids.push(item);
          });
          return ids;
      },
      reset: function () {
          resetNULL(vm.q);
          vm.reload();
      },
      query: function () {
          vm.reload();
      },
      next:function(){
        var deviceInfor = parent.layer.boxParams.boxParams;
        var list = layui.table.checkStatus('gridid').data;
        if(list.length == 0){
            alert("请选择一条记录");
            return ;
        }
        vm.carGpsInfor.carBasicId=list[0].carBasicId;
        vm.carGpsInfor.carId=list[0].carId;
        vm.carGpsInfor.carPlateNo=list[0].carNo;
        if(deviceInfor!=null){
            vm.carGpsInfor.deviceId=deviceInfor.deviceId;
            vm.carGpsInfor.deviceManufacturerNumber=deviceInfor.manufacturerNumber;
            vm.carGpsInfor.deviceNo=deviceInfor.deviceNo;
        }
        vm.step = 1;
      },
      cancel:function(){
          var index = parent.layer.getFrameIndex(window.name);
          parent.layer.close(index);
      },
      save:function(){
        if(!vm.bingding.installationPosition){
          layer.msg('绑定位置不能为空', {icon: 5});
          return false;
        }
        confirm('确定要绑定该车辆？', function(){
          $.ajax({
              type: "POST",
              url: baseURL + "car/gps/bundlingCar",
              contentType: "application/json",
              data: JSON.stringify({...vm.carGpsInfor,...vm.bingding}),
              success: function(r){
                  if(r.code == 0){
                  alert('操作成功', function(index){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        parent.vm.reload();
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
      }
  }
});

function initTable(table) {
  table.render({
    id: "gridid",
    elem: '#grid',
    url: baseURL + 'deviceinformation/deviceinformation/getUnboundCarInfor',
    where: JSON.parse(JSON.stringify(vm.q)),
    cols: [[
        {type:'radio',fixed: "left",},
        {field:'carNo', title: '车牌号',fixed: "left", align:"center",minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
        {field:'brandName', title: '品牌名称', minWidth:200, templet: function (d) {return isEmpty(d.brandName);}},
        {field:'modelName', title: '车型名称', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
        {field:'seriesName', title: '车系名称', minWidth:200, templet: function (d) {return isEmpty(d.seriesName);}},
    ]],
    height: 400,
    page: true,
    loading: true,
    limits: [10,20, 50, 100],
    limit: 10,
    autoColumnWidth: {
        init: false
    },
  });
}
