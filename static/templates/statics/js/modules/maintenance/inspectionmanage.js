$(function () {
    initClick();
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    gridTable1 = layui.table.render({
        id: "compulsoryInsurance",
        elem: '#compulsoryInsurance',
        minWidth: 150,
        data: vm.stageDatalist,
        cols: [[
            {field: 'feeName', title: '账单类型',width:"240", align: "center"},
            {
                field: 'payMoney',width:"220", title: '应付金额/元', align: "center"
            },
            {
                field: 'payTime',width:"200", title: '应付日期', align: "center"
            },
            {
                field: 'isGenerateBill',width:"200", title: '生成应付账单', align: "center", templet: function (d) {
                    return `<input type='checkbox' id='contractSwitch11${d.index}' ${d.isGenerateBill ? 'checked' : ""} onlyName=${d.index} name='switchTest11' lay-skin='switch' lay-filter='switchTest11' title='是|否'>`
                }
            },
            {
                field: 'remark', width:"200",title: '备注', align: "center"
            },
            {
                title: '操作',width:"470", align: "center", templet: function (d) {
                    return " <a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'>重置</a>"
                }
            },
        ]],
        page: false,
        loading: false,
        limit: 500,
        // limits: [5, 10, 20]
    });

    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            autoSort: false,
            url: baseURL + 'maintenance/inspectionmanage/list',
            cols: [[
                {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
                {field: 'carNo', minWidth: 100, fixed: "left",align:"center",title: '车牌号', templet:function (d) {
                    return "<span style='color:#419BEA;cursor: pointer' onclick = jump(\'"+d.carId+"\')>"+d.carNo+"</span>";
                }},
                {
                    field: 'inspectionTime', minWidth: 100, sort: true, title: '年检时效', templet: function (d) {
                        var day = "";
                        if(d.remaining == null ){
                            return "未年检";
                        }else if (isNotEmpty(d.nextInspectionTime)) {
                            if(d.remaining == 0){
                                var hours = new Date().getHours();
                                day = "剩余" + (24 - hours) + "小时";
                            }else if (0 <= (d.remaining + d.fixed) && (d.remaining + d.fixed) <= d.fixed) {
                                var res = d.remaining.toString();
                                day = "剩余" + (res * -1) + "天";
                            } else if (0 < d.remaining) {
                                day = "超过" + d.remaining + "天";
                            } else {
                                day = "剩余" + Math.abs(d.remaining) + "天";
                            }
                        }
                        //if (d.inspectionStatus == 0) {
                        //     if(0 <= (d.remaining + d.fixed) && (d.remaining + d.fixed) <= d.fixed){
                        //         return "<span style='color:green;'>有效/" + day + "</span>";
                        //     }else if(0 < d.remaining){
                        //         return "<span style='color:red;'>失效/" + day + "</span>";
                        //     } else {
                        //         return "<span style='color:green;'>有效/" + day + "</span>";
                        //     }

                        if(d.remaining < 0){
                            return "<span style='color:green;'>有效/" + day + "</span>";
                        }else{
                            return "<span style='color:red;'>失效/" + day + "</span>";
                        }

                        // }else{
                        //     return "已年检";
                        // }

                    }
                },
                {field: 'thisTimeInspectionTime',  minWidth: 100, title: '本次年检时间'},
                {field: 'nextInspectionTime',  minWidth: 100, title: '下次年检时间'},
                {
                    field: 'carSta', minWidth: 100, title: '车辆状态', templet: function (d) {
                        if (d.carSta == 1) {
                            return "整备中";
                        } else if (d.carSta == 2) {
                            return "备发车";
                        } else if (d.carSta == 3) {
                            return "预定中";
                        } else if (d.carSta == 4) {
                            return "用车中";
                        } else if(d.carSta == 5){
                            return "已过户";
                        } else if(d.carSta == 6){
                            return "已处置";
                        } else if(d.carSta == 7){
                            return "已出售";
                        } else {
                            return isEmpty(d.carSta);
                        }
                    }
                },
                {field:'rentType', minWidth:150, title: '订单类型',align:"center",templet: function (d){
                        return getRentTypeStr(d.rentType);

                    }},
                {field: 'vinNo', minWidth: 100, title: '车架号'},
                {
                    minWidth: 100, title: '品牌/车系/车型', templet: function (d) {
                    return isEmpty(d.brandName) + "/" + isEmpty(d.carSeriesName) + "/" + isEmpty(d.modelName);

                }
                },
                {
                    field: 'carBelongCompany', minWidth: 100, title: '车辆归属', templet: function (d) {
                    return isEmpty(d.carBelongCompany);
                }
                },
                {
                    field: 'depotName', minWidth: 100, title: '所在仓库', templet: function (d) {
                        return isEmpty(d.depotName);
                    }
                },
                {
                    field: 'carOwner', minWidth: 100, title: '车辆所有人', templet: function (d) {
                    return isEmpty(d.carOwner);
                }
                },
                // {
                //     field: 'customerName',  minWidth: 100, title: '客户名称', templet: function (d) {
                //     if(d.customerName == null && d.customerTel == null){
                //         return "--";
                //     }else{
                //         var strHtml = "<div>";
                //         strHtml += "<span style=\"display:block;overflow-wrap:break-word;\">" + isEmpty(d.customerName ) + "," + isEmpty(d.customerTel) + "</span>";
                //         strHtml += "</div>";
                //         return strHtml;
                //     }
                // }
                // },

                // {
                //     minWidth: 100, title: '剩余天数', templet: function (d) {
                //         if(isNotEmpty(d.remaining)){
                //             if (0 <= (d.remaining + d.fixed) && (d.remaining + d.fixed) <= d.fixed) {
                //                 var res = d.remaining.toString();
                //                 return "剩余" + (res*-1) + "天";
                //             } else if ((d.remaining + d.fixed) > d.fixed) {
                //                 return "超过" + d.remaining + "天";
                //             } else {
                //                 return isEmpty(null);
                //             }
                //         }else{
                //             return '--';
                //         }
                //
                //     }
                // },


            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            // autoColumnWidth: {
            //     init: true
            // },
            done: function () {
                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            }
        });

        layui.table.on('sort(grid)', function(obj){
            for(var key in vm.q){
                if (key.endsWith('Sort')){
                    vm.q[key] = null;
                }
            }
            vm.q[obj.field+'Sort'] = obj.type;
            vm.reload(obj);

            console.log('服务端排序。order by '+ obj.field + ' ' + obj.type);
            // tableStyleAmendment();
        });
    });

    /**
     * 筛选监听
     */
    layui.use(['form', 'laydate'], function () {
        var form = layui.form;
        var laydate = layui.laydate;

        initDate(laydate);

        //部门下拉选
        form.on('select(dept)', function (data) {
            vm.q.dept = data.value;
        })
        //品牌车型下拉选
        form.on('select(brandAndCarModel)', function (data) {
            vm.q.brandAndCarModel = data.value;
        })
        //年检状态
        form.on('select(inspectionStatus)', function (data) {
            vm.q.inspectionStatus = data.value;
        })
        //车辆状态
        form.on('select(vehicleStatus)', function (data) {
            vm.q.vehicleStatus = data.value;
        })
        //车辆用途（租车类型）
        form.on('select(leaseType)', function (data) {
            vm.q.leaseType = data.value;
        })
        form.on('select(inspectionPayId)', function (data) {
            vm.inspectionManage.inspectionPayId = data.value;
        })

        //年检时间
        laydate.render({
            elem: '#inspectionDate',
            type: 'date',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.inspectionDate = value;
            }
        });

        selectBrandAndModel();
        form.render();
    });

    layui.table.on('tool(test1)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'del') {
            vm.stageDatalist.forEach(function (value) {
                if (value.index === data.index) {
                    value.isGenerateBill = 0
                    value.payTime = ''
                    value.remark = ''
                }
            });
            layui.table.reload('compulsoryInsurance', {
                data: vm.stageDatalist
            });
            initTableEdit();
        }
    });
     layui.form.on('switch(switchTest11)', function (obj) {
         // let a = $.trim($('#contractSwitch11').is(":checked"));
         let a = $.trim($('#' + obj.elem.id).is(":checked"));
         let data2 = obj.elem.attributes.onlyname.value
         if (a == 'true') {
             let list = vm.stageDatalist
             list.map((res, index) => {
                 if (res.index == data2) {
                     list[index].isGenerateBill = 1
                 }
             })
         } else {
             let list = vm.stageDatalist
             list.map((res, index) => {
                 if (res.index == data2) {
                     list[index].isGenerateBill = 0
                 }
             })
         }
     });
    initTableEdit();
    /**
     * 表单监听
     */
    layui.use(['form', 'laydate', 'upload'], function () {

        var form = layui.form;
        var laydate = layui.laydate;
        var upload = layui.upload;

        // 本次年检时间
        laydate.render({
            elem: '#thisTimeInspectionTime',
            type: 'date',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.inspectionManage.thisTimeInspectionTime = value
                vm.inspectionManage.inspectionYear = date.year;
                $("#inspectionYear").val(date.year);
            }
        });
        // 下次年检时间
        laydate.render({
            elem: '#nextInspectionTime',
            type: 'date',
            trigger: 'click',
            done: function (value) {
                vm.inspectionManage.nextInspectionTime = value;
            }
        });
        //年检附件
        uploadAttachment(upload);
        form.render();
    });

    //保存
    layui.form.on('submit(submitEditData)', function () {
        vm.saveOrUpdate();
        return false;
    });


    // 车辆保险导入
    layui.use(["element", "laypage", "layer", "upload"], function () {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#imp',
            url: baseURL + 'maintenance/inspectionmanage/import',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            done: function (r) {
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
            }
        });
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data.inspectionId,data.inspectionNumber, false);
        } else if (layEvent === 'detail') {
            vm.detail(data.inspectionId,data.carId, data.carNo, data.inspectionStatus,data.fixed,data.remaining,data.nextInspectionTime);
        } else if (layEvent === 'inspection') {
            vm.update(data.inspectionId,data.inspectionNumber, true);
        }
    });


});


