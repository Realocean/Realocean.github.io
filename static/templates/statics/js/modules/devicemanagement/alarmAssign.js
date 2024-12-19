$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
      layui.form.on('checkbox(syncSmsNotice)', function(obj){
        vm.q.syncSmsNotice = obj.elem.checked?1:0
    });
      layui.form.render();
  });
});
var vm = new Vue({
  el: '#rrapp',
  data: {
      q: {
        processingManPhone: null,
        processingMan:null,
        effectiveTime:null,
        syncSmsNotice:null,
        smsConentTemplate:null,
      },
      paramKey: "controler_center",
  },
  created () {
    this.initData()
  },
  methods: {
    initData(){
      let _this = this;
      $.get(baseURL + "/sys/tConfig/"+this.paramKey, function (r) {
          var controlCenter = JSON.parse(r.data.paramValue);
          _this.q.smsConentTemplate = controlCenter.alarmSmsTemplate
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