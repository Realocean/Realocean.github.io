$(function () {
    vm.initTableCols(5);
    initSearch();

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.render();
    });

    //跟进人
    layui.form.on('select(operatorIdInfor)', function(data){
        vm.q.sysUserId = data.value;
    });
    //线索状态
    layui.form.on('select(cluesState)', function(data){
        vm.q.cluesState = data.value;
    });
    //客户类型
    layui.form.on('select(customerType)', function(data){
        vm.q.customerType = data.value;
    });

    // 操作：0、预约租车/购车 1、运力合作 2、预约试驾 3、活动咨询 4、合作加盟 5、线索
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'transfer'){
            vm.transfer(data.cluesId);
        } else if(layEvent === 'rentview'){// 详情
            vm.view(data.cluesId,0);
        } else if(layEvent === 'viewHybm'){
            vm.view(data.cluesId,1);
        } else if(layEvent === 'viewYysj'){
            vm.view(data.cluesId,2);
        } else if(layEvent === 'viewHdzx'){
            vm.view(data.cluesId,3);
        } else if(layEvent === 'viewHzjm'){
            vm.view(data.cluesId,4);
        } else if(layEvent === 'view'){
            vm.view(data.cluesId,5);
        } else if(layEvent === 'rentCall'){// 拨打电话
            vm.confirmCall(data.cluesId,0);
        } else if(layEvent === 'hybmCall'){
            vm.confirmCall(data.cluesId,1);
        } else if(layEvent === 'yysjCall'){
            vm.confirmCall(data.cluesId,2);
        } else if(layEvent === 'hdzxCall'){
            vm.confirmCall(data.cluesId,3);
        } else if(layEvent === 'hzjmCall'){
            vm.confirmCall(data.cluesId,4);
        } else if(layEvent === 'dealRentBz'){// 处理备注
            vm.dealRemark(data.cluesId,0);
        } else if(layEvent === 'dealHybmBz'){
            vm.dealRemark(data.cluesId,1);
        } else if(layEvent === 'dealYysjBz'){
            vm.dealRemark(data.cluesId,2);
        } else if(layEvent === 'dealHdzxBz'){
            vm.dealRemark(data.cluesId,3);
        } else if(layEvent === 'dealHzjmBz'){
            vm.dealRemark(data.cluesId,4);
        } else if(layEvent === 'follow_clues'){
            vm.follow_clues(data);
        } else if(layEvent === 'transfer_clues'){
            vm.transfer_clues(data);
        } else if(layEvent === 'view_clues'){
            vm.view_clues(data);
        } else if(layEvent === 'edit_clues'){
            vm.edit_clues(data);
        }else if(layEvent === 'yysjArrival'){
            vm.dealArrival(data.cluesId);
        }else if(layEvent === 'delete'){
            vm.delete(data.cluesId);
        }
    });

    layui.upload.render({
        elem: '#imports',
        url: baseURL + 'cluesnew/clues/imports',
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        before: function (obj) {
            layer.msg('数据导入中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (res) {
            layer.close(layer.msg());
            if (parseInt(res.code) === 0) {
                vm.importSuccess(res);
            } else {
                layer.msg('文件解析失败:' + res.msg, {icon: 5});
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
        }
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            statusType:5,
            searchCar:null
        },
        isFilter: false,
        cols:[],
        statusIndex: 5,
        usrLst: [],
        statusLst: [],
        carTreeList:[],
        lessorLst:[],
        dataLength:0
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async= false;
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });

        $.get(baseURL + 'clues/clues/getClusStatusList', function (r) {
            _this.statusLst = r.statusLst;
        });

        $.get(baseURL + 'sys/dept/listPre', function (r) {
            _this.lessorLst = r.deptList;
        });

        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            _this.carTreeList = r.carTreeVoList;
        });
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        follow_clues: function (data) {// 跟进
            $.get(baseURL + "cluesnew/clues/info/"+data.cluesId, function(r){
                var param = {
                    data:r.clues
                };
                var index = layer.open({
                    title: "客户跟进",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesfollow.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        transfer_clues: function (data) {// 转移
            $.get(baseURL + "cluesnew/clues/info/"+data.cluesId, function(r){
                var param = {
                    data:r.clues
                };
                var index = layer.open({
                    title: "客户转移",
                    type: 2,
                    boxParams: param,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/cluesnew/cluestransfer.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                // layer.full(index);
            });
        },
        edit_clues: function (data) {// 编辑
            $.get(baseURL + "cluesnew/clues/info/"+data.cluesId, function(r){
                var param = {
                    data:r.clues
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        view_clues: function (data) {// 详情
            $.get(baseURL + "cluesnew/clues/info/"+data.cluesId, function(r){
                var param = {
                    data:r.clues
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        importSuccess: function (map) {
            var btn = [];
            var isdownxls = map.allCount != null && Number(map.allCount || 1) !== Number(map.successCount || 0);
            if (isdownxls) {
                btn.push('下载失败数据');
            }
            btn.push('关闭');
            var index = layer.confirm(map.message, {
                btn: btn
            }, function () {
                if (isdownxls) {
                    var form = $('form#downLoadXls');
                    form.find('input[name="datas"]').val(JSON.stringify(map.errDatas));
                    form[0].action = baseURL + 'cluesnew/clues/downxlserr';
                    form.submit();
                }
                layer.close(index);
                vm.reload();
            }, function () {
                layer.close(index);
                vm.reload();
            });
        },
        query: function () {
            vm.reload();
        },
        delete:function (id){
            confirm('确定要删除线索吗？', function () {
                $.ajax({
                    type: "get",
                    url: baseURL + "clues/clues/delete?cluesId="+id,
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.dataLength = (vm.dataLength^0)-1;
                                vm.reload('delect');
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });

        },
        reset: function () {
            resetNULL(vm.q);
            vm.q.statusType = vm.statusIndex;
        },
        changeStatus: function (item, index) {
            vm.statusIndex = parseInt(item.key);
            vm.q.statusType = vm.statusIndex;
            vm.initTableCols(vm.statusIndex);
            changeStatusTab(vm.statusIndex);
            vm.reload();
        },

        view: function (cluesId,type) {
            window.localStorage.setItem("cluesId",cluesId);
            var url;
            if(type == '0'){// 租车/购车
                url = "modules/clues/rentcluesview.html";
            } else if(type == '1'){// 运力合作
                url = "modules/clues/hybmcluesview.html";
            } else if(type == '2'){// 预约试驾
                url = "modules/clues/yysjcluesview.html";
            } else if(type == '3'){// 活动咨询
                url = "modules/clues/hdzxcluesview.html";
            } else if(type == '4'){// 合同加盟
                url = "modules/clues/htjmcluesview.html";
            } else if(type == '5'){// 线索记录
                url = "modules/clues/cluesview.html";
            }
            if(type == '5'){
                $.get(baseURL + "clues/clues/info/"+cluesId, function(r){
                    var param = {
                        data:r.cluesDetailsDto
                    };
                    var index = layer.open({
                        title: "查看",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + url,
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            } else {
                var index = layer.open({
                    title: "详情",
                    type: 2,
                    content: tabBaseURL + url,
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.detail(cluesId);
                    },
                    end: function () {
                        window.localStorage.setItem("cluesId",null);
                        layer.close(index);
                        vm.reload();
                    }
                });
            }

            layer.full(index);
        },
        add: function(){
            var param = {
                data:{
                    customerType: '',
                    cluesState: '',
                    cluesSource: '',
                    intentionStatus: '',
                    followType: 1,
                    operatorId: sessionStorage.getItem("userId"),
                    operatorName: sessionStorage.getItem("username"),
                    operatorDeptId: sessionStorage.getItem("userdeptId"),
                    operatorDeptName: sessionStorage.getItem("userdeptName"),
                    followId: sessionStorage.getItem("userId"),
                    followName: sessionStorage.getItem("username"),
                    followDeptId: sessionStorage.getItem("userdeptId"),
                    followDeptName: sessionStorage.getItem("userdeptName")
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/cluesnew/cluesedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        transfer: function (cluesId) {
            $.get(baseURL + "clues/clues/info/"+cluesId, function(r){
                var param = {
                    data:r.cluesDetailsDto
                };
                var index = layer.open({
                    title: "转移客户",
                    type: 2,
                    area: ['80%', '80%'],
                    boxParams: param,
                    content: tabBaseURL + "modules/clues/cluestransfer.html",
                    end: function () {
                        layer.close(index);
                    }
                });
            });
        },

        // 确认已打电话
        confirmCall: function(cluesId,type){
            var index = layer.open({
                title: "提示",
                type: 2,
                area: ['50%', '50%'],
                content: tabBaseURL + "modules/clues/callconfirm.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(cluesId,type);
                },
                end: function(){
                    layer.close(index);
                }
            });
        },

        // 线索：处理备注
        dealRemark: function (cluesId, type){
            window.localStorage.setItem("cluesId",cluesId);
            var url;
            if(type == '0'){// 租车/购车
                url = "modules/clues/rentcluesdeal.html";
            } else if(type == '1'){// 运力合作
                url = "modules/clues/hybmcluesdeal.html";
            } else if(type == '2'){// 预约试驾
                url = "modules/clues/yysjcluesdeal.html";
            } else if(type == '3'){// 活动咨询
                url = "modules/clues/hdzxcluesdeal.html";
            } else if(type == '4'){// 合同加盟
                url = "modules/clues/htjmcluesdeal.html";
            }
            var index = layer.open({
                title: "处理备注",
                type: 2,
                content: tabBaseURL + url,
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.detail(cluesId);
                },
                end: function () {
                    window.localStorage.setItem("cluesId",null);
                    layer.close(index);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        dealArrival: function (cluesId){
            var index = layer.open({
                title: "是否到店",
                type: 2,
                area: ['50%', '70%'],
                content: tabBaseURL + "modules/clues/yysjcluesarrival.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.clues.cluesId = cluesId;
                },
                end: function () {
                    layer.close(index);
                    vm.reload();
                }
            });
        },
        exports: function () {
            if(vm.q.statusType === 5){
                //线索记录
                window.location.href = urlParamByObj(baseURL + 'clues/clues/export', vm.q);;
            }
            if(vm.q.statusType === 0){
                //预订租车/购车
                window.location.href = urlParamByObj(baseURL + 'clues/cluesbuycar/export', vm.q);;
            }
            if(vm.q.statusType === 1){
                //运力合作
                window.location.href = urlParamByObj(baseURL + 'clues/cluessourcesign/export', vm.q);;
            }
            if(vm.q.statusType === 2){
                //预约试驾
                window.location.href = urlParamByObj(baseURL + 'clues/cluessourcedrive/export', vm.q);;
            }
            if(vm.q.statusType === 3){
                //活动咨询
                window.location.href = urlParamByObj(baseURL + 'clues/cluesseek/export', vm.q);;
            }
            if(vm.q.statusType === 4){
                //活动加盟
                window.location.href = urlParamByObj(baseURL + 'clues/cluescontracjoin/export', vm.q);;
            }

        },
        /**
         * 下载导出模板
         */
        importTemplate: function (){
            window.location.href = baseURL + 'cluesnew/clues/importTemplate';
        },

        initTableCols: function(type){
            var url;
            // 预定租车/购车
            if(type == 0){
                //initSearch(type);
                url = baseURL + 'clues/clues/cluesBuyCarList';
                vm.cols = [[
                    {title: '操作', width:180, minWidth:180, templet:'#rentCarTpl',fixed:"left",align:"center"},
                    {field:'cluesTypeName',align:"center", title: '线索类型', minWidth:110, templet: function (d) {return isEmpty(d.cluesTypeName);}},
                    {field:'nickName', align:"center",title: '昵称', minWidth:180, templet: function (d) {return isEmpty(d.nickName);}},
                    {field:'userTypeStr',align:"center", title: '用户类型', minWidth:80, templet: function (d) {return isEmpty(d.userTypeStr);}},
                    {field:'phone',align:"center", title: '联系方式', minWidth:120, templet: function (d) {return isEmpty(d.phone);}},
                    {field:'carBsmName',align:"center", title: '预定品牌/车系/车型', minWidth:150, templet: function (d) {return isEmpty(d.carBsmName);}},
                    {field:'reserveTypeStr', align:"center",title: '预定类型', minWidth:100, templet: function (d) {return isEmpty(d.reserveTypeStr);}},
                    {field:'isPayAmount',align:"center", title: '是否支付定金/支付金额/元', minWidth:150, templet: function (d) {return isEmpty(d.isPayAmount);}},
                    {field:'',align:"center", title: '支付方式/时间', minWidth:180, templet: function (d) {
                        return isEmpty(d.payTypeStr)+"/"+isEmpty(d.payTime);
                    }},
                    {field:'reserveDeptName',align:"center", title: '预约门店', minWidth:200, templet: function (d) {return isEmpty(d.reserveDeptName);}},
                    {field:'contact', align:"center",title: '门店联系人', minWidth:130, templet: function (d) {return isEmpty(d.contact);}},
                    {field:'reserveTime',align:"center", title: '预定时间', minWidth:130, templet: function (d) {return isEmpty(d.reserveTime);}},
                    {field:'isCallStr', align:"center",title: '是否已拨打客户电话', minWidth:180, templet: function (d) {return isEmpty(d.isCallStr);}},
                    {field:'dealStatusStr', align:"center",title: '处理状态', minWidth:100, templet: function (d) {return isEmpty(d.dealStatusStr);}},
                    {field:'dealContent',align:"center", title: '处理备注', minWidth:200, templet: function (d) {return isEmpty(d.dealContent);}}
                ]]
            }

            // 运力合作
            if(type == 1){
                url = baseURL + 'clues/clues/cluesSourceSignList';
                vm.cols = [[
                    {title: '操作', width:180,minWidth:180, templet:'#hybmTpl',fixed:"left",align:"center"},
                    //{field:'cluesTypeName', align:"center",title: '线索类型', minWidth:110, templet: function (d) {return isEmpty(d.cluesTypeName);}},
                    {field:'cluesTypeName', align:"center",title: '线索类型', minWidth:110, templet: function (d) {return "运力合作";}},
                    {field:'nickName', align:"center",title: '昵称', minWidth:150, templet: function (d) {return isEmpty(d.nickName);}},
                    {field:'userTypeStr', align:"center",title: '用户类型', minWidth:80, templet: function (d) {return isEmpty(d.userTypeStr);}},
                    {field:'phone', align:"center",title: '联系方式', minWidth:150, templet: function (d) {return isEmpty(d.phone);}},
                    {field:'sourceProject',align:"center", title: '报名项目名称', minWidth:200, templet: function (d) {return isEmpty(d.sourceProject);}},
                    {field:'contentNews', align:"center",title: '备注信息', minWidth:200, templet: function (d) {return isEmpty(d.contentNews);}},
                    {field:'signTime', align:"center",title: '报名时间', minWidth:130, templet: function (d) {return isEmpty(d.signTime);}},
                    {field:'contact', align:"center",title: '联系人', minWidth:150, templet: function (d) {return isEmpty(d.contact);}},
                    {field:'isCallStr',align:"center", title: '是否已拨打客户电话', minWidth:180, templet: function (d) {return isEmpty(d.isCallStr);}},
                    {field:'dealStatusStr',align:"center", title: '处理状态', minWidth:80, templet: function (d) {return isEmpty(d.dealStatusStr);}},
                    {field:'dealContent', align:"center",title: '处理备注', minWidth:300, templet: function (d) {return isEmpty(d.dealContent);}}
                ]]
            }

            // 预约试驾
            if(type == 2){
                url = baseURL + 'clues/clues/cluesSourceDriveList';
                vm.cols = [[
                    {title: '操作', width:180,minWidth:180, templet:'#yysjTpl',fixed:"left",align:"center"},
                    {field:'cluesTypeName', align:"center",title: '线索类型', minWidth:100, templet: function (d) {return isEmpty(d.cluesTypeName);}},
                    {field:'nickName', align:"center",title: '昵称', minWidth:140, templet: function (d) {return isEmpty(d.nickName);}},
                    {field:'contact', align:"center",title: '联系人', minWidth:140, templet: function (d) {return isEmpty(d.contact);}},
                    {field:'phone', align:"center",title: '联系方式', minWidth:140, templet: function (d) {return isEmpty(d.phone);}},
                    {field:'arrivalStatusStr', align:"center",title: '到店状态', minWidth:140, templet: function (d) {return isEmpty(d.arrivalStatusStr);}},
                    {field:'carBsmName', align:"center",title: '预约品牌/车系/车型', minWidth:200, templet: function (d) {return isEmpty(d.carBsmName);}},
                    {field:'reserveDeptName', align:"center",title: '预约门店', minWidth:200, templet: function (d) {return isEmpty(d.reserveDeptName);}},
                    {field:'reserveAddress', align:"center",title: '门店地址', minWidth:200, templet: function (d) {return isEmpty(d.reserveAddress);}},
                    {field:'deptContact',align:"center", title: '门店联系人', minWidth:150, templet: function (d) {return isEmpty(d.deptContact);}},
                    {field:'reserveContent',align:"center", title: '预约备注信息', minWidth:180, templet: function (d) {return isEmpty(d.reserveContent);}},
                    {field:'reserveTime', align:"center",title: '预约时间', minWidth:130, templet: function (d) {return isEmpty(d.reserveTime);}},
                    {field:'isCallStr', align:"center",title: '是否已拨打客户电话', minWidth:170, templet: function (d) {return isEmpty(d.isCallStr);}},
                    {field:'dealStatusStr',align:"center", title: '处理状态', minWidth:80, templet: function (d) {return isEmpty(d.dealStatusStr);}},
                    {field:'dealContent',align:"center", title: '处理备注', minWidth:200, templet: function (d) {return isEmpty(d.dealContent);}}
                ]]
            }

            // 活动咨询
            if(type == 3){
                url = baseURL + 'clues/clues/cluesSeekList';
                vm.cols = [[
                    {title: '操作', width:180,minWidth:180, templet:'#hdzxTpl',fixed:"left",align:"center"},
                    {field:'cluesTypeName', align:"center",title: '线索类型', minWidth:100, templet: function (d) {return isEmpty(d.cluesTypeName);}},
                    {field:'nickName', align:"center",title: '昵称', minWidth:160, templet: function (d) {return isEmpty(d.nickName);}},
                    {field:'userTypeStr', align:"center",title: '用户类型', minWidth:80, templet: function (d) {return isEmpty(d.userTypeStr);}},
                    {field:'phone', align:"center",title: '联系方式', minWidth:140, templet: function (d) {return isEmpty(d.phone);}},
                    {field:'activityName', align:"center",title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
                    {field:'reserveDeptName', align:"center",title: '咨询门店', minWidth:200, templet: function (d) {return isEmpty(d.reserveDeptName);}},
                    {field:'seekTime',align:"center", title: '咨询时间', minWidth:130, templet: function (d) {return isEmpty(d.seekTime);}},
                    {field:'deptContact', align:"center",title: '门店联系人', minWidth:140, templet: function (d) {return isEmpty(d.deptContact);}},
                    {field:'isCallStr', align:"center",title: '是否已拨打客户电话', minWidth:170, templet: function (d) {return isEmpty(d.isCallStr);}},
                    {field:'dealStatusStr',align:"center", title: '处理状态', minWidth:80, templet: function (d) {return isEmpty(d.dealStatusStr);}},
                    {field:'dealContent', align:"center",title: '处理备注', minWidth:200, templet: function (d) {return isEmpty(d.dealContent);}}
                ]]
            }

            // 合作加盟
            if(type == 4){
                url = baseURL + 'clues/clues/cluesContracjoinList';
                vm.cols = [[
                    {title: '操作', width:180,minWidth:180, templet:'#hzjmTpl',fixed:"left",align:"center"},
                    {field:'cluesTypeName',align:"center",title: '线索类型', minWidth:100, templet: function (d) {return isEmpty(d.cluesTypeName);}},
                    {field:'nickName',align:"center", title: '昵称', minWidth:150, templet: function (d) {return isEmpty(d.nickName);}},
                    {field:'userTypeStr',align:"center", title: '客户类型', minWidth:60, templet: function (d) {return isEmpty(d.userTypeStr);}},
                    {field:'contact', align:"center",title: '联系人', minWidth:150, templet: function (d) {return isEmpty(d.contact);}},
                    {field:'phone', align:"center",title: '联系方式', minWidth:120, templet: function (d) {return isEmpty(d.phone);}},
                    {field:'content',align:"center", title: '备注信息', minWidth:200, templet: function (d) {return isEmpty(d.content);}},
                    {field:'seekTime', align:"center",title: '咨询时间', minWidth:130, templet: function (d) {return isEmpty(d.seekTime);}},
                    {field:'isCallStr', align:"center",title: '是否已拨打客户电话', minWidth:165, templet: function (d) {return isEmpty(d.isCallStr);}},
                    {field:'dealStatusStr',align:"center", title: '处理状态', minWidth:80, templet: function (d) {return isEmpty(d.dealStatusStr);}},
                    {field:'dealContent', align:"center",title: '处理备注', minWidth:200, templet: function (d) {return isEmpty(d.dealContent);}}
                ]]
            }

            // 线索记录
            if(type == 5){
                url = baseURL + 'clues/clues/list';
                vm.cols = [[
                    {title: '操作', width:125,minWidth:125, templet:'#cluesTpl',fixed:"left",align:"center"},
                    {field:'cluesSource', align:"center",title: '线索来源', minWidth:70, templet: function (d) {
                        return transformTypeByMap(d.cluesSource, {1:'电话营销', 2:'主动来电', 3:'客户介绍', 4:'自己挖掘', 5:'网络搜索', 6:'其他途径'});}},
                    {field:'cluesState', align:"center",title: '线索状态', minWidth:70, templet: function (d) {
                        return transformTypeByMap(d.cluesState, {1:'初步接触', 2:'潜在客户', 3:'持续跟进', 4:'忠诚客户', 5:'无效客户', 6:'成交客户'});}},
                    {field:'customerName',align:"center", title: '客户名称', minWidth:150, templet: function (d) {return isEmpty(d.customerName);}},
                    {field:'customerType', align:"center",title: '客户类型', minWidth:70, templet: function (d) {
                        return transformTypeByMap(d.customerType, {1:'个人', 2:'企业'});}},
                    {field:'contact',align:"center", title: '联系人', minWidth:140, templet: function (d) {return isEmpty(d.contact);}},
                    {field:'phone', align:"center",title: '联系电话', minWidth:120, templet: function (d) {return isEmpty(d.phone);}},
                    {field:'occupation', align:"center",title: '职业', minWidth:130, templet: function (d) {return isEmpty(d.occupation);}},
                    {field:'usualResidence', align:"center",title: '常住地', minWidth:130, templet: function (d) {return isEmpty(d.usualResidence);}},
                    {field:'rentCarPurpose', align:"center",title: '租车用途', minWidth:130, templet: function (d) {return isEmpty(d.rentCarPurpose);}},
                    {field:'intentionStatus', align:"center",title: '意向情况', minWidth:60, templet: function (d) {
                        return transformTypeByMap(d.intentionStatus, {1:'无意向', 2:'低意向', 3:'中意向', 4:'高意向', 5:'已成单'});}},
                    {field:'createTime', align:"center",title: '创建时间', minWidth:130, templet: function (d) {return dateFormat(d.createTime);}},
                    {field:'lastFollowTime', align:"center",title: '最后跟进时间', minWidth:130, templet: function (d) {return dateFormat(d.lastFollowTime);}},
                    {field:'followName',align:"center", title: '跟进人', minWidth:130, templet: function (d) {return isEmpty(d.followName);}},
                    {field:'countFollow', align:"center",title: '跟进次数', minWidth:100, templet: function (d) {return isEmpty(d.countFollow);}},
                    {field:'followDays', align:"center",title: '未跟进天数', minWidth:100, templet: function (d) {return isEmpty(d.followDays);}}
                ]]
            }

            layui.config({
                base: '../../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            });
            layui.use(['form', 'element', 'table', 'soulTable'], function () {
                soulTable = layui.soulTable
                gridTable = layui.table.render({
                    id: "gridid",
                    elem: '#grid',
                    url: url,
                    where: JSON.parse(JSON.stringify(vm.q)),
                    cols: vm.cols,
                    page: true,
                    loading: false,
                    limits: [10, 20, 50, 100],
                    limit: 10,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function (res, curr, count) {
                        soulTable.render(this);
                        $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                        vm.dataLength = count^0;
                    },

                });
            });
        },



        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: event !== 'delect'?getCurrPage('gridid', vm.dataLength):1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }
});


var search;
function initSearch(){
    //search.reset();
    search = Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '昵称', placeholder: '请输入昵称/客户名称', fieldName: 'nickName'},
            {type: 'text', label: '联系电话', placeholder: '请输入联系电话', fieldName: 'phone'},
            {type: 'text', label: '项目名称', placeholder: '请输入项目名称', fieldName: 'sourceProject'},
            {type: 'text', label: '活动名称', placeholder: '请输入活动名称', fieldName: 'activityName'},
            {type: 'text', label: '客户名称', placeholder: '请输入客户名称', fieldName: 'customerName'},
            {type: 'select', label: '到店状态', fieldName: 'arrivalStatus', selectMap: {
                    1:'预约成功',
                    2:'已到店',
                    3:'无效',
            },},
            {type: 'select', label: '预定类型', fieldName: 'reserveType', selectMap: {
                    1:'直购',
                    2:'分期购车',
                    3:'租赁',
                },},
            {type: 'select', label: '客户类型', fieldName: 'customerType', selectMap: {
                    1:'个人',
                    2:'企业',
                },},
            {type: 'select', label: '线索来源', fieldName: 'cluesSource', selectMap: {
                    1:'电话营销',
                    2:'主动来电',
                    3:'客户介绍',
                    4:'自己挖掘',
                    5:'网络搜索',
                    6:'其他途径',
                }, hidden: true, selectFilter: true},
            {type: 'select', label: '线索状态', fieldName: 'cluesState', selectMap: {1:'初步接触', 2:'潜在客户', 3:'持续跟进', 4:'忠诚客户', 5:'无效客户', 6:'成交客户'}
                , hidden: true, selectFilter: true},
            {type: 'select', label: '意向情况', fieldName: 'intentionStatus', selectMap: {
                    1:'无意向',
                    2:'低意向',
                    3:'中意向',
                    4:'高意向',
                    5:'已成单',
                }, hidden: true, selectFilter: true},
            {type: 'text', label: '跟进人', placeholder: '请输入跟进人', fieldName: 'dealProcessor',hidden: true, selectFilter: true},
            {type: 'text', label: '租车用途', placeholder: '请输入租车用途', fieldName: 'rentCarPurpose',hidden: true, selectFilter: true},
            {type: 'selectcascader', label: '品牌/车系/车型', placeholder: '请选择品牌/车系/车型', fieldName: 'modelId', selectList: vm.carTreeList,
                hidden: true, selectFilter: true},
            {type: 'select', label: '处理状态', fieldName: 'dealStatus0', selectMap: {
                    0:'无效',
                    1:'无效/定金已退',
                    2:'持续跟进',
                    3:'已成交',
                }, hidden: true, selectFilter: true},
            {type: 'select', label: '处理状态', fieldName: 'dealStatus1', selectMap: {
                    0:'无效',
                    1:'报名成功',
                    2:'持续跟进',
                }, hidden: true, selectFilter: true},
            {type: 'select', label: '处理状态', fieldName: 'dealStatus2', selectMap: {
                    0:'无效',
                    1:'持续跟进',
                    2:'已成交',
                }, hidden: true, selectFilter: true},
            {type: 'select', label: '处理状态', fieldName: 'dealStatus3', selectMap: {
                    0:'无效',
                    1:'持续跟进',
                    2:'已加盟',
                }, hidden: true, selectFilter: true},
            {type: 'select', label: '预约门店', placeholder: '请选取门店', fieldName: 'deptId1', selectListValueName: 'deptId', selectListTxtName: 'companyName',
                selectList: vm.lessorLst, hidden: true, selectFilter: true},
            {type: 'select', label: '咨询门店', placeholder: '请选取门店', fieldName: 'deptId2', selectListValueName: 'deptId', selectListTxtName: 'companyName',
                selectList: vm.lessorLst, hidden: true, selectFilter: true},
            {type: 'date', label: '支付时间', placeholder: '选择日期范围', fieldName: 'date1', hidden: true, selectFilter: true},
            {type: 'date', label: '预定时间', placeholder: '选择日期范围', fieldName: 'date2', hidden: true, selectFilter: true},
            {type: 'date', label: '报名时间', placeholder: '选择日期范围', fieldName: 'date3', hidden: true, selectFilter: true},
            {type: 'date', label: '预约时间', placeholder: '选择日期范围', fieldName: 'date4', hidden: true, selectFilter: true},
            {type: 'date', label: '咨询时间', placeholder: '选择日期范围', fieldName: 'date5', hidden: true, selectFilter: true},
            {type: 'date', label: '咨询时间', placeholder: '选择日期范围', fieldName: 'date6', hidden: true, selectFilter: true},
            {type: 'date', label: '创建时间', placeholder: '选择日期范围', fieldName: 'date7', hidden: true, selectFilter: true},
            {type: 'date', label: '最后跟进时间', placeholder: '选择日期范围', fieldName: 'date8', hidden: true, selectFilter: true},
        ],
        callback: function (tag, valData) {
             
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exports();
                    break;
                }
                case 'onChange.selectcascader.modelId':{
                    vm.q.searchCar = valData[0]+","+valData[1];
                    break;
                }
            }
        }
    });
    search.initView();
    changeStatusTab(vm.statusIndex);

}

function changeStatusTab(status) {
    search.reset();
    switch (parseInt(status)) {
        case 0:{
            search.hideItems('sourceProject', 'activityName', 'customerName', 'customerType', 'cluesSource', 'cluesState', 'intentionStatus', 'dealProcessor', 'rentCarPurpose',
                'dealStatus1', 'dealStatus2', 'dealStatus3', 'deptId1', 'deptId2', 'date3', 'date4' ,'date5' ,'date6' ,'date7' ,'date8','arrivalStatus');
            search.showItems( 'nickName', 'phone', 'reserveType', 'modelId', 'dealStatus0', 'date1','date2');

            break;
        }
        case 1:{
            search.hideItems('reserveType', 'activityName', 'modelId', 'customerName', 'customerType', 'cluesSource', 'cluesState', 'intentionStatus', 'dealProcessor', 'rentCarPurpose',
                'dealStatus0', 'dealStatus2', 'dealStatus3', 'deptId1', 'deptId2', 'date1','date2', 'date4' ,'date5' ,'date6' ,'date7' ,'date8','arrivalStatus');
            search.showItems( 'nickName', 'phone', 'sourceProject', 'dealStatus1', 'date3');
            break;
        }
        case 2:{
            search.hideItems('reserveType','sourceProject', 'activityName', 'customerName', 'customerType', 'cluesSource', 'cluesState', 'intentionStatus', 'dealProcessor', 'rentCarPurpose',
                'dealStatus0', 'dealStatus1', 'dealStatus3', 'deptId2', 'date1','date2','date3','date5' ,'date6' ,'date7' ,'date8');
            search.showItems('nickName', 'phone', 'deptId1',  'modelId', 'dealStatus2', 'date4','arrivalStatus');
            break;
        }
        case 3:{
            search.hideItems('reserveType', 'modelId', 'customerName', 'customerType', 'cluesSource', 'cluesState', 'intentionStatus', 'dealProcessor', 'rentCarPurpose',
                'dealStatus0', 'dealStatus1', 'dealStatus3', 'deptId1', 'modelId','date1','date2','date3','date4' ,'date6' ,'date7' ,'date8','arrivalStatus');
            search.showItems('nickName', 'phone', 'deptId2','activityName','dealStatus2', 'date5');
            break;
        }
        case 4:{
            search.hideItems('reserveType','sourceProject', 'modelId', 'activityName', 'customerName', 'customerType', 'cluesSource', 'cluesState', 'intentionStatus', 'dealProcessor', 'rentCarPurpose',
                'dealStatus0', 'dealStatus1', 'dealStatus2', 'deptId1','deptId2', 'modelId', 'date1', 'date2', 'date3', 'date4', 'date5', 'date7', 'date8','arrivalStatus');
            search.showItems('nickName', 'phone', 'dealStatus3', 'date6');
            break;
        }
        case 5:{
            search.hideItems('nickName','sourceProject','reserveType', 'activityName', 'modelId', 'dealStatus0', 'dealStatus1', 'dealStatus2', 'dealStatus3', 'deptId1', 'deptId2', 'date1', 'date2', 'date3', 'date5', 'date6','date7', 'date8','arrivalStatus');
            search.showItems('customerName', 'phone', 'customerType', 'cluesSource', 'cluesState', 'intentionStatus', 'dealProcessor', 'rentCarPurpose', 'date7', 'date8');
            break;
        }

    }

}

function getSupplyManagementId(supplyManagementId){
    vm.q.supplyManagementId=supplyManagementId;
    //设置为运力合作tab页
    vm.statusIndex = 1;
    vm.q.statusType = vm.statusIndex;
    vm.initTableCols(vm.statusIndex);
    changeStatusTab(vm.statusIndex);
}

