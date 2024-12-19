$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        // init(layui);
        layui.form.render();
    });
    layui.upload.render({
        elem: '#importData',
        url: baseURL + 'driver/flow/imports',
        field: 'file',
        auto: true,
        size: 10 * 1024 * 1024,
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

                vm.uploadRes = res;
                vm.step = 1;
                // vm.reload()
                init(layui);

                // vm.importSuccess(res);
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


function init(layui) {
    initTable(layui.table, layui.soulTable);
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        data: vm.sucType===0? vm.uploadRes.successDatas:vm.uploadRes.errDatas,
        cols: [[
            {
                field: 'dindex', width:70, align: "center", title: '序号', templet: function (d) {
                    return isEmpty(d.LAY_INDEX);
                }
            },
            {
                field: 'driverName', align: "center", title: '司机姓名', templet: function (d) {
                    return isEmpty(d.driverName);
                }
            },
            {
                field: 'contactNumber', minWidth: 150, align: "center", title: '联系电话', templet: function (d) {
                    return isEmpty(d.contactNumber);
                }
            },
            {
                field: 'carNo', minWidth: 150, align: "center", title: '车牌', templet: function (d) {
                    return isEmpty(d.carNo);
                }
            },
            {
                field: 'brandSeriesModel', minWidth: 180, align: "center", title: '品牌/车系/车型', templet: function (d) {
                    return isEmpty(d.brandSeriesModel);
                }
            },
            {
                field: 'platformName', minWidth: 100, align: "center", title: '平台名称', templet: function (d) {
                    return isEmpty(d.platformName);
                }
            },
            {field: 'flowMoney', align: "center", title: '流水(元)'},
            {field: 'rewardMoney', align: "center", title: '奖励(元)'},
            {field: 'completionVolume', align: "center", title: '完单量(单)'},
            {field: 'onlineDuration', align: "center", title: '在线时长(h)'},
            {field: 'serviceDuration', align: "center", title: '服务时长(h)'},
            {field: 'mileage', align: "center", title: '里程(KM)'},

            {field: 'settlementStartDate', align: "center", title: '结算开始日期'},
            {field: 'settlementEndDate', align: "center", title: '结算结束日期'},
            {field: 'remarks', align: "center", title: '备注信息'},
            {field: 'errMessage', align: "center", title: '状态', templet: '#state'},
        ]],
        cellMinWidth: 130,
        limit:1000,
        height:310,
        done: function(res, curr, count){
            // soulTable.render(this);
            // $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            // $(".layui-table-main tr").each(function (index, val) {
            //     $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
            //     $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            // });
        }
    });
}

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{

        q:{
        },
        step:0,
        sucType:0,
        uploadRes: {
            successDatas:[],
            errDatas:[],
            successCount:0,
            failCount:0,
        }
    },
    created: function(){
        // $.getJSON(baseURL + "sys/dict/getInfoByType/"+"schemeType", function (r) {
        //     vm.schemTypeList = r.dict;
        // })
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){


        });

        var param = parent.layer.boxParams.boxParams;
        callback = param.callback;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        closePage:function () {
            closePage();
        },
        save:function () {
            console.log('提交的数据', vm.q)
        },
        downfailfile:function (){

            // window.location.href = urlParamByObj(baseURL + 'driver/flow/exportErrorData', arr);
            var form = $('form#downLoadXls');
            form.find('input[name="datas"]').val(JSON.stringify(vm.uploadRes.errDatas));
            form[0].action = baseURL + 'driver/flow/exportErrorData';
            form.submit();
        },
        commit:function (){
            if(vm.uploadRes.successDatas.length <= 0){
                alert('暂无可导入的数据')
                return
            }
            $.ajax({
                type: "POST",
                url: baseURL + "driver/flow/saveSuccessData",
                contentType: "application/json",
                data:JSON.stringify(vm.uploadRes.successDatas),
                success: function(r){
                    if(r.code === 0){
                        vm.step=2
                    }else{
                        alert(r.msg);
                    }

                }
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
        reload:function () {
            console.log('重新加载')
            layui.table.reload('gridid', {
                data: vm.sucType===0? vm.uploadRes.successDatas:vm.uploadRes.errDatas,
            });
        },
    }
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