/**
 * 查询品牌/车型
 */
function selectBrandAndModel() {
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectBrandAndModel",
        contentType: "application/json",
        success: function (res) {
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#brandAndCarModel').append(new Option(item.brandAndModel, item.brandAndModel));
            });
            layui.form.render("select");
        }
    });
}

var vm = new Vue({
    el: '#rrapp',
    data: {
        hetong:false,
        q: {
            carNoAndVinNo: null,
            deptId: null,
            dept: null,
            inspectionStatus: null,
            customerName: null,
            vehicleOrderNo: null,
            vehicleStatus: null,
            leaseType: null,
            city: null,
            inspectionNo: null,
            inspectionDate: null,
            depotId: null,
            depotName: null,
            //维修开始时间时间类型
            repairStartTimeType:null,
            //维修开始时间自定义时间段
            repairStarDateStr:null,
            //维修结束时间类型
            repairEndTimeType:null,
            //维修结束时间自定义时间段
            repairEndDateStr:null,
            //车辆品牌id
            carBrandId:null,
            //车辆车系id
            carSeriesId:null,
            //车辆车型id
            carModelId:null,
            //车辆所有人
            carOwner:null,
            inspectionNumber:null,

        },
        carNoDiv: false,
        carNoAndVinNoDiv: true,
        flag: false,
        vehicleInfo: null,
        showForm: false,
        inspectionManage: {},
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        warehouseData: {},
        edithidden: true,
        isFilter:false,
        prompt:null,
        selectData:[],
        inspectionPayIds:[],
        carNoDisabled:false,
        stageDatalist: [],
    },
    updated: function () {
        layui.form.render();
    },
    created: function () {
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.selectData,
                    success: function (valData,labelData) {
                        vm.q.carBrandId = valData[0];
                        vm.q.carSeriesId = valData[1];
                        vm.q.carModelId = valData[2];
                    }
                });
            });
        });
        var _this = this;
        /*$.getJSON(baseURL + "maintenance/insurancemanage/listBrandAndModel", function (r) {
            console.log(r.listData)
            _this.allCarModels = r.listData;
        });*/
        // 获取付款对象
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
            contentType: "application/json",
            data:null,
            success: function(r){
                _this.payObject= r.dict;
            }
        });
        //初始化加载保险公司
        $.ajax({
            type: "POST",
            url: baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList",
            contentType: "application/json",
            data:null,
            success: function(r){
                //交强险
                _this.compulsoryCaompany = r.compulsoryInsuranceList;
            }
        });
        //获取险种类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insuranceType",
            contentType: "application/json",
            data:null,
            success: function(r){
                //险种集合
                _this.insuranceTypeList = r.dict;
            }
        });
        if (parent.layer.boxParams != null){
            var param = parent.layer.boxParams.boxParams;
            if (param != null){
                _this.q.carNo = param.vinNo;
            }
        }
    },
    methods: {
        retractChange:function(data){
            if(data == 1){
                this.hetong = false
            }
        },
        expandChange:function(data){
            console.log(1)
            if(data == 1){
                this.$nextTick(()=>{
                    this.hetong = true
                })

            }
        },

        feeChange(val){
            debounce((v)=>{
                this.refreshTable()
            }, 500)(val)
        },
        //保养费用期数变化刷新
        refreshTable(){
            let num = Number(this.inspectionManage.inspectNumber);

            if(num && num>=1){
                let allmoney = this.inspectionManage.inspectionAmount;
                let someMoney = allmoney ? Math.floor((allmoney / num) * 100) / 100 : null
                console.log('aaa222', vm.stageDatalist)
                if(vm.stageDatalist.length === num){

                    vm.stageDatalist.forEach((item,i)=>{
                        item.payMoney = someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null
                    })
                    console.log('aaa111', vm.stageDatalist)
                }else {
                    this.stageDatalist.splice(0);
                    // if (allmoney) {
                        for (let i = 0; i < num; i++) {
                            let obj = {
                                index: i + 1,
                                feeName: '年检费用',
                                payMoney: someMoney ? (i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2)):null,
                                payTime: '',
                                isGenerateBill: 0,
                                type: 0,
                                remark: "",
                            }
                            vm.stageDatalist.push(obj)
                            // layui.table.reload('compulsoryInsurance', {
                            //     data: vm.stageDatalist
                            // });
                        }
                    // }

                }
                layui.table.reload('compulsoryInsurance', {
                    data: vm.stageDatalist
                });
                initTableEdit();
            }else{
                this.stageDatalist.splice(0);
                layui.table.reload('compulsoryInsurance', {
                    data: vm.stageDatalist
                });
                initTableEdit();
            }
        },

        // 保养费用期数变化
        changeStage(e) {
            this.refreshTable();

            // console.log(vm.stageDatalist);
            // if(this.inspectionManage.inspectionAmount==0||this.inspectionManage.inspectionAmount==undefined){
            //     return
            // }
            // this.stageDatalist.splice(0);
            // let num
            // console.log(typeof e, 'e')
            // if (typeof e === 'string') {
            //     num = Number(e)
            // } else {
            //     num = e.target.value
            // }
            // let allmoney = this.inspectionManage.inspectionAmount
            // let someMoney = ''
            // if (allmoney) {
            //     someMoney = Math.floor((allmoney / num) * 100) / 100
            //     for (let i = 0; i < num; i++) {
            //         let obj = {
            //             index: i + 1,
            //             feeName: '年检费用',
            //             payMoney: i < num - 1 ? someMoney : Number(allmoney - i * someMoney).toFixed(2),
            //             payTime: '',
            //             isGenerateBill: 0,
            //             type: 0,
            //             remark: "",
            //         }
            //         vm.stageDatalist.push(obj)
            //         layui.table.reload('compulsoryInsurance', {
            //             data: vm.stageDatalist
            //         });
            //
            //         console.log('---------obj-->', obj)
            //     }
            //
            //
            // } else {
            //
            // }
        },


        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if (list.length == 0) {
                alert("请选择一条记录");
                return;
            }

            var inspectionIds = [];
            $.each(list, function (index, item) {
                inspectionIds.push(item.inspectionId);
            });
            return inspectionIds;
        },
        getPayObjectData(){
            // 获取交强险、商业险付款对象
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
                contentType: "application/json",
                data:null,
                success: function(r){
                    vm.inspectionPayIds= r.dict;
                }
            });
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
        deptTree: function () {
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        zTreeClick: function (event, treeId, treeNode) {
            Vue.set(vm.q, "deptId", treeNode.deptId);
            Vue.set(vm.q, "dept", treeNode.name);
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.carNoAndVinNo = null;
            vm.q.dept = null;
        //  vm.q.brandAndCarModel = null;
            vm.q.inspectionStatus = null;
            vm.q.customerName = null;
            vm.q.vehicleOrderNo = null;
            vm.q.vehicleStatus = null;
            vm.q.leaseType = null;
            vm.q.city = null;
            vm.q.inspectionNo = null;
            vm.q.inspectionDate = null;
            vm.q.depotId = null;
            vm.q.depotName = null;
            vm.q.repairStartTimeType=null;
            vm.q.repairStarDateStr=null;
            vm.q.repairEndTimeType=null;
            vm.q.repairEndDateStr=null;
            //车辆品牌id
            vm.q.carBrandId=null;
             //车辆车系id
            vm.q.carSeriesId=null;
             //车辆车型id
            vm.q.carModelId=null;
            vm.q.carOwner=null;

            $("#carBrandSeriesModel").val('');
            $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
        },
        add: function () {
            vm.getPayObjectData();
            vm.deliveryFileLst = [];
            vm.inspectionManage = {};
            vm.carNoAndVinNoDiv = true;
            vm.carNoDiv = false;
            vm.carNoDisabled=false;
            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
            layui.table.reload('compulsoryInsurance', {
                data: null
            });
            initTableEdit();
        },
        update: function (inspectionId,inspectionNumber, flag) {
            vm.getPayObjectData();
            vm.carNoAndVinNoDiv = true;
            vm.carNoDiv = true;
            vm.carNoDisabled=true;
            vm.edithidden = false;
            vm.inspectionManage = {};
            $.get(baseURL + "maintenance/inspectionmanage/info/" + inspectionId, function (r) {
                console.log(r.data+"r.data")
                vm.inspectionManage = r.data;
                vm.deliveryFileLst = vm.inspectionManage.attachment;
            });
            console.log(vm.inspectionManage+"----------");
            vm.reloadStageSourceTable(inspectionNumber);
            vm.flag = flag;
            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
        //年检分期表格数据重新加载方法
        reloadStageSourceTable: function(inspectionNumber){
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/inspectionmanage/getInspectionStageList",
                dataType:"JSON",
                data:{"inspectionNumber":inspectionNumber},
                success: function(r){
                    vm.stageDatalist.splice(0);
                    r.stageDatalist.map((item, index)=>{
                        item.index = index+1
                        vm.stageDatalist.push(item)
                        return item
                    });
                    layui.table.reload('compulsoryInsurance', {
                        data: vm.stageDatalist
                    });
                    initTableEdit();
                }
            });
        },
        del: function (inspectionIds) {
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/inspectionmanage/delete",
                    contentType: "application/json",
                    data: JSON.stringify(inspectionIds),
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
        detail: function (id, carId,carNo, status,fixed,remaining,nextInspectionTime) {
            window.localStorage.setItem("id", id);
            window.localStorage.setItem("carId", carId);
            window.localStorage.setItem("carNo", carNo);
            window.localStorage.setItem("status", status);
            window.localStorage.setItem("fixed", fixed);
            window.localStorage.setItem("remaining", remaining);
            window.localStorage.setItem("nextInspectionTime", nextInspectionTime);
            var index = layer.open({
                title: "年检详情",
                type: 2,
                content: tabBaseURL + 'modules/maintenance/inspectionmanagedetail.html',
                end: function () {
                    layer.close(index);

                    // window.localStorage.setItem("id", null);
                    // window.localStorage.setItem("fixed", null);
                    // window.localStorage.setItem("remaining", null);
                    //  vm.reload();
                },
            });
            layer.full(index);
        },
        saveOrUpdate: function (event) {
            console.log(vm.stageDatalist)
            // if(this.inspectionManage.inspectionAmount==0||this.inspectionManage.inspectionAmount==undefined){
            //     vm.stageDatalist.splice(0);
            // }
            if (vm.inspectionManage.carNo == null || vm.inspectionManage.vinNo == null){
                layer.msg('请选择车辆', {icon: 5});
                return;
            }

            // var isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
            var isNum = /^(0|([1-9][0-9]*))(\.\d{1,2})?$/;
            if (null != vm.inspectionManage.inspectionAmount && vm.inspectionManage.inspectionAmount != undefined && vm.inspectionManage.inspectionAmount != '') {
                if (!isNum.test(vm.inspectionManage.inspectionAmount)) {
                    layer.msg('填写金额错误', {icon: 5});
                    return;
                }
             }
                        if (vm.inspectionManage.inspectionAmount != undefined && vm.inspectionManage.inspectionAmount != 0) {
                // if (vm.inspectionManage.inspectNumber == undefined || vm.inspectionManage.inspectNumber == 0) {
                //     alert("请填写分期数");
                //     return false;
                // }
            }
            console.log(vm.stageDatalist, 'aaa')
            if (vm.stageDatalist && vm.stageDatalist.length > 0) {
                let compulsoryAll = vm.stageDatalist.reduce((pre, item) => {
                    return pre += Number(item.payMoney)
                }, 0).toFixed(2);

                console.log(vm.stageDatalist, 'bbb')
                if(!vm.inspectionManage.inspectionAmount){
                    vm.inspectionManage.inspectionAmount = 0
                }
                console.log('保养金额==>', Number(compulsoryAll), Number(vm.inspectionManage.inspectionAmount))
                if (Number(compulsoryAll) != Number(vm.inspectionManage.inspectionAmount)) {
                    alert('年检费用填入的应付金额总额需等于总费用！');
                    return false
                }


                for (const dataliatElement of vm.stageDatalist) {
                    if (dataliatElement.isGenerateBill == 1 && (dataliatElement.payTime == undefined || dataliatElement.payTime == null || dataliatElement.payTime == '')) {
                        alert('请选择应付日期');
                        return false;
                    }
                }
            }

            vm.inspectionManage.deliveryFileLst = vm.deliveryFileLst;
            var url = vm.inspectionManage.id == null ? "maintenance/inspectionmanage/save" : "maintenance/inspectionmanage/update";
            vm.inspectionManage.flag = vm.flag;
            vm.inspectionManage.list=vm.stageDatalist;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.inspectionManage),
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
        exports: function () {
            var url = baseURL + 'maintenance/inspectionmanage/export?a=a';
            if(vm.q.carNoAndVinNo != null){
                url += '&carNoAndVinNo='+vm.q.carNoAndVinNo;
            }
            if(vm.q.dept != null){
                url += '&dept='+vm.q.dept;
            }
            if(vm.q.deptName != null){
                url += '&deptName='+vm.q.deptName;
            }
            if(vm.q.inspectionStatus != null){
                url += '&inspectionStatus='+vm.q.inspectionStatus;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.vehicleOrderNo != null){
                url += '&vehicleOrderNo='+vm.q.vehicleOrderNo;
            }
            if(vm.q.vehicleStatus != null){
                url += '&vehicleStatus='+vm.q.vehicleStatus;
            }
            if(vm.q.leaseType != null){
                url += '&leaseType='+vm.q.leaseType;
            }
            if(vm.q.city != null){
                url += '&city='+vm.q.city;
            }
            if(vm.q.cityName != null){
                url += '&cityName='+vm.q.cityName;
            }
            if(vm.q.inspectionNo != null){
                url += '&inspectionNo='+vm.q.inspectionNo;
            }
            if(vm.q.inspectionDate != null){
                url += '&inspectionDate='+vm.q.inspectionDate;
            }
            if(vm.q.depotId != null){
                url += '&depotId='+vm.q.depotId;
            }
            if(vm.q.repairStartTimeType != null){
                url += '&repairStartTimeType='+vm.q.repairStartTimeType;
            }
            if(vm.q.repairStarDateStr != null ){
                url += '&repairStarDateStr='+vm.q.repairStarDateStr;
            }
            if(vm.q.repairEndTimeType != null ){
                url += '&repairEndTimeType='+vm.q.repairEndTimeType;
            }
            if(vm.q.repairEndDateStr != null ){
                url += '&repairEndDateStr='+vm.q.repairEndDateStr;
            }
            if(vm.q.carBrandId != null ){
                url += '&carBrandId='+vm.q.carBrandId;
            }
            if(vm.q.carSeriesId != null ){
                url += '&carSeriesId='+vm.q.carSeriesId;
            }
            if(vm.q.carModelId != null ){
                url += '&carModelId='+vm.q.carModelId;
            }
            if(vm.q.inspectionTimeSort != null ){
                url += '&inspectionTimeSort='+vm.q.inspectionTimeSort;
            }
            window.location.href = url;
        },
        cancel: function () {
            layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNoAndVinNo: vm.q.carNoAndVinNo,
                    dept: vm.q.dept,
                //  brandAndCarModel: vm.q.brandAndCarModel,
                    inspectionStatus: vm.q.inspectionStatus,
                    customerName: vm.q.customerName,
                    vehicleOrderNo: vm.q.vehicleOrderNo,
                    vehicleStatus: vm.q.vehicleStatus,
                    leaseType: vm.q.leaseType,
                    city: vm.q.city,
                    inspectionNo: vm.q.inspectionNo,
                    inspectionDate: vm.q.inspectionDate,
                    depotId: vm.q.depotId,
                    //维修开始时间时间类型
                    repairStartTimeType:vm.q.repairStartTimeType,
                    //维修开始时间自定义时间段
                    repairStarDateStr:vm.q.repairStarDateStr,
                    //维修结束时间类型
                    repairEndTimeType:vm.q.repairEndTimeType,
                    //维修结束时间自定义时间段
                    repairEndDateStr:vm.q.repairEndDateStr,
                    //车辆品牌id
                    carBrandId:vm.q.carBrandId,
                    //车辆车系id
                    carSeriesId:vm.q.carSeriesId,
                    //车辆车型id
                    carModelId:vm.q.carModelId,
                    //车辆所有人
                    carOwner:vm.q.carOwner,
                    inspectionTimeSort:vm.q.inspectionTimeSort,
                }
            });
        },
        //选择车牌号
        selectCarNo: function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function () {
                    var carId = vm.carInforData.carId;
                    if (carId != null && carId != '' && carId != undefined) {
                        vm.getCarBasicInforByCarNo(carId);
                    }
                }
            });
            // layer.full(index);

        },
        //选择车架号
        selectVinNo: function () {
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcar.html",
                end: function () {
                    var vinNo = vm.carInforData.vinNo;
                    if (vinNo != null && vinNo != '' && vinNo != undefined) {
                        vm.getCarBasicInforByVinNo(vinNo);
                    }
                }
            });
            // layer.full(index);

        },
        //根据车牌号查询基本信息
        getCarBasicInforByCarNo: function (carId) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByCarNo/" + carId,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    console.log(r.baseInfor);
                    vm.vehicleInfo = r.baseInfor;
                    vm.inspectionManage.vehicleOrderNo = r.baseInfor.carOrderNo;
                    vm.inspectionManage.carId = r.baseInfor.carId;
                    addVehicleInfo(vm.vehicleInfo);
                    layui.form.render("select");
                }
            });
        },
        //根据车架号查询基本信息
        getCarBasicInforByVinNo: function (vinNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "car/tcarbasic/getCarBasicInforByVinNo/" + vinNo,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    if (r.baseInfor != null) {
                        console.log(r.baseInfor);
                        vm.vehicleInfo = r.baseInfor;
                        vm.inspectionManage.vehicleOrderNo = r.baseInfor.carOrderNo;
                        vm.inspectionManage.carId = r.baseInfor.carId;
                        addVehicleInfo(vm.vehicleInfo);
                        layui.form.render("select");
                    } else {
                        alert("该车架号暂无车辆信息!");
                        return;
                    }
                }
            });
        },
        // getVehicleInfo:function(id,type) {
        //     $.ajax({
        //         type: "GET",
        //         url: baseURL + "maintenance/inspectionmanage/getVehicleInfo",
        //         contentType: "application/json",
        //         data:{
        //             id:id,
        //             type:type
        //         },
        //         success: function (res) {
        //             vm.vehicleInfo = res.data;
        //             vm.inspectionManage.vehicleOrderNo = res.data.vehicleOrderNo;
        //             vm.inspectionManage.carId = res.data.carId;
        //             addVehicleInfo(vm.vehicleInfo);
        //             layui.form.render("select");
        //         }
        //     });
        // },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }
    }
});

