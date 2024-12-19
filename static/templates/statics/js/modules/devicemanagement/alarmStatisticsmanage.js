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
  //查询时间
  layui.laydate.render({
    elem: '#time',
    format: 'yyyy-MM-dd HH:mm:ss',
    type: 'datetime',
    range: true,
    range: '/',
    trigger: 'click',
    done: function (value, date, endDate) {
      vm.q.time = value;
      if(value){
        let t = value.split('/')
        vm.q.alarmStartTime = t[0];
        vm.q.alarmEndTime = t[1];
      }else{
        vm.q.alarmStartTime = null;
        vm.q.alarmEndTime = null;
      }
    }
  });
  layui.form.on('checkbox(checkbox)', function (data) {
    var elem =data.elem.dataset
    var key = elem.key
    var i = elem.i
    var checked = data.elem.checked
    vm.config[key][i]['deleted'] = checked;
    if(!checked){
        vm.config[key][i]['feeValue'] = null;
    }
  });
  layui.form.on('checkbox(siam_all)', function(){
        var status = $(this).prop("checked");
        $.each($("input[name=siam_one]"), function (i, value) {
            if (!value.disabled){
                $(this).prop("checked", status);
            }
        });
        if(status){
          var l = vm.list.map(item => item.id);
          vm.checkList = l;
        }else{
          vm.checkList = [];
        }
        layui.form.render();
  });
  layui.form.on('checkbox(siam_one)', function(){
        var status = $(this).prop("checked");
        var disabled = $(this).prop("disabled");
        var id = $(this)[0].dataset.id;
        if(!disabled){
            if (status){
                vm.checkList.push(id)
            }else{
                var l = vm.checkList.filter(item => item != id);
                vm.checkList = l;
            }
        }
        let ls = Array.from(new Set(vm.checkList))
        if(vm.list.length === ls.length){
            $("input[name=siam_all]").prop("checked", true);
        }else{
            $("input[name=siam_all]").prop("checked", false);
        }
        layui.form.render();
  });
  
  var tipsVal;
  // 1.找到触发的事件对象（绑定全局）  2.事件处理程序
  $('body').on('mouseover','.remarksDom', function () {
    var ovText = $(this).text();
    //内容超出长度显示弹层，否则无需弹层
    if(ovText.length <= 12){
      return;
    }
    var html = "<p style='word-wrap:break-word;width: 150px;'>" + ovText + "</p>";
    tipsVal=layer.tips(html,this,{tips:[1,"rgb(58, 61, 73)"]});
  });
  //鼠标移出
  $('body').on('mouseout','.remarksDom', function () {
      layer.close(tipsVal);
  });
});

