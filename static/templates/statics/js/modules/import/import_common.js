var eventBus = new Vue();

function keepTwoDecimal(num) {
    var result = parseFloat(num);
    result = Math.round(num * 100) / 100;
    return result;
}

/*
将所有模块的导入参数都在这里统一维护不到处找了,记住这个下标顺序
0'导入车辆信息', 1'导入车辆订单信息', 2'导入客户信息', 3'导入车辆保险信息', 4'导入车辆年检信息',
5'导入车辆保养信息', 6'导入车辆出险信息', 7'导入车辆维修信息', 8'导入车辆行驶证', 9'导入司机流水', 10'司机薪资核算',11应付账单
 */
var moudulesImportParam = {
    // 上传按钮标签，上传地址也是在这里设置
    uploadBtnTagList: [
        `<div v-show="currentTab==0" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'car/tcarbasic/import'}">请选择上传文件</div>`,
        `<div v-show="currentTab==1" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'order/order/inports'}">请选择上传文件</div>`,
        `<div v-show="currentTab==2" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'customer/importCustomer'}">请选择上传文件</div>`,
        `<div v-show="currentTab==3" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'maintenance/insurancemanage/import'}">请选择上传文件</div>`,
        `<div v-show="currentTab==4" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'maintenance/inspectionmanage/import'}">请选择上传文件</div>`,
        `<div v-show="currentTab==5" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'maintenance/maintenancemanage/importExcel'}">请选择上传文件</div>`,
        `<div v-show="currentTab==6" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'outinsuranceorder/ouinsuranceorder/importExcel'}">请选择上传文件</div>`,
        `<div v-show="currentTab==7" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'carrepairorder/carrepairorder/importExcel'}">请选择上传文件</div>`,
        `<div v-show="currentTab==8" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+''}">请选择上传文件</div>`,
        `<div v-show="currentTab==9" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'driver/flow/imports'}">请选择上传文件</div>`,
        `<div v-show="currentTab==10" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'driver/wages/imports'}">请选择上传文件</div>`,
        `<div v-show="currentTab==11" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'/financial/paymentbill/imports'}">请选择上传文件</div>`,
        `<div v-show="currentTab==12" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'crmClues/imports'}">请选择上传文件</div>`,
        `<div v-show="currentTab==13" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'crmPurchaseOrder/imports'}">请选择上传文件</div>`,
        `<div v-show="currentTab==14" class="font-size-14 btn-load demoMore" lay-data="{url: baseURL+'crm/crmCarBasic/imports'}">请选择上传文件</div>`
    ],
    // 必填字段标识
    requireData: ['cl', 'dd', 'kh', 'bx', 'nj', 'by', 'cx', 'wx', 'xsz', 'sjls', 'sjgz', "yfzd", "crmClues", 'crmpo', 'crmcb'],
    // 导入模板地址
    importTemplateUrl: [
        // 车辆
        importURL + "importData/cl/cldr.xls",
        // 车辆订单信息、客户信息 需要额外判断，此处只占位
        null, null,
        // 保险
        importURL + "importData/clbx/bxdr.xlsx",
        // 年检
        importURL + "importData/clnj/clnjdr.xlsx",
        // 保养
        importURL + "importData/clby/bydr.xlsx",
        // 出险
        importURL + "importData/clcx/cxdr.xlsx",
        //维修
        importURL + "importData/clwx/wxdr.xlsx",
        // 行驶证 需要额外判断，此处只占位
        null,
        //司机流水
        importURL + "importData/sj/sjls.xlsx",
        //司机工资
        importURL + "importData/sj/sjgz.xlsx",
        //应付账单
        importURL + "importData/cw/yfzd.xlsx",
        //线索列表
        importURL + "importData/crmClues/crmClues.xls",
        //采购列表
        importURL + "importData/crmPurchaseOrder/crmpo.xls",
        //库存列表
        importURL + "importData/crmCarBasic/crmcb.xls",
    ],
    // 下载错误日志，之前的我不改动，自类型4之后的，开始配置，之后的都走公共错误导出
    downloadErrorDataUrl: [
        // 占位
        null, null, null, null,
        // 年检
        baseURL + 'maintenance/inspectionmanage/exportExcel?numberNo=',
        // 保养
        baseURL + 'maintenance/maintenancemanage/exportExcel?numberNo=',
        // 出险
        baseURL + 'outinsuranceorder/ouinsuranceorder/exportExcel?numberNo=',
        // 维修
        baseURL + 'carrepairorder/carrepairorder/exportExcel?numberNo=',
        // 占位
        null,
        // 司机流水
        baseURL + 'common/exportImportErrorExcel?numberNo=',
        // 司机工资
        baseURL + 'common/exportImportErrorExcel?numberNo=',
        // 应付账单
        baseURL + 'common/exportImportErrorExcel?numberNo=',
        // 线索列表
        baseURL + 'common/exportImportErrorExcel?numberNo=',
        // 采购列表
        baseURL + 'common/exportImportErrorExcel?numberNo=',
        // 库存列表
        baseURL + 'common/exportImportErrorExcel?numberNo=',
    ],
    // 导入结果展示
    resultShow: [
        {
            // 进入列表页按钮名称
            enterListPageName: "车辆列表",
            // 导入结果列展示,目前写好的不移动，之后的都在这里配置
            cols: []
        }, {
            enterListPageName: "订单列表",
            cols: []
        }, {
            enterListPageName: "客户列表",
            cols: []
        }, {
            enterListPageName: "车辆保险列表",
            cols: []
        }, {
            enterListPageName: "年检列表",
            cols: []
        }, {
            enterListPageName: "年检列表",
            cols: []
        }, {
            enterListPageName: "保养列表",
            cols: []
        }, {
            enterListPageName: "维修列表",
            cols: []
        },
        // 占个空位
        {},
        {
            enterListPageName: "司机流水明细",
            cols: []
        }, {
            enterListPageName: "司机工资",
            cols: []
        }, {
            enterListPageName: "应付账单",
            cols: [[
                {field: 'rowNum', width: 70, align: "center", title: '行数', templet: (d) => isEmpty(d.rowNum)},
                {field: 'rowNum', width: 150, align: "center", title: '提示信息', templet: (d) => `<span style="color:#fb5463">${isEmpty(d.errorMsg)}</span>`},
                {field: 'paymentTypeStr', align: "center", title: '付款类型', templet: (d) => isEmpty(d.paymentTypeStr)},
                {field: 'carNo', align: "center", title: '车牌号', templet: (d) => isEmpty(d.carNo)},
                {field: 'vinNo', align: "center", title: '车架号', templet: (d) => isEmpty(d.vinNo)},
                {field: 'payerName', align: "center", title: '付款方', templet: (d) => isEmpty(d.payerName)},
                {field: 'supplierTypeStr', align: "center", title: '收款方类型', templet: (d) => isEmpty(d.supplierTypeStr)},
                {field: 'supplierName', align: "center", title: '收款方', templet: (d) => isEmpty(d.supplierName)},
                {field: 'copeWithDate', align: "center", title: '应付日期', templet: (d) => isEmpty(d.copeWithDate)},
                {field: 'copeWithAmount', align: "center", title: '应付金额', templet: (d) => isEmpty(d.copeWithAmount)},
                {field: 'note', align: "center", title: '备注', templet: (d) => isEmpty(d.note)}
            ]]
        },{
            enterListPageName:"线索列表",
            cols:[[
                {field: 'rowNum', width:70, align: "center", title: '行数', templet:(d)=>isEmpty(d.rowNum)},
                {field: 'errorMsg', width:150, align: "center", title: '提示信息', templet:(d)=>`<span style="color:#fb5463">${isEmpty(d.errorMsg)}</span>`},
                {field: 'customerName', align: "center", title: '客户名称', templet: (d)=>isEmpty(d.customerName)},
                {field: 'phone', align: "center", title: '联系方式', templet: (d)=>isEmpty(d.phone)},
                {field: 'cluesSource', align: "center", title: '线索来源', templet: (d)=>isEmpty(d.cluesSource)},
                {field: 'intentionLevel', align: "center", title: '意向等级', templet: (d)=>isEmpty(d.intentionLevel)},
                {field: 'customerType', align: "center", title: '客户类型', templet: (d)=>isEmpty(d.customerType)}
            ]]
        },  {
            enterListPageName: "采购列表",
            cols:[[
                {field: 'rowNum', width:70, align: "center", title: '行数', templet:(d)=>isEmpty(d.rowNum)},
                {field: 'errorMsg', width:150, align: "center", title: '提示信息', templet:(d)=>`<span style="color:#fb5463">${isEmpty(d.errorMsg)}</span>`},
                {field: 'brandName', align: "center", title: '品牌', templet: (d)=>isEmpty(d.brandName)},
                {field: 'seriesName', align: "center", title: '车系', templet: (d)=>isEmpty(d.seriesName)},
                {field: 'modelName', align: "center", title: '车型', templet: (d)=>isEmpty(d.modelName)},
                {field: 'productType', align: "center", title: '产品类型', templet: (d)=>isEmpty(d.productType)},
                {field: 'batteryBrand', align: "center", title: '电池品牌', templet: (d)=>isEmpty(d.batteryBrand)},
                {field: 'batteryDegree', align: "center", title: '电池度数', templet: (d)=>isEmpty(d.batteryNum)},
                {field: 'productionTime', align: "center", title: '生产日期', templet: (d)=>isEmpty(d.productionTime)},
                {field: 'purchaseNum', align: "center", title: '采购数量', templet: (d)=>isEmpty(d.purchaseNum)},
                {field: 'purchasePrice', align: "center", title: '采购单价', templet: (d)=>isEmpty(d.purchasePrice)},
                {field: 'purchaseTotalPrice', align: "center", title: '采购总价', templet: (d)=>isEmpty(d.purchaseTotalPrice)},
                {field: 'purchaseTime', align: "center", title: '采购日期', templet: (d)=>isEmpty(d.purchaseTime)},
                {field: 'orderNo', align: "center", title: '采购订单编号', templet: (d)=>isEmpty(d.orderNo)},
                {field: 'payType', align: "center", title: '支付方式', templet: (d)=>isEmpty(d.payType)},
                {field: 'amountPaid', align: "center", title: '支付金额', templet: (d)=>isEmpty(d.amountPaid)},
                {field: 'manufacturer', align: "center", title: '厂家', templet: (d)=>isEmpty(d.manufacturer)},
                {field: 'dealer', align: "center", title: '经销商', templet: (d)=>isEmpty(d.dealer)},

            ]]
        }, {
            enterListPageName: "库存列表",
            cols:[[
                {field: 'rowNum', width:70, align: "center", title: '行数', templet:(d)=>isEmpty(d.rowNum)},
                {field: 'errorMsg', width:150, align: "center", title: '提示信息', templet:(d)=>`<span style="color:#fb5463">${isEmpty(d.errorMsg)}</span>`},
                {field: 'orderNo', align: "center", title: '采购单号', templet: (d)=>isEmpty(d.orderNo)},
                // {field: 'batteryDegree', align: "center", title: '电池度数', templet: (d)=>isEmpty(d.batteryDegree)},
                {field: 'vinNo', align: "center", title: '车辆VIN码', templet: (d)=>isEmpty(d.vinNo)},
                {field: 'toStoreTime', align: "center", title: '到店时间', templet: (d)=>isEmpty(getMyDate(d.toStoreTime))},
                {field: 'certificateExpireTime', align: "center", title: '合格证时间', templet: (d)=>isEmpty(getMyDate(d.certificateExpireTime))},
                {field: 'carStorage', align: "center", title: '车辆存放地址', templet: (d)=>isEmpty(d.carStorage)}
            ]]
        }
    ]
};
// 导入
Vue.component('import-download', {
    template: `<div>
           <div class="module-body">
                    <div class="module-file">
                        <div>
                            <div class="import—download-box">
                                <div class="import—download">
                                    <img class="img" :src="filterUrl('/statics/images/common_download.png')" alt="下载模板">
                                </div>
                                <div class="import—download-file">
                                    <div class="font-size-14 download-title">下载文件模板、填写导入信息</div>
                                    <div class="font-size-14 download-tip">{{requireStr}}
                                    </div>
                                     <div style="display: flex">
                                        <div class="font-size-14 btn-load" @click="changeSelect">下载模板</div>
                                    </div>
                                </div>
                            </div>
                            <div class="import—download-box">
                                <div class="import—download">
                                    <img class="img" :src="filterUrl('/statics/images/common_upload.png')" alt="上传文件">
                                </div>
                                <div class="import—download-file">
                                    <div class="font-size-14 download-title">上传完善后的信息表</div>
                                    <div class="font-size-14 download-tip">支持文件xls、xlsx（即Excel表格），文件大小不超过10M，数据1000行以内
                                    </div>
                                    <a class="download-href pointer" id="dddd">
                                       <div class="layui-btn-container">
                                          #{layui-btn-container}
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="import—download-box" style="flex-direction: column;align-items: flex-start">
                                <h4><img class="tip-icon" :src="filterUrl('/statics/images/import/tip.png')" alt="提示">导入流程</h4>
                                <h4 class="tip-content">1.下载Excel模板；</h4>
                                <h4 class="tip-content">2.线下编辑信息内容；</h4>
                                <h4 class="tip-content">3.上传编辑好的Excel表单，系统反馈导入结果。</h4>
                                <br/>
                                <h4><img class="tip-icon" :src="filterUrl('/statics/images/import/tip.png')" alt="提示">导入前准备</h4>
                                <h4 class="tip-content">1.请使用标准模版，确认未进行过任何更改，若无意中修改了模版的原有内容，建议重新下载模版；</h4>
                                <h4 class="tip-content">2.确保Excel中标题行的名称和表单中与之对应的字段标题一致，且表单中字段名称不能相同；</h4>
                                <h4 class="tip-content">3.确保Excel中数据格式正确。比如车辆归属需和系统里已建好的公司或部门名称保持一致，需在【部门管理】提前维护，日期格式为2023-08-18，日期与数字格式的数据均不能含有中文；</h4>
                                <h4 class="tip-content">4.如果表单中有设置必填项字段，在Excel中对应的列下，都必须有数据/值；</h4>
                                <h4 class="tip-content">5.Excel多余的列无法导入，请删除Excel中不需要导入的列。</h4>

                            </div>
                        </div>
                    </div>
                </div>
        </div>`.replace("#{layui-btn-container}", moudulesImportParam.uploadBtnTagList.join('')),
    props: {
        importUrl: {
            type: String
        },
        sonTab: {
            type: String
        },
        currentTab: {
            type: Number,
            default: 0
        },
        currentTabComponent: {
            type: String,
            default: 'import-download'
        }
    },

    data() {
        return {
            url: '',
            baseUrl: '',
            // customers: [{
            //     value: '1',
            //     label: '企业'
            // }, {
            //     value: '2',
            //     label: '个人'
            // },],
            // value2: '',
            //
            // orders: [{
            //     value: '1',
            //     label: '经租'
            // }, {
            //     value: '2',
            //     label: '以租代购'
            // }, {
            //     value: '5',
            //     label: '融租'
            // }, {
            //     value: '6',
            //     label: '直购'
            // },],
            // value: '',
            //
            // options: [{
            //     value: '0',
            //     label: '车辆'
            // }, {
            //     value: '1',
            //     label: '车辆订单',
            //     children: [{
            //         value: 'jz',
            //         label: '经租',
            //     }, {
            //         value: 'yzdg',
            //         label: '以租代购',
            //     }, {
            //         value: 'rz',
            //         label: '融租',
            //     }, {
            //         value: 'zg',
            //         label: '直购',
            //     }]
            // }, {
            //     value: '2',
            //     label: '客户',
            //     children: [{
            //         value: 'gr',
            //         label: '个人'
            //     }, {
            //         value: 'qy',
            //         label: '企业'
            //     }]
            // }, {
            //     value: '3',
            //     label: '车辆保险'
            // }, {
            //     value: '4',
            //     label: '车辆年检'
            // }, {
            //     value: '5',
            //     label: '车辆保养'
            // }, {
            //     value: '6',
            //     label: '车辆出险'
            // }, {
            //     value: '7',
            //     label: '车辆维修'
            // }],
            // value1: '',
            // orderTypeSelect: false,
            // importType: 1,
            // importTypeSelect: false,
            // importCType: 1,
            // orderCarShow: 1,
            // customerShow: 1,
            requireStr: ''
        }
    },

    mounted() {

        let _self = this;
        var cType = '';
        var oType = '';

        layui.use(['upload', 'element', 'layer'], function () {
            let upload = layui.upload;
            element = layui.element;
            var $ = layui.jquery;
            var timer;//定义一个计时器

            // $('.verifyForm').on('click', function () {
            //     if(_self.currentTab === 1){
            //         layer.msg('请选择上传车辆订单类型');
            //         return false;
            //     }
            //     if(_self.currentTab === 2){
            //         layer.msg('请选择上传客户类型');
            //         return false;
            //     }
            // })

            upload.render({
                elem: '.demoMore',
                size: 500 * 1024 * 1024,
                accept: 'file', //普通文件
                acceptMime: '.xls,.xlsx',
                exts: 'xls|xlsx',
                // progress: function(obj) {
                //     var n = 0;
                //     timer = setInterval(function(){//按照时间随机生成一个小于95的进度，具体数值可以自己调整
                //         n = n + Math.random()*10|0;
                //         if(n>95){
                //             n = 95;
                //             clearInterval(timer);
                //         }
                //         console.log('进度条', n+'%');
                //         let objBefore = {
                //             status: 2,
                //             currentTabComponent: 'import-progress',
                //             percentage: n,
                //         }
                //         _self.$emit('change-status', objBefore);
                //         eventBus.status = {
                //             percentage:n
                //         }
                //         //element.progress('demo', n+'%');
                //     }, 50+Math.random()*100);
                // },
                before: function (obj) {
                    console.log('======before')
                    layer.load();
                    // cType = $("#ct").val();
                    // if(cType != '' && cType != undefined){
                    //     this.data.importCType = cType;
                    // }
                    //
                    // oType = $("#ot").val();
                    // if(oType != '' && oType != undefined){
                    //     this.data.rentType = oType;
                    // }

                    this.data.importCType = {
                        'gr': '2',
                        'qy': '1'
                    }[_self.sonTab];

                    this.data.rentType = {
                        'jz': '1',
                        'yzdg': '2',
                        'rz': '5',
                        'zg': '6'
                    }[_self.sonTab];

                    if (_self.currentTab == 10) {
                        _self.$emit('change-status', {
                            status: 2,
                            currentTabComponent: 'import-progress',
                            progress: 50,
                        });
                    }


                },
                done: function (r) {
                    console.log('======done')
                    clearInterval(timer);

                    let objDone;
                    console.log(r);
                    if (r.resultFlag == undefined) {
                        if (r.code == 0) {
                            objDone = {
                                status: 4,
                                currentTabComponent: 'import-status',
                                progress: 100,
                                msg: r.msg,
                                busType: '进入'
                            }
                        } else {
                            objDone = {
                                status: 3,
                                currentTabComponent: 'import-status',
                                progress: 100,
                                msg: r.msg,
                                busType: '进入'
                            }
                        }
                        _self.$emit('change-status', objDone);
                        eventBus.status = {
                            msg: r.msg,
                            failDatas: r.failDatas,
                            busType: '进入'
                        }
                    } else {
                        if (r.resultFlag == 1 || r.resultFlag == 3) {
                            objDone = {
                                status: 4,
                                currentTabComponent: 'import-status',
                                progress: 100,
                                msg: r.msg,
                                busType: '进入'
                            }
                        } else {
                            console.log($("#ct").val());
                            objDone = {
                                status: 3,
                                currentTabComponent: 'import-status',
                                progress: 100,
                                msg: r.msg,
                                numberNo: r.numberNo,
                                rentType: r.rentType,
                                customerType: r.customerType,
                                busType: '进入'
                            }
                        }

                        if (_self.currentTab !== 10) {
                            _self.$emit('change-status', objDone);
                        }
                        eventBus.status = {
                            msg: r.msg,
                            numberNo: r.numberNo,
                            rentType: r.rentType,
                            customerType: r.customerType,
                            failDatas: r.failDatas,
                            busType: '进入',
                            resultFlag: r.resultFlag,
                            status: objDone.status,
                            currentTabComponent: 'import-status',
                        }
                    }
                },
                error: function (r) {
                    alert("导入失败！" + r);
                }
            });
            layer.closeAll('loading'); //关闭loading
        })

        // this.$nextTick(()=>{
        //     this.getRequireData()
        // })


    },

    watch: {
        currentTab: {
            handler: function (n, o) {
                this.getRequireData()
            },
            immediate: false,
        },
        sonTab: {
            handler: function (n, o) {

            },
            immediate: true,
        },
    },

    methods: {
        getRequireData() {
            //0'导入车辆信息', 1'导入车辆订单信息', 2'导入客户信息', 3'导入车辆保险信息', 4'导入车辆年检信息',
            // 5'导入车辆保养信息', 6'导入车辆出险信息', 7'导入车辆维修信息', 8'导入车辆行驶证', 9'导入司机流水', 10'司机薪资核算',11应付账单
            console.log('------', this.currentTab)
            let typestr = moudulesImportParam.requireData[this.currentTab]
            console.log('--111----', typestr)
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "common/importRequireFields?importMoudel=" + typestr,
                async: false,
                success: function (r) {
                    if (r.code === 0) {
                        if (r.data && r.data.length > 0) {
                            that.requireStr = '必填字段：' + r.data.join('、')
                        } else {
                            that.requireStr = '必填字段：--'
                        }
                    } else {
                        alert(r.msg)
                    }
                }
            });
        },
        filterUrl(url) {
            return this.importUrl + url
        },



        // 订单导入选择导入类型
        // changeOrderSelect(data) {
        //     if (data != null && data != '') {
        //         this.importType = data.value;
        //         $("#ot").val(this.importType);
        //         this.orderCarShow = 1;
        //     }
        // },

        // 客户导入选择导入类型
        // changeCustomerSelect(data) {
        //     if (data != null && data != '') {
        //         this.importCType = data.value;
        //         $("#ct").val(this.importCType);
        //         this.customerShow = 1;
        //     }
        // },
        // 下载模板
        changeSelect() {
            // var data = this.value1;
            var data = [String(this.currentTab)];

            console.log('importURL==>', importURL)

            if (this.sonTab != null && this.sonTab != '') {
                data = data.concat([this.sonTab])
            }
            console.log('data==>', data)
            if (data != null && data != '') {
                if (data.length == 2) {
                    if (data[0] == '1') {
                        if (data[1] == 'jz') {
                            window.location.href = importURL + "importData/order/jz/jzdr.xlsx"; // 经租
                        } else if (data[1] == 'yzdg') {
                            window.location.href = importURL + "importData/order/yzdg/yzdgdr.xlsx"; // 以租代购
                        } else if (data[1] == 'rz') {
                            window.location.href = importURL + "importData/order/rz/rzdr.xlsx"; // 融租
                        } else if (data[1] == 'zg') {
                            window.location.href = importURL + "importData/order/zg/zgdr.xlsx"; // 直购
                        }
                    } else if (data[0] == '2') {
                        if (data[1] == 'qy') {
                            window.location.href = importURL + "importData/kh/qy/qykhdr.xlsx"; // 企业
                        } else {
                            window.location.href = importURL + "importData/kh/gr/grkhdr.xlsx"; // 个人
                        }
                    }
                } else {
                    window.location.href = moudulesImportParam.importTemplateUrl[data[0]];
                }
            } else {
                alert("请选择下载模板类型");
            }
        },
    }
});