function initTableEdit(){
    initTableInputEdit('compulsoryInsurance', 'payMoney', '请输入应付金额', 'num', vm.stageDatalist, 999999.99, 10, 'callbackStageDatalist');
    initTableInputEdit('compulsoryInsurance', 'remark', '请输入备注', 'txt', vm.stageDatalist, '', 50, 'callbackStageDatalist');
    initTableDateEdit('compulsoryInsurance', 'payTime', 'date', vm.stageDatalist);
}

function initClick() {
    $('div[type="repairStartDate"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "repairStarDateStr", '');
        //维修开始时间类型
        vm.q.repairStartTimeType=value;
    });

    $('div[type="repairEndDate"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "repairEndDateStr", '');
        vm.q.repairEndTimeType=value;
    });
}

/**
 * 自动识别车辆信息
 * @param item
 */
function addVehicleInfo(item) {
    vm.$set(vm.inspectionManage, 'carNo', item.carNo);
    vm.$set(vm.inspectionManage, 'vinNo', item.vinNo);
    //设置车辆品牌/车型
    vm.$set(vm.inspectionManage, 'brandAndCarModel', item.brandName + "/" + item.modelName);
    vm.$set(vm.inspectionManage, 'customerId', item.customerId);
    //客户名称
    vm.$set(vm.inspectionManage, 'customerName', item.customerName);
    //车辆状态
    vm.$set(vm.inspectionManage, 'vehicleStatusShow', item.carStatusStr);
    vm.inspectionManage.vehicleStatus = item.carStatus;
    //车辆订单号
    vm.$set(vm.inspectionManage, 'vehicleOrderNo', item.carOrderNo);
    //车辆所属公司
    //  vm.$set(vm.inspectionManage, 'company', item.belongCompanyName);
    vm.$set(vm.inspectionManage, 'company', item.deptName);
    //租赁开始时间
    vm.$set(vm.inspectionManage, 'rentStartTime', item.timeStartRent);
    //租赁结束时间
    vm.$set(vm.inspectionManage, 'rentEndTime', item.timeFinishRent);
    //车辆所在城市
    vm.$set(vm.inspectionManage, 'city', item.cityName);
    //仓库id
    vm.$set(vm.inspectionManage, 'depotId', item.carDepotId);
    //仓库名称
    vm.$set(vm.inspectionManage, 'depotName', item.carDepotName);
    //车辆用途
    vm.$set(vm.inspectionManage, 'carPurposeShow', item.rentTypeStr);
    //车辆所有人
    vm.$set(vm.inspectionManage, 'carOwner', item.carOwner);
    vm.inspectionManage.carPurpose = item.rentType;
    vm.inspectionManage.carId = item.carId;
}


