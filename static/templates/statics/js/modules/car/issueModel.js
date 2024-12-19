$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });

  layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
    layui.form.on('submit(save)', function () {
      vm.save();
      return false;
    });
    layui.form.on('submit(closePage)', function () {
      vm.closePage();
      return false;
    });
    
    layui.form.on('radio(type)', function (data) {
      vm.q.instructType = data.value;
    });
    layui.form.render();
  });
});
var vm = new Vue({
  el: '#rrapp',
  data: {
      q: {
        instructType:'1',
      },
      detail:{}
  },
  created () {
    var param = parent.layer.boxParams.boxParams;
    this.detail = param;
  },
  methods: {//
      save() {
        let _this = this;
        $.ajax({
          type: "POST",
          url: baseURL + "instructManager/send",
          contentType: "application/json",
          data:JSON.stringify({..._this.q,deviceNo:_this.detail.deviceNo,gpsAccountId:this.detail.gpsAccountId}),
          success: function(r){
            if(r.code===0){
              parent.vm.initDetail();
              _this.closePage();
            }else{
              alert(r.msg)
            }
          }
        });
      },
      closePage () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
      },
  }
});