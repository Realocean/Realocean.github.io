$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });

  layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
    layui.form.on('radio(type)', function (data) {
      vm.q.type = data.value;
    });
     //日期时间选择器
    layui.laydate.render({
      elem: '#sbtime',
      type: 'time',
      done: function (value, date, endDate) {
        vm.q.sbtime = value;
      }
    });
    //日期时间选择器
        layui.laydate.render({
          elem: '#hxtime',
          type: 'time',
          done: function (value, date, endDate) {
            vm.q.sbtime = value;
          }
        });
    
  layui.form.on('select(intervalTime)', function (data) {
    vm.q.intervalTime = data.value;
  });
  layui.form.on('radio(type)', function (data) {
    vm.q.type = data.value;
    layui.form.render();
  });
  layui.form.on('select(c)', function (data) {
    vm.q.c = data.value;
    if(data.value&&data.value!=''&&Number(data.value)>1){
      this.tList = [{id:1,label:1}]
    }else{
      this.tList = []
      for(let i=1;i<=60;i++){
        this.tList.push({id:i,label:i})
      }
    }
    $("#t option").remove()
    let str = `<option value="">请选择天数</option>`
    this.tList.forEach((item, index) => {
      str+=`<option value=${item.id}>${item.label}天</option>`
    })
    $("#t").append(str);
    if(data.value&&data.value!=''&&Number(data.value)>1){
      $('#t').val(1);
    }else{
      $('#t').val(vm.q.t);
    }
    setTimeout(()=>{
      for(let i=1;i<=60;i++){
        //日期时间选择器
        layui.laydate.render({
          elem: `#test${i}`,
          type: 'time',
          done: function (value, date, endDate) {
            vm.q.timeList[i-1] = value;
          }
        });
       }
       layui.form.render();
    },800)
  })
  layui.form.on('select(t)', function (data) {
    vm.q.t = data.value;
    if(data.value&&data.value!=''&&Number(data.value)>1){
      this.cList = [{id:1,label:1}]
    }else{
      this.cList = []
      for(let i=1;i<=60;i++){
        this.cList.push({id:i,label:i})
      }
    }
    $("#c option").remove()
    let str = `<option value="">请选择次数</option>`
    this.cList.forEach((item, index) => {
      str+=`<option value=${item.id}>${item.label}次</option>`
    })
    $("#c").append(str);
    if(data.value&&data.value!=''&&Number(data.value)>1){
      $('#c').val(1);
    }else{
      $('#c').val(vm.q.c);
    }
    setTimeout(()=>{
      for(let i=1;i<=60;i++){
        //日期时间选择器
        layui.laydate.render({
         elem: `#test${i}`,
         type: 'time',
         done: function (value, date, endDate) {
           vm.q.timeList[i-1] = value;
         }
       });
       }
       layui.form.render();
    },800)
    layui.form.render();
  });
  layui.form.on('checkbox(updateTime)', function (data) {
    if(data.elem.checked){
      vm.q.updateTime.push(data.value);
    }else{
      vm.q.updateTime= vm.q.updateTime.filter(item=>item!==data.value);
    }
    
  });
  layui.form.render();
  });
})
var vm = new Vue({
  el: '#rrapp',
  data: {
      mode:0,
      intervalTime:[
        {
          id:'1h',
          label:'1小时'
        },
        {
          id:'2h',
          label:'2小时'
        },
        {
          id:'3h',
          label:'3小时'
        },
        {
          id:'4h',
          label:'4小时'
        },
        {
          id:'5h',
          label:'5小时'
        },
        {
          id:'6h',
          label:'6小时'
        },
        {
          id:'7h',
          label:'7小时'
        },
        {
          id:'8h',
          label:'8小时'
        },
        {
          id:'9h',
          label:'9小时'
        }, {
          id:'10h',
          label:'10小时'
        },
         {
          id:'11h',
          label:'11小时'
        },
        {
          id:'12h',
          label:'12小时'
        },
        {
          id:'1t',
          label:'1天'
        },
         {
          id:'2t',
          label:'2天'
        },
        {
          id:'3t',
          label:'3天'
        },
        {
          id:'4t',
          label:'4天'
        },
        {
          id:'5t',
          label:'5天'
        },
        {
          id:'6t',
          label:'6天'
        },

        {
          id:'7t',
          label:'7天'
        },
        {
          id:'8t',
          label:'8天'
        },
        {
          id:'9t',
          label:'9天'
        },
        {
          id:'10t',
          label:'10天'
        },
        {
          id:'11t',
          label:'11天'
        },
        {
          id:'12t',
          label:'12天'
        },
        {
          id:'13t',
          label:'13天'
        },
        {
          id:'14t',
          label:'14天'
        },

        {
          id:'15t',
          label:'15天'
        },
      ],
      q: {
        type:'0',
        t:null,
        c:null,
        sbtime:null,
        hxtime:null,
        timeList:[],
        updateTime:[],
        intervalTime:null
      },
      cList:[],
      tList:[],
      detail:{}
  },
  created () {
   
    var param = parent.layer.boxParams.boxParams;
    this.detail = param;
    for(let i=1;i<=60;i++){
      this.tList.push({id:i,label:i})
      this.cList.push({id:i,label:i})
    }
    let str1 = `<option value="">请选择天数</option>`
    this.tList.forEach((item, index) => {
      str1+=`<option value=${item.id}>${item.label}天</option>`
    })
    $("#t").append(str1);
    let str2 = `<option value="">请选择次数</option>`
    this.cList.forEach((item, index) => {
      str2+=`<option value=${item.id}>${item.label}次</option>`
    })
    $("#c").append(str2);
  },
  methods: {
    modeType(type){
      if(this.q.type==='0'){
        alert('请勾选自定义设置选项')
        return false
      }
      this.mode = type;
      layui.form.render();
    },
    closePage: function () {
      var index = parent.layer.getFrameIndex(window.name);
      parent.layer.close(index);
    },
      save: function (data) {
        $.ajax({
          type: "POST",
          url: baseURL + "",
          contentType: "application/json",
          data:JSON.stringify(vm.q),
          success: function(r){
            parent.vm.reload();
            layer.close(index);
          }
        });
      },
  }
})