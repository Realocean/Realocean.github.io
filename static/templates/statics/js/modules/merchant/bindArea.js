$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
    layui.table =  $.extend(layui.table, {config: {checkName: 'checked'}});
    layui.table.render({
      id: "grid",
      elem: '#grid',
      height:500,
      url: baseURL + "deviceinformation/deviceinformation/queryList",
      where: JSON.parse(JSON.stringify(vm.q)),
      cols: [[
        {type: 'checkbox', fixed: 'left'},
          {
              field: 'carPlateNo', title: '车牌号', align: "center",templet: function (d) {
                  return isEmpty(d.carPlateNo);
              }
          },
          {
              field: 'deviceNo', title: '设备编号', align: "center", templet: function (d) {
                  return isEmpty(d.deviceNo);
              }
          },
          {
              field: 'simCard', title: 'SIM卡号', align: "center", templet: function (d) {
                  return isEmpty(d.simCard);
              }
          },
          {
              field: 'equipmentSupplierName', title: '设备供应商', align: "center",templet: function (d) {
                  return isEmpty(d.equipmentSupplierName);
              }
          },
          {
            field: 'deviceKindStr', title: '设备类型', align: "center",templet: function (d) {
                return isEmpty(d.deviceKindStr);
            }
          },
          {
            field: 'deviceBatch', title: '批次', align: "center",templet: function (d) {
                return isEmpty(d.deviceBatch);
            }
          },
      ]],
      page: true,
      loading: true,
      limits: [10,20, 50, 100],
      limit: 10,
      autoColumnWidth: {
          init: false
      },
      done: function (res, curr, count) {
        vm.tableList = res.data
        if( vm.userList.length){
          var ids= vm.userList.map(item=>item.deviceId)
			    //遍历集合
          layui.each(res.data, function(index,item){
            //将获取的选中行数据进行遍历
            //array.indexOf 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1
            if(ids.indexOf(''+item.deviceId+'')>-1 ){ 
						 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").prop('checked', true);
					 	 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").next().addClass('layui-form-checked');
            } 
          });
			  }
      }
    });
    layui.table.on('checkbox(grid)',function(obj){ 
      if(obj.type==='all'){
        if(obj.checked){
         vm.userList = vm.unique(vm.userList.concat(vm.tableList))
        }else{
          let ls = vm.tableList.map(item=>item.deviceId)
          vm.userList = vm.userList.filter(item=>!ls.includes(item.deviceId))
        }
      }else{
        if(obj.checked){
            let ls = vm.userList.map(item=>item.deviceId)
            if(!ls.includes(obj.data.deviceId)){
              vm.userList.push(obj.data)
            }
        }else{
          vm.userList = vm.userList.filter(item=>item.deviceId!=obj.data.deviceId)
        }
      }
    });
  });
  layui.form.render('checkbox');
});

var vm = new Vue({
  el: '#rrapp',
  data: {
      userList:[],
      tableList:[],
      q: {
        deviceInfoCondition:null
      },
      data:{},
      electricType:null
  },
  updated: function () {
      layui.form.render();
  },
  mounted () {
    var param = parent.layer.boxParams.boxParams;
    this.electricType = param.electricType;
    this.data = param.data;
    this.initAllList()
  },
  methods: {
    initAllList(){
      let _this = this;
      $.ajax({
        type: "POST",
        url: baseURL + `vehiclemonitor/electronicFence/boundCar/${_this.data.id}`,
        success: function(r){
            if(r.code === 0){
              _this.userList = r.data;
            }
        }
      });
    },
    unique(arr1) {
      const res = new Map()
      return arr1.filter((item) => !res.has(item.deviceId) && res.set(item.deviceId, 1))
    },
      query: function () {
          this.reload();
      },
      reset: function () {
        this.q = {
          deviceInfoCondition:null
        }
        this.reload();
      },
      reload: function (event) {
          layui.table.reload('grid', {
              page: {
                  curr: 1
              },
              where: JSON.parse(JSON.stringify(vm.q))
          });
      },
      closePage() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
      },
      save:function () {
        let params = vm.userList.map(item=>{
          if(item.hasOwnProperty('carNo')){
            return item;
          }else{
            return {
              electronicFenceId:vm.data.id,
              deviceId:item.deviceId,
              carNo:item.carPlateNo,
              deviceNo:item.deviceNo,
            }
          }
        })
        $.ajax({
          type: "POST",
          url: baseURL + `vehiclemonitor/electronicFence/bindCar/${vm.data.id}`,
          contentType: "application/json",
          data:JSON.stringify(params),
          success: function(r){
            if(vm.electricType==1){
              parent.vm.areaReload();
            }else{
              parent.vm.keysReload();
            }
            vm.closePage();
          }
        });
      },
      delUser:function(item){
        if(vm.userList.length){
          vm.userList = vm.userList.filter(i=>i.deviceId!==item.deviceId)
          var ids= vm.userList.map(item=>item.deviceId)
			    //遍历集合
          layui.each(vm.tableList, function(index,i){
            //将获取的选中行数据进行遍历
            //array.indexOf 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1
            if(ids.indexOf(''+i.deviceId+'')>-1 ){ 
						 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").prop('checked', true);
					 	 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").next().addClass('layui-form-checked');
            } else{
              $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").prop('checked', false);
              $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").next().removeClass('layui-form-checked');
              // 取消选中
              $("input[type='checkbox'][name='layTableCheckbox']").prop('checked', false);
            }
          });
        }
      }
  }

});

function init(layui) {
  initTable(layui.table, layui.soulTable);
}



