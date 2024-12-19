$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            height: '500px',
            url: baseURL + 'car/advert/list',
            cols: [[
                //  {type:'checkbox'},
                {title: '操作', minWidth: 125, templet: '#barTpl', fixed: "left", align: "center"},
                {field: 'advertNo', minWidth: 100, title: '广告编号'},
                {
                    field: 'advertType', title: '广告类型', align: 'center', templet: function (d) {
                    if (d.advertType == 1) {
                        return "轮播广告";
                    } else if (d.advertType == 2) {
                        return "楼层广告";
                    } else if (d.advertType == 3) {
                        return "活动广告";
                    } else {
                        return "—";
                    }
                }
                },

                {field: 'advertName', minWidth: 100, title: '广告名称'},
                {field: 'ranking', minWidth: 50, title: '排名位置'},
                {
                    field: 'isAvailable', title: '可用状态', align: 'center', templet: function (d) {
                    if (d.isAvailable == 1) {
                        return "可用";
                    } else if (d.isAvailable == 0) {
                        return "不可用";
                    } else {
                        return "—";
                    }
                }
                },
                {
                    field: 'censorStatus', title: '审核状态', align: 'center', templet: function (d) {
                    if (d.censorStatus == 1) {
                        return "通过";
                    } else if (d.censorStatus == 0) {
                        return "未通过";
                    } else if (d.censorStatus == 2) {
                        return "待审核";
                    } else {
                        return "—";
                    }
                }
                },

                {
                    field: 'updateTime',
                    minWidth: 160,
                    title: '更新时间',
                    templet: '<div>{{new Date(d.updateTime).format("yyyy-MM-dd hh:mm:ss")}}</div>'
                },
                /*{field: 'linkType',  minWidth:128, title: '产品展示的类型',  align:'center',templet:function(d){
                    if(d.linkType == 1){
                        return "直购";
                    }else if(d.linkType == 2){
                        return "以租代售";
                    }else if(d.linkType == 3){
                        return "长租";
                    }else{
                        return "-"
                    }
                }},*/

                {
                    field: 'jumpType', minWidth: 128, title: '广告跳转类型', align: 'center', templet: function (d) {
                    if (d.jumpType == 1) {
                        return " 外部链接";
                    } else if (d.jumpType == 2) {
                        return "内容";
                    } else if (d.jumpType == 3) {
                        return "产品";
                    } else {
                        return "长租"
                    }
                }
                }

            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            done: function () {
                soulTable.render(this);
            }
        });
    })


    //初始化数据
    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

            $("#textDiv").hide();

            form.render();
    });
    //广告类型--查询条件
    layui.form.on('select(advertTypeSelect)', function (data) {
        vm.q.advertType = data.value;
        layui.form.render();
    });

    //审核状态--查询条件
    layui.form.on('select(censorStatusSelect)', function (data) {
        vm.q.censorStatus = data.value;
        layui.form.render();
    });
    //可用状态--查询条件
    layui.form.on('select(isAvailableSelect)', function (data) {
        vm.q.isAvailable = data.value;
        layui.form.render();
    });



    //监听-广告类型下拉列表
    layui.form.on('select(advertTypeAdd)', function (data) {
        var advertType = data.value;
        vm.advert = Object.assign({}, vm.advert, {advertType: advertType});
    });
    //是否有咨询栏
    layui.form.on('radio(whether)', function (data) {
        vm.advert.whether = data.value;
    });

    //轮播类型
    layui.form.on('select(carouselType)', function (data) {
        vm.advert.carouselType = data.value;
    });

    //监听-广告区分跳转类型下拉列表
    layui.form.on('select(jumpType)', function (data) {
        var jumpType = data.value;
        vm.advert = Object.assign({}, vm.advert, {jumpType: jumpType});

        if(jumpType==2){
            $("#textDiv").show();
        }else {
            $("#textDiv").hide();
        }
    });




    layui.form.on('submit(saveOrUpdate)', function (data) {
        vm.saveOrUpdate();
        return false;
    });
    layui.form.on('submit(saveCensorStatusForm)', function (data) {
        var censorStatus = data.field.censorStatus;  //获取单选按钮的值
        vm.advert.censorStatus = censorStatus;     //给对象status赋值
        vm.saveCensorStatusForm();
        return false;
    });



    //批量删除
    $(".delBatch").click(function () {
        var advertNos = vm.selectedRows();
        if (advertNos == null) {
            return;
        }
        vm.del(advertNos);
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.advertNo);
        } else if (layEvent === 'del') {
            var advertNo = [data.advertNo];
            vm.del(advertNo);
        } else if (layEvent === 'details') {//查看详情
            vm.details(data);
        } else if (layEvent === 'isAvailable') {//启用
            vm.isAvailable(data);
        } else if (layEvent === 'available') {//停用
            vm.available(data);
        } else if (layEvent === 'audit') {//审核
            vm.audit(data);
        }
    });

    layui.use('upload', function () {
        vm.selectFileIndex = 1;
        layui.upload.render({
            elem: '#uploadFile',
            url: baseURL + '',
            auto: false,
            multiple: true,
            number:20,
            bindAction: '#uploadAction',
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    var files = obj.pushFile();
                    if (vm.selectFileIndex == 1) {
                        vm.files[2] = file;
                        $("#imgCarBrandLogo").attr('src', result);
                        vm.advert.advertPicUrl = result;
                    }
                    this.files = files;
                });
            },
            before: function (obj) {
                if (!vm.files || !vm.files.length || vm.files.length == 1) {
                    return;
                }
            },
            done: function (res, index, upload) {
                // $("#imgDrivinglicenseFront").attr('src', res);
                // $("#imgDrivinglicenseBack").attr('src', res);
            },
            error: function (index, upload) {
            }
        });
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        auditForm: false,
        editForm: false,
        detailsForm: false,
        layeditIndex: null,
        selectFileIndex: 1,
        q: {
            advertName: null,
            advertType: null,
            censorStatus: null,
            isAvailable: null
        },
        advert: {},
        files: [],
    },
    updated: function () {
        layui.form.render();
    },
    computed: {
        advertTypeStr: {
            get: function () {
                if (this.advert.advertType == 1) {
                    return "轮播广告";
                } else if (this.advert.advertType == 2) {
                    return "楼层广告";
                }else if(this.advert.advertType == 3){
                    return "活动广告";
                }
                else {
                    return "--";
                }
            }
        },
        jumpTypeStr: {
            get: function () {
                if (this.advert.jumpType == 1) {
                    return "产品";
                } else if (this.advert.jumpType == 2) {
                    return "内容";
                } else if (this.advert.jumpType == 3) {
                    return "产品";
                }
            }
        },
        carouselTypeStr:{
            get: function () {
                if (this.advert.carouselType == 1) {
                    return "小程序";
                } else if (this.advert.carouselType == 2) {
                    return "APP";
                } else {
                    return "--";
                }
            }
        },
        fillAdvertPicUrl: {
            get: function () {
                if (imageURL == undefined) {
                    imageURL = '';
                }
                if (this.advert.advertPicUrl != undefined) {
                    if (this.advert.advertPicUrl.startsWith("data:")) {
                        return this.advert.advertPicUrl;
                    } else {
                        return imageURL + this.advert.advertPicUrl;
                    }
                } else {
                    return '';
                }

            }
        },

    },
    methods: {
        cancel: function () {
            /* var index = parent.layer.getFrameIndex(window.name);
             parent.layer.close(index);*/

            layer.closeAll();
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var advertNos = [];
            $.each(list, function (index, item) {
                advertNos.push(item.advertNo);
            });
            return advertNos;
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.advert = {};
            //影藏内容
            $("#textDiv").hide();
            $("#imgCarBrandLogo").attr('src', baseURL + '/statics/images/plus.png');  //初始化设置图片上传默认图片
            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.editForm = false;
                    layer.closeAll();
                }
            });

            layui.use('layedit', function () {
                var layedit = layui.layedit;
                vm.layeditIndex = layedit.build('advert_text', {
                    uploadImage: {
                        url:baseURL + 'car/advert/uploadFile2',
                        type: 'post'
                    }
                }); //建立编辑器
            });
            vm.editForm = true;
            layer.full(index);
        },
        update: function (advertNo) {
            $.get(baseURL + "car/advert/info/" + advertNo, function (r) {
                vm.advert = r.advert;
                var index = layer.open({
                    title: "修改",
                    type: 1,
                    content: $("#editForm"),
                    end: function () {
                        vm.editForm = false;
                        layer.closeAll();
                    }
                });
                vm.editForm = true;
                setTimeout(function () {
                    layui.use('layedit', function () {
                        var layedit = layui.layedit;
                        var  path="car_advert";
                        vm.layeditIndex = layedit.build('advert_text', {
                            uploadImage: {
                                url:baseURL + 'car/advert/uploadFile2',
                                type: 'post'
                            }
                        }); //建立编辑器

                    });
                    layer.full(index);
                }, 200);

            });

        },
        reset: function () {
            vm.q.advertName = null;
            vm.q.advertType = null;
            vm.q.censorStatus = null;
            vm.q.isAvailable = null;
        },
        //查看
        details: function (data) {
            $("#textDivDetil").hide();
            $("#advertTypeDiv").hide();

            $.get(baseURL + "car/advert/info/" + data.advertNo, function (r) {
                vm.advert = r.advert;
                var advertType=r.advert.advertType;
                var jumpType=r.advert.jumpType;
                if(jumpType==2){
                    $("#textDivDetil").show();
                }else {
                    $("#textDivDetil").hide();
                }

                if( advertType==3){
                    $("#advertTypeDiv").hide();
                }else {
                    $("#advertTypeDiv").show();
                }

                layui.use('layedit', function () {
                    var layedit = layui.layedit;
                    vm.layeditIndex = layedit.build('textDetial'); //建立编辑器
                });

                var index = layer.open({
                    title: "详情",
                    type: 1,
                    content: $("#detailsForm"),
                    end: function () {
                        vm.detailsForm = false;
                        layer.closeAll();
                    }
                });
                vm.detailsForm = true;
                layer.full(index);
            });
        },
        audit: function (data) {
            vm.advert.advertNo = data.advertNo;
            var index = layer.open({
                title: "审核",
                type: 1,
                content: $("#auditForm"),
                end: function () {
                    vm.auditForm = false;
                    layer.closeAll();
                }
            });
            vm.auditForm = true;
        },
        del: function (advertNos) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/advert/delete",
                    contentType: "application/json",
                    data: JSON.stringify(advertNos),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },

        //启用
        isAvailable: function (data) {
            vm.advert.advertNo = data.advertNo;
            vm.advert.isAvailable = 1;
            confirm('确定要启用选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/advert/isAvailable",
                    contentType: "application/json",
                    data: JSON.stringify(vm.advert),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        //停用
        available: function (data) {
            vm.advert.advertNo = data.advertNo;
            vm.advert.isAvailable = 0;
            confirm('确定要停用选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/advert/isAvailable",
                    contentType: "application/json",
                    data: JSON.stringify(vm.advert),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function (event) {
            layedit.sync(vm.layeditIndex);
            vm.advert.text = encodeURI(layedit.getContent(vm.layeditIndex));
            //保存前判断广告类型     1  轮播广告   2 楼层广告
            var advertType = vm.advert.advertType;
            //位置
            var ranking = vm.advert.ranking;
            //轮播类型
            var carouselType =vm.advert.carouselType;
            //广告名称
            var advertName = vm.advert.advertName;
            //广告区分跳转类型  1 外部链接  2 内容  3产品
            var jumpType = vm.advert.jumpType;
            //外部链接
            var linkUrl = vm.advert.linkUrl;
            //内容
            var text = vm.advert.text;
            //图片
            var advertPicUrl =vm.advert.advertPicUrl;
            //是否有咨询栏
            var  whether=vm.advert.whether;

            //判断广告类型是否为空
            if (advertType == "" || advertType == null) {
                alert("广告类型不能为空");
                return;
            }
            //广告类型为轮播广告时
            if(advertType==1){
                //判断位置不为空
                if (ranking == "" || ranking == null) {
                    alert("位置不能为空");
                    return;
                }else {
                    var regu = /^[1-9]{1,}[\d]*$/;
                    if (!regu.test(ranking)) {
                        alert("位置只能输入正整数");
                        return;
                    }
                }
                //判断轮播类型不为空
                if (carouselType == "" || carouselType == null) {
                    alert("轮播类型不能为空");
                    return;
                }
                //判断广告名称不为空
                if (advertName == "" || advertName == null) {
                    alert("广告名称不能为空");
                    return;
                }
                //判断跳转类型不为空
                if (jumpType == "" || jumpType == null) {
                    alert("跳转类型不能为空");
                    return;
                } else {
                    if (jumpType == 1) {
                        //外部链接  判断外部链接是否为空
                        if (linkUrl == "" || linkUrl == null) {
                            alert("外部链接不能为空");
                            return;
                        }
                    } else if (jumpType == 2) {
                        //富文本域默认会有一个值所以要过滤掉
                        if (text == "" || text == null || text == '%3Cbr%3E') {
                            alert("内容不能为空");
                            return;
                        }
                    }
                }

                if (!(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(advertPicUrl))) {
                    alert('请上传广告图片');
                    return;
                }

            }
            //广告类型为活动广告时
            if(advertType==3){
                //判断位置不为空
                if (ranking == "" || ranking == null) {
                    alert("位置不能为空");
                    return;
                }else {
                    var regu = /^[1-9]{1,}[\d]*$/;
                    if (!regu.test(ranking)) {
                        alert("位置只能输入正整数");
                        return;
                    }
                }
                //判断轮播类型不为空
                if (carouselType == "" || carouselType == null) {
                    alert("轮播类型不能为空");
                    return;
                }
                //判断广告名称不为空
                if (advertName == "" || advertName == null) {
                    alert("活动广告标题不能为空");
                    return;
                }
                //判断跳转类型不为空
                if (jumpType == "" || jumpType == null) {
                    alert("跳转类型不能为空");
                    return;
                }
                if (!(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(advertPicUrl))) {
                    alert('请上传广告图片');
                    return;
                }
                if(whether == "" || whether == null){
                    alert("是否有咨询栏不能为空");
                    return;
                }

            }


            var url = vm.advert.advertNo == null ? "car/advert/save" : "car/advert/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.advert),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        //审核确认
        saveCensorStatusForm: function () {
            var url = "car/advert/audit";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.advert),
                success: function (r) {
                    if (r.advert != 0) {
                        alert('操作成功', function (index) {
                            layer.closeAll();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },

        exports: function () {
            var url = baseURL + 'car/advert/export';
            if (vm.q.keyword != null) {
                url += '?keyword=' + vm.q.keyword;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    advertName: vm.q.advertName,
                    advertType: vm.q.advertType,
                    censorStatus: vm.q.censorStatus,
                    isAvailable: vm.q.isAvailable
                }
            });
        },
        selectFile: function (index) {
            vm.selectFileIndex = index;
            $("#uploadFile").trigger("click");
        },
        uploadFile: function (type) {
            if (type == 'advert') {
                if (!vm.files || !vm.files.length || vm.files.length == 1) {
                    alert("请选择上传文件");
                    return;
                }
            }

            var formData = new FormData();
            for (var i in vm.files) {
                formData.append('files', vm.files[i]);
            }
            formData.append('path', 'advert_pic');
            $.ajax({
                type: "POST",
                url: baseURL + "car/advert/upload",
                data: formData,
                dataType: "JSON",
                contentType: false,
                processData: false,
                success: function (r) {
                    if (r.code === 0) {
                        var filePaths = r.data;
                        if (type == 'advert') {
                            vm.advert.advertPicUrl = filePaths[0];
                        }
                        vm.files = [];
                        alert('操作成功', function (index) {

                        });
                    } else {
                        alert(r.msg);
                    }
                },
                error: function (r) {

                }
            });
        },
    }
});