/**
 * 上传附件
 */
function uploadAttachment(upload) {
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path': 'inspection'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        choose: function (obj) {
            PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    nameDesc: '年检附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                };
                vm.deliveryFileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.deliveryFileLst.forEach(function (value) {
                    if (value.id === deliveryFileIdTmp) value.url = res.data[0];
                });
                vm.deliveryFileLstId = 'deliveryFileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
            }
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}


function initDate(laydate) {
    //维修开始时间，自定义时间
    laydate.render({
        elem : '#repairStartDate',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.repairStarDateStr=value;
            vm.q.repairStartTimeType=null;
        }
    });

    //维修结束时间，自定义时间
    laydate.render({
        elem : '#repairEndDate',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.repairEndDateStr=value;
            vm.q.repairEndTimeType=null;

        }
    });
}



function jump (carId) {
    var index = layer.open({
        title: "车辆详情",
        type: 2,
        content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
        success: function(layero,num){
            var iframe = window['layui-layer-iframe'+num];
            iframe.vm.initEditData(carId);
        },
        end: function () {
            vm.showForm = false;
            layer.closeAll();
        }
    });
    vm.showForm = true;
    layer.full(index);
}
function callbackStageDatalist(event, _val) {
    var class_name = 'edit-' + event;
    var edit = $('.' + class_name);
    var _index = edit.parent().parent().attr('data-index');
    var table = edit.parent().parent().parent().parent().parent().parent().parent();
    var limit = table.find('span[class="layui-laypage-limits"]').find('option:selected').val();
    var page = table.find('em[class="layui-laypage-em"]').next().html();
    var index = (Number(page) - 1) * Number(limit) + Number(_index);
    if(!index){
        index = _index
    }
    if (vm.stageDatalist.length > index) {
        vm.stageDatalist[index][event] = _val;
    }
}
