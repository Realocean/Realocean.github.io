$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
  layui.use(['form', 'element', 'table','soulTable'], function () {
      soulTable = layui.soulTable;
      gridTable = layui.table.render({
      id: "gridid",
      elem: '#grid',
      url: baseURL + 'sys/notice/list',
      cols: [[
          {title: '操作',minWidth:200,width:200, templet: '#barTpl',fixed:'left',  align: "center"},
          {minWidth:60,align:"center", title: '序号',type:'numbers'},
          {field:'noticeType',minWidth:200,width:200, title: '公告类型',align:"center",templet: function (d) {
              let name = vm.noticeTypeList.filter(item=>item.value==d.noticeType)[0].name||''
              return name;
            }
          },
          {field:'versionNo',minWidth:200,width:200,  title: '版本号',align:"center"},
          {field:'releaseTime',minWidth:500,width:500, title: '发布时间',align:"center"},
          {field:'publisher',minWidth:200,width:200, minWidth:200,title: '发布人',align:"center"},
          {field:'noticeContent',minWidth:700,title: '公告内容',align:"center",templet: function (d) {
            return d.noticeContent.replace(/<[^>]+>/g, '').replace(/&nbsp;/ig, '').replace(/\s/g, '')||'--';
          }},
          {field:'remark', title: '备注',align:"center"},
      ]],
      page: true,
      loading: true,
      limits: [10,20, 50, 100],
      limit: 10,
      autoColumnWidth: {
          init: true
      },
      done: function (){
          soulTable.render(this);
      }
  });
  });
  //操作
  layui.table.on('tool(grid)', function(obj){
    var layEvent = obj.event,
        data = obj.data;
    if(layEvent === 'edit'){
        vm.update(data);
    } else if(layEvent === 'del'){
        var id = data.id;
        vm.del(id);
    }
  });
});

var vm = new Vue({
el:'#rrapp',
data:{
  noticeTypeList:[
    {
        name:'系统更新',
        value:'1'
    }
]
},
methods: {
      add(){
        var index = layer.open({
            title: "新增公告",
            type: 2,
            content: tabBaseURL + "modules/sys/noiceAdd.html",
            end: function(){
                layer.closeAll();
            }
        });
        layer.full(index);
      },
      update(data){
        var index = layer.open({
            title: "编辑公告",
            type: 2,
            boxParams:data,
            content: tabBaseURL + "modules/sys/noiceAdd.html",
            end: function(){
                layer.closeAll();
            }
        });
        layer.full(index);
      },
      del(id){
          confirm('确定要删除选中的记录？', function(){
            $.ajax({
                type: "POST",
                url: baseURL + "sys/notice/delete",
                contentType: "application/json",
                data: JSON.stringify([id]),
                success: function(r){
                    if(r.code == 0){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        });
      },
      query: function () {
        vm.reload();
      },
      reload: function (event) {
              layui.table.reload('gridid', {
                  page: {
                      curr: 1
                  },
                  where: {}
              });
      }
}
});