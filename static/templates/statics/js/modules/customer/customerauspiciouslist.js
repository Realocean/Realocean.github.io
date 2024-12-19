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
      subtips:null,
      preId:'ALIPAY_CUSTOMER_',
      q:{
        userName: null,
        phone: null,
        store: [],
        withholdSignStatus: null,
      },
      statusLst: [],
      statusIndex: 99,
      storeList:[
        {
          storeType:0,
          label:'门店一'
        },
        {
          storeType:1,
          label:'门店二'
        }
      ],
      isClose: true,
      isFilter:false
  },
  created: function(){
      this.getTypeList();
      var _this = this;
      $.ajaxSettings.async= false;
      $.get(baseURL + 'customeralipay/customeralipay/getStatusList', function (r) {
          _this.statusLst = r.statusLst;
      });
      $.ajaxSettings.async= true;
  },
  updated: function(){
      layui.form.render();
  },
  methods: {
      mouseout:function (){
          layer.close(vm.subtips);
          vm.subtips = null;
      },
      move:function (value) {
          var id="#"+vm.preId+value;
          var content = "";
          if(value == 99){
              content = "说明：吉祥租用户所有数据；";
          } else if(value == 0 || value == 1  || value == 91 ){
              content = "说明：未签约代扣协议用户数；";
          } else if(value == 3){
              content = "说明：已签约代扣协议用户数；";
          } else if(value == 4){
              content = "说明：已解约代扣协议用户数；";
          }else if(value == 2){
              content = "说明：签约失败代扣协议用户数；";
          }
          if(!vm.subtips){
              vm.openMsg(id,content,value);
          }
      },
      openMsg:function (id,content,value) {
          vm.subtips = layer.tips(content, id, {tips: 1});
      },
      view: function (data) {
        localStorage.setItem("customerId", data.customerId);
        let index = layer.open({
            title: "用户信息",
            type: 2,
            content: "./customerauspiciousview.html",
            end: function () {
                layer.closeAll();
            }
        });
        layer.full(index);
      },

      changeStatus: function (item, index) {
          vm.statusIndex = parseInt(item.key);
          vm.q.withholdSignStatus = vm.statusIndex;
          vm.reload();
      },

      // 获取车辆所属部门和公司
      getTypeList(){
          var vm = this;
          $.ajax({
              type: "GET",
              url: baseURL + "sys/dept/findStoreList",
              success: function (r) {
                  vm.storeList = r.deptList || []
                  vm.xmSelect = xmSelect.render({
                      el: '#typeSelect', 
                      data: vm.storeList.map(item=>{return {name:item.companyName,value:item.deptId}}),
                      tips:'请选择首访门店',
                      on: function(data){
                          if(data.arr.length){
                              vm.q.store = data.arr.map(item=>item.value);
                          }else{
                              vm.q.store = [];
                          }
                      }
                  })
              }
            });
          vm.typeList = [
              {
                  value:'1',
                  name:'断电报警'
              },
              {
                  value:'2',
                  name:'低电报警'
              }
          ];
         
      },
      query: function () {
          if(vm.q.store.length){
              vm.q.store = vm.q.store.join(",")
          }
          console.log("casdsasadas",vm.q.store)
          vm.reload();
      },
      reset: function () {
        vm.q = {
          userName: null,
          phone: null,
          store: [],
        }
        this.q.store = [] ;
        vm.xmSelect = xmSelect.render({
            el: '#typeSelect', 
            data: vm.storeList.map(item=>{return {name:item.companyName,value:item.deptId}}),
            tips:'请选择首访门店',
            on: function(data){
                if(data.arr.length){
                    vm.q.store = data.arr.map(item=>item.value);
                }else{
                    vm.q.store = [];
                }
            }
        })
        vm.reload();
      },
      exports: function () {
          window.location.href = urlParamByObj(baseURL + 'customeralipay/customeralipay/export', vm.q);
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
  initEventListener(layui);

}
function initEventListener(layui) {
  initChecked(layui.form);
}
function initChecked(form) {
  //客户类型
  layui.form.on('select(deptIdSelect)', function (data) {
    vm.q.deptId = data.value;
  });
}
function initTable(table, soulTable) {
      table.render({
          id: "gridid",
          elem: '#grid',
          url: baseURL + 'customeralipay/customeralipay/queryList',
          where: JSON.parse(JSON.stringify(vm.q)),
          cols: [[
              {title: '操作', width:80,minWidth: 80, templet: '#barTpl', fixed: "left", align: "center"},
              {field:'userName', title: '用户姓名', minWidth:200, templet: function (d) {return isEmpty(d.userName);}},
              {field:'phone', title: '联系电话', minWidth:200, templet: function (d) {return isEmpty(d.phone); }},
              // {field:'gender', title: '性别', minWidth:150, templet: function (d) {
              //         if (d.gender == 0) {
              //             return '未知';
              //         } else if (d.gender == 1) {
              //             return '男';
              //         }  else if (d.gender == 2) {
              //             return '女';
              //         }else {
              //             return '--';
              //         }
              // }},
              // {field:'registerCity', title: '注册城市', minWidth:150, templet: function (d) {
              //   return isEmpty(d.registerCity);
              // }},
              {field:'withholdSignStatus', minWidth:200, title: '签约状态', templet: function (d) {
                      if (d.withholdSignStatus == 0) {
                          return '未签约';
                      } else if (d.withholdSignStatus == 3) {
                          return '已签约';
                      }  else if (d.withholdSignStatus == 4) {
                          return '已解约';
                      } else if (d.withholdSignStatus == 2) {
                          return '签约失败';
                      }else {
                          return '--';
                      }
                  }},
              {field:'firstVisitStore', title: '首单门店', minWidth:200, templet: function (d) {return isEmpty(d.firstVisitStore);}},
              {field:'overdueTimes', title: '累计逾期次数', minWidth:200, templet: function (d) {return isEmpty(d.overdueTimes);}},
              {field:'timeCreate', title: '注册时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},

          ]],
          page: true,
          loading: true,
          limits: [10,20, 50, 100],
          limit: 10,
          autoColumnWidth: {
              init: true
          },
          done: function(res, curr, count){}
      });

  initTableEvent(table);
}
function initTableEvent(table) {
  table.on('tool(grid)', function(obj){
      var layEvent = obj.event,
          data = obj.data;
      if(layEvent === 'view'){
          vm.view(data);
      }
  });
}
