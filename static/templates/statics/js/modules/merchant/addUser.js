$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
    layui.table =  $.extend(layui.table, {config: {checkName: 'checked'}});
    layui.table.render({
      id: "grid",
      elem: '#grid',
      height:500,
      url: baseURL + "sys/user/list1",
      where: JSON.parse(JSON.stringify(vm.q)),
      cols: [[
        {type: 'checkbox', fixed: 'left'},
          {
              field: 'username', title: '用户名称', align: "center",templet: function (d) {
                  return isEmpty(d.username);
              }
          },
          {
              field: 'deptName', title: '所属公司/部门', align: "center", templet: function (d) {
                  return isEmpty(d.deptName);
              }
          },
          {
              field: 'roleNames', title: '角色', align: "center", templet: function (d) {
                  return isEmpty(d.roleNames);
              }
          },
          {
              field: 'mobile', title: '手机号码', align: "center",templet: function (d) {
                  return isEmpty(d.mobile);
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
        vm.tableList = res.data
        if( vm.userList.length){
          var ids= vm.userList.map(item=>item.userId)
			    //遍历集合
          layui.each(res.data, function(index,item){
            //将获取的选中行数据进行遍历
            //array.indexOf 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1
            if(ids.indexOf(''+item.userId+'')>-1 ){ 
						 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").prop('checked', true);
					 	 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").next().addClass('layui-form-checked');
            } 
          });
			  }
      }
    });
    layui.table.on('checkbox(grid)',function(obj){ 
      if(obj.type==='all'){
        if(obj.checked){
         vm.userList = vm.unique(vm.userList.concat(vm.tableList))
        }else{
          let ls = vm.tableList.map(item=>item.userId)
          vm.userList = vm.userList.filter(item=>!ls.includes(item.userId))
        }
      }else{
        if(obj.checked){
            let ls = vm.userList.map(item=>item.userId)
            if(!ls.includes(obj.data.userId)){
              vm.userList.push(obj.data)
            }
        }else{
          vm.userList = vm.userList.filter(item=>item.userId!=obj.data.userId)
        }
      }
    });
  });
  layui.form.render('checkbox');
});

var vm = new Vue({
  el: '#rrapp',
  data: {
      userList:[],
      tableList:[],
      q: {
        mixingCondition1:null
      },
      instructManagerStatus: [],
  },
  updated: function () {
      layui.form.render();
  },
  created(){
    this.initAllList()
  },
  methods: {
    initAllList(){
      $.ajax({
        type: "GET",
        url: baseURL + "configCenter/alarmNoticePerson/allList",
        success: function(r){
            if(r.code === 0){
              vm.userList = r.data;
            }
        }
      });
    },
    unique(arr1) {
      const res = new Map()
      return arr1.filter((item) => !res.has(item.userId) && res.set(item.userId, 1))
    },
      query: function () {
          vm.reload();
      },
      reset: function () {
        vm.q = {
          mixingCondition1:null
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
      },
      closePage() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
      },
      save:function () {
        let params = vm.userList.map(item=>{
          if(item.hasOwnProperty('enableFlag')){
            return item;
          }else{
            return {
              userId:item.userId,
              userName:item.username,
              deptId:item.deptId,
              deptName:item.deptName,
              roleName:item.roleNames,
              mobile:item.mobile,
              enableFlag:0,
            }
          }
        })
        $.ajax({
          type: "POST",
          url: baseURL + "configCenter/alarmNoticePerson/batchSave",
          contentType: "application/json",
          data:JSON.stringify(params),
          success: function(r){
            parent.vm.staffingReload();
            closePage();
          }
        });
      },
      delUser:function(item){
        if(vm.userList.length){
          vm.userList = vm.userList.filter(i=>i.userId!==item.userId)
          var ids= vm.userList.map(item=>item.userId)
			    //遍历集合
          layui.each(vm.tableList, function(index,i){
            //将获取的选中行数据进行遍历
            //array.indexOf 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1
            if(ids.indexOf(''+i.userId+'')>-1 ){ 
						 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").prop('checked', true);
					 	 $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").next().addClass('layui-form-checked');
            } else{
              $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").prop('checked', false);
              $("div[lay-id='grid'] tr[data-index=" + index + "] input[type='checkbox']").next().removeClass('layui-form-checked');
              // 取消选中
              $("input[type='checkbox'][name='layTableCheckbox']").prop('checked', false);
            }
          });
        }
      }
  }

});

function init(layui) {
  initTable(layui.table, layui.soulTable);
}



