$(function () {
    layui.form.on('radio(importType)', function (data) {
        vm.importType = data.value;
    });
    layui.form.on('radio(importCType)', function (data) {
        vm.importCType = data.value;
    });

    layui.form.on('select(dowloadFileSelect)', function (data) {
        vm.fileType = data.value;
        if(vm.fileType == "1"){// 订单导入选择订单类型
            $("#orderType").show();
            $("#customerType").hide();
        } else if(vm.fileType == "2"){// 客户导入选择客户类型
            $("#customerType").show();
            $("#orderType").hide();
        }
    });

    // 车辆保险导入
    layui.use([ "element", "laypage", "layer", "upload"], function() {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#importCarBx',
            url: baseURL + 'maintenance/insurancemanage/import',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            done: function(r){
                if(r.resultFlag==1){
                    alert(r.msg);
                    layer.confirm(r.msg, {
                        btn: ['继续导入','进入车辆保险列表'] //可以无限个按钮
                    }, function(index, layero){
                        layer.close(index);
                        // window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        window.location.href = tabBaseURL + 'modules/maintenance/insurancemanage.html';
                    });
                }else if(r.resultFlag==3){
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                } else {
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                }
                vm.reload();
            }
        });
    });

    // 车辆导入
    layui.use(["element", "laypage", "layer", "upload"], function () {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#importCar',
            url: baseURL + 'car/tcarbasic/import',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            done: function (r) {
                if (r.resultFlag == 3) {
                    alert(r.msg);

                } else {
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function (index, layero) {
                        window.location.href = baseURL + 'car/tcarbasic/exportresouresExcel?numberNo=' + r.numberNo;
                    }, function (index) {
                        layer.close(index);
                    });
                }
                vm.reload();
            }
        });
    });

    // 车辆年检导入
    layui.use(["element", "laypage", "layer", "upload"], function () {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#importCarNj',
            url: baseURL + 'maintenance/inspectionmanage/import',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            done: function (r) {
                if (r.resultFlag == 1) {
                    layer.confirm(r.msg, {
                        btn: ['继续导入','进入车辆年检列表'] //可以无限个按钮
                    },function(index, layero){
                        // 再次调用不能调用后台方法，原因未知，需前端配合解决
                        //importCarMaintenance();
                        layer.close(index);
                    },function(index){
                        window.location.href = tabBaseURL + 'modules/maintenance/inspectionmanage.html';
                    });
                } else if(r.resultFlag == 3){
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function (index, layero) {
                        window.location.href = baseURL + 'maintenance/inspectionmanage/exportExcel?numberNo='+r.numberNo;
                    }, function (index) {
                        layer.close(index);
                    });
                } else {
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function (index, layero) {
                        window.location.href = baseURL + 'maintenance/inspectionmanage/exportExcel?numberNo='+r.numberNo;
                    }, function (index) {
                        layer.close(index);
                    });
                }
                vm.reload();
            }
        });
    });

    // 车辆保养导入
    layui.use([ "element", "laypage", "layer", "upload"], function() {
        var upload = layui.upload;//主要是这个
        element = layui.element;
        element.init();
        upload.render({ //允许上传的文件后缀
            elem: '#importCarBy',
            url: baseURL + 'maintenance/maintenancemanage/importExcel',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            progress: function(e, percent){
                $("#progressBar").show();
                // 未起作用，需前端配合解决
                console.log("进度：" + e + '%');
                element.progress('progressBar', e + '%');
                //$("#progressBar").hide();
            },
            done: function(r){
                if(r.resultFlag == 1){
                    layer.confirm(r.msg, {
                        btn: ['继续导入','进入车辆保养列表'] //可以无限个按钮
                    },function(index, layero){
                        // 再次调用不能调用后台方法，原因未知，需前端配合解决
                        importCarMaintenance();
                        layer.close(index);
                    },function(index){
                        window.location.href = tabBaseURL + 'modules/maintenance/maintenancemanage.html';
                    });
                } else if(r.resultFlag == 3){
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'maintenance/maintenancemanage/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                } else{
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'maintenance/maintenancemanage/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                }
                //vm.reload();
            }
        });
    });

    // 车辆出险导入
    layui.use([ "element", "laypage", "layer", "upload"], function() {
        var upload = layui.upload;//主要是这个
        element = layui.element;
        element.init();
        upload.render({ //允许上传的文件后缀
            elem: '#importCarCx',
            url: baseURL + 'outinsuranceorder/ouinsuranceorder/importExcel',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            progress: function(e, percent){
                // 未起作用，需前端配合解决
                console.log(JSON.stringify(e));
                console.log("进度：" + e + '%');
                element.progress('progressBar', e + '%');
            },
            done: function(r){
                if(r.resultFlag == 1){
                    layer.confirm(r.msg, {
                        btn: ['继续导入','进入车辆出险列表'] //可以无限个按钮
                    },function(index, layero){
                        // 再次调用不能调用后台方法，原因未知，需前端配合解决
                        //importCarMaintenance();
                        layer.close(index);
                    },function(index){
                        window.location.href = tabBaseURL + 'modules/outinsuranceorder/outinsuranceorder.html';
                    });
                } else if(r.resultFlag == 3){
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'outinsuranceorder/ouinsuranceorder/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                } else{
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'outinsuranceorder/ouinsuranceorder/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                }
                //vm.reload();
            }
        });
    });

    // 车辆维修导入
    layui.use([ "element", "laypage", "layer", "upload"], function() {
        var upload = layui.upload;//主要是这个
        element = layui.element;
        element.init();
        upload.render({ //允许上传的文件后缀
            elem: '#importCarWx',
            url: baseURL + 'carrepairorder/carrepairorder/importExcel',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            progress: function(e, percent){
                // 未起作用，需前端配合解决
                console.log(JSON.stringify(e));
                console.log("进度：" + e + '%');
                element.progress('progressBar', e + '%');
            },
            done: function(r){
                if(r.resultFlag == 1){
                    layer.confirm(r.msg, {
                        btn: ['继续导入','进入车辆维修列表'] //可以无限个按钮
                    },function(index, layero){
                        // 再次调用不能调用后台方法，原因未知，需前端配合解决
                        //importCarMaintenance();
                        layer.close(index);
                    },function(index){
                        window.location.href = tabBaseURL + 'modules/carrepairorder/carrepairorder.html';
                    });
                } else if(r.resultFlag == 3){
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'carrepairorder/carrepairorder/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                } else{
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'carrepairorder/carrepairorder/exportExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                }
                //vm.reload();
            }
        });
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{

        },
        importType: 1,
        importTypeSelect:false,
        importCType: 1,
        importCtypeSelect:false,
        showForm:true,
        fileForm:false,
        fileType:0,

    },
    updated: function(){
        layui.form.render();
    },

    created: function () {

    },

    methods: {
        cancel:function() {
            vm.fileForm = false;
            layer.closeAll();
        },

        confirmSumbit:function(){
            var type = vm.fileType;
            if(type == '0'){
                window.location.href = importURL+"importData/cl/cldr.xls";// 车辆
            } else if(type == '1'){
                if(vm.importType == '1'){
                    window.location.href = importURL+"importData/order/jz/jzdr.xlsx"; // 经租
                } else if(vm.importType == '2'){
                    window.location.href = importURL+"importData/order/yzdg/yzdgdr.xlsx"; // 以租代购
                } else if(vm.importType == '5'){
                    window.location.href = importURL+"importData/order/rz/rzdr.xlsx"; // 融租
                } else if(vm.importType == '6'){
                    window.location.href = importURL+"importData/order/zg/zgdr.xlsx"; // 直购
                }
            } else if(type == '2'){
                if(vm.importCType == '1'){
                    window.location.href = importURL+"importData/kh/qy/qykhdr.xlsx"; // 企业
                } else {
                    window.location.href = importURL+"importData/kh/gr/grkhdr.xlsx"; // 个人
                }
            } else if(type == '3'){
                window.location.href = importURL+"importData/clbx/bxdr.xlsx";// 保险
            } else if(type == '4'){
                window.location.href = importURL+"importData/clnj/clnjdr.xlsx";// 年检
            } else if(type == '5'){
                window.location.href = importURL+"importData/clby/bydr.xlsx";// 保养
            } else if(type == '6'){
                window.location.href = importURL+"importData/clcx/cxdr.xlsx"; // 出险
            } else if(type == '7'){
                window.location.href = importURL+"importData/clwx/wxdr.xlsx"; //维修
            }
        },

        // 选择下载导入模板
        selectDowloadFile:function(){
            // 获取需要选择的下载模板类型
            layer.open({
                title: "选择模板",
                type: 1,
                area: ['800px', '500px'],
                content: $("#fileForm"),
                end: function () {
                    vm.fileForm = false;
                    layer.closeAll();
                }
            });
            vm.fileForm = true;
        },

        // 车辆订单导入
        importCarOrder: function () {
            vm.importType = 1;
            initImportUpload();
            layer.open({
                title: "数据导入",
                type: 1,
                area: ['500px', '300px'],
                content: $("#importTypeSelect"),
                end: function () {
                    vm.importTypeSelect = false;
                    layer.closeAll();
                }
            });
            vm.importTypeSelect = true;
        },

        // 客户导入
        importCustomer:function (){
            vm.importCType = 1;
            initImportCustomer();
            layer.open({
                title: "数据导入",
                type: 1,
                area: ['500px', '300px'],
                content: $("#importCtypeSelect"),
                end: function () {
                    vm.importCtypeSelect = false;
                    layer.closeAll();
                }
            });
            vm.importCtypeSelect = true;
        }
    }
});

function closeTip() {
    vm.importTypeSelect = false;
    layer.closeAll();
}

// 客户导入
function initImportCustomer(){
    var cuploadId = 'importCFileSelect_' + uuid(16);
    var cactionId = 'importCFileSelectBtn_' + uuid(16);
    $('#importCFileBlock').empty();
    $('#importCFileBlock').append('<a class="layui-btn search-btn" id="'+cuploadId+'">选择文件</a><span id="importFileName"></span>');
    $('#selectedCImportBtnBlock').empty();
    $('#selectedCImportBtnBlock').append('<a class="layui-btn reset-btn" onclick="closeTip()">取消</a>');
    $('#selectedCImportBtnBlock').append('<button class="layui-btn search-btn" id="'+cactionId+'">确定</button>');
    $(('#'+cactionId)).on('click', function () {
        var emlSelector = ('#'+cuploadId+'~span:not(:empty)');
        var span = $(emlSelector);
        if (span == null || span.length == 0){
            alert('请选择数据文件');
        }
    });

    var exportUrl;
    if(vm.importCType == 1){
        exportUrl = 'customer/exportQyExcel?numberNo=';
    } else {
        exportUrl = 'customer/exportGrExcel?numberNo=';
    }

    layui.upload.render({
        elem: ('#'+cuploadId),
        url: baseURL + 'customer/importCustomer',
        data: {
            importCType: vm.importCType
        },
        field: 'file',
        auto: false,
        bindAction: ('#'+cactionId),
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        choose: function (obj) {
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                $('#importFileName').html(fileName);
            });
        },
        before: function (obj) {
            this.data.importCType= vm.importCType;
            layer.msg('数据导入中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (r) {
            if(r.resultFlag == 1){
                layer.confirm(r.msg, {
                    btn: ['继续导入','进入客户列表'] //可以无限个按钮
                },function(index, layero){
                    // 再次调用不能调用后台方法，原因未知，需前端配合解决
                    //importCarMaintenance();
                    layer.close(index);
                },function(index){
                    window.location.href = tabBaseURL + 'modules/customer/customerlist.html';
                });
            } else if(r.resultFlag == 3){
                layer.confirm(r.msg, {
                    btn: ['下载错误日志', '取消'] //可以无限个按钮
                }, function(index, layero){
                    window.location.href = baseURL + exportUrl + r.numberNo;
                }, function(index){
                    layer.close(index);
                });
            } else{
                layer.confirm(r.msg, {
                    btn: ['下载错误日志', '取消'] //可以无限个按钮
                }, function(index, layero){
                    window.location.href = baseURL + exportUrl + r.numberNo;
                }, function(index){
                    layer.close(index);
                });
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
            initImportCustomer();
        }
    });
}

// 车辆订单导入
function initImportUpload() {
    var uploadId = 'importFileSelect_' + uuid(16);
    var actionId = 'importFileSelectBtn_' + uuid(16);
    $('#importFileBlock').empty();
    $('#importFileBlock').append('<a class="layui-btn search-btn" id="'+uploadId+'">选择文件</a><span id="importFileName"></span>');
    $('#selectedImportBtnBlock').empty();
    $('#selectedImportBtnBlock').append('<a class="layui-btn reset-btn" onclick="closeTip()">取消</a>');
    $('#selectedImportBtnBlock').append('<button class="layui-btn search-btn" id="'+actionId+'">确定</button>');
    $(('#'+actionId)).on('click', function () {
        var emlSelector = ('#'+uploadId+'~span:not(:empty)');
        var span = $(emlSelector);
        if (span == null || span.length == 0){
            alert('请选择数据文件');
        }
    });
    layui.upload.render({
        elem: ('#'+uploadId),
        url: baseURL + 'order/order/inports',
        data: {
            rentType: -9
        },
        field: 'file',
        auto: false,
        bindAction: ('#'+actionId),
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        choose: function (obj) {
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                $('#importFileName').html(fileName);
            });
        },
        before: function (obj) {
            this.data.rentType= vm.importType;
            layer.msg('数据导入中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (res) {
            if (r.resultFlag == 3 || r.resultFlag == 1) {
                alert(r.msg);
            } else {
                layer.confirm(r.msg, {
                    btn: ['下载错误日志', '取消'] //可以无限个按钮
                }, function (index, layero) {
                    // window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo='+r.numberNo;
                }, function (index) {
                    layer.close(index);
                });
            }
            vm.reload();
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
            initImportUpload();
        }
    });
}

function importCarMaintenance(){
    //执行实例
    $('#importCarBy').click();

    /*var uploadInst = layui.upload.render({
        elem: '#importCarBy'
        ,url: baseURL + 'maintenance/maintenancemanage/importExcel'
        ,choose: function(obj){
            obj.preview(function(index, file, result){
                //对上传失败的单个文件重新上传，一般在某个事件中使用
                obj.upload(index, file);
            });
        }
    });

    return false;*/
    console.log(layui.upload);
    layui.upload.render({
        elem: '#importCarBy',
        url: baseURL + 'maintenance/maintenancemanage/importExcel',
        accept: 'file', //普通文件
        exts: 'xlsx|xls', //只允许上传excel
        done: function(r){
             
            if(r.resultFlag == 1){
                layer.confirm(r.msg, {
                    btn: ['继续导入','进入车辆保养列表'] //可以无限个按钮
                },function(index, layero){
                    importCarMaintenance();
                    layer.close(index);
                },function(index){
                    window.location.href = tabBaseURL + 'modules/maintenance/maintenancemanage.html';
                });
            } else if(r.resultFlag == 3){
                layer.confirm(r.msg, {
                    btn: ['下载错误日志', '取消'] //可以无限个按钮
                }, function(index, layero){
                    window.location.href = baseURL + 'maintenance/maintenancemanage/exportExcel?numberNo='+r.numberNo;
                }, function(index){
                    layer.close(index);
                });
            } else{
                layer.confirm(r.msg, {
                    btn: ['下载错误日志', '取消'] //可以无限个按钮
                }, function(index, layero){
                    window.location.href = baseURL + 'maintenance/maintenancemanage/exportExcel?numberNo='+r.numberNo;
                }, function(index){
                    layer.close(index);
                });
            }

        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
        }
    });
}


