$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });

  layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
    $.ajax({
      type: "GET",
      url: baseURL + "alarmStatistics/cardStatistics",
      success: function (r) {
        let data = r.data || []
        data.forEach((item, index) => {
          $("#alarmType").append(`<option value=${item.cardType}>${item.label}</option>`);
        })
        layui.form.render();
      }
    });
    $.ajax({
      type: "POST",
      url: baseURL + "sys/dict/getInfoByType/" + "processingStatus",
      contentType: "application/json",
      data: null,
      success: function (r) {
        let data = r.dict || []
        data.forEach((item, index) => {
          $("#processingStatus").append(`<option value=${item.code}>${item.value}</option>`);
        })
        layui.form.render();
      }
  });
  $.ajax({
    type: "POST",
    url: baseURL + "sys/dict/getInfoByType/" + "gpsEquipmentType",
    contentType: "application/json",
    data: null,
    success: function (r) {
      let data = r.dict || []
      data.forEach((item, index) => {
        $("#deviceKind").append(`<option value=${item.code}>${item.value}</option>`);
      })
      layui.form.render();
    }
  });
    init(layui)
    layui.form.render();
  });
});
var vm = new Vue({
  el: '#rrapp',
  data: {
      q: {
        currentOrderFlag:'0',
        alarmType: null,
        deviceKind:null,
        processingStatus:null,
        orderNo:null,
      },
      detail:{
        carInfo:{},
        wiredDeviceInfo:[],
        wirelessDeviceInfo:[],
        orderInfo:{}
      },
      alarmType:[],
      processingStatus:[],
      gpsEquipmentType:[],
      paramKey: "controler_center",
      param:{},
  },
  watch: {
    q:{
      immediate: false,
      deep: true,
      handler(val) {
        vm.query(val)
      },
    }
  },
  created () {
    var param = parent.layer.boxParams.boxParams;
    this.param = param
    this.initDetail()
  },
  mounted () {
    
  },
  methods: {
    //查看轨迹
    checkTrackClick(item){
      var base = new Base64();
      const params = {}
      for(let key in item){   
        params[key] = item[key]?item[key]+'':''
      }
        params['carPlateNo'] = vm.detail.carInfo.carNo
      let data = JSON.stringify(JSON.parse(JSON.stringify(params)))
      var result = base.encode(data); 
      window.open(tabBaseURL + "modules/devicemanagement/hasCarStatisticsmanage.html?data="+ result+"&gpsAccountId="+vm.param.gpsAccountId);
    },
    // 实时追踪
    realTimeClick(item){
      var base = new Base64();
      const params = {}
      for(let key in item){   
        params[key] = item[key]?item[key]+'':''
      }
      params['carPlateNo'] = vm.detail.carInfo.carNo
      let data = JSON.stringify(JSON.parse(JSON.stringify(params)))
      var result = base.encode(data); 
      window.open(tabBaseURL + "modules/devicemanagement/hasCarTrackStatisticsmanage.html?data="+ result+"&gpsAccountId="+vm.param.gpsAccountId);
    },
    // 下发指令
    issueClick(item){
      var index = layer.open({
          title: '下发指令',
          type: 2,
          boxParams: {...item,carPlateNo:vm.detail.carInfo.carNo,vinNo:vm.detail.carInfo.vinNo,gpsAccountId:vm.param.gpsAccountId},
          area:['600px','300px'],
          content: tabBaseURL + "modules/car/issueModel.html",
          end: function () {
              layer.close(index);
          }
      });
    },
    // 上报周期
    reportingCycle(item){
      var index = layer.open({
        title: '上报周期',
        type: 2,
        boxParams: item,
        area:['800px','600px'],
        content: tabBaseURL + "modules/car/cycleModel.html",
        end: function () {
            layer.close(index);
        }
      });
      layer.full(index);
    },
    query(val)  {
        layui.table.reload('grid', {
            page: {
                curr: 1
            },
            where: JSON.parse(JSON.stringify(val))
        });
    },
    initDetail(){
      let _this = this;
      $.ajax({
          type: "GET",
          url: baseURL + `vehiclemonitor/carDetail/${_this.param.carPlateNo}/${_this.param.gpsAccountId}`,
          contentType: "application/json",
          success: (res) => {
              if (res.code === 0) {
                  _this.detail = res.data
              } else {
                  layer.alert('获取详情失败')
              }
          },
          error: () => {}
      });
    },
      closePage: function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
      },
      save: function (data) {
        if(!vm.q.processingManPhone){
          layer.msg(`处理人手机号不能为空`, {icon: 5});
          return false;
        }
        if(!vm.q.processingMan){
          layer.msg(`处理人不能为空`, {icon: 5});
          return false;
        }
        if(vm.q.processingManPhone.length!=11){
          layer.msg(`手机号不正确`, {icon: 5});
          return false;
        }
        var param = parent.layer.boxParams.boxParams;
        $.ajax({
          type: "POST",
          url: baseURL + "alarmStatistics/assign",
          contentType: "application/json",
          data:JSON.stringify({idList:param.ids,...vm.q}),
          success: function(r){
            parent.vm.reload();
            vm.closePage();
          }
        });
      },
  }
});
function init(layui){
  initTable(layui.table);
  initEventListener(layui);
}
function initEventListener(layui) {
  initSelect(layui.form);
}
function initSelect(form) {
  
  form.on('radio(currentOrderFlag)', function (data) {
    vm.q.currentOrderFlag = data.value;
    if(data.value==='1'){
      vm.q.orderNo = vm.detail.orderInfo.orderCarCode;
    }else{
      vm.q.orderNo = null;
    }
  });
  form.on('select(alarmType)', function (data) {
    vm.q.alarmType = data.value;
  
  });
  form.on('select(deviceKind)', function (data) {
    vm.q.deviceKind = data.value;
  });
  form.on('select(processingStatus)', function (data) {
    vm.q.processingStatus = data.value;
  });
  
  form.render();
}
function initTable(table) {
  table.render({
      id: "grid",
      elem: '#grid',
      url: baseURL + 'alarmStatistics/list',
      where: JSON.parse(JSON.stringify(vm.q)),
      cols: [[
          
          {
              field: 'deviceNo', title: '设备编号', fixed: 'left' ,align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.deviceNo);
              }
          },
          {
              field: 'alarmTypeStr', title: '告警类型', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.alarmTypeStr);
              }
          },
          {
              field: 'deviceKindStr', title: '设备类型', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.deviceKindStr);
              }
          },
          {
              field: 'alarmAddr', title: '告警地址', align: "center", minWidth: 200, templet: function (d) {
                return isEmpty(d.alarmAddr);
              }
          },
          {
              field: 'alarmTime', title: '告警时间', align: "center", minWidth: 200, templet: function (d) {
                return isEmpty(d.alarmTime);
              }
          },
          {
              field: 'orderNo', title: '关联订单', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.orderNo);
              }
          },
          {
              field: 'processingStatusStr', title: '处理状态', align: "center", minWidth: 200, templet: function (d) {
                  return isEmpty(d.processingStatusStr);
              }
          },
          {
            field: 'assignProcessingMan', title: '处理人', align: "center", minWidth: 200, templet: function (d) {
              return isEmpty(d.assignProcessingMan);
            }
        },
        {
          field: 'processingRemark', title: '处理说明', align: "center", minWidth: 200, templet: function (d) {
              return isEmpty(d.processingRemark);
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
}
function Base64() {
  // private property
  _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // 公共编码方法
  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
          enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
          enc4 = 64;
      }
      output = output +
      _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  // 公共解码方法
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // UTF-8编码的私有方法
  _utf8_encode = function (string) {
    // string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  // UTF-8解码的私有方法
  _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while ( i < utftext.length ) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}