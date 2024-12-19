$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/scheduleLog/list',
        cols: [[
            {field:'logId', width:100, title: '日志ID'},
            {field:'jobId', minWidth:100, title: '任务ID'},
            {field:'beanName', minWidth:100, title: 'bean名称'},
            {field:'methodName', minWidth:100, title: '方法名称'},
            {field:'params', minWidth:100, title: '参数'},
            {field: 'status', width:100, title: '状态',  align:'center', templet: function(d){
                    return d.status === 0 ?
                        '<span class="label label-success">成功</span>' :
                        '<span class="label label-danger pointer" onclick="vm.showError('+d.logId+')">失败</span>';
                }},
            {field:'times', minWidth:200, title: '耗时(单位：毫秒)'},
            {field:'createTime', width:170, title: '执行时间'}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
    });

});

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			jobId: null
		}
	},
	methods: {
		query: function () {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    jobId: vm.q.jobId
                }
            });
		},
		showError: function(logId) {
			$.get(baseURL + "sys/scheduleLog/info/"+logId, function(r){
				layer.open({
				  title:'失败信息',
				  closeBtn:0,
				  content: r.log.error
				});
			});
		}
	}
});

