$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        queryActivityCounnt();
        init(layui,1);
        layui.form.render();
    });
});



/****热门活动开始***/
/**
 * 热门活动vue对象
 */
var vm_hotevent = new Vue({
    el:'#hotEvent',
    data:{
        q:{
            //活动名称
            activityName: null,
            //跳转类型
            activityJumpType: null,
            //活动状态
            isEnable: null,
            //上架时间类型
            launchTimeType:null,
            //上架时间
            launchTimeStr:null,
            //下架时间类型
            offShelfTimeType:null,
            //下架时间
            offShelfTimeStr:null,
            //创建时间类型
            createTimeType:null,
            //创建时间
            createTimeStr:null,
            //活动类型
            activityType:1


        },
        headCount:{},
        isClose: true,
        isFilter:false
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var activityIds = [];
            $.each(list, function(index, item) {
                activityIds.push(item.activityId);
            });
            return activityIds;
        },
        query: function () {
            vm_hotevent.reload();
            queryActivityCounnt();
        },
        reset: function () {
                //活动名称
                vm_hotevent.q.activityName=null;
               //跳转类型
                vm_hotevent.q.activityJumpType=null;
                //活动状态
                vm_hotevent.q.isEnable=null;
                //上架时间类型
                vm_hotevent.q.launchTimeType=null;
                //上架时间
                vm_hotevent.q.launchTimeStr=null;
                //下架类型
                vm_hotevent.q.offShelfTimeType=null;
                //下架时间
                vm_hotevent.q.offShelfTimeStr=null;
                //创建时间类型
                vm_hotevent.q.createTimeType=null;
                //创建时间
                vm_hotevent.q.createTimeStr=null;

                $('div[type="launchTimeType"]>div').removeClass('task-content-box-tab-child-active');
                $('div[type="offShelfTimeType"]>div').removeClass('task-content-box-tab-child-active');
                $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
        },
        add: function(){
            var param = {
                callback: function(activityType){
                   /* 活动类型(1.热门活动，2.Banner活动，3.合作加盟宣传，4.售后服务宣传)*/
                    if(activityType==1){
                        var index = layer.open({
                            title: "新增热门活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/hoteventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==2){
                        var index = layer.open({
                            title: "Banner活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/bannereventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==3){
                        var index = layer.open({
                            title: "合作加盟宣",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/cooperationedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==4){
                        var index = layer.open({
                            title: "售后服务宣传",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/afterserviceedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                }
            };
            var index = layer.open({
                type: 2,
                title: '选择活动类型',
                area: ['800px', '400px'],
                boxParams: param,
                content: tabBaseURL + 'modules/activity/activityselect.html',
                end: function () {
                    layer.close(index);
                }
            });
        },
        del: function (data) {
            confirm('确定要将该活动删除吗，删除之后将无法恢复？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/delete/"+data.activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_hotevent.reload();
                                queryActivityCounnt();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        hoteventUpdate: function(data){
            $.ajax({
                type: "POST",
                url: baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType,
                contentType: "application/json",
                data: {},
                success: function(r){
                    var index = layer.open({
                        title: "修改",
                        type: 2,
                        boxParams: data.activityType,
                        content: tabBaseURL + "modules/activity/hoteventsedit.html",
                        success:function (){
                            var iframe = window['layui-layer-iframe' + index];
                            iframe.sendData(r.activity);
                        },
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                }
            });
        },
        view: function (data) {
            $.get(baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType, function(r){
                var param = {
                    data:r.activity
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/activity/activityview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        start:function (activityId){
            confirm('确认要启用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/start/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_hotevent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });

        },
        stop:function (activityId){
            confirm('确认要禁用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/stop/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_hotevent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'activity/activity/export', vm_hotevent.q);
        },
        reload: function (event) {
            layui.table.reload('hoteventGrid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm_hotevent.q))
            });
        },
        changeStatus: function(status){
            removeClass();
            if (status == 1) {
                $("#field1").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    init(layui,1);
                    layui.form.render();
                });
            } else if (status == 2) {
                $("#field2").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    init(layui,2);
                    layui.form.render();
                });
            }else if (status == 3) {
                $("#field3").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    init(layui,3);
                    layui.form.render();
                });
            }else if (status == 4) {
                $("#field4").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    init(layui,4);
                    layui.form.render();
                });
            }
        },
    }
});

/**
 * 热门活动表格
 * @param table
 * @param soulTable
 */
function initHoteventTable(table, soulTable) {
    table.render({
        id: "hoteventGrid",
        elem: '#hoteventGrid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'activity/activity/queryList',
        where: JSON.parse(JSON.stringify(vm_hotevent.q)),
        cols: [[
            {title: '操作', width:150, minWidth:150, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'activityName', title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityTypeShow', title: '活动类型', minWidth:200, templet: function (d) {return isEmpty(d.activityTypeShow);}},
            {field:'activityName', title: '活动门店', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityName', title: '开始时间', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityName', title: '结束时间', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityName', title: '秒杀价格/元', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityName', title: '实际剩余库存数', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityName', title: '活动创建部门', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityName', title: '活动创建部门', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},

            /*


            {field:'sort', title: '排名位置', minWidth:200, templet: function (d) {return isEmpty(d.sort);}},
            {field:'isEnableShow', title: '活动状态', minWidth:200, templet: function (d) {return isEmpty(d.isEnableShow);}},
            {field:'activityJumpTypeShow', title: '活动跳转类型', minWidth:200, templet: function (d) {
                // 活动跳转类型(1.外部链接，2.内部跳转，3.产品跳转)
                if(d.activityJumpType==3){
                    if(d.schemeTypeShow!=null){
                        return  d.activityJumpTypeShow+"/"+d.schemeTypeShow;
                    }
                 }else {
                    return isEmpty(d.activityJumpTypeShow);
                }
            }},
            {field:'launchTime', title: '上架时间', minWidth:200, templet: function (d) {return isEmpty(d.launchTime);}},
            {field:'offShelfTime', title: '下架时间', minWidth:200, templet: function (d) {return isEmpty(d.offShelfTime);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'creater', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.creater);}},

*/
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="hoteventGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initHoteventTableEvent(table);
  //  initTableEditListner(table);
}
/**
 * 热门活动操作监听方法
 * @param table
 */
function initHoteventTableEvent(table) {
    table.on('tool(hoteventGrid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm_hotevent.hoteventUpdate(data);
        } else if(layEvent === 'del'){
            vm_hotevent.del(data);
        } else if(layEvent === 'view'){
            vm_hotevent.view(data);
        }else if(layEvent === 'start'){
            vm_hotevent.start(data.activityId);
        }else if(layEvent === 'stop'){
            vm_hotevent.stop(data.activityId);
        }
    });
}
/**
 * 热门活动下拉监听方法
 * @param table
 */
function initHoteventListner(layui) {
    //活动跳转类型
    layui.form.on('select(activityJumpType)', function (data) {
        vm_hotevent.q.activityJumpType = data.value;
    });

    layui.form.on('select(isEnable)', function (data) {
        vm_hotevent.q.isEnable = data.value;
    });

}

/***
 *单击事件绑定
 */
function initHoteventClick() {
    //上架时间
    $('div[type="launchTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="launchTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm_hotevent.q, "launchTimeStr", '');
        vm_hotevent.q.launchTimeType=value;
    });

    //下架时间
    $('div[type="offShelfTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="offShelfTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm_hotevent.q, "offShelfTimeStr", '');
        vm_hotevent.q.offShelfTimeType=value;
    });

    //创建时间
    $('div[type="createTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm_hotevent.q, "createTimeStr", '');
        vm_hotevent.q.createTimeType=value;
    });
}

/**
 * 热门活动日期控件监听
 * @param laydate
 */
function initHoteventDate(laydate) {
    //上架时间
    laydate.render({
        elem : '#launchTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="launchTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm_hotevent.q.launchTimeStr=value;
            vm_hotevent.q.launchTimeType=null;
        }
    });

    //下架时间
    laydate.render({
        elem : '#offShelfTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="offShelfTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm_hotevent.q.offShelfTimeStr=value;
            vm_hotevent.q.offShelfTimeType=null;
        }
    });

    //创建时间
    laydate.render({
        elem : '#createTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm_hotevent.q.createTimeStr=value;
            vm_hotevent.q.createTimeType=null;
        }
    });

}
/**
 * 热门活动页面初始化数据加载
 */
function initHoteventData(){}
/****热门活动结束***/


/****banner活动开始***/
/**
 * banner活动vue对象
 */
var vm_bannerevent = new Vue({
    el:'#bannerEvent',
    data:{
        q:{
            //活动名称
            activityName: null,
            //跳转类型
            activityJumpType: null,
            //活动状态
            isEnable: null,
            //上架时间类型
            launchTimeType:null,
            //上架时间
            launchTimeStr:null,
            //下架时间类型
            offShelfTimeType:null,
            //下架时间
            offShelfTimeStr:null,
            //创建时间类型
            createTimeType:null,
            //创建时间
            createTimeStr:null,
            //活动类型
            activityType:2
        },
        isClose: true,
        isFilter:false
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var activityIds = [];
            $.each(list, function(index, item) {
                activityIds.push(item.activityId);
            });
            return activityIds;
        },
        query: function () {
            vm_bannerevent.reload();
            queryActivityCounnt();
        },
        reset: function () {
                //活动名称
                vm_bannerevent.q.activityName=null;
                //跳转类型
                vm_bannerevent.q.activityJumpType=null;
                //活动状态
                vm_bannerevent.q.isEnable=null;
                //上架时间类型
                vm_bannerevent.q.launchTimeType=null;
                //上架时间
                vm_bannerevent.q.launchTimeStr=null;
                //下架类型
                vm_bannerevent.q.offShelfTimeType=null;
                //下架时间
                vm_bannerevent.q.offShelfTimeStr=null;
                //创建时间类型
                vm_bannerevent.q.createTimeType=null;
                //创建时间
                vm_bannerevent.q.createTimeStr=null;
                $('div[type="bannerLaunchTimeType"]>div').removeClass('task-content-box-tab-child-active');
                $('div[type="bannerOffShelfTimeType"]>div').removeClass('task-content-box-tab-child-active');
                $('div[type="bannerCreateTimeType"]>div').removeClass('task-content-box-tab-child-active');
        },
        add: function(){
            var param = {
                callback: function(activityType){
                    /* 活动类型(1.热门活动，2.Banner活动，3.合作加盟宣传，4.售后服务宣传)*/
                    if(activityType==1){
                        var index = layer.open({
                            title: "新增热门活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/hoteventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==2){
                        var index = layer.open({
                            title: "Banner活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/bannereventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==3){
                        var index = layer.open({
                            title: "合作加盟宣",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/cooperationedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==4){
                        var index = layer.open({
                            title: "售后服务宣传",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/afterserviceedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                }
            };
            var index = layer.open({
                type: 2,
                title: '选择活动类型',
                area: ['800px', '400px'],
                boxParams: param,
                content: tabBaseURL + 'modules/activity/activityselect.html',
                end: function () {
                    layer.close(index);
                }
            });


            /* var param = {
                 data:{}
             };
             var index = layer.open({
                 title: "新增",
                 type: 2,
                 boxParams: param,
                 content: tabBaseURL + "modules/activity/activityedit.html",
                 end: function () {
                     layer.close(index);
                 }
             });
             layer.full(index);*/
        },
        del: function (data) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/delete/"+data.activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_bannerevent.reload();
                                queryActivityCounnt();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        update: function (data) {
            $.ajax({
                type: "POST",
                url: baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType,
                contentType: "application/json",
                data: {},
                success: function(r){
                    var index = layer.open({
                        title: "修改",
                        type: 2,
                        boxParams: data.activityType,
                        content: tabBaseURL + "modules/activity/bannereventsedit.html",
                        success:function (){
                            var iframe = window['layui-layer-iframe' + index];
                            iframe.sendData(r.activity);
                        },
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                }
            });

        },
        view: function (data) {
            $.get(baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType, function(r){
                var param = {
                    data:r.activity
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/activity/activityview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        start:function (activityId){
            confirm('确认要启用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/start/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_bannerevent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        stop:function (activityId){
            confirm('确认要禁用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/stop/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_bannerevent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'activity/activity/export', vm_bannerevent.q);
        },
        reload: function (event) {
            layui.table.reload('bannerEventGrid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm_bannerevent.q))
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }

    }
});



/**
 * banner活动表格
 * @param table
 * @param soulTable
 */
function initBannerEnvetTable(table, soulTable) {
    table.render({
        id: "bannerEventGrid",
        elem: '#bannerEventGrid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'activity/activity/queryList',
        where: JSON.parse(JSON.stringify(vm_bannerevent.q)),
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'activityTypeShow', title: '活动类型', minWidth:200, templet: function (d) {return isEmpty(d.activityTypeShow);}},
            {field:'activityName', title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'sort', title: '排名位置', minWidth:200, templet: function (d) {return isEmpty(d.sort);}},
            {field:'isEnableShow', title: '活动状态', minWidth:200, templet: function (d) {return isEmpty(d.isEnableShow);}},
            {field:'activityJumpTypeShow', title: '活动跳转类型', minWidth:200, templet: function (d) {
                    // 活动跳转类型(1.外部链接，2.内部跳转，3.产品跳转)
                    if(d.activityJumpType==3){
                        if(d.schemeTypeShow!=null){
                            return  d.activityJumpTypeShow+"/"+d.schemeTypeShow;
                        }
                    }else {
                        return isEmpty(d.activityJumpTypeShow);
                    }
            }},
            {field:'launchTime', title: '上架时间', minWidth:200, templet: function (d) {return isEmpty(d.launchTime);}},
            {field:'offShelfTime', title: '下架时间', minWidth:200, templet: function (d) {return isEmpty(d.offShelfTime);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'creater', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.creater);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="bannerEventGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

   // initHoteventTableEvent(table);
   // initBannerTableEditListner(table);
}
/**
 * banner活动操作监听方法
 * @param table
 */
function initBannerEventTableEvent(table) {
    table.on('tool(bannerEventGrid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm_bannerevent.update(data);
        } else if(layEvent === 'del'){
            vm_bannerevent.del(data);
        } else if(layEvent === 'view'){
            vm_bannerevent.view(data);
        }else if(layEvent === 'start'){
            vm_bannerevent.start(data.activityId);
        }else if(layEvent === 'stop'){
            vm_bannerevent.stop(data.activityId);
        }
    });
}
/**
 * banner活动下拉监听方法
 * @param layui
 */
function initBannerEnvetListner(layui) {
    //活动跳转类型
    layui.form.on('select(bannerActivityJumpType)', function (data) {
        vm_bannerevent.q.activityJumpType = data.value;
    });

    layui.form.on('select(bannerIsEnable)', function (data) {
        vm_bannerevent.q.isEnable = data.value;
    });

}
/**
 * banner活动日期控件监听
 * @param laydate
 */
function initBannerEnvetDate(laydate) {
    //上架时间
    laydate.render({
        elem : '#bannerLaunchTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="bannerLaunchTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm_bannerevent.q.launchTimeStr=value;
            vm_bannerevent.q.launchTimeType=null;
        }
    });

    //下架时间
    laydate.render({
        elem : '#bannerOffShelfTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="bannerOffShelfTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm_bannerevent.q.offShelfTimeStr=value;
            vm_bannerevent.q.offShelfTimeType=null;
        }
    });

    //创建时间
    laydate.render({
        elem : '#bannerCreateTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="bannerCreateTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm_bannerevent.q.createTimeStr=value;
            vm_bannerevent.q.createTimeType=null;
        }
    });

}
/**
 * banner活动页面初始化数据加载
 */
function initBannerEnvetData(){}

/***
 *单击事件绑定
 */
function initBannerClick() {
    //上架时间
    $('div[type="bannerLaunchTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="bannerLaunchTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm_bannerevent.q, "launchTimeStr", '');
        vm_bannerevent.q.launchTimeType=value;
    });

    //下架时间
    $('div[type="bannerOffShelfTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="bannerOffShelfTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm_bannerevent.q, "offShelfTimeStr", '');
        vm_bannerevent.q.offShelfTimeType=value;
    });

    //创建时间
    $('div[type="bannerCreateTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="bannerCreateTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm_bannerevent.q, "createTimeStr", '');
        vm_bannerevent.q.createTimeType=value;
    });
}
/****banner活动结束***/


/*****合作加盟宣传列表开始*****/
var vm_cooperationEvent = new Vue({
    el:'#cooperationEvent',
    data:{
        isClose: true,
        q:{
            activityType:3
        }


    },
    created: function(){
        var _this = this;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var activityIds = [];
            $.each(list, function(index, item) {
                activityIds.push(item.activityId);
            });
            return activityIds;
        },
        query: function () {
            vm_cooperationEvent.reload();
            queryActivityCounnt();
        },
        /*add: function(){
            var param = {
                callback: function(activityType){
                    /!* 活动类型(1.热门活动，2.Banner活动，3.合作加盟宣传，4.售后服务宣传)*!/
                    if(activityType==1){
                        var index = layer.open({
                            title: "新增热门活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/hoteventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==2){
                        var index = layer.open({
                            title: "Banner活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/bannereventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==3){
                        var index = layer.open({
                            title: "合作加盟宣",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/cooperationedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==4){
                        var index = layer.open({
                            title: "售后服务宣传",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/afterserviceedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                }
            };
            var index = layer.open({
                type: 2,
                title: '选择活动类型',
                area: ['800px', '400px'],
                boxParams: param,
                content: tabBaseURL + 'modules/activity/activityselect.html',
                end: function () {
                    layer.close(index);
                }
            });
        },*/
        del: function (data) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/delete/"+data.activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_cooperationEvent.reload();
                                queryActivityCounnt();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        update: function (data) {
            $.get(baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType, function(r){
                var param = {
                    data:r.activity
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: data.activityType,
                    content: tabBaseURL + "modules/activity/cooperationedit.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.activity);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        view: function (data) {
            $.get(baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType, function(r){
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: data.activityType,
                    content: tabBaseURL + "modules/activity/cooperationview.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.activity);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        start:function (activityId){
            confirm('确认要启用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/start/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_cooperationEvent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        stop:function (activityId){
            confirm('确认要禁用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/stop/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_cooperationEvent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'activity/activity/export', vm_bannerevent.q);
        },
        reload: function (event) {
            layui.table.reload('cooperationEventGrid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm_cooperationEvent.q))
            });
        },
    }
});
/**
 * 数据表格加载
 * @param table
 * @param soulTable
 */
function initCooperationEventTable(table, soulTable) {
    table.render({
        id: "cooperationEventGrid",
        elem: '#cooperationEventGrid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'activity/activity/queryList',
        where: JSON.parse(JSON.stringify(vm_cooperationEvent.q)),
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'activityTypeShow', title: '活动类型', minWidth:200, templet: function (d) {return isEmpty(d.activityTypeShow);}},
            {field:'remarks', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.remarks);}},
            {field:'isEnableShow', title: '活动状态', minWidth:200, templet: function (d) {return isEmpty(d.isEnableShow);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'creater', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.creater);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="cooperationEventGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

}

/**
 * 表格数据按钮操作
 * @param table
 */
function initCooperationEventTableEvent(table) {
    table.on('tool(cooperationEventGrid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm_cooperationEvent.update(data);
        } else if(layEvent === 'del'){
            vm_cooperationEvent.del(data);
        } else if(layEvent === 'view'){
            vm_cooperationEvent.view(data);
        }else if(layEvent === 'start'){
            vm_cooperationEvent.start(data.activityId);
        }else if(layEvent === 'stop'){
            vm_cooperationEvent.stop(data.activityId);
        }
    });
}

/*****合作加盟宣传列表结束*****/


/***** 售后服务宣传列表开始 *****/
var vm_afterserviceEvent = new Vue({
    el:'#afterserviceEvent',
    data:{
        isClose: true,
        q:{
            activityType:4
        }

    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var activityIds = [];
            $.each(list, function(index, item) {
                activityIds.push(item.activityId);
            });
            return activityIds;
        },
        query: function () {
            vm_afterserviceEvent.reload();
            queryActivityCounnt();
        },
       /* reset: function () {
            //活动名称
            vm_bannerevent.q.bannerActivityName=null;
            //跳转类型
            vm_bannerevent.q.bannerActivityJumpType=null;
            //活动状态
            vm_bannerevent.q.bannerIsEnable=null;
            //上架时间类型
            vm_bannerevent.q.bannerLaunchTimeType=null;
            //上架时间
            vm_bannerevent.q.bannerLaunchTimeStr=null;
            //下架时间类型
            vm_bannerevent.q.bannerOffShelfTimeType=null;
            //下架时间
            vm_bannerevent.q.bannerOffShelfTimeStr=null;
            //创建时间类型
            vm_bannerevent.q.bannerCreateTimeType=null;
            //创建时间
            vm_bannerevent.q.bannerCreateTimeStr=null;

            $('div[type="bannerLaunchTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="bannerOffShelfTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="bannerCreateTimeType"]>div').removeClass('task-content-box-tab-child-active');
        },*/
        /*add: function(){
            var param = {
                callback: function(activityType){
                    /!* 活动类型(1.热门活动，2.Banner活动，3.合作加盟宣传，4.售后服务宣传)*!/
                    if(activityType==1){
                        var index = layer.open({
                            title: "新增热门活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/hoteventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==2){
                        var index = layer.open({
                            title: "Banner活动",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/bannereventsedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==3){
                        var index = layer.open({
                            title: "合作加盟宣",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/cooperationedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                    if(activityType==4){
                        var index = layer.open({
                            title: "售后服务宣传",
                            type: 2,
                            boxParams: activityType,
                            content: tabBaseURL + "modules/activity/afterserviceedit.html",
                            end: function () {
                                layer.close(index);
                            }
                        });
                        layer.full(index);
                    }
                }
            };
            var index = layer.open({
                type: 2,
                title: '选择活动类型',
                area: ['800px', '400px'],
                boxParams: param,
                content: tabBaseURL + 'modules/activity/activityselect.html',
                end: function () {
                    layer.close(index);
                }
            });
        },*/
        del: function (data) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/delete/"+data.activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_afterserviceEvent.reload();
                                queryActivityCounnt();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        update: function (data) {
            $.get(baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType, function(r){
                var param = {
                    data:r.activity
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: data.activityType,
                    content: tabBaseURL + "modules/activity/afterserviceedit.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.activity);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        view: function (data) {
            $.get(baseURL + "activity/activity/info/"+data.activityId+"/"+data.activityType, function(r){
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: data.activityType,
                    content: tabBaseURL + "modules/activity/afterserviceview.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.activity);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        start:function (activityId){
            confirm('确认要启用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/start/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_afterserviceEvent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        stop:function (activityId){
            confirm('确认要禁用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activity/activity/stop/"+activityId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm_afterserviceEvent.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'activity/activity/export', vm_bannerevent.q);
        },
        reload: function (event) {
            layui.table.reload('afterserviceEventGridId', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm_afterserviceEvent.q))
            });
        },
    }
});
/**
 * 数据表格加载
 * @param table
 * @param soulTable
 */
function initAfterserviceEventTable(table, soulTable) {
    table.render({
        id: "afterserviceEventGridId",
        elem: '#afterserviceEventGrid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'activity/activity/queryList',
        where: JSON.parse(JSON.stringify(vm_afterserviceEvent.q)),
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'activityTypeShow', title: '活动类型', minWidth:200, templet: function (d) {return isEmpty(d.activityTypeShow);}},
            {field:'remarks', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.remarks);}},
            {field:'isEnableShow', title: '活动状态', minWidth:200, templet: function (d) {return isEmpty(d.isEnableShow);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'creater', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.creater);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="afterserviceEventGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

}

/**
 * 表格数据按钮操作
 * @param table
 */
function initAfterserviceEventTableEvent(table) {
    table.on('tool(afterserviceEventGrid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm_afterserviceEvent.update(data);
        } else if(layEvent === 'del'){
            vm_afterserviceEvent.del(data);
        } else if(layEvent === 'view'){
            vm_afterserviceEvent.view(data);
        }else if(layEvent === 'start'){
            vm_afterserviceEvent.start(data.activityId);
        }else if(layEvent === 'stop'){
            vm_afterserviceEvent.stop(data.activityId);
        }
    });
}
/*****售后服务宣传列表结束*****/


/**
 * 列表表头数据统计
 */
function queryActivityCounnt(){
    $.ajax({
        type: "POST",
        url: baseURL + "activity/activity/queryActivityCount",
        contentType: "application/json",
        data: {},
        success: function(r){
            vm_hotevent.headCount=r.activityCountVO;
        }
    });
}


/**
 * 页面初始化
 * @param layui
 * @param type
 */
function init(layui,type) {

    if(type == '1'){   //热门活动
        vm_hotevent.reset();
        //相关初始化数据加载
        initHoteventData();
        //初始化数据表格
        initHoteventTable(layui.table, layui.soulTable);
        //初始化日期
        initHoteventDate(layui.laydate);
        //初始化监听事件
        initHoteventListner(layui);
        //单击事件监听
        initHoteventClick();

        $("#field1").addClass("flex active");
        $("#hotEventDiv").show();
        $("#bannerEventDiv").hide();
        $("#cooperationEvent").hide();
        $("#afterserviceEvent").hide();

    } else if(type == '2'){   //banner活动
        vm_bannerevent.reset();
        //相关初始化数据加载
        initBannerEnvetData();
        //初始化数据表格
        initBannerEnvetTable(layui.table, layui.soulTable);
        initBannerEventTableEvent(layui.table);
        //初始化日期
        initBannerEnvetDate(layui.laydate);
        //初始化监听事件
        initBannerEnvetListner(layui);
        //单击事件监听
        initBannerClick();
        $("#field2").addClass("flex active");
        $("#hotEventDiv").hide();
        $("#bannerEventDiv").show();
        $("#cooperationEvent").hide();
        $("#afterserviceEvent").hide();

    }else if(type == '3'){ //合作加盟宣传列表
        //初始化数据表格
        initCooperationEventTable(layui.table, layui.soulTable);
        initCooperationEventTableEvent(layui.table);
        $("#field3").addClass("flex active");
        $("#hotEventDiv").hide();
        $("#bannerEventDiv").hide();
        $("#cooperationEvent").show();
        $("#afterserviceEvent").hide();

    }else if(type == '4'){ //售后服务宣传列表
        //初始化数据表格
        initAfterserviceEventTable(layui.table, layui.soulTable);
        initAfterserviceEventTableEvent(layui.table);
        $("#field4").addClass("flex active");
        $("#hotEventDiv").hide();
        $("#bannerEventDiv").hide();
        $("#cooperationEvent").hide();
        $("#afterserviceEvent").show();
    }

}


function removeClass(){
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
    $("#field3").removeClass("active");
    $("#field4").removeClass("active");
}

/***
 * 新增子页面调用
 * @param type
 */
function addClass(type){
    if(type==1){
        $("#field1").addClass("flex active");
        layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
            init(layui,1);
            layui.form.render();
        });

    }else if(type==2){
        $("#field2").addClass("flex active");
        layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
            init(layui,2);
            layui.form.render();
        });
    }else if(type==3){
        $("#field3").addClass("flex active");
        layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
            init(layui,3);
            layui.form.render();
        });
    }else if(type==4){
        $("#field4").addClass("flex active");
        layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
            init(layui,4);
            layui.form.render();
        });
    }
}