$(function () {
    var warehouseId = window.localStorage.getItem("warehouseId");
    vm.type = window.localStorage.getItem("type");
    if (vm.type == "0") {
        vm.sendData(warehouseId);
    } else {
        vm.q.depotId = null;
    }
    vm.carOperationalDataInit();
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form', "jquery", "cascader", "form"], function () {
        var cascader = layui.cascader;
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            vm.selectData = r.carTreeVoList;
            cascader({
                elem: "#a",
                data: vm.selectData,
                success: function (valData, labelData) {
                    vm.q.brandId = valData[0];
                    vm.q.brandName = labelData[0];
                    vm.q.seriesId = valData[1];
                    vm.q.seriesName = labelData[1];
                    vm.q.modelId = valData[2];
                    vm.q.modelName = labelData[2];
                }
            });
        });
    });

    layui.use('form', function () {
        vm.changeStatus({name: '备发车'}, 3);
        layui.form.render();
    });
    //查询条件下来监听start
    layui.form.on('select(sourceType)', function (data) {
        vm.q.sourceType = data.value;
    });
    layui.form.on('select(qstoreId)', function (data) {
        vm.q.storeId = data.value;
    });
    layui.form.on('select(carPowerSelect)', function (data) {
        vm.q.carPower = data.value;
    });
    layui.form.on('select(vehicleStatusSelect)', function (data) {
        vm.q.vehicleStatus = data.value;
    });

    layui.form.on('select(qbusinessType)', function (data) {
        vm.q.businessType = data.value;
        if (data.value == '3') {
            vm.q.tabType = '5';
            layui.element.tabChange('tabData', '5');
        } else if (data.value == '6') {
            vm.q.tabType = '10';
            layui.element.tabChange('tabData', '10');
        } else if (data.value == '4') {
            vm.q.tabType = '6';
            layui.element.tabChange('tabData', '6');
        } else if (data.value == '1') {
            vm.q.tabType = '7';
            layui.element.tabChange('tabData', '7');
        } else {
            vm.q.tabType = '1';
            layui.element.tabChange('tabData', '1');
        }
    });

    layui.use('element', function () {
        layui.element.on('tab(tabData)', function () {
            var id = this.getAttribute('lay-id');
            if (id == '1' || id == '5' || id == '6' || id == '7' || id == '10' || id == '12') {
                $("#title2 li").each(function (index, item) {
                    if ($(this).hasClass('layui-this')) {
                        $(this).removeClass('layui-this')
                    }
                });
            } else if (id == '2' || id == '3' || id == '4' || id == '11') {
                $("#title1 li").each(function (index, item) {
                    if ($(this).hasClass('layui-this')) {
                        $(this).removeClass('layui-this')
                    }
                });
            }
            if (id == '6') {
                vm.q.businessType = '4';
            } else if (id == '7') {
                vm.q.businessType = '1';
            } else if (id == '10') {
                vm.q.businessType = '6';
            } else if (id == '5') {
                vm.q.businessType = '3';
            } else if (id == '12') {
                vm.q.businessType = '7';
            } else {
                vm.q.businessType = '';
            }
            vm.q.tabType = id;
            vm.reload();
        });
    });

    layui.form.on('select(qmodelId)', function (data) {
        vm.q.modelId = data.value;
    });

    //监听查询条件品牌下拉列表监听
    layui.form.on('select(brandIdSelect)', function (data) {
        var brandId = data.value;
        vm.q.carBrandId = data.value;
        //通过品牌id 查询对应的车系
        $.ajax({
            type: "POST",
            async: false,
            url: baseURL + "car/tcarmodel/queryModelByBrandId/" + (brandId == null || brandId == '' ? '0' : brandId),
            contentType: "application/json",
            success: function (r) {
                vm.carModels = r.tCarModel;
                vm.q.modelId = null;
            }
        });

    });

    $('div[type="updateTimeType"]>div').on('click', function () {
        var selected = $(this);
        $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "updateTimeStr", '');
        vm.q.updateTimeType = value;
    });

    //查询时间
    layui.laydate.render({
        elem: '#updateTimeStr',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.updateTimeStr = value;
            vm.q.updateTimeType = null;
        }

    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data);
        } else if (layEvent === 'details') {
            vm.detail(data.carId);
        } else if (layEvent === 'collect') {
            vm.collect(data.carId, data.businessType);
        } else if (layEvent === 'notice') {
            vm.notice(data.carId, data.businessType);
        } else if (layEvent === 'transfer') {
            vm.transfer(data);
        } else if (layEvent === 'disposal') {
            vm.disposal(data);
        } else if (layEvent === 'cancelDisposal') {
            vm.cancelDisposal(data);
        } else if (layEvent === 'updatermark') {
            vm.updatermark(data);
        } else if (layEvent === 'vehicleCard') {
            vm.vehicleCard(data);
        } else if (layEvent === 'vehicleTrack') {
            vm.vehicleTrack(data)
        }else if (layEvent ==='solveIllegal') {
            vm.solveIllegal(data)
        }else if (layEvent ==='addBaoYang') {
            vm.addBaoYang(data)
        }else if (layEvent ==='addYearCheck') {
            vm.addYearCheck(data)
        }else if (layEvent ==='xuBao') {
            vm.xuBao(data)
        }else if (layEvent ==='xuZu') {
            vm.xuZu(data)
        }
        else if (layEvent === 'detailsOrEdit') {
            vm.detailsOrEdit(data)
        }else if (layEvent === 'mmvMore') {
            var mmvDropDonw = $(obj.tr[1]).find('.mmv-dropdonw');
            var wrap = mmvDropDonw.find('.mmv-dropdonw-wrap');
            var top = mmvDropDonw.offset().top;
            var left = mmvDropDonw.offset().left;
            var scroll = $(window).scrollTop();
            if ($(window).height()<top - scroll + 20+ wrap.height()){
                wrap.css('bottom', 0);
            }else{
                wrap.css('top', top - scroll + 20 + 'px');
            }
            wrap.css('left', left + 30 + 'px');
            wrap.show();
            setTimeout(()=> {
                $(window).one('click', function() {
                    wrap.hide();
                });
                $(window).one('scroll', function() {
                    wrap.hide();
                });
            },300);
        }
    });
    layui.table.on('radio(grid)', function(obj){
        // if(obj.checked==true){
        //     if(vm.data !=null){
        //         alert("通用按钮只支持单选");
        //         obj.checked=false;
        //         return;
        //     }
        //     if(obj.type=='all'){
        //         alert("通用按钮只支持单选")
        //         return;
        //     }
            vm.data=obj.data;
        // }else{
        //     vm.data=null;
        // }

    });
    //导入 用layui upload插件
    layui.use(["element", "laypage", "layer", "upload"], function () {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#imp',
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

    layui.use(["element", "laypage", "layer", "upload"], function () {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#sorffff',
            url: baseURL + 'car/tcarbasic/carPurImport',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            done: function (r) {
                if (r.resultFlag == 3 || r.resultFlag == 1) {
                    alert(r.msg);
                    layer.confirm(r.msg, {
                        btn: ['下载错误数据', '取消'] //可以无限个按钮
                    }, function (index, layero) {
                        window.location.href = baseURL + 'car/tcarbasic/exportresouresExcel?numberNo=' + r.numberNo;
                    }, function (index) {
                        layer.close(index);
                    });
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
});

var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url: "nourl"
        }
    }
};
var depotSelect;
var ztree;
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            businessType: null,
            keyword: null,
            deptId: null,
            deptName: null,
            deptIdList: [],
            deptIdListStr: null,
            deptNameList: [],
            deptNameListStr: null,
            depotName: null,
            depotId: null,
            modelId: null,
            modelName: null,
            brandId: null,
            brandName: null,
            seriesId: null,
            seriesName: null,
            purchaseSupplierName: null,
            engineNo: null,
            sumOdograph: null,
            carType: null,
            carOwner: null,
            remark: null,
            updateTimeStr: null,
            updateTimeType: null,
            vehicleStatus: null,
            sourceType: null,
            carPower:null,
            // 车辆所属仓库zTree对象
            deptZtreeObj:null
        },
        data:null,
        statusCar: [],
        typeCar: [],
        typeCar2: [],
        selectData: [],
        showForm: false,
        collectForm: false,
        collectVoInfor: {},
        allCarBrand: [],
        carModels:[],
        carModelsAll: [],
        cols: [],
        user: {
            status: 1,
            deptId: null,
            deptName: null,
            roleIdList: [],
            deptIdList: []
        },
        statusCarIndex: 0,
        typeCarIndex: -1,
        typeCarIndex1: -1,
        //仓库数据源
        warehouseData: {},
        //区分跳转
        type: "1",

        isFilter: false,
        carPowerData:[]
    },
    computed: function () {

    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param != undefined && param != null) {
            _this.q.businessType = param.businessType;
        }
        $.getJSON(baseURL + "car/tcarbrand/listAll", function (r) {
            _this.allCarBrand = r.carBrands;
        });
        $.getJSON(baseURL + "car/tcarmodel/queryModelByBrandId/0", function (r) {
            _this.carModels = r.tCarModel;
        });
        $.getJSON(baseURL + "sys/dict/getInfoByType/carPower", function (r) {
            _this.carPowerData = r.dict;
        });
        this.getCarNo()
    },
    updated: function () {
        layui.form.render();
    },
    mounted() {

    },
    methods: {
        // 车辆监控跳转赋值车牌号
        getCarNo() {
            let carNo = localStorage.getItem('carNo');
            console.log('localStorage', carNo);
            if(carNo !== null && carNo !== 'null' && carNo !== undefined){
                this.q.keyword = carNo;
            }
        },

        // 高级筛选
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },

        // 车辆轨迹
        vehicleTrack(data) {
            data=vm.data;
            if(data==undefined){
                alert("请选中一条记录");
                return ;
            }
            let larryId = 'larry-904';
            if (data) {
                let car = {
                    carNo: data.carNo,
                    depotName: data.depotName,
                    deptId: data.deptId
                }
                localStorage.setItem('monitoringCar', JSON.stringify(car))
            }
            top.parent.window.larryTab.tabAdd({
                title: '车辆监控',
                href: tabBaseURL + 'modules/car/vehiclemonitoringpage.html',
                id: larryId
            })
            return false;
        },

        demo() {
            let content = `<iframe class="larryms-iframe" src="${url}" frameborder="no" border="0"></iframe>`
            top.parent.layui.element.tabAdd('larryTab', {
                title: '车辆监控23',//用于演示
                content: content,
                //content: '<iframe tab-id="' + id + '" frameborder="0" src="' + url + '" scrolling="yes" class="x-iframe"></iframe>',
                id: 99 //实际使用一般是规定好的id，这里以时间戳模拟下
            })
            top.parent.layui.element.tabChange('larryTab', 99)
        },

        vehicleCard: function (data) {
            data=vm.data;
            if(data==undefined){
                alert("请选择需要换牌的车辆");
                return ;
            }
            var index = layer.open({
                title: "车辆换牌",
                type: 2,
                content: tabBaseURL + "modules/car/vehicleCarNo.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.tCarBasic = data;
                    iframe.vm.tCarBasic.brandModel = data.carBrandSeriesModelName;
                    iframe.vm.tCarBasic.imgDrivinglicenseFront1 = data.imgDrivinglicenseFront;
                    if (data.imgDrivinglicenseFront != null && data.imgDrivinglicenseFront != '') {
                        iframe.vm.tCarBasic.imgDrivinglicenseFront = imageURL + data.imgDrivinglicenseFront;
                        iframe.vm.vehicleCar = {
                            carOwner: data.carOwner,
                            carType: data.carType,
                            carOwnerAddr: data.carOwnerAddr,
                            useType: data.useType,
                            carModelNo: data.carModelNo,
                            registerDate: data.registerDate,
                            licenseDate: data.licenseDate,
                            documentNo: data.documentNo,
                            userNum: data.userNum,
                            carWeight: data.carWeight,
                            isVehicleCarPhoto: 1
                        }
                    } else {
                        iframe.vm.tCarBasic.imgDrivinglicenseFront = '../../statics/images/upload@2x.png';
                    }
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        initDepotData: function () {
            $.ajax({
                type: "post",
                async: false,
                url: baseURL + 'car/tcarbasic/initDepotData',
                data: {},
                success: function (r) {
                    // var datas = [];
                    // initDepotTree(datas, r.depotData);
                    // console.log(datas);
                    // depotSelect.update({
                    //     data: r.depotData
                    // });
                    xmSelect.render({
                        el: '#selectDepot',
                        language: 'zn',
                        model: {
                            label: { type: 'text' },
                        },
                        iconfont:{
                            select:'fa fa-file',
                            unselect:'fa fa-file-o',
                            parent:'hidden'
                        },
                        clickClose: true,
                        repeat: true,
                        radio: true,
                        prop: {
                            name: 'field',
                            value: 'id',
                        },
                        tree: {
                            show: true,
                            strict: false,
                            expandedKeys: [ 'cksjtj' ],
                        },
                        on: function(data){
                            if (data.arr.length > 0){
                                var id = data.arr[0].id
                                if (id === 'wszck') {
                                    //未设置仓库
                                    vm.q.depotId = 'wszck';
                                } else if (id === 'qbck') {
                                    //全部仓库
                                    vm.q.depotId = 'qbck';
                                } else if (id === 'qbcl') {
                                    //全部车辆
                                    vm.q.depotId = null;
                                } else if (id === 'cksjtj') {
                                    //根节点：仓库数据统计
                                    vm.q.depotId = 'qbck';
                                } else {
                                    vm.q.depotId = id;
                                    vm.q.depotName = data.arr[0].title;
                                }
                              //  vm.reload();
                            }
                        },
                        data: r.depotData
                    });
                    vm.q.depotId = null;
                    setTimeout(function(){
                        var cksjtj = $('div[value="cksjtj"]');
                        cksjtj.addClass('disabled');
                    }, 100)
                    // layui.use(['tree'], function () {
                    //     var tree = layui.tree;
                    //     tree.render({
                    //         elem: '#demo1',
                    //         id: 'demo1id',
                    //         data: r.depotData,
                    //         showCheckbox: false,
                    //         click: function (obj) {
                    //             var id = obj.data.id;
                    //             var depotName = obj.data.field;
                    //             if (id == 'wszck') {
                    //                 //未设置仓库
                    //                 vm.q.depotId = 'wszck';
                    //             } else if (id == 'qbck') {
                    //                 //全部仓库
                    //                 vm.q.depotId = 'qbck';
                    //             } else if (id == 'cksjtj') {
                    //                 //根节点：仓库数据统计
                    //                 vm.q.depotId = 'qbck';
                    //             } else {
                    //                 vm.q.depotId = id;
                    //                 vm.q.depotName = depotName;
                    //             }
                    //             vm.reload();
                    //         }
                    //     });
                    // });
                }
            });
        },
        disposal: function (data) {
            var index = layer.open({
                title: "车辆处置",
                type: 2,
                content: tabBaseURL + "modules/car/tcardisposal.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.carDisposal = {
                        carNo: data.carNo,
                        vinNo: data.vinNo,
                        carBrandSeriesModelName: data.carBrandSeriesModelName,
                        depotName: data.depotName,
                        storageTime: data.storageTime,
                        carId: data.carId
                    };
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        cancelDisposal: function (data) {
            var index = layer.open({
                title: "撤销处置",
                type: 2,
                content: tabBaseURL + "modules/car/canceldisposal.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    if (data.depotId == null || data.depotId == '') {
                        iframe.vm.tCarBasic = {carId: data.carId};
                    } else {
                        $.ajax({
                            type: "POST",
                            url: baseURL + "warehouse/warehouse/info/" + data.depotId,
                            contentType: "application/json",
                            data: {},
                            success: function (r) {
                                if (r.warehouse != null && r.warehouse != '') {
                                    iframe.vm.tCarBasic = {
                                        carId: data.carId,
                                        depotId: data.depotId,
                                        depotName: r.warehouse.warehouseName
                                    };
                                } else {
                                    iframe.vm.tCarBasic = {carId: data.carId, depotId: data.depotId};
                                }
                            }
                        });
                    }
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        sendData: function (warehouseId) {
            vm.q.depotId = warehouseId;
            vm.type = "1";
            window.localStorage.setItem("warehouseId", "");
            window.localStorage.setItem("type", "1");
        },

        deptTree: function (multiple) {
            // 是否多选 1是0否
            multiple = multiple|0;
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: `${tabBaseURL}modules/common/selectdeptcommon.html?multiple=${multiple}`,
                end: function () {
                    layer.close(index);
                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.q, "deptId", treeNode.deptId);
            Vue.set(vm.q, "deptName", treeNode.name);
            layer.closeAll();
        },
        // 部门树多选
        zTreeOnCheck: function (event, treeId, treeNode){
            var checkedNodes = vm.q.deptZtreeObj.getCheckedNodes(true)
            vm.q.deptIdList=[];
            vm.q.deptNameList=[];
            vm.q.deptNameListStr = vm.q.deptNameList.join(',');
            vm.q.deptIdListStr = vm.q.deptIdList.join(',');
            if(!checkedNodes||checkedNodes.length==0){
                return false;
            }
            for (let i = 0; i < checkedNodes.length; i++) {
                vm.q.deptIdList.push(checkedNodes[i].deptId);
                vm.q.deptNameList.push(checkedNodes[i].name);
            }
            vm.q.deptNameListStr = vm.q.deptNameList.join(',');
            vm.q.deptIdListStr = vm.q.deptIdList.join(',');
            return false;
        },
        chooseWarehouse: function () {
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function () {
                    vm.q = Object.assign({}, vm.q, {
                        depotId: vm.warehouseData.warehouseId,
                        depotName: vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },
        down: function () {
            window.location.href = baseURL + "file/download?uri=excelModel/carimport.xlsx&fileName=车辆导入模板.xls";
        },
        expAll: function () {
            window.location.href = urlParamByObj(baseURL + 'car/tcarbasic/hulkExport', vm.q);
        },
        exp: function () {
            window.location.href = urlParamByObj(baseURL + 'car/tcarbasic/export', vm.q);
        },

        carPurImport: function () {
            //导入 用layui upload插件
            layui.use(["element", "laypage", "layer", "upload"], function () {
                var upload = layui.upload;//主要是这个
                upload.render({ //允许上传的文件后缀
                    elem: '#sorffff',
                    url: baseURL + 'car/tcarbasic/carPurImport',
                    accept: 'file', //普通文件
                    exts: 'xlsx|xls', //只允许上传excel
                    done: function (r) {
                        if (r.resultFlag == 3) {
                            alert(r.msg);
                        } else {
                            layer.confirm(r.msg, {
                                btn: ['下载错误日志', '取消'] //可以无限个按钮
                            }, function (index, layero) {
                                window.location.href = baseURL + 'car/tcarbasic/exportExcel?numberNo=' + r.numberNo;
                            }, function (index) {
                                layer.close(index);
                            });
                        }
                        vm.reload();
                    }
                });
            });
        },
        initTableCols: function () {
            /**
             * 备发车车辆、整备中车辆
             */
            if (vm.q.businessType == 2 || vm.q.businessType == 1) {
                vm.cols = [[
                    {title: '操作', minWidth: 180, templet: '#barTpl', fixed: "left", align: "center"},
                    {
                        field: 'carNo', minWidth: 120, title: '车牌号',fixed: "left", align: "center", templet: function (d) {
                            return isEmpty(d.carNo);
                        }
                    },
                    {
                        field: 'vinNo', minWidth: 120, title: '车架号', align: "center", templet: function (d) {
                            return isEmpty(d.vinNo);
                        }
                    },
                    {
                        field: 'carBrandSeriesModelName',
                        minWidth: 120,
                        title: '品牌/车系/车型',
                        align: "center",
                        templet: function (d) {
                            return isEmpty(d.carBrandSeriesModelName);
                        }
                    },
                    {
                        field: 'hpName',
                        minWidth: 120,
                        title: '号牌种类',
                        align: "center",
                        templet: function (d) {
                            return isEmpty(d.hpName);
                        }
                    },
                    {
                        field: 'carStatus', minWidth: 120, title: '车辆状态', align: "center", templet: function (d) {
                            return isEmpty(d.carStatus);
                        }
                    },
                    {
                        field: 'carPowerStr', minWidth: 120, title: '动力类型', align: "center", templet: function (d) {
                            return isEmpty(d.carPowerStr);
                        }
                    },
                    {field: 'carInspection', minWidth: 120, title: '年检', align: "center"},
                    {field: 'carInsurance', minWidth: 120, title: '保险', align: "center"},
                    {
                        field: 'carOwner', minWidth: 120, title: '车辆所有人', align: "center", templet: function (d) {
                            return isEmpty(d.carOwner);
                        }
                    },
                    {
                        field: 'sourceType', minWidth: 120, title: '车辆来源', align: "center", templet: function (d) {
                            return transformTypeByMap(d.sourceType, {1:'直购', 2:'经租', 3:'以租代购', 4:'挂靠车'});
                        }
                    },
                    /*{
                        field: 'gpsStatus', minWidth: 120, title: 'GPS状态', align: "center", templet: function (d) {
                            return isEmpty(d.gpsStatus);
                        }
                    },*/
                    {
                        field: 'useMileAge', minWidth: 120, title: '实时里程数', align: "center", templet: function (d) {
                            return isEmpty(d.useMileAge);
                        }
                    },
                    {
                        field: 'deptName', minWidth: 120, title: '所属部门', align: "center", templet: function (d) {
                            return isEmpty(d.deptName);
                        }
                    },
                    {
                        field: 'depotName', minWidth: 120, title: '车辆所在仓库', align: "center", templet: function (d) {
                            return isEmpty(d.depotName);
                        }
                    },
                    {
                        field: 'intoWarehouseDate',
                        minWidth: 120,
                        title: '入库时间',
                        align: "center",
                        templet: function (d) {
                            return isEmpty(d.intoWarehouseDate);
                        }
                    },
                    {
                        field: 'freeDays', minWidth: 120, title: '空置天数', align: "center", templet: function (d) {
                            return isEmpty(d.freeDays);
                        }
                    },
                    {
                        field: 'remark', minWidth: 120, title: '备注', align: "center", templet: function (d) {
                            return isEmpty(d.remark);
                        }
                    }
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
                    // height: 500,
                    url: baseURL + 'car/tcarbasic/waitingOperatedCarPage',
                    where: {
                        'businessType': vm.q.businessType,
                        'keyword': vm.q.keyword,
                        'deptId': vm.q.deptId,
                        'modelId': vm.q.modelId,
                        'brandId': vm.q.brandId,
                        'seriesId': vm.q.seriesId,
                        'depotId': vm.q.depotId,
                        'depotName': vm.q.depotName,
                        'updateTimeStr': vm.q.updateTimeStr,
                        'updateTimeType': vm.q.updateTimeType,
                        'vehicleStatus': vm.q.vehicleStatus,
                        'sourceType': vm.q.sourceType,
                        'carPower':vm.q.carPower,
                        'deptIdListStr':vm.q.deptIdListStr
                    },
                    //	toolbar: true,
                    //	defaultToolbar: ['filter'],
                    cols: vm.cols,
                    page: true,
                    loading: false,
                    limits: [10, 50, 100, 200],
                    limit: 10,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        // vm.data=null;
                        $('div[lay-id="grid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });
            });
        },
        changeStatus: function (item, index) {
            vm.index=null;
            vm.typeCarIndex = -1;
            vm.typeCarIndex1 = -1;
            vm.statusCarIndex = index;
            if (item.name == '全部车辆') {
                vm.q.businessType = null;
            }else if (item.name == '用车中') {
                vm.q.businessType = 4;
            } else if (item.name == '预定中') {
                vm.q.businessType = 3;
            } else if (item.name == '备发车') {
                vm.q.businessType = 2;
            } else if (item.name == '整备中') {
                vm.q.businessType = 1;
            }
            vm.initDepotData();
            vm.initTableCols();
            vm.initStatusCar();

        },
        mouseout:function (){
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        move:function (value) {
            var id="#"+value;
            var content = "";
            if(value == '1'){
                content = "说明:用车中是指下单已交车<br/>的状态"
            } else if(value == '2'){
                content = "说明：预定中是指下单已选车<br/>辆还未交车的状态；"
            } else if(value == '3'){
                content = "说明：做好发车的准备了，随时发车,只有在备发车状态的车辆<br/>才能进行下单;";
            } else if(value == '4'){
                content = "说明:新增车辆都为整备中";
            }else if(value == '0'){
                content = "说明:所有车辆信息";
            }
            if(!vm.subtips){
                vm.openMsg(id,content,value);
            }
        },
        openMsg:function (id,content,value) {
            vm.subtips = layer.tips(content, id, {tips: 1});
        },
        carOperationalDataInit: function () {
            var item;
            var index;
            if (vm.q.businessType == null || vm.q.businessType == '') {
                item = {name: '全部车辆'};
                index = 0;
                vm.changeStatus(item, index);
            } else if (vm.q.businessType == 4) {
                item = {name: '用车中车辆'};
                index = 1;
                vm.changeStatus(item, index);
            } else if (vm.q.businessType == 3) {
                item = {name: '预定中车辆'};
                index = 2;
                vm.changeStatus(item, index);
            } else if (vm.q.businessType == 2) {
                item = {name: '备发车'};
                index = 3;
                vm.changeStatus(item, index);
            } else if (vm.q.businessType == 1) {
                item = {name: '整备中'};
                index = 4;
                vm.changeStatus(item, index);
            } else if (vm.q.businessType == 5) {
                item = {name: '已过户'};
                index = 15;
                vm.changeType(item, index);
            } else if (vm.q.businessType == 18) {
                item = {name: '维修中'};
                index = 14;
                vm.changeType(item, index);
            } else if (vm.q.businessType == 13) {
                item = {name: '租赁到期车辆'};
                index = 8;
                vm.changeType(item, index);
            } else if (vm.q.businessType == 19) {
                item = {name: '处置车辆'};
                index = 16;
                vm.changeType(item, index);
            } else if (vm.q.businessType == 20) {
                item = {name: '已出售'};
                index = 17;
                vm.changeType(item, index);
            } else if (vm.q.businessType == 30) {
                item = {name: '故障车'};
                index = 13;
                vm.changeType(item, index);
            }
        },
        changeType: function (item, index) {
            vm.statusCarIndex = -1;
            vm.typeCarIndex = index;
            vm.typeCarIndex1 = -1;
            if (item.name == '待保养') {
                vm.q.businessType = 6;
            } else if (item.name == '待续保') {
                vm.q.businessType = 7;
            // } else if (item.name == '待续交强险') {
            //     vm.q.businessType = 21;
            } else if (item.name == '待年检') {
                vm.q.businessType = 8;
            } else if (item.name == '有违章') {
                vm.q.businessType = 9;
            } else if (item.name == 'GPS未安装车辆') {
                vm.q.businessType = 10;
            } else if (item.name == 'GPS离线车辆') {
                vm.q.businessType = 11;
            } else if (item.name == '信息不全车辆') {
                vm.q.businessType = 12;
            } else if (item.name == '租赁到期') {
                vm.q.businessType = 13;
            } else if (item.name == '展示车') {
                vm.q.businessType = 14;
            } else if (item.name == '试用车') {
                vm.q.businessType = 15;
            } else if (item.name == '备用车') {
                vm.q.businessType = 16;
            } else if (item.name == '纠纷车') {
                vm.q.businessType = 17;
            } else if (item.name == '已过户') {
                vm.q.businessType = 5;
            } else if (item.name == '维修中') {
                vm.q.businessType = 18;
            } else if (item.name == '处置车辆') {
                vm.q.businessType = 19;
            } else if (item.name == '已出售') {
                vm.q.businessType = 20;
            } else if (item.name == '故障车') {
                vm.q.businessType = 30;
            } else if (item.name == '租售-未过户') {
                vm.q.businessType = 31;
            } else if (item.name == '租售-已过户') {
                vm.q.businessType = 32;
            } else if (item.name == '直购-未过户') {
                vm.q.businessType = 33;
            } else if (item.name == '直购-已过户') {
                vm.q.businessType = 34
            } else if (item.name == '已过户'){
                vm.q.businessType = 5;
            }
            vm.initDepotData();
            vm.initTableCols();
            vm.initStatusCar();
        },
        changeType2: function (item, index) {
            vm.statusCarIndex = -1;
            vm.typeCarIndex = -1;
            vm.typeCarIndex1 = index;
            if (item.name == '待保养车辆') {
                vm.q.businessType = 6;
            } else if (item.name == '待续商业险') {
                vm.q.businessType = 7;
            } else if (item.name == '待续交强险') {
                vm.q.businessType = 21;
            } else if (item.name == '待年检') {
                vm.q.businessType = 8;
            } else if (item.name == '有违章') {
                vm.q.businessType = 9;
            } else if (item.name == 'GPS未安装车辆') {
                vm.q.businessType = 10;
            } else if (item.name == 'GPS离线车辆') {
                vm.q.businessType = 11;
            } else if (item.name == '信息不全车辆') {
                vm.q.businessType = 12;
            } else if (item.name == '租赁到期') {
                vm.q.businessType = 13;
            } else if (item.name == '展示车') {
                vm.q.businessType = 14;
            } else if (item.name == '试用车') {
                vm.q.businessType = 15;
            } else if (item.name == '备用车') {
                vm.q.businessType = 16;
            } else if (item.name == '纠纷车') {
                vm.q.businessType = 17;
            } else if (item.name == '维修中') {
                vm.q.businessType = 18;
            } else if (item.name == '处置车辆') {
                vm.q.businessType = 19;
            } else if (item.name == '已出售') {
                vm.q.businessType = 20;
            } else if (item.name == '故障车') {
                vm.q.businessType = 30;
            } else if (item.name == '租售-未过户') {
                vm.q.businessType = 31;
            } else if (item.name == '租售-已过户') {
                vm.q.businessType = 32;
            } else if (item.name == '直购-未过户') {
                vm.q.businessType = 33;
            } else if (item.name == '直购-已过户') {
                vm.q.businessType = 34
            } else if (item.name == '已过户'){
                vm.q.businessType = 5;
            }
            vm.initDepotData();
            vm.initTableCols();
            vm.initStatusCar();
        },
        initStatusCar: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getStatusCar",
                contentType: "application/json",
                data:JSON.stringify(vm.q),
                success: function (r) {
                    vm.statusCar = r.statusList;
                    vm.typeCar = r.typeList.filter(val=>['待保养','待续保','待年检','有违章','租赁到期'].includes(val.name));
                    vm.typeCar2 = r.typeList.filter(val=>['展示车','试用车','备用车','纠纷车','处置车辆','直购-未过户','直购-已过户','租售-未过户','租售-已过户',
                        '已过户'].includes(val.name));
                }
            });
        },
        reset: function () {
            vm.q = {
                keyword: null,
                deptId: null,
                deptName: null,
                depotName: null,
                depotId: null,
                modelId: null,
                modelName: null,
                brandId: null,
                brandName: null,
                seriesId: null,
                seriesName: null,
                purchaseSupplierName: null,
                engineNo: null,
                sumOdograph: null,
                carType: null,
                carOwner: null,
                remark: null,
                updateTimeStr: null,
                updateTimeType: null,
                vehicleStatus: null,
                sourceType: null,
                carPower:null,
                //region 清空所属车辆条件
                deptZtreeObj:null,
                deptIdList: [],
                deptIdListStr: null,
                deptNameList: [],
                deptNameListStr: null,
                //endregion
            }
            $('#a').val('');
            $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.initDepotData();
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            var index = layer.open({
                title: "新增",
                type: 2,
                content: tabBaseURL + "modules/car/tcarbasicadd.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.workType = 1;
                    iframe.vm.showDiv();
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        update: function (data) {
            if (data.businessType == 6 && data.openFlow == 0) {
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/disposal/info/" + data.carId,
                    contentType: "application/json",
                    data: {},
                    success: function (r) {
                        var index = layer.open({
                            title: "车辆处置",
                            type: 2,
                            content: tabBaseURL + "modules/car/tcardisposal.html",
                            success: function (layero, num) {
                                var iframe = window['layui-layer-iframe' + num];
                                iframe.vm.carDisposal = {
                                    carNo: data.carNo,
                                    vinNo: data.vinNo,
                                    carBrandSeriesModelName: data.carBrandSeriesModelName,
                                    depotName: data.depotName,
                                    storageTime: data.storageTime,
                                    carId: data.carId,
                                    disposalReason: r.carDisposal.disposalReason,
                                    disposalTime: r.carDisposal.disposalTime,
                                    remark: r.carDisposal.remark,
                                    id: r.carDisposal.id
                                };
                                iframe.vm.deliveryFileLst = r.carDisposal.fileLst;
                            },
                            end: function () {
                                layer.closeAll();
                            }
                        });
                        layer.full(index);
                    }
                });
            } else {
                var index = layer.open({
                    title: "修改车辆信息",
                    type: 2,
                    content: tabBaseURL + "modules/car/tcarbasicadd.html",
                    success: function (layero, num) {
                        var iframe = window['layui-layer-iframe' + num];
                        iframe.vm.initEditData(data.carId);
                        iframe.vm.workType = 2;
                        iframe.vm.hideDiv();
                    },
                    end: function () {
                        vm.showForm = false;
                        layer.closeAll();
                    }
                });
                vm.showForm = true;
                layer.full(index);
            }
        },
        detail: function (carId,data) {
            var index = layer.open({
                title: "车辆详情",
                type: 2,
                content: tabBaseURL + "modules/car/tcarbasicdetail.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initEditData(carId,vm.q.businessType);
                },
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
        notice: function (carId, businessType) {
            console.log(carId + '----------' + businessType);
            var index = layer.open({
                title: "租赁到期通知",
                type: 2,
                content: tabBaseURL + "modules/common/messageNoticeCommon.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.messageNotice.businessId = carId;
                    iframe.vm.messageNotice.businessType = 7;
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        collect: function (carId, businessType) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/carcollect/getStartCarCollectByCarId",
                data: {"carId": carId, "businessType": businessType},
                async:false,
                success: function (r) {
                    if (r.code === 0) {
                        var index=layer.open({
                            type: 2,
                            title: '发起强制收车',
                            content: tabBaseURL + 'modules/car/collect.html',
                            success: function (layero, index) {
                                var iframe = window['layui-layer-iframe' + index];
                                // 向子页面的全局函数child传参
                                iframe.toChildren(r.carCollectInfo);
                            },end:function(){
                                layer.closeAll();
                            }
                        });
                        layer.full(index);
                    } else {
                        alert(r.msg)
                    }
                }
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'car/tcarbasic/export', vm.q);
        },
        excelUpdate: function () {
            var url = baseURL + 'car/tcarbasic/excelUpdate';
            window.location.href = url;
        },
        reload: function (event) {
            window.localStorage.getItem("warehouseId", null);
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    keyword: vm.q.keyword,
                    businessType: vm.q.businessType,
                    deptId: vm.q.deptId,
                    modelId: vm.q.modelId,
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    depotId: vm.q.depotId,
                    depotName: vm.q.depotName,
                    purchaseSupplierName: vm.q.purchaseSupplierName,
                    engineNo: vm.q.engineNo,
                    sumOdograph: vm.q.sumOdograph,
                    carType: vm.q.carType,
                    carOwner: vm.q.carOwner,
                    remark: vm.q.remark,
                    updateTimeStr: vm.q.updateTimeStr,
                    updateTimeType: vm.q.updateTimeType,
                    vehicleStatus: vm.q.vehicleStatus,
                    sourceType: vm.q.sourceType,
                    carPower:vm.q.carPower,
                    deptIdListStr:vm.q.deptIdListStr
                }
            });
            vm.initStatusCar();
        },
        toRequest: function (url, data, callback) {
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (res) {
                    callback(res);
                }
            });
        },
        //移库方法
        transfer: function (data) {
            //判断是否开启工作流
            $.get(baseURL + "mark/processnode/startApply", {processKey: 'carMoveApprove',carId:data.carId}, function (r) {
                if(r.type === 3){
                    alert('已发起车辆调拨审核！');
                    return false;
                }else if (r.type === 2) {
                    var param = {
                        viewTag: 'apply',
                        data: data
                    };
                    var index = layer.open({
                        title: '车辆移库',
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/car/carmove.html",
                        success: function (layero, num) {
                            var iframe = window['layui-layer-iframe' + num];
                            iframe.vm.inOutRecordsInfor = Object.assign({}, iframe.vm.inOutRecordsInfor,
                                {vin: data.vinNo || '--'},
                                {carPlate: data.carNo || '--'},
                                {carId: data.carId || '--'},
                                {warehouseIdOld: data.depotId || '--'},
                                {depotName: data.depotName || '--'},
                                {carBrandSeriesModelName: data.carBrandSeriesModelName || '--'},
                                {storageTime: data.storageTime || '--'},
                                {deptName: data.deptName || '--'},
                                {modelId: data.modelId || '--'},
                                {deptId: data.deptId || '--'});
                        }
                    });
                    layer.full(index);
                } else {
                    var index = layer.open({
                        title: '车辆移库',
                        type: 2,
                        content: tabBaseURL + "modules/car/tcarbasictransfer.html",
                        success: function (layero, num) {
                            var iframe = window['layui-layer-iframe' + num];
                            iframe.vm.inOutRecordsInfor = Object.assign({}, iframe.vm.inOutRecordsInfor,
                                {vin: data.vinNo || '--'},
                                {carPlate: data.carNo || '--'},
                                {carId: data.carId || '--'},
                                {warehouseIdOld: data.depotId || '--'},
                                {depotName: data.depotName || '--'},
                                {carBrandSeriesModelName: data.carBrandSeriesModelName || '--'},
                                {storageTime: data.storageTime || '--'},
                                {modelId: data.modelId || '--'},
                                {deptName: data.deptName || '--'},
                                {deptId: data.deptId || '--'});
                        }
                    });
                    layer.full(index);
                }
            });
        },

        // 在租中车辆修改备注
        updatermark: function (data) {
            data=vm.data;
            if(data==undefined){
                alert("请选择需要备注的车辆");
                return ;
            }
            console.log(data)
            window.localStorage.setItem("carId", data.carId);
            window.localStorage.setItem("remark", data.remark);
            var index = layer.open({
                title: "修改车辆备注",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + 'modules/car/carremarkupdate.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("carId", null);
                    window.localStorage.setItem("remark", null);
                }
            });
        },
        // 违章查询列表
        gotoIllegal:function (){
            let url=tabBaseURL+'modules/car/carillegal.html';
            let title='违章查询';
            addTab(url,title);
        },
        // 违章查询
        solveIllegal:function (data){
            let param ={
                carNo: data.carNo
            };
            let url=tabBaseURL+'modules/car/carillegalquery.html';
            let title='违章查询';
            addTab(url,title,param);
        },
         // 新增保险
        gotoInsure:function (){
            let url=tabBaseURL+'modules/maintenance/insurancemanageadd.html';
            let title='保险管理';
            addTab(url,title);
        },
         //新建保养单
         gotoBaoYang:function (){
            let url=tabBaseURL+'modules/maintenance/maintenancemanageadd.html';
            let title='新建保养单';
            addTab(url,title);
        },
        //操作新建保养单
        addBaoYang:function (data){
            let param ={
                carId:data.carId
            };
            let url=tabBaseURL+'modules/maintenance/maintenancemanageadd.html';
            let title='新建保养单';
            addTab(url,title,param);
        },
        // 新增维修
        gotoMaintenance:function (){
            let url=tabBaseURL+'modules/carrepairorder/carrepairorderadd.html';
            let title='维修管理';
            addTab(url,title);
        },
        // 新增出险
        gotoDanger:function (){
            let url=tabBaseURL+'modules/outinsuranceorder/outinsuranceorderadd.html';
            let title='出险管理';
            addTab(url,title);
        },
        // 收车列表
        gotoSC:function (){
            let url=tabBaseURL+'modules/car/carcollect.html';
            let title='收车列表';
            addTab(url,title);
        },
        //新建年检
        gotoYearCheck:function (){
            let url=tabBaseURL+'modules/maintenance/inspectionmanageadd.html';
            let title='新建年检';
            addTab(url,title);
        },
        //操作新建年检
        addYearCheck:function (data){
            let param ={
                carId:data.carId
            };
            let url=tabBaseURL+'modules/maintenance/inspectionmanageadd.html';
            let title='新建年检';
            addTab(url,title,param);
        },
        // 批量导入
        batchImport:function(){
            // alert("正在迭代中")
            let param={
                type:0
            }

            var index = layer.open({
                title: "数据导入",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/import/dataimport_common.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                    // iframe.vm.initEditData(carId,vm.q.businessType);
                },
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
        xuBao:function (data){
            let param ={
                carId:data.carId
            };
            let url=tabBaseURL+'modules/maintenance/insurancemanageadd.html';
            let title='续保单';
            addTab(url,title,param);
        },

        xuZu:function (data){
            let param ={
                carId:data.carId
            };
            let url=tabBaseURL+'modules/order/orderrelerecordedit.html';
            let title='续租';
            addTab(url,title,param);

        },
        detailsOrEdit: function (data) {
            var index = layer.open({
                title: "车辆详情",
                type: 2,
                content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                    iframe.vm.initEditData(data.carId,vm.q.businessType,data);
                },
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
    }





});


function initDepotTree(target, res) {
    if (res){
        for (var re of res) {
            var item = {
                name:re.title,
                value:re.id,
            };
            var children = [];
            initDepotTree(children, re.children);
            if (children.length > 0){
                item.children = children;
            }
            target.push(item);
        }
    }
}
