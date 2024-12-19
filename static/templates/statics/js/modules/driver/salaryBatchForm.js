$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form','laydate'], function () {
    var form = layui.form;
    form.on('submit(save)', function () {
        vm.save();
        return false;
    });
    form.render();
});
  layui.laydate.render({ 
    elem: '#batchDistributionDate',
    type: 'datetime',
    value: new Date(),
    done: function (value, date, endDate) {
        vm.batch.distributionDate = value
    }
});
});

var vm = new Vue({
  el: '#rrapp',
  data: {
      batch:{
          distributionDate:null,
          ids:[]
      },
      closeBack:()=>{},
  },
  created: function(){
    this.$nextTick(()=>{
        var param = parent.layer.boxParams.boxParams;
        vm.batch.ids = param.data.ids;
        callback = param.callback;
        vm.closeBack= param.closeBack;
        vm.batch.distributionDate = new Date().format("yyyy-MM-dd hh:mm:ss")
    })
    },
  methods: {
    closePage(){
        vm.closeBack();
    },
    save: function () {
          if(!vm.batch.distributionDate){
              layer.msg('发放时间不能为空', {icon: 5});
              return false;
          }
          $.ajax({
              type: "POST",
              url: baseURL + 'driver/wages/batchDistribution',
              contentType: "application/json",
              data: JSON.stringify(vm.batch),
              success: function (r) {
                  if (r.code === 0) {
                      alert('操作成功', function (index) {
                        callback();
                      });
                  } else {
                      alert(r.msg);
                  }
              }
          });
      },
  }
});
