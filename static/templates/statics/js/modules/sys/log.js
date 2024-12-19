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
        url: baseURL + 'sys/log/list',
        cols: [[
            {field:'id', width:50, title: 'ID',align:"center"},
            {field:'username', width:100, title: '用户名',align:"center"},
            {field:'operation', width:150, title: '用户操作',align:"center"},
            {field:'method', minWidth:100, title: '请求方法',align:"center"},
            {field:'params', minWidth:100, title: '请求参数',align:"center"},
            {field:'time', width:130, title: '执行时长(毫秒)',align:"center"},
            {field:'ip', width:120, title: 'IP地址',align:"center"},
            {field:'createDate', width:170, title: '创建时间',align:"center"}
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

});

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			key: null
		},
	},
	methods: {
		query: function () {
			vm.reload();
		},
        reset:function(){
		    vm.q.key=null;
        },
        exports: function () {
            var url = baseURL + 'sys/log/export';
            if(vm.q.key != null){
                url += '?key='+vm.q.key;
            }
            window.location.href = url;
        },
		reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    key: vm.q.key
                }
            });
		}
	}
});