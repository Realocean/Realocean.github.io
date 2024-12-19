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

      list: [],
      isClose: true,
      isFilter:false,
      pictureDiv: null,
      idCardName: null,
      idCardImgDiv: null,
      licenseImgDiv: null,
      driverImgDiv: null,
      bankCardImgDiv: null,
      personalDiv:false,
      enterpriseDiv:false,
      customerTypeStr:false
  },

  created: function(){
      var _this = this;
  },
  updated: function(){
      layui.form.render();
  },
  mounted: function () {
    this.initPage();
  },
  methods: {
      carDetailView: function (id, no) {
          var index = layer.open({
              title: "车辆详情",
              type: 2,
              content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
              success: function(layero,num){
                  var iframe = window['layui-layer-iframe'+num];
                  iframe.vm.initEditData(id);
              },
              end: function () {
                  layer.closeAll();
              }
          });
          layer.full(index);
      },
      orderDetailView: function (id, no, instanceId, processKey) {
          var param = {
              instanceId: instanceId,
              processKey: processKey,
              id: id
          };
          console.log(param);
          var index = layer.open({
              title: "查看",
              type: 2,
              boxParams: param,
              content: tabBaseURL + "modules/order/orderview.html",
              end: function () {
                  layer.close(index);
              }
          });
          layer.full(index);
      },
      initPage: function () {
          var id = window.localStorage.getItem("customerId");
          $.get(baseURL + "customer/info/" + id, function (res) {
              vm.list = res.data;
              showDetailData();
          })
      },
      tableFiledSkipOtherView: function (view) {
          var obj = view[0];
          var action = obj.className.trim();
          switch (action) {
              case 'carDetailView':{
                  var id = obj.attributes['carId'].value.trim();
                  vm.carDetailView(id);
                  break;
              }
              case 'orderDetailView':{
                  var id = obj.attributes['orderCarId'].value.trim();
                  vm.orderDetailView(id);
                  break;
              }
          }
      },

  }
});

function init(layui) {
  signingTable(layui.table, layui.soulTable);
  orderTable(layui.table, layui.soulTable);
  initClick();
}


function initClick() {
    $(document).on('click', '.orderDetailView,.carDetailView', function () {
        vm.tableFiledSkipOtherView($(this));
        // var obj = $(this)[0];
        // var id = obj.attributes['orderCarId'].value.trim();
        // vm.orderDetailView(id);
    });
    // $(document).on('click', '.carDetailView', function () {
    //     var obj = $(this)[0];
    //     var id = obj.attributes['carId'].value.trim();
    //     vm.carDetailView(id);
    // });
}


function signingTable(table, soulTable) {
  table.render({
      id: "signingTable",
      elem: '#signingTable',
      url: baseURL + 'alipay/alipaysign/queryList',
      where: {
          customerId: window.localStorage.getItem("customerId")
      },
      cols: [[
          {field:'signTime', title: '签约时间', minWidth:200, templet: function (d) {return isEmpty(d.signTime);}},
          {field:'status', title: '签约产品', minWidth:200, templet: function (d) {return '普通代扣'; }},
          {field:'status', title: '状态', minWidth:200, templet: function (d) {
                  if (d.status == 0 || d.status == 1 || d.status == 91 ) {
                      return '未签约';
                  } else if (d.status == 3) {
                      return '已签约';
                  }  else if (d.status == 4) {
                      return '已解约';
                  } else if (d.status == 2) {
                      return '签约失败';
                  }else {
                      return '--';
                  }
          }},
          {field:'timeUnsign', title: '解约时间', minWidth:150, templet: function (d) {
            return isEmpty(d.timeUnsign);
          }},
          {field:'remark', title: '失败原因', minWidth:200, templet: function (d) {   return isEmpty(d.reason);}}
      ]],
      page: true,
      limits: [5,10, 20, 50],
      limit: 5,
      autoColumnWidth: {
          init: false
      },
      done: function(res, curr, count){
          soulTable.render(this);
      }
  });
}
function orderTable(table, soulTable) {
    table.render({
        id: "orderTable",
        elem: '#orderTable',
        url: baseURL + 'customer/carWithholdOrderList',
        where: {
            customerId: window.localStorage.getItem("customerId")
        },
        cols: [[
            {
                field: 'orderCarCode', align: "center",minWidth:200, title: '车辆订单号',fixed: "left", templet: function (d) {
                    return '<span style="color:#3FACB3;cursor: pointer;" orderCarId="'+d.orderCarId+'" class="orderDetailView">'+isEmpty(d.orderCarCode)+'</span>';
                }
            },
            {
                field: 'carNo', align: "center", title: '车牌号',minWidth:150, templet: function (d) {
                    return isEmpty(d.carNo) == "--"? "--" : '<span style="color:#3FACB3;cursor: pointer;" carId="'+d.carId+'" class="carDetailView">'+d.carNo+'</span>';
                }
            },
            {
                field: 'rentType', align: "center", title: '订单类型', templet: function (d) {
                    return isEmpty(getRentTypeStr(d.rentType));

                }
            },
            {
                field: 'flowStatusShow', align: "center", title: '订单状态', templet: function (d) {
                    return isEmpty(d.flowStatusShow);
                }
            },
            {
                field: 'lessorName', align: "center", title: '出租方/售卖方', templet: function (d) {
                    return isEmpty(d.lessorName);
                }
            },
            {
                field: 'timeStartRent', align: "center", title: '租赁开始时间', templet: function (d) {
                    return isEmpty(d.timeStartRent);
                }
            },
            {
                field: 'timeFinishRent', align: "center", title: '租赁结束时间', templet: function (d) {
                    return isEmpty(d.timeFinishRent);
                }
            }

        ]],
        page: true,
        limits: [5,10, 20, 50],
        limit: 5
        , autoColumnWidth: {
            init: false
        }
        , done: function(res, curr, count){}
    });
}

function showDetailData() {
    if (vm.list.idCardImg == null && vm.list.bankCardImg == null
        && vm.list.driverImg == null && vm.list.licenseImg == null) {
        vm.pictureDiv = false;
    }else{
        vm.pictureDiv = true;
    }
    if (vm.list.idCardImg != null) {
        vm.idCardImgDiv = true;
        $("#idCardImg").attr("src", fileURL + vm.list.idCardImg);
        $("#idCardImgBack").attr("src", fileURL + vm.list.idCardImgBack);
    } else {
        vm.idCardImgDiv = false;
    }
    if (vm.list.bankCardImg != null) {
        vm.bankCardImgDiv = true;
        $("#bankCardImg").attr("src", fileURL + vm.list.bankCardImg);
    } else {
        vm.bankCardImgDiv = false;
    }
    if (vm.list.customerType == 1) { // 企业
        vm.idCardName = '法人身份证';
        if (vm.list.licenseImg != null) {
            vm.licenseImgDiv = true;
            $("#licenseImg").attr("src", fileURL + vm.list.licenseImg);
        } else {
            vm.licenseImgDiv = false;
        }
        $("#licenseDiv").show();
        $("#driverDiv").hide();
        vm.enterpriseDiv = true;
        vm.personalDiv = false;
    } else {	// 个人
        vm.idCardName = '身份证';
        if (vm.list.driverImg != null) {
            vm.driverImgDiv = true;
            $("#driverImg").attr("src", fileURL + vm.list.driverImg);
            $("#driverImgBack").attr("src", fileURL + vm.list.driverImgBack);
        } else {
            vm.driverImgDiv = false;
        }
        $("#driverDiv").show();
        $("#licenseDiv").hide();
        vm.enterpriseDiv = false;
        vm.personalDiv = true;
    }
}