// 进度条
Vue.component('import-progress', {
    template: `<div>
                 <div class="module-body">
                    <div class="module-file">
                        <div>
                            <div class="progress">
                            <!--<div class="layui-progress" lay-showpercent="true" lay-filter="demo" >
                                <div class="layui-progress-bar layui-bg-red" lay-percent="0%"></div>
                            </div>-->
<!--                                <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" :format="format"></el-progress>-->
                                <p class="progress-tip">系统将抓取客户未付款的账单与流水进行冲账，如果客户账单已支付，请在财务模块标记付款状态后进行此操作。</p>
                            </div>
<!--                            <div class="reminder-box">-->
<!--                                <img class="tip-icon" :src="filterUrl('/statics/images/import/tip.png')" alt="提示">-->
<!--                                <span>特别提示</span><br>-->
<!--                                导入过程请勿关闭页面，关闭之后需要重新导入-->
<!--                            </div>-->
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn next-btn" @click="nextTip">下一步</button>
                </div>
</div>`,
    props: {
        importUrl: {
            type: String
        },
        status: {
            type: Number
        }

    },
    data() {
        return {
            baseUrl: '',
            percentage: 0
        }
    },
    updated() {
        console.log('eventbus', eventBus)
        // alert(this.percentage);
        //  this.percentage = eventBus.status.percentage;
    },
    mounted() {
        //alert(this.percentage);
        // this.percentage = eventBus.status.percentage;
    },

    methods: {
        // filterUrl(url) {
        //     return this.importUrl + url
        // },
        //
        // format() {
        //
        //     this.percentage = eventBus.status.percentage;
        //     return this.percentage === 100 ? '满' : `${this.percentage}%`;
        // },

        nextTip() {

            console.log('eventbus===>', eventBus)

            if (eventBus.status && eventBus.status.resultFlag) {
                this.$emit('change-status', eventBus.status);
            }

        },
    }
})