var vm = new Vue({
  el: '#rrapp',
  data: {
    isFilter: false,
    alarmType:[],
      q: {
        carNo: null,
        customerInfo: null,
        processingStatus: null,
        deviceKind: null,
        alarmType: 0,
        processingMan: null,
        assignProcessingMan:null,
        time:null,
        alarmStartTime:null,
        alarmEndTime:null,
      },
      processingStatus: [],
      gpsEquipmentType: [],
      list:[],
      checkList:[],
      isClose: true,
  },
  created: function () {
    this.getCard();
  },
  updated: function () {
      layui.form.render();
  },
  methods: {
      move() {
          layer.closeAll()
      },
      enter(){
          var content = !this.fenceList.hasFence?"展示并悬浮文字说明围栏报警类型":"当前设备未设置电子围栏";
          layer.tips(content, '#tips', {tips: 1});
      },
      getCard:function(){
              $.ajax({
                  type: "GET",
                  url: baseURL + "alarmStatistics/cardStatistics",
                  success: function (r) {
                      vm.alarmType = r.data;
                  }
              });
      },
      // 高级筛选
      bindFilter: function () {
        this.isFilter = !this.isFilter;
      },
      changeStatus: function (cardType) {
        vm.q.alarmType = cardType;
        vm.reload();
      },
      query: function () {
          vm.reload();
      },
      reset: function () {
        vm.q = {
            carNo: null,
            customerInfo: null,
            processingStatus: null,
            deviceKind: null,
            alarmType: null,
            processingMan: null,
            assignProcessingMan:null,
            time:null,
            alarmStartTime:null,
            alarmEndTime:null,
          }
        vm.reload();
      },
      view: function (data) {
        var index = layer.open({
            title: '告警详情',
            type: 2,
            boxParams: data,
            area:['800px','500px'],
            content: tabBaseURL + "modules/devicemanagement/alarmStatisticsmanageview.html",
            end: function () {
                layer.close(index);
            }
        });
      },
      order:function(data){
        var param = {
            instanceId: data.instanceId,
            processKey: data.processKey,
            id: data.orderId,
        };
        var index = layer.open({
            title: "订单详情",
            type: 2,
            boxParams: param,
            content: tabBaseURL + "modules/order/orderview.html",
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
      },
      batchHandle: function (data,type) {
          let param = {ids:[]}
          if(type==='handle'){
            param.ids = [data.id]
          }else{
            var selectData = vm.checkList;
            param.ids = selectData.map(item=>item.id)
            if(selectData.length==0){
                alert('请选择一条需要操作的数据');
                return false;
            }
          }
          var index = layer.open({
              title: '告警处理',
              type: 2,
              boxParams: param,
              area:['500px','300px'],
              content: tabBaseURL + "modules/devicemanagement/alarmHandle.html",
              end: function () {
                  layer.close(index);
              }
          });
      },
      batchAssign: function (data,type) {
        let param = {ids:[]}
          if(type==='assign'){
            param.ids = [data.id]
          }else{
            var selectData = vm.checkList;
            param.ids = selectData.map(item=>item.id)
            if(selectData.length==0){
                alert('请选择一条需要操作的数据');
                return false;
            }
          }
        var index = layer.open({
            title: "指派处理人",
            type: 2,
            boxParams: param,
            area:['600px','500px'],
            content: tabBaseURL + "modules/devicemanagement/alarmAssign.html",
            end: function () {
                layer.close(index);
            }
        });
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
  initGpsData();
}


function initData() {
  //初始化查询数据字典-设备生产商
  $.ajax({
      type: "POST",
      url: baseURL + "sys/dict/getInfoByType/" + "processingStatus",
      contentType: "application/json",
      data: null,
      success: function (r) {
          vm.processingStatus = r.dict;
      }
  });
}
function initGpsData() {
    //初始化查询数据字典-设备生产商
    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/" + "gpsEquipmentType",
        contentType: "application/json",
        data: null,
        success: function (r) {
            vm.gpsEquipmentType = r.dict;
        }
    });
  }


function initEventListener(layui) {
  initSelect(layui.form);
}

function initSelect(form) {
  //设备生产商
  form.on('select(processingStatus)', function (data) {
      vm.q.processingStatus = data.value;
  });
  form.on('select(deviceKind)', function (data) {
    vm.q.deviceKind = data.value;
});
}


function initTable(table, soulTable) {
  table.render({
      id: "grid",
      elem: '#grid',
      url: baseURL + 'alarmStatistics/list',
      where: JSON.parse(JSON.stringify(vm.q)),
      cols: [[
          {
            templet: "#checkbd",
            title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
            width: 40,
            fixed: "left",
            align:"center"
          },
          {title: '操作', width: 200, templet: '#barTpl', fixed: "left", align: "center"},
         
          { type: 'numbers', title: '序号', width: 80, fixed: 'left' },//序号列
          {
              field: 'carNo', title: '车牌号', fixed: 'left' ,align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.carNo);
              }
          },
          {
              field: 'deviceNo', title: '设备编号', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.deviceNo);
              }
          },
          {
              field: 'deviceKindStr', title: '设备类型', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.deviceKindStr);
              }
          },
          {
              field: 'simCard', title: 'SIM卡号', align: "center", minWidth: 200, templet: function (d) {
                return isEmpty(d.simCard);
              }
          },
          {
              field: 'alarmTypeStr', title: '告警类型', align: "center", minWidth: 200, templet: function (d) {
                  return "<a class=\"layui-grid-btn-xs\" lay-event=\"view\">"+d.alarmTypeStr+"</a>";
              }
          },
          {
              field: 'alarmTime', title: '告警时间', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.alarmTime);
              }
          },
          {
              field: 'alarmAddr', title: '告警地址', align: "center", minWidth: 200, templet: function (d) {
                return "<div class=\"over-flow-1 remarksDom\" @mouseenter=\"enter\" @mouseleave=\"move\">"+d.alarmAddr+"</div>";
                  // return isEmpty(d.alarmAddr);
              }
          },
          {
            field: 'orderNo', title: '关联订单', align: "center", minWidth: 200, templet: function (d) {
                return "<a class=\"layui-grid-btn-xs\" lay-event=\"order\">"+d.orderNo+"</a>";
            }
        },
        {
          field: 'customerName', title: '关联客户', align: "center", minWidth: 200, templet: function (d) {
              return isEmpty(d.customerName);
          }
      },
      {
        field: 'processingStatusStr', title: '处理状态', align: "center", minWidth: 200, templet: function (d) {
            return isEmpty(d.processingStatusStr);
        }
    },
    {
      field: 'processingMan', title: '处理人', align: "center", minWidth: 200, templet: function (d) {
          return isEmpty(d.processingMan);
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
        if(res.data&&res.data.length){
            vm.list = res.data.filter(item=>item.processingStatus!=3)
        }else{
            vm.list = []
        }
      }
  });

  initTableEvent(table);

}


function initTableEvent(table) {
  table.on('tool(grid)', function (obj) {
      var layEvent = obj.event,
          data = obj.data;
      if (layEvent === 'handle') {
          vm.batchHandle(data,'handle');
      } else if (layEvent === 'assign') {
          vm.batchAssign(data,'assign');
      } else if (layEvent === 'view') {
          vm.view(data);
      } else if(layEvent === 'order'){
        vm.order(data);
      }
  });

}