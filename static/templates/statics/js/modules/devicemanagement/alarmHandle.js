
var vm = new Vue({
  el: '#rrapp',
  data: {
      q: {
        processingRemark: null,
      },
  },
  methods: {
      closePage: function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
      },
      save: function (data) {
        if(!vm.q.processingRemark){
          layer.msg(`处理说明不能为空`, {icon: 5});
          return false;
        }
        var param = parent.layer.boxParams.boxParams;
        $.ajax({
          type: "POST",
          url: baseURL + "alarmStatistics/processing",
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