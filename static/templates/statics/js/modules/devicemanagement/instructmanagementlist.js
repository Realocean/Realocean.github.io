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
  layui.form.on('select(status)', function (data) {
    vm.q.status = data.value;
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
        vm.q.startTime = t[0];
        vm.q.endTime = t[1];
      }else{
        vm.q.startTime = null;
        vm.q.endTime = null;
      }
    }
  });
});

var vm = new Vue({
  el: '#rrapp',
  data: {
      q: {
        simCard:null,
        status:null,
        time:null,
        startTime: null,
        endTime:null,
      },
      instructManagerStatus: [],
  },
  updated: function () {
      layui.form.render();
  },
  methods: {
      query: function () {
          vm.reload();
      },
      reset: function () {
        vm.q = {
          simCard:null,
          status:null,
          time:null,
          startTime: null,
          endTime:null,
        }
        vm.reload();
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

function init(layui) {
  initTable(layui.table, layui.soulTable);
  initData();
}


function initData() {
  //初始化查询数据字典-设备生产商
  $.ajax({
      type: "POST",
      url: baseURL + "sys/dict/getInfoByType/" + "instructManagerStatus",
      contentType: "application/json",
      data: null,
      success: function (r) {
          vm.instructManagerStatus = r.dict;
      }
  });
}

function initTable(table, soulTable) {
  table.render({
      id: "gridid",
      elem: '#grid',
      url: baseURL + 'instructManager/list',
      where: JSON.parse(JSON.stringify(vm.q)),
      cols: [[
          {
              field: 'instructionName', title: '指令名称', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.instructionName);
              }
          },
          {
              field: 'statusStr', title: '发送类型', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.sendTypeStr);
              }
          },
          {
              field: 'sendTime', title: '发送时间', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.sendTime);
              }
          },
          {
              field: 'deviceNo', title: '设备编号', align: "center", minWidth: 200, templet: function (d) {
                return isEmpty(d.deviceNo);
              }
          },
          {
              field: 'simCard', title: 'SIM卡号', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.simCard);
              }
          },
          {
              field: 'carNo', title: '关联车辆', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.carNo);
              }
          },
          {
              field: 'statusStr', title: '状态', align: "center", minWidth: 200, templet: function (d) {
                return isEmpty(d.statusStr);
              }
          },
          {
            field: 'operationAccount', title: '操作账号', align: "center", minWidth: 200, templet: function (d) {
                return isEmpty(d.operationAccount);
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
  });
}