// error and success
Vue.component('import-status', {
    template: `<div> 
                 <div class="module-body">
                    <div class="module-file" style="width: 100%">
                        <div class="file-error">
                            <div class="import—error-box" style="padding: 16px 0 0 16px;width: 100%;flex-direction: column;align-items: flex-start">
<!--                                <div class="import—error">-->
<!--                                    <img v-if="status==3" class="img" :src="filterUrl('/statics/images/import/error.png')" alt="下载模板">-->
<!--                                    <img v-if="status==4" class="img" :src="filterUrl('/statics/images/import/success.png')" alt="下载模板">-->
<!--                                </div>-->
<!--                                <div class="import—download-file">-->
<!--                                    <div class="font-size-18 error-title">-->
<!--                                      <span v-if="status==4">导入成功!</span>-->
<!--                                      <span v-if="status==3">导入失败!</span>-->
<!--                                    </div>-->
                                    <div class="font-size-14" style="margin-bottom: 5px" :class="status==3?'error-tip':'success-tip'" v-html="msg"></div>
                                    
                                    <table v-show="status==3" id="errgrid" lay-filter="errgrid"></table>
<!--                                </div>-->
                            </div>
<!--                            <div v-if="status==3">-->
<!--                                <div class="download-btn-error pointer">-->
<!--                                    <img class="download-error" :src="filterUrl('/statics/images/import/download3.png')" alt="下载">-->
<!--                                    <button class="button-error" @click="downloadErrorData">下载导入失败的数据</button>-->
<!--                                </div>-->
<!--                                <p class="font-size-14 err-tip">请按照要求重新修改上传！</p>-->
<!--                            </div>-->

                        </div>
                    </div>
                </div>
                <div class="btn-group" style="display: flex;align-items: center;justify-content: center" v-if="status==3||status==4">
                    <button class="btn cancel-btn" @click="cancelModelData">返回</button>
                    <button v-if="status==3" class="btn cancel-btn" @click="downloadErrorData">下载失败数据</button>
                    <button class="btn next-btn" @click="hrefBussTypeHtml">{{busType}}</button>
                </div>
<!--                <div class="btn-group" v-if="status==4">-->
<!--                    <button class="btn cancel-btn" @click="cancelModelData">继续上传</button>-->
<!--                    <button class="btn next-btn" @click="hrefBussTypeHtml"><div class="font-size-14"  v-html="busType"></div></button>-->
<!--                </div>-->
                </div>`,
    props: {
        importUrl: {
            type: String
        },
        status: {
            type: Number
        },
        currentTab: {
            type: Number,
            default: 0
        },
        currentTabComponent: {
            type: String
        }
    },
    data() {
        return {
            baseUrl: '',
            msg: '',
            numberNo: '',
            busType: '',
            rentType: ''
        }
    },
    watch: {
        importUrl: {
            handler: function (n, o) {
                this.baseUrl = n;
            },
            immediate: true,
        }
    },
    updated() {
        console.log('updated收到了', eventBus)
        this.busType = eventBus.status.busType + moudulesImportParam.resultShow[this.currentTab].enterListPageName;
    },
    mounted() {
        this.msg = eventBus.status.msg;
        console.log('mounted')
        this.busType = eventBus.status.busType + moudulesImportParam.resultShow[this.currentTab].enterListPageName;
        if (this.currentTab == 0) {
            layui.table.render({
                id: "errgrid",
                elem: '#errgrid',
                data: $.parseJSON(eventBus.status.failDatas),
                cols: [[
                    {
                        field: 'rowNum', width: 70, align: "center", title: '行数', templet: function (d) {
                            return isEmpty(d.rowNum);
                        }
                    },
                    {
                        field: 'rowNum', width: 150, align: "center", title: '提示信息', templet: function (d) {
                            return `<span style="color:#fb5463">${isEmpty(d.errorMsg)}</span>`;
                        }
                    },
                    {
                        field: 'carNo', minWidth: 120, title: '车牌号', align: "center", templet: function (d) {
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
                        minWidth: 150,
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
                            return transformTypeByMap(d.sourceType, {1: '直购', 2: '经租', 3: '以租代购', 4: '挂靠车'});
                        }
                    },
                    /*{
                        field: 'gpsStatus', minWidth: 120, title: 'GPS状态', align: "center", templet: function (d) {
                            return isEmpty(d.gpsStatus);
                        }
                    },*/
                    {
                        field: 'deptName', minWidth: 120, title: '车辆归属', align: "center", templet: function (d) {
                            return isEmpty(d.deptName);
                        }
                    },
                    {
                        field: 'depotName', minWidth: 120, title: '车辆所在仓库', align: "center", templet: function (d) {
                            return isEmpty(d.depotName);
                        }
                    },
                    {
                        field: 'remark', minWidth: 120, title: '备注', align: "center", templet: function (d) {
                            return isEmpty(d.remark);
                        }
                    },
                    {field: 'remindMsg', minWidth: 120, title: '提醒事项', align: "center"},
                ]],
                // cellMinWidth: 130,
                page: true,
                loading: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                // height:310,
                done: function (res, curr, count) {
                }
            });
        } else if (this.currentTab == 9) {
            layui.table.render({
                id: "errgrid",
                elem: '#errgrid',
                data: $.parseJSON(eventBus.status.failDatas),
                cols: [[
                    {
                        field: 'rowNum', width: 70, align: "center", title: '行数', templet: function (d) {
                            return isEmpty(d.rowNum);
                        }
                    },
                    {
                        field: 'rowNum', width: 150, align: "center", title: '提示信息', templet: function (d) {
                            return `<span style="color:#fb5463">${isEmpty(d.errorMsg)}</span>`;
                        }
                    },
                    {
                        field: 'driverName', align: "center", title: '司机姓名', templet: function (d) {
                            return isEmpty(d.driverName);
                        }
                    },
                    {
                        field: 'driverNo', align: "center", title: '司机编号', templet: function (d) {
                            return isEmpty(d.driverNo);
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
                    {field: 'settlementDate', align: "center", title: '结算日期'},
                    // {field: 'settlementEndDate', align: "center", title: '结算结束日期'},
                    // {field: 'importTime', align: "center", title: '导入时间'},
                    // {field: 'businessLeader', align: "center", title: '业务负责人'},
                    // {field: 'dataSource', align: "center", title:  '数据来源<i class="layui-icon alone-tips" lay-tips="手动添加是指直接在系统中新增的流水数据，可进行修改和删除；导入数据是指通过Excel(或系统自动导入)的数据，只能删除重新导入，不能修改。"></i>', templet: function (d) {
                    //         return 1==d.dataSource?'数据导入':2==d.dataSource?'手动添加':''
                    //     }},
                    {field: 'remarks', align: "center", title: '备注信息'},
                ]],
                // cellMinWidth: 130,
                page: true,
                loading: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                // height:310,
                done: function (res, curr, count) {
                }
            });
        } else if (this.currentTab == 10) {
            layui.table.render({
                id: "errgrid",
                elem: '#errgrid',
                data: $.parseJSON(eventBus.status.failDatas),
                cols: [[
                    {
                        field: 'rowNum', width: 70, align: "center", title: '行数', templet: function (d) {
                            return isEmpty(d.rowNum);
                        }
                    },
                    {
                        field: 'rowNum', width: 150, align: "center", title: '提示信息', templet: function (d) {
                            return `<span style="color:#fb5463">${isEmpty(d.errorMsg)}</span>`;
                        }
                    },
                    {
                        field: 'driverName', align: "center", title: '司机姓名', templet: function (d) {
                            return isEmpty(d.driverName);
                        }
                    },
                    {
                        field: 'driverNo', align: "center", title: '司机编号', templet: function (d) {
                            return isEmpty(d.driverNo);
                        }
                    },
                    {
                        field: 'driverTel', align: "center", title: '联系电话', templet: function (d) {
                            return isEmpty(d.driverTel);
                        }
                    },
                    {
                        field: 'carNo', align: "center", title: '车牌号', templet: function (d) {
                            return isEmpty(d.carNo);
                        }
                    },

                    // {
                    //     field: 'timeDelivery', align: "center", title: '交车日期', templet: function (d) {
                    //         return isEmpty(d.timeDelivery);
                    //     }
                    // },
                    {
                        field: 'timeStart', align: "center", title: '结算开始日期', templet: function (d) {
                            return isEmpty(d.timeStart);
                        }
                    },
                    {
                        field: 'timeFinish', align: "center", title: '结算结束日期', templet: function (d) {
                            return isEmpty(d.timeFinish);
                        }
                    },
                    // {
                    //     field: 'settlementDays', align: "center", title: '结算天数', templet: function (d) {
                    //         return isEmpty(d.settlementDays);
                    //     }
                    // },
                    {
                        field: 'flowAmount', align: "center", title: '流水额(元)',
                        templet: function (d) {
                            return isEmpty(d.flowAmount);
                        }
                        // templet:'#CompareQuantity',//模板id的DOM
                        // templet: function (d) {
                        //     return `<div><a href="javascript:void(0);" style="color: #3FACB3" lay-event="pro-view" class="layui-font-blue">${isEmpty(d.flowAmount)}</div>`
                        // }
                    },
                    {
                        field: 'rewardAmount', align: "center", title: '奖励(元)',
                        templet: function (d) {
                            return isEmpty(d.rewardAmount);
                        }

                        // templet: function (d) {
                        //     return `<div><a href="javascript:void(0);" style="color: #3FACB3" lay-event="pro-view" class="layui-font-blue">${isEmpty(d.rewardAmount)}</div>`
                        // }
                    },
                    // {
                    //     field: 'monthlyComplianceRate', align: "center", title: '当月达标率(%)', templet: function (d) {
                    //         return isEmpty(d.monthlyComplianceRate);
                    //     }
                    // },
                    // {
                    //     field: 'rentAmount', align: "center", title: '应扣使用费(元)', templet: function (d) {
                    //         return isEmpty(d.rentAmount);
                    //     }
                    // },
                    // {
                    //     field: 'prepaidAmount', align: "center", title: '预支(元)', templet: function (d) {
                    //         return isEmpty(d.prepaidAmount);
                    //     }
                    // },
                    // {
                    //     field: 'cashDepositAmount', align: "center", title: '应扣保证金(元)', templet: function (d) {
                    //         return isEmpty(d.cashDepositAmount);
                    //     }
                    // },
                    // {
                    //     field: 'otherAmount', align: "center", title: '其他扣款',
                    //     templet: function (d) {
                    //         return isEmpty(d.otherAmount);
                    //     }
                    //     // templet: function (d) {
                    //     //     return `<div><a href="javascript:void(0);" style="color: #3FACB3" lay-event="other-view" class="layui-font-blue">${isEmpty(d.otherAmount)}</div>`
                    //     // }
                    // },
                    // {
                    //     field: 'forwardAmount', align: "center", title: '上期余额', templet: function (d) {
                    //         return isEmpty(d.forwardAmount);
                    //     }
                    // },
                    // {
                    //     field: 'correctionAmount', align: "center", title: '矫正额(元)', templet: function (d) {
                    //         return isEmpty(d.correctionAmount);
                    //     }
                    // },
                    // {
                    //     field: 'correctionExplain', align: "center", title: '矫正说明', templet: function (d) {
                    //         return isEmpty(d.correctionExplain);
                    //     }
                    // },
                    // {
                    //     field: 'accountPayable', align: "center", title: '应付薪资(元)', templet: function (d) {
                    //         return isEmpty(d.accountPayable);
                    //     }
                    // },
                    // {
                    //     field: 'paid', align: "center", title: '已发放(元)', templet: function (d) {
                    //         return isEmpty(d.paid);
                    //     }
                    // },
                    // {
                    //     field: 'paidStatus', align: "center", title: '发放状态', templet: function (d) {
                    //         // return transformTypeByMap(d.paidStatus,vm.paidStatusList);
                    //         return transformTypeByMap(d.paidStatus,{0:'未发放', 1:'全额发放',2:'部分发放'});
                    //     }
                    // },
                    // {
                    //     field: 'createTime', minWidth:180,align: "center", title: '薪资生成时间', templet: function (d) {
                    //         return isEmpty(d.createTime);
                    //     }
                    // },
                    // {
                    //     field: 'businessLeader', align: "center", title: '订单负责人', templet: function (d) {
                    //         return isEmpty(d.businessLeader);
                    //     }
                    // },
                    // {
                    //     field: 'bankAccount',minWidth:180, align: "center", title: '银行账号', templet: function (d) {
                    //         return isEmpty(d.bankAccount);
                    //     }
                    // },
                    // {
                    //     field: 'affiliatedBank',minWidth:180, align: "center", title: '所属银行', templet: function (d) {
                    //         return isEmpty(d.affiliatedBank);
                    //     }
                    // },
                    // {
                    //     field: 'openingBank',minWidth:180, align: "center", title: '开户行', templet: function (d) {
                    //         return isEmpty(d.openingBank);
                    //     }
                    // },
                ]],
                cellMinWidth: 100,
                page: true,
                loading: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                // height:310,
                done: function (res, curr, count) {
                }
            });
        } else {

            // 都走上面公共统一配置入口
            layui.table.render({
                id: "errgrid",
                elem: '#errgrid',
                data: $.parseJSON(eventBus.status.failDatas),
                cols: moudulesImportParam.resultShow[this.currentTab].cols,
                // cellMinWidth: 130,
                page: true,
                loading: true,
                limits: [10, 20, 50, 100],
                limit: 10,
                // height:310,
                done: function (res, curr, count) {
                }
            });
        }

        layui.table.reload('errgrid', {
            data: $.parseJSON(eventBus.status.failDatas)
        });
    },
    activated() {
        this.msg = eventBus.status.msg;
        console.log('activated', this.msg)
    },

    methods: {
        filterUrl(url) {
            return this.baseUrl + url;
        },

        // 取消、继续上传和重新上传回到初始界面
        cancelModelData() {
            let _self = this;
            let objDo = {
                status: 1,
                currentTab: _self.currentTab,
                currentTabComponent: 'import-download'
            }

            layui.table.reload()

            _self.$emit('change-status', objDo);
        },

        // 上传成功进入模块列表
        hrefBussTypeHtml() {
            console.log(this.currentTab);

            parent.layer.closeAll();
            parent.vm && parent.vm.reload();

            // if(this.currentTab == 3){// 保险
            //     window.location.href = tabBaseURL + 'modules/maintenance/insurancemanage.html';
            // } else if(this.currentTab == 0){// 车辆
            //     window.location.href = tabBaseURL + 'modules/car/tcarbasic.html';
            // } else if(this.currentTab == 1){// 车辆订单错
            //     window.location.href = tabBaseURL + 'modules/order/orderlistnew.html';
            // } else if(this.currentTab == 2){ // 客户
            //     window.location.href = tabBaseURL + 'modules/customer/customerlist.html';
            // } else if(this.currentTab == 4){ // 年检
            //     window.location.href = tabBaseURL + 'modules/maintenance/inspectionmanage.html';
            // } else if(this.currentTab == 5){ // 保养
            //     window.location.href = tabBaseURL + 'modules/maintenance/maintenancemanage.html';
            // } else if(this.currentTab == 6){ // 出险
            //     window.location.href = tabBaseURL + 'modules/outinsuranceorder/outinsuranceorder.html';
            // } else if(this.currentTab == 7){ // 维修
            //     window.location.href = tabBaseURL + 'modules/carrepairorder/carrepairorder.html';
            // }
        },

        // 下载错误日志
        downloadErrorData() {
            this.numberNo = eventBus.status.numberNo;
            this.rentType = eventBus.status.rentType;
            console.log(this.currentTab, '---', this.numberNo);
            if (this.currentTab == 3) {// 保险错误数据下载
                window.location.href = baseURL + 'maintenance/insurancemanage/exportExcel?numberNo=' + this.numberNo;
            } else if (this.currentTab == 0) {// 车辆错误数据下载
                window.location.href = baseURL + 'car/tcarbasic/exportresouresExcel?numberNo=' + this.numberNo;
                // window.location.href = baseURL + 'common/exportImportErrorExcel?numberNo=' + this.numberNo;
            } else if (this.currentTab == 1) {// 车辆订单错误数据下载

                window.location.href = baseURL + 'order/order/downxlserr?numberNo=' + this.numberNo + "&rentType=" + this.rentType;
            } else if (this.currentTab == 2) { // 客户错误数据下载
                var exportUrl;
                if (eventBus.status.customerType == 1) {
                    exportUrl = 'customer/exportQyExcel?numberNo=';
                } else {
                    exportUrl = 'customer/exportGrExcel?numberNo=';
                }
                window.location.href = baseURL + exportUrl + this.numberNo;
            } else if (this.currentTab >= 4) { // 年检错误数据下载
                window.location.href = moudulesImportParam.downloadErrorDataUrl[this.currentTab] + this.numberNo;
            }
        }
    }
})


// 拖拽上传图片
Vue.component('import-upload', {
    template: `<div class="module-main" >
                  <div class="module-body">
                    <div class="module-file">
                        <div>
                            <el-upload drag
                                       class="upload-demo"
                                       ref='upload'
                                       action="#"
                                       :before-upload="beforeUpload"
                                       :on-success="upSuccess"
                                       :on-error="upError"
                                       :on-remove="handleRemove"
                                       :on-change="upChange"
                                       multiple
                                       :on-exceed="handleExceed"
                                       :auto-upload="false"
                                       :file-list="fileList">
                                <div class="upload-file">
                                    <img class="uploading-icon" :src="filterUrl('/statics/images/import/uploading3.png')" alt="上传">
                                    <p class="font-size-14 zip-tip">可点击或拖拽ZIP文件到此处上传文件</p>
                                </div>
                            </el-upload>
                            <div class="reminder-box">
                                <img class="tip-icon" :src="filterUrl('/statics/images/import/tip.png')" alt="提示">
                                <span>如何创建图片压缩包</span>
                                <div class="reminder-tab">
                                    <div class="reminder-tip-item">
                                        <img class="reminder-tip-icon" :src="filterUrl('/statics/images/import/tip2.png')" alt="">
                                        <p>P58764561.JPG</p>
                                        <p>图片命名必须是以车架号命名</p>
                                    </div>
                                    <div class="reminder-tip-item">
                                        <img :src="filterUrl('/statics/images/import/tip3.png')" alt="">
                                        <p>cl_xsz</p>
                                        <p>文件夹以车辆行驶证拼音简写命名</p>
                                    </div>
                                    <div class="reminder-tip-item">
                                        <img :src="filterUrl('/statics/images/import/tip4.png')" alt="">
                                        <p>cl_xsz.zip</p>
                                        <p>压缩包以车辆行驶证拼音简写命名</p>
                                    </div>
                                </div>
                                <div class="reminder-tip-text">
                                    <p>注意事项：<br>
                                        1.本次上传行驶证图片，如车辆已有行驶证图片，则已有行驶证图片全部清除，以本次上传的图片为准； <br>
                                        2.每台车最多只能上传一张行驶证，图片格式仅支持JPG/JPEG/BMP/PNG格式；<br>
                                        3.将文件夹压缩ZIP格式上传图片,压缩文件以车辆行驶证拼音简写命名（比如cl_xsz、clxsz，不分大小写）； <br>
                                        4.单张图片不得大于30M,大于30M上传后，不会显示该图片； <br>
                                        5.支持一次性上传多个压缩文件，并且每个压缩文件大小不能超过500M.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               <!-- <div class="btn-group">
                    <button class="btn cancel-btn">取消</button>
                </div>-->
              </div>`,
    props: {
        importUrl: {
            type: String
        },
        status: {
            type: Number
        }
    },
    data() {
        return {
            baseUrl: '',
            fileList: [
                /* {
                 name: 'food.jpeg',
                 url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                 }, {
                 name: 'food2.jpeg',
                 url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                 }*/
            ]

        }
    },
    watch: {
        importUrl: {
            handler: function (n, o) {
                this.baseUrl = n;
            },
            immediate: true
        }
    },
    mounted() {

    },

    methods: {

        //上传之前
        beforeUpload(file) {
            console.log(file);
            const fileSuffix = file.name.substring(
                file.name.lastIndexOf('.') + 1
            );
            const whiteList = ['zip'];
            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$message({
                    type: 'error',
                    message: '上传文件只能是 zip 格式',
                    showClose: true,
                    offset: 80,
                });
                this.fileList = [];
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 500;
            if (!isLt2M) {
                this.$message({
                    type: 'error',
                    message: '上传文件不能超过500M',
                    showClose: true,
                    offset: 80,
                });
                return false;
            }
            return true;
        },
        // 上传成功
        upSuccess(res) {
            /*this.$message({
                type: 'success',
                message: '上传成功',
                showClose: true,
                offset: 80,
            })*/
        },
        // 上传失败
        upError() {
            /*this.$message({
                type: 'error',
                message: '上传失败',
                showClose: true,
                offset: 80,
            });*/
        },

        //上传的文件改变时（覆盖原来的文件）
        upChange(file, fileList) {
            let _self = this;
            var flag = this.beforeUpload(file);
            if (flag) {
                console.log("上传车辆行驶证压缩包：" + file, fileList);
                var formData = new FormData();
                formData.append("files", file.raw);
                formData.append("path", 'carDriverImage');
                $.ajax({
                    type: "POST",
                    url: baseURL + '/file/uploadZipFileTwo',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (r) {
                        if (r.code == 0) {
                            /* _self.fileList = [{
                                 name: 'food.jpeg',
                                 url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                             }]*/
                            layer.msg('上传成功！');
                        } else {
                            /* _self.fileList = [{
                                 name: 'food.jpeg',
                                 url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                             }]*/
                            layer.msg('上传失败！' + r.msg);
                        }
                    },
                    error: function (err) {
                        console.log(err)
                        layer.msg('上传失败', {icon: 5});
                    }
                });
            }
        },
        handleRemove(file) {
            console.log(file);
            console.log(file);
        },
        handleExceed() {

        },
        filterUrl(url) {
            return this.baseUrl + url;
        }
    }
})
//获得年月日      得到日期oTime
function getMyDate(str){
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);//最后拼接时间
    return oTime;
};
//补0操作
function getzf(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
